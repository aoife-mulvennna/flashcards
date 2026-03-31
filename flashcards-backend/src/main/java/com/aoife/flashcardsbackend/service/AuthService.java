package com.aoife.flashcardsbackend.service;

import com.aoife.flashcardsbackend.dto.UserDtos;
import com.aoife.flashcardsbackend.entity.UserEntity;
import com.aoife.flashcardsbackend.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public UserDtos.AuthResponse register(UserDtos.RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email already in use");
        }

        UserEntity user = new UserEntity();
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole("ROLE_USER");
        user.setEnabled(true);

        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail(), user.getRole());
        return new UserDtos.AuthResponse(token, user.getEmail(), user.getRole());
    }

    public UserDtos.AuthResponse login(UserDtos.LoginRequest request) {
        System.out.println("Trying login for email: " + request.email());
        System.out.println("User exists: " + userRepository.findByEmail(request.email()).isPresent());
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );

        UserEntity user = userRepository.findByEmail(request.email())
                .orElseThrow();


        System.out.println("Stored email: " + user.getEmail());
        System.out.println("Stored password: " + user.getPassword());
        System.out.println("Enabled: " + user.isEnabled());

        String token = jwtService.generateToken(user.getEmail(), user.getRole());
        return new UserDtos.AuthResponse(token, user.getEmail(), user.getRole());
    }
}