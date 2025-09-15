package com.tourism.common.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PackageResponseDTO {
    
    private Long packageId;
    private String packageName;
    private Long tourId;
    private String tourName;
    private BigDecimal price;
    private String inclusions;
    private String exclusions;
    private String accommodationType;
    private String transportMode;
    private String mealPlan;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public PackageResponseDTO() {}
    
    public PackageResponseDTO(Long packageId, String packageName, Long tourId, String tourName,
                             BigDecimal price, String inclusions, String exclusions,
                             String accommodationType, String transportMode, String mealPlan,
                             LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.packageId = packageId;
        this.packageName = packageName;
        this.tourId = tourId;
        this.tourName = tourName;
        this.price = price;
        this.inclusions = inclusions;
        this.exclusions = exclusions;
        this.accommodationType = accommodationType;
        this.transportMode = transportMode;
        this.mealPlan = mealPlan;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Getters and Setters
    public Long getPackageId() { return packageId; }
    public void setPackageId(Long packageId) { this.packageId = packageId; }
    
    public String getPackageName() { return packageName; }
    public void setPackageName(String packageName) { this.packageName = packageName; }
    
    public Long getTourId() { return tourId; }
    public void setTourId(Long tourId) { this.tourId = tourId; }
    
    public String getTourName() { return tourName; }
    public void setTourName(String tourName) { this.tourName = tourName; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public String getInclusions() { return inclusions; }
    public void setInclusions(String inclusions) { this.inclusions = inclusions; }
    
    public String getExclusions() { return exclusions; }
    public void setExclusions(String exclusions) { this.exclusions = exclusions; }
    
    public String getAccommodationType() { return accommodationType; }
    public void setAccommodationType(String accommodationType) { this.accommodationType = accommodationType; }
    
    public String getTransportMode() { return transportMode; }
    public void setTransportMode(String transportMode) { this.transportMode = transportMode; }
    
    public String getMealPlan() { return mealPlan; }
    public void setMealPlan(String mealPlan) { this.mealPlan = mealPlan; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
