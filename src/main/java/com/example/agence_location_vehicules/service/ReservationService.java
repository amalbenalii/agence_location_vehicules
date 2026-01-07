package com.example.agence_location_vehicules.service;

import com.example.agence_location_vehicules.entities.Reservation;
import com.example.agence_location_vehicules.repository.ReservationRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class ReservationService {

    private final ReservationRepository reservationRepository;

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Reservation getReservationById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée avec l'ID: " + id));
    }

    public List<Reservation> getReservationsByClient(Long clientId) {
        return reservationRepository.findByClientId(clientId);
    }

    public List<Reservation> getReservationsByVehicule(Long vehiculeId) {
        return reservationRepository.findByVehiculeId(vehiculeId);
    }

    public List<Reservation> getReservationsByStatut(Reservation.StatutReservation statut) {
        return reservationRepository.findByStatut(statut);
    }

    public boolean isVehiculeDisponible(Long vehiculeId, LocalDate dateDebut, LocalDate dateFin) {
        List<Reservation> reservations = reservationRepository.findConflictingReservations(
                vehiculeId, dateDebut, dateFin);
        
        return reservations.isEmpty();
    }

    public Reservation createReservation(Reservation reservation) {
        // Vérifier la disponibilité du véhicule
        if (!isVehiculeDisponible(reservation.getVehicule().getId(), 
                reservation.getDateDebut(), reservation.getDateFin())) {
            throw new RuntimeException("Le véhicule n'est pas disponible pour ces dates");
        }

        // Calculer le montant total
        calculerMontantTotal(reservation);

        // Mettre le statut par défaut
        if (reservation.getStatut() == null) {
            reservation.setStatut(Reservation.StatutReservation.EN_ATTENTE);
        }

        return reservationRepository.save(reservation);
    }

    public Reservation updateReservation(Long id, Reservation reservationDetails) {
        Reservation reservation = getReservationById(id);

        // Vérifier que la réservation peut être modifiée
        if (reservation.getStatut() != Reservation.StatutReservation.EN_ATTENTE && 
            reservation.getStatut() != Reservation.StatutReservation.CONFIRMEE) {
            throw new RuntimeException("Cette réservation ne peut plus être modifiée");
        }

        // Vérifier la disponibilité si le véhicule ou les dates changent
        Long ancienVehiculeId = reservation.getVehicule().getId();
        LocalDate ancienneDateDebut = reservation.getDateDebut();
        LocalDate ancienneDateFin = reservation.getDateFin();
        
        Long nouveauVehiculeId = reservationDetails.getVehicule() != null ? 
            reservationDetails.getVehicule().getId() : ancienVehiculeId;
        LocalDate nouvelleDateDebut = reservationDetails.getDateDebut() != null ? 
            reservationDetails.getDateDebut() : ancienneDateDebut;
        LocalDate nouvelleDateFin = reservationDetails.getDateFin() != null ? 
            reservationDetails.getDateFin() : ancienneDateFin;

        // Vérifier la disponibilité seulement si le véhicule ou les dates ont changé
        if (!nouveauVehiculeId.equals(ancienVehiculeId) || 
            !nouvelleDateDebut.equals(ancienneDateDebut) || 
            !nouvelleDateFin.equals(ancienneDateFin)) {
            
            // Vérifier la disponibilité en excluant la réservation actuelle
            List<Reservation> conflits = reservationRepository.findConflictingReservations(
                    nouveauVehiculeId, nouvelleDateDebut, nouvelleDateFin);
            
            // Filtrer pour exclure la réservation actuelle
            conflits = conflits.stream()
                    .filter(r -> !r.getId().equals(id))
                    .collect(java.util.stream.Collectors.toList());
            
            if (!conflits.isEmpty()) {
                throw new RuntimeException("Le véhicule n'est pas disponible pour ces dates");
            }
        }

        // Mise à jour des champs
        reservation.setDateDebut(nouvelleDateDebut);
        reservation.setDateFin(nouvelleDateFin);
        if (reservationDetails.getVehicule() != null) {
            reservation.setVehicule(reservationDetails.getVehicule());
        }
        if (reservationDetails.getAgencePriseEnCharge() != null) {
            reservation.setAgencePriseEnCharge(reservationDetails.getAgencePriseEnCharge());
        }
        if (reservationDetails.getAgenceRetour() != null) {
            reservation.setAgenceRetour(reservationDetails.getAgenceRetour());
        }
        // Ne pas modifier le client ni le gestionnaire lors de la mise à jour par le client

        // Recalculer le montant total
        calculerMontantTotal(reservation);

        return reservationRepository.save(reservation);
    }

    public Reservation updateStatutReservation(Long id, Reservation.StatutReservation statut) {
        Reservation reservation = getReservationById(id);
        reservation.setStatut(statut);
        return reservationRepository.save(reservation);
    }

    public void cancelReservation(Long id) {
        Reservation reservation = getReservationById(id);
        reservation.setStatut(Reservation.StatutReservation.ANNULEE);
        reservationRepository.save(reservation);
    }

    public List<Reservation> getReservationsEnCours() {
        LocalDate aujourdHui = LocalDate.now();
        return reservationRepository.findReservationsEnCours(aujourdHui);
    }

    public List<Reservation> getReservationsFutures() {
        LocalDate aujourdHui = LocalDate.now();
        return reservationRepository.findReservationsFutures(aujourdHui);
    }

    public Map<String, Object> getStatistiques() {
        Map<String, Object> stats = new HashMap<>();
        
        List<Reservation> allReservations = getAllReservations();
        
        // Statistiques par statut
        Map<String, Long> statutsStats = allReservations.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getStatut().toString(),
                        Collectors.counting()
                ));
        
        // Réservations en cours
        long reservationsEnCours = getReservationsEnCours().size();
        
        // Réservations futures
        long reservationsFutures = getReservationsFutures().size();
        
        // Chiffre d'affaires total
        double chiffreAffairesTotal = allReservations.stream()
                .filter(r -> r.getStatut() == Reservation.StatutReservation.TERMINEE)
                .mapToDouble(r -> r.getMontantTotal().doubleValue())
                .sum();
        
        stats.put("totalReservations", allReservations.size());
        stats.put("reservationsEnCours", reservationsEnCours);
        stats.put("reservationsFutures", reservationsFutures);
        stats.put("statistiquesParStatut", statutsStats);
        stats.put("chiffreAffairesTotal", chiffreAffairesTotal);
        
        return stats;
    }

    private void calculerMontantTotal(Reservation reservation) {
        if (reservation.getVehicule() != null && 
            reservation.getVehicule().getCategorie() != null &&
            reservation.getDateDebut() != null && 
            reservation.getDateFin() != null) {
            
            long nombreJours = java.time.temporal.ChronoUnit.DAYS.between(
                    reservation.getDateDebut(), reservation.getDateFin()) + 1;
            
            double prixParJour = reservation.getVehicule().getCategorie().getPrixParJour();
            double montantTotal = nombreJours * prixParJour;
            
            reservation.setMontantTotal(java.math.BigDecimal.valueOf(montantTotal));
        }
    }
}
