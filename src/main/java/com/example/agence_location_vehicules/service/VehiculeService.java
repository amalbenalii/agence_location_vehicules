package com.example.agence_location_vehicules.service;

import com.example.agence_location_vehicules.entities.Vehicule;
import com.example.agence_location_vehicules.repository.VehiculeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class VehiculeService implements IVehiculeService {

    private final VehiculeRepository vehiculeRepository;

    @Value("${app.upload.dir:uploads/vehicles}")
    private String uploadDir;

    public VehiculeService(VehiculeRepository vehiculeRepository) {
        this.vehiculeRepository = vehiculeRepository;
    }

    @Override
    public Vehicule saveVehicule(Vehicule v) {
        // Validation
        if (v.getMarque() == null || v.getMarque().trim().isEmpty()) {
            throw new IllegalArgumentException("La marque est obligatoire");
        }
        if (v.getModele() == null || v.getModele().trim().isEmpty()) {
            throw new IllegalArgumentException("Le modèle est obligatoire");
        }
        if (v.getImmatriculation() == null || v.getImmatriculation().trim().isEmpty()) {
            throw new IllegalArgumentException("L'immatriculation est obligatoire");
        }
        if (v.getAgence() == null || v.getAgence().getId() == null) {
            throw new IllegalArgumentException("L'agence est obligatoire");
        }
        if (v.getCategorie() == null || v.getCategorie().getId() == null) {
            throw new IllegalArgumentException("La catégorie est obligatoire");
        }
        
        // Vérifier l'unicité de l'immatriculation
        Optional<Vehicule> existing = vehiculeRepository.findAll().stream()
                .filter(veh -> veh.getImmatriculation().equalsIgnoreCase(v.getImmatriculation()))
                .findFirst();
        if (existing.isPresent() && !existing.get().getId().equals(v.getId())) {
            throw new IllegalArgumentException("Un véhicule avec cette immatriculation existe déjà");
        }
        
        return vehiculeRepository.save(v);
    }

    @Override
    public Vehicule updateVehicule(Vehicule v) {
        // Vérifier que le véhicule existe
        Vehicule existing = vehiculeRepository.findById(v.getId())
                .orElseThrow(() -> new com.example.agence_location_vehicules.exception.ResourceNotFoundException("Véhicule non trouvé avec l'ID: " + v.getId()));
        
        // Validation
        if (v.getMarque() == null || v.getMarque().trim().isEmpty()) {
            throw new IllegalArgumentException("La marque est obligatoire");
        }
        if (v.getModele() == null || v.getModele().trim().isEmpty()) {
            throw new IllegalArgumentException("Le modèle est obligatoire");
        }
        if (v.getImmatriculation() == null || v.getImmatriculation().trim().isEmpty()) {
            throw new IllegalArgumentException("L'immatriculation est obligatoire");
        }
        if (v.getAgence() == null || v.getAgence().getId() == null) {
            throw new IllegalArgumentException("L'agence est obligatoire");
        }
        if (v.getCategorie() == null || v.getCategorie().getId() == null) {
            throw new IllegalArgumentException("La catégorie est obligatoire");
        }
        
        // Vérifier l'unicité de l'immatriculation
        Optional<Vehicule> existingByImmat = vehiculeRepository.findAll().stream()
                .filter(veh -> veh.getImmatriculation().equalsIgnoreCase(v.getImmatriculation()))
                .filter(veh -> !veh.getId().equals(v.getId()))
                .findFirst();
        if (existingByImmat.isPresent()) {
            throw new IllegalArgumentException("Un véhicule avec cette immatriculation existe déjà");
        }
        
        // Mettre à jour les champs
        existing.setMarque(v.getMarque());
        existing.setModele(v.getModele());
        existing.setImmatriculation(v.getImmatriculation());
        existing.setCouleur(v.getCouleur());
        existing.setKilometrage(v.getKilometrage());
        existing.setCarburant(v.getCarburant());
        existing.setBoiteVitesse(v.getBoiteVitesse());
        existing.setNombrePlaces(v.getNombrePlaces());
        existing.setStatut(v.getStatut());
        
        // Ne mettre à jour l'URL de l'image que si elle est explicitement fournie
        if (v.getImageUrl() != null) {
            existing.setImageUrl(v.getImageUrl());
        }
        
        existing.setCategorie(v.getCategorie());
        existing.setAgence(v.getAgence());
        
        return vehiculeRepository.save(existing);
    }

    @Override
    public void deleteVehiculeById(Long id) {
        Vehicule vehicule = vehiculeRepository.findById(id)
                .orElseThrow(() -> new com.example.agence_location_vehicules.exception.ResourceNotFoundException("Véhicule non trouvé avec l'ID: " + id));
        
        // Vérifier s'il y a des réservations actives
        if (vehicule.getReservations() != null && !vehicule.getReservations().isEmpty()) {
            long activeReservations = vehicule.getReservations().stream()
                    .filter(r -> r.getStatut() != com.example.agence_location_vehicules.entities.Reservation.StatutReservation.TERMINEE
                            && r.getStatut() != com.example.agence_location_vehicules.entities.Reservation.StatutReservation.ANNULEE)
                    .count();
            if (activeReservations > 0) {
                throw new RuntimeException("Impossible de supprimer le véhicule. Il a " + activeReservations + " réservation(s) active(s).");
            }
        }
        
        vehiculeRepository.deleteById(id);
    }

    @Override
    public Vehicule getVehicule(Long id) {
        return vehiculeRepository.findById(id)
                .orElseThrow(() -> new com.example.agence_location_vehicules.exception.ResourceNotFoundException("Véhicule non trouvé avec l'ID: " + id));
    }

    @Override
    public List<Vehicule> getAllVehicules() {
        return vehiculeRepository.findAll();
    }

    @Override
    public Page<Vehicule> getVehiculesPaginated(Pageable pageable) {
        return vehiculeRepository.findAll(pageable);
    }

    @Override
    public Page<Vehicule> searchVehicules(String keyword, Pageable pageable) {
        return vehiculeRepository.searchVehicules(keyword, pageable);
    }

    @Override
    public Page<Vehicule> getAvailableVehiculesPaginated(Pageable pageable) {
        return vehiculeRepository.findByStatut(Vehicule.StatutVehicule.DISPONIBLE, pageable);
    }

    @Override
    public Page<Vehicule> searchAvailableVehicules(String keyword, Pageable pageable) {
        return vehiculeRepository.searchAvailableVehicules(keyword, pageable);
    }

    @Override
    public List<Vehicule> findByMarque(String marque) {
        return vehiculeRepository.findByMarqueContains(marque);
    }

    @Override
    public List<Vehicule> findByCategorieId(Long categorieId) {
        return vehiculeRepository.findByCategorieId(categorieId);
    }

    @Override
    public List<Vehicule> findByStatut(Vehicule.StatutVehicule statut) {
        return vehiculeRepository.findByStatut(statut);
    }

    @Override
    public String uploadVehicleImage(Long id, MultipartFile file) {
        Vehicule vehicule = getVehicule(id);
        
        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null ? 
                originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
            String filename = "vehicle_" + id + "_" + UUID.randomUUID().toString() + extension;
            
            // Save file
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Delete old image if exists
            if (vehicule.getImageUrl() != null) {
                String oldImageUrl = vehicule.getImageUrl();
                String oldFilename = oldImageUrl.substring(oldImageUrl.lastIndexOf('/') + 1);
                Path oldFilePath = uploadPath.resolve(oldFilename);
                if (Files.exists(oldFilePath)) {
                    Files.delete(oldFilePath);
                }
            }
            
            // Update vehicle with new image URL
            String imageUrl = "/uploads/" + filename;
            vehicule.setImageUrl(imageUrl);
            vehiculeRepository.save(vehicule);
            
            return imageUrl;
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteVehicleImage(Long id) {
        Vehicule vehicule = getVehicule(id);
        
        if (vehicule.getImageUrl() != null) {
            try {
                // Extract filename from URL like "/uploads/filename.jpg"
                String imageUrl = vehicule.getImageUrl();
                String filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
                Path uploadPath = Paths.get(uploadDir);
                Path filePath = uploadPath.resolve(filename);
                
                if (Files.exists(filePath)) {
                    Files.delete(filePath);
                }
                
                // Update vehicle to remove image URL
                vehicule.setImageUrl(null);
                vehiculeRepository.save(vehicule);
                
            } catch (IOException e) {
                throw new RuntimeException("Failed to delete image: " + e.getMessage(), e);
            }
        }
    }
}