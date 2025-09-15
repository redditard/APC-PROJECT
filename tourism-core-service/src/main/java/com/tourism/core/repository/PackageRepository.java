package com.tourism.core.repository;

import com.tourism.core.entity.Package;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface PackageRepository extends JpaRepository<Package, Long> {
    
    List<Package> findByTourId(Long tourId);
    
    @Query("SELECT p FROM Package p WHERE p.tourId = :tourId")
    Page<Package> findByTourId(@Param("tourId") Long tourId, Pageable pageable);
    
    @Query("SELECT p FROM Package p WHERE p.tourId = :tourId ORDER BY p.price ASC")
    List<Package> findByTourIdOrderByPriceAsc(@Param("tourId") Long tourId);
    
    @Query("SELECT p FROM Package p WHERE p.price BETWEEN :minPrice AND :maxPrice")
    List<Package> findByPriceRange(@Param("minPrice") BigDecimal minPrice, 
                                   @Param("maxPrice") BigDecimal maxPrice);
    
    @Query("SELECT p FROM Package p WHERE p.tourId = :tourId AND p.price BETWEEN :minPrice AND :maxPrice")
    List<Package> findByTourIdAndPriceRange(@Param("tourId") Long tourId,
                                           @Param("minPrice") BigDecimal minPrice, 
                                           @Param("maxPrice") BigDecimal maxPrice);
    
    @Query("SELECT p FROM Package p WHERE p.accommodationType = :accommodationType")
    List<Package> findByAccommodationType(@Param("accommodationType") String accommodationType);
    
    @Query("SELECT p FROM Package p WHERE p.transportMode = :transportMode")
    List<Package> findByTransportMode(@Param("transportMode") String transportMode);
    
    @Query("SELECT p FROM Package p WHERE p.mealPlan = :mealPlan")
    List<Package> findByMealPlan(@Param("mealPlan") String mealPlan);
    
    @Query("SELECT p FROM Package p WHERE " +
           "LOWER(p.packageName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.accommodationType) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.transportMode) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Package> searchPackages(@Param("query") String query);
    
    @Query("SELECT p FROM Package p JOIN p.tour t WHERE t.status = 'ACTIVE'")
    List<Package> findActivePackages();
    
    @Query("SELECT p FROM Package p WHERE p.id = :id AND p.version = :version")
    Optional<Package> findByIdAndVersion(@Param("id") Long id, @Param("version") Integer version);
    
    @Query("SELECT COUNT(p) FROM Package p WHERE p.tourId = :tourId")
    long countByTourId(@Param("tourId") Long tourId);
}
