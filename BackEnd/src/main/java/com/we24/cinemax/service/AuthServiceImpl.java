package com.we24.cinemax.service;

import com.we24.cinemax.entity.User;
import com.we24.cinemax.model.AuthResponse;
import com.we24.cinemax.model.LoginRequest;
import com.we24.cinemax.model.RegisterRequest;
import com.we24.cinemax.repository.UserRepository;
import com.we24.cinemax.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByGmail(request.getGmail())) {
            throw new RuntimeException("Gmail already registered");
        }

        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new RuntimeException("Phone number already registered");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setGmail(request.getGmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        String token = jwtService.generateToken(user.getGmail());

        return new AuthResponse(token, "Login successful", user.getRole());
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByGmail(request.getUsername())
                .orElseGet(() -> userRepository.findByPhoneNumber(request.getUsername())
                        .orElseThrow(() -> new RuntimeException("User not found")));

        String token = jwtService.generateToken(user.getGmail());

        return new AuthResponse(token, "Registration successful", user.getRole());
    }
}