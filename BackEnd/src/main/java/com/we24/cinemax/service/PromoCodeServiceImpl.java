package com.we24.cinemax.service;

import com.we24.cinemax.entity.PromoCode;
import com.we24.cinemax.model.PromoCodeRequest;
import com.we24.cinemax.model.PromoCodeResponse;
import com.we24.cinemax.repository.PromoCodeRepository;
import com.we24.cinemax.repository.UserRepository;
import com.we24.cinemax.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PromoCodeServiceImpl implements PromoCodeService {

    private final PromoCodeRepository promoCodeRepository;
    private final UserRepository userRepository;

    private void checkAdmin() {
        String gmail = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User loggedUser = userRepository.findByGmail(gmail)
                .orElseThrow(() -> new RuntimeException("Logged user not found"));

        if (!"ADMIN".equalsIgnoreCase(loggedUser.getRole())) {
            throw new RuntimeException("Access denied: Admin only");
        }
    }

    @Override
    public PromoCodeResponse createPromoCode(PromoCodeRequest request) {
        checkAdmin();

        if (promoCodeRepository.existsByCode(request.getCode().toUpperCase())) {
            throw new RuntimeException("Promo code already exists");
        }

        if (request.getDiscountPercentage() < 1 || request.getDiscountPercentage() > 100) {
            throw new RuntimeException("Discount percentage must be between 1 and 100");
        }

        PromoCode promoCode = PromoCode.builder()
                .code(request.getCode().toUpperCase())
                .discountPercentage(request.getDiscountPercentage())
                .expiryDate(request.getExpiryDate())
                .status(request.getStatus() != null ? request.getStatus().toUpperCase() : "ACTIVE")
                .build();

        return PromoCodeResponse.fromEntity(promoCodeRepository.save(promoCode));
    }

    @Override
    public List<PromoCodeResponse> getAllPromoCodes() {
        checkAdmin();
        return promoCodeRepository.findAll().stream()
                .map(promoCode -> {
                    promoCode.updateStatusIfExpired();
                    promoCodeRepository.save(promoCode); // Auto-expire check (OOP Concept)
                    return PromoCodeResponse.fromEntity(promoCode);
                })
                .collect(Collectors.toList());
    }

    @Override
    public PromoCodeResponse getPromoCodeById(Long id) {
        checkAdmin();
        PromoCode promoCode = promoCodeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promo code not found"));
        return PromoCodeResponse.fromEntity(promoCode);
    }

    @Override
    public PromoCodeResponse updatePromoCode(Long id, PromoCodeRequest request) {
        checkAdmin();

        PromoCode promoCode = promoCodeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promo code not found"));

        if (!promoCode.getCode().equalsIgnoreCase(request.getCode()) &&
                promoCodeRepository.existsByCode(request.getCode().toUpperCase())) {
            throw new RuntimeException("Promo code already exists");
        }

        if (request.getDiscountPercentage() < 1 || request.getDiscountPercentage() > 100) {
            throw new RuntimeException("Discount percentage must be between 1 and 100");
        }

        promoCode.setCode(request.getCode().toUpperCase());
        promoCode.setDiscountPercentage(request.getDiscountPercentage());
        promoCode.setExpiryDate(request.getExpiryDate());
        if (request.getStatus() != null) {
            promoCode.setStatus(request.getStatus().toUpperCase());
        }

        return PromoCodeResponse.fromEntity(promoCodeRepository.save(promoCode));
    }

    @Override
    public void deletePromoCode(Long id) {
        checkAdmin();
        PromoCode promoCode = promoCodeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promo code not found"));
        
        // Permanent hard delete as requested
        promoCodeRepository.delete(promoCode);
    }

    @Override
    public PromoCodeResponse validatePromoCode(String code) {
        PromoCode promoCode = promoCodeRepository.findByCode(code.toUpperCase())
                .orElseThrow(() -> new RuntimeException("Invalid promo code"));

        promoCode.updateStatusIfExpired();
        promoCodeRepository.save(promoCode); // Persist auto-expiration

        if (!promoCode.isValid()) {
            throw new RuntimeException("Promo code is no longer valid or has expired");
        }

        return PromoCodeResponse.fromEntity(promoCode);
    }
}
