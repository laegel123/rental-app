package com.grabnextdoor.review.controller;

import com.grabnextdoor.review.dto.CreateReviewRequestDto;
import com.grabnextdoor.review.dto.ReviewResponseDto;
import com.grabnextdoor.review.service.ReviewService;
import com.grabnextdoor.user.entity.User;
import com.grabnextdoor.user.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ReviewController {

    private final ReviewService reviewService;
    private final UserRepository userRepository;

    public ReviewController(ReviewService reviewService, UserRepository userRepository) {
        this.reviewService = reviewService;
        this.userRepository = userRepository;
    }

    @PostMapping("/reviews")
    public ResponseEntity<ReviewResponseDto> createReview(@Valid @RequestBody CreateReviewRequestDto requestDto) {
        User user = getCurrentUser();
        return ResponseEntity.ok(reviewService.createReview(requestDto, user));
    }

    @GetMapping("/users/{id}/reviews")
    public ResponseEntity<List<ReviewResponseDto>> getUserReviews(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getReviewsForUser(id));
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }
}
