package com.tourism.core.controller;

import com.tourism.common.dto.request.PackageCreateRequest;
import com.tourism.common.dto.request.PackageUpdateRequest;
import com.tourism.common.dto.response.ApiResponse;
import com.tourism.common.dto.response.PagedResponse;
import com.tourism.common.dto.response.PackageResponseDTO;
import com.tourism.core.service.PackageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/packages")
@Tag(name = "Package Management", description = "Operations for managing tour packages")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PackageController {

    private final PackageService packageService;

    public PackageController(PackageService packageService) {
        this.packageService = packageService;
    }

    @PostMapping
    @Operation(summary = "Create a new package", description = "Creates a new tour package with the provided information")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Package created successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input data"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Tour not found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Package already exists")
    })
    public ResponseEntity<ApiResponse<PackageResponseDTO>> createPackage(
            @Valid @RequestBody PackageCreateRequest request) {
        
        PackageResponseDTO packageDto = packageService.createPackage(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Package created successfully", packageDto));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get package by ID", description = "Retrieves a specific package by its ID")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Package found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Package not found")
    })
    public ResponseEntity<ApiResponse<PackageResponseDTO>> getPackageById(
            @Parameter(description = "Package ID", required = true)
            @PathVariable Long id) {
        
        PackageResponseDTO packageDto = packageService.getPackageById(id);
        return ResponseEntity.ok(ApiResponse.success("Package retrieved successfully", packageDto));
    }

    @GetMapping
    @Operation(summary = "Get all packages", description = "Retrieves a paginated list of all packages with optional filtering")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Packages retrieved successfully")
    })
    public ResponseEntity<ApiResponse<PagedResponse<PackageResponseDTO>>> getAllPackages(
            @Parameter(description = "Page number (0-based)")
            @RequestParam(defaultValue = "0") int page,
            
            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "10") int size,
            
            @Parameter(description = "Sort field")
            @RequestParam(defaultValue = "packageName") String sortBy,
            
            @Parameter(description = "Sort direction")
            @RequestParam(defaultValue = "asc") String sortDir,
            
            @Parameter(description = "Filter by tour ID")
            @RequestParam(required = false) Long tourId,
            
            @Parameter(description = "Minimum price filter")
            @RequestParam(required = false) BigDecimal minPrice,
            
            @Parameter(description = "Maximum price filter")
            @RequestParam(required = false) BigDecimal maxPrice) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<PackageResponseDTO> packages = packageService.getAllPackages(
                pageable, tourId, minPrice, maxPrice);
        PagedResponse<PackageResponseDTO> pagedResponse = PagedResponse.of(
                packages.getContent(), page, size, packages.getTotalElements());
        
        return ResponseEntity.ok(ApiResponse.success("Packages retrieved successfully", pagedResponse));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update package", description = "Updates an existing package with the provided information")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Package updated successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Package not found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<ApiResponse<PackageResponseDTO>> updatePackage(
            @Parameter(description = "Package ID", required = true)
            @PathVariable Long id,
            @Valid @RequestBody PackageUpdateRequest request) {
        
        PackageResponseDTO packageDto = packageService.updatePackage(id, request);
        return ResponseEntity.ok(ApiResponse.success("Package updated successfully", packageDto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete package", description = "Deletes a package by its ID")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Package deleted successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Package not found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Cannot delete package with existing bookings")
    })
    public ResponseEntity<ApiResponse<Void>> deletePackage(
            @Parameter(description = "Package ID", required = true)
            @PathVariable Long id) {
        
        packageService.deletePackage(id);
        return ResponseEntity.ok(ApiResponse.success("Package deleted successfully"));
    }

    @GetMapping("/tour/{tourId}")
    @Operation(summary = "Get packages by tour", description = "Retrieves all packages for a specific tour")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Packages retrieved successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Tour not found")
    })
    public ResponseEntity<ApiResponse<List<PackageResponseDTO>>> getPackagesByTour(
            @Parameter(description = "Tour ID", required = true)
            @PathVariable Long tourId) {
        
        List<PackageResponseDTO> packages = packageService.getPackagesByTourId(tourId);
        return ResponseEntity.ok(ApiResponse.success("Packages retrieved successfully", packages));
    }

    @GetMapping("/search")
    @Operation(summary = "Search packages", description = "Search packages by name or accommodation type")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Search completed successfully")
    })
    public ResponseEntity<ApiResponse<List<PackageResponseDTO>>> searchPackages(
            @Parameter(description = "Search query", required = true)
            @RequestParam String query,
            
            @Parameter(description = "Maximum results to return")
            @RequestParam(defaultValue = "20") int limit) {
        
        List<PackageResponseDTO> packages = packageService.searchPackages(query, limit);
        return ResponseEntity.ok(ApiResponse.success("Search completed successfully", packages));
    }

    @GetMapping("/price-range")
    @Operation(summary = "Get packages by price range", description = "Retrieves packages within a specific price range")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Packages retrieved successfully")
    })
    public ResponseEntity<ApiResponse<List<PackageResponseDTO>>> getPackagesByPriceRange(
            @Parameter(description = "Minimum price", required = true)
            @RequestParam BigDecimal minPrice,
            
            @Parameter(description = "Maximum price", required = true)
            @RequestParam BigDecimal maxPrice) {
        
        List<PackageResponseDTO> packages = packageService.getPackagesByPriceRange(minPrice, maxPrice);
        return ResponseEntity.ok(ApiResponse.success("Packages retrieved successfully", packages));
    }

    @GetMapping("/accommodation/{type}")
    @Operation(summary = "Get packages by accommodation type", description = "Retrieves packages with specific accommodation type")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Packages retrieved successfully")
    })
    public ResponseEntity<ApiResponse<List<PackageResponseDTO>>> getPackagesByAccommodationType(
            @Parameter(description = "Accommodation type", required = true)
            @PathVariable String type) {
        
        List<PackageResponseDTO> packages = packageService.getPackagesByAccommodationType(type);
        return ResponseEntity.ok(ApiResponse.success("Packages retrieved successfully", packages));
    }
}
