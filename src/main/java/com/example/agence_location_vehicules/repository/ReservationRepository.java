package com.example.agence_location_vehicules.repository;

import com.example.agence_location_vehicules.entities.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    
    List<Reservation> findByClientId(Long clientId);
    
    List<Reservation> findByVehiculeId(Long vehiculeId);
    
    List<Reservation> findByStatut(Reservation.StatutReservation statut);
    
    @Query("SELECT r FROM Reservation r WHERE r.vehicule.id = :vehiculeId " +
           "AND ((r.dateDebut <= :dateFin AND r.dateFin >= :dateDebut) " +
           "AND r.statut NOT IN ('ANNULEE', 'TERMINEE'))")
    List<Reservation> findConflictingReservations(
            @Param("vehiculeId") Long vehiculeId,
            @Param("dateDebut") LocalDate dateDebut,
            @Param("dateFin") LocalDate dateFin);
    
    @Query("SELECT r FROM Reservation r WHERE r.dateDebut <= :aujourdHui " +
           "AND r.dateFin >= :aujourdHui " +
           "AND r.statut IN ('CONFIRMEE', 'EN_COURS')")
    List<Reservation> findReservationsEnCours(@Param("aujourdHui") LocalDate aujourdHui);
    
    @Query("SELECT r FROM Reservation r WHERE r.dateDebut > :aujourdHui " +
           "AND r.statut IN ('EN_ATTENTE', 'CONFIRMEE')")
    List<Reservation> findReservationsFutures(@Param("aujourdHui") LocalDate aujourdHui);
}
