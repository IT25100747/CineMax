package com.we24.cinemax.service;

import com.we24.cinemax.model.PromoCodeRequest;
import com.we24.cinemax.model.PromoCodeResponse;
import java.util.List;

public interface PromoCodeService {
    PromoCodeResponse createPromoCode(PromoCodeRequest request);
    List<PromoCodeResponse> getAllPromoCodes();
    PromoCodeResponse getPromoCodeById(Long id);
    PromoCodeResponse updatePromoCode(Long id, PromoCodeRequest request);
    void deletePromoCode(Long id);
    PromoCodeResponse validatePromoCode(String code);
}
