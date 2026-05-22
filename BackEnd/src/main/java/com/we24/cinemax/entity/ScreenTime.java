package com.we24.cinemax.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "screen_times")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScreenTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate showDate;

    private LocalTime showTime;

    private Integer screenNumber;

    private Double ticketPrice;
    
    @Column(nullable = false)
    @Builder.Default
    private String status = "ACTIVE";

    // Many screen times belong to one movie
    @ManyToOne
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;
}