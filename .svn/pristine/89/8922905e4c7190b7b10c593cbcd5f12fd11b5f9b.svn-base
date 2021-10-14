package com.globits.healthdeclaration.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.globits.healthdeclaration.domain.HealthCareGroupAdministrativeUnit;
import com.globits.healthdeclaration.dto.HealthCareGroupDto;

import java.util.List;
import java.util.UUID;

@Repository
public interface HealthCareGroupAdministrativeUnitRepository extends JpaRepository<HealthCareGroupAdministrativeUnit, UUID>{

	@Query(" select entity.administrativeUnit.id FROM HealthCareGroupAdministrativeUnit entity where entity.healthCareGroup.id =?1 ")
	List<UUID> getAllAdministrativeUnitIdById(UUID healthCareGroupId);

	@Query("SELECT COUNT(entity.id) from HealthCareGroupAdministrativeUnit entity WHERE entity.administrativeUnit.id = ?1")
	Integer countHealthCareGroupAdministrativeUnitByUnit(UUID id);
	
	@Query("SELECT new com.globits.healthdeclaration.dto.HealthCareGroupDto(entity.healthCareGroup, false) FROM HealthCareGroupAdministrativeUnit entity WHERE entity.administrativeUnit.id = ?1 ")
	List<HealthCareGroupDto> listHealthCareGroupByUnit(UUID id);
}
