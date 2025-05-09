package com.coinkeeper.repository;

import com.coinkeeper.model.Transaction;
import com.coinkeeper.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;
import java.math.BigDecimal;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByDateBetweenOrderByDateDesc(LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.type = 'INCOME' AND t.date BETWEEN ?1 AND ?2")
    BigDecimal sumIncomeByDateBetween(LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.type = 'EXPENSE' AND t.date BETWEEN ?1 AND ?2")
    BigDecimal sumExpenseByDateBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT t FROM Transaction t LEFT JOIN FETCH t.category WHERE t.user = ?1 ORDER BY t.date DESC")
    List<Transaction> findByUserOrderByDateDesc(User user);

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.type = 'INCOME' AND t.user = ?1 AND t.date BETWEEN ?2 AND ?3")
    BigDecimal sumIncomeByDateBetweenAndUser(User user, LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.type = 'EXPENSE' AND t.user = ?1 AND t.date BETWEEN ?2 AND ?3")
    BigDecimal sumExpenseByDateBetweenAndUser(User user, LocalDateTime start, LocalDateTime end);
} 