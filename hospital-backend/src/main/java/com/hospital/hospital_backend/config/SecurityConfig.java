package com.hospital.hospital_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    // 1. AuthenticationManager Bean
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // 2. Security Filter Chain configuration
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Explicitly use our CORS bean
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll() // Allow
                                                                                                         // preflight
                        .requestMatchers("/api/auth/**").permitAll() // Login/Register routes are public

                        // Patient Features
                        .requestMatchers("/api/appointments/book").hasRole("PATIENT")
                        .requestMatchers("/api/appointments/patient/**").hasRole("PATIENT")
                        .requestMatchers("/api/reviews/add").hasRole("PATIENT")

                        // Doctor Features
                        .requestMatchers("/api/availability/**").hasAnyRole("DOCTOR", "PATIENT", "ADMIN")
                        .requestMatchers("/api/appointments/doctor/**").hasRole("DOCTOR")
                        .requestMatchers("/api/appointments/*/status").hasAnyRole("DOCTOR", "ADMIN", "PATIENT")

                        // Admin Features
                        .requestMatchers("/api/departments/**").hasAnyRole("ADMIN", "PATIENT", "DOCTOR")
                        .requestMatchers("/api/analytics/**").hasRole("ADMIN")
                        .requestMatchers("/api/auth/register-doctor").hasRole("ADMIN")
                        .requestMatchers("/api/users/**").hasRole("ADMIN")

                        .anyRequest().authenticated()) // Others need authentication
                .addFilterBefore(jwtFilter,
                        org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // 3. Password Encoder Bean
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allow all Vercel preview/production URLs for this project + localhost
        configuration.setAllowedOriginPatterns(Arrays.asList(
                "http://localhost:3000",
                "https://hospital-appoint-*.vercel.app",
                "https://hospital-appointment-system-*.vercel.app",
                "https://*-nagasriswetha*.vercel.app",
                "https://hospital-appointment-system-theta.vercel.app",
                "https://hospital-appoint-git-9bb5ff-nagasriswethamurugan-5555s-projects.vercel.app"));

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L); // Cache preflight for 1 hour

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}