package com.example.agence_location_vehicules.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "vehicules")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Vehicule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String marque;

    @Column(nullable = false)
    private String modele;

    @Column(unique = true, nullable = false)
    private String immatriculation;

    private String couleur;
    private Integer kilometrage;

    @Enumerated(EnumType.STRING)
    private Carburant carburant;

    @Enumerated(EnumType.STRING)
    private BoiteVitesse boiteVitesse;

    private Integer nombrePlaces;

    @Enumerated(EnumType.STRING)
    private StatutVehicule statut;

    private String imageUrl;
    
    @ManyToOne
    @JoinColumn(name = "categorie_id")
    private CategorieVehicule categorie;

    @ManyToOne
    @JoinColumn(name = "agence_id", nullable = false)
    private Agence agence;

    @JsonIgnore
    @OneToMany(mappedBy = "vehicule", fetch = FetchType.LAZY)
    private List<Reservation> reservations;

    // Enumérations
    public enum Carburant {
        ESSENCE, DIESEL, ELECTRIQUE, HYBRIDE
    }

    public enum BoiteVitesse {
        MANUELLE, AUTOMATIQUE
    }

    public enum StatutVehicule {
        DISPONIBLE, LOUE, MAINTENANCE, HORS_SERVICE
    }
}