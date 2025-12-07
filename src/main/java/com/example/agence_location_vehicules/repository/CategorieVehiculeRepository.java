package com.example.agence_location_vehicules.repository;

import com.example.agence_location_vehicules.entities.CategorieVehicule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategorieVehiculeRepository extends JpaRepository<CategorieVehicule, Long> {

    CategorieVehicule findByNom(String nom);
}