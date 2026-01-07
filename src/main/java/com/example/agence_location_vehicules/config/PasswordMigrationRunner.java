package com.example.agence_location_vehicules.config;

import com.example.agence_location_vehicules.entities.Utilisateur;
import com.example.agence_location_vehicules.repository.UtilisateurRepository;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@AllArgsConstructor
public class PasswordMigrationRunner implements CommandLineRunner {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    private final Logger log = LoggerFactory.getLogger(PasswordMigrationRunner.class);

    @Override
    public void run(String... args) throws Exception {
        List<Utilisateur> users = utilisateurRepository.findAll();
        int migrated = 0;
        for (Utilisateur u : users) {
            String pwd = u.getMotDePasse();
            if (pwd == null) continue;
            // Vérifier si le mot de passe ressemble à un hash BCrypt
            if (!(pwd.startsWith("$2a$") || pwd.startsWith("$2b$") || pwd.startsWith("$2y$"))) {
                // On suppose que la valeur en base est le mot de passe en clair
                String encoded = passwordEncoder.encode(pwd);
                u.setMotDePasse(encoded);
                utilisateurRepository.save(u);
                migrated++;
                log.info("Re-encoded password for user id={}, email={}", u.getId(), u.getEmail());
            }
        }
        if (migrated > 0) {
            log.info("PasswordMigrationRunner: migrated {} user(s) to BCrypt.", migrated);
        } else {
            log.info("PasswordMigrationRunner: no passwords needed migration.");
        }
    }
}
