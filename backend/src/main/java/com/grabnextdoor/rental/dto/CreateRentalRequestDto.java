package com.grabnextdoor.rental.dto;

import java.time.LocalDate;

public class CreateRentalRequestDto {
    private Long itemId;
    private LocalDate startDate;
    private LocalDate endDate;

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
}
