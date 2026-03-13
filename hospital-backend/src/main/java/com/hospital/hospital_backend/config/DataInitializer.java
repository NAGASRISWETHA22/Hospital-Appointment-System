package com.hospital.hospital_backend.config;

import com.hospital.hospital_backend.entity.Department;
import com.hospital.hospital_backend.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final DepartmentRepository departmentRepository;

    @Override
    public void run(String... args) throws Exception {
        log.info("Checking if default departments need to be initialized...");
        
        if (departmentRepository.count() == 0) {
            log.info("No departments found. Initializing default departments...");
            
            List<Department> defaultDepartments = Arrays.asList(
                    new Department(null, "Cardiology", "Heart and cardiovascular system care"),
                    new Department(null, "Neurology", "Nervous system and brain disorders"),
                    new Department(null, "Pediatrics", "Medical care for infants, children, and adolescents"),
                    new Department(null, "Orthopedics", "Bones, joints, ligaments, tendons, and muscles"),
                    new Department(null, "Dermatology", "Skin, hair, and nail conditions"),
                    new Department(null, "General Surgery", "Surgical treatment of a broad range of diseases"),
                    new Department(null, "Psychiatry", "Mental health and behavioral disorders")
            );
            
            departmentRepository.saveAll(defaultDepartments);
            log.info("Successfully initialized {} default departments.", defaultDepartments.size());
        } else {
            log.info("Departments already exist. Skipping initialization.");
        }
    }
}
