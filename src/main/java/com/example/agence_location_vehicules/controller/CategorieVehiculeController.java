package com.example.agence_location_vehicules.controller;

import com.example.agence_location_vehicules.entities.CategorieVehicule;
import com.example.agence_location_vehicules.service.CategorieVehiculeService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = {"http://localhost:4200"}, allowCredentials = "true")
@AllArgsConstructor
public class CategorieVehiculeController {

    private final CategorieVehiculeService categorieService;

    @GetMapping
    public ResponseEntity<List<CategorieVehicule>> getAllCategories() {
        return ResponseEntity.ok(categorieService.getAllCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategorieVehicule> getOne(@PathVariable Long id) {
        CategorieVehicule categorie = categorieService.getCategorie(id);
        return ResponseEntity.ok(categorie);
    }

    @PostMapping
    public ResponseEntity<CategorieVehicule> addCategorie(@Valid @RequestBody CategorieVehicule categorie) {
        CategorieVehicule created = categorieService.saveCategorie(categorie);
        return ResponseEntity.ok(created);
    }

    @PutMapping
    public ResponseEntity<CategorieVehicule> updateCategorie(@Valid @RequestBody CategorieVehicule categorie) {
        CategorieVehicule updated = categorieService.updateCategorie(categorie);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategorie(@PathVariable Long id) {
        categorieService.deleteCategorieById(id);
        return ResponseEntity.noContent().build();
    }
}
