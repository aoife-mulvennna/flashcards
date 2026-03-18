package com.aoife.flashcardsbackend.dto;

public class UserDtos {
    public record RegisterRequest(
            String email,
            String password
    ) {}

    public record LoginRequest(
            String email,
            String password
    ) {}

    public record AuthResponse(
            String token,
            String email,
            String role
    ) {}
}
