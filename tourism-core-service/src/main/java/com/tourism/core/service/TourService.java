package com.tourism.core.service;

import com.tourism.common.dto.request.TourCreateRequest;
import com.tourism.common.dto.request.TourUpdateRequest;
import com.tourism.common.dto.response.TourResponseDTO;
import com.tourism.common.exception.ResourceNotFoundException;
import com.tourism.common.exception.BusinessLogicException;
import com.tourism.core.entity.Tour;
import com.tourism.core.repository.TourRepository;
import com.tourism.core.mapper.TourMapper;
import com.tourism.common.enums.TourStatus;
// import com.tourism.client.ItineraryServiceClient; // Temporarily disabled
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
 
import java.util.stream.Collectors;

@Service
@Transactional
public class TourService {
    
    private final TourRepository tourRepository;
    private final TourMapper tourMapper;
    private final com.tourism.core.repository.PackageRepository packageRepository;
    // private final ItineraryServiceClient itineraryServiceClient; // Temporarily disabled
    
    public TourService(TourRepository tourRepository, TourMapper tourMapper, com.tourism.core.repository.PackageRepository packageRepository) {
        this.tourRepository = tourRepository;
        this.tourMapper = tourMapper;
        this.packageRepository = packageRepository;
        // this.itineraryServiceClient = itineraryServiceClient; // Temporarily disabled
    }
    
    /**
     * Create a new tour
     */
    public TourResponseDTO createTour(TourCreateRequest request) {
        validateTourDates(request.getStartDate(), request.getEndDate());
        
        Tour tour = tourMapper.toEntity(request);
        tour.setStatus(TourStatus.ACTIVE);
        
        Tour savedTour = tourRepository.save(tour);
        return tourMapper.toResponseDTO(savedTour);
    }
    
    /**
     * Update an existing tour
     */
    public TourResponseDTO updateTour(Long id, TourUpdateRequest request) {
        Tour existingTour = tourRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour", "id", id));
        
        if (request.getStartDate() != null && request.getEndDate() != null) {
            validateTourDates(request.getStartDate(), request.getEndDate());
        }
        
        tourMapper.updateEntityFromRequest(request, existingTour);
        Tour savedTour = tourRepository.save(existingTour);
        return tourMapper.toResponseDTO(savedTour);
    }
    
    /**
     * Soft delete a tour by setting status to INACTIVE
     */
    public void deleteTour(Long id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour", "id", id));
        
        // Check if tour has active bookings
        // This would need to be implemented based on booking relationships
        
        tour.setStatus(TourStatus.INACTIVE);
        tourRepository.save(tour);
    }
    
    /**
     * Get tour by ID
     */
    @Transactional(readOnly = true)
    public TourResponseDTO getTourById(Long id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour", "id", id));
        TourResponseDTO dto = tourMapper.toResponseDTO(tour);
        // Attach packages for this tour
        try {
            java.util.List<com.tourism.core.entity.Package> pkgs = packageRepository.findByTourId(tour.getId());
            java.util.List<com.tourism.common.dto.response.PackageResponseDTO> pkgDtos = pkgs.stream().map(p -> {
                com.tourism.common.dto.response.PackageResponseDTO pr = new com.tourism.common.dto.response.PackageResponseDTO();
                pr.setPackageId(p.getId());
                pr.setPackageName(p.getPackageName());
                pr.setTourId(p.getTourId());
                pr.setTourName(p.getTour() != null ? p.getTour().getName() : "");
                pr.setPrice(p.getPrice());
                pr.setInclusions(p.getInclusions());
                pr.setExclusions(p.getExclusions());
                pr.setAccommodationType(p.getAccommodationType());
                pr.setTransportMode(p.getTransportMode());
                pr.setMealPlan(p.getMealPlan());
                pr.setCreatedAt(p.getCreatedAt());
                pr.setUpdatedAt(p.getUpdatedAt());
                return pr;
            }).collect(java.util.stream.Collectors.toList());
            dto.setPackages(pkgDtos);
        } catch (Exception e) {
            // non-fatal
        }
        return dto;
    }
    
