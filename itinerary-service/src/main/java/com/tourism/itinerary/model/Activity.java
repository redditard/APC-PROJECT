package com.tourism.itinerary.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class Activity {
    
    @NotBlank(message = "Activity time is required")
    private String time;
    
    @NotBlank(message = "Activity title is required")
    private String title;
    
    private String description;
    
    @NotNull(message = "Duration is required")
    @Positive(message = "Duration must be positive")
    private Integer duration; // Duration in minutes
    
    private String location;
    
    private String activityType; // SIGHTSEEING, ADVENTURE, CULTURAL, LEISURE
    
    private String cost; // Optional cost information
    
    private boolean included; // Whether included in package
    
    // Constructors
    public Activity() {}
    
    public Activity(String time, String title, String description, Integer duration, String location) {
        this.time = time;
        this.title = title;
        this.description = description;
        this.duration = duration;
        this.location = location;
    }
    
    // Getters and Setters
    public String getTime() {
        return time;
    }
    
    public void setTime(String time) {
        this.time = time;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Integer getDuration() {
        return duration;
    }
    
    public void setDuration(Integer duration) {
        this.duration = duration;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public String getActivityType() {
        return activityType;
    }
    
    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }
    
    public String getCost() {
        return cost;
    }
    
    public void setCost(String cost) {
        this.cost = cost;
    }
    
    public boolean isIncluded() {
        return included;
    }
    
    public void setIncluded(boolean included) {
        this.included = included;
    }
    
    @Override
    public String toString() {
        return "Activity{" +
                "time='" + time + '\'' +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", duration=" + duration +
                ", location='" + location + '\'' +
                ", activityType='" + activityType + '\'' +
                ", cost='" + cost + '\'' +
                ", included=" + included +
                '}';
    }
}
