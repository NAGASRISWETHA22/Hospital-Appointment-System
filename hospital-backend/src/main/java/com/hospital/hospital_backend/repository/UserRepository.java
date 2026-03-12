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

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT u FROM User u JOIN u.availabilities a WHERE a.availableDate = :date AND a.booked = false")
    List<User> findDoctorsWithAvailabilityOnDate(
            @org.springframework.data.repository.query.Param("date") java.time.LocalDate date);

    @org.springframework.data.jpa.repository.Query("SELECT u FROM User u WHERE u.role = 'DOCTOR' " +
            "AND (:deptId IS NULL OR u.department.id = :deptId) " +
            "AND (:spec IS NULL OR LOWER(u.specialization) LIKE LOWER(CONCAT('%', :spec, '%'))) " +
            "AND (:name IS NULL OR LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%')))")
    List<User> searchDoctors(
            @org.springframework.data.repository.query.Param("deptId") Long deptId,
            @org.springframework.data.repository.query.Param("spec") String spec,
            @org.springframework.data.repository.query.Param("name") String name);
}