package com.we24.cinemax.controller;

import com.we24.cinemax.model.MovieRequest;
import com.we24.cinemax.model.MovieResponse;
import com.we24.cinemax.model.ScreenTimeResponse;
import com.we24.cinemax.service.MovieService;
import com.we24.cinemax.service.ScreenTimeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class MovieController {

    private final MovieService movieService;
    private final ScreenTimeService screenTimeService;

    public MovieController(MovieService movieService, ScreenTimeService screenTimeService) {
        this.movieService = movieService;
        this.screenTimeService = screenTimeService;
    }

    // Public API - users can see movies
    @GetMapping("/movies")
    public ResponseEntity<List<MovieResponse>> getAllMovies() {
        return ResponseEntity.ok(movieService.getAllMovies());
    }

    // Public API - showtimes for a movie (flat path, works with /api/movies/* security)
    @GetMapping("/movies/screentimes")
    public ResponseEntity<List<ScreenTimeResponse>> getScreenTimesByMovieId(
            @RequestParam Long movieId
    ) {
        return ResponseEntity.ok(screenTimeService.getScreenTimesByMovie(movieId));
    }

    // Public API - single showtime (flat path, works with /api/movies/* security)
    @GetMapping("/movies/screentime/{id}")
    public ResponseEntity<ScreenTimeResponse> getScreenTimeByIdFlat(@PathVariable Long id) {
        return ResponseEntity.ok(screenTimeService.getScreenTimeById(id));
    }

    // Public API - users can see one movie
    @GetMapping("/movies/{id}")
    public ResponseEntity<MovieResponse> getMovieById(@PathVariable Long id) {
        return ResponseEntity.ok(movieService.getMovieById(id));
    }

    // Public API - showtimes for a movie (nested path)
    @GetMapping("/movies/{id}/screentimes")
    public ResponseEntity<List<ScreenTimeResponse>> getScreenTimesByMovie(@PathVariable Long id) {
        return ResponseEntity.ok(screenTimeService.getScreenTimesByMovie(id));
    }

    // Public API - single showtime (seat selection flow)
    @GetMapping("/screentimes/{id}")
    public ResponseEntity<ScreenTimeResponse> getScreenTimeById(@PathVariable Long id) {
        return ResponseEntity.ok(screenTimeService.getScreenTimeById(id));
    }

    // Public API - reserved seats for a showtime
    @GetMapping("/screentimes/{id}/seats")
    public ResponseEntity<List<String>> getReservedSeats(@PathVariable Long id) {
        return ResponseEntity.ok(screenTimeService.getReservedSeats(id));
    }

    // Admin API - add movie
    @PostMapping("/admin/movies")
    public ResponseEntity<MovieResponse> addMovie(@RequestBody MovieRequest request) {
        return ResponseEntity.ok(movieService.addMovie(request));
    }

    // Admin API - update movie
    @PutMapping("/admin/movies/{id}")
    public ResponseEntity<MovieResponse> updateMovie(
            @PathVariable Long id,
            @RequestBody MovieRequest request
    ) {
        return ResponseEntity.ok(movieService.updateMovie(id, request));
    }

    // Admin API - delete movie
    @DeleteMapping("/admin/movies/{id}")
    public ResponseEntity<String> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.ok("Movie deleted successfully");
    }
}