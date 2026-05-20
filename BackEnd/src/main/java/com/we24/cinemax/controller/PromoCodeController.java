package com.we24.cinemax.controller;

import com.we24.cinemax.model.PromoCodeRequest;
import com.we24.cinemax.model.PromoCodeResponse;
import com.we24.cinemax.service.PromoCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promo-codes")
@CrossOrigin("*")
@RequiredArgsConstructor
public class PromoCodeController {

    private final PromoCodeService promoCodeService;

    // Public API for Checkout integration
    @GetMapping("/validate")
    public ResponseEntity<?> validatePromoCode(@RequestParam String code) {
        try {
            return ResponseEntity.ok(promoCodeService.validatePromoCode(code));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Admin APIs
    @PostMapping
    public ResponseEntity<?> createPromoCode(@RequestBody PromoCodeRequest request) {
        try {
            return ResponseEntity.ok(promoCodeService.createPromoCode(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllPromoCodes() {
        try {
            return ResponseEntity.ok(promoCodeService.getAllPromoCodes());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPromoCodeById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(promoCodeService.getPromoCodeById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePromoCode(@PathVariable Long id, @RequestBody PromoCodeRequest request) {
        try {
            return ResponseEntity.ok(promoCodeService.updatePromoCode(id, request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePromoCode(@PathVariable Long id) {
        try {
            promoCodeService.deletePromoCode(id);
            return ResponseEntity.ok("Promo code deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
