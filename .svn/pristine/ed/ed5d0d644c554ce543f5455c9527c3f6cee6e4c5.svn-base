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
import com.globits.healthdeclaration.dto.FamilyMemberDto;
import com.globits.healthdeclaration.dto.HealthCareGroupDto;
import com.globits.healthdeclaration.functiondto.HealthCareGroupSearchDto;
import com.globits.healthdeclaration.service.HealthCareGroupService;

@RestController
@RequestMapping("/api/health_care_group")
public class RestHealthCareGroupController {
	@Autowired
	private HealthCareGroupService service;

	@RequestMapping(value = "/searchByDto", method = RequestMethod.POST)
	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_USER })
	public ResponseEntity<Page<HealthCareGroupDto>> searchByDto(@RequestBody HealthCareGroupSearchDto dto) {
		Page<HealthCareGroupDto> result = service.searchByDto(dto);
		return new ResponseEntity<Page<HealthCareGroupDto>>(result,
				(result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM })
	public ResponseEntity<HealthCareGroupDto> getById(@PathVariable UUID id) {
		HealthCareGroupDto result = service.getById(id);
		return new ResponseEntity<HealthCareGroupDto>(result,
				(result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@RequestMapping(method = RequestMethod.POST)
	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM })
	public ResponseEntity<HealthCareGroupDto> save(@RequestBody HealthCareGroupDto dto) {
		HealthCareGroupDto result = service.saveOrUpdate(dto, null);
		return new ResponseEntity<HealthCareGroupDto>(result,
				(result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM })
	public ResponseEntity<HealthCareGroupDto> update(@RequestBody HealthCareGroupDto dto, @PathVariable("id") UUID id) {
		HealthCareGroupDto result = service.saveOrUpdate(dto, id);
		return new ResponseEntity<HealthCareGroupDto>(result,
				(result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM })
	public ResponseEntity<Boolean> deleteById(@PathVariable("id") String id) {
		Boolean result = service.deleteById(UUID.fromString(id));
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_MEDICAL_TEAM })
	@RequestMapping(value = "/checkDuplicate", method = RequestMethod.POST)
	public ResponseEntity<Boolean> checDuplicate(@RequestBody HealthCareGroupDto dto) {
		Boolean result = service.checkDuplicateCode(dto.getId(), dto.getCode());
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
	
	@RequestMapping(value = "/getListHealthCareGroup", method = RequestMethod.POST)
	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_USER })
	public ResponseEntity<List<HealthCareGroupDto>> getListHealthCareGroup(@RequestBody HealthCareGroupSearchDto dto) {
		List<HealthCareGroupDto> result = service.getListHealthCareGroup(dto.getListUnit());
		return new ResponseEntity<List<HealthCareGroupDto>>(result,
				(result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
}
