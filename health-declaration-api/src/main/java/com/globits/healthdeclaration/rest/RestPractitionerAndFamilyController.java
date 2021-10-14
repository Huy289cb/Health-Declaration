package com.globits.healthdeclaration.rest;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.globits.healthdeclaration.HealthDeclarationConstant;
import com.globits.healthdeclaration.dto.PractitionerAndFamilyDto;
import com.globits.healthdeclaration.functiondto.PractitionerAndFamilySearchDto;
import com.globits.healthdeclaration.service.PractitionerAndFamilyService;

@RestController
@RequestMapping("/api/practitionerAndFamily")
public class RestPractitionerAndFamilyController {

	@Autowired
	private PractitionerAndFamilyService service;

	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM })
    @RequestMapping(value = "searchByDto", method = RequestMethod.POST)
    public ResponseEntity<Page<PractitionerAndFamilyDto>> searchByDto(@RequestBody PractitionerAndFamilySearchDto dto) {
        Page<PractitionerAndFamilyDto> result = service.searchByDto(dto);
        return new ResponseEntity<Page<PractitionerAndFamilyDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM })
    @RequestMapping(value = "assignment/{familyId}/{practitionerId}/{type}", method = RequestMethod.GET)
    public ResponseEntity<PractitionerAndFamilyDto> getById(@PathVariable("familyId") UUID familyId, 
    		@PathVariable("practitionerId") UUID practitionerId,
    		@PathVariable("type") Integer type) {
		PractitionerAndFamilyDto result = service.assignment(familyId, practitionerId,type);
        return new ResponseEntity<PractitionerAndFamilyDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM })
    @RequestMapping(value = "updateListFamily", method = RequestMethod.POST)
    public ResponseEntity<List<PractitionerAndFamilyDto>> updateListFamily(@RequestBody PractitionerAndFamilyDto dto) {
        List<PractitionerAndFamilyDto> result = service.updateListFamily(dto.getListFamily(), dto.getPractitionerId(), dto.getType());
        return new ResponseEntity<List<PractitionerAndFamilyDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }
}
