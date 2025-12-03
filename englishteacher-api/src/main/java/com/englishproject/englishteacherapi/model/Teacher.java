package com.englishproject.englishteacherapi.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Entity
@Table(name = "teachers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String lastName;

    @Column(length = 1000)
    private String description;

    @Column
    private String email;

    @Column
    private String phone;

    @Column
    private String profileImageUrl;

    @Column
    private Integer yearsOfExperience;

    @Column(length = 2000)
    private String qualifications;

    @Column(length = 1000)
    private String specialties;

    @Column(nullable = false)
    private String password;

    private static final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Método para establecer la contraseña con hash
    public void setPasswordWithHash(String plainPassword) {
        this.password = passwordEncoder.encode(plainPassword);
    }

    // Método para validar contraseña
    public boolean validatePassword(String plainPassword) {
        return passwordEncoder.matches(plainPassword, this.password);
    }
}
