package com.grabnextdoor.item.dto;

import com.grabnextdoor.item.entity.Item;

import java.math.BigDecimal;

public class ItemResponseDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal deposit;
    private String categoryName;
    private String ownerName;
    private double latitude;
    private double longitude;
    
    // Constructor
    public ItemResponseDTO(Item item) {
        this.id = item.getId();
        this.name = item.getName();
        this.description = item.getDescription();
        this.price = item.getPrice();
        this.deposit = item.getDeposit();
        if (item.getCategory() != null) {
            this.categoryName = item.getCategory().getName();
        }
        if (item.getOwner() != null) {
            this.ownerName = item.getOwner().getUsername();
        }
        if (item.getLocation() != null) {
            this.longitude = item.getLocation().getX();
            this.latitude = item.getLocation().getY();
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getDeposit() {
        return deposit;
    }

    public void setDeposit(BigDecimal deposit) {
        this.deposit = deposit;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }
}
