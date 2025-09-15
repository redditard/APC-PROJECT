package com.tourism.common.dto.request;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public class TourCreateRequest {
    
    @NotBlank(message = "Tour name is required")
    @Size(min = 3, max = 100, message = "Tour name must be between 3 and 100 characters")
    private String name;
    
    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;
    
    @NotBlank(message = "Destination is required")
    @Size(min = 2, max = 100, message = "Destination must be between 2 and 100 characters")
    private String destination;
    
    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 day")
    @Max(value = 365, message = "Duration cannot exceed 365 days")
    private Integer duration;
    
    @NotNull(message = "Maximum participants is required")
    @Min(value = 1, message = "Must allow at least 1 participant")
    @Max(value = 1000, message = "Maximum participants cannot exceed 1000")
    private Integer maxParticipants;
    
    @NotNull(message = "Start date is required")
    @Future(message = "Start date must be in the future")
    private LocalDate startDate;
    
    @NotNull(message = "End date is required")
    @Future(message = "End date must be in the future")
    private LocalDate endDate;
    
    // Constructors
    public TourCreateRequest() {}
    
    public TourCreateRequest(String name, String description, String destination, 
                           Integer duration, Integer maxParticipants, 
                           LocalDate startDate, LocalDate endDate) {
        this.name = name;
        this.description = description;
        this.destination = destination;
        this.duration = duration;
        this.maxParticipants = maxParticipants;
        this.startDate = startDate;
        this.endDate = endDate;
    }
    
    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    
    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }
    
    public Integer getMaxParticipants() { return maxParticipants; }
    public void setMaxParticipants(Integer maxParticipants) { this.maxParticipants = maxParticipants; }
    
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
}
