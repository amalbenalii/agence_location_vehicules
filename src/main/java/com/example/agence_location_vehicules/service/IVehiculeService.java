package com.example.agence_location_vehicules.service;

import com.example.agence_location_vehicules.entities.Vehicule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IVehiculeService {

    Vehicule saveVehicule(Vehicule v);
    Vehicule updateVehicule(Vehicule v);
    void deleteVehiculeById(Long id);
    Vehicule getVehicule(Long id);
    List<Vehicule> getAllVehicules();
    Page<Vehicule> getVehiculesPaginated(Pageable pageable);
    Page<Vehicule> searchVehicules(String keyword, Pageable pageable);
    Page<Vehicule> getAvailableVehiculesPaginated(Pageable pageable);
    Page<Vehicule> searchAvailableVehicules(String keyword, Pageable pageable);
    List<Vehicule> findByMarque(String marque);
    List<Vehicule> findByCategorieId(Long categorieId);
    List<Vehicule> findByStatut(Vehicule.StatutVehicule statut);
    String uploadVehicleImage(Long id, MultipartFile file);
    void deleteVehicleImage(Long id);
}