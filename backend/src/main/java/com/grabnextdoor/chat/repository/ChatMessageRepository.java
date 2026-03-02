package com.grabnextdoor.chat.repository;

import com.grabnextdoor.chat.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByRentalIdOrderByCreatedAtAsc(Long rentalId);
}
