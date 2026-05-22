package com.we24.cinemax.model;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
public class ScreenTimeResponse {

    private Long id;

    private Long movieId;

    private String movieName;

    private LocalDate showDate;

    private LocalTime showTime;

    private Integer screenNumber;

    private Double ticketPrice;
    
    private String status;
}