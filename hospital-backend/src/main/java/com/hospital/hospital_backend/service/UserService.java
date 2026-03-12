package com.hospital.hospital_backend.service;

import com.hospital.hospital_backend.entity.User;
import com.hospital.hospital_backend.enums.Role;
import java.util.List;

public interface UserService {
    User login(String email, String password);
    User register(User user);
    Object login(User loginRequest);
    List<User> getUsersByRole(Role role);
    List<User> getDoctorsByDepartment(Long departmentId);
    User getUserById(Long id);
    void deleteUser(Long id);
    List<User> getDoctorsAvailableOn(String date);
    List<User> searchDoctors(Long deptId, String spec, String name);
}