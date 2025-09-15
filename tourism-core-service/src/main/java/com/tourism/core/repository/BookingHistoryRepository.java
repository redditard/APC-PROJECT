package com.tourism.core.repository;

import com.tourism.core.document.BookingHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingHistoryRepository extends MongoRepository<BookingHistory, String> {
    
    Optional<BookingHistory> findByBookingReference(String bookingReference);
    
    List<BookingHistory> findByTouristId(Long touristId);
    
    @Query("{'touristId': ?0, 'createdAt': {$gte: ?1, $lte: ?2}}")
    List<BookingHistory> findByTouristIdAndDateRange(Long touristId, 
                                                     LocalDateTime startDate, 
                                                     LocalDateTime endDate);
    
    @Query("{'createdAt': {$gte: ?0, $lte: ?1}}")
    List<BookingHistory> findByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{'bookingTimeline.status': ?0}")
    List<BookingHistory> findByTimelineStatus(String status);
    
    @Query("{'tourDetails.destination': {$regex: ?0, $options: 'i'}}")
    List<BookingHistory> findByDestination(String destination);
    
    @Query(value = "{'touristId': ?0}", sort = "{'createdAt': -1}")
    List<BookingHistory> findByTouristIdOrderByCreatedAtDesc(Long touristId);
}
