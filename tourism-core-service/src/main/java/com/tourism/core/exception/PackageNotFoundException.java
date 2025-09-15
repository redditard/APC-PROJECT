package com.tourism.core.exception;

/**
 * Exception thrown when a package is not found
 */
public class PackageNotFoundException extends RuntimeException {
    
    public PackageNotFoundException(String message) {
        super(message);
    }
    
    public PackageNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public PackageNotFoundException(Long packageId) {
        super("Package not found with ID: " + packageId);
    }
}
