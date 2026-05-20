package com.we24.cinemax.security;

import  com.we24.cinemax.entity.User;
import  com.we24.cinemax.repository.UserRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {

        User user = userRepository.findByGmail(username)
                .orElseGet(() -> userRepository.findByPhoneNumber(username)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found")));

        return new org.springframework.security.core.userdetails.User(
                user.getGmail(),
                user.getPassword(),
                Collections.emptyList()
        );
    }
}