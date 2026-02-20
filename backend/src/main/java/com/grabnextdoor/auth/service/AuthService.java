package com.grabnextdoor.auth.service;

import com.grabnextdoor.auth.dto.LoginRequestDto;
import com.grabnextdoor.auth.dto.SignUpRequestDto;
import com.grabnextdoor.auth.util.JwtUtils;
import com.grabnextdoor.geocode.service.GeocodioService;
import com.grabnextdoor.user.entity.User;
import com.grabnextdoor.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class AuthService {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    GeocodioService geocodioService;

    public Mono<User> registerUser(SignUpRequestDto signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return Mono.error(new RuntimeException("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return Mono.error(new RuntimeException("Error: Email is already in use!"));
        }

        return geocodioService.getCoordinatesForPostalCode(signUpRequest.getPostalCode())
                .map(point -> {
                    User user = new User(
                            signUpRequest.getUsername(),
                            encoder.encode(signUpRequest.getPassword()),
                            signUpRequest.getEmail(),
                            point
                    );
                    return userRepository.save(user);
                });
    }

    public String authenticateUser(LoginRequestDto loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        return jwtUtils.generateJwtToken(authentication);
    }
}
