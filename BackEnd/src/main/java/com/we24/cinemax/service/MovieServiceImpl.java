package com.we24.cinemax.service;

import com.we24.cinemax.entity.Movie;
import com.we24.cinemax.entity.User;
import com.we24.cinemax.model.MovieRequest;
import com.we24.cinemax.model.MovieResponse;
import com.we24.cinemax.repository.MovieRepository;
import com.we24.cinemax.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

import com.we24.cinemax.repository.BookingRepository;
import com.we24.cinemax.repository.ScreenTimeRepository;
import com.we24.cinemax.entity.ScreenTime;
import java.time.LocalDate;
import java.time.LocalTime;

@Service
public class MovieServiceImpl implements MovieService {

    private final MovieRepository movieRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final ScreenTimeRepository screenTimeRepository;

    public MovieServiceImpl(
            MovieRepository movieRepository,
            UserRepository userRepository,
            BookingRepository bookingRepository,
            ScreenTimeRepository screenTimeRepository
    ) {
        this.movieRepository = movieRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.screenTimeRepository = screenTimeRepository;
    }

    @Override
    public MovieResponse addMovie(MovieRequest request) {
        checkAdmin();

        Movie movie = new Movie();
        setMovieData(movie, request);

        try {
            Movie savedMovie = movieRepository.save(movie);
            return new MovieResponse(savedMovie);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            throw new RuntimeException("Cannot add movie. Please check if the fields are too long or invalid.");
        }
    }

    @Override
    public List<MovieResponse> getAllMovies() {
        return movieRepository.findAll()
                .stream()
                .map(MovieResponse::new)
                .toList();
    }

    @Override
    public MovieResponse getMovieById(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        return new MovieResponse(movie);
    }

    @Override
    public MovieResponse updateMovie(Long id, MovieRequest request) {
        checkAdmin();

        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        setMovieData(movie, request);

        try {
            Movie updatedMovie = movieRepository.save(movie);
            return new MovieResponse(updatedMovie);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            throw new RuntimeException("Cannot update movie. Please check if the fields are too long or invalid.");
        }
    }

    @Override
    public void deleteMovie(Long id) {
        checkAdmin();

        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        boolean hasBookings = bookingRepository.existsByScreenTime_Movie_Id(id);

        if (hasBookings) {
            // Soft delete
            movie.setStatus("INACTIVE");
            movieRepository.save(movie);

            List<ScreenTime> screenTimes = screenTimeRepository.findByMovieId(id);
            LocalDate today = LocalDate.now();
            LocalTime now = LocalTime.now();

            for (ScreenTime st : screenTimes) {
                if (st.getShowDate() != null && st.getShowTime() != null) {
                    if (st.getShowDate().isAfter(today) || (st.getShowDate().isEqual(today) && st.getShowTime().isAfter(now))) {
                        st.setStatus("CANCELLED");
                        screenTimeRepository.save(st);
                    }
                }
            }
        } else {
            // Hard delete
            try {
                movieRepository.deleteById(id);
            } catch (org.springframework.dao.DataIntegrityViolationException e) {
                throw new RuntimeException("Cannot delete movie because it has associated screen times or bookings.");
            }
        }
    }

    private void setMovieData(Movie movie, MovieRequest request) {
        movie.setMovieName(request.getMovieName());
        movie.setGenre(request.getGenre());
        movie.setRating(request.getRating());
        movie.setStatus(request.getStatus());
        movie.setMovieTime(request.getMovieTime());
        movie.setDescription(request.getDescription());
        movie.setCast(request.getCast());
        movie.setPosterUrl(request.getPosterUrl());
    }

    private void checkAdmin() {
        String gmail = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User loggedUser = userRepository.findByGmail(gmail)
                .orElseThrow(() -> new RuntimeException("Logged user not found"));

        if (!"ADMIN".equalsIgnoreCase(loggedUser.getRole())) {
            throw new RuntimeException("Only admin can manage movies");
        }
    }
}