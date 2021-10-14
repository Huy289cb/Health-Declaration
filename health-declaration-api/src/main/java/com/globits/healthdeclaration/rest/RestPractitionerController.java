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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.globits.healthdeclaration.HealthDeclarationConstant;
import com.globits.healthdeclaration.dto.PractitionerDto;
import com.globits.healthdeclaration.functiondto.PractitionerSearchDto;
import com.globits.healthdeclaration.service.PractitionerService;

@RestController
@RequestMapping("/api/practitioner")
public class RestPractitionerController {

	@Autowired
	private PractitionerService service;

	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF })
	@RequestMapping(value = "searchByDto", method = RequestMethod.POST)
	public ResponseEntity<Page<PractitionerDto>> searchByDto(@RequestBody PractitionerSearchDto dto) {
		Page<PractitionerDto> result = service.searchByDto(dto);
		return new ResponseEntity<Page<PractitionerDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF })
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public ResponseEntity<PractitionerDto> getById(@PathVariable UUID id) {
		PractitionerDto result = service.getById(id);
		return new ResponseEntity<PractitionerDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF })
	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<PractitionerDto> save(@RequestBody PractitionerDto dto) {
		PractitionerDto result = service.saveOrUpdate(dto, null);
		return new ResponseEntity<PractitionerDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF })
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public ResponseEntity<PractitionerDto> update(@RequestBody PractitionerDto dto, @PathVariable("id") UUID id) {
		PractitionerDto result = service.saveOrUpdate(dto, id);
		return new ResponseEntity<PractitionerDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_MEDICAL_TEAM })
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Boolean> deleteById(@PathVariable("id") String id) {
		Boolean result = service.deleteById(UUID.fromString(id));
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF })
    @RequestMapping(value = "/checkDuplicateUserName", method = RequestMethod.GET)
    public ResponseEntity<Boolean> checkDuplicateUserName(@RequestParam(value = "id", required = false) UUID id,
                                             @RequestParam("username") String username) {
		boolean result = service.checkDuplicateUserName(id, username);
        return new ResponseEntity<Boolean>(result, HttpStatus.OK);
    }


}
