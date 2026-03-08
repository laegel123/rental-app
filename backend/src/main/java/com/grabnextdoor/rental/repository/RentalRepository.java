package com.grabnextdoor.rental.repository;

import com.grabnextdoor.rental.entity.Rental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RentalRepository extends JpaRepository<Rental, Long> {
    List<Rental> findByBorrowerIdOrderByCreatedAtDesc(Long borrowerId);
    List<Rental> findByItemOwnerIdOrderByCreatedAtDesc(Long ownerId);
}
