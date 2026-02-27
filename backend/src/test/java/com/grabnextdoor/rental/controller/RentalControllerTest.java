package com.grabnextdoor.rental.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.grabnextdoor.rental.dto.CreateRentalRequestDto;
import com.grabnextdoor.rental.dto.RentalResponseDto;
import com.grabnextdoor.rental.entity.RentalStatus;
import com.grabnextdoor.rental.service.RentalService;
import com.grabnextdoor.user.entity.User;
import com.grabnextdoor.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class RentalControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RentalService rentalService;

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private User testUser;
    private RentalResponseDto rentalResponseDto;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setUsername("testuser");

        rentalResponseDto = new RentalResponseDto();
        rentalResponseDto.setId(1L);
        rentalResponseDto.setItemId(100L);
        rentalResponseDto.setItemName("Test Item");
        rentalResponseDto.setBorrowerId(1L);
        rentalResponseDto.setBorrowerUsername("testuser");
        rentalResponseDto.setStartDate(LocalDate.now());
        rentalResponseDto.setEndDate(LocalDate.now().plusDays(7));
        rentalResponseDto.setStatus(RentalStatus.REQUESTED);
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void requestRental_ShouldReturnRentalResponse() throws Exception {
        CreateRentalRequestDto request = new CreateRentalRequestDto();
        request.setItemId(100L);
        request.setStartDate(LocalDate.now());
        request.setEndDate(LocalDate.now().plusDays(7));

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(rentalService.requestRental(any(CreateRentalRequestDto.class), any(User.class))).thenReturn(rentalResponseDto);

        mockMvc.perform(post("/rentals")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.status").value("REQUESTED"));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void acceptRental_ShouldReturnAcceptedStatus() throws Exception {
        rentalResponseDto.setStatus(RentalStatus.ACCEPTED);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(rentalService.acceptRental(eq(1L), any(User.class))).thenReturn(rentalResponseDto);

        mockMvc.perform(post("/rentals/1/accept"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ACCEPTED"));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void declineRental_ShouldReturnDeclinedStatus() throws Exception {
        rentalResponseDto.setStatus(RentalStatus.DECLINED);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(rentalService.declineRental(eq(1L), any(User.class))).thenReturn(rentalResponseDto);

        mockMvc.perform(post("/rentals/1/decline"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("DECLINED"));
    }
}
