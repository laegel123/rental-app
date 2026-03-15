package com.grabnextdoor.review.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class CreateReviewRequestDto {

    @NotNull
    private Long itemId;

    @NotNull
    private Long revieweeId;

    @Min(1)
    @Max(5)
    private int rating;

    private String comment;

    public CreateReviewRequestDto() {
    }

    public CreateReviewRequestDto(Long itemId, Long revieweeId, int rating, String comment) {
        this.itemId = itemId;
        this.revieweeId = revieweeId;
        this.rating = rating;
        this.comment = comment;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public Long getRevieweeId() {
        return revieweeId;
    }

    public void setRevieweeId(Long revieweeId) {
        this.revieweeId = revieweeId;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
