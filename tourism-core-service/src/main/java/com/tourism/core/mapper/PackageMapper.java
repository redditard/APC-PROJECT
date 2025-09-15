package com.tourism.core.mapper;

import com.tourism.common.dto.request.PackageCreateRequest;
import com.tourism.common.dto.request.PackageUpdateRequest;
import com.tourism.common.dto.response.PackageResponseDTO;
import com.tourism.core.entity.Package;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface PackageMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "tour", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "tourId", ignore = true)
    Package toEntity(PackageCreateRequest request);
    
    @Mapping(source = "id", target = "packageId")
    @Mapping(source = "tour.id", target = "tourId")
    @Mapping(source = "tour.name", target = "tourName")
    PackageResponseDTO toResponseDTO(Package packageEntity);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "tour", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "tourId", ignore = true)
    void updateEntityFromRequest(PackageCreateRequest request, @MappingTarget Package packageEntity);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "tour", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "tourId", ignore = true)
    void updateEntityFromRequest(PackageUpdateRequest request, @MappingTarget Package packageEntity);
}
