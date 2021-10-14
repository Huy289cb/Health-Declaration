package com.globits.healthdeclaration.service;

import java.util.UUID;

import org.springframework.data.domain.Page;

import com.globits.core.service.GenericService;
import com.globits.healthdeclaration.domain.HealthCareGroupAdministrativeUnit;
import com.globits.healthdeclaration.dto.HealthCareGroupAdministrativeUnitDto;
import com.globits.healthdeclaration.functiondto.HealthCareGroupAdministrativeUnitSearchDto;
public interface HealthCareGroupAdministrativeUnitService  extends GenericService<HealthCareGroupAdministrativeUnit, UUID> {
	 	HealthCareGroupAdministrativeUnitDto saveOrUpdate(UUID id, HealthCareGroupAdministrativeUnitDto dto);

//		Page<HealthCareGroupAdministrativeUnitDto> searchByDto(HealthCareGroupAdministrativeUnitSearchDto dto);
//
//		HealthCareGroupAdministrativeUnitDto getById(UUID id);
//
//		Boolean deleteById(UUID fromString);
}
