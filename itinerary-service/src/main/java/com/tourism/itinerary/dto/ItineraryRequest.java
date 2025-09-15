package com.tourism.itinerary.dto;

import com.tourism.itinerary.model.Activity;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

import java.util.List;
import java.util.ArrayList;

public class ItineraryRequest {
    
    @NotNull(message = "Tour ID is required")
    private Long tourId;
    
    @NotNull(message = "Day number is required")
    @Min(value = 1, message = "Day number must be at least 1")
    private Integer dayNumber;
    
    private String dayTitle;
    
    @Valid
    private List<Activity> activities = new ArrayList<>();
    
    private List<String> meals = new ArrayList<>();
    
    private String accommodation;
    
    private String transportDetails;
    
    private String notes;
    
    // Constructors
    public ItineraryRequest() {}
    
    public ItineraryRequest(Long tourId, Integer dayNumber, String dayTitle) {
        this.tourId = tourId;
        this.dayNumber = dayNumber;
        this.dayTitle = dayTitle;
    }
    
    // Getters and Setters
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
    
    @Override
    public String toString() {
        return "ItineraryRequest{" +
                "tourId=" + tourId +
                ", dayNumber=" + dayNumber +
                ", dayTitle='" + dayTitle + '\'' +
                ", activities=" + (activities != null ? activities.size() : 0) +
                ", meals=" + (meals != null ? meals.size() : 0) +
                ", accommodation='" + accommodation + '\'' +
                ", transportDetails='" + transportDetails + '\'' +
                ", notes='" + notes + '\'' +
                '}';
    }
}
