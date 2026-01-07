package com.example.agence_location_vehicules.service;

import com.example.agence_location_vehicules.entities.Utilisateur;
import com.example.agence_location_vehicules.repository.UtilisateurRepository;
import com.example.agence_location_vehicules.security.JwtUtil;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@AllArgsConstructor
@Transactional
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public Map<String, Object> register(Utilisateur utilisateur) {
        // Validation
        if (utilisateur.getEmail() == null || utilisateur.getEmail().trim().isEmpty()) {
            throw new RuntimeException("L'email est requis");
        }
        if (utilisateur.getNom() == null || utilisateur.getNom().trim().isEmpty()) {
            throw new RuntimeException("Le nom est requis");
        }
        if (utilisateur.getPrenom() == null || utilisateur.getPrenom().trim().isEmpty()) {
            throw new RuntimeException("Le prénom est requis");
        }
        if (utilisateur.getMotDePasse() == null || utilisateur.getMotDePasse().trim().isEmpty()) {
            throw new RuntimeException("Le mot de passe est requis");
        }
        if (utilisateur.getMotDePasse().length() < 6) {
            throw new RuntimeException("Le mot de passe doit contenir au moins 6 caractères");
        }

        if (utilisateurRepository.existsByEmail(utilisateur.getEmail())) {
            throw new RuntimeException("Cet email est déjà utilisé");
        }

        // Encoder le mot de passe
        utilisateur.setMotDePasse(passwordEncoder.encode(utilisateur.getMotDePasse()));
        
        // Définir le rôle par défaut si non spécifié
        if (utilisateur.getRole() == null) {
            utilisateur.setRole(Utilisateur.Role.CLIENT);
        }
        
        Utilisateur savedUser = utilisateurRepository.save(utilisateur);
        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getRole().name(), savedUser.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", savedUser);
        return response;
    }

    public Map<String, Object> login(String email, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        String token = jwtUtil.generateToken(utilisateur.getEmail(), utilisateur.getRole().name(), utilisateur.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", utilisateur);
        return response;
    }
}
