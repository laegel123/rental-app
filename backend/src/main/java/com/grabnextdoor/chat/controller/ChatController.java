package com.grabnextdoor.chat.controller;

import com.grabnextdoor.chat.dto.ChatMessageDto;
import com.grabnextdoor.chat.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(ChatService chatService, SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat/{rentalId}")
    public void processMessage(@DestinationVariable Long rentalId, ChatMessageDto messageDto) {
        // Assume messageDto contains senderId and message. 
        // In a real application, senderId would be retrieved from the authenticated user.
        ChatMessageDto savedMessage = chatService.saveMessage(rentalId, messageDto.getSenderId(), messageDto.getMessage());
        
        // Broadcast to subscribers of the specific rental's topic
        messagingTemplate.convertAndSend("/topic/rental/" + rentalId, savedMessage);
    }

    @GetMapping("/{rentalId}/messages")
    public ResponseEntity<List<ChatMessageDto>> getChatHistory(@PathVariable Long rentalId) {
        return ResponseEntity.ok(chatService.getMessagesByRentalId(rentalId));
    }
}
