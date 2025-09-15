package com.tourism.core.controller;

import com.tourism.common.dto.response.ApiResponse;
import com.tourism.common.dto.response.BookingResponseDTO;
import com.tourism.common.dto.response.PagedResponse;
import com.tourism.common.enums.BookingStatus;
import com.tourism.common.enums.PaymentStatus;
import com.tourism.core.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
// removed unused imports
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.tourism.core.security.jwt.UserPrincipal;

@RestController
@RequestMapping("/api/v1/bookings")
@Tag(name = "Booking Management", description = "Operations for managing tour bookings")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @Operation(summary = "Create a new booking", description = "Creates a new tour booking with the provided information")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Booking created successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input data"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Package or customer not found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Package not available for booking")
    })
    public ResponseEntity<ApiResponse<BookingResponseDTO>> createBooking(
            @RequestBody java.util.Map<String, Object> payload) {

        // Map incoming JSON to local variables and construct the canonical DTO using its constructor.
        Long packageId = null;
        Integer numberOfAdults = null;
        Integer numberOfChildren = 0;
        LocalDate bookingDate = null;
        String specialRequests = null;
        String contactEmail = null;
        String contactPhone = null;
        Long customerId = null;

        try {
            if (payload.containsKey("packageId") && payload.get("packageId") != null) {
                Number pkg = (Number) payload.get("packageId");
                packageId = pkg.longValue();
            }

            if (payload.containsKey("numberOfPeople") && payload.get("numberOfPeople") != null) {
                Number num = (Number) payload.get("numberOfPeople");
                numberOfAdults = num.intValue();
            } else if (payload.containsKey("numberOfAdults") && payload.get("numberOfAdults") != null) {
                Number num = (Number) payload.get("numberOfAdults");
                numberOfAdults = num.intValue();
            }

            if (payload.containsKey("numberOfChildren") && payload.get("numberOfChildren") != null) {
                Number num = (Number) payload.get("numberOfChildren");
                numberOfChildren = num.intValue();
            }

            if (payload.containsKey("bookingDate") && payload.get("bookingDate") != null) {
                bookingDate = LocalDate.parse(payload.get("bookingDate").toString());
            }

            if (payload.containsKey("specialRequests")) {
                specialRequests = (String) payload.get("specialRequests");
            }

            if (payload.containsKey("contactEmail")) {
                contactEmail = (String) payload.get("contactEmail");
            }

            if (payload.containsKey("contactPhone")) {
                contactPhone = (String) payload.get("contactPhone");
            }

            if (payload.containsKey("customerId") && payload.get("customerId") != null) {
                Number c = (Number) payload.get("customerId");
                customerId = c.longValue();
            }
        } catch (ClassCastException | java.time.format.DateTimeParseException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid request payload: " + e.getMessage()));
        }

        // If customerId not provided, use authenticated user's id
        if (customerId == null) {
            try {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                if (auth != null && auth.getPrincipal() instanceof UserPrincipal) {
                    UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
                    customerId = principal.getId();
                }
            } catch (Exception ignored) {
            }
        }

        // Delegate to service helper which will construct the DTO via reflection and validate
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long authCustomerId = null;
        if (auth != null && auth.getPrincipal() instanceof UserPrincipal) {
            authCustomerId = ((UserPrincipal) auth.getPrincipal()).getId();
        }

        BookingResponseDTO booking = bookingService.createBookingFromMap(payload, authCustomerId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Booking created successfully", booking));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking by ID", description = "Retrieves a specific booking by its ID")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Booking found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Booking not found")
    })
    public ResponseEntity<ApiResponse<BookingResponseDTO>> getBookingById(
            @Parameter(description = "Booking ID", required = true)
            @PathVariable Long id) {
        
        BookingResponseDTO booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(ApiResponse.success("Booking retrieved successfully", booking));
    }

    @GetMapping
    @Operation(summary = "Get all bookings", description = "Retrieves a paginated list of all bookings with optional filtering")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Bookings retrieved successfully")
    })
    public ResponseEntity<ApiResponse<PagedResponse<BookingResponseDTO>>> getAllBookings(
            @Parameter(description = "Page number (0-based)")
            @RequestParam(defaultValue = "0") int page,
            
            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "10") int size,
            
            @Parameter(description = "Sort field")
            @RequestParam(defaultValue = "bookingDate") String sortBy,
            
            @Parameter(description = "Sort direction")
            @RequestParam(defaultValue = "desc") String sortDir,
            
            @Parameter(description = "Filter by customer ID")
            @RequestParam(required = false) Long customerId,
            
            @Parameter(description = "Filter by booking status")
            @RequestParam(required = false) String status,
            
            @Parameter(description = "Filter by payment status")
            @RequestParam(required = false) String paymentStatus) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<BookingResponseDTO> bookings = bookingService.getAllBookings(
                pageable, customerId, status, paymentStatus);
        PagedResponse<BookingResponseDTO> pagedResponse = PagedResponse.of(
                bookings.getContent(), page, size, bookings.getTotalElements());
        
        return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", pagedResponse));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update booking status", description = "Updates the status of an existing booking")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Booking status updated successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Booking not found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid status transition")
    })
    public ResponseEntity<ApiResponse<BookingResponseDTO>> updateBookingStatus(
            @Parameter(description = "Booking ID", required = true)
            @PathVariable Long id,
            
            @Parameter(description = "New booking status", required = true)
            @RequestParam BookingStatus status) {
        
        BookingResponseDTO booking = bookingService.updateBookingStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Booking status updated successfully", booking));
    }

    @PutMapping("/{id}/payment-status")
    @Operation(summary = "Update payment status", description = "Updates the payment status of an existing booking")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Payment status updated successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Booking not found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid payment status transition")
    })
    public ResponseEntity<ApiResponse<BookingResponseDTO>> updatePaymentStatus(
            @Parameter(description = "Booking ID", required = true)
            @PathVariable Long id,
            
            @Parameter(description = "New payment status", required = true)
            @RequestParam PaymentStatus paymentStatus) {
        
        BookingResponseDTO booking = bookingService.updatePaymentStatus(id, paymentStatus);
        return ResponseEntity.ok(ApiResponse.success("Payment status updated successfully", booking));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Cancel booking", description = "Cancels a booking by its ID")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Booking cancelled successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Booking not found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Booking cannot be cancelled")
    })
    public ResponseEntity<ApiResponse<Void>> cancelBooking(
            @Parameter(description = "Booking ID", required = true)
            @PathVariable Long id) {
        
        bookingService.cancelBooking(id, "Cancelled by user request");
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully"));
    }

    @GetMapping("/customer/{customerId}")
    @Operation(summary = "Get bookings by customer", description = "Retrieves all bookings for a specific customer")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Bookings retrieved successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Customer not found")
    })
    public ResponseEntity<ApiResponse<PagedResponse<BookingResponseDTO>>> getBookingsByCustomer(
            @Parameter(description = "Customer ID", required = true)
            @PathVariable Long customerId,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "bookingDate") String sortBy,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<BookingResponseDTO> bookings = bookingService.getBookingsByCustomer(customerId, pageable);
        PagedResponse<BookingResponseDTO> pagedResponse = PagedResponse.of(
                bookings.getContent(), page, size, bookings.getTotalElements());
        
        return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", pagedResponse));
    }

    @GetMapping("/{id}/history")
    @Operation(summary = "Get booking history", description = "Retrieves the history of changes for a specific booking")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Booking history retrieved successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Booking not found")
    })
    public ResponseEntity<ApiResponse<Object>> getBookingHistory(
            @Parameter(description = "Booking ID", required = true)
            @PathVariable Long id) {
        
        Object history = bookingService.getBookingHistory(id);
        return ResponseEntity.ok(ApiResponse.success("Booking history retrieved successfully", history));
    }

    @PostMapping("/{id}/confirm")
    @Operation(summary = "Confirm booking", description = "Confirms a pending booking")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Booking confirmed successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Booking not found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Booking cannot be confirmed")
    })
    public ResponseEntity<ApiResponse<BookingResponseDTO>> confirmBooking(
            @Parameter(description = "Booking ID", required = true)
            @PathVariable Long id) {
        
        BookingResponseDTO booking = bookingService.confirmBooking(id, "Confirmed by admin");
        return ResponseEntity.ok(ApiResponse.success("Booking confirmed successfully", booking));
    }
}
