package com.globits.healthdeclaration.service;

import com.globits.core.service.GenericService;
import com.globits.healthdeclaration.domain.HealthOrganization;
import com.globits.healthdeclaration.dto.HealthOrganizationDto;
import com.globits.healthdeclaration.functiondto.HealthOrganizationSearchDto;
import com.globits.healthdeclaration.functiondto.SearchDto;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface HealthOrganizationService extends GenericService<HealthOrganization, UUID> {

    Page<HealthOrganizationDto> searchByDto(HealthOrganizationSearchDto dto);

    HealthOrganizationDto getById(UUID id);

    HealthOrganizationDto saveOrUpdate(HealthOrganizationDto dto, UUID id);

    Boolean deleteById(UUID id);

    Boolean checkCode(UUID id, String code);
}
