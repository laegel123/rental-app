package com.grabnextdoor.chat.controller;

import com.grabnextdoor.chat.dto.ChatMessageDto;
import com.grabnextdoor.chat.service.ChatService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class ChatControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ChatService chatService;

    @Test
    @WithMockUser
    void getChatHistory_ShouldReturnMessages() throws Exception {
        ChatMessageDto messageDto = new ChatMessageDto();
        messageDto.setId(1L);
        messageDto.setRentalId(100L);
        messageDto.setSenderId(1L);
        messageDto.setSenderUsername("testuser");
        messageDto.setMessage("Hello world");
        messageDto.setCreatedAt(LocalDateTime.now());

        when(chatService.getMessagesByRentalId(100L)).thenReturn(Arrays.asList(messageDto));

        mockMvc.perform(get("/chat/100/messages"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].message").value("Hello world"));
    }
}
