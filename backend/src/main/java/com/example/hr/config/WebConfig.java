package com.example.hr.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns(
                        "http://13.63.57.2",
                        "https://13.63.57.2",
                        "http://13.63.57.2:*",
                        "https://13.63.57.2:*",
                        "http://localhost:*",
                        "http://127.0.0.1:*",
                        "https://ismeranket.web.app",
                        "https://*.firebaseapp.com",
                        "https://*.web.app")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
