package com.example.agence_location_vehicules.repository;

import com.example.agence_location_vehicules.entities.Paiement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaiementRepository extends JpaRepository<Paiement, Long> {
    Optional<Paiement> findByReservationId(Long reservationId);
    List<Paiement> findByStatut(Paiement.StatutPaiement statut);
    List<Paiement> findByDatePaiementBetween(LocalDateTime debut, LocalDateTime fin);
}
