package com.example.agence_location_vehicules.controller;

import com.example.agence_location_vehicules.entities.Utilisateur;
import com.example.agence_location_vehicules.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:4200"}, allowCredentials = "true")
@Tag(name = "Authentication", description = "Authentication API")
@AllArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody Utilisateur utilisateur) {
        Map<String, Object> response = authService.register(utilisateur);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    @Operation(summary = "Login user")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        Map<String, Object> response = authService.login(email, password);
        return ResponseEntity.ok(response);
    }
}
