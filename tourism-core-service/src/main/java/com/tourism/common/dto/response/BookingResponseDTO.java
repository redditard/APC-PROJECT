package com.tourism.common.dto.response;

import com.tourism.core.entity.Booking;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BookingResponseDTO {
    private Long id;
    private String bookingReference;
    private Long touristId;
    private String touristName;
    private Long packageId;
    private String packageName;
    private Integer numberOfPeople;
    private BigDecimal totalAmount;
    private LocalDateTime bookingDate;
    private String status;
    private String paymentStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Default constructor
    public BookingResponseDTO() {}

    // Constructor from entity
    public BookingResponseDTO(Booking booking) {
        this.id = booking.getId();
        this.bookingReference = booking.getBookingReference();
        this.touristId = booking.getTourist().getId();
        this.touristName = booking.getTourist().getFullName();
        this.packageId = booking.getTourPackage().getId();
        this.packageName = booking.getTourPackage().getPackageName();
        this.numberOfPeople = booking.getNumberOfPeople();
        this.totalAmount = booking.getTotalAmount();
        this.bookingDate = booking.getBookingDate();
        this.status = booking.getStatus().name();
        this.paymentStatus = booking.getPaymentStatus().name();
        this.createdAt = booking.getCreatedAt();
        this.updatedAt = booking.getUpdatedAt();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBookingReference() {
        return bookingReference;
    }

    public void setBookingReference(String bookingReference) {
        this.bookingReference = bookingReference;
    }

    public Long getTouristId() {
        return touristId;
    }

    public void setTouristId(Long touristId) {
        this.touristId = touristId;
    }

    public String getTouristName() {
        return touristName;
    }

    public void setTouristName(String touristName) {
        this.touristName = touristName;
    }

    public Long getPackageId() {
        return packageId;
    }

    public void setPackageId(Long packageId) {
        this.packageId = packageId;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public Integer getNumberOfPeople() {
        return numberOfPeople;
    }

    public void setNumberOfPeople(Integer numberOfPeople) {
        this.numberOfPeople = numberOfPeople;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public LocalDateTime getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDateTime bookingDate) {
        this.bookingDate = bookingDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
