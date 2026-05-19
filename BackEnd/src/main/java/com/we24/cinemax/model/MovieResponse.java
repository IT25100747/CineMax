package com.we24.cinemax.model;

import com.we24.cinemax.entity.Movie;

public class MovieResponse {

    private Long id;
    private String movieName;
    private String genre;
    private String rating;
    private String status;
    private String movieTime;
    private String description;
    private String cast;
    private String posterUrl;

    public MovieResponse(Movie movie) {
        this.id = movie.getId();
        this.movieName = movie.getMovieName();
        this.genre = movie.getGenre();
        this.rating = movie.getRating();
        this.status = movie.getStatus();
        this.movieTime = movie.getMovieTime();
        this.description = movie.getDescription();
        this.cast = movie.getCast();
        this.posterUrl = movie.getPosterUrl();
    }

    public Long getId() {
        return id;
    }

    public String getMovieName() {
        return movieName;
    }

    public String getGenre() {
        return genre;
    }

    public String getRating() {
        return rating;
    }

    public String getStatus() {
        return status;
    }

    public String getMovieTime() {
        return movieTime;
    }

    public String getDescription() {
        return description;
    }

    public String getCast() {
        return cast;
    }

    public String getPosterUrl() {
        return posterUrl;
    }
}