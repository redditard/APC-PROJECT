package com.tourism.itinerary.service;

import com.tourism.itinerary.dto.ItineraryGenerationRequest;
import com.tourism.itinerary.dto.ItineraryRequest;
import com.tourism.itinerary.dto.ItineraryResponse;
import com.tourism.itinerary.model.Activity;
import com.tourism.itinerary.model.Itinerary;
import com.tourism.itinerary.repository.ItineraryRepository;
import com.tourism.common.exception.ResourceNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;

@Service
public class ItineraryService {
    
    private final ItineraryRepository itineraryRepository;
    
    @Autowired
    public ItineraryService(ItineraryRepository itineraryRepository) {
        this.itineraryRepository = itineraryRepository;
    }
    
    /**
     * Create a new itinerary
     */
    public ItineraryResponse createItinerary(ItineraryRequest request, String createdBy) {
        // Check if itinerary already exists for this tour and day
        if (itineraryRepository.existsByTourIdAndDayNumberAndActive(request.getTourId(), request.getDayNumber(), true)) {
            throw new IllegalArgumentException("Itinerary already exists for tour " + request.getTourId() + " day " + request.getDayNumber());
        }
        
        Itinerary itinerary = convertToEntity(request);
        itinerary.setCreatedBy(createdBy);
        itinerary.setCreatedAt(LocalDateTime.now());
        itinerary.setUpdatedAt(LocalDateTime.now());
        
        Itinerary saved = itineraryRepository.save(itinerary);
        return convertToResponse(saved);
    }
    
    /**
     * Update an existing itinerary
     */
    public ItineraryResponse updateItinerary(String id, ItineraryRequest request, String updatedBy) {
        Itinerary existingItinerary = itineraryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary not found with id: " + id));
        
        // Check if updating to a different day number that already exists
        if (!existingItinerary.getDayNumber().equals(request.getDayNumber())) {
            if (itineraryRepository.existsByTourIdAndDayNumberAndActive(request.getTourId(), request.getDayNumber(), true)) {
                throw new IllegalArgumentException("Itinerary already exists for tour " + request.getTourId() + " day " + request.getDayNumber());
            }
        }
        
        updateEntityFromRequest(existingItinerary, request);
        existingItinerary.setUpdatedAt(LocalDateTime.now());
        
        Itinerary updated = itineraryRepository.save(existingItinerary);
        return convertToResponse(updated);
    }
    
    /**
     * Get itinerary by ID
     */
    public ItineraryResponse getItineraryById(String id) {
        Itinerary itinerary = itineraryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary not found with id: " + id));
        return convertToResponse(itinerary);
    }
    
