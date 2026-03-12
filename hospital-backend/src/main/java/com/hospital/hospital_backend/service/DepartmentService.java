package com.hospital.hospital_backend.service;

import com.hospital.hospital_backend.entity.Department;
import java.util.List;

public interface DepartmentService {
    Department createDepartment(Department department);
    List<Department> getAllDepartments();
    Department getDepartmentById(Long id);
    void deleteDepartment(Long id);
}
