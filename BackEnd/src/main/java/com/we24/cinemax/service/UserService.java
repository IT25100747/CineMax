package com.we24.cinemax.service;

import com.we24.cinemax.model.PasswordUpdateRequest;
import com.we24.cinemax.model.ProfileRequest;
import com.we24.cinemax.model.ProfileResponse;

public interface UserService {
    ProfileResponse getProfile();
    ProfileResponse updateProfile(ProfileRequest request);
    void updatePassword(PasswordUpdateRequest request);
    void deleteAccount();
}