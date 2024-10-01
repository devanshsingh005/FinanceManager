package com.example.h2database.controller;

import com.example.h2database.model.User;
import com.example.h2database.services.UserService;
import com.example.h2database.repository.UserRepository; // {{ edit_1 }}
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository; // {{ edit_2 }}

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        logger.info("Received registration request for user: {}", user.getEmail());
        try {
            if (user.getEmail() == null || user.getPassword() == null || user.getUsername() == null) {
                return ResponseEntity.badRequest().body("Email, password, and username are required");
            }
            userService.registerUser(user);
            logger.info("User registered successfully: {}", user.getEmail());
            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            logger.error("Error registering user: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error registering user: " + e.getMessage());
        }
    }

    @GetMapping("/register")
    public ResponseEntity<String> registerGet() {
        logger.info("GET /register endpoint called");
        return ResponseEntity.ok("This is the GET register endpoint. Use POST for actual registration.");
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        logger.info("Test endpoint called");
        return ResponseEntity.ok("UserController is working");
    }

    @GetMapping("/hello")
    public ResponseEntity<String> hello() {
        logger.info("Hello endpoint called");
        return ResponseEntity.ok("Hello from UserController");
    }

    // @GetMapping("/register")
    // public ResponseEntity<String> registerGet() {
    //     return ResponseEntity.ok("This is the GET register endpoint. Use POST for actual registration.");
    // }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        logger.info("Retrieving all users");
        List<User> users = userRepository.findAll(); // {{ edit_2 }}
        logger.info("Found {} users", users.size());
        return ResponseEntity.ok(users);
    }

    
}