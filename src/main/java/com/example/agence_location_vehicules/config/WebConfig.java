package com.example.agence_location_vehicules.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import jakarta.annotation.PostConstruct;
import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir:uploads/vehicles}")
    private String uploadDir;

    @PostConstruct
    public void init() {
        // Create upload directory if it doesn't exist
        File uploadDirectory = new File(uploadDir);
        if (!uploadDirectory.exists()) {
            uploadDirectory.mkdirs();
            System.out.println("Created upload directory: " + uploadDirectory.getAbsolutePath());
        }
        System.out.println("Upload directory absolute path: " + uploadDirectory.getAbsolutePath());
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Try multiple approaches to serve images
        
        // Approach 1: Direct file system access
        try {
            String absolutePath = new File(uploadDir).getAbsolutePath();
            String fileUrl = "file:" + absolutePath + "/";
            
            registry.addResourceHandler("/uploads/**")
                    .addResourceLocations(fileUrl)
                    .setCachePeriod(3600)
                    .resourceChain(true);
            
            System.out.println("Resource handler configured for: " + fileUrl);
        } catch (Exception e) {
            System.err.println("Error configuring resource handler: " + e.getMessage());
        }
        
        // Approach 2: Classpath fallback (for testing)
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");
    }
}
