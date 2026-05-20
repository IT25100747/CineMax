package com.we24.cinemax.service;

import com.we24.cinemax.model.AuthResponse;
import com.we24.cinemax.model.LoginRequest;
import com.we24.cinemax.model.RegisterRequest;

public interface AuthService {

    com.we24.cinemax.model.AuthResponse register(com.we24.cinemax.model.RegisterRequest request);

    AuthResponse login(com.we24.cinemax.model.LoginRequest request);
}