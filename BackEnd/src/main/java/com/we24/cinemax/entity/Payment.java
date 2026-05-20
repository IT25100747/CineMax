package com.we24.cinemax.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(nullable = false)
    private String transactionId; // Reference from payment provider

    @Column(nullable = false)
    private String paymentMethod; // e.g., CREDIT_CARD

    @Column(nullable = false)
    private Double paidAmount;

    @Column(nullable = false)
    private String paymentStatus; // SUCCESS, FAILED

    private LocalDateTime paymentTimestamp;
}
