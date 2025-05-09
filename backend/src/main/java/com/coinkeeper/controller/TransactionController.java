package com.coinkeeper.controller;

import com.coinkeeper.model.Transaction;
import com.coinkeeper.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TransactionController {
    private final TransactionService transactionService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Transaction>> getAll() {
        return ResponseEntity.ok(transactionService.findAll());
    }

    @GetMapping("/period")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Transaction>> getByPeriod(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(transactionService.findByDateBetween(start, end));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Transaction> create(@RequestBody Transaction transaction) {
        return ResponseEntity.ok(transactionService.create(transaction));
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Transaction> update(
            @PathVariable Long id,
            @RequestBody Transaction transaction) {
        return ResponseEntity.ok(transactionService.update(id, transaction));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        transactionService.delete(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stats/income")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BigDecimal> getIncomeByPeriod(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(transactionService.getIncomeByPeriod(start, end));
    }

    @GetMapping("/stats/expense")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BigDecimal> getExpenseByPeriod(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(transactionService.getExpenseByPeriod(start, end));
    }
} 