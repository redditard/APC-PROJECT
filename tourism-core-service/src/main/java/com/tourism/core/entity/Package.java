package com.tourism.core.entity;

import com.tourism.core.service.PackageEntityListener;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "packages")
@EntityListeners(PackageEntityListener.class)
public class Package {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "package_name", nullable = false)
    private String packageName;
    
    @Column(name = "tour_id", nullable = false)
    private Long tourId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_id", insertable = false, updatable = false)
    private Tour tour;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(columnDefinition = "TEXT")
    private String inclusions; // JSON format
    
    @Column(columnDefinition = "TEXT")
    private String exclusions; // JSON format
    
    @Column(name = "accommodation_type")
    private String accommodationType;
    
    @Column(name = "transport_mode")
    private String transportMode;
    
    @Column(name = "meal_plan")
    private String mealPlan;
    
    @Version
    private Integer version; // for optimistic locking
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Constructors
    public Package() {}
    
    public Package(String packageName, Long tourId, BigDecimal price, String inclusions, 
                   String exclusions, String accommodationType, String transportMode, String mealPlan) {
        this.packageName = packageName;
        this.tourId = tourId;
        this.price = price;
        this.inclusions = inclusions;
        this.exclusions = exclusions;
        this.accommodationType = accommodationType;
        this.transportMode = transportMode;
        this.mealPlan = mealPlan;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getPackageName() { return packageName; }
    public void setPackageName(String packageName) { this.packageName = packageName; }
    
    public Long getTourId() { return tourId; }
    public void setTourId(Long tourId) { this.tourId = tourId; }
    
    public Tour getTour() { return tour; }
    public void setTour(Tour tour) { this.tour = tour; }
    
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
    
    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
