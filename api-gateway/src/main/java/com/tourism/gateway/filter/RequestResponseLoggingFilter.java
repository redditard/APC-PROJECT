package com.tourism.gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Component
public class RequestResponseLoggingFilter implements GlobalFilter, Ordered {
    
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        ServerHttpResponse response = exchange.getResponse();
        
        // Generate request ID
        String requestId = UUID.randomUUID().toString();
        
        // Log request
        System.out.println("Request ID: " + requestId + 
                          " | Method: " + request.getMethod() + 
                          " | Path: " + request.getPath() + 
                          " | Remote Address: " + request.getRemoteAddress());
        
        // Add request ID to headers
        ServerHttpRequest modifiedRequest = request.mutate()
                .header("X-Request-ID", requestId)
                .build();
        
        return chain.filter(exchange.mutate().request(modifiedRequest).build())
                .doOnSuccess(aVoid -> {
                    // Log response
                    System.out.println("Request ID: " + requestId + 
                                      " | Response Status: " + response.getStatusCode());
                })
                .doOnError(throwable -> {
                    // Log error
                    System.err.println("Request ID: " + requestId + 
                                      " | Error: " + throwable.getMessage());
                });
    }
    
    @Override
    public int getOrder() {
        return -1; // High priority
    }
}
