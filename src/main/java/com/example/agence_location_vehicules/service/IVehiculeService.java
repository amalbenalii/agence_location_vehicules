package com.example.agence_location_vehicules.service;

import com.example.agence_location_vehicules.entities.Vehicule;

import java.util.List;

public interface IVehiculeService {

    Vehicule saveVehicule(Vehicule v);
    Vehicule updateVehicule(Vehicule v);
    void deleteVehiculeById(Long id);
    Vehicule getVehicule(Long id);
    List<Vehicule> getAllVehicules();
    List<Vehicule> findByMarque(String marque);
    List<Vehicule> findByCategorieId(Long categorieId);
    List<Vehicule> findByStatut(Vehicule.StatutVehicule statut);
}