package com.tourism.itinerary.service;

import com.tourism.itinerary.dto.ItineraryResponse;
import com.tourism.itinerary.model.Activity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PdfGenerationService {
    
    /**
     * Generate PDF for tour itinerary
     */
    public byte[] generateItineraryPdf(Long tourId, List<ItineraryResponse> itineraries) throws IOException {
        // This is a simplified implementation using basic string formatting
        // In a real application, you would use a proper PDF library like iText or Apache PDFBox
        
        StringBuilder content = new StringBuilder();
        content.append("TOUR ITINERARY\n");
        content.append("==============\n\n");
        content.append("Tour ID: ").append(tourId).append("\n");
        content.append("Total Days: ").append(itineraries.size()).append("\n\n");
        
        for (ItineraryResponse itinerary : itineraries) {
            content.append("DAY ").append(itinerary.getDayNumber()).append(": ")
                   .append(itinerary.getDayTitle() != null ? itinerary.getDayTitle() : "Day " + itinerary.getDayNumber())
                   .append("\n");
            content.append("=".repeat(50)).append("\n\n");
            
            // Activities
            if (itinerary.getActivities() != null && !itinerary.getActivities().isEmpty()) {
                content.append("ACTIVITIES:\n");
                for (Activity activity : itinerary.getActivities()) {
                    content.append("• ").append(activity.getTime()).append(" - ")
                           .append(activity.getTitle()).append("\n");
                    if (activity.getDescription() != null) {
                        content.append("  ").append(activity.getDescription()).append("\n");
                    }
                    if (activity.getLocation() != null) {
                        content.append("  Location: ").append(activity.getLocation()).append("\n");
                    }
                    if (activity.getDuration() != null) {
                        content.append("  Duration: ").append(activity.getDuration()).append(" minutes\n");
                    }
                    content.append("\n");
                }
            }
            
            // Meals
            if (itinerary.getMeals() != null && !itinerary.getMeals().isEmpty()) {
                content.append("MEALS: ").append(String.join(", ", itinerary.getMeals())).append("\n\n");
            }
            
            // Accommodation
            if (itinerary.getAccommodation() != null) {
                content.append("ACCOMMODATION: ").append(itinerary.getAccommodation()).append("\n\n");
            }
            
            // Transport
            if (itinerary.getTransportDetails() != null) {
                content.append("TRANSPORT: ").append(itinerary.getTransportDetails()).append("\n\n");
            }
            
            // Notes
            if (itinerary.getNotes() != null) {
                content.append("NOTES: ").append(itinerary.getNotes()).append("\n\n");
            }
            
            content.append("-".repeat(50)).append("\n\n");
        }
        
        // Add footer
        content.append("\nGenerated on: ")
               .append(java.time.LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm")))
               .append("\n");
        content.append("Tourism Management System\n");
        
        // Convert to bytes (in a real implementation, you would use a proper PDF library)
        return content.toString().getBytes();
    }
    
    /**
     * Generate PDF for a single day itinerary
     */
    public byte[] generateDayItineraryPdf(ItineraryResponse itinerary) throws IOException {
        StringBuilder content = new StringBuilder();
        content.append("DAY ITINERARY\n");
        content.append("=============\n\n");
        content.append("Tour ID: ").append(itinerary.getTourId()).append("\n");
        content.append("Day: ").append(itinerary.getDayNumber()).append("\n");
        content.append("Title: ").append(itinerary.getDayTitle() != null ? itinerary.getDayTitle() : "Day " + itinerary.getDayNumber()).append("\n\n");
        
        // Activities
        if (itinerary.getActivities() != null && !itinerary.getActivities().isEmpty()) {
            content.append("ACTIVITIES:\n");
            content.append("-".repeat(20)).append("\n");
            for (Activity activity : itinerary.getActivities()) {
                content.append("Time: ").append(activity.getTime()).append("\n");
                content.append("Activity: ").append(activity.getTitle()).append("\n");
                if (activity.getDescription() != null) {
                    content.append("Description: ").append(activity.getDescription()).append("\n");
                }
                if (activity.getLocation() != null) {
                    content.append("Location: ").append(activity.getLocation()).append("\n");
                }
                if (activity.getDuration() != null) {
                    content.append("Duration: ").append(activity.getDuration()).append(" minutes\n");
                }
                content.append("\n");
            }
        }
        
        // Meals
        if (itinerary.getMeals() != null && !itinerary.getMeals().isEmpty()) {
            content.append("MEALS:\n");
            content.append("-".repeat(20)).append("\n");
            for (String meal : itinerary.getMeals()) {
                content.append("• ").append(meal).append("\n");
            }
            content.append("\n");
        }
        
        // Accommodation
        if (itinerary.getAccommodation() != null) {
            content.append("ACCOMMODATION:\n");
            content.append("-".repeat(20)).append("\n");
            content.append(itinerary.getAccommodation()).append("\n\n");
        }
        
        // Transport
        if (itinerary.getTransportDetails() != null) {
            content.append("TRANSPORT:\n");
            content.append("-".repeat(20)).append("\n");
            content.append(itinerary.getTransportDetails()).append("\n\n");
        }
        
        // Notes
        if (itinerary.getNotes() != null) {
            content.append("NOTES:\n");
            content.append("-".repeat(20)).append("\n");
            content.append(itinerary.getNotes()).append("\n\n");
        }
        
        // Add footer
        content.append("\nGenerated on: ")
               .append(java.time.LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm")))
               .append("\n");
        content.append("Tourism Management System\n");
        
        return content.toString().getBytes();
    }
}
