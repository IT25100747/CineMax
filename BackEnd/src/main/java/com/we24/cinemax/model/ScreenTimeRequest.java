package com.we24.cinemax.model;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ScreenTimeRequest {

    private Long movieId;

    private LocalDate showDate;

    private LocalTime showTime;

    private Integer screenNumber;

    private Double ticketPrice;
}