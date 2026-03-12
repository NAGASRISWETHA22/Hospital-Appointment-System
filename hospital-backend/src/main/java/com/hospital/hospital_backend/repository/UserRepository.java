package com.hospital.hospital_backend.repository;

import com.hospital.hospital_backend.entity.User;
import com.hospital.hospital_backend.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Find a user by email for the Login logic
    Optional<User> findByEmail(String email);

    // Filter users by role (e.g., get all DOCTORs for the dropdown)
    List<User> findByRole(Role role);

    // Filter users by role and department
    List<User> findByRoleAndDepartmentId(Role role, Long departmentId);
}