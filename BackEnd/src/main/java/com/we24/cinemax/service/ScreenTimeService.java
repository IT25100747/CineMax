package com.we24.cinemax.service;

import com.we24.cinemax.model.ScreenTimeRequest;
import com.we24.cinemax.model.ScreenTimeResponse;

import java.util.List;

public interface ScreenTimeService {

    ScreenTimeResponse createScreenTime(ScreenTimeRequest request);

    List<ScreenTimeResponse> getAllScreenTimes();

    ScreenTimeResponse getScreenTimeById(Long id);

    ScreenTimeResponse updateScreenTime(Long id, ScreenTimeRequest request);

    void deleteScreenTime(Long id);

    List<ScreenTimeResponse> getScreenTimesByMovie(Long movieId);

    List<String> getReservedSeats(Long screenTimeId);
}