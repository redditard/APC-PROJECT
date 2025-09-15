package com.tourism.core.controller;

import com.tourism.common.dto.response.ApiResponse;
import com.tourism.common.enums.UserRole;
import com.tourism.core.entity.User;
import com.tourism.core.repository.UserRepository;
// import com.tourism.core.service.BookingService; // Temporarily disabled
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

/**
 * Controller for admin-only operations
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Admin-only operations")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "*")
public class AdminController {
    
    @Autowired
    private UserRepository userRepository;
    
    // @Autowired
    // private BookingService bookingService; // Temporarily disabled
    
    @GetMapping("/users")
    @Operation(summary = "Get all users", description = "Retrieve all users in the system")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Users retrieved successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
    }
    
    @GetMapping("/users/role/{role}")
    @Operation(summary = "Get users by role", description = "Retrieve all users with specific role")
    public ResponseEntity<ApiResponse<List<User>>> getUsersByRole(
            @Parameter(description = "User role") @PathVariable UserRole role) {
        List<User> users = userRepository.findByRole(role);
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
    }
    
    @PutMapping("/users/{id}/toggle-status")
    @Operation(summary = "Toggle user status", description = "Enable or disable a user account")
    public ResponseEntity<ApiResponse<User>> toggleUserStatus(
            @Parameter(description = "User ID") @PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setEnabled(!user.getEnabled());
        User updatedUser = userRepository.save(user);
        
        return ResponseEntity.ok(ApiResponse.success("User status updated", updatedUser));
    }
    
    @GetMapping("/stats")
    @Operation(summary = "Get system statistics", description = "Get overview statistics for the system")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSystemStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // User statistics
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.findByEnabled(true).size();
        long adminUsers = userRepository.countActiveUsersByRole(UserRole.ADMIN);
        long operatorUsers = userRepository.countActiveUsersByRole(UserRole.TOUR_OPERATOR);
        long touristUsers = userRepository.countActiveUsersByRole(UserRole.TOURIST);
        
        stats.put("users", Map.of(
            "total", totalUsers,
            "active", activeUsers,
            "admins", adminUsers,
            "operators", operatorUsers,
            "tourists", touristUsers
        ));
        
        return ResponseEntity.ok(ApiResponse.success("System statistics", stats));
    }
    
    @DeleteMapping("/users/{id}")
    @Operation(summary = "Delete user", description = "Permanently delete a user account")
    public ResponseEntity<ApiResponse<Void>> deleteUser(
            @Parameter(description = "User ID") @PathVariable Long id) {
        
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        
        userRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully"));
    }
}
