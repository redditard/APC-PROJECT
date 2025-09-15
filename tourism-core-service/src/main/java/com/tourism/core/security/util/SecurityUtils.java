package com.tourism.core.security.util;

import com.tourism.common.enums.UserRole;
import com.tourism.core.security.jwt.UserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Utility class for security-related operations
 */
public class SecurityUtils {
    
    /**
     * Get current authenticated user principal
     */
    public static UserPrincipal getCurrentUserPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            return (UserPrincipal) authentication.getPrincipal();
        }
        return null;
    }
    
    /**
     * Get current user ID
     */
    public static Long getCurrentUserId() {
        UserPrincipal userPrincipal = getCurrentUserPrincipal();
        return userPrincipal != null ? userPrincipal.getId() : null;
    }
    
    /**
     * Get current username
     */
    public static String getCurrentUsername() {
        UserPrincipal userPrincipal = getCurrentUserPrincipal();
        return userPrincipal != null ? userPrincipal.getUsername() : null;
    }
    
    /**
     * Get current user role
     */
    public static UserRole getCurrentUserRole() {
        UserPrincipal userPrincipal = getCurrentUserPrincipal();
        return userPrincipal != null ? userPrincipal.getRole() : null;
    }
    
    /**
     * Check if current user is authenticated
     */
    public static boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated() && 
               authentication.getPrincipal() instanceof UserPrincipal;
    }
    
    /**
     * Check if current user has specific role
     */
    public static boolean hasRole(UserRole role) {
        UserRole currentRole = getCurrentUserRole();
        return currentRole != null && currentRole == role;
    }
    
    /**
     * Check if current user is admin
     */
    public static boolean isAdmin() {
        return hasRole(UserRole.ADMIN);
    }
    
    /**
     * Check if current user is tour operator
     */
    public static boolean isTourOperator() {
        return hasRole(UserRole.TOUR_OPERATOR);
    }
    
    /**
     * Check if current user is tourist
     */
    public static boolean isTourist() {
        return hasRole(UserRole.TOURIST);
    }
    
    /**
     * Check if current user can access resource (is owner or admin)
     */
    public static boolean canAccessUserResource(Long userId) {
        if (isAdmin()) {
            return true;
        }
        
        Long currentUserId = getCurrentUserId();
        return currentUserId != null && currentUserId.equals(userId);
    }
}
