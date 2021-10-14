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
import com.globits.healthdeclaration.dto.BackgroundDiseaseDto;
import com.globits.healthdeclaration.functiondto.BackgroundDiseaseSearchDto;
import com.globits.healthdeclaration.service.BackgroundDiseaseService;

@RestController
@RequestMapping("/api/background_disease")
public class RestBackgroundDiseaseController {

	@Autowired
	private BackgroundDiseaseService service;

	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_USER })
	@RequestMapping(value = "/searchByDto", method = RequestMethod.POST)
	public ResponseEntity<Page<BackgroundDiseaseDto>> searchByDto(@RequestBody BackgroundDiseaseSearchDto dto) {
		Page<BackgroundDiseaseDto> result = service.searchByDto(dto);
		return new ResponseEntity<Page<BackgroundDiseaseDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM })
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public ResponseEntity<BackgroundDiseaseDto> getById(@PathVariable UUID id) {
		BackgroundDiseaseDto result = service.getById(id);
		return new ResponseEntity<BackgroundDiseaseDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@RequestMapping(method = RequestMethod.POST)
	@Secured({ HealthDeclarationConstant.ROLE_ADMIN })
	public ResponseEntity<BackgroundDiseaseDto> save(@RequestBody BackgroundDiseaseDto dto) {
		BackgroundDiseaseDto result = service.saveOrUpdate(dto, null);
		return new ResponseEntity<BackgroundDiseaseDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	@Secured({ HealthDeclarationConstant.ROLE_ADMIN })
	public ResponseEntity<BackgroundDiseaseDto> update(@RequestBody BackgroundDiseaseDto dto, @PathVariable("id") UUID id) {
		BackgroundDiseaseDto result = service.saveOrUpdate(dto, id);
		return new ResponseEntity<BackgroundDiseaseDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	@Secured({ HealthDeclarationConstant.ROLE_ADMIN })
	public ResponseEntity<Boolean> deleteById(@PathVariable("id") String id) {
		Boolean result = service.deleteById(UUID.fromString(id));
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
}
