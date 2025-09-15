package com.tourism.common.dto.request;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class PackageUpdateRequest {
    
    @Size(min = 3, max = 100, message = "Package name must be between 3 and 100 characters")
    private String packageName;
    
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    @DecimalMax(value = "999999.99", message = "Price cannot exceed 999,999.99")
    private BigDecimal price;
    
    @Size(max = 2000, message = "Inclusions cannot exceed 2000 characters")
    private String inclusions;
    
    @Size(max = 2000, message = "Exclusions cannot exceed 2000 characters")
    private String exclusions;
    
    @Size(min = 2, max = 50, message = "Accommodation type must be between 2 and 50 characters")
    private String accommodationType;
    
    @Size(min = 2, max = 50, message = "Transport mode must be between 2 and 50 characters")
    private String transportMode;
    
    @Size(min = 2, max = 50, message = "Meal plan must be between 2 and 50 characters")
    private String mealPlan;
    
    // Constructors
    public PackageUpdateRequest() {}
    
    public PackageUpdateRequest(String packageName, BigDecimal price,
                              String inclusions, String exclusions, String accommodationType,
                              String transportMode, String mealPlan) {
        this.packageName = packageName;
        this.price = price;
        this.inclusions = inclusions;
        this.exclusions = exclusions;
        this.accommodationType = accommodationType;
        this.transportMode = transportMode;
        this.mealPlan = mealPlan;
    }
    
    // Getters and Setters
    public String getPackageName() { return packageName; }
    public void setPackageName(String packageName) { this.packageName = packageName; }
    
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
}
