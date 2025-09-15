package com.tourism.itinerary.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "itineraries")
public class Itinerary {
    
    @Id
    private String id;
    
    @NotNull(message = "Tour ID is required")
    @Indexed
    private Long tourId;
    
    @NotNull(message = "Day number is required")
    @Min(value = 1, message = "Day number must be at least 1")
    private Integer dayNumber;
    
    private String dayTitle; // e.g., "Arrival in Paris", "Exploring the City"
    
    @Valid
    private List<Activity> activities = new ArrayList<>();
    
    private List<String> meals = new ArrayList<>(); // BREAKFAST, LUNCH, DINNER
    
    private String accommodation;
    
    private String transportDetails;
    
    private String notes; // Additional notes for the day
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    private String createdBy; // Admin/Tour operator who created this
    
    private boolean active = true; // Whether this itinerary is active
    
    // Constructors
    public Itinerary() {}
    
    public Itinerary(Long tourId, Integer dayNumber, String dayTitle) {
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
        this.activities = activities != null ? activities : new ArrayList<>();
    }
    
    public List<String> getMeals() {
        return meals;
    }
    
    public void setMeals(List<String> meals) {
        this.meals = meals != null ? meals : new ArrayList<>();
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
    
    // Helper methods
    public void addActivity(Activity activity) {
        if (this.activities == null) {
            this.activities = new ArrayList<>();
        }
        this.activities.add(activity);
    }
    
    public void addMeal(String meal) {
        if (this.meals == null) {
            this.meals = new ArrayList<>();
        }
        this.meals.add(meal);
    }
    
    @Override
    public String toString() {
        return "Itinerary{" +
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
