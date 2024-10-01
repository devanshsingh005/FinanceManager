package com.example.h2database.services;

import com.example.h2database.model.User;
import com.example.h2database.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void registerUser(User user) {
        logger.info("Attempting to register user: {}", user.getEmail());
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new RuntimeException("User with this email already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        logger.info("User registered successfully: {}", savedUser.getEmail());
    }

    public User authenticateUser(String email, String password) {
        logger.info("Attempting to authenticate user: {}", email);
        User user = userRepository.findByEmail(email);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            logger.info("User authenticated successfully: {}", email);
            return user;
        }
        logger.warn("Authentication failed for user: {}", email);
        return null;
    }
}