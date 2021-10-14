package com.globits.healthdeclaration.service;

import java.util.UUID;

import org.springframework.data.domain.Page;
import com.globits.healthdeclaration.domain.BackgroundDisease;
import com.globits.healthdeclaration.dto.BackgroundDiseaseDto;
import com.globits.healthdeclaration.functiondto.BackgroundDiseaseSearchDto;
import com.globits.core.service.GenericService;
public interface BackgroundDiseaseService extends GenericService<BackgroundDisease, UUID>{

	Page<BackgroundDiseaseDto> searchByDto(BackgroundDiseaseSearchDto dto);

	BackgroundDiseaseDto getById(UUID id);

	BackgroundDiseaseDto saveOrUpdate(BackgroundDiseaseDto dto, UUID id);

	Boolean deleteById(UUID fromString);
}
