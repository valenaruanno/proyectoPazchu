package com.englishproject.englishteacherapi.controller;

import com.englishproject.englishteacherapi.dto.LoginDTO;
import com.englishproject.englishteacherapi.dto.TeacherDTO;
import com.englishproject.englishteacherapi.model.Teacher;
import com.englishproject.englishteacherapi.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginDTO loginDTO) {
        Map<String, Object> response = new HashMap<>();

        try {
            Optional<Teacher> authenticatedTeacher = authService.authenticateTeacher(
                loginDTO.getEmail(),
                loginDTO.getPassword()
            );

            if (authenticatedTeacher.isPresent()) {
                Teacher teacher = authenticatedTeacher.get();

                // Convertir a DTO sin incluir la contraseña
                TeacherDTO teacherDTO = new TeacherDTO(
                    teacher.getId(),
                    teacher.getName(),
                    teacher.getLastName(),
                    teacher.getDescription(),
                    teacher.getEmail(),
                    teacher.getPhone(),
                    teacher.getProfileImageUrl(),
                    teacher.getYearsOfExperience(),
                    teacher.getQualifications(),
                    teacher.getSpecialties(),
                    null
                );

                response.put("success", true);
                response.put("message", "Login exitoso");
                response.put("teacher", teacherDTO);

                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Credenciales inválidas");

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error interno del servidor");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/check-email")
    public ResponseEntity<Map<String, Object>> checkEmail(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        try {
            String email = request.get("email");
            boolean exists = authService.teacherExists(email);

            response.put("exists", exists);
            response.put("message", exists ? "Email ya registrado" : "Email disponible");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("error", "Error interno del servidor");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
