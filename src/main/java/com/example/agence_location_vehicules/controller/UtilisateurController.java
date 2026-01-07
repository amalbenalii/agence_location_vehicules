package com.example.agence_location_vehicules.controller;

import com.example.agence_location_vehicules.entities.Utilisateur;
import com.example.agence_location_vehicules.repository.UtilisateurRepository;
import com.example.agence_location_vehicules.security.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/utilisateurs")
@CrossOrigin(origins = {"http://localhost:4200"}, allowCredentials = "true")
@Tag(name = "Utilisateurs", description = "User management API")
@AllArgsConstructor
public class UtilisateurController {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @GetMapping("/me")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<Utilisateur> getCurrentUser(HttpServletRequest request) {
        String email = extractEmailFromToken(request);
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return ResponseEntity.ok(utilisateur);
    }

    @PutMapping("/me")
    @Operation(summary = "Update current user profile")
    public ResponseEntity<Utilisateur> updateProfile(
            @RequestBody Map<String, String> updates,
            HttpServletRequest request) {
        String email = extractEmailFromToken(request);
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (updates.containsKey("nom")) {
            utilisateur.setNom(updates.get("nom"));
        }
        if (updates.containsKey("prenom")) {
            utilisateur.setPrenom(updates.get("prenom"));
        }
        if (updates.containsKey("telephone")) {
            utilisateur.setTelephone(updates.get("telephone"));
        }
        if (updates.containsKey("adresse")) {
            utilisateur.setAdresse(updates.get("adresse"));
        }

        Utilisateur updated = utilisateurRepository.save(utilisateur);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/me/password")
    @Operation(summary = "Change password")
    public ResponseEntity<Map<String, String>> changePassword(
            @RequestBody Map<String, String> passwordData,
            HttpServletRequest request) {
        String email = extractEmailFromToken(request);
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        String currentPassword = passwordData.get("currentPassword");
        String newPassword = passwordData.get("newPassword");

        if (!passwordEncoder.matches(currentPassword, utilisateur.getMotDePasse())) {
            throw new RuntimeException("Mot de passe actuel incorrect");
        }

        utilisateur.setMotDePasse(passwordEncoder.encode(newPassword));
        utilisateurRepository.save(utilisateur);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Mot de passe modifié avec succès");
        return ResponseEntity.ok(response);
    }

    private String extractEmailFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.extractEmail(token);
        }
        throw new RuntimeException("Token manquant");
    }
}
