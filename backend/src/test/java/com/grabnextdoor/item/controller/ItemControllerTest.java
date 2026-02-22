package com.grabnextdoor.item.controller;

import com.grabnextdoor.item.dto.CreateItemRequestDTO;
import com.grabnextdoor.item.entity.Category;
import com.grabnextdoor.item.entity.Item;
import com.grabnextdoor.item.service.ItemService;
import com.grabnextdoor.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.nio.file.AccessDeniedException;
import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class ItemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ItemService itemService;

    private User testUser;
    private Item testItem;
    private Category testCategory;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setEmail("test@example.com");

        testCategory = new Category();
        testCategory.setId(1L);
        testCategory.setName("Tools");

        testItem = new Item();
        testItem.setId(1L);
        testItem.setName("Drill");
        testItem.setDescription("A powerful drill");
        testItem.setPrice(new BigDecimal("10.00"));
        testItem.setDeposit(new BigDecimal("50.00"));
        testItem.setOwner(testUser);
        testItem.setCategory(testCategory);
    }

    @Test
    @WithMockUser
    void getAllItems_ShouldReturnList() throws Exception {
        when(itemService.getAllItems()).thenReturn(Arrays.asList(testItem));

        mockMvc.perform(get("/api/items"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Drill"));
    }

    @Test
    @WithMockUser
    void getItemById_ShouldReturnItem() throws Exception {
        when(itemService.getItemById(1L)).thenReturn(testItem);

        mockMvc.perform(get("/api/items/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Drill"));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void deleteItem_ShouldReturnOk() throws Exception {
        doNothing().when(itemService).deleteItem(eq(1L), eq("test@example.com"));

        mockMvc.perform(delete("/api/items/1"))
                .andExpect(status().isOk());

        verify(itemService, times(1)).deleteItem(1L, "test@example.com");
    }

    @Test
    @WithMockUser(username = "other@example.com")
    void deleteItem_WhenNotOwner_ShouldReturnForbidden() throws Exception {
        doThrow(new AccessDeniedException("You are not the owner")).when(itemService).deleteItem(eq(1L), eq("other@example.com"));

        mockMvc.perform(delete("/api/items/1"))
                .andExpect(status().isForbidden());
    }
}
