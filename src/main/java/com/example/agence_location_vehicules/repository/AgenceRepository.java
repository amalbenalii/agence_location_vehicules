package com.example.agence_location_vehicules.repository;

import com.example.agence_location_vehicules.entities.Agence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AgenceRepository extends JpaRepository<Agence, Long> {
}
