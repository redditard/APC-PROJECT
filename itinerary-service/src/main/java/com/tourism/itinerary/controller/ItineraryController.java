package com.tourism.itinerary.controller;

import com.tourism.itinerary.dto.ItineraryGenerationRequest;
import com.tourism.itinerary.dto.ItineraryRequest;
import com.tourism.itinerary.dto.ItineraryResponse;
import com.tourism.itinerary.service.ItineraryService;
import com.tourism.itinerary.service.PdfGenerationService;
import com.tourism.common.dto.response.ApiResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import java.io.IOException;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/itineraries")
@Tag(name = "Itinerary Management", description = "APIs for managing tour itineraries")
@SecurityRequirement(name = "bearerAuth")
public class ItineraryController {
    
    private final ItineraryService itineraryService;
    private final PdfGenerationService pdfGenerationService;
    
    @Autowired
    public ItineraryController(ItineraryService itineraryService, PdfGenerationService pdfGenerationService) {
        this.itineraryService = itineraryService;
        this.pdfGenerationService = pdfGenerationService;
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('TOUR_OPERATOR')")
    @Operation(summary = "Create a new itinerary")
    public ResponseEntity<ApiResponse<ItineraryResponse>> createItinerary(
            @Valid @RequestBody ItineraryRequest request,
            Principal principal) {
        
        ItineraryResponse response = itineraryService.createItinerary(request, principal.getName());
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Itinerary created successfully", response));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TOUR_OPERATOR')")
    @Operation(summary = "Update an itinerary")
    public ResponseEntity<ApiResponse<ItineraryResponse>> updateItinerary(
            @Parameter(description = "Itinerary ID") @PathVariable String id,
            @Valid @RequestBody ItineraryRequest request,
            Principal principal) {
        
        ItineraryResponse response = itineraryService.updateItinerary(id, request, principal.getName());
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Itinerary updated successfully", response));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get itinerary by ID")
    public ResponseEntity<ApiResponse<ItineraryResponse>> getItineraryById(
            @Parameter(description = "Itinerary ID") @PathVariable String id) {
        
        ItineraryResponse response = itineraryService.getItineraryById(id);
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Itinerary retrieved successfully", response));
    }
    
    @GetMapping("/tour/{tourId}")
    @Operation(summary = "Get tour itineraries")
    public ResponseEntity<ApiResponse<List<ItineraryResponse>>> getItinerariesByTourId(
            @Parameter(description = "Tour ID") @PathVariable Long tourId) {
        
        List<ItineraryResponse> responses = itineraryService.getItinerariesByTourId(tourId);
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Itineraries retrieved successfully", responses));
    }
    
    @GetMapping("/tour/{tourId}/day/{dayNumber}")
    @Operation(summary = "Get specific day itinerary")
    public ResponseEntity<ApiResponse<ItineraryResponse>> getItineraryByTourAndDay(
            @Parameter(description = "Tour ID") @PathVariable Long tourId,
            @Parameter(description = "Day number") @PathVariable Integer dayNumber) {
        
        ItineraryResponse response = itineraryService.getItineraryByTourAndDay(tourId, dayNumber);
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Day itinerary retrieved successfully", response));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TOUR_OPERATOR')")
    @Operation(summary = "Delete an itinerary")
    public ResponseEntity<ApiResponse<Void>> deleteItinerary(
            @Parameter(description = "Itinerary ID") @PathVariable String id) {
        
        itineraryService.deleteItinerary(id);
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Itinerary deleted successfully", null));
    }
    
    @DeleteMapping("/tour/{tourId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete all tour itineraries")
    public ResponseEntity<ApiResponse<Void>> deleteItinerariesByTourId(
            @Parameter(description = "Tour ID") @PathVariable Long tourId) {
        
        itineraryService.deleteItinerariesByTourId(tourId);
        
        return ResponseEntity.ok(new ApiResponse<>(true, "All itineraries deleted successfully", null));
    }
    
    @PostMapping("/generate")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TOUR_OPERATOR')")
    @Operation(summary = "Generate AI-suggested itinerary")
    public ResponseEntity<ApiResponse<List<ItineraryResponse>>> generateItinerary(
            @Valid @RequestBody ItineraryGenerationRequest request,
            Principal principal) {
        
        List<ItineraryResponse> responses = itineraryService.generateItinerary(request, principal.getName());
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Itinerary generated successfully", responses));
    }
    
    @GetMapping("/tour/{tourId}/pdf")
    @Operation(summary = "Generate tour itinerary PDF")
    public ResponseEntity<byte[]> generateTourItineraryPdf(
            @Parameter(description = "Tour ID") @PathVariable Long tourId) throws IOException {
        
        List<ItineraryResponse> itineraries = itineraryService.getItinerariesByTourId(tourId);
        
        if (itineraries.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        byte[] pdfBytes = pdfGenerationService.generateItineraryPdf(tourId, itineraries);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "tour-" + tourId + "-itinerary.pdf");
        headers.setContentLength(pdfBytes.length);
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
    
    @GetMapping("/{id}/pdf")
    @Operation(summary = "Generate day itinerary PDF")
    public ResponseEntity<byte[]> generateDayItineraryPdf(
            @Parameter(description = "Itinerary ID") @PathVariable String id) throws IOException {
        
        ItineraryResponse itinerary = itineraryService.getItineraryById(id);
        
        byte[] pdfBytes = pdfGenerationService.generateDayItineraryPdf(itinerary);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", 
                "tour-" + itinerary.getTourId() + "-day-" + itinerary.getDayNumber() + "-itinerary.pdf");
        headers.setContentLength(pdfBytes.length);
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
    
    @GetMapping("/tour/{tourId}/stats")
    @Operation(summary = "Get tour itinerary statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTourItineraryStats(
            @Parameter(description = "Tour ID") @PathVariable Long tourId) {
        
        long totalDays = itineraryService.getTotalDaysForTour(tourId);
        boolean hasItinerary = itineraryService.tourHasItinerary(tourId);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("tourId", tourId);
        stats.put("totalDays", totalDays);
        stats.put("hasItinerary", hasItinerary);
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Statistics retrieved successfully", stats));
    }
}
