package com.example.agence_location_vehicules.service;

import com.example.agence_location_vehicules.entities.CategorieVehicule;
import com.example.agence_location_vehicules.repository.CategorieVehiculeRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@AllArgsConstructor
public class CategorieVehiculeService implements ICategorieVehicule {

    private final CategorieVehiculeRepository categorieRepository;

    @Override
    public CategorieVehicule saveCategorie(CategorieVehicule categorie) {
        // Validation basique
        if (categorie.getNom() == null || categorie.getNom().trim().isEmpty()) {
            throw new IllegalArgumentException("Le nom de la catégorie est obligatoire");
        }

        if (categorie.getPrixParJour() == null || categorie.getPrixParJour() <= 0) {
            throw new IllegalArgumentException("Le prix par jour doit être supérieur à 0");
        }

        // Vérifier si une catégorie avec le même nom existe déjà
        CategorieVehicule existingCategorie = categorieRepository.findByNom(categorie.getNom());
        if (existingCategorie != null && !existingCategorie.getId().equals(categorie.getId())) {
            throw new IllegalArgumentException("Une catégorie avec le nom '" + categorie.getNom() + "' existe déjà");
        }

        return categorieRepository.save(categorie);
    }

    @Override
    public CategorieVehicule updateCategorie(CategorieVehicule categorie) {
        // Vérifier si la catégorie existe
        Optional<CategorieVehicule> existingCategorieOpt = categorieRepository.findById(categorie.getId());

        if (existingCategorieOpt.isEmpty()) {
            throw new RuntimeException("Catégorie non trouvée avec l'ID: " + categorie.getId());
        }

        CategorieVehicule existingCategorie = existingCategorieOpt.get();

        // Validation
        if (categorie.getNom() == null || categorie.getNom().trim().isEmpty()) {
            throw new IllegalArgumentException("Le nom de la catégorie est obligatoire");
        }

        if (categorie.getPrixParJour() == null || categorie.getPrixParJour() <= 0) {
            throw new IllegalArgumentException("Le prix par jour doit être supérieur à 0");
        }

        // Vérifier le nom unique (sauf pour la catégorie actuelle)
        CategorieVehicule categorieWithSameName = categorieRepository.findByNom(categorie.getNom());
        if (categorieWithSameName != null && !categorieWithSameName.getId().equals(categorie.getId())) {
            throw new IllegalArgumentException("Une catégorie avec le nom '" + categorie.getNom() + "' existe déjà");
        }
        existingCategorie.setNom(categorie.getNom());
        existingCategorie.setDescription(categorie.getDescription());
        existingCategorie.setPrixParJour(categorie.getPrixParJour());
        existingCategorie.setCaracteristiques(categorie.getCaracteristiques());

        return categorieRepository.save(existingCategorie);
    }

    @Override
    public void deleteCategorieById(Long id) {
        // Vérifier si la catégorie existe
        Optional<CategorieVehicule> categorieOpt = categorieRepository.findById(id);

        if (categorieOpt.isEmpty()) {
            throw new RuntimeException("Catégorie non trouvée avec l'ID: " + id);
        }

        CategorieVehicule categorie = categorieOpt.get();

        // Vérifier si la catégorie a des véhicules associés
        if (categorie.getVehicules() != null && !categorie.getVehicules().isEmpty()) {
            throw new RuntimeException("Impossible de supprimer la catégorie. " +
                    categorie.getVehicules().size() + " véhicule(s) y sont associés.");
        }

        categorieRepository.deleteById(id);
    }

    @Override
    public CategorieVehicule getCategorie(Long id) {
        return categorieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Catégorie non trouvée avec l'ID: " + id));
    }

    @Override
    public List<CategorieVehicule> getAllCategories() {
        return categorieRepository.findAll();
    }

    @Override
    public CategorieVehicule findByNom(String nom) {
        CategorieVehicule categorie = categorieRepository.findByNom(nom);

        if (categorie == null) {
            throw new RuntimeException("Catégorie non trouvée avec le nom: " + nom);
        }

        return categorie;
    }


}