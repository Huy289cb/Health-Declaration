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

import com.globits.healthdeclaration.dto.SampleDto;
import com.globits.healthdeclaration.functiondto.SampleSearchDto;
import com.globits.healthdeclaration.service.SampleService;

@RestController
@RequestMapping("/api/box")
public class RestSampleController {

	@Autowired
	private SampleService service;

	@RequestMapping(value = "searchByDto", method = RequestMethod.POST)
	public ResponseEntity<Page<SampleDto>> searchByDto(@RequestBody SampleSearchDto dto) {
		Page<SampleDto> result = service.searchByDto(dto);
		return new ResponseEntity<Page<SampleDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public ResponseEntity<SampleDto> getById(@PathVariable UUID id) {
		SampleDto result = service.getById(id);
		return new ResponseEntity<SampleDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<SampleDto> save(@RequestBody SampleDto dto) {
		SampleDto result = service.saveOrUpdate(dto, null);
		return new ResponseEntity<SampleDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public ResponseEntity<SampleDto> update(@RequestBody SampleDto dto, @PathVariable("id") UUID id) {
		SampleDto result = service.saveOrUpdate(dto, id);
		return new ResponseEntity<SampleDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Boolean> deleteById(@PathVariable("id") String id) {
		Boolean result = service.deleteById(UUID.fromString(id));
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

}
