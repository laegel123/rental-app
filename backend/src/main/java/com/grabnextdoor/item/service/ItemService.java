package com.grabnextdoor.item.service;

import com.grabnextdoor.item.dto.CreateItemRequestDTO;
import com.grabnextdoor.item.entity.Category;
import com.grabnextdoor.item.entity.Item;
import com.grabnextdoor.item.repository.CategoryRepository;
import com.grabnextdoor.item.repository.ItemRepository;
import com.grabnextdoor.user.entity.User;
import com.grabnextdoor.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Transactional
    public Item createItem(CreateItemRequestDTO requestDTO, String userEmail) {
        User owner = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        Category category = categoryRepository.findById(requestDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + requestDTO.getCategoryId()));

        Item item = new Item();
        item.setName(requestDTO.getName());
        item.setDescription(requestDTO.getDescription());
        item.setPrice(requestDTO.getPrice());
        item.setDeposit(requestDTO.getDeposit());
        item.setCategory(category);
        item.setOwner(owner);
        item.setLocation(owner.getLocation()); // Set item location to owner's location

        return itemRepository.save(item);
    }

    @Transactional
    public Item updateItem(Long itemId, CreateItemRequestDTO requestDTO, String userEmail) throws AccessDeniedException {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + itemId));

        if (!item.getOwner().getEmail().equals(userEmail)) {
            throw new AccessDeniedException("You are not the owner of this item.");
        }

        Category category = categoryRepository.findById(requestDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + requestDTO.getCategoryId()));

        item.setName(requestDTO.getName());
        item.setDescription(requestDTO.getDescription());
        item.setPrice(requestDTO.getPrice());
        item.setDeposit(requestDTO.getDeposit());
        item.setCategory(category);

        return itemRepository.save(item);
    }
}
