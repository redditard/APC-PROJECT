package com.tourism.core.exception;

/**
 * Exception thrown when a package is not available for booking
 */
public class PackageNotAvailableException extends RuntimeException {
    
    public PackageNotAvailableException(String message) {
        super(message);
    }
    
    public PackageNotAvailableException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public PackageNotAvailableException(Long packageId) {
        super("Package not available for booking with ID: " + packageId);
    }
}
