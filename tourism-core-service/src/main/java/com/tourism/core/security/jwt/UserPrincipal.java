package com.tourism.core.security.jwt;

import com.tourism.common.enums.UserRole;
import com.tourism.core.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

/**
 * Custom UserDetails implementation for Spring Security
 */
public class UserPrincipal implements UserDetails {
    
    private Long id;
    private String username;
    private String email;
    private String password;
    private UserRole role;
    private boolean enabled;
    
    public UserPrincipal(Long id, String username, String email, String password, UserRole role, boolean enabled) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.enabled = enabled;
    }
    
    /**
     * Create UserPrincipal from User entity
     */
    public static UserPrincipal create(User user) {
        return new UserPrincipal(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getPassword(),
            user.getRole(),
            user.getEnabled() != null ? user.getEnabled() : true
        );
    }
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }
    
    @Override
    public String getPassword() {
        return password;
    }
    
    @Override
    public String getUsername() {
        return username;
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    
    @Override
    public boolean isEnabled() {
        return enabled;
    }
    
    // Additional getters
    public Long getId() {
        return id;
    }
    
    public String getEmail() {
        return email;
    }
    
    public UserRole getRole() {
        return role;
    }
}
