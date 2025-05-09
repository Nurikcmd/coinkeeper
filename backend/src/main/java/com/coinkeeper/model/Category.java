package com.coinkeeper.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TransactionType type;

    private String color;
    private String icon;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
} 