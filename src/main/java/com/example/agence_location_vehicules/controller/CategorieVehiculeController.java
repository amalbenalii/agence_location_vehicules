package com.example.agence_location_vehicules.controller;

import com.example.agence_location_vehicules.entities.CategorieVehicule;
import com.example.agence_location_vehicules.repository.CategorieVehiculeRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class CategorieVehiculeController {

    private final CategorieVehiculeRepository categorieRepository;

    @GetMapping
    public List<CategorieVehicule> getAll() {
        return categorieRepository.findAll();
    }

    @GetMapping("/{id}")
    public CategorieVehicule getOne(@PathVariable Long id) {
        return categorieRepository.findById(id).orElse(null);
    }

    @PostMapping
    public CategorieVehicule addCategorie(@RequestBody CategorieVehicule categorie) {
        return categorieRepository.save(categorie);
    }

    @PutMapping
    public CategorieVehicule updateCategorie(@RequestBody CategorieVehicule categorie) {
        return categorieRepository.save(categorie);
    }

    @DeleteMapping("/{id}")
    public void deleteCategorie(@PathVariable Long id) {
        categorieRepository.deleteById(id);
    }
}
