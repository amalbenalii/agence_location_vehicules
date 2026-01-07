package com.example.agence_location_vehicules.controller;

import com.example.agence_location_vehicules.entities.Vehicule;
import com.example.agence_location_vehicules.service.IVehiculeService;
import com.example.agence_location_vehicules.utils.PaginationResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/vehicules")
@CrossOrigin(origins = {"http://localhost:4200"}, allowCredentials = "true")
@Tag(name = "Véhicules", description = "Vehicle management API")
@AllArgsConstructor
public class VehiculeController {

    private final IVehiculeService vehiculeService;

    @GetMapping
    @Operation(summary = "Get all vehicles")
    public ResponseEntity<List<Vehicule>> getAll() {
        return ResponseEntity.ok(vehiculeService.getAllVehicules());
    }

    @GetMapping("/paginated")
    @Operation(summary = "Get vehicles with pagination")
    public ResponseEntity<PaginationResponse<Vehicule>> getVehiculesPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? 
            Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Page<Vehicule> vehiclePage = vehiculeService.getVehiculesPaginated(pageable);
        
        PaginationResponse<Vehicule> response = PaginationResponse.of(
            vehiclePage.getContent(),
            vehiclePage.getNumber(),
            vehiclePage.getSize(),
            vehiclePage.getTotalElements()
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/available/paginated")
    @Operation(summary = "Get available vehicles with pagination")
    public ResponseEntity<PaginationResponse<Vehicule>> getAvailableVehiculesPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? 
            Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Page<Vehicule> vehiclePage = vehiculeService.getAvailableVehiculesPaginated(pageable);
        
        PaginationResponse<Vehicule> response = PaginationResponse.of(
            vehiclePage.getContent(),
            vehiclePage.getNumber(),
            vehiclePage.getSize(),
            vehiclePage.getTotalElements()
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/available/search/paginated")
    @Operation(summary = "Search available vehicles with pagination")
    public ResponseEntity<PaginationResponse<Vehicule>> searchAvailableVehiculesPaginated(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? 
            Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Page<Vehicule> vehiclePage = vehiculeService.searchAvailableVehicules(keyword, pageable);
        
        PaginationResponse<Vehicule> response = PaginationResponse.of(
            vehiclePage.getContent(),
            vehiclePage.getNumber(),
            vehiclePage.getSize(),
            vehiclePage.getTotalElements()
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get vehicle by ID")
    public ResponseEntity<Vehicule> getOne(@PathVariable Long id) {
        Vehicule vehicule = vehiculeService.getVehicule(id);
        return ResponseEntity.ok(vehicule);
    }

    @GetMapping("/categorie/{id}")
    @Operation(summary = "Get vehicles by category")
    public ResponseEntity<List<Vehicule>> getByCategorie(@PathVariable Long id) {
        return ResponseEntity.ok(vehiculeService.findByCategorieId(id));
    }

    @GetMapping("/marque")
    @Operation(summary = "Get vehicles by brand")
    public ResponseEntity<List<Vehicule>> getByMarque(@RequestParam String marque) {
        return ResponseEntity.ok(vehiculeService.findByMarque(marque));
    }

    @GetMapping("/statut/{statut}")
    @Operation(summary = "Get vehicles by status")
    public ResponseEntity<List<Vehicule>> getByStatut(@PathVariable Vehicule.StatutVehicule statut) {
        return ResponseEntity.ok(vehiculeService.findByStatut(statut));
    }

    @PostMapping
    @Operation(summary = "Create new vehicle")
    public ResponseEntity<Vehicule> addVehicule(@Valid @RequestBody Vehicule vehicule) {
        Vehicule created = vehiculeService.saveVehicule(vehicule);
        return ResponseEntity.ok(created);
    }

    @PutMapping
    @Operation(summary = "Update vehicle")
    public ResponseEntity<Vehicule> updateVehicule(@Valid @RequestBody Vehicule vehicule) {
        Vehicule updated = vehiculeService.updateVehicule(vehicule);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete vehicle")
    public ResponseEntity<Void> deleteVehicule(@PathVariable Long id) {
        vehiculeService.deleteVehiculeById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/image")
    @Operation(summary = "Upload vehicle image")
    public ResponseEntity<Map<String, String>> uploadImage(
            @PathVariable Long id,
            @RequestParam("image") MultipartFile file) {
        try {
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
            }
            
            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body(Map.of("error", "File must be an image"));
            }
            
            // Validate file size (5MB max)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest().body(Map.of("error", "File size must be less than 5MB"));
            }
            
            String imageUrl = vehiculeService.uploadVehicleImage(id, file);
            Map<String, String> response = new HashMap<>();
            response.put("imageUrl", imageUrl);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to upload image: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}/image")
    @Operation(summary = "Delete vehicle image")
    public ResponseEntity<Void> deleteImage(@PathVariable Long id) {
        try {
            vehiculeService.deleteVehicleImage(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/test-upload")
    @Operation(summary = "Test upload directory")
    public ResponseEntity<Map<String, Object>> testUpload() {
        try {
            java.io.File uploadDir = new java.io.File("uploads/vehicles");
            Map<String, Object> response = new HashMap<>();
            
            response.put("uploadDir", uploadDir.getAbsolutePath());
            response.put("exists", uploadDir.exists());
            response.put("canRead", uploadDir.canRead());
            
            if (uploadDir.exists()) {
                String[] files = uploadDir.list();
                response.put("fileCount", files != null ? files.length : 0);
                if (files != null && files.length > 0) {
                    response.put("files", java.util.Arrays.asList(files));
                }
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @GetMapping("/images/{filename:.+}")
    @Operation(summary = "Serve vehicle image")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) {
        try {
            // Construct the file path
            Path filePath = Paths.get("uploads/vehicles").resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                // Determine content type
                String contentType = "application/octet-stream";
                if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) {
                    contentType = "image/jpeg";
                } else if (filename.toLowerCase().endsWith(".png")) {
                    contentType = "image/png";
                } else if (filename.toLowerCase().endsWith(".gif")) {
                    contentType = "image/gif";
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
