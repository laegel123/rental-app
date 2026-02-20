package com.grabnextdoor.auth.controller;

import com.grabnextdoor.auth.dto.JwtResponseDto;
import com.grabnextdoor.auth.dto.LoginRequestDto;
import com.grabnextdoor.auth.dto.SignUpRequestDto;
import com.grabnextdoor.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<JwtResponseDto> authenticateUser(@RequestBody LoginRequestDto loginRequest) {
        String jwt = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(new JwtResponseDto(jwt));
    }

    @PostMapping("/signup")
    public Mono<ResponseEntity<String>> registerUser(@RequestBody SignUpRequestDto signUpRequest) {
        return authService.registerUser(signUpRequest)
                .map(user -> ResponseEntity.ok("User registered successfully!"))
                .onErrorResume(e -> Mono.just(ResponseEntity.badRequest().body(e.getMessage())));
    }
}
