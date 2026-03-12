package com.hospital.hospital_backend.service.impl;

import com.hospital.hospital_backend.entity.User;
import com.hospital.hospital_backend.repository.UserRepository;
import com.hospital.hospital_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User register(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered!");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // Main Login Logic - Indha method dhaan controller-la irundhu call aagudhu
    @Override
    public User login(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Check password using passwordEncoder
            if (passwordEncoder.matches(password, user.getPassword())) {
                return user;
            }
        }
        return null;
    }

    // Interface-la User object-ah pass panna solli irundha, indha method help
    // pannum
    @Override
    public Object login(User loginRequest) {
        return login(loginRequest.getEmail(), loginRequest.getPassword());
    }

    @Override
    public java.util.List<User> getUsersByRole(com.hospital.hospital_backend.enums.Role role) {
        return userRepository.findByRole(role);
    }

    @Override
    public java.util.List<User> getDoctorsByDepartment(Long departmentId) {
        return userRepository.findByRoleAndDepartmentId(com.hospital.hospital_backend.enums.Role.DOCTOR, departmentId);
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}