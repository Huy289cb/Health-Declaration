package com.globits.healthdeclaration.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.globits.healthdeclaration.HealthDeclarationConstant;
import com.globits.healthdeclaration.dto.FamilyDto;
import com.globits.healthdeclaration.functiondto.FamilySearchDto;
import com.globits.healthdeclaration.service.FamilyService;

@RestController
@RequestMapping("/api/report")
public class RestReportController {

    @Autowired
    private FamilyService familyService;

	/*
	 * @Secured({ HealthDeclarationConstant.ROLE_ADMIN,
	 * HealthDeclarationConstant.ROLE_USER })
	 * 
	 * @RequestMapping(value = "patientNeedsHelp/searchByDto", method =
	 * RequestMethod.POST) public ResponseEntity<Page<FamilyDto>>
	 * searchByDto(@RequestBody FamilySearchDto dto) { Page<FamilyDto> result =
	 * familyService.searchByDto(dto); return new
	 * ResponseEntity<Page<FamilyDto>>(result, (result != null) ? HttpStatus.OK :
	 * HttpStatus.BAD_REQUEST); }
	 */

}
