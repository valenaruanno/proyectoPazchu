package com.englishproject.englishteacherapi.controller;

import com.englishproject.englishteacherapi.dto.LevelDTO;
import com.englishproject.englishteacherapi.service.LevelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/levels")
@CrossOrigin(origins = "http://localhost:5173")
public class LevelController {

    @Autowired
    private LevelService levelService;

    @GetMapping
    public ResponseEntity<List<LevelDTO>> getAllLevels() {
        List<LevelDTO> levels = levelService.getAllLevels();
        return ResponseEntity.ok(levels);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LevelDTO> getLevelById(@PathVariable Long id) {
        return levelService.getLevelById(id)
                .map(level -> ResponseEntity.ok(level))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-name/{name}")
    public ResponseEntity<LevelDTO> getLevelByName(@PathVariable String name) {
        return levelService.getLevelByName(name)
                .map(level -> ResponseEntity.ok(level))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<LevelDTO> createLevel(@RequestBody LevelDTO levelDTO) {
        LevelDTO createdLevel = levelService.createLevel(levelDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdLevel);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LevelDTO> updateLevel(@PathVariable Long id, @RequestBody LevelDTO levelDTO) {
        return levelService.updateLevel(id, levelDTO)
                .map(level -> ResponseEntity.ok(level))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLevel(@PathVariable Long id) {
        if (levelService.deleteLevel(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
