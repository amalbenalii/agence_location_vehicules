package com.example.agence_location_vehicules.service;

import com.example.agence_location_vehicules.entities.CategorieVehicule;

import java.util.List;

public interface ICategorieVehicule {
    // Créer ou mettre à jour une catégorie
    CategorieVehicule saveCategorie(CategorieVehicule categorie);

    // Mettre à jour une catégorie existante
    CategorieVehicule updateCategorie(CategorieVehicule categorie);

    // Supprimer une catégorie par son ID
    void deleteCategorieById(Long id);

    // Récupérer une catégorie par son ID
    CategorieVehicule getCategorie(Long id);

    // Récupérer toutes les catégories
    List<CategorieVehicule> getAllCategories();

    // Rechercher une catégorie par son nom
    CategorieVehicule findByNom(String nom);
}
