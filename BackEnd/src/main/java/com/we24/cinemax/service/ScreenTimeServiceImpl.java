package com.we24.cinemax.service;

import com.we24.cinemax.entity.Movie;
import com.we24.cinemax.entity.ScreenTime;
import com.we24.cinemax.model.ScreenTimeRequest;
import com.we24.cinemax.model.ScreenTimeResponse;
import com.we24.cinemax.repository.MovieRepository;
import com.we24.cinemax.repository.ScreenTimeRepository;
import com.we24.cinemax.service.ScreenTimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScreenTimeServiceImpl implements ScreenTimeService {

    private final ScreenTimeRepository screenTimeRepository;
    private final MovieRepository movieRepository;
    private final com.we24.cinemax.repository.SeatReservationRepository seatReservationRepository;

    @Override
    public ScreenTimeResponse createScreenTime(ScreenTimeRequest request) {

        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        ScreenTime screenTime = ScreenTime.builder()
                .movie(movie)
                .showDate(request.getShowDate())
                .showTime(request.getShowTime())
                .screenNumber(request.getScreenNumber())
                .ticketPrice(request.getTicketPrice())
                .build();

        screenTimeRepository.save(screenTime);

        return mapToResponse(screenTime);
    }

    @Override
    public List<ScreenTimeResponse> getAllScreenTimes() {
        return screenTimeRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ScreenTimeResponse getScreenTimeById(Long id) {
        ScreenTime screenTime = screenTimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ScreenTime not found"));

        return mapToResponse(screenTime);
    }

    @Override
    public ScreenTimeResponse updateScreenTime(Long id, ScreenTimeRequest request) {

        ScreenTime screenTime = screenTimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ScreenTime not found"));

        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        screenTime.setMovie(movie);
        screenTime.setShowDate(request.getShowDate());
        screenTime.setShowTime(request.getShowTime());
        screenTime.setScreenNumber(request.getScreenNumber());
        screenTime.setTicketPrice(request.getTicketPrice());

        screenTimeRepository.save(screenTime);

        return mapToResponse(screenTime);
    }

    @Override
    public void deleteScreenTime(Long id) {
        screenTimeRepository.deleteById(id);
    }

    @Override
    public List<ScreenTimeResponse> getScreenTimesByMovie(Long movieId) {
        return screenTimeRepository.findByMovieId(movieId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<String> getReservedSeats(Long screenTimeId) {
        return seatReservationRepository.findByScreenTimeId(screenTimeId)
                .stream()
                .filter(res -> res.getStatus().equals("RESERVED"))
                .map(com.we24.cinemax.entity.SeatReservation::getSeatNumber)
                .collect(Collectors.toList());
    }

    private ScreenTimeResponse mapToResponse(ScreenTime screenTime) {
        return ScreenTimeResponse.builder()
                .id(screenTime.getId())
                .movieId(screenTime.getMovie().getId())
                .movieName(screenTime.getMovie().getMovieName())
                .showDate(screenTime.getShowDate())
                .showTime(screenTime.getShowTime())
                .screenNumber(screenTime.getScreenNumber())
                .ticketPrice(screenTime.getTicketPrice())
                .status(screenTime.getStatus())
                .build();
    }
}