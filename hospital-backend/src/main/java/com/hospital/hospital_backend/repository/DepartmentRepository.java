package com.hospital.hospital_backend.repository;

import com.hospital.hospital_backend.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    // For DataInitializer to prevent duplicates
    boolean existsByName(String name);
}