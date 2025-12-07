package com.example.agence_location_vehicules.repository;

import com.example.agence_location_vehicules.entities.Vehicule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehiculeRepository extends JpaRepository<Vehicule, Long> {

    // Requêtes dérivées
    List<Vehicule> findByMarqueContains(String marque);
    List<Vehicule> findByCategorieId(Long categorieId);
    List<Vehicule> findByStatut(Vehicule.StatutVehicule statut);

    // Requête JPQL personnalisée
    @Query("SELECT v FROM Vehicule v WHERE v.categorie.id = :categorieId AND v.statut = 'DISPONIBLE'")
    List<Vehicule> findDisponibleByCategorie(@Param("categorieId") Long categorieId);
}