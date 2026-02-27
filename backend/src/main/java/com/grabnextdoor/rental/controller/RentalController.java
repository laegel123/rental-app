package com.grabnextdoor.rental.controller;

import com.grabnextdoor.rental.dto.CreateRentalRequestDto;
import com.grabnextdoor.rental.dto.RentalResponseDto;
import com.grabnextdoor.rental.service.RentalService;
import com.grabnextdoor.user.entity.User;
import com.grabnextdoor.user.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/rentals")
public class RentalController {

    private final RentalService rentalService;
    private final UserRepository userRepository;

    public RentalController(RentalService rentalService, UserRepository userRepository) {
        this.rentalService = rentalService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<RentalResponseDto> requestRental(@RequestBody CreateRentalRequestDto request) {
        User user = getCurrentUser();
        return ResponseEntity.ok(rentalService.requestRental(request, user));
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<RentalResponseDto> acceptRental(@PathVariable Long id) {
        User user = getCurrentUser();
        return ResponseEntity.ok(rentalService.acceptRental(id, user));
    }

    @PostMapping("/{id}/decline")
    public ResponseEntity<RentalResponseDto> declineRental(@PathVariable Long id) {
        User user = getCurrentUser();
        return ResponseEntity.ok(rentalService.declineRental(id, user));
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }
}
