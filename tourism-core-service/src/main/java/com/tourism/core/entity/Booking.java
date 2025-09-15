package com.tourism.core.entity;

import com.tourism.common.enums.BookingStatus;
import com.tourism.common.enums.PaymentStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "booking_reference", unique = true, nullable = false)
    private String bookingReference;
    
    @Column(name = "package_id", nullable = false)
    private Long packageId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id", insertable = false, updatable = false)
    private Package tourPackage;
    
    @Column(name = "tourist_id", nullable = false)
    private Long touristId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tourist_id", insertable = false, updatable = false)
    private User tourist;
    
    @Column(name = "number_of_people", nullable = false)
    private Integer numberOfPeople;
    
    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;
    
    @Column(name = "booking_date")
    private LocalDateTime bookingDate;
    
    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.PENDING;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (bookingDate == null) {
            bookingDate = LocalDateTime.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Constructors
    public Booking() {}
    
    public Booking(String bookingReference, Long packageId, Long touristId, 
                   Integer numberOfPeople, BigDecimal totalAmount) {
        this.bookingReference = bookingReference;
        this.packageId = packageId;
        this.touristId = touristId;
        this.numberOfPeople = numberOfPeople;
        this.totalAmount = totalAmount;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getBookingReference() { return bookingReference; }
    public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }
    
    public Long getPackageId() { return packageId; }
    public void setPackageId(Long packageId) { this.packageId = packageId; }
    
    public Package getTourPackage() { return tourPackage; }
    public void setTourPackage(Package tourPackage) { this.tourPackage = tourPackage; }
    
    public Long getTouristId() { return touristId; }
    public void setTouristId(Long touristId) { this.touristId = touristId; }
    
    public User getTourist() { return tourist; }
    public void setTourist(User tourist) { this.tourist = tourist; }
    
    public Integer getNumberOfPeople() { return numberOfPeople; }
    public void setNumberOfPeople(Integer numberOfPeople) { this.numberOfPeople = numberOfPeople; }
    
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    
    public LocalDateTime getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDateTime bookingDate) { this.bookingDate = bookingDate; }
    
    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
    
    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
