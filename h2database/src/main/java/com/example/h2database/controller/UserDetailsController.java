package com.example.h2database.controller;

import com.example.h2database.model.UserDetails;
import com.example.h2database.service.UserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class UserDetailsController {

    @Autowired
    private UserDetailsService userDetailsService;

    @PostMapping("/calculate")
    public ResponseEntity<Map<String, Object>> calculateFinancials(@RequestBody UserDetails userDetails) {
        System.out.println("Received request with data: " + userDetails);
        Map<String, Object> results = userDetailsService.calculateFinancials(userDetails);
        System.out.println("Sending response: " + results);
        return ResponseEntity.ok(results);
    }
}