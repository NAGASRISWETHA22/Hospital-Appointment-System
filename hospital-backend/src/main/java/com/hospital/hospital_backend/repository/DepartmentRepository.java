package com.hospital.hospital_backend.repository;

import com.hospital.hospital_backend.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    @Query("SELECT COUNT(d) > 0 FROM Department d WHERE d.name = :name")
    boolean existsByName(@Param("name") String name);
}