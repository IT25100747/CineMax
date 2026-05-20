package com.we24.cinemax.model;

import com.we24.cinemax.entity.User;

public class UserResponse {

    private Long id;
    private String fullName;
    private String gmail;
    private String phoneNumber;
    private String role;

    public UserResponse(User user) {
        this.id = user.getId();
        this.fullName = user.getFullName();
        this.gmail = user.getGmail();
        this.phoneNumber = user.getPhoneNumber();
        this.role = user.getRole();
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getGmail() {
        return gmail;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getRole() {
        return role;
    }
}