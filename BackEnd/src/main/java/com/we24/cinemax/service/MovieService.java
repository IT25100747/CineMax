package com.we24.cinemax.service;

import com.we24.cinemax.model.MovieRequest;
import com.we24.cinemax.model.MovieResponse;

import java.util.List;

public interface MovieService {

    MovieResponse addMovie(MovieRequest request);

    List<MovieResponse> getAllMovies();

    MovieResponse getMovieById(Long id);

    MovieResponse updateMovie(Long id, MovieRequest request);

    void deleteMovie(Long id);
}