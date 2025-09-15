package com.tourism.common.dto.request;

import com.tourism.common.enums.BookingStatus;
import com.tourism.common.enums.PaymentStatus;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

/**
 * DTO for updating existing booking information
 */
public class BookingUpdateRequest {
    
    @NotNull(message = "Package ID is required")
    private Long packageId;
    
    @NotNull(message = "Booking date is required")
    private LocalDate bookingDate;
    
    @NotNull(message = "Number of adults is required")
    @Min(value = 1, message = "At least one adult is required")
    private Integer numberOfAdults;
    
    @Min(value = 0, message = "Number of children cannot be negative")
    private Integer numberOfChildren = 0;
    
    private String specialRequests;
    
    private String contactEmail;
    
    private String contactPhone;
    
    private BookingStatus bookingStatus;
    
    private PaymentStatus paymentStatus;
    
    private String paymentReference;

    // Getters and Setters
    public Long getPackageId() {
        return packageId;
    }

    public void setPackageId(Long packageId) {
        this.packageId = packageId;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public Integer getNumberOfAdults() {
        return numberOfAdults;
    }

    public void setNumberOfAdults(Integer numberOfAdults) {
        this.numberOfAdults = numberOfAdults;
    }

    public Integer getNumberOfChildren() {
        return numberOfChildren;
    }

    public void setNumberOfChildren(Integer numberOfChildren) {
        this.numberOfChildren = numberOfChildren;
    }

    public String getSpecialRequests() {
        return specialRequests;
    }

    public void setSpecialRequests(String specialRequests) {
        this.specialRequests = specialRequests;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public BookingStatus getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(BookingStatus bookingStatus) {
        this.bookingStatus = bookingStatus;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPaymentReference() {
        return paymentReference;
    }

    public void setPaymentReference(String paymentReference) {
        this.paymentReference = paymentReference;
    }
}
