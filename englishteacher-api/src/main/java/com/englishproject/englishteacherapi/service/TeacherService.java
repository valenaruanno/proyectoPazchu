package com.englishproject.englishteacherapi.service;

import com.englishproject.englishteacherapi.dto.TeacherDTO;
import com.englishproject.englishteacherapi.model.Teacher;
import com.englishproject.englishteacherapi.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TeacherService {

    @Autowired
    private TeacherRepository teacherRepository;

    public List<TeacherDTO> getAllTeachers() {
        return teacherRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<TeacherDTO> getTeacherById(Long id) {
        return teacherRepository.findById(id)
                .map(this::convertToDTO);
    }

    public TeacherDTO createTeacher(TeacherDTO teacherDTO) {
        Teacher teacher = convertToEntity(teacherDTO);
        Teacher savedTeacher = teacherRepository.save(teacher);
        return convertToDTO(savedTeacher);
    }

    public Optional<TeacherDTO> updateTeacher(Long id, TeacherDTO teacherDTO) {
        return teacherRepository.findById(id)
                .map(teacher -> {
                    updateTeacherFromDTO(teacher, teacherDTO);
                    Teacher savedTeacher = teacherRepository.save(teacher);
                    return convertToDTO(savedTeacher);
                });
    }

    public boolean deleteTeacher(Long id) {
        if (teacherRepository.existsById(id)) {
            teacherRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private TeacherDTO convertToDTO(Teacher teacher) {
        return new TeacherDTO(
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
                null // No devolvemos la contraseña en las respuestas
        );
    }

    private Teacher convertToEntity(TeacherDTO teacherDTO) {
        Teacher teacher = new Teacher();
        updateTeacherFromDTO(teacher, teacherDTO);
        return teacher;
    }

    private void updateTeacherFromDTO(Teacher teacher, TeacherDTO teacherDTO) {
        teacher.setName(teacherDTO.getName());
        teacher.setLastName(teacherDTO.getLastName());
        teacher.setDescription(teacherDTO.getDescription());
        teacher.setEmail(teacherDTO.getEmail());
        teacher.setPhone(teacherDTO.getPhone());
        teacher.setProfileImageUrl(teacherDTO.getProfileImageUrl());
        teacher.setYearsOfExperience(teacherDTO.getYearsOfExperience());
        teacher.setQualifications(teacherDTO.getQualifications());
        teacher.setSpecialties(teacherDTO.getSpecialties());

        // Solo actualizar la contraseña si se proporciona una nueva
        if (teacherDTO.getPassword() != null && !teacherDTO.getPassword().trim().isEmpty()) {
            teacher.setPasswordWithHash(teacherDTO.getPassword());
        }
    }
}
