package com.example.agence_location_vehicules.entities;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "paiements")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Paiement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal montant;

    @Column(name = "date_paiement")
    private LocalDateTime datePaiement;

    @Enumerated(EnumType.STRING)
    @Column(name = "methode_paiement", nullable = false)
    private MethodePaiement methodePaiement;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutPaiement statut;

    @OneToOne
    @JoinColumn(name = "reservation_id", unique = true, nullable = false)
    private Reservation reservation;

    @PrePersist
    protected void onCreate() {
        if (datePaiement == null) {
            datePaiement = LocalDateTime.now();
        }
        if (statut == null) {
            statut = StatutPaiement.EN_ATTENTE;
        }
    }

    public enum MethodePaiement {
        CARTE_BANCAIRE, ESPECES, VIREMENT, PAYPAL
    }

    public enum StatutPaiement {
        EN_ATTENTE, VALIDE, ECHOUE, REMBOURSE
    }
}
