package com.tourism.itinerary.repository;

import com.tourism.itinerary.model.Itinerary;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItineraryRepository extends MongoRepository<Itinerary, String> {
    
    /**
     * Find all itineraries for a specific tour, ordered by day number
     */
    List<Itinerary> findByTourIdAndActiveOrderByDayNumber(Long tourId, boolean active);
    
    /**
     * Find all active itineraries for a specific tour
     */
    List<Itinerary> findByTourIdAndActive(Long tourId, boolean active);
    
    /**
     * Find a specific day's itinerary for a tour
     */
    Optional<Itinerary> findByTourIdAndDayNumberAndActive(Long tourId, Integer dayNumber, boolean active);
    
    /**
     * Find itineraries created by a specific user
     */
    List<Itinerary> findByCreatedByAndActiveOrderByCreatedAtDesc(String createdBy, boolean active);
    
    /**
     * Check if an itinerary exists for a specific tour and day
     */
    boolean existsByTourIdAndDayNumberAndActive(Long tourId, Integer dayNumber, boolean active);
    
    /**
     * Get the maximum day number for a tour
     */
    @Query("{ 'tourId': ?0, 'active': true }")
    List<Itinerary> findByTourIdOrderByDayNumberDesc(Long tourId);
    
    /**
     * Find all tours that have itineraries
     */
    @Query(value = "{ 'active': true }", fields = "{ 'tourId': 1 }")
    List<Itinerary> findDistinctTourIds();
    
    /**
     * Count total days for a tour
     */
    long countByTourIdAndActive(Long tourId, boolean active);
    
    /**
     * Delete all itineraries for a tour (soft delete by setting active = false)
     */
    @Query("{ 'tourId': ?0 }")
    List<Itinerary> findByTourId(Long tourId);
}
