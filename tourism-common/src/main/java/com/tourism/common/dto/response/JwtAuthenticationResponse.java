package com.tourism.common.dto.response;

public class JwtAuthenticationResponse {
    
    private String accessToken;
    private String tokenType = "Bearer";
    private String username;
    private String role;
    private Long expiresIn;
    
    // Constructors
    public JwtAuthenticationResponse() {}
    
    public JwtAuthenticationResponse(String accessToken, String username, String role, Long expiresIn) {
        this.accessToken = accessToken;
        this.username = username;
        this.role = role;
        this.expiresIn = expiresIn;
    }
    
    // Getters and Setters
    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
    
    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public Long getExpiresIn() { return expiresIn; }
    public void setExpiresIn(Long expiresIn) { this.expiresIn = expiresIn; }
}
