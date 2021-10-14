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
import com.globits.healthdeclaration.dto.HDAdministrativeUnitDto;
import com.globits.healthdeclaration.functiondto.HDAdministrativeUnitSearchDto;
import com.globits.healthdeclaration.service.HDAdministrativeUnitService;

@RestController
@RequestMapping("/api/administrativeUnit")
public class RestHDAdministrativeUnitsController {

	@Autowired
	HDAdministrativeUnitService service;

	@RequestMapping(value = "searchByDto", method = RequestMethod.POST)
	public ResponseEntity<?> searchByDto(@RequestBody HDAdministrativeUnitSearchDto dto) {
		Page<HDAdministrativeUnitDto> result = service.searchByDto(dto);

		return new ResponseEntity<>(result, result != null ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	@Secured({ HealthDeclarationConstant.ROLE_ADMIN })
	public ResponseEntity<HDAdministrativeUnitDto> getById(@PathVariable UUID id) {
		HDAdministrativeUnitDto result = service.getById(id);
		return new ResponseEntity<HDAdministrativeUnitDto>(result,
				(result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@RequestMapping(value = { "/getAllBasicInEdit", "getAllBasicInEdit/{id}" }, method = RequestMethod.GET)
	public ResponseEntity<List<HDAdministrativeUnitDto>> getAllBasicInEdit(
			@PathVariable(name = "id", required = false) final UUID id) {
		List<HDAdministrativeUnitDto> result = service.getAllBasicInEdit(id);
		return new ResponseEntity<List<HDAdministrativeUnitDto>>(result,
				(result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@RequestMapping(method = RequestMethod.POST)
	@Secured({ HealthDeclarationConstant.ROLE_ADMIN })
	public ResponseEntity<HDAdministrativeUnitDto> save(@RequestBody HDAdministrativeUnitDto dto) {
		HDAdministrativeUnitDto result = service.saveOrUpdate(dto, null);
		return new ResponseEntity<HDAdministrativeUnitDto>(result,
				(result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	@Secured({ HealthDeclarationConstant.ROLE_ADMIN })
	public ResponseEntity<HDAdministrativeUnitDto> update(@RequestBody HDAdministrativeUnitDto dto,
			@PathVariable("id") UUID id) {
		HDAdministrativeUnitDto result = service.saveOrUpdate(dto, id);
		return new ResponseEntity<HDAdministrativeUnitDto>(result,
				(result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	@Secured({ HealthDeclarationConstant.ROLE_ADMIN })
	public ResponseEntity<Boolean> deleteById(@PathVariable("id") String id) {
		Boolean result = service.deleteById(UUID.fromString(id));
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
}
