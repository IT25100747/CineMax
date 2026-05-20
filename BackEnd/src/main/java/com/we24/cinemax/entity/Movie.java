package com.we24.cinemax.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "movies")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String movieName;
    private String genre;
    private String rating;
    private String status;
    private String movieTime;

    @Column(length = 2000)
    private String description;

    @Column(length = 1000)
    private String cast;

    @Column(length = 1000)
    private String posterUrl;

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

    public void setId(Long id) {
        this.id = id;
    }

    public void setMovieName(String movieName) {
        this.movieName = movieName;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setMovieTime(String movieTime) {
        this.movieTime = movieTime;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCast(String cast) {
        this.cast = cast;
    }

    public void setPosterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
    }
}