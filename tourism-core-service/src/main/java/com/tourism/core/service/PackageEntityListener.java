package com.tourism.core.service;

import com.tourism.core.entity.Package;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import jakarta.persistence.*;

/**
 * JPA Entity Listener for Package lifecycle events
 * Handles audit trails and lifecycle hooks for Package entities
 */
@Component
public class PackageEntityListener {
    
    private static final Logger logger = LoggerFactory.getLogger(PackageEntityListener.class);
    
    @PrePersist
    public void prePersist(Package packageEntity) {
        logger.info("Creating new package: {}", packageEntity.getPackageName());
        
        // Initialize version for new packages
        if (packageEntity.getVersion() == null) {
            packageEntity.setVersion(0);
        }
        
        // Validate package data before persistence
        validatePackageBusinessRules(packageEntity);
        
        logger.debug("Package pre-persist validation completed for: {}", packageEntity.getPackageName());
    }
    
    @PostPersist
    public void postPersist(Package packageEntity) {
        logger.info("Package created successfully with ID: {} - {}", 
                   packageEntity.getId(), packageEntity.getPackageName());
        
        // Here you could trigger events for:
        // - Notifying tour operators
        // - Updating search indexes
        // - Sending notifications to subscribers
        
        // Example: Publish package created event
        publishPackageEvent("PACKAGE_CREATED", packageEntity);
    }
    
    @PreUpdate
    public void preUpdate(Package packageEntity) {
        logger.info("Updating package: {} (Version: {})", 
                   packageEntity.getPackageName(), packageEntity.getVersion());
        
        // Validate package data before update
        validatePackageBusinessRules(packageEntity);
        
        // Log price changes for audit purposes
        logPriceChanges(packageEntity);
        
        logger.debug("Package pre-update validation completed for: {}", packageEntity.getPackageName());
    }
    
    @PostUpdate
    public void postUpdate(Package packageEntity) {
        logger.info("Package updated successfully: {} (New Version: {})", 
                   packageEntity.getPackageName(), packageEntity.getVersion());
        
        // Trigger post-update events
        publishPackageEvent("PACKAGE_UPDATED", packageEntity);
        
        // Update derived data or caches
        updateRelatedData(packageEntity);
    }
    
    @PostLoad
    public void postLoad(Package packageEntity) {
        logger.debug("Package loaded from database: {} (Version: {})", 
                    packageEntity.getPackageName(), packageEntity.getVersion());
        
        // Initialize any transient fields or computed properties
        initializeTransientFields(packageEntity);
    }
    
    @PreRemove
    public void preRemove(Package packageEntity) {
        logger.warn("Removing package: {} - This will affect all associated bookings!", 
                   packageEntity.getPackageName());
        
        // Validate that package can be safely removed
        validatePackageRemoval(packageEntity);
    }
    
    @PostRemove
    public void postRemove(Package packageEntity) {
        logger.info("Package removed: {}", packageEntity.getPackageName());
        
        // Clean up related data
        publishPackageEvent("PACKAGE_REMOVED", packageEntity);
        cleanupRelatedData(packageEntity);
    }
    
    /**
     * Validate business rules for package
     */
    private void validatePackageBusinessRules(Package packageEntity) {
        // Business rule: Package price should not exceed tour maximum
        // Business rule: Accommodation type should be valid
        // Business rule: Transport mode should be available for destination
        
        if (packageEntity.getPrice().doubleValue() > 100000) {
            logger.warn("High-value package detected: {} - Price: {}", 
                       packageEntity.getPackageName(), packageEntity.getPrice());
        }
    }
    
    /**
     * Log price changes for audit purposes
     */
    private void logPriceChanges(Package packageEntity) {
        // In a real implementation, you would compare with the previous version
        // stored in the database to detect price changes
        logger.info("Price audit log for package: {} - Current price: {}", 
                   packageEntity.getPackageName(), packageEntity.getPrice());
    }
    
    /**
     * Initialize transient fields after loading from database
     */
    private void initializeTransientFields(Package packageEntity) {
        // Initialize any computed fields or lazy-loaded properties
        // For example, calculate discounted prices, availability status, etc.
    }
    
    /**
     * Update related data after package changes
     */
    private void updateRelatedData(Package packageEntity) {
        // Update search indexes
        // Refresh cached data
        // Notify dependent services
        logger.debug("Updating related data for package: {}", packageEntity.getPackageName());
    }
    
    /**
     * Validate that package can be safely removed
     */
    private void validatePackageRemoval(Package packageEntity) {
        // Check for active bookings
        // Validate business constraints
        // This would typically check with the booking service
        logger.debug("Validating package removal constraints for: {}", packageEntity.getPackageName());
    }
    
    /**
     * Clean up related data after package removal
     */
    private void cleanupRelatedData(Package packageEntity) {
        // Remove from search indexes
        // Clean up cached data
        // Notify dependent services
        logger.debug("Cleaning up related data for removed package: {}", packageEntity.getPackageName());
    }
    
    /**
     * Publish package lifecycle events
     */
    private void publishPackageEvent(String eventType, Package packageEntity) {
        // In a real implementation, this would publish to a message queue
        // or event bus for other services to consume
        logger.info("Publishing event: {} for package: {}", eventType, packageEntity.getPackageName());
        
        // Example: Send to message queue, webhook, or event store
        // eventPublisher.publish(new PackageEvent(eventType, packageEntity));
    }
}
