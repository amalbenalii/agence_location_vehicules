package com.example.agence_location_vehicules.repository;

import com.example.agence_location_vehicules.entities.Vehicule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    Page<Vehicule> findByStatut(Vehicule.StatutVehicule statut, Pageable pageable);

    // Requête JPQL personnalisée
    @Query("SELECT v FROM Vehicule v WHERE v.categorie.id = :categorieId AND v.statut = 'DISPONIBLE'")
    List<Vehicule> findDisponibleByCategorie(@Param("categorieId") Long categorieId);

    // Search method for pagination
    @Query("SELECT v FROM Vehicule v WHERE " +
           "LOWER(v.marque) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(v.modele) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(v.immatriculation) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Vehicule> searchVehicules(@Param("keyword") String keyword, Pageable pageable);

    // Search method for available vehicles with pagination
    @Query("SELECT v FROM Vehicule v WHERE " +
           "(LOWER(v.marque) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(v.modele) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(v.immatriculation) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "v.statut = 'DISPONIBLE'")
    Page<Vehicule> searchAvailableVehicules(@Param("keyword") String keyword, Pageable pageable);
}