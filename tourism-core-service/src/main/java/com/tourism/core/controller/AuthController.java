package com.tourism.core.controller;

import com.tourism.common.dto.request.LoginRequest;
import com.tourism.common.dto.request.RegisterRequest;
import com.tourism.common.dto.response.ApiResponse;
import com.tourism.common.dto.response.AuthResponse;
import com.tourism.core.service.AuthService;
import com.tourism.core.security.jwt.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for authentication operations
 */
@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "Authentication management operations")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user and return JWT token")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Login successful"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Invalid credentials"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request")
    })
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Parameter(description = "Login credentials", required = true)
            @Valid @RequestBody LoginRequest loginRequest) {
        
        AuthResponse authResponse = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
    }
    
    @PostMapping("/register")
    @Operation(summary = "User registration", description = "Register a new user and return JWT token")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Registration successful"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request or user already exists"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Username or email already exists")
    })
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Parameter(description = "Registration details", required = true)
            @Valid @RequestBody RegisterRequest registerRequest) {
        
        AuthResponse authResponse = authService.registerUser(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registration successful", authResponse));
    }
    
    @PostMapping("/logout")
    @Operation(summary = "User logout", description = "Logout current user (clears security context)")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Logout successful")
    })
    public ResponseEntity<ApiResponse<Void>> logout() {
        authService.logout();
        return ResponseEntity.ok(ApiResponse.success("Logout successful"));
    }
    
    @GetMapping("/me")
    @Operation(summary = "Get current user", description = "Get details of currently authenticated user")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "User details retrieved"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "User not authenticated")
    })
    public ResponseEntity<ApiResponse<UserInfo>> getCurrentUser() {
        UserPrincipal currentUser = authService.getCurrentUser();
        
        UserInfo userInfo = new UserInfo(
            currentUser.getId(),
            currentUser.getUsername(),
            currentUser.getEmail(),
            currentUser.getRole()
        );
        
        return ResponseEntity.ok(ApiResponse.success("User details retrieved", userInfo));
    }
    
    @GetMapping("/check-role")
    @Operation(summary = "Check user role", description = "Check if current user has admin privileges")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Role check completed"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "User not authenticated")
    })
    public ResponseEntity<ApiResponse<RoleInfo>> checkRole() {
        boolean isAdmin = authService.isAdmin();
        boolean isTourOperator = authService.isTourOperator();
        
        RoleInfo roleInfo = new RoleInfo(isAdmin, isTourOperator);
        return ResponseEntity.ok(ApiResponse.success("Role information", roleInfo));
    }
    
    @GetMapping("/admin/test")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin test endpoint", description = "Test endpoint for admin access")
    public ResponseEntity<ApiResponse<String>> adminTest() {
        return ResponseEntity.ok(ApiResponse.success("Admin access granted", "Hello Admin!"));
    }
    
    @GetMapping("/operator/test")
    @PreAuthorize("hasRole('TOUR_OPERATOR')")
    @Operation(summary = "Tour operator test endpoint", description = "Test endpoint for tour operator access")
    public ResponseEntity<ApiResponse<String>> operatorTest() {
        return ResponseEntity.ok(ApiResponse.success("Tour operator access granted", "Hello Tour Operator!"));
    }
    
    // Inner classes for response DTOs
    public static class UserInfo {
        private Long id;
        private String username;
        private String email;
        private com.tourism.common.enums.UserRole role;
        
        public UserInfo(Long id, String username, String email, com.tourism.common.enums.UserRole role) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.role = role;
        }
        
        // Getters
        public Long getId() { return id; }
        public String getUsername() { return username; }
        public String getEmail() { return email; }
        public com.tourism.common.enums.UserRole getRole() { return role; }
    }
    
    public static class RoleInfo {
        private boolean isAdmin;
        private boolean isTourOperator;
        
        public RoleInfo(boolean isAdmin, boolean isTourOperator) {
            this.isAdmin = isAdmin;
            this.isTourOperator = isTourOperator;
        }
        
        // Getters
        public boolean isAdmin() { return isAdmin; }
        public boolean isTourOperator() { return isTourOperator; }
    }
}
