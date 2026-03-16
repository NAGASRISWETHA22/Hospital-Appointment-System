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
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;

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
                .httpBasic(basic -> basic.disable())
                .formLogin(form -> form.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/register-doctor").hasRole("ADMIN")
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/departments/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/reviews/**").permitAll()

                        // Appointment Features
                        .requestMatchers("/api/appointments/book").hasAnyAuthority("PATIENT", "ROLE_PATIENT")
                        .requestMatchers("/api/appointments/patient/**").hasAnyAuthority("PATIENT", "ROLE_PATIENT")
                        .requestMatchers("/api/appointments/doctor/**").hasAnyAuthority("DOCTOR", "ROLE_DOCTOR")
                        .requestMatchers("/api/appointments/status/**").hasAnyAuthority("PATIENT", "ROLE_PATIENT", "DOCTOR", "ROLE_DOCTOR", "ADMIN", "ROLE_ADMIN")
                        .requestMatchers("/api/appointments/all").hasAnyAuthority("ADMIN", "ROLE_ADMIN")
                        .requestMatchers("/api/appointments/delete/**").hasAnyAuthority("ADMIN", "ROLE_ADMIN")

                        // Availability Features
                        .requestMatchers(HttpMethod.POST, "/api/availability/**").hasAnyAuthority("DOCTOR", "ROLE_DOCTOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/availability/**").hasAnyAuthority("DOCTOR", "ROLE_DOCTOR")
                        .requestMatchers(HttpMethod.GET, "/api/availability/**").authenticated()

                        // Review Features
                        .requestMatchers(HttpMethod.POST, "/api/reviews/**").hasAnyAuthority("PATIENT", "ROLE_PATIENT")

                        // Admin & Shared Features
                        .requestMatchers("/api/analytics/**").hasAnyAuthority("ADMIN", "ROLE_ADMIN")
                        .requestMatchers("/api/users/**").hasAnyAuthority("ADMIN", "ROLE_ADMIN")

                        .anyRequest().authenticated())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                "https://hospital-appointment-system-theta.vercel.app",
                "https://hospital-appointment-system-3yqai2l8u.vercel.app"));

        configuration.setAllowedOriginPatterns(Arrays.asList(
                "https://hospital-appoint-*.vercel.app",
                "https://hospital-appointment-system-*.vercel.app",
                "https://*-nagasriswetha*.vercel.app"));

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "X-Requested-With"));
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}