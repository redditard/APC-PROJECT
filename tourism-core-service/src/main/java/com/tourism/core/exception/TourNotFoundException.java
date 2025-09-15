package com.tourism.core.exception;

/**
 * Exception thrown when a tour is not found
 */
public class TourNotFoundException extends RuntimeException {
    
    public TourNotFoundException(String message) {
        super(message);
    }
    
    public TourNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public TourNotFoundException(Long tourId) {
        super("Tour not found with ID: " + tourId);
    }
}
