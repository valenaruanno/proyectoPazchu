package com.englishproject.englishteacherapi.service;

import com.englishproject.englishteacherapi.model.Teacher;
import com.englishproject.englishteacherapi.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private TeacherRepository teacherRepository;

    /**
     * Autentica a un profesor con email y contraseña
     * @param email Email del profesor
     * @param password Contraseña en texto plano
     * @return Optional<Teacher> con el profesor si la autenticación es exitosa
     */
    public Optional<Teacher> authenticateTeacher(String email, String password) {
        Optional<Teacher> teacher = teacherRepository.findByEmail(email);

        if (teacher.isPresent() && teacher.get().validatePassword(password)) {
            return teacher;
        }

        return Optional.empty();
    }

    /**
     * Verifica si existe un profesor con el email dado
     * @param email Email a verificar
     * @return true si existe, false en caso contrario
     */
    public boolean teacherExists(String email) {
        return teacherRepository.findByEmail(email).isPresent();
    }
}
