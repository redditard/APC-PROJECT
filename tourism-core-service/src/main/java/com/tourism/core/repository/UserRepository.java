package com.tourism.core.repository;

import com.tourism.core.entity.User;
import com.tourism.common.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    List<User> findByRole(UserRole role);
    
    List<User> findByEnabled(Boolean enabled);
    
    @Query("SELECT u FROM User u WHERE u.role = :role AND u.enabled = true")
    List<User> findActiveUsersByRole(@Param("role") UserRole role);
    
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :name, '%')) OR " +
           "LOWER(u.username) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<User> findByNameContaining(@Param("name") String name);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND u.enabled = true")
    long countActiveUsersByRole(@Param("role") UserRole role);
}
