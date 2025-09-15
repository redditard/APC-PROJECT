package com.tourism.itinerary.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoRepositories(basePackages = "com.tourism.itinerary.repository")
@EnableMongoAuditing
public class MongoConfig {
    
    // MongoDB configuration is handled through application.yml
    // This class enables auditing and repository scanning
}
