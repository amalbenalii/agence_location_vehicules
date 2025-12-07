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
            CategorieVehicule catEconomique = CategorieVehicule.builder()
                    .nom("Économique")
                    .description("Véhicules compacts et économiques en carburant")
                    .prixParJour(35.0)
                    .caracteristiques("Climatisation, 4-5 places, consommation réduite")
                    .build();

            CategorieVehicule catBerline = CategorieVehicule.builder()
                    .nom("Berline")
                    .description("Véhicules familiaux confortables")
                    .prixParJour(50.0)
                    .caracteristiques("Climatisation automatique, GPS, sièges cuir")
                    .build();

            CategorieVehicule catSUV = CategorieVehicule.builder()
                    .nom("SUV")
                    .description("Véhicules tout-terrain familiaux")
                    .prixParJour(70.0)
                    .caracteristiques("4x4, grand espace, toit ouvrant")
                    .build();

            categorieRepo.save(catEconomique);
            categorieRepo.save(catBerline);
            categorieRepo.save(catSUV);

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
