package com.tourism.client;

import com.tourism.common.dto.response.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;

import java.util.List;
import java.util.Map;

@FeignClient(name = "itinerary-service")
public interface ItineraryServiceClient {
    
    @GetMapping("/api/itineraries/tour/{tourId}")
    @CircuitBreaker(name = "itinerary-service", fallbackMethod = "getItinerariesFallback")
    @Retry(name = "itinerary-service")
    ApiResponse<List<Object>> getItinerariesByTourId(@PathVariable Long tourId);
    
    @GetMapping("/api/itineraries/tour/{tourId}/stats")
    @CircuitBreaker(name = "itinerary-service", fallbackMethod = "getStatsFallback")
    @Retry(name = "itinerary-service")
    ApiResponse<Map<String, Object>> getTourItineraryStats(@PathVariable Long tourId);
    
    // Fallback methods
    default ApiResponse<List<Object>> getItinerariesFallback(Long tourId, Exception ex) {
        return ApiResponse.error("Itinerary service is currently unavailable. Please try again later.");
    }
    
    default ApiResponse<Map<String, Object>> getStatsFallback(Long tourId, Exception ex) {
        return ApiResponse.error("Itinerary statistics service is currently unavailable.");
    }
}