    /**
     * Get all tours with pagination and filtering
     */
    @Transactional(readOnly = true)
    public Page<TourResponseDTO> getAllTours(Pageable pageable, String destination, String status) {
        Page<Tour> tours;
        
        if (destination != null && status != null) {
            TourStatus tourStatus = TourStatus.valueOf(status.toUpperCase());
            List<Tour> tourList = tourRepository.findByDestinationContainingIgnoreCaseAndStatus(destination, tourStatus);
            tours = new org.springframework.data.domain.PageImpl<>(tourList, pageable, tourList.size());
        } else if (destination != null) {
            List<Tour> tourList = tourRepository.findByDestinationContainingIgnoreCase(destination);
            tours = new org.springframework.data.domain.PageImpl<>(tourList, pageable, tourList.size());
        } else if (status != null) {
            TourStatus tourStatus = TourStatus.valueOf(status.toUpperCase());
            tours = tourRepository.findByStatus(tourStatus, pageable);
        } else {
            tours = tourRepository.findAll(pageable);
        }
        
        return tours.map(t -> {
            TourResponseDTO dto = tourMapper.toResponseDTO(t);
            // Attach packages for each tour (lightweight mapping)
            try {
                java.util.List<com.tourism.core.entity.Package> pkgs = packageRepository.findByTourId(t.getId());
                java.util.List<com.tourism.common.dto.response.PackageResponseDTO> pkgDtos = pkgs.stream().map(p -> {
                    com.tourism.common.dto.response.PackageResponseDTO pr = new com.tourism.common.dto.response.PackageResponseDTO();
                    pr.setPackageId(p.getId());
                    pr.setPackageName(p.getPackageName());
                    pr.setTourId(p.getTourId());
                    pr.setTourName(p.getTour() != null ? p.getTour().getName() : "");
                    pr.setPrice(p.getPrice());
                    pr.setInclusions(p.getInclusions());
                    pr.setExclusions(p.getExclusions());
                    pr.setAccommodationType(p.getAccommodationType());
                    pr.setTransportMode(p.getTransportMode());
                    pr.setMealPlan(p.getMealPlan());
                    pr.setCreatedAt(p.getCreatedAt());
                    pr.setUpdatedAt(p.getUpdatedAt());
                    return pr;
                }).collect(java.util.stream.Collectors.toList());
                dto.setPackages(pkgDtos);
            } catch (Exception ignored) {}
            return dto;
        });
    }
    
    /**
     * Search tours by query
     */
    @Transactional(readOnly = true)
    public List<TourResponseDTO> searchTours(String query, int limit) {
        List<Tour> tours = tourRepository.searchTours(query);
        
        return tours.stream()
                .limit(limit)
                .map(tourMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get tours by destination
     */
    @Transactional(readOnly = true)
    public List<TourResponseDTO> getToursByDestination(String destination) {
        List<Tour> tours = tourRepository.findByDestinationContainingIgnoreCaseAndStatus(destination, TourStatus.ACTIVE);
        return tours.stream()
                .map(tourMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get available tours
     */
    @Transactional(readOnly = true)
    public List<TourResponseDTO> getAvailableTours() {
        List<Tour> tours = tourRepository.findByStatus(TourStatus.ACTIVE);
        return tours.stream()
                .filter(tour -> tour.getStartDate().isAfter(LocalDate.now()))
                .map(tourMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get tour with itinerary statistics
     */
    @Transactional(readOnly = true)
    public TourResponseDTO getTourWithItineraryStats(Long id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + id));
        
        TourResponseDTO tourResponse = tourMapper.toResponseDTO(tour);
        
        // Fetch itinerary statistics from itinerary service - temporarily disabled
        /*
        try {
            ApiResponse<Map<String, Object>> statsResponse = itineraryServiceClient.getTourItineraryStats(id);
            if (statsResponse.isSuccess() && statsResponse.getData() != null) {
                Map<String, Object> stats = statsResponse.getData();
                System.out.println("Tour " + id + " has itinerary with " + stats.get("totalDays") + " days");
            }
        } catch (Exception e) {
            System.err.println("Could not fetch itinerary stats for tour " + id + ": " + e.getMessage());
        }
        */
        
        return tourResponse;
    }
    
    /**
     * Check if tour has itinerary
     */
    @Transactional(readOnly = true)
    public boolean tourHasItinerary(Long tourId) {
        // Temporarily disabled until itinerary service integration
        /*
        try {
            ApiResponse<Map<String, Object>> statsResponse = itineraryServiceClient.getTourItineraryStats(tourId);
            if (statsResponse.isSuccess() && statsResponse.getData() != null) {
                return (Boolean) statsResponse.getData().getOrDefault("hasItinerary", false);
            }
        } catch (Exception e) {
            System.err.println("Could not check itinerary for tour " + tourId + ": " + e.getMessage());
        }
        */
        return false;
    }
    
    /**
     * Validate tour dates
     */
    private void validateTourDates(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            throw new BusinessLogicException("Start date and end date are required");
        }
        
        if (startDate.isAfter(endDate)) {
            throw new BusinessLogicException("Start date must be before end date");
        }
        
        if (startDate.isBefore(LocalDate.now())) {
            throw new BusinessLogicException("Start date cannot be in the past");
        }
    }
}
