package com.grabnextdoor.rental.repository;

import com.grabnextdoor.rental.entity.Rental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import java.util.Optional;
import com.grabnextdoor.rental.entity.RentalStatus;

@Repository
public interface RentalRepository extends JpaRepository<Rental, Long> {
    List<Rental> findByBorrowerIdOrderByCreatedAtDesc(Long borrowerId);
    List<Rental> findByItemOwnerIdOrderByCreatedAtDesc(Long ownerId);
    Optional<Rental> findFirstByItemIdAndBorrowerIdAndStatusOrderByCreatedAtDesc(Long itemId, Long borrowerId, RentalStatus status);
}
