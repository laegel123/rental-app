package com.grabnextdoor.chat.service;

import com.grabnextdoor.chat.dto.ChatMessageDto;
import com.grabnextdoor.chat.entity.ChatMessage;
import com.grabnextdoor.chat.repository.ChatMessageRepository;
import com.grabnextdoor.rental.entity.Rental;
import com.grabnextdoor.rental.repository.RentalRepository;
import com.grabnextdoor.user.entity.User;
import com.grabnextdoor.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final RentalRepository rentalRepository;
    private final UserRepository userRepository;

    public ChatService(ChatMessageRepository chatMessageRepository, RentalRepository rentalRepository, UserRepository userRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.rentalRepository = rentalRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ChatMessageDto saveMessage(Long rentalId, Long senderId, String message) {
        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found"));

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Basic authorization: only borrower or item owner can send messages
        if (!rental.getBorrower().getId().equals(senderId) && !rental.getItem().getOwner().getId().equals(senderId)) {
            throw new RuntimeException("Unauthorized: User is not part of this rental");
        }

        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setRental(rental);
        chatMessage.setSender(sender);
        chatMessage.setMessage(message);

        ChatMessage savedMessage = chatMessageRepository.save(chatMessage);
        return convertToDto(savedMessage);
    }

    @Transactional(readOnly = true)
    public List<ChatMessageDto> getMessagesByRentalId(Long rentalId) {
        return chatMessageRepository.findByRentalIdOrderByCreatedAtAsc(rentalId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private ChatMessageDto convertToDto(ChatMessage chatMessage) {
        ChatMessageDto dto = new ChatMessageDto();
        dto.setId(chatMessage.getId());
        dto.setRentalId(chatMessage.getRental().getId());
        dto.setSenderId(chatMessage.getSender().getId());
        dto.setSenderUsername(chatMessage.getSender().getUsername());
        dto.setMessage(chatMessage.getMessage());
        dto.setCreatedAt(chatMessage.getCreatedAt());
        return dto;
    }
}
