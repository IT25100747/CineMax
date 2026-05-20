package com.we24.cinemax.model;

import com.we24.cinemax.entity.User;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProfileResponse {
    private Long id;
    private String fullName;
    private String gmail;
    private String phoneNumber;
    private String role;

    public static ProfileResponse fromEntity(User user) {
        return ProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .gmail(user.getGmail())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .build();
    }
}
