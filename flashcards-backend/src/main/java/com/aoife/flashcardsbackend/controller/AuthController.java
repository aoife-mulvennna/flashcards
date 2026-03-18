package com.aoife.flashcardsbackend.controller;

import com.aoife.flashcardsbackend.dto.UserDtos;
import com.aoife.flashcardsbackend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserDtos.AuthResponse> register(@RequestBody UserDtos.RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<UserDtos.AuthResponse> login(@RequestBody UserDtos.LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}