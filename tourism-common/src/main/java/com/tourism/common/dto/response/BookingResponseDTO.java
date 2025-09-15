package com.tourism.common.dto.response;

import com.tourism.common.enums.BookingStatus;
import com.tourism.common.enums.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class BookingResponseDTO {
    
    private Long bookingId;
    private Long packageId;
    private String packageName;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private LocalDate bookingDate;
    private int numberOfAdults;
    private int numberOfChildren;
    private BigDecimal totalAmount;
    private BookingStatus bookingStatus;
    private PaymentStatus paymentStatus;
    private String specialRequests;
    private String contactEmail;
    private String contactPhone;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public BookingResponseDTO() {}
    
    public BookingResponseDTO(Long bookingId, Long packageId, String packageName,
                             Long customerId, String customerName, String customerEmail,
                             LocalDate bookingDate, int numberOfAdults, int numberOfChildren,
                             BigDecimal totalAmount, BookingStatus bookingStatus,
                             PaymentStatus paymentStatus, String specialRequests,
                             String contactEmail, String contactPhone,
                             LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.bookingId = bookingId;
        this.packageId = packageId;
        this.packageName = packageName;
        this.customerId = customerId;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.bookingDate = bookingDate;
        this.numberOfAdults = numberOfAdults;
        this.numberOfChildren = numberOfChildren;
        this.totalAmount = totalAmount;
        this.bookingStatus = bookingStatus;
        this.paymentStatus = paymentStatus;
        this.specialRequests = specialRequests;
        this.contactEmail = contactEmail;
        this.contactPhone = contactPhone;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Getters and Setters
    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
    
    public Long getPackageId() { return packageId; }
    public void setPackageId(Long packageId) { this.packageId = packageId; }
    
    public String getPackageName() { return packageName; }
    public void setPackageName(String packageName) { this.packageName = packageName; }
    
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    
    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }
    
    public int getNumberOfAdults() { return numberOfAdults; }
    public void setNumberOfAdults(int numberOfAdults) { this.numberOfAdults = numberOfAdults; }
    
    public int getNumberOfChildren() { return numberOfChildren; }
    public void setNumberOfChildren(int numberOfChildren) { this.numberOfChildren = numberOfChildren; }
    
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    
    public BookingStatus getBookingStatus() { return bookingStatus; }
    public void setBookingStatus(BookingStatus bookingStatus) { this.bookingStatus = bookingStatus; }
    
    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }
    
    public String getSpecialRequests() { return specialRequests; }
    public void setSpecialRequests(String specialRequests) { this.specialRequests = specialRequests; }
    
    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
    
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
