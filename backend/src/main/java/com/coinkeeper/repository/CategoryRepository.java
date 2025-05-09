package com.coinkeeper.repository;

import com.coinkeeper.model.Category;
import com.coinkeeper.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByUser(User user);
    List<Category> findByUserAndNameContainingIgnoreCase(User user, String name);
} 