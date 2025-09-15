package com.tourism.core.repository;

import com.tourism.core.entity.Tour;
import com.tourism.common.enums.TourStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long> {
    
    List<Tour> findByStatus(TourStatus status);
    
    @Query("SELECT t FROM Tour t WHERE t.status = :status")
    Page<Tour> findByStatus(@Param("status") TourStatus status, Pageable pageable);
    
    @Query("SELECT t FROM Tour t WHERE " +
           "(:destination IS NULL OR LOWER(t.destination) LIKE LOWER(CONCAT('%', :destination, '%'))) AND " +
           "(:startDate IS NULL OR t.startDate >= :startDate) AND " +
           "(:endDate IS NULL OR t.endDate <= :endDate) AND " +
           "t.status = 'ACTIVE'")
    List<Tour> findAvailableTours(@Param("destination") String destination,
                                 @Param("startDate") LocalDate startDate,
                                 @Param("endDate") LocalDate endDate);
    
    @Query("SELECT t FROM Tour t WHERE " +
           "t.startDate BETWEEN :startDate AND :endDate AND t.status = 'ACTIVE'")
    List<Tour> findToursInDateRange(@Param("startDate") LocalDate startDate,
                                   @Param("endDate") LocalDate endDate);
    
    List<Tour> findByDestinationContainingIgnoreCaseAndStatus(String destination, TourStatus status);
    
    List<Tour> findByDestinationContainingIgnoreCase(String destination);
    
    List<Tour> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT t FROM Tour t WHERE " +
           "LOWER(t.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(t.destination) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(t.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Tour> searchTours(@Param("query") String query);
    
    @Query("SELECT COUNT(t) FROM Tour t WHERE t.status = :status")
    long countByStatus(@Param("status") TourStatus status);
}
