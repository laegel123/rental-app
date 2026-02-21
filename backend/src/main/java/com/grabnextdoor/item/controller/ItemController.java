package com.grabnextdoor.item.controller;

import com.grabnextdoor.item.dto.CreateItemRequestDTO;
import com.grabnextdoor.item.dto.ItemResponseDTO;
import com.grabnextdoor.item.entity.Item;
import com.grabnextdoor.item.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    @Autowired
    private ItemService itemService;

    @PostMapping
    public ResponseEntity<ItemResponseDTO> createItem(@RequestBody CreateItemRequestDTO requestDTO, Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Item newItem = itemService.createItem(requestDTO, userDetails.getUsername());
        return ResponseEntity.ok(new ItemResponseDTO(newItem));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateItem(@PathVariable Long id, @RequestBody CreateItemRequestDTO requestDTO, Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            Item updatedItem = itemService.updateItem(id, requestDTO, userDetails.getUsername());
            return ResponseEntity.ok(new ItemResponseDTO(updatedItem));
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
