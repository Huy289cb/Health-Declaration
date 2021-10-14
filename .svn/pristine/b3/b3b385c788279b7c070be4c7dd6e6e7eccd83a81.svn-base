package com.globits.healthdeclaration.rest;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.globits.healthdeclaration.dto.EncounterDto;
import com.globits.healthdeclaration.functiondto.EncounterSearchDto;
import com.globits.healthdeclaration.service.EncounterService;

@RestController
@RequestMapping("/api/encounter")
public class RestEncounterController {
	@Autowired
	private EncounterService service;

	@RequestMapping(value = "/searchByDto", method = RequestMethod.POST)
	public ResponseEntity<Page<EncounterDto>> searchByDto(@RequestBody EncounterSearchDto dto) {
		Page<EncounterDto> result = service.searchByDto(dto);
		return new ResponseEntity<Page<EncounterDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public ResponseEntity<EncounterDto> getById(@PathVariable UUID id) {
		EncounterDto result = service.getById(id);
		return new ResponseEntity<EncounterDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<EncounterDto> save(@RequestBody EncounterDto dto) {
		EncounterDto result = service.saveOrUpdate(dto, null);
		return new ResponseEntity<EncounterDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public ResponseEntity<EncounterDto> update(@RequestBody EncounterDto dto, @PathVariable("id") UUID id) {
		EncounterDto result = service.saveOrUpdate(dto, id);
		return new ResponseEntity<EncounterDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Boolean> deleteById(@PathVariable("id") String id) {
		Boolean result = service.deleteById(UUID.fromString(id));
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}
}
