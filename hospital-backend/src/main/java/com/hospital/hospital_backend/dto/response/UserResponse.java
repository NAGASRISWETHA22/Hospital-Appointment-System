package com.hospital.hospital_backend.dto.response;

import com.hospital.hospital_backend.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private String specialization;
    private String departmentName;
    private Long departmentId;
}
