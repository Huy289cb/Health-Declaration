package com.globits.healthdeclaration.service;

import java.util.UUID;

import org.springframework.data.domain.Page;

import com.globits.core.service.GenericService;
import com.globits.healthdeclaration.domain.Practitioner;
import com.globits.healthdeclaration.dto.PractitionerDto;
import com.globits.healthdeclaration.functiondto.PractitionerSearchDto;

public interface PractitionerService extends GenericService<Practitioner, UUID> {

	Page<PractitionerDto> searchByDto(PractitionerSearchDto dto);

	PractitionerDto getById(UUID id);

	PractitionerDto saveOrUpdate(PractitionerDto dto, UUID id);

	Boolean deleteById(UUID fromString);

	boolean checkDuplicateUserName(UUID id, String username);


}
