package com.tourism.core.exception;

/**
 * Exception thrown when there's insufficient availability for booking
 */
public class InsufficientAvailabilityException extends RuntimeException {
    
    public InsufficientAvailabilityException(String message) {
        super(message);
    }
    
    public InsufficientAvailabilityException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public InsufficientAvailabilityException(int requested, int available) {
        super("Insufficient availability. Requested: " + requested + ", Available: " + available);
    }
}
