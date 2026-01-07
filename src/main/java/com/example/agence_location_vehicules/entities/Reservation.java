package com.example.agence_location_vehicules.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date_debut", nullable = false)
    private LocalDate dateDebut;

    @Column(name = "date_fin", nullable = false)
    private LocalDate dateFin;

    @Column(name = "date_reservation")
    private LocalDateTime dateReservation;

    @Column(name = "montant_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal montantTotal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutReservation statut;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Utilisateur client;

    @ManyToOne
    @JoinColumn(name = "vehicule_id", nullable = false)
    private Vehicule vehicule;

    @ManyToOne
    @JoinColumn(name = "agence_prise_en_charge_id", nullable = false)
    private Agence agencePriseEnCharge;

    @ManyToOne
    @JoinColumn(name = "agence_retour_id", nullable = false)
    private Agence agenceRetour;

    @ManyToOne
    @JoinColumn(name = "gestionnaire_id")
    private Utilisateur gestionnaire;

    @OneToOne(mappedBy = "reservation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Paiement paiement;

    @PrePersist
    protected void onCreate() {
        dateReservation = LocalDateTime.now();
        if (statut == null) {
            statut = StatutReservation.EN_ATTENTE;
        }
    }

    public enum StatutReservation {
        EN_ATTENTE, CONFIRMEE, EN_COURS, TERMINEE, ANNULEE
    }
}
