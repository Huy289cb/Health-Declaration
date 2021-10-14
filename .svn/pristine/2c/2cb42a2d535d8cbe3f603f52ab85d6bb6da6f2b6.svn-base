package com.globits.healthdeclaration.service;
import java.util.UUID;

import org.springframework.data.domain.Page;

import com.globits.core.service.GenericService;
import com.globits.healthdeclaration.domain.Encounter;
import com.globits.healthdeclaration.dto.EncounterDto;
import com.globits.healthdeclaration.functiondto.EncounterSearchDto;
public interface EncounterService  extends GenericService<Encounter, UUID>{

	Page<EncounterDto> searchByDto(EncounterSearchDto dto);

	EncounterDto getById(UUID id);

	EncounterDto saveOrUpdate(EncounterDto dto, UUID id);

	Boolean deleteById(UUID fromString);
}
