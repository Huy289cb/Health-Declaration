package com.globits.healthdeclaration.rest;

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
import com.globits.healthdeclaration.dto.SymptomDto;
import com.globits.healthdeclaration.functiondto.SymptomSearchDto;
import com.globits.healthdeclaration.service.SymptomService;

@RestController
@RequestMapping("/api/symptom")
public class RestSymptomController {

	@Autowired
	private SymptomService service;

	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_USER })
	@RequestMapping(value = "/searchByDto", method = RequestMethod.POST)
	public ResponseEntity<Page<SymptomDto>> searchByDto(@RequestBody SymptomSearchDto dto) {
		Page<SymptomDto> result = service.searchByDto(dto);
		return new ResponseEntity<Page<SymptomDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM })
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public ResponseEntity<SymptomDto> getById(@PathVariable UUID id) {
		SymptomDto result = service.getById(id);
		return new ResponseEntity<SymptomDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@RequestMapping(method = RequestMethod.POST)
	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM })
	public ResponseEntity<SymptomDto> save(@RequestBody SymptomDto dto) {
		SymptomDto result = service.saveOrUpdate(dto, null);
		return new ResponseEntity<SymptomDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM })
	public ResponseEntity<SymptomDto> update(@RequestBody SymptomDto dto, @PathVariable("id") UUID id) {
		SymptomDto result = service.saveOrUpdate(dto, id);
		return new ResponseEntity<SymptomDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM })
	public ResponseEntity<Boolean> deleteById(@PathVariable("id") String id) {
		Boolean result = service.deleteById(UUID.fromString(id));
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

}
