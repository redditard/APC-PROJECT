package com.tourism.core.mapper;

import com.tourism.common.dto.request.TourCreateRequest;
import com.tourism.common.dto.request.TourUpdateRequest;
import com.tourism.common.dto.response.TourResponseDTO;
import com.tourism.core.entity.Tour;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface TourMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "status", ignore = true)
    Tour toEntity(TourCreateRequest request);
    
    @Mapping(source = "id", target = "tourId")
    @Mapping(source = "name", target = "tourName")
    @Mapping(source = "maxParticipants", target = "maxCapacity")
    @Mapping(target = "availableSlots", expression = "java(calculateAvailableSlots(tour))")
    @Mapping(target = "itinerary", constant = "")
    @Mapping(target = "packages", ignore = true)
    TourResponseDTO toResponseDTO(Tour tour);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "status", ignore = true)
    void updateEntityFromRequest(TourCreateRequest request, @MappingTarget Tour tour);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "status", ignore = true)
    void updateEntityFromRequest(TourUpdateRequest request, @MappingTarget Tour tour);
    
    default int calculateAvailableSlots(Tour tour) {
        // For now, return the max capacity. In real implementation, 
        // this would check against current bookings
        return tour.getMaxParticipants() != null ? tour.getMaxParticipants() : 0;
    }
}
