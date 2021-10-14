package com.globits.healthdeclaration.repository;

import com.globits.healthdeclaration.domain.HealthOrganization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface HealthOrganizationRepository extends JpaRepository<HealthOrganization, UUID> {

    @Query(" from HealthOrganization entity where entity.code =?1 ")
    List<HealthOrganization> findByCode(String code);
    
	@Query("SELECT COUNT(entity.id) from HealthOrganization entity WHERE entity.administrativeUnit.id = ?1")
	Integer countHealthOrganizationByUnit(UUID id);
}
