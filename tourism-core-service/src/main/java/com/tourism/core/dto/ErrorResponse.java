package com.tourism.core.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Standard error response DTO for API exceptions
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;
    
    private int status;
    private String error;
    private String message;
    private String path;
    private List<ValidationError> validationErrors;
    
    // Default constructor
    public ErrorResponse() {}
    
    // Constructor with all fields
    public ErrorResponse(LocalDateTime timestamp, int status, String error, String message, String path, List<ValidationError> validationErrors) {
        this.timestamp = timestamp;
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
        this.validationErrors = validationErrors;
    }
    
    // Builder pattern
    public static ErrorResponseBuilder builder() {
        return new ErrorResponseBuilder();
    }
    
    // Getters and setters
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    
    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }
    
    public String getError() { return error; }
    public void setError(String error) { this.error = error; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }
    
    public List<ValidationError> getValidationErrors() { return validationErrors; }
    public void setValidationErrors(List<ValidationError> validationErrors) { this.validationErrors = validationErrors; }
    
    // Builder class
    public static class ErrorResponseBuilder {
        private LocalDateTime timestamp;
        private int status;
        private String error;
        private String message;
        private String path;
        private List<ValidationError> validationErrors;
        
        public ErrorResponseBuilder timestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
            return this;
        }
        
        public ErrorResponseBuilder status(int status) {
            this.status = status;
            return this;
        }
        
        public ErrorResponseBuilder error(String error) {
            this.error = error;
            return this;
        }
        
        public ErrorResponseBuilder message(String message) {
            this.message = message;
            return this;
        }
        
        public ErrorResponseBuilder path(String path) {
            this.path = path;
            return this;
        }
        
        public ErrorResponseBuilder validationErrors(List<ValidationError> validationErrors) {
            this.validationErrors = validationErrors;
            return this;
        }
        
        public ErrorResponse build() {
            return new ErrorResponse(timestamp, status, error, message, path, validationErrors);
        }
    }
    
    public static class ValidationError {
        private String field;
        private Object rejectedValue;
        private String message;
        
        public ValidationError() {}
        
        public ValidationError(String field, Object rejectedValue, String message) {
            this.field = field;
            this.rejectedValue = rejectedValue;
            this.message = message;
        }
        
        public static ValidationErrorBuilder builder() {
            return new ValidationErrorBuilder();
        }
        
        // Getters and setters
        public String getField() { return field; }
        public void setField(String field) { this.field = field; }
        
        public Object getRejectedValue() { return rejectedValue; }
        public void setRejectedValue(Object rejectedValue) { this.rejectedValue = rejectedValue; }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        
        public static class ValidationErrorBuilder {
            private String field;
            private Object rejectedValue;
            private String message;
            
            public ValidationErrorBuilder field(String field) {
                this.field = field;
                return this;
            }
            
            public ValidationErrorBuilder rejectedValue(Object rejectedValue) {
                this.rejectedValue = rejectedValue;
                return this;
            }
            
            public ValidationErrorBuilder message(String message) {
                this.message = message;
                return this;
            }
            
            public ValidationError build() {
                return new ValidationError(field, rejectedValue, message);
            }
        }
    }
}
