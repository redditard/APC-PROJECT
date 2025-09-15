package com.tourism.core.service;

import com.tourism.common.dto.request.LoginRequest;
import com.tourism.common.dto.request.RegisterRequest;
import com.tourism.common.dto.response.AuthResponse;
import com.tourism.common.enums.UserRole;
import com.tourism.core.entity.User;
import com.tourism.core.exception.BusinessLogicException;
import com.tourism.core.repository.UserRepository;
import com.tourism.core.security.jwt.JwtUtils;
import com.tourism.core.security.jwt.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for handling authentication operations
 */
@Service
@Transactional
public class AuthService {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    /**
     * Authenticate user and generate JWT token
     */
    public AuthResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(),
                loginRequest.getPassword()
            )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateToken(authentication);
        
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        return new AuthResponse(
            jwt,
            userPrincipal.getId(),
            userPrincipal.getUsername(),
            userPrincipal.getEmail(),
            userPrincipal.getRole(),
            jwtUtils.getJwtExpiration()
        );
    }
    
    /**
     * Register a new user
     */
    public AuthResponse registerUser(RegisterRequest registerRequest) {
        // Check if username already exists
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new BusinessLogicException("Username is already taken!");
        }
        
        // Check if email already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BusinessLogicException("Email is already in use!");
        }
        
        // Create new user
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFullName(registerRequest.getFirstName() + " " + registerRequest.getLastName());
        user.setPhone(registerRequest.getPhone());
        user.setRole(registerRequest.getRole() != null ? registerRequest.getRole() : UserRole.TOURIST);
        user.setEnabled(true);
        
        User savedUser = userRepository.save(user);
        
        // Authenticate the newly registered user
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                registerRequest.getUsername(),
                registerRequest.getPassword()
            )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateToken(authentication);
        
        return new AuthResponse(
            jwt,
            savedUser.getId(),
            savedUser.getUsername(),
            savedUser.getEmail(),
            savedUser.getRole(),
            jwtUtils.getJwtExpiration()
        );
    }
    
    /**
     * Get current authenticated user
     */
    public UserPrincipal getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            return (UserPrincipal) authentication.getPrincipal();
        }
        throw new BusinessLogicException("No authenticated user found");
    }
    
    /**
     * Check if current user has specific role
     */
    public boolean hasRole(UserRole role) {
        try {
            UserPrincipal currentUser = getCurrentUser();
            return currentUser.getRole() == role;
        } catch (BusinessLogicException e) {
            return false;
        }
    }
    
    /**
     * Check if current user is admin
     */
    public boolean isAdmin() {
        return hasRole(UserRole.ADMIN);
    }
    
    /**
     * Check if current user is tour operator
     */
    public boolean isTourOperator() {
        return hasRole(UserRole.TOUR_OPERATOR);
    }
    
    /**
     * Logout user (primarily for client-side token removal)
     */
    public void logout() {
        SecurityContextHolder.clearContext();
    }
}
