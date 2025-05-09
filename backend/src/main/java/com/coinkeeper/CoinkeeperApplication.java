package com.coinkeeper;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.coinkeeper.model")
@EnableJpaRepositories("com.coinkeeper.repository")
public class CoinkeeperApplication {
    public static void main(String[] args) {
        SpringApplication.run(CoinkeeperApplication.class, args);
    }
} 