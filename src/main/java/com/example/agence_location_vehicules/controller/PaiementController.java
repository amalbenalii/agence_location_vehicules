package com.example.agence_location_vehicules.controller;

import com.example.agence_location_vehicules.entities.Paiement;
import com.example.agence_location_vehicules.service.PaiementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/paiements")
@CrossOrigin(origins = {"http://localhost:4200"}, allowCredentials = "true")
@Tag(name = "Paiements", description = "Payment management API")
@AllArgsConstructor
public class PaiementController {

    private final PaiementService paiementService;

    @GetMapping
    @Operation(summary = "Get all payments")
    public List<Paiement> getAllPaiements() {
        return paiementService.getAllPaiements();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get payment by ID")
    public ResponseEntity<Paiement> getPaiementById(@PathVariable Long id) {
        Paiement paiement = paiementService.getPaiementById(id);
        return ResponseEntity.ok(paiement);
    }

    @GetMapping("/reservation/{reservationId}")
    @Operation(summary = "Get payment by reservation")
    public ResponseEntity<Paiement> getPaiementByReservation(@PathVariable Long reservationId) {
        Paiement paiement = paiementService.getPaiementByReservation(reservationId);
        return ResponseEntity.ok(paiement);
    }

    @GetMapping("/statut/{statut}")
    @Operation(summary = "Get payments by status")
    public List<Paiement> getPaiementsByStatut(@PathVariable Paiement.StatutPaiement statut) {
        return paiementService.getPaiementsByStatut(statut);
    }

    @PostMapping
    @Operation(summary = "Create new payment")
    public ResponseEntity<Paiement> createPaiement(@Valid @RequestBody Paiement paiement) {
        Paiement createdPaiement = paiementService.createPaiement(paiement);
        return ResponseEntity.ok(createdPaiement);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update payment")
    public ResponseEntity<Paiement> updatePaiement(
            @PathVariable Long id, 
            @Valid @RequestBody Paiement paiement) {
        Paiement updatedPaiement = paiementService.updatePaiement(id, paiement);
        return ResponseEntity.ok(updatedPaiement);
    }

    @PutMapping("/{id}/statut")
    @Operation(summary = "Update payment status")
    public ResponseEntity<Paiement> updateStatutPaiement(
            @PathVariable Long id,
            @RequestParam Paiement.StatutPaiement statut) {
        Paiement updatedPaiement = paiementService.updateStatutPaiement(id, statut);
        return ResponseEntity.ok(updatedPaiement);
    }

    @PostMapping("/{id}/confirmer")
    @Operation(summary = "Confirm payment")
    public ResponseEntity<Paiement> confirmerPaiement(@PathVariable Long id) {
        Paiement paiement = paiementService.confirmerPaiement(id);
        return ResponseEntity.ok(paiement);
    }

    @PostMapping("/{id}/annuler")
    @Operation(summary = "Cancel payment")
    public ResponseEntity<Paiement> annulerPaiement(@PathVariable Long id) {
        Paiement paiement = paiementService.annulerPaiement(id);
        return ResponseEntity.ok(paiement);
    }

    @GetMapping("/statistiques")
    @Operation(summary = "Get payment statistics")
    public ResponseEntity<Map<String, Object>> getStatistiques() {
        Map<String, Object> stats = paiementService.getStatistiques();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/chiffre-affaires")
    @Operation(summary = "Get revenue by period")
    public ResponseEntity<Map<String, Object>> getChiffreAffaires(
            @RequestParam String periode) {
        Map<String, Object> chiffreAffaires = paiementService.getChiffreAffairesByPeriode(periode);
        return ResponseEntity.ok(chiffreAffaires);
    }
}
