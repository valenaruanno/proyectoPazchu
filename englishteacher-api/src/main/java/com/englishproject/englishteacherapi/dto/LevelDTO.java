package com.englishproject.englishteacherapi.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LevelDTO {
    private Long id;
    private String name;
    private String description;
    private Long activitiesCount;
}
