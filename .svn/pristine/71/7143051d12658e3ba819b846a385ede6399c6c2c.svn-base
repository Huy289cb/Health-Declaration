package com.globits.healthdeclaration.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.globits.healthdeclaration.domain.Encounter;

@Repository
public interface EncounterRepository extends JpaRepository<Encounter, UUID> {
	@Query("SELECT COUNT(entity.id) from Encounter entity WHERE entity.userAdministrativeUnit.id = ?1")
	Integer countEncounterByUnit(UUID id);
}
