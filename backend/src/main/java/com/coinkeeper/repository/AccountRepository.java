package com.coinkeeper.repository;

import com.coinkeeper.model.Account;
import com.coinkeeper.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByUser(User user);
    List<Account> findByUserOrderByNameAsc(User user);
} 