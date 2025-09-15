package com.tourism.core.controller;

import com.tourism.common.dto.request.TourCreateRequest;
import com.tourism.common.dto.request.TourUpdateRequest;
import com.tourism.common.dto.response.ApiResponse;
import com.tourism.common.dto.response.PagedResponse;
import com.tourism.common.dto.response.TourResponseDTO;
import com.tourism.core.service.TourService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tours")
@Tag(name = "Tour Management", description = "Operations for managing tours")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TourController {

    private final TourService tourService;

    public TourController(TourService tourService) {
        this.tourService = tourService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('TOUR_OPERATOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create a new tour", description = "Creates a new tour with the provided information")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Tour created successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input data"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Tour already exists"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<ApiResponse<TourResponseDTO>> createTour(
            @Valid @RequestBody TourCreateRequest request) {
        
        TourResponseDTO tour = tourService.createTour(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tour created successfully", tour));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get tour by ID", description = "Retrieves a specific tour by its ID")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Tour found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Tour not found")
    })
    public ResponseEntity<ApiResponse<TourResponseDTO>> getTourById(
            @Parameter(description = "Tour ID", required = true)
            @PathVariable Long id) {
        
        TourResponseDTO tour = tourService.getTourById(id);
        return ResponseEntity.ok(ApiResponse.success("Tour retrieved successfully", tour));
    }

    @GetMapping
    @Operation(summary = "Get all tours", description = "Retrieves a paginated list of all tours with optional filtering")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Tours retrieved successfully")
    })
    public ResponseEntity<ApiResponse<PagedResponse<TourResponseDTO>>> getAllTours(
            @Parameter(description = "Page number (0-based)")
            @RequestParam(defaultValue = "0") int page,
            
            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "10") int size,
            
            @Parameter(description = "Sort field")
            @RequestParam(defaultValue = "name") String sortBy,
            
            @Parameter(description = "Sort direction")
            @RequestParam(defaultValue = "asc") String sortDir,
            
            @Parameter(description = "Filter by destination")
            @RequestParam(required = false) String destination,
            
            @Parameter(description = "Filter by status")
            @RequestParam(required = false) String status) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<TourResponseDTO> tours = tourService.getAllTours(pageable, destination, status);
        PagedResponse<TourResponseDTO> pagedResponse = PagedResponse.of(
                tours.getContent(), page, size, tours.getTotalElements());
        
        return ResponseEntity.ok(ApiResponse.success("Tours retrieved successfully", pagedResponse));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TOUR_OPERATOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update tour", description = "Updates an existing tour with the provided information")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Tour updated successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Tour not found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input data"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<ApiResponse<TourResponseDTO>> updateTour(
            @Parameter(description = "Tour ID", required = true)
            @PathVariable Long id,
            @Valid @RequestBody TourUpdateRequest request) {
        
        TourResponseDTO tour = tourService.updateTour(id, request);
        return ResponseEntity.ok(ApiResponse.success("Tour updated successfully", tour));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TOUR_OPERATOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete tour", description = "Deletes a tour by its ID")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Tour deleted successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Tour not found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Cannot delete tour with existing bookings"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<ApiResponse<Void>> deleteTour(
            @Parameter(description = "Tour ID", required = true)
            @PathVariable Long id) {
        
        tourService.deleteTour(id);
        return ResponseEntity.ok(ApiResponse.success("Tour deleted successfully"));
    }

    @GetMapping("/search")
    @Operation(summary = "Search tours", description = "Search tours by name, destination, or description")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Search completed successfully")
    })
    public ResponseEntity<ApiResponse<List<TourResponseDTO>>> searchTours(
            @Parameter(description = "Search query", required = true)
            @RequestParam String query,
            
            @Parameter(description = "Maximum results to return")
            @RequestParam(defaultValue = "20") int limit) {
        
        List<TourResponseDTO> tours = tourService.searchTours(query, limit);
        return ResponseEntity.ok(ApiResponse.success("Search completed successfully", tours));
    }

    @GetMapping("/destination/{destination}")
    @Operation(summary = "Get tours by destination", description = "Retrieves tours for a specific destination")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Tours retrieved successfully")
    })
    public ResponseEntity<ApiResponse<List<TourResponseDTO>>> getToursByDestination(
            @Parameter(description = "Destination name", required = true)
            @PathVariable String destination) {
        
        List<TourResponseDTO> tours = tourService.getToursByDestination(destination);
        return ResponseEntity.ok(ApiResponse.success("Tours retrieved successfully", tours));
    }

    @GetMapping("/available")
    @Operation(summary = "Get available tours", description = "Retrieves tours that are currently available for booking")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Available tours retrieved successfully")
    })
    public ResponseEntity<ApiResponse<List<TourResponseDTO>>> getAvailableTours() {
        
        List<TourResponseDTO> tours = tourService.getAvailableTours();
        return ResponseEntity.ok(ApiResponse.success("Available tours retrieved successfully", tours));
    }
}
