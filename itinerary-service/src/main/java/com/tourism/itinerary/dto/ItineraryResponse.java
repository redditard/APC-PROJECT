package com.tourism.itinerary.dto;

import com.tourism.itinerary.model.Activity;

import java.time.LocalDateTime;
import java.util.List;

public class ItineraryResponse {
    
    private String id;
    private Long tourId;
    private Integer dayNumber;
    private String dayTitle;
    private List<Activity> activities;
    private List<String> meals;
    private String accommodation;
    private String transportDetails;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private boolean active;
    
    // Constructors
    public ItineraryResponse() {}
    
    public ItineraryResponse(String id, Long tourId, Integer dayNumber, String dayTitle) {
        this.id = id;
        this.tourId = tourId;
        this.dayNumber = dayNumber;
        this.dayTitle = dayTitle;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public Long getTourId() {
        return tourId;
    }
    
    public void setTourId(Long tourId) {
        this.tourId = tourId;
    }
    
    public Integer getDayNumber() {
        return dayNumber;
    }
    
    public void setDayNumber(Integer dayNumber) {
        this.dayNumber = dayNumber;
    }
    
    public String getDayTitle() {
        return dayTitle;
    }
    
    public void setDayTitle(String dayTitle) {
        this.dayTitle = dayTitle;
    }
    
    public List<Activity> getActivities() {
        return activities;
    }
    
    public void setActivities(List<Activity> activities) {
        this.activities = activities;
    }
    
    public List<String> getMeals() {
        return meals;
    }
    
    public void setMeals(List<String> meals) {
        this.meals = meals;
    }
    
    public String getAccommodation() {
        return accommodation;
    }
    
    public void setAccommodation(String accommodation) {
        this.accommodation = accommodation;
    }
    
    public String getTransportDetails() {
        return transportDetails;
    }
    
    public void setTransportDetails(String transportDetails) {
        this.transportDetails = transportDetails;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
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
    
    public String getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
    
    public boolean isActive() {
        return active;
    }
    
    public void setActive(boolean active) {
        this.active = active;
    }
    
    @Override
    public String toString() {
        return "ItineraryResponse{" +
                "id='" + id + '\'' +
                ", tourId=" + tourId +
                ", dayNumber=" + dayNumber +
                ", dayTitle='" + dayTitle + '\'' +
                ", activities=" + (activities != null ? activities.size() : 0) +
                ", meals=" + (meals != null ? meals.size() : 0) +
                ", accommodation='" + accommodation + '\'' +
                ", transportDetails='" + transportDetails + '\'' +
                ", notes='" + notes + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", createdBy='" + createdBy + '\'' +
                ", active=" + active +
                '}';
    }
}
