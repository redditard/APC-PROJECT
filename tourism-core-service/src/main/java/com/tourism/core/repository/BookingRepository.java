package com.tourism.core.repository;

import com.tourism.core.entity.Booking;
import com.tourism.common.enums.BookingStatus;
import com.tourism.common.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    Optional<Booking> findByBookingReference(String bookingReference);
    
    List<Booking> findByTouristId(Long touristId);
    
    Page<Booking> findByTouristId(Long touristId, Pageable pageable);
    
    List<Booking> findByPackageId(Long packageId);
    
    Page<Booking> findByPackageId(Long packageId, Pageable pageable);
    
    List<Booking> findByStatus(BookingStatus status);
    
    Page<Booking> findByStatus(BookingStatus status, Pageable pageable);
    
    List<Booking> findByPaymentStatus(PaymentStatus paymentStatus);
    
    Page<Booking> findByPaymentStatus(PaymentStatus paymentStatus, Pageable pageable);
    
    @Query("SELECT b FROM Booking b WHERE b.touristId = :touristId ORDER BY b.bookingDate DESC")
    List<Booking> findByTouristIdOrderByBookingDateDesc(@Param("touristId") Long touristId);
    
    @Query("SELECT b FROM Booking b WHERE " +
           "b.bookingDate BETWEEN :startDate AND :endDate")
    List<Booking> findBookingsInDateRange(@Param("startDate") LocalDateTime startDate,
                                         @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT b FROM Booking b WHERE " +
           "b.bookingDate BETWEEN :startDate AND :endDate")
    Page<Booking> findBookingsInDateRange(@Param("startDate") LocalDateTime startDate,
                                         @Param("endDate") LocalDateTime endDate,
                                         Pageable pageable);
    
    @Query("SELECT b FROM Booking b WHERE " +
           "b.packageId = :packageId AND b.status IN ('CONFIRMED', 'PENDING')")
    List<Booking> findActiveBookingsByPackageId(@Param("packageId") Long packageId);
    
    @Query("SELECT SUM(b.numberOfPeople) FROM Booking b WHERE " +
           "b.packageId = :packageId AND b.status IN ('CONFIRMED', 'PENDING')")
    Integer getTotalBookedPeopleByPackageId(@Param("packageId") Long packageId);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE " +
           "b.touristId = :touristId AND b.status = :status")
    long countByTouristIdAndStatus(@Param("touristId") Long touristId, 
                                   @Param("status") BookingStatus status);
    
    @Query("SELECT b FROM Booking b WHERE b.status = 'PENDING' AND " +
           "b.bookingDate < :cutoffDate")
    List<Booking> findExpiredPendingBookings(@Param("cutoffDate") LocalDateTime cutoffDate);
    
    // Search methods for filtering
    @Query("SELECT b FROM Booking b WHERE " +
           "(:status IS NULL OR b.status = :status) AND " +
           "(:customerId IS NULL OR b.touristId = :customerId) AND " +
           "(:packageId IS NULL OR b.packageId = :packageId)")
    Page<Booking> findBookingsWithFilters(@Param("status") BookingStatus status,
                                         @Param("customerId") Long customerId,
                                         @Param("packageId") Long packageId,
                                         Pageable pageable);
    
    @Query("SELECT b FROM Booking b WHERE " +
           "LOWER(b.bookingReference) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Booking> findByBookingReferenceContainingIgnoreCase(@Param("searchTerm") String searchTerm,
                                                            Pageable pageable);
}
