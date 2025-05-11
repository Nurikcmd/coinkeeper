package com.coinkeeper.service;

import com.coinkeeper.model.Account;
import com.coinkeeper.model.User;
import com.coinkeeper.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    private final UserService userService;

    public List<Account> findAll() {
        User currentUser = userService.getCurrentUser();
        return accountRepository.findByUserOrderByNameAsc(currentUser);
    }

    public Account create(Account account) {
        User currentUser = userService.getCurrentUser();
        account.setUser(currentUser);
        return accountRepository.save(account);
    }

    public Account update(Long id, Account account) {
        if (!accountRepository.existsById(id)) {
            throw new RuntimeException("Account not found");
        }
        account.setId(id);
        User currentUser = userService.getCurrentUser();
        account.setUser(currentUser);
        return accountRepository.save(account);
    }

    public void delete(Long id) {
        accountRepository.deleteById(id);
    }

    public Account findById(Long id) {
        return accountRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Account not found"));
    }
} 