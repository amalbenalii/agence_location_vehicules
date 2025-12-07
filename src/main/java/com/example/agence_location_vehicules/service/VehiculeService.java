package com.example.agence_location_vehicules.service;

import com.example.agence_location_vehicules.entities.Vehicule;
import com.example.agence_location_vehicules.repository.VehiculeRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@AllArgsConstructor
public class VehiculeService implements IVehiculeService {

    private final VehiculeRepository vehiculeRepository;

    @Override
    public Vehicule saveVehicule(Vehicule v) {
        return vehiculeRepository.save(v);
    }

    @Override
    public Vehicule updateVehicule(Vehicule v) {
        return vehiculeRepository.save(v);
    }

    @Override
    public void deleteVehiculeById(Long id) {
        vehiculeRepository.deleteById(id);
    }

    @Override
    public Vehicule getVehicule(Long id) {
        return vehiculeRepository.findById(id).orElse(null);
    }

    @Override
    public List<Vehicule> getAllVehicules() {
        return vehiculeRepository.findAll();
    }

    @Override
    public List<Vehicule> findByMarque(String marque) {
        return vehiculeRepository.findByMarqueContains(marque);
    }

    @Override
    public List<Vehicule> findByCategorieId(Long categorieId) {
        return vehiculeRepository.findByCategorieId(categorieId);
    }

    @Override
    public List<Vehicule> findByStatut(Vehicule.StatutVehicule statut) {
        return vehiculeRepository.findByStatut(statut);
    }
}