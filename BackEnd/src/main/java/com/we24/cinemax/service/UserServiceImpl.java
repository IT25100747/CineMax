package com.we24.cinemax.service;

import com.we24.cinemax.entity.User;
import com.we24.cinemax.model.PasswordUpdateRequest;
import com.we24.cinemax.model.ProfileRequest;
import com.we24.cinemax.model.ProfileResponse;
import com.we24.cinemax.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private User getAuthenticatedUser() {
        String gmail = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByGmail(gmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public ProfileResponse getProfile() {
        User user = getAuthenticatedUser();
        return ProfileResponse.fromEntity(user);
    }

    @Override
    public ProfileResponse updateProfile(ProfileRequest request) {
        User user = getAuthenticatedUser();

        // Ensure email uniqueness if it's changing
        if (!user.getGmail().equalsIgnoreCase(request.getGmail()) &&
                userRepository.findByGmail(request.getGmail()).isPresent()) {
            throw new RuntimeException("Email is already in use");
        }

        user.setFullName(request.getFullName());
        user.setGmail(request.getGmail());
        user.setPhoneNumber(request.getPhoneNumber());

        return ProfileResponse.fromEntity(userRepository.save(user));
    }

    @Override
    public void updatePassword(PasswordUpdateRequest request) {
        User user = getAuthenticatedUser();

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Incorrect current password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public void deleteAccount() {
        User user = getAuthenticatedUser();
        // Thanks to @OnDelete(action = OnDeleteAction.SET_NULL) in Booking.java, 
        // past bookings will remain safely in the DB with user_id = null.
        userRepository.delete(user);
    }
}
