package com.example.agence_location_vehicules;

import com.example.agence_location_vehicules.entities.CategorieVehicule;
import com.example.agence_location_vehicules.entities.Vehicule;
import com.example.agence_location_vehicules.repository.CategorieVehiculeRepository;
import com.example.agence_location_vehicules.repository.VehiculeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class AgenceLocationVehiculesApplication {

    public static void main(String[] args) {
        SpringApplication.run(AgenceLocationVehiculesApplication.class, args);
    }
    //@Bean
    CommandLineRunner initDatabase(CategorieVehiculeRepository categorieRepo,
                                   VehiculeRepository vehiculeRepo) {
        return args -> {
            // Création des catégories
            // Prévenir insertions en double : vérifier l'existence par nom
            String nomEco = "Économique";
            String nomBer = "Berline";
            String nomSuv = "SUV";

            CategorieVehicule catEconomique = categorieRepo.findByNom(nomEco);
            if (catEconomique == null) {
                catEconomique = CategorieVehicule.builder()
                        .nom(nomEco)
                        .description("Véhicules compacts et économiques en carburant")
                        .prixParJour(35.0)
                        .caracteristiques("Climatisation, 4-5 places, consommation réduite")
                        .build();
                try {
                    categorieRepo.save(catEconomique);
                } catch (org.springframework.dao.DataIntegrityViolationException e) {
                    // Si une contrainte d'unicité survient (ex: encodage différent), on ignore
                    System.err.println("Categorie existante ou erreur d'encodage pour: " + nomEco + " -> " + e.getMessage());
                }
                catEconomique = categorieRepo.findByNom(nomEco);
            }

            CategorieVehicule catBerline = categorieRepo.findByNom(nomBer);
            if (catBerline == null) {
                catBerline = CategorieVehicule.builder()
                        .nom(nomBer)
                        .description("Véhicules familiaux confortables")
                        .prixParJour(50.0)
                        .caracteristiques("Climatisation automatique, GPS, sièges cuir")
                        .build();
                try {
                    categorieRepo.save(catBerline);
                } catch (org.springframework.dao.DataIntegrityViolationException e) {
                    System.err.println("Categorie existante ou erreur d'encodage pour: " + nomBer + " -> " + e.getMessage());
                }
                catBerline = categorieRepo.findByNom(nomBer);
            }

            CategorieVehicule catSUV = categorieRepo.findByNom(nomSuv);
            if (catSUV == null) {
                catSUV = CategorieVehicule.builder()
                        .nom(nomSuv)
                        .description("Véhicules tout-terrain familiaux")
                        .prixParJour(70.0)
                        .caracteristiques("4x4, grand espace, toit ouvrant")
                        .build();
                try {
                    categorieRepo.save(catSUV);
                } catch (org.springframework.dao.DataIntegrityViolationException e) {
                    System.err.println("Categorie existante ou erreur d'encodage pour: " + nomSuv + " -> " + e.getMessage());
                }
                catSUV = categorieRepo.findByNom(nomSuv);
            }

            // Création des véhicules
            vehiculeRepo.save(Vehicule.builder()
                    .marque("Renault")
                    .modele("Clio")
                    .immatriculation("AB-123-CD")
                    .couleur("Bleu")
                    .kilometrage(15000)
                    .carburant(Vehicule.Carburant.ESSENCE)
                    .boiteVitesse(Vehicule.BoiteVitesse.MANUELLE)
                    .nombrePlaces(5)
                    .statut(Vehicule.StatutVehicule.DISPONIBLE)
                    .categorie(catEconomique)
                    .build());

            vehiculeRepo.save(Vehicule.builder()
                    .marque("Peugeot")
                    .modele("308")
                    .immatriculation("EF-456-GH")
                    .couleur("Noir")
                    .kilometrage(25000)
                    .carburant(Vehicule.Carburant.DIESEL)
                    .boiteVitesse(Vehicule.BoiteVitesse.AUTOMATIQUE)
                    .nombrePlaces(5)
                    .statut(Vehicule.StatutVehicule.DISPONIBLE)
                    .categorie(catBerline)
                    .build());

            vehiculeRepo.save(Vehicule.builder()
                    .marque("Toyota")
                    .modele("RAV4")
                    .immatriculation("IJ-789-KL")
                    .couleur("Blanc")
                    .kilometrage(18000)
                    .carburant(Vehicule.Carburant.HYBRIDE)
                    .boiteVitesse(Vehicule.BoiteVitesse.AUTOMATIQUE)
                    .nombrePlaces(5)
                    .statut(Vehicule.StatutVehicule.DISPONIBLE)
                    .categorie(catSUV)
                    .build());

            System.out.println("=== Base de données initialisée avec des données de test ===");
        };
    }

}
