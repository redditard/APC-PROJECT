package com.tourism.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {
    
    @Bean
    public RouteLocator routeLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Tourism Core Service Routes
                .route("tourism-core-service", r -> r
                        .path(
                                // legacy paths
                                "/api/tours/**", "/api/packages/**", "/api/bookings/**", "/api/users/**", "/api/auth/**", "/api/admin/**",
                                // new v1 paths
                                "/api/v1/tours/**", "/api/v1/packages/**", "/api/v1/bookings/**", "/api/v1/users/**", "/api/v1/auth/**", "/api/v1/admin/**"
                        )
                        .uri("lb://tourism-core-service"))
                
                // Itinerary Service Routes
                .route("itinerary-service", r -> r
                        .path("/api/itineraries/**")
                        .uri("lb://itinerary-service"))
                
                // Eureka Dashboard
                .route("eureka-server", r -> r
                        .path("/eureka/**")
                        .uri("http://localhost:8761"))
                
                // Core Service Swagger
                .route("core-service-docs", r -> r
                        .path("/core-service/v3/api-docs/**", "/core-service/swagger-ui/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri("lb://tourism-core-service"))
                
                // Itinerary Service Swagger
                .route("itinerary-service-docs", r -> r
                        .path("/itinerary-service/v3/api-docs/**", "/itinerary-service/swagger-ui/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri("lb://itinerary-service"))
                
                .build();
    }
}
