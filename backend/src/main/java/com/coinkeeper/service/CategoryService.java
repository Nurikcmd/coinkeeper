package com.coinkeeper.service;

import com.coinkeeper.model.Category;
import com.coinkeeper.model.User;
import com.coinkeeper.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final UserService userService;

    public List<Category> findAll() {
        User currentUser = userService.getCurrentUser();
        return categoryRepository.findByUser(currentUser);
    }

    @Transactional
    public Category create(Category category) {
        User currentUser = userService.getCurrentUser();
        category.setUser(currentUser);
        return categoryRepository.save(category);
    }

    @Transactional
    public Category update(Long id, Category category) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Категория не найдена"));
        
        User currentUser = userService.getCurrentUser();
        if (!existingCategory.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Нет прав для обновления этой категории");
        }
        
        category.setId(id);
        category.setUser(currentUser);
        return categoryRepository.save(category);
    }

    @Transactional
    public void delete(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Категория не найдена"));
        
        User currentUser = userService.getCurrentUser();
        if (!category.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Нет прав для удаления этой категории");
        }
        
        categoryRepository.delete(category);
    }

    public List<Category> search(String name) {
        User currentUser = userService.getCurrentUser();
        return categoryRepository.findByUserAndNameContainingIgnoreCase(currentUser, name);
    }
} 