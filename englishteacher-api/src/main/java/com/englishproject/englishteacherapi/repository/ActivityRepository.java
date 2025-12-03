package com.englishproject.englishteacherapi.repository;

import com.englishproject.englishteacherapi.model.Activity;
import com.englishproject.englishteacherapi.model.Level;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    List<Activity> findByLevelAndIsActiveTrue(Level level);

    @Query("SELECT a FROM Activity a WHERE a.level.id = :levelId AND a.isActive = true ORDER BY a.createdAt DESC")
    List<Activity> findActiveActivitiesByLevelId(@Param("levelId") Long levelId);

    @Query("SELECT a FROM Activity a WHERE a.type = :type AND a.isActive = true")
    List<Activity> findByTypeAndIsActiveTrue(@Param("type") Activity.ActivityType type);

    @Query("SELECT a FROM Activity a WHERE a.level.id = :levelId AND a.type = :type AND a.isActive = true")
    List<Activity> findByLevelIdAndTypeAndIsActiveTrue(@Param("levelId") Long levelId, @Param("type") Activity.ActivityType type);
}
