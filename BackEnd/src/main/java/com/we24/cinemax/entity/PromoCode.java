package com.we24.cinemax.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "promo_codes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromoCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    @Column(nullable = false)
    private Double discountPercentage;

    @Column(nullable = false)
    private LocalDate expiryDate;

    @Column(nullable = false)
    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, EXPIRED, DISABLED

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    // OOP Concept: Encapsulated Business Logic

    public boolean isValid() {
        if (!"ACTIVE".equals(status)) {
            return false;
        }
        if (expiryDate.isBefore(LocalDate.now())) {
            return false;
        }
        return true;
    }

    public double applyDiscount(double originalAmount) {
        if (!isValid()) {
            return originalAmount;
        }
        double discountAmount = originalAmount * (discountPercentage / 100.0);
        return originalAmount - discountAmount;
    }

    public void updateStatusIfExpired() {
        if ("ACTIVE".equals(status) && expiryDate.isBefore(LocalDate.now())) {
            this.status = "EXPIRED";
        }
    }
}
