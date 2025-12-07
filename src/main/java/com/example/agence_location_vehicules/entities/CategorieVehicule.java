package com.example.agence_location_vehicules.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "categories_vehicule")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CategorieVehicule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String nom;

    private String description;

    @Column(nullable = false)
    private Double prixParJour;

    @Column(length = 1000)
    private String caracteristiques;
    @JsonIgnore
    @OneToMany(mappedBy = "categorie", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Vehicule> vehicules;
}