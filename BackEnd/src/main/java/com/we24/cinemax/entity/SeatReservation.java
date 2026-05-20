package com.we24.cinemax.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "seat_reservations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatReservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "screen_time_id", nullable = false)
    private ScreenTime screenTime;

    @Column(nullable = false)
    private String seatNumber; // e.g. "J12", "A1"

    @Column(nullable = false)
    private String status; // RESERVED
}
