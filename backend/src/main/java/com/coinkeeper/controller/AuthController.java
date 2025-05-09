package com.coinkeeper.controller;

import com.coinkeeper.model.User;
import com.coinkeeper.security.JwtService;
import com.coinkeeper.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        User registeredUser = userService.register(user);
        String token = jwtService.generateToken((UserDetails) userService.loadUserByUsername(registeredUser.getEmail()));
        
        Map<String, Object> response = new HashMap<>();
        response.put("user", registeredUser);
        response.put("token", token);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(),
                loginRequest.getPassword()
            )
        );
        
        User user = userService.findByEmail(loginRequest.getEmail());
        String token = jwtService.generateToken((UserDetails) userService.loadUserByUsername(user.getEmail()));
        
        Map<String, Object> response = new HashMap<>();
        response.put("user", user);
        response.put("token", token);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok().build();
    }
} 