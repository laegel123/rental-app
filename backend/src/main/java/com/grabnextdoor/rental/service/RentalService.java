package com.grabnextdoor.rental.service;

import com.grabnextdoor.item.entity.Item;
import com.grabnextdoor.item.repository.ItemRepository;
import com.grabnextdoor.rental.dto.CreateRentalRequestDto;
import com.grabnextdoor.rental.dto.RentalResponseDto;
import com.grabnextdoor.rental.entity.Rental;
import com.grabnextdoor.rental.entity.RentalStatus;
import com.grabnextdoor.rental.repository.RentalRepository;
import com.grabnextdoor.user.entity.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RentalService {

    private final RentalRepository rentalRepository;
    private final ItemRepository itemRepository;

    public RentalService(RentalRepository rentalRepository, ItemRepository itemRepository) {
        this.rentalRepository = rentalRepository;
        this.itemRepository = itemRepository;
    }

    @Transactional
    public RentalResponseDto requestRental(CreateRentalRequestDto request, User borrower) {
        Item item = itemRepository.findById(request.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (item.getOwner().getId().equals(borrower.getId())) {
            throw new RuntimeException("Owner cannot borrow their own item");
        }

        Rental rental = new Rental();
        rental.setItem(item);
        rental.setBorrower(borrower);
        rental.setStartDate(request.getStartDate());
        rental.setEndDate(request.getEndDate());
        rental.setStatus(RentalStatus.REQUESTED);

        Rental savedRental = rentalRepository.save(rental);
        return convertToDto(savedRental);
    }

    @Transactional
    public RentalResponseDto acceptRental(Long rentalId, User owner) {
        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found"));

        if (!rental.getItem().getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Only the owner can accept the rental request");
        }

        if (rental.getStatus() != RentalStatus.REQUESTED) {
            throw new RuntimeException("Rental is not in REQUESTED status");
        }

        rental.setStatus(RentalStatus.ACCEPTED);
        Rental savedRental = rentalRepository.save(rental);
        return convertToDto(savedRental);
    }

    @Transactional
    public RentalResponseDto declineRental(Long rentalId, User owner) {
        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found"));

        if (!rental.getItem().getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Only the owner can decline the rental request");
        }

        if (rental.getStatus() != RentalStatus.REQUESTED) {
            throw new RuntimeException("Rental is not in REQUESTED status");
        }

        rental.setStatus(RentalStatus.DECLINED);
        Rental savedRental = rentalRepository.save(rental);
        return convertToDto(savedRental);
    }

    @Transactional
    public RentalResponseDto startRental(Long rentalId, User owner) {
        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found"));

        if (!rental.getItem().getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Only the owner can start the rental");
        }

        if (rental.getStatus() != RentalStatus.ACCEPTED) {
            throw new RuntimeException("Rental is not in ACCEPTED status");
        }

        rental.setStatus(RentalStatus.IN_PROGRESS);
        Rental savedRental = rentalRepository.save(rental);
        return convertToDto(savedRental);
    }

    @Transactional
    public RentalResponseDto returnRental(Long rentalId, User owner) {
        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found"));

        if (!rental.getItem().getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Only the owner can complete the rental");
        }

        if (rental.getStatus() != RentalStatus.IN_PROGRESS) {
            throw new RuntimeException("Rental is not in IN_PROGRESS status");
        }

        rental.setStatus(RentalStatus.COMPLETED);
        Rental savedRental = rentalRepository.save(rental);
        return convertToDto(savedRental);
    }

    @Transactional(readOnly = true)
    public List<RentalResponseDto> getRentalsByBorrower(User borrower) {
        return rentalRepository.findByBorrowerIdOrderByCreatedAtDesc(borrower.getId())
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RentalResponseDto> getRentalsByOwner(User owner) {
        return rentalRepository.findByItemOwnerIdOrderByCreatedAtDesc(owner.getId())
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private RentalResponseDto convertToDto(Rental rental) {
        RentalResponseDto dto = new RentalResponseDto();
        dto.setId(rental.getId());
        dto.setItemId(rental.getItem().getId());
        dto.setItemName(rental.getItem().getName());
        dto.setBorrowerId(rental.getBorrower().getId());
        dto.setBorrowerUsername(rental.getBorrower().getUsername());
        dto.setStartDate(rental.getStartDate());
        dto.setEndDate(rental.getEndDate());
        dto.setStatus(rental.getStatus());
        dto.setCreatedAt(rental.getCreatedAt());
        return dto;
    }
}
