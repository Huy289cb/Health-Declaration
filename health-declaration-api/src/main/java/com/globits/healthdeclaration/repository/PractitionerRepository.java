package com.globits.healthdeclaration.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.globits.healthdeclaration.domain.Practitioner;
import com.globits.healthdeclaration.dto.PractitionerDto;
import com.globits.healthdeclaration.dto.UserAdministrativeUnitDto;

@Repository
public interface PractitionerRepository extends JpaRepository<Practitioner, UUID> {
	@Query("select new com.globits.healthdeclaration.dto.PractitionerDto(entity) FROM Practitioner entity where entity.user.id =?1 ")
	List<PractitionerDto> getByUserId(Long id);
	
	@Query("SELECT COUNT(entity.id) from Practitioner entity WHERE entity.administrativeUnit.id = ?1")
	Integer countPractitionerByUnit(UUID id);
}