    /**
     * Get all itineraries for a tour
     */
    public List<ItineraryResponse> getItinerariesByTourId(Long tourId) {
        List<Itinerary> itineraries = itineraryRepository.findByTourIdAndActiveOrderByDayNumber(tourId, true);
        return itineraries.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Get specific day itinerary for a tour
     */
    public ItineraryResponse getItineraryByTourAndDay(Long tourId, Integer dayNumber) {
        Itinerary itinerary = itineraryRepository.findByTourIdAndDayNumberAndActive(tourId, dayNumber, true)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary not found for tour " + tourId + " day " + dayNumber));
        return convertToResponse(itinerary);
    }
    
    /**
     * Delete itinerary (soft delete)
     */
    public void deleteItinerary(String id) {
        Itinerary itinerary = itineraryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary not found with id: " + id));
        
        itinerary.setActive(false);
        itinerary.setUpdatedAt(LocalDateTime.now());
        itineraryRepository.save(itinerary);
    }
    
    /**
     * Delete all itineraries for a tour
     */
    public void deleteItinerariesByTourId(Long tourId) {
        List<Itinerary> itineraries = itineraryRepository.findByTourId(tourId);
        itineraries.forEach(itinerary -> {
            itinerary.setActive(false);
            itinerary.setUpdatedAt(LocalDateTime.now());
        });
        itineraryRepository.saveAll(itineraries);
    }
    
    /**
     * Generate AI-suggested itinerary (placeholder implementation)
     */
    public List<ItineraryResponse> generateItinerary(ItineraryGenerationRequest request, String createdBy) {
        List<Itinerary> generatedItineraries = new ArrayList<>();
        
        // This is a simplified implementation
        // In a real application, this would integrate with AI services or have sophisticated logic
        for (int day = 1; day <= request.getDuration(); day++) {
            Itinerary itinerary = new Itinerary();
            itinerary.setTourId(request.getTourId());
            itinerary.setDayNumber(day);
            itinerary.setDayTitle("Day " + day + " - " + request.getDestination());
            itinerary.setCreatedBy(createdBy);
            itinerary.setCreatedAt(LocalDateTime.now());
            itinerary.setUpdatedAt(LocalDateTime.now());
            
            // Add sample activities based on tour type
            List<Activity> activities = generateSampleActivities(request, day);
            itinerary.setActivities(activities);
            
            // Add meals
            List<String> meals = new ArrayList<>();
            if (day == 1) {
                meals.add("LUNCH");
                meals.add("DINNER");
            } else if (day == request.getDuration()) {
                meals.add("BREAKFAST");
                meals.add("LUNCH");
            } else {
                meals.add("BREAKFAST");
                meals.add("LUNCH");
                meals.add("DINNER");
            }
            itinerary.setMeals(meals);
            
            // Set accommodation
            itinerary.setAccommodation(request.getAccommodationType() + " accommodation in " + request.getDestination());
            
            // Set transport
            itinerary.setTransportDetails("Transport by " + request.getTransportMode());
            
            generatedItineraries.add(itinerary);
        }
        
        List<Itinerary> saved = itineraryRepository.saveAll(generatedItineraries);
        return saved.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Get tour statistics
     */
    public long getTotalDaysForTour(Long tourId) {
        return itineraryRepository.countByTourIdAndActive(tourId, true);
    }
    
    /**
     * Check if tour has itinerary
     */
    public boolean tourHasItinerary(Long tourId) {
        return itineraryRepository.countByTourIdAndActive(tourId, true) > 0;
    }
    
    // Helper methods
    private List<Activity> generateSampleActivities(ItineraryGenerationRequest request, int day) {
        List<Activity> activities = new ArrayList<>();
        
        if (day == 1) {
            // Arrival day
            activities.add(new Activity("10:00", "Arrival and Check-in", "Arrive at " + request.getDestination() + " and check into accommodation", 120, request.getDestination()));
            activities.add(new Activity("14:00", "City Orientation Tour", "Get familiar with the city and local area", 180, "City Center"));
            activities.add(new Activity("18:00", "Welcome Dinner", "Traditional local cuisine experience", 120, "Local Restaurant"));
        } else if (day == request.getDuration()) {
            // Departure day
            activities.add(new Activity("09:00", "Final Sightseeing", "Last-minute shopping and sightseeing", 180, "City Center"));
            activities.add(new Activity("14:00", "Check-out and Departure", "Check out from accommodation and departure", 60, request.getDestination()));
        } else {
            // Regular days
            activities.add(new Activity("09:00", "Morning Exploration", "Explore local attractions and landmarks", 240, "Tourist Area"));
            activities.add(new Activity("14:00", "Cultural Experience", "Immerse in local culture and traditions", 180, "Cultural Center"));
            activities.add(new Activity("18:00", "Leisure Time", "Free time for personal activities", 120, "Hotel/Local Area"));
        }
        
        return activities;
    }
    
    private Itinerary convertToEntity(ItineraryRequest request) {
        Itinerary itinerary = new Itinerary();
        itinerary.setTourId(request.getTourId());
        itinerary.setDayNumber(request.getDayNumber());
        itinerary.setDayTitle(request.getDayTitle());
        itinerary.setActivities(request.getActivities());
        itinerary.setMeals(request.getMeals());
        itinerary.setAccommodation(request.getAccommodation());
        itinerary.setTransportDetails(request.getTransportDetails());
        itinerary.setNotes(request.getNotes());
        itinerary.setActive(true);
        return itinerary;
    }
    
    private void updateEntityFromRequest(Itinerary itinerary, ItineraryRequest request) {
        itinerary.setTourId(request.getTourId());
        itinerary.setDayNumber(request.getDayNumber());
        itinerary.setDayTitle(request.getDayTitle());
        itinerary.setActivities(request.getActivities());
        itinerary.setMeals(request.getMeals());
        itinerary.setAccommodation(request.getAccommodation());
        itinerary.setTransportDetails(request.getTransportDetails());
        itinerary.setNotes(request.getNotes());
    }
    
    private ItineraryResponse convertToResponse(Itinerary itinerary) {
        ItineraryResponse response = new ItineraryResponse();
        response.setId(itinerary.getId());
        response.setTourId(itinerary.getTourId());
        response.setDayNumber(itinerary.getDayNumber());
        response.setDayTitle(itinerary.getDayTitle());
        response.setActivities(itinerary.getActivities());
        response.setMeals(itinerary.getMeals());
        response.setAccommodation(itinerary.getAccommodation());
        response.setTransportDetails(itinerary.getTransportDetails());
        response.setNotes(itinerary.getNotes());
        response.setCreatedAt(itinerary.getCreatedAt());
        response.setUpdatedAt(itinerary.getUpdatedAt());
        response.setCreatedBy(itinerary.getCreatedBy());
        response.setActive(itinerary.isActive());
        return response;
    }
}
