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

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()

                        // Availability Features
                        // Doctors can POST/DELETE, Everyone (Doctor/Patient) can GET
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/availability/**").hasAuthority("ROLE_DOCTOR")
                        .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/availability/**").hasAuthority("ROLE_DOCTOR")
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/availability/**").authenticated()

                        // Appointment Features
                        .requestMatchers("/api/appointments/book").hasAuthority("ROLE_PATIENT")
                        .requestMatchers("/api/appointments/patient/**").hasAuthority("ROLE_PATIENT")
                        .requestMatchers("/api/appointments/doctor/**").hasAuthority("ROLE_DOCTOR")
                        .requestMatchers("/api/appointments/status/**").hasAnyAuthority("ROLE_DOCTOR", "ROLE_ADMIN", "ROLE_PATIENT")
                        .requestMatchers("/api/appointments/all").hasAuthority("ROLE_ADMIN")
                        .requestMatchers("/api/appointments/delete/**").hasAuthority("ROLE_ADMIN")

                        // Review Features
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/reviews/**").hasAuthority("ROLE_PATIENT")
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/reviews/**").permitAll()

                        // Admin & Shared Features
                        .requestMatchers("/api/departments/**").permitAll()
                        .requestMatchers("/api/analytics/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers("/api/auth/register-doctor").hasAuthority("ROLE_ADMIN")
                        .requestMatchers("/api/users/**").hasAuthority("ROLE_ADMIN")

                        .anyRequest().authenticated())
                .addFilterBefore(jwtFilter,
                        org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Keep your existing Vercel patterns - they are perfect for deployment
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
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}