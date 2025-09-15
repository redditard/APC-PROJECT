package com.tourism.core.security.config;

import com.tourism.core.security.jwt.JwtAuthenticationEntryPoint;
import com.tourism.core.security.jwt.JwtAuthenticationFilter;
import com.tourism.core.security.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Spring Security configuration
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    
    @Autowired
    private CustomUserDetailsService userDetailsService;
    
    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .exceptionHandling(exception -> exception.authenticationEntryPoint(jwtAuthenticationEntryPoint))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // Public endpoints
                // Accept both /api/auth/** (legacy) and /api/v1/auth/** (gateway/frontend)
                .requestMatchers(new AntPathRequestMatcher("/api/auth/**")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/api/v1/auth/**")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/v3/api-docs/**")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/swagger-ui/**")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/swagger-ui.html")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/actuator/**")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/h2-console/**")).permitAll()
                
                // Public read-only endpoints
                .requestMatchers(new AntPathRequestMatcher("/api/v1/tours", "GET")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/api/v1/tours/**", "GET")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/api/v1/packages", "GET")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/api/v1/packages/**", "GET")).permitAll()
                
                // Admin only endpoints
                .requestMatchers(new AntPathRequestMatcher("/api/v1/admin/**")).hasRole("ADMIN")
                .requestMatchers(new AntPathRequestMatcher("/api/v1/tours", "POST")).hasAnyRole("ADMIN", "TOUR_OPERATOR")
                .requestMatchers(new AntPathRequestMatcher("/api/v1/tours/**", "PUT")).hasAnyRole("ADMIN", "TOUR_OPERATOR")
                .requestMatchers(new AntPathRequestMatcher("/api/v1/tours/**", "DELETE")).hasAnyRole("ADMIN", "TOUR_OPERATOR")
                .requestMatchers(new AntPathRequestMatcher("/api/v1/packages", "POST")).hasAnyRole("ADMIN", "TOUR_OPERATOR")
                .requestMatchers(new AntPathRequestMatcher("/api/v1/packages/**", "PUT")).hasAnyRole("ADMIN", "TOUR_OPERATOR")
                .requestMatchers(new AntPathRequestMatcher("/api/v1/packages/**", "DELETE")).hasAnyRole("ADMIN", "TOUR_OPERATOR")
                
                // Booking endpoints - different access levels
                .requestMatchers(new AntPathRequestMatcher("/api/v1/bookings", "GET")).hasRole("ADMIN")
                .requestMatchers(new AntPathRequestMatcher("/api/v1/bookings", "POST")).hasAnyRole("TOURIST", "ADMIN")
                .requestMatchers(new AntPathRequestMatcher("/api/v1/bookings/customer/**", "GET")).hasAnyRole("TOURIST", "ADMIN")
                .requestMatchers(new AntPathRequestMatcher("/api/v1/bookings/**")).authenticated()
                
                // All other endpoints require authentication
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
