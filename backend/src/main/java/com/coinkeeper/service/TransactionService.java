package com.coinkeeper.service;

import com.coinkeeper.model.Transaction;
import com.coinkeeper.model.TransactionType;
import com.coinkeeper.model.User;
import com.coinkeeper.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final UserService userService;

    public List<Transaction> findAll() {
        User currentUser = userService.getCurrentUser();
        return transactionRepository.findByUserOrderByDateDesc(currentUser);
    }

    public List<Transaction> findByDateBetween(LocalDateTime start, LocalDateTime end) {
        return transactionRepository.findByDateBetweenOrderByDateDesc(start, end);
    }

    public Transaction create(Transaction transaction) {
        // Получаем текущего пользователя из контекста безопасности
        User currentUser = userService.getCurrentUser();
        transaction.setUser(currentUser);
        
        // Проверяем тип транзакции
        if (transaction.getType() == null) {
            throw new IllegalArgumentException("Тип транзакции не может быть пустым");
        }
        
        return transactionRepository.save(transaction);
    }

    public Transaction update(Long id, Transaction transaction) {
        if (!transactionRepository.existsById(id)) {
            throw new RuntimeException("Transaction not found");
        }
        transaction.setId(id);
        // Получаем текущего пользователя из контекста безопасности
        User currentUser = userService.getCurrentUser();
        transaction.setUser(currentUser);
        
        // Проверяем тип транзакции
        if (transaction.getType() == null) {
            throw new IllegalArgumentException("Тип транзакции не может быть пустым");
        }
        
        return transactionRepository.save(transaction);
    }

    public void delete(Long id) {
        transactionRepository.deleteById(id);
    }

    public BigDecimal getIncomeByPeriod(LocalDateTime start, LocalDateTime end) {
        User currentUser = userService.getCurrentUser();
        return transactionRepository.sumIncomeByDateBetweenAndUser(currentUser, start, end);
    }

    public BigDecimal getExpenseByPeriod(LocalDateTime start, LocalDateTime end) {
        User currentUser = userService.getCurrentUser();
        return transactionRepository.sumExpenseByDateBetweenAndUser(currentUser, start, end);
    }
} 