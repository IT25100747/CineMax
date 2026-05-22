package com.we24.cinemax.repository;

import com.we24.cinemax.entity.ScreenTime;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScreenTimeRepository extends JpaRepository<ScreenTime, Long> {

    List<ScreenTime> findByMovieId(Long movieId);
}
