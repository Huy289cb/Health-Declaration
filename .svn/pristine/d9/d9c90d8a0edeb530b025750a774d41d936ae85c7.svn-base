package com.globits.healthdeclaration.rest;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.globits.healthdeclaration.HealthDeclarationConstant;
import com.globits.healthdeclaration.dto.FamilyDto;
import com.globits.healthdeclaration.service.FamilyService;

@RestController
@RequestMapping("/api/family/q5")
public class RestFamilyQ5Controller {
	@Autowired
	private FamilyService familyService;

	@Secured({
			HealthDeclarationConstant.ROLE_ADMIN,
			HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF,
			HealthDeclarationConstant.ROLE_MEDICAL_TEAM,
			HealthDeclarationConstant.ROLE_USER
	})
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public ResponseEntity<FamilyDto> updateQ5(@RequestBody FamilyDto dto, @PathVariable("id") UUID id) {
		FamilyDto result = familyService.saveOrUpdateQ5(dto, id);
		return new ResponseEntity<FamilyDto>(result, (result != null)? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({
			HealthDeclarationConstant.ROLE_ADMIN,
			HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF,
			HealthDeclarationConstant.ROLE_MEDICAL_TEAM,
			HealthDeclarationConstant.ROLE_USER
	})
	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<FamilyDto> save(@RequestBody FamilyDto dto) {
		FamilyDto result = familyService.saveOrUpdate(dto, null);
		return new ResponseEntity<FamilyDto>(result, (result != null)? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
}
