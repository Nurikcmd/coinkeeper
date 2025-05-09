package com.coinkeeper.config;

import com.coinkeeper.model.Category;
import com.coinkeeper.model.User;
import com.coinkeeper.repository.CategoryRepository;
import com.coinkeeper.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Создаем тестового пользователя, если его нет
        if (!userRepository.existsByEmail("test@example.com")) {
            User user = new User();
            user.setEmail("test@example.com");
            user.setPassword(passwordEncoder.encode("1234"));
            user.setName("Test User");
            userRepository.save(user);

            // Создаем базовые категории для тестового пользователя
            List<Category> categories = Arrays.asList(
                createCategory("Продукты", "#FF5733", "shopping-cart", user),
                createCategory("Транспорт", "#33FF57", "car", user),
                createCategory("Развлечения", "#3357FF", "film", user),
                createCategory("Здоровье", "#FF33F6", "heart", user),
                createCategory("Одежда", "#33FFF6", "tshirt", user),
                createCategory("Связь", "#F6FF33", "phone", user),
                createCategory("Жилье", "#FF3333", "home", user),
                createCategory("Зарплата", "#33FF33", "money-bill", user),
                createCategory("Подарки", "#3333FF", "gift", user),
                createCategory("Прочее", "#FF33FF", "ellipsis-h", user)
            );
            categoryRepository.saveAll(categories);
        }
    }

    private Category createCategory(String name, String color, String icon, User user) {
        Category category = new Category();
        category.setName(name);
        category.setColor(color);
        category.setIcon(icon);
        category.setUser(user);
        return category;
    }
} 