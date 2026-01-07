package com.example.agence_location_vehicules.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "agences")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Agence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String adresse;

    @Column(nullable = false)
    private String ville;

    @Column(nullable = false)
    private String telephone;

    private String email;

    @Column(name = "heure_ouverture")
    private LocalTime heureOuverture;

    @Column(name = "heure_fermeture")
    private LocalTime heureFermeture;

    @JsonIgnore
    @OneToMany(mappedBy = "agence", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Vehicule> vehicules;

    @JsonIgnore
    @OneToMany(mappedBy = "agencePriseEnCharge", fetch = FetchType.LAZY)
    private List<Reservation> reservationsPriseEnCharge;

    @JsonIgnore
    @OneToMany(mappedBy = "agenceRetour", fetch = FetchType.LAZY)
    private List<Reservation> reservationsRetour;
}
