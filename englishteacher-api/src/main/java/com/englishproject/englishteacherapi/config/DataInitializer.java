package com.englishproject.englishteacherapi.config;

import com.englishproject.englishteacherapi.model.Level;
import com.englishproject.englishteacherapi.model.Teacher;
import com.englishproject.englishteacherapi.repository.LevelRepository;
import com.englishproject.englishteacherapi.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private LevelRepository levelRepository;

    @Override
    public void run(String... args) throws Exception {
        // Crear profesor de ejemplo
        if (teacherRepository.count() == 0) {
            Teacher teacher = new Teacher();
            teacher.setName("Paz");
            teacher.setLastName("Valdez");
            teacher.setDescription("Profesora de inglés con más de 10 años de experiencia enseñando a estudiantes de todos los niveles. " +
                    "Me especializo en conversación, gramática y preparación para exámenes internacionales. " +
                    "Mi objetivo es ayudar a mis estudiantes a ganar confianza y fluidez en el idioma inglés.");
            teacher.setEmail("paz.valdez@englishteacher.com");
            teacher.setPhone("+54 11 1234-5678");
            teacher.setYearsOfExperience(10);
            teacher.setQualifications("Licenciatura en Lenguas Modernas, Certificación TESOL, Cambridge CELTA");
            teacher.setSpecialties("Conversación, Gramática, Preparación de exámenes, Business English");
            // Establecer contraseña hasheada (la contraseña es "password123")
            teacher.setPasswordWithHash("password123");
            teacherRepository.save(teacher);
        }

        // Crear niveles de ejemplo
        if (levelRepository.count() == 0) {
            Level basicLevel = new Level();
            basicLevel.setName("Básico");
            basicLevel.setDescription("Nivel inicial para estudiantes que están comenzando con el idioma inglés");
            levelRepository.save(basicLevel);

            Level intermediateLevel = new Level();
            intermediateLevel.setName("Intermedio");
            intermediateLevel.setDescription("Nivel intermedio para estudiantes con conocimientos previos del idioma");
            levelRepository.save(intermediateLevel);

            Level advancedLevel = new Level();
            advancedLevel.setName("Avanzado");
            advancedLevel.setDescription("Nivel avanzado para estudiantes con dominio del idioma");
            levelRepository.save(advancedLevel);
        }
    }
}
