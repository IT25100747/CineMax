package com.we24.cinemax.controller;

import com.we24.cinemax.model.ScreenTimeRequest;
import com.we24.cinemax.model.ScreenTimeResponse;
import com.we24.cinemax.service.ScreenTimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/screentimes")
@RequiredArgsConstructor
public class ScreenTimeController {

    private final ScreenTimeService screenTimeService;

    @PostMapping
    public ScreenTimeResponse create(@RequestBody ScreenTimeRequest request) {
        return screenTimeService.createScreenTime(request);
    }

    @GetMapping
    public List<ScreenTimeResponse> getAll() {
        return screenTimeService.getAllScreenTimes();
    }

    @GetMapping("/{id}")
    public ScreenTimeResponse getById(@PathVariable Long id) {
        return screenTimeService.getScreenTimeById(id);
    }

    @PutMapping("/{id}")
    public ScreenTimeResponse update(
            @PathVariable Long id,
            @RequestBody ScreenTimeRequest request
    ) {
        return screenTimeService.updateScreenTime(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        screenTimeService.deleteScreenTime(id);
    }

    @GetMapping("/movie/{movieId}")
    public List<ScreenTimeResponse> getByMovie(@PathVariable Long movieId) {
        return screenTimeService.getScreenTimesByMovie(movieId);
    }
}