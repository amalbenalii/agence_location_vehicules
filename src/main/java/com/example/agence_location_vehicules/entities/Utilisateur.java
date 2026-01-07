package com.example.agence_location_vehicules.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "utilisateurs")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String motDePasse;

    private String telephone;
    private String adresse;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @JsonIgnore
    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Reservation> reservationsClient;

    @JsonIgnore
    @OneToMany(mappedBy = "gestionnaire", fetch = FetchType.LAZY)
    private List<Reservation> reservationsGestionnaire;

    public enum Role {
        CLIENT, GESTIONNAIRE
    }
}
