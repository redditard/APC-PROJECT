package com.tourism.core.service;

import com.tourism.common.dto.request.BookingRequestDTO;
import com.tourism.common.dto.request.BookingUpdateRequest;
import com.tourism.common.dto.response.BookingResponseDTO;
import com.tourism.common.enums.BookingStatus;
import com.tourism.common.enums.PaymentStatus;
import com.tourism.core.entity.Booking;
import com.tourism.core.entity.Package;
import com.tourism.core.entity.User;
import com.tourism.core.exception.BusinessLogicException;
import com.tourism.core.exception.ResourceNotFoundException;
import com.tourism.core.mapper.BookingMapper;
import com.tourism.core.repository.BookingRepository;
import com.tourism.core.repository.PackageRepository;
import com.tourism.core.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final PackageRepository packageRepository;
    private final UserRepository userRepository;
    private final BookingMapper bookingMapper;
    private final BookingHistoryService bookingHistoryService;
    
    public BookingService(BookingRepository bookingRepository,
                         PackageRepository packageRepository,
                         UserRepository userRepository,
                         BookingMapper bookingMapper,
                         BookingHistoryService bookingHistoryService) {
        this.bookingRepository = bookingRepository;
        this.packageRepository = packageRepository;
        this.userRepository = userRepository;
        this.bookingMapper = bookingMapper;
        this.bookingHistoryService = bookingHistoryService;
    }
    
    /**
     * Create a new booking
     */
    public BookingResponseDTO createBooking(BookingRequestDTO request) {
        // Use reflection to access DTO fields due to compilation issues
        Long packageId = getPackageIdFromRequest(request);
        Long customerId = getCustomerIdFromRequest(request);
        Integer numberOfAdults = getNumberOfAdultsFromRequest(request);
        Integer numberOfChildren = getNumberOfChildrenFromRequest(request);
        
        // Validate package exists and is available
        Package tourPackage = packageRepository.findById(packageId)
                .orElseThrow(() -> new ResourceNotFoundException("Package not found with id: " + packageId));
        
        // Validate customer exists
        User tourist = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));
        
        // Check availability
        int totalPeople = numberOfAdults + numberOfChildren;
        if (!checkAvailability(packageId, totalPeople)) {
            throw new BusinessLogicException("Package does not have enough capacity for " + totalPeople + " people");
        }
        
        // Create booking entity manually
        Booking booking = new Booking();
        booking.setBookingReference(generateBookingReference());
        booking.setPackageId(packageId);
        booking.setTouristId(customerId);
        booking.setNumberOfPeople(totalPeople);
        booking.setTotalAmount(calculateTotalPrice(packageId, totalPeople));
        booking.setStatus(BookingStatus.PENDING);
        booking.setPaymentStatus(PaymentStatus.PENDING);
        booking.setTourPackage(tourPackage);
        booking.setTourist(tourist);
        
        // Save booking
        Booking savedBooking = bookingRepository.save(booking);
        
        // Record in booking history
        bookingHistoryService.recordBookingHistory(savedBooking, tourPackage, tourist);
        
        return bookingMapper.toResponseDTO(savedBooking);
    }

    /**
     * Accept a loose map payload (from controller) and construct a BookingRequestDTO via reflection.
     * This avoids compile-time coupling to a specific DTO shape in cases where modules differ.
     */
    public BookingResponseDTO createBookingFromMap(java.util.Map<String, Object> payload, Long authenticatedCustomerId) {
        // Build canonical BookingRequestDTO directly to avoid reflection pitfalls
        try {
            BookingRequestDTO dto = new BookingRequestDTO();

            // helper: parse Long from various numeric types or string
            java.util.function.Function<Object, Long> toLong = (v) -> {
                if (v == null) return null;
                if (v instanceof Number) return ((Number) v).longValue();
                if (v instanceof String) {
                    try { return Long.parseLong(((String) v).trim()); } catch (Exception ex) { return null; }
                }
                return null;
            };

            // helper: parse Integer
            java.util.function.Function<Object, Integer> toInteger = (v) -> {
                if (v == null) return null;
                if (v instanceof Number) return ((Number) v).intValue();
                if (v instanceof String) {
                    try { return Integer.parseInt(((String) v).trim()); } catch (Exception ex) { return null; }
                }
                return null;
            };

            // packageId (accept packageId or package_id)
            Long packageId = toLong.apply(payload.get("packageId"));
            if (packageId == null) packageId = toLong.apply(payload.get("package_id"));
            if (packageId != null) dto.setPackageId(packageId);

            // customerId (or touristId)
            Long customerId = toLong.apply(payload.get("customerId"));
            if (customerId == null) customerId = toLong.apply(payload.get("touristId"));
            if (customerId == null) customerId = toLong.apply(payload.get("customer_id"));
            if (customerId == null && authenticatedCustomerId != null) customerId = authenticatedCustomerId;
            if (customerId != null) dto.setCustomerId(customerId);

            // bookingDate
            Object bd = payload.get("bookingDate");
            if (bd == null) bd = payload.get("date");
            if (bd instanceof String) {
                try {
                    dto.setBookingDate(java.time.LocalDate.parse((String) bd));
                } catch (Exception ignored) {
                }
            }

            // numberOfPeople -> numberOfAdults
            Integer numPeople = toInteger.apply(payload.get("numberOfPeople"));
            if (numPeople == null) numPeople = toInteger.apply(payload.get("number_of_people"));
            if (numPeople != null) dto.setNumberOfAdults(numPeople);

            Integer adults = toInteger.apply(payload.get("numberOfAdults"));
            if (adults != null) dto.setNumberOfAdults(adults);

            Integer children = toInteger.apply(payload.get("numberOfChildren"));
            if (children == null) children = toInteger.apply(payload.get("number_of_children"));
            if (children != null) dto.setNumberOfChildren(children);

            // other optional fields
            Object sr = payload.get("specialRequests");
            if (sr instanceof String) dto.setSpecialRequests((String) sr);
            Object email = payload.get("contactEmail");
            if (email == null) email = payload.get("contact_email");
            if (email instanceof String) dto.setContactEmail((String) email);
            Object phone = payload.get("contactPhone");
            if (phone == null) phone = payload.get("contact_phone");
            if (phone instanceof String) dto.setContactPhone((String) phone);

            // Delegate to existing createBooking (it will validate required fields)
            return createBooking(dto);
        } catch (Exception e) {
            throw new RuntimeException("Failed to build BookingRequestDTO from payload: " + e.getMessage(), e);
        }
    }
    
    /**
     * Get booking by ID
     */
    @Transactional(readOnly = true)
    public BookingResponseDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        
        return bookingMapper.toResponseDTO(booking);
    }
    
    /**
     * Get all bookings with pagination
     */
    @Transactional(readOnly = true)
    public Page<BookingResponseDTO> getAllBookings(Pageable pageable) {
        Page<Booking> bookings = bookingRepository.findAll(pageable);
        List<BookingResponseDTO> responseDTOs = bookings.getContent().stream()
                .map(bookingMapper::toResponseDTO)
                .collect(Collectors.toList());
        
        return new PageImpl<>(responseDTOs, pageable, bookings.getTotalElements());
    }
    
    /**
     * Update booking
     */
    public BookingResponseDTO updateBooking(Long id, BookingUpdateRequest request) {
        Booking existingBooking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        
        // Validate package if changed
        if (request.getPackageId() != null && !request.getPackageId().equals(existingBooking.getPackageId())) {
            Package newPackage = packageRepository.findById(request.getPackageId())
                    .orElseThrow(() -> new ResourceNotFoundException("Package not found with id: " + request.getPackageId()));
            existingBooking.setTourPackage(newPackage);
            existingBooking.setPackageId(request.getPackageId());
        }
        
        // Update fields from request
        if (request.getBookingDate() != null) {
            existingBooking.setBookingDate(LocalDateTime.of(request.getBookingDate(), java.time.LocalTime.MIDNIGHT));
        }
        
        if (request.getNumberOfAdults() != null && request.getNumberOfChildren() != null) {
            int totalPeople = request.getNumberOfAdults() + request.getNumberOfChildren();
            existingBooking.setNumberOfPeople(totalPeople);
            
            // Recalculate total amount
            existingBooking.setTotalAmount(calculateTotalPrice(existingBooking.getPackageId(), totalPeople));
        }
        
        if (request.getBookingStatus() != null) {
            existingBooking.setStatus(request.getBookingStatus());
        }
        
        if (request.getPaymentStatus() != null) {
            existingBooking.setPaymentStatus(request.getPaymentStatus());
        }
        
        Booking updatedBooking = bookingRepository.save(existingBooking);
        
        return bookingMapper.toResponseDTO(updatedBooking);
    }
    
    /**
     * Delete booking
     */
    public void deleteBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        
        bookingRepository.delete(booking);
    }
    
    /**
     * Get bookings by customer with pagination
     */
    @Transactional(readOnly = true)
    public Page<BookingResponseDTO> getBookingsByCustomer(Long customerId, Pageable pageable) {
        List<Booking> bookings = bookingRepository.findByTouristIdOrderByBookingDateDesc(customerId);
        List<BookingResponseDTO> responseDTOs = bookings.stream()
                .map(bookingMapper::toResponseDTO)
                .collect(Collectors.toList());
        
        // Manual pagination
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), responseDTOs.size());
        
        if (start > responseDTOs.size()) {
            return new PageImpl<>(List.of(), pageable, responseDTOs.size());
        }
        
        return new PageImpl<>(responseDTOs.subList(start, end), pageable, responseDTOs.size());
    }
    
    /**
     * Get bookings by package with pagination
     */
    @Transactional(readOnly = true)
    public Page<BookingResponseDTO> getBookingsByPackage(Long packageId, Pageable pageable) {
        List<Booking> bookings = bookingRepository.findByPackageId(packageId);
        List<BookingResponseDTO> responseDTOs = bookings.stream()
                .map(bookingMapper::toResponseDTO)
                .collect(Collectors.toList());
        
        // Manual pagination
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), responseDTOs.size());
        
        if (start > responseDTOs.size()) {
            return new PageImpl<>(List.of(), pageable, responseDTOs.size());
        }
        
        return new PageImpl<>(responseDTOs.subList(start, end), pageable, responseDTOs.size());
    }
    
    /**
     * Get bookings by status with pagination
     */
    @Transactional(readOnly = true)
    public Page<BookingResponseDTO> getBookingsByStatus(BookingStatus status, Pageable pageable) {
        List<Booking> bookings = bookingRepository.findByStatus(status);
        List<BookingResponseDTO> responseDTOs = bookings.stream()
                .map(bookingMapper::toResponseDTO)
                .collect(Collectors.toList());
        
        // Manual pagination
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), responseDTOs.size());
        
        if (start > responseDTOs.size()) {
            return new PageImpl<>(List.of(), pageable, responseDTOs.size());
        }
        
        return new PageImpl<>(responseDTOs.subList(start, end), pageable, responseDTOs.size());
    }
    
    /**
     * Confirm a booking with payment details
     */
    public BookingResponseDTO confirmBooking(Long bookingId, String paymentReference) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BusinessLogicException("Only pending bookings can be confirmed");
        }
        
        // Update booking status
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setPaymentStatus(PaymentStatus.COMPLETED);
        
        Booking savedBooking = bookingRepository.save(booking);
        
        // Update booking history
        bookingHistoryService.updateBookingStatus(
            booking.getBookingReference(), 
            BookingStatus.CONFIRMED.name(), 
            "Booking confirmed with payment reference: " + paymentReference
        );
        
        return bookingMapper.toResponseDTO(savedBooking);
    }
    
    /**
     * Cancel a booking
     */
    public BookingResponseDTO cancelBooking(Long bookingId, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BusinessLogicException("Booking is already cancelled");
        }
        
        // Update booking status
        booking.setStatus(BookingStatus.CANCELLED);
        
        // Handle refund if payment was completed
        if (booking.getPaymentStatus() == PaymentStatus.COMPLETED) {
            booking.setPaymentStatus(PaymentStatus.REFUNDED);
        }
        
        Booking savedBooking = bookingRepository.save(booking);
        
        // Update booking history
        bookingHistoryService.updateBookingStatus(
            booking.getBookingReference(), 
            BookingStatus.CANCELLED.name(), 
            "Booking cancelled. Reason: " + reason
        );
        
        return bookingMapper.toResponseDTO(savedBooking);
    }
    
    /**
     * Get booking details by reference
     */
    @Transactional(readOnly = true)
    public Optional<BookingResponseDTO> getBookingByReference(String bookingReference) {
        return bookingRepository.findByBookingReference(bookingReference)
                .map(bookingMapper::toResponseDTO);
    }
    
    /**
     * Check availability for a package
     */
    @Transactional(readOnly = true)
    public boolean checkAvailability(Long packageId, Integer numberOfPeople) {
        Package tourPackage = packageRepository.findById(packageId)
                .orElseThrow(() -> new ResourceNotFoundException("Package not found with id: " + packageId));
        
        // Get total booked people for this package
        Integer totalBookedPeople = bookingRepository.getTotalBookedPeopleByPackageId(packageId);
        if (totalBookedPeople == null) {
            totalBookedPeople = 0;
        }
        
        // Check if there's enough capacity
        Integer maxParticipants = tourPackage.getTour().getMaxParticipants();
        return (totalBookedPeople + numberOfPeople) <= maxParticipants;
    }
    
    /**
     * Calculate total price for booking
     */
    @Transactional(readOnly = true)
    public BigDecimal calculateTotalPrice(Long packageId, Integer numberOfPeople) {
        Package tourPackage = packageRepository.findById(packageId)
                .orElseThrow(() -> new ResourceNotFoundException("Package not found with id: " + packageId));
        
        BigDecimal basePrice = tourPackage.getPrice();
        BigDecimal totalPrice = basePrice.multiply(BigDecimal.valueOf(numberOfPeople));
        
        // Apply any discounts or surcharges here
        totalPrice = applyPricingRules(totalPrice, numberOfPeople, tourPackage);
        
        return totalPrice;
    }
    
    /**
     * Apply pricing rules based on number of people and package type
     */
    private BigDecimal applyPricingRules(BigDecimal basePrice, Integer numberOfPeople, Package tourPackage) {
        BigDecimal finalPrice = basePrice;
        
        // Group discount for 5+ people
        if (numberOfPeople >= 5) {
            finalPrice = finalPrice.multiply(BigDecimal.valueOf(0.9)); // 10% discount
        }
        
        // Family package discount for 2 adults + children
        if (numberOfPeople >= 3) {
            finalPrice = finalPrice.multiply(BigDecimal.valueOf(0.95)); // 5% discount
        }
        
        return finalPrice;
    }
    
    /**
     * Generate unique booking reference
     */
    private String generateBookingReference() {
        return "BK" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    /**
     * Get booking statistics for a tourist
     */
    @Transactional(readOnly = true)
    public long getTouristBookingCount(Long touristId, BookingStatus status) {
        return bookingRepository.countByTouristIdAndStatus(touristId, status);
    }
    
    /**
     * Find and cancel expired pending bookings
     */
    public List<BookingResponseDTO> cancelExpiredPendingBookings(int hoursThreshold) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusHours(hoursThreshold);
        List<Booking> expiredBookings = bookingRepository.findExpiredPendingBookings(cutoffDate);
        
        for (Booking booking : expiredBookings) {
            booking.setStatus(BookingStatus.CANCELLED);
            bookingRepository.save(booking);
            
            // Update booking history
            bookingHistoryService.updateBookingStatus(
                booking.getBookingReference(), 
                BookingStatus.CANCELLED.name(), 
                "Booking automatically cancelled due to payment timeout"
            );
        }
        
        return expiredBookings.stream()
                .map(bookingMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get all bookings with search and filtering
     */
    @Transactional(readOnly = true)
    public Page<BookingResponseDTO> getAllBookings(Pageable pageable, Long customerId, String status, String paymentStatus) {
        BookingStatus bookingStatus = null;
        if (status != null && !status.isEmpty()) {
            try {
                bookingStatus = BookingStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Invalid status, ignore
            }
        }
        
        // Filter by status and customer
        Page<Booking> bookings = bookingRepository.findBookingsWithFilters(bookingStatus, customerId, null, pageable);
        
        List<BookingResponseDTO> responseDTOs;
        
        // Additional filtering by payment status if provided
        PaymentStatus targetPaymentStatus = null;
        if (paymentStatus != null && !paymentStatus.isEmpty()) {
            try {
                targetPaymentStatus = PaymentStatus.valueOf(paymentStatus.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Invalid payment status, ignore
            }
        }
        
        if (targetPaymentStatus != null) {
            List<Booking> filteredList = new ArrayList<>();
            for (Booking booking : bookings.getContent()) {
                if (booking.getPaymentStatus() == targetPaymentStatus) {
                    filteredList.add(booking);
                }
            }
            
            responseDTOs = new ArrayList<>();
            for (Booking booking : filteredList) {
                responseDTOs.add(bookingMapper.toResponseDTO(booking));
            }
            
            return new PageImpl<>(responseDTOs, pageable, filteredList.size());
        }
        
        responseDTOs = new ArrayList<>();
        for (Booking booking : bookings.getContent()) {
            responseDTOs.add(bookingMapper.toResponseDTO(booking));
        }
        
        return new PageImpl<>(responseDTOs, pageable, bookings.getTotalElements());
    }
    
    /**
     * Update booking status
     */
    public BookingResponseDTO updateBookingStatus(Long bookingId, BookingStatus status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        
        booking.setStatus(status);
        Booking updatedBooking = bookingRepository.save(booking);
        
        // Update booking history
        bookingHistoryService.updateBookingStatus(
            booking.getBookingReference(), 
            status.name(), 
            "Booking status updated to: " + status.name()
        );
        
        return bookingMapper.toResponseDTO(updatedBooking);
    }
    
    /**
     * Update payment status
     */
    public BookingResponseDTO updatePaymentStatus(Long bookingId, PaymentStatus paymentStatus) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        
        booking.setPaymentStatus(paymentStatus);
        Booking updatedBooking = bookingRepository.save(booking);
        
        // Update booking history
        bookingHistoryService.updateBookingStatus(
            booking.getBookingReference(), 
            booking.getStatus().name(), 
            "Payment status updated to: " + paymentStatus.name()
        );
        
        return bookingMapper.toResponseDTO(updatedBooking);
    }
    
    /**
     * Get bookings by date range with pagination
     */
    @Transactional(readOnly = true)
    public Page<BookingResponseDTO> getBookingsByDateRange(LocalDate startDate, LocalDate endDate, Pageable pageable) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        Page<Booking> bookings = bookingRepository.findBookingsInDateRange(startDateTime, endDateTime, pageable);
        List<BookingResponseDTO> responseDTOs = bookings.getContent().stream()
                .map(bookingMapper::toResponseDTO)
                .collect(Collectors.toList());
        
        return new PageImpl<>(responseDTOs, pageable, bookings.getTotalElements());
    }
    
    /**
     * Get booking history (returns booking details with history)
     */
    @Transactional(readOnly = true)
    public BookingResponseDTO getBookingHistory(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        
        return bookingMapper.toResponseDTO(booking);
    }
    
    // Utility methods to access DTO fields via reflection due to compilation issues
    private Long getPackageIdFromRequest(BookingRequestDTO request) {
        try {
            java.lang.reflect.Method method = request.getClass().getMethod("getPackageId");
            return (Long) method.invoke(request);
        } catch (Exception e) {
            throw new BusinessLogicException("Unable to access packageId from request");
        }
    }
    
    private Long getCustomerIdFromRequest(BookingRequestDTO request) {
        try {
            java.lang.reflect.Method method = request.getClass().getMethod("getCustomerId");
            return (Long) method.invoke(request);
        } catch (Exception e) {
            throw new BusinessLogicException("Unable to access customerId from request");
        }
    }
    
    private Integer getNumberOfAdultsFromRequest(BookingRequestDTO request) {
        try {
            java.lang.reflect.Method method = request.getClass().getMethod("getNumberOfAdults");
            return (Integer) method.invoke(request);
        } catch (Exception e) {
            throw new BusinessLogicException("Unable to access numberOfAdults from request");
        }
    }
    
    private Integer getNumberOfChildrenFromRequest(BookingRequestDTO request) {
        try {
            java.lang.reflect.Method method = request.getClass().getMethod("getNumberOfChildren");
            return (Integer) method.invoke(request);
        } catch (Exception e) {
            throw new BusinessLogicException("Unable to access numberOfChildren from request");
        }
    }
}
