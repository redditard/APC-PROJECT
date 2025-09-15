package com.tourism.itinerary.dto;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public class ItineraryGenerationRequest {
    
    @NotNull(message = "Tour ID is required")
    private Long tourId;
    
    private String destination;
    
    private Integer duration; // Number of days
    
    private String tourType; // ADVENTURE, CULTURAL, LEISURE, BUSINESS
    
    private String activityLevel; // LOW, MODERATE, HIGH
    
    private List<String> interests; // e.g., MUSEUMS, NATURE, FOOD, SHOPPING
    
    private String accommodationType; // BUDGET, STANDARD, LUXURY
    
    private String transportMode; // BUS, TRAIN, FLIGHT, CAR
    
    private String mealPreference; // VEGETARIAN, NON_VEGETARIAN, VEGAN
    
    private boolean includeOptionalActivities = false;
    
    // Constructors
    public ItineraryGenerationRequest() {}
    
    public ItineraryGenerationRequest(Long tourId, String destination, Integer duration) {
        this.tourId = tourId;
        this.destination = destination;
        this.duration = duration;
    }
    
    // Getters and Setters
    public Long getTourId() {
        return tourId;
    }
    
    public void setTourId(Long tourId) {
        this.tourId = tourId;
    }
    
    public String getDestination() {
        return destination;
    }
    
    public void setDestination(String destination) {
        this.destination = destination;
    }
    
    public Integer getDuration() {
        return duration;
    }
    
    public void setDuration(Integer duration) {
        this.duration = duration;
    }
    
    public String getTourType() {
        return tourType;
    }
    
    public void setTourType(String tourType) {
        this.tourType = tourType;
    }
    
    public String getActivityLevel() {
        return activityLevel;
    }
    
    public void setActivityLevel(String activityLevel) {
        this.activityLevel = activityLevel;
    }
    
    public List<String> getInterests() {
        return interests;
    }
    
    public void setInterests(List<String> interests) {
        this.interests = interests;
    }
    
    public String getAccommodationType() {
        return accommodationType;
    }
    
    public void setAccommodationType(String accommodationType) {
        this.accommodationType = accommodationType;
    }
    
    public String getTransportMode() {
        return transportMode;
    }
    
    public void setTransportMode(String transportMode) {
        this.transportMode = transportMode;
    }
    
    public String getMealPreference() {
        return mealPreference;
    }
    
    public void setMealPreference(String mealPreference) {
        this.mealPreference = mealPreference;
    }
    
    public boolean isIncludeOptionalActivities() {
        return includeOptionalActivities;
    }
    
    public void setIncludeOptionalActivities(boolean includeOptionalActivities) {
        this.includeOptionalActivities = includeOptionalActivities;
    }
    
    @Override
    public String toString() {
        return "ItineraryGenerationRequest{" +
                "tourId=" + tourId +
                ", destination='" + destination + '\'' +
                ", duration=" + duration +
                ", tourType='" + tourType + '\'' +
                ", activityLevel='" + activityLevel + '\'' +
                ", interests=" + interests +
                ", accommodationType='" + accommodationType + '\'' +
                ", transportMode='" + transportMode + '\'' +
                ", mealPreference='" + mealPreference + '\'' +
                ", includeOptionalActivities=" + includeOptionalActivities +
                '}';
    }
}
