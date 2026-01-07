package com.example.agence_location_vehicules.service;

import com.example.agence_location_vehicules.entities.Agence;
import com.example.agence_location_vehicules.repository.AgenceRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class AgenceService {

    private final AgenceRepository agenceRepository;

    public List<Agence> getAllAgences() {
        return agenceRepository.findAll();
    }

    public Agence getAgenceById(Long id) {
        return agenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agence non trouvée avec l'ID: " + id));
    }

    public Agence createAgence(Agence agence) {
        return agenceRepository.save(agence);
    }

    public Agence updateAgence(Long id, Agence agenceDetails) {
        Agence agence = getAgenceById(id);
        agence.setNom(agenceDetails.getNom());
        agence.setAdresse(agenceDetails.getAdresse());
        agence.setVille(agenceDetails.getVille());
        agence.setTelephone(agenceDetails.getTelephone());
        agence.setEmail(agenceDetails.getEmail());
        agence.setHeureOuverture(agenceDetails.getHeureOuverture());
        agence.setHeureFermeture(agenceDetails.getHeureFermeture());
        return agenceRepository.save(agence);
    }

    public void deleteAgence(Long id) {
        agenceRepository.deleteById(id);
    }
}
