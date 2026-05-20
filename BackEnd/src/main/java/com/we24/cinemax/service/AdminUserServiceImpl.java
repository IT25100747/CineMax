package com.we24.cinemax.service;

import com.we24.cinemax.entity.User;
import com.we24.cinemax.model.UserResponse;
import com.we24.cinemax.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;

    public AdminUserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<UserResponse> getAllUsers() {
        checkAdmin();

        return userRepository.findAll()
                .stream()
                .map(UserResponse::new)
                .toList();
    }

    @Override
    public void deleteUser(Long id) {
        checkAdmin();

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Admin user cannot be deleted");
        }

        userRepository.deleteById(id);
    }

    private void checkAdmin() {
        String gmail = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User loggedUser = userRepository.findByGmail(gmail)
                .orElseThrow(() -> new RuntimeException("Logged user not found"));

        if (!"ADMIN".equalsIgnoreCase(loggedUser.getRole())) {
            throw new RuntimeException("Only admin can access this API");
        }
    }
}