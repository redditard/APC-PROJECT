package com.tourism.core.service;

import com.tourism.core.document.BookingHistory;
import com.tourism.core.entity.Booking;
import com.tourism.core.entity.Package;
import com.tourism.core.entity.User;
import com.tourism.core.repository.BookingHistoryRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class BookingHistoryService {

    private final BookingHistoryRepository bookingHistoryRepository;

    public BookingHistoryService(Optional<BookingHistoryRepository> bookingHistoryRepository) {
        this.bookingHistoryRepository = bookingHistoryRepository.orElse(null);
    }

    /**
     * Record booking history asynchronously
     */
    @Async
    public void recordBookingHistory(Booking booking, Package tourPackage, User tourist) {
        if (bookingHistoryRepository == null) return; // Mongo not configured/running

        BookingHistory history = new BookingHistory();
        history.setBookingReference(booking.getBookingReference());
        history.setTouristId(booking.getTouristId());

        // Store tour details
        Map<String, Object> tourDetails = new HashMap<>();
        if (tourPackage.getTour() != null) {
            tourDetails.put("tourId", tourPackage.getTour().getId());
            tourDetails.put("tourName", tourPackage.getTour().getName());
            tourDetails.put("destination", tourPackage.getTour().getDestination());
            tourDetails.put("duration", tourPackage.getTour().getDuration());
            tourDetails.put("startDate", tourPackage.getTour().getStartDate().toString());
            tourDetails.put("endDate", tourPackage.getTour().getEndDate().toString());
        }
        history.setTourDetails(tourDetails);

        // Store package details
        Map<String, Object> packageDetails = new HashMap<>();
        packageDetails.put("packageId", tourPackage.getId());
        packageDetails.put("packageName", tourPackage.getPackageName());
        packageDetails.put("price", tourPackage.getPrice().toString());
        packageDetails.put("accommodationType", tourPackage.getAccommodationType());
        packageDetails.put("transportMode", tourPackage.getTransportMode());
        packageDetails.put("mealPlan", tourPackage.getMealPlan());
        packageDetails.put("inclusions", tourPackage.getInclusions());
        packageDetails.put("exclusions", tourPackage.getExclusions());
        history.setPackageDetails(packageDetails);

        // Add initial timeline entry
        history.addTimelineEntry(
            booking.getStatus().name(),
            "Booking created for " + booking.getNumberOfPeople() + " people"
        );

        // Store tourist details in the first payment history entry
        Map<String, Object> initialPayment = new HashMap<>();
        initialPayment.put("status", booking.getPaymentStatus().name());
        initialPayment.put("amount", booking.getTotalAmount().toString());
        initialPayment.put("timestamp", LocalDateTime.now().toString());
        initialPayment.put("touristName", tourist.getFullName());
        initialPayment.put("touristEmail", tourist.getEmail());
        history.getPaymentHistory().add(initialPayment);

        bookingHistoryRepository.save(history);
    }

    /**
     * Update booking status in history
     */
    @Async
    public void updateBookingStatus(String bookingReference, String status, String remarks) {
        if (bookingHistoryRepository == null) return;

        Optional<BookingHistory> historyOpt = bookingHistoryRepository.findByBookingReference(bookingReference);
        if (historyOpt.isPresent()) {
            BookingHistory history = historyOpt.get();
            history.addTimelineEntry(status, remarks);
            history.setUpdatedAt(LocalDateTime.now());
            bookingHistoryRepository.save(history);
        }
    }

    /**
     * Get booking timeline
     */
    public Optional<BookingHistory> getBookingTimeline(String bookingReference) {
        if (bookingHistoryRepository == null) return Optional.empty();
        return bookingHistoryRepository.findByBookingReference(bookingReference);
    }

    /**
     * Get complete booking history for a tourist
     */
    public List<BookingHistory> getCompleteBookingHistory(Long touristId) {
        if (bookingHistoryRepository == null) return List.of();
        return bookingHistoryRepository.findByTouristIdOrderByCreatedAtDesc(touristId);
    }

    /**
     * Generate booking report for date range
     */
    public List<BookingHistory> generateBookingReport(LocalDateTime fromDate, LocalDateTime toDate) {
        if (bookingHistoryRepository == null) return List.of();
        return bookingHistoryRepository.findByDateRange(fromDate, toDate);
    }

    /**
     * Get booking history by destination
     */
    public List<BookingHistory> getBookingHistoryByDestination(String destination) {
        if (bookingHistoryRepository == null) return List.of();
        return bookingHistoryRepository.findByDestination(destination);
    }

    /**
     * Get bookings by status from history
     */
    public List<BookingHistory> getBookingHistoryByStatus(String status) {
        if (bookingHistoryRepository == null) return List.of();
        return bookingHistoryRepository.findByTimelineStatus(status);
    }

    /**
     * Get tourist booking statistics
     */
    public Map<String, Object> getTouristBookingStatistics(Long touristId) {
        if (bookingHistoryRepository == null) return new HashMap<>();
        List<BookingHistory> history = bookingHistoryRepository.findByTouristId(touristId);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBookings", history.size());

        // Count bookings by status
        Map<String, Long> statusCount = new HashMap<>();
        history.forEach(h -> {
            if (!h.getBookingTimeline().isEmpty()) {
                String latestStatus = h.getBookingTimeline().get(h.getBookingTimeline().size() - 1).getStatus();
                statusCount.merge(latestStatus, 1L, Long::sum);
            }
        });
        stats.put("statusDistribution", statusCount);

        // Calculate total spent
        double totalSpent = history.stream()
            .flatMap(h -> h.getPaymentHistory().stream())
            .filter(p -> "COMPLETED".equals(p.get("status")))
            .mapToDouble(p -> Double.parseDouble(p.get("amount").toString()))
            .sum();
        stats.put("totalSpent", totalSpent);

        // Popular destinations
        Map<String, Long> destinationCount = new HashMap<>();
        history.forEach(h -> {
            if (h.getTourDetails() != null && h.getTourDetails().containsKey("destination")) {
                String destination = (String) h.getTourDetails().get("destination");
                destinationCount.merge(destination, 1L, Long::sum);
            }
        });
        stats.put("popularDestinations", destinationCount);

        return stats;
    }

    /**
     * Add payment entry to booking history
     */
    @Async
    public void addPaymentEntry(String bookingReference, String paymentStatus,
                               String amount, String paymentReference) {
        if (bookingHistoryRepository == null) return;

        Optional<BookingHistory> historyOpt = bookingHistoryRepository.findByBookingReference(bookingReference);
        if (historyOpt.isPresent()) {
            BookingHistory history = historyOpt.get();

            Map<String, Object> paymentEntry = new HashMap<>();
            paymentEntry.put("status", paymentStatus);
            paymentEntry.put("amount", amount);
            paymentEntry.put("paymentReference", paymentReference);
            paymentEntry.put("timestamp", LocalDateTime.now().toString());

            history.getPaymentHistory().add(paymentEntry);
            history.setUpdatedAt(LocalDateTime.now());

            bookingHistoryRepository.save(history);
        }
    }

    /**
     * Data migration utility: sync from SQL to MongoDB
     */
    public void syncBookingData(Booking booking, Package tourPackage, User tourist) {
        if (bookingHistoryRepository == null) return;

        Optional<BookingHistory> existing = bookingHistoryRepository.findByBookingReference(booking.getBookingReference());
        if (existing.isEmpty()) {
            recordBookingHistory(booking, tourPackage, tourist);
        }
    }
}
