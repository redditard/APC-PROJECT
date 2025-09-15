package com.tourism.core.service;

import com.tourism.common.dto.request.PackageCreateRequest;
import com.tourism.common.dto.request.PackageUpdateRequest;
import com.tourism.common.dto.response.PackageResponseDTO;
import com.tourism.common.exception.ResourceNotFoundException;
import com.tourism.common.exception.BusinessLogicException;
import com.tourism.core.entity.Package;
import com.tourism.core.entity.Tour;
import com.tourism.core.repository.PackageRepository;
import com.tourism.core.repository.TourRepository;
import com.tourism.core.mapper.PackageMapper;
import com.tourism.common.enums.TourStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PackageService {
    
    private final PackageRepository packageRepository;
    private final TourRepository tourRepository;
    private final PackageMapper packageMapper;
    
    @Autowired
    public PackageService(PackageRepository packageRepository, 
                         TourRepository tourRepository,
                         PackageMapper packageMapper) {
        this.packageRepository = packageRepository;
        this.tourRepository = tourRepository;
        this.packageMapper = packageMapper;
    }
    
    /**
     * Create a new package
     */
    public PackageResponseDTO createPackage(PackageCreateRequest request) {
        validateTourExists(request.getTourId());
        
        Package packageEntity = packageMapper.toEntity(request);
        packageEntity.setTourId(request.getTourId());
        
        Package savedPackage = packageRepository.save(packageEntity);
        return packageMapper.toResponseDTO(savedPackage);
    }
    
    /**
     * Update a package
     */
    public PackageResponseDTO updatePackage(Long id, PackageUpdateRequest request) {
        Package existingPackage = packageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Package", "id", id));
        
        try {
            packageMapper.updateEntityFromRequest(request, existingPackage);
            Package savedPackage = packageRepository.save(existingPackage);
            return packageMapper.toResponseDTO(savedPackage);
            
        } catch (ObjectOptimisticLockingFailureException e) {
            throw new BusinessLogicException("Package was modified by another user. Please refresh and try again.", e);
        }
    }
    
    /**
     * Delete a package
     */
    public void deletePackage(Long id) {
        Package packageEntity = packageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Package", "id", id));
        
        // Check if package has active bookings before deletion
        // This would be implemented when booking service is ready
        
        packageRepository.delete(packageEntity);
    }
    
    /**
     * Get package by ID
     */
    @Transactional(readOnly = true)
    public PackageResponseDTO getPackageById(Long id) {
        Package packageEntity = packageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Package", "id", id));
        return packageMapper.toResponseDTO(packageEntity);
    }
    
    /**
     * Get all packages with pagination and filtering
     */
    @Transactional(readOnly = true)
    public Page<PackageResponseDTO> getAllPackages(Pageable pageable, Long tourId, 
                                                  BigDecimal minPrice, BigDecimal maxPrice) {
        Page<Package> packages;
        
        if (tourId != null && minPrice != null && maxPrice != null) {
            List<Package> packageList = packageRepository.findByTourIdAndPriceRange(tourId, minPrice, maxPrice);
            packages = new org.springframework.data.domain.PageImpl<>(packageList, pageable, packageList.size());
        } else if (tourId != null) {
            packages = packageRepository.findByTourId(tourId, pageable);
        } else if (minPrice != null && maxPrice != null) {
            List<Package> packageList = packageRepository.findByPriceRange(minPrice, maxPrice);
            packages = new org.springframework.data.domain.PageImpl<>(packageList, pageable, packageList.size());
        } else {
            packages = packageRepository.findAll(pageable);
        }
        
        return packages.map(packageMapper::toResponseDTO);
    }
    
    /**
     * Get packages by tour ID
     */
    @Transactional(readOnly = true)
    public List<PackageResponseDTO> getPackagesByTourId(Long tourId) {
        List<Package> packages = packageRepository.findByTourIdOrderByPriceAsc(tourId);
        return packages.stream()
                .map(packageMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Search packages
     */
    @Transactional(readOnly = true)
    public List<PackageResponseDTO> searchPackages(String query, int limit) {
        List<Package> packages = packageRepository.searchPackages(query);
        return packages.stream()
                .limit(limit)
                .map(packageMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get packages by price range
     */
    @Transactional(readOnly = true)
    public List<PackageResponseDTO> getPackagesByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        List<Package> packages = packageRepository.findByPriceRange(minPrice, maxPrice);
        return packages.stream()
                .map(packageMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get packages by accommodation type
     */
    @Transactional(readOnly = true)
    public List<PackageResponseDTO> getPackagesByAccommodationType(String accommodationType) {
        List<Package> packages = packageRepository.findByAccommodationType(accommodationType);
        return packages.stream()
                .map(packageMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Validate that the associated tour exists and is active
     */
    private void validateTourExists(Long tourId) {
        Optional<Tour> tour = tourRepository.findById(tourId);
        if (tour.isEmpty()) {
            throw new ResourceNotFoundException("Tour", "id", tourId);
        }
        
        if (tour.get().getStatus() != TourStatus.ACTIVE) {
            throw new BusinessLogicException("Cannot create package for inactive tour");
        }
    }
}
