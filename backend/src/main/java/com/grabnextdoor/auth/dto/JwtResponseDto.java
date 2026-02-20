package com.grabnextdoor.auth.dto;

public class JwtResponseDto {
    private String accessToken;

    public JwtResponseDto(String accessToken) {
        this.accessToken = accessToken;
    }

    // Getter
    public String getAccessToken() {
        return accessToken;
    }

    // Setter
    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }
}
