package com.hospital.hospital_backend.service.impl;

import com.hospital.hospital_backend.entity.Department;
import com.hospital.hospital_backend.repository.DepartmentRepository;
import com.hospital.hospital_backend.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final com.hospital.hospital_backend.repository.UserRepository userRepository;

    @Override
    public Department createDepartment(Department department) {
        return departmentRepository.save(department);
    }

    @Override
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    @Override
    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Department not found"));
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void deleteDepartment(Long id) {
        // Clear department from all users assigned to it
        List<com.hospital.hospital_backend.entity.User> users = userRepository.findByRoleAndDepartmentId(com.hospital.hospital_backend.enums.Role.DOCTOR, id);
        for (com.hospital.hospital_backend.entity.User user : users) {
            user.setDepartment(null);
            userRepository.save(user);
        }
        departmentRepository.deleteById(id);
    }
}
