package com.we24.cinemax.service;

import com.we24.cinemax.model.UserResponse;

import java.util.List;

public interface AdminUserService {

    List<UserResponse> getAllUsers();

    void deleteUser(Long id);
}
