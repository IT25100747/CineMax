package com.we24.cinemax.model;

import com.we24.cinemax.entity.PromoCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PromoCodeResponse {
    private Long id;
    private String code;
    private Double discountPercentage;
    private LocalDate expiryDate;
    private String status;
    private LocalDateTime createdAt;
    private boolean valid;

    public static PromoCodeResponse fromEntity(PromoCode entity) {
        return PromoCodeResponse.builder()
                .id(entity.getId())
                .code(entity.getCode())
                .discountPercentage(entity.getDiscountPercentage())
                .expiryDate(entity.getExpiryDate())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .valid(entity.isValid()) // OOP concept: Utilizing the entity's encapsulated validation
                .build();
    }
}
