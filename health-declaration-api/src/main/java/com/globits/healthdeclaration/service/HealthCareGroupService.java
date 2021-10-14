package com.globits.healthdeclaration.service;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;

import com.globits.core.service.GenericService;
import com.globits.healthdeclaration.domain.HealthCareGroup;
import com.globits.healthdeclaration.dto.HealthCareGroupDto;
import com.globits.healthdeclaration.functiondto.HealthCareGroupSearchDto;

public interface HealthCareGroupService extends GenericService<HealthCareGroup, UUID>{

	Page<HealthCareGroupDto> searchByDto(HealthCareGroupSearchDto dto);

	HealthCareGroupDto getById(UUID id);

	HealthCareGroupDto saveOrUpdate(HealthCareGroupDto dto, UUID id);

	Boolean deleteById(UUID fromString);

	List<UUID> getAllAdministrativeUnitIdById(UUID healthCareGroupId);

	Boolean checkDuplicateCode(UUID id, String code);

	List<HealthCareGroupDto> getListHealthCareGroup(List<UUID> ids);
}
