package com.tourism.common.dto.request;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public class BookingRequestDTO {
    
    @NotNull(message = "Package ID is required")
    @Positive(message = "Package ID must be positive")
    private Long packageId;
    
    @NotNull(message = "Customer ID is required")
    @Positive(message = "Customer ID must be positive") 
    private Long customerId;
    
    @NotNull(message = "Booking date is required")
    @FutureOrPresent(message = "Booking date cannot be in the past")
    private LocalDate bookingDate;
    
    @Min(value = 1, message = "Number of adults must be at least 1")
    @Max(value = 50, message = "Number of adults cannot exceed 50")
    private int numberOfAdults;
    
    @Min(value = 0, message = "Number of children cannot be negative")
    @Max(value = 30, message = "Number of children cannot exceed 30")
    private int numberOfChildren = 0;
    
    @Size(max = 1000, message = "Special requests cannot exceed 1000 characters")
    private String specialRequests;
    
    @NotBlank(message = "Contact email is required")
    @Email(message = "Please provide a valid email address")
    private String contactEmail;
    
    @NotBlank(message = "Contact phone is required")
    @Pattern(regexp = "^[+]?[0-9\\s\\-()]{7,15}$", message = "Please provide a valid phone number")
    private String contactPhone;
    
    // Constructors
    public BookingRequestDTO() {}
    
    public BookingRequestDTO(Long packageId, Long customerId, LocalDate bookingDate,
                           int numberOfAdults, int numberOfChildren, String specialRequests,
                           String contactEmail, String contactPhone) {
        this.packageId = packageId;
        this.customerId = customerId;
        this.bookingDate = bookingDate;
        this.numberOfAdults = numberOfAdults;
        this.numberOfChildren = numberOfChildren;
        this.specialRequests = specialRequests;
        this.contactEmail = contactEmail;
        this.contactPhone = contactPhone;
    }
    
    // Getters and Setters
    public Long getPackageId() { return packageId; }
    public void setPackageId(Long packageId) { this.packageId = packageId; }
    
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    
    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }
    
    public int getNumberOfAdults() { return numberOfAdults; }
    public void setNumberOfAdults(int numberOfAdults) { this.numberOfAdults = numberOfAdults; }
    
    public int getNumberOfChildren() { return numberOfChildren; }
    public void setNumberOfChildren(int numberOfChildren) { this.numberOfChildren = numberOfChildren; }
    
    public String getSpecialRequests() { return specialRequests; }
    public void setSpecialRequests(String specialRequests) { this.specialRequests = specialRequests; }
    
    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
    
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
}
