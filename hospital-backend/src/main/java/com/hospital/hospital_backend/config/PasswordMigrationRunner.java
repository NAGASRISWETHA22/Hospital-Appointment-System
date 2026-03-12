package com.hospital.hospital_backend.config;

import com.hospital.hospital_backend.entity.User;
import com.hospital.hospital_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * On startup, this automatically re-hashes any users whose passwords are
 * stored as plain-text (i.e., not yet BCrypt-encoded).
 * This handles existing DB rows created before BCrypt was enforced.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class PasswordMigrationRunner implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        List<User> users = userRepository.findAll();
        int migrated = 0;

        for (User user : users) {
            String pw = user.getPassword();
            // BCrypt hashes always start with $2a$ or $2b$
            if (pw != null && !pw.startsWith("$2a$") && !pw.startsWith("$2b$")) {
                user.setPassword(passwordEncoder.encode(pw));
                userRepository.save(user);
                migrated++;
                log.info("Migrated password for user: {}", user.getEmail());
            }
        }

        if (migrated > 0) {
            log.info("Password migration complete. {} user(s) updated.", migrated);
        }
    }
}
