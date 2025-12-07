package com.example.agence_location_vehicules.controller;

import com.example.agence_location_vehicules.entities.Vehicule;
import com.example.agence_location_vehicules.service.IVehiculeService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vehicules")
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class VehiculeController {

    private final IVehiculeService vehiculeService;

    @GetMapping
    public List<Vehicule> getAll() {
        return vehiculeService.getAllVehicules();
    }

    @GetMapping("/{id}")
    public Vehicule getOne(@PathVariable Long id) {
        return vehiculeService.getVehicule(id);
    }

    @GetMapping("/categorie/{id}")
    public List<Vehicule> getByCategorie(@PathVariable Long id) {
        return vehiculeService.findByCategorieId(id);
    }

    @GetMapping("/marque")
    public List<Vehicule> getByMarque(@RequestParam String marque) {
        return vehiculeService.findByMarque(marque);
    }

    @GetMapping("/statut/{statut}")
    public List<Vehicule> getByStatut(@PathVariable Vehicule.StatutVehicule statut) {
        return vehiculeService.findByStatut(statut);
    }

    @PostMapping
    public Vehicule addVehicule(@RequestBody Vehicule vehicule) {
        return vehiculeService.saveVehicule(vehicule);
    }

    @PutMapping
    public Vehicule updateVehicule(@RequestBody Vehicule vehicule) {
        return vehiculeService.updateVehicule(vehicule);
    }

    @DeleteMapping("/{id}")
    public void deleteVehicule(@PathVariable Long id) {
        vehiculeService.deleteVehiculeById(id);
    }
}
