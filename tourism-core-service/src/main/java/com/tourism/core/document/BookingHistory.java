package com.tourism.core.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Document(collection = "booking_history")
public class BookingHistory {
    
    @Id
    private String id;
    
    private String bookingReference;
    private Long touristId;
    private Map<String, Object> tourDetails;
    private Map<String, Object> packageDetails;
    private List<BookingTimeline> bookingTimeline = new ArrayList<>();
    private List<Map<String, Object>> paymentHistory = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public BookingHistory() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public BookingHistory(String bookingReference, Long touristId) {
        this();
        this.bookingReference = bookingReference;
        this.touristId = touristId;
    }
    
    // Inner class for booking timeline
    public static class BookingTimeline {
        private String status;
        private LocalDateTime timestamp;
        private String remarks;
        
        public BookingTimeline() {}
        
        public BookingTimeline(String status, LocalDateTime timestamp, String remarks) {
            this.status = status;
            this.timestamp = timestamp;
            this.remarks = remarks;
        }
        
        // Getters and Setters
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        
        public LocalDateTime getTimestamp() { return timestamp; }
        public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
        
        public String getRemarks() { return remarks; }
        public void setRemarks(String remarks) { this.remarks = remarks; }
    }
    
    // Method to add timeline entry
    public void addTimelineEntry(String status, String remarks) {
        this.bookingTimeline.add(new BookingTimeline(status, LocalDateTime.now(), remarks));
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getBookingReference() { return bookingReference; }
    public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }
    
    public Long getTouristId() { return touristId; }
    public void setTouristId(Long touristId) { this.touristId = touristId; }
    
    public Map<String, Object> getTourDetails() { return tourDetails; }
    public void setTourDetails(Map<String, Object> tourDetails) { this.tourDetails = tourDetails; }
    
    public Map<String, Object> getPackageDetails() { return packageDetails; }
    public void setPackageDetails(Map<String, Object> packageDetails) { this.packageDetails = packageDetails; }
    
    public List<BookingTimeline> getBookingTimeline() { return bookingTimeline; }
    public void setBookingTimeline(List<BookingTimeline> bookingTimeline) { this.bookingTimeline = bookingTimeline; }
    
    public List<Map<String, Object>> getPaymentHistory() { return paymentHistory; }
    public void setPaymentHistory(List<Map<String, Object>> paymentHistory) { this.paymentHistory = paymentHistory; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
