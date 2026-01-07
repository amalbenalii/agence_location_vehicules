package com.example.agence_location_vehicules.controller;

import com.example.agence_location_vehicules.entities.Agence;
import com.example.agence_location_vehicules.service.AgenceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agences")
@CrossOrigin(origins = {"http://localhost:4200"}, allowCredentials = "true")
@Tag(name = "Agences", description = "Agence management API")
@AllArgsConstructor
public class AgenceController {

    private final AgenceService agenceService;

    @GetMapping
    @Operation(summary = "Get all agences")
    public ResponseEntity<List<Agence>> getAllAgences() {
        return ResponseEntity.ok(agenceService.getAllAgences());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get agence by ID")
    public ResponseEntity<Agence> getAgenceById(@PathVariable Long id) {
        return ResponseEntity.ok(agenceService.getAgenceById(id));
    }

    @PostMapping
    @Operation(summary = "Create new agence")
    public ResponseEntity<Agence> createAgence(@Valid @RequestBody Agence agence) {
        return ResponseEntity.ok(agenceService.createAgence(agence));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update agence")
    public ResponseEntity<Agence> updateAgence(
            @PathVariable Long id,
            @Valid @RequestBody Agence agence) {
        return ResponseEntity.ok(agenceService.updateAgence(id, agence));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete agence")
    public ResponseEntity<Void> deleteAgence(@PathVariable Long id) {
        agenceService.deleteAgence(id);
        return ResponseEntity.noContent().build();
    }
}
