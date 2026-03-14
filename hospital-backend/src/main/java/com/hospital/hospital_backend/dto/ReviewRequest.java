package com.hospital.hospital_backend.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private Long doctorId;
    private Long patientId;
    private Integer rating;
    private String comment;
}
