package com.example.agence_location_vehicules.service;

import com.example.agence_location_vehicules.entities.Paiement;
import com.example.agence_location_vehicules.entities.Reservation;
import com.example.agence_location_vehicules.repository.PaiementRepository;
import com.example.agence_location_vehicules.repository.ReservationRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class PaiementService {

    private final PaiementRepository paiementRepository;
    private final ReservationRepository reservationRepository;

    public List<Paiement> getAllPaiements() {
        return paiementRepository.findAll();
    }

    public Paiement getPaiementById(Long id) {
        return paiementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paiement non trouvé avec l'ID: " + id));
    }

    public Paiement getPaiementByReservation(Long reservationId) {
        return paiementRepository.findByReservationId(reservationId)
                .orElseThrow(() -> new RuntimeException("Paiement non trouvé pour la réservation: " + reservationId));
    }

    public List<Paiement> getPaiementsByStatut(Paiement.StatutPaiement statut) {
        return paiementRepository.findByStatut(statut);
    }

    public Paiement createPaiement(Paiement paiement) {
        // Vérifier que la réservation existe
        Reservation reservation = reservationRepository.findById(paiement.getReservation().getId())
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));

        // Vérifier qu'il n'y a pas déjà un paiement pour cette réservation
        if (paiementRepository.findByReservationId(paiement.getReservation().getId()).isPresent()) {
            throw new RuntimeException("Un paiement existe déjà pour cette réservation");
        }

        // Associer la réservation au paiement
        paiement.setReservation(reservation);

        // Mettre le montant total de la réservation si non spécifié
        if (paiement.getMontant() == null) {
            paiement.setMontant(reservation.getMontantTotal());
        }

        // Mettre le statut par défaut
        if (paiement.getStatut() == null) {
            paiement.setStatut(Paiement.StatutPaiement.EN_ATTENTE);
        }

        return paiementRepository.save(paiement);
    }

    public Paiement updatePaiement(Long id, Paiement paiementDetails) {
        Paiement paiement = getPaiementById(id);

        // Mise à jour des champs
        paiement.setMontant(paiementDetails.getMontant());
        paiement.setMethodePaiement(paiementDetails.getMethodePaiement());
        paiement.setDatePaiement(paiementDetails.getDatePaiement());
        paiement.setStatut(paiementDetails.getStatut());

        return paiementRepository.save(paiement);
    }

    public Paiement updateStatutPaiement(Long id, Paiement.StatutPaiement statut) {
        Paiement paiement = getPaiementById(id);
        paiement.setStatut(statut);
        
        // Si le paiement est validé, mettre à jour le statut de la réservation
        if (statut == Paiement.StatutPaiement.VALIDE) {
            Reservation reservation = paiement.getReservation();
            if (reservation.getStatut() == Reservation.StatutReservation.EN_ATTENTE) {
                reservation.setStatut(Reservation.StatutReservation.CONFIRMEE);
                reservationRepository.save(reservation);
            }
        }
        
        return paiementRepository.save(paiement);
    }

    public Paiement confirmerPaiement(Long id) {
        return updateStatutPaiement(id, Paiement.StatutPaiement.VALIDE);
    }

    public Paiement annulerPaiement(Long id) {
        return updateStatutPaiement(id, Paiement.StatutPaiement.ECHOUE);
    }

    public Map<String, Object> getStatistiques() {
        Map<String, Object> stats = new HashMap<>();
        
        List<Paiement> allPaiements = getAllPaiements();
        
        // Statistiques par statut
        Map<String, Long> statutsStats = allPaiements.stream()
                .collect(Collectors.groupingBy(
                        p -> p.getStatut().toString(),
                        Collectors.counting()
                ));
        
        // Paiements validés
        List<Paiement> paiementsConfirmes = getPaiementsByStatut(Paiement.StatutPaiement.VALIDE);
        
        // Chiffre d'affaires total
        double chiffreAffairesTotal = paiementsConfirmes.stream()
                .mapToDouble(p -> p.getMontant().doubleValue())
                .sum();
        
        // Paiements du mois en cours
        YearMonth moisActuel = YearMonth.now();
        LocalDate debutMois = moisActuel.atDay(1);
        LocalDate finMois = moisActuel.atEndOfMonth();
        
        List<Paiement> paiementsMois = paiementRepository.findByDatePaiementBetween(
                debutMois.atStartOfDay(), finMois.atTime(23, 59));
        double chiffreAffairesMois = paiementsMois.stream()
                .filter(p -> p.getStatut() == Paiement.StatutPaiement.VALIDE)
                .mapToDouble(p -> p.getMontant().doubleValue())
                .sum();
        
        stats.put("totalPaiements", allPaiements.size());
        stats.put("paiementsConfirmes", paiementsConfirmes.size());
        stats.put("statistiquesParStatut", statutsStats);
        stats.put("chiffreAffairesTotal", chiffreAffairesTotal);
        stats.put("chiffreAffairesMois", chiffreAffairesMois);
        
        return stats;
    }

    public Map<String, Object> getChiffreAffairesByPeriode(String periode) {
        Map<String, Object> result = new HashMap<>();
        LocalDate debutPeriode, finPeriode;
        
        switch (periode.toLowerCase()) {
            case "jour":
                debutPeriode = LocalDate.now();
                finPeriode = LocalDate.now();
                break;
            case "semaine":
                debutPeriode = LocalDate.now().minusWeeks(1);
                finPeriode = LocalDate.now();
                break;
            case "mois":
                YearMonth moisActuel = YearMonth.now();
                debutPeriode = moisActuel.atDay(1);
                finPeriode = moisActuel.atEndOfMonth();
                break;
            case "annee":
                debutPeriode = LocalDate.now().withDayOfYear(1);
                finPeriode = LocalDate.now().withDayOfYear(LocalDate.now().lengthOfYear());
                break;
            default:
                throw new IllegalArgumentException("Période non valide. Utilisez: jour, semaine, mois, année");
        }
        
        List<Paiement> paiements = paiementRepository.findByDatePaiementBetween(
                debutPeriode.atStartOfDay(), finPeriode.atTime(23, 59));
        
        double chiffreAffaires = paiements.stream()
                .filter(p -> p.getStatut() == Paiement.StatutPaiement.VALIDE)
                .mapToDouble(p -> p.getMontant().doubleValue())
                .sum();
        
        long nombrePaiements = paiements.stream()
                .filter(p -> p.getStatut() == Paiement.StatutPaiement.VALIDE)
                .count();
        
        result.put("periode", periode);
        result.put("debutPeriode", debutPeriode);
        result.put("finPeriode", finPeriode);
        result.put("chiffreAffaires", chiffreAffaires);
        result.put("nombrePaiements", nombrePaiements);
        result.put("montantMoyen", nombrePaiements > 0 ? chiffreAffaires / nombrePaiements : 0);
        
        return result;
    }
}
