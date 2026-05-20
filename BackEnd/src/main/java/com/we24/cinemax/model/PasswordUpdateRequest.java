package com.we24.cinemax.model;

import lombok.Data;

@Data
public class PasswordUpdateRequest {
    private String currentPassword;
    private String newPassword;
}
