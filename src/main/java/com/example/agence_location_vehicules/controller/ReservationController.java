package com.example.agence_location_vehicules.controller;

import com.example.agence_location_vehicules.entities.Reservation;
import com.example.agence_location_vehicules.service.ReservationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = {"http://localhost:4200"}, allowCredentials = "true")
@Tag(name = "Reservations", description = "Reservation management API")
@AllArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @GetMapping
    @Operation(summary = "Get all reservations")
    public List<Reservation> getAllReservations() {
        return reservationService.getAllReservations();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get reservation by ID")
    public ResponseEntity<Reservation> getReservationById(@PathVariable Long id) {
        Reservation reservation = reservationService.getReservationById(id);
        return ResponseEntity.ok(reservation);
    }

    @GetMapping("/client/{clientId}")
    @Operation(summary = "Get reservations by client")
    public List<Reservation> getReservationsByClient(@PathVariable Long clientId) {
        return reservationService.getReservationsByClient(clientId);
    }

    @GetMapping("/vehicule/{vehiculeId}")
    @Operation(summary = "Get reservations by vehicle")
    public List<Reservation> getReservationsByVehicule(@PathVariable Long vehiculeId) {
        return reservationService.getReservationsByVehicule(vehiculeId);
    }

    @GetMapping("/disponibilites")
    @Operation(summary = "Check vehicle availability")
    public ResponseEntity<Boolean> checkDisponibilite(
            @RequestParam Long vehiculeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin) {
        boolean disponible = reservationService.isVehiculeDisponible(vehiculeId, dateDebut, dateFin);
        return ResponseEntity.ok(disponible);
    }

    @GetMapping("/statut/{statut}")
    @Operation(summary = "Get reservations by status")
    public List<Reservation> getReservationsByStatut(@PathVariable Reservation.StatutReservation statut) {
        return reservationService.getReservationsByStatut(statut);
    }

    @PostMapping
    @Operation(summary = "Create new reservation")
    public ResponseEntity<Reservation> createReservation(@Valid @RequestBody Reservation reservation) {
        Reservation createdReservation = reservationService.createReservation(reservation);
        return ResponseEntity.ok(createdReservation);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update reservation")
    public ResponseEntity<Reservation> updateReservation(
            @PathVariable Long id, 
            @Valid @RequestBody Reservation reservation) {
        Reservation updatedReservation = reservationService.updateReservation(id, reservation);
        return ResponseEntity.ok(updatedReservation);
    }

    @PutMapping("/{id}/statut")
    @Operation(summary = "Update reservation status")
    public ResponseEntity<Reservation> updateStatutReservation(
            @PathVariable Long id,
            @RequestParam Reservation.StatutReservation statut) {
        Reservation updatedReservation = reservationService.updateStatutReservation(id, statut);
        return ResponseEntity.ok(updatedReservation);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Cancel reservation")
    public ResponseEntity<Void> cancelReservation(@PathVariable Long id) {
        reservationService.cancelReservation(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/statistiques")
    @Operation(summary = "Get reservation statistics")
    public ResponseEntity<Map<String, Object>> getStatistiques() {
        Map<String, Object> stats = reservationService.getStatistiques();
        return ResponseEntity.ok(stats);
    }
}
