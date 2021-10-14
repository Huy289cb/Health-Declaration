package com.globits.healthdeclaration.service;

import java.util.UUID;

import org.springframework.data.domain.Page;

import com.globits.core.service.GenericService;
import com.globits.healthdeclaration.domain.Symptom;
import com.globits.healthdeclaration.dto.SymptomDto;
import com.globits.healthdeclaration.functiondto.SymptomSearchDto;

public interface SymptomService extends GenericService<Symptom, UUID> {

	Page<SymptomDto> searchByDto(SymptomSearchDto dto);

	SymptomDto getById(UUID id);

	SymptomDto saveOrUpdate(SymptomDto dto, UUID id);

	Boolean deleteById(UUID fromString);

}
