package com.hospital.hospital_backend.controller;

import com.hospital.hospital_backend.dto.LoginRequest;
import com.hospital.hospital_backend.entity.User;
import com.hospital.hospital_backend.enums.Role;
import com.hospital.hospital_backend.repository.UserRepository;
import com.hospital.hospital_backend.service.JwtService;
import com.hospital.hospital_backend.service.impl.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.hospital.hospital_backend.service.impl.UserDetailsImpl;

@RestController
@RequestMapping("/api/auth") // Matching frontend call
@RequiredArgsConstructor
// @CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final UserServiceImpl userService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            // Only allow Patient registration from this public endpoint
            user.setRole(Role.PATIENT);
            User registered = userService.register(user);
            return ResponseEntity.ok(registered);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/register-doctor")
    public ResponseEntity<?> registerDoctor(@RequestBody User user) {
        try {
            // Admin only endpoint (checked by SecurityConfig)
            user.setRole(Role.DOCTOR);
            User registered = userService.register(user);
            return ResponseEntity.ok(registered);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            String token = jwtService.generateToken(userDetails.getUsername());
            User user = userDetails.getUser();

            return ResponseEntity.ok(Map.of(
                    "id", user.getId(),
                    "name", user.getName(),
                    "email", user.getEmail(),
                    "role", user.getRole(),
                    "token", token));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<User>> getDoctors() {
        return ResponseEntity.ok(userRepository.findByRole(Role.DOCTOR));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}