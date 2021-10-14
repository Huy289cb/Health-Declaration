package com.globits.healthdeclaration.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;

import com.globits.core.service.GenericService;
import com.globits.healthdeclaration.domain.PractitionerAndFamily;
import com.globits.healthdeclaration.dto.FamilyDto;
import com.globits.healthdeclaration.dto.PractitionerAndFamilyDto;
import com.globits.healthdeclaration.functiondto.PractitionerAndFamilySearchDto;

public interface PractitionerAndFamilyService extends GenericService<PractitionerAndFamily, UUID> {

	Page<PractitionerAndFamilyDto> searchByDto(PractitionerAndFamilySearchDto dto);

	PractitionerAndFamilyDto assignment(UUID familyId, UUID practitionerId, Integer type);

	List<PractitionerAndFamilyDto> updateListFamily(List<FamilyDto> listFamily, UUID practitionerId, Integer type);

}
