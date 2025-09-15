package com.tourism.common.dto.response;

import com.tourism.common.enums.TourStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class TourResponseDTO {
    
    private Long tourId;
    private String tourName;
    private String destination;
    private int duration;
    private LocalDate startDate;
    private LocalDate endDate;
    private TourStatus status;
    private String description;
    private String itinerary;
    private int maxCapacity;
    private int availableSlots;
    private java.util.List<com.tourism.common.dto.response.PackageResponseDTO> packages;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public TourResponseDTO() {}
    
    public TourResponseDTO(Long tourId, String tourName, String destination, int duration,
                          LocalDate startDate, LocalDate endDate, TourStatus status,
                          String description, String itinerary, int maxCapacity,
                          int availableSlots, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.tourId = tourId;
        this.tourName = tourName;
        this.destination = destination;
        this.duration = duration;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.description = description;
        this.itinerary = itinerary;
        this.maxCapacity = maxCapacity;
        this.availableSlots = availableSlots;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Getters and Setters
    public Long getTourId() { return tourId; }
    public void setTourId(Long tourId) { this.tourId = tourId; }
    
    public String getTourName() { return tourName; }
    public void setTourName(String tourName) { this.tourName = tourName; }
    
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    
    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }
    
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    
    public TourStatus getStatus() { return status; }
    public void setStatus(TourStatus status) { this.status = status; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getItinerary() { return itinerary; }
    public void setItinerary(String itinerary) { this.itinerary = itinerary; }
    
    public int getMaxCapacity() { return maxCapacity; }
    public void setMaxCapacity(int maxCapacity) { this.maxCapacity = maxCapacity; }
    
    public int getAvailableSlots() { return availableSlots; }
    public void setAvailableSlots(int availableSlots) { this.availableSlots = availableSlots; }

    public java.util.List<com.tourism.common.dto.response.PackageResponseDTO> getPackages() { return packages; }
    public void setPackages(java.util.List<com.tourism.common.dto.response.PackageResponseDTO> packages) { this.packages = packages; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
