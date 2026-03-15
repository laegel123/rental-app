package com.grabnextdoor.review.service;

import com.grabnextdoor.item.entity.Item;
import com.grabnextdoor.item.repository.ItemRepository;
import com.grabnextdoor.rental.entity.Rental;
import com.grabnextdoor.rental.entity.RentalStatus;
import com.grabnextdoor.rental.repository.RentalRepository;
import com.grabnextdoor.review.dto.CreateReviewRequestDto;
import com.grabnextdoor.review.dto.ReviewResponseDto;
import com.grabnextdoor.review.entity.Review;
import com.grabnextdoor.review.repository.ReviewRepository;
import com.grabnextdoor.user.entity.User;
import com.grabnextdoor.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final RentalRepository rentalRepository;
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;

    public ReviewService(ReviewRepository reviewRepository, RentalRepository rentalRepository, UserRepository userRepository, ItemRepository itemRepository) {
        this.reviewRepository = reviewRepository;
        this.rentalRepository = rentalRepository;
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
    }

    @Transactional
    public ReviewResponseDto createReview(CreateReviewRequestDto requestDto, User reviewer) {
        Item item = itemRepository.findById(requestDto.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));
        User reviewee = userRepository.findById(requestDto.getRevieweeId())
                .orElseThrow(() -> new RuntimeException("Reviewee not found"));

        // Basic verification: reviewer cannot review themselves
        if (reviewer.getId().equals(reviewee.getId())) {
            throw new RuntimeException("Cannot review yourself");
        }

        // Verify that there is a COMPLETED rental between the reviewer and reviewee for this item
        // We need to find if either:
        // 1. Reviewer is Borrower, Reviewee is Owner
        // 2. Reviewer is Owner, Reviewee is Borrower
        boolean isValidTransaction = false;
        
        if (item.getOwner().getId().equals(reviewee.getId())) {
            // Case 1: Reviewer is Borrower, Reviewee is Owner
            isValidTransaction = rentalRepository.findFirstByItemIdAndBorrowerIdAndStatusOrderByCreatedAtDesc(item.getId(), reviewer.getId(), RentalStatus.COMPLETED).isPresent();
        } else if (item.getOwner().getId().equals(reviewer.getId())) {
            // Case 2: Reviewer is Owner, Reviewee is Borrower
            isValidTransaction = rentalRepository.findFirstByItemIdAndBorrowerIdAndStatusOrderByCreatedAtDesc(item.getId(), reviewee.getId(), RentalStatus.COMPLETED).isPresent();
        }

        if (!isValidTransaction) {
            throw new RuntimeException("No completed rental found for this item between these users");
        }

        Review review = new Review(item, reviewer, reviewee, requestDto.getRating(), requestDto.getComment());
        Review savedReview = reviewRepository.save(review);
        return convertToDto(savedReview);
    }

    @Transactional(readOnly = true)
    public List<ReviewResponseDto> getReviewsForUser(Long userId) {
        return reviewRepository.findByRevieweeId(userId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private ReviewResponseDto convertToDto(Review review) {
        ReviewResponseDto dto = new ReviewResponseDto();
        dto.setId(review.getId());
        dto.setItemId(review.getItem().getId());
        dto.setItemName(review.getItem().getName());
        dto.setReviewerId(review.getReviewer().getId());
        dto.setReviewerUsername(review.getReviewer().getUsername());
        dto.setRevieweeId(review.getReviewee().getId());
        dto.setRevieweeUsername(review.getReviewee().getUsername());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }
}
