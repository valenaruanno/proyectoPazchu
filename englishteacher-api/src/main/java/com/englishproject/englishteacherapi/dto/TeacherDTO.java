package com.englishproject.englishteacherapi.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeacherDTO {
    private Long id;
    private String name;
    private String lastName;
    private String description;
    private String email;
    private String phone;
    private String profileImageUrl;
    private Integer yearsOfExperience;
    private String qualifications;
    private String specialties;
    private String password; // Solo para creación/actualización, no se devuelve en respuestas
}
