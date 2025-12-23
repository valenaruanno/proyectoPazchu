package com.englishproject.englishteacherapi.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.englishproject.englishteacherapi.model.Level;

@Repository
public interface LevelRepository extends JpaRepository<Level, Long> {

    Optional<Level> findByName(String name);

}
