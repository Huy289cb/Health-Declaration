package com.globits.healthdeclaration.rest;

import com.globits.healthdeclaration.HealthDeclarationConstant;
import com.globits.healthdeclaration.dto.HealthOrganizationDto;
import com.globits.healthdeclaration.functiondto.HealthOrganizationSearchDto;
import com.globits.healthdeclaration.functiondto.SearchDto;
import com.globits.healthdeclaration.service.HealthOrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/health-organization")
public class RestHealthOrganizationController {

    @Autowired
    private HealthOrganizationService service;

    @Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM })
    @RequestMapping(value = "/searchByDto", method = RequestMethod.POST)
    public ResponseEntity<Page<HealthOrganizationDto>> searchByDto(@RequestBody HealthOrganizationSearchDto dto) {
        Page<HealthOrganizationDto> result = service.searchByDto(dto);
        return new ResponseEntity<Page<HealthOrganizationDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    @Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM })
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public ResponseEntity<HealthOrganizationDto> getById(@PathVariable UUID id) {
        HealthOrganizationDto result = service.getById(id);
        return new ResponseEntity<HealthOrganizationDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    @Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM })
    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<HealthOrganizationDto> save(@RequestBody HealthOrganizationDto dto) {
        HealthOrganizationDto result = service.saveOrUpdate(dto, null);
        return new ResponseEntity<HealthOrganizationDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    @Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM })
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<HealthOrganizationDto> update(@RequestBody HealthOrganizationDto dto, @PathVariable("id") UUID id) {
        HealthOrganizationDto result = service.saveOrUpdate(dto, id);
        return new ResponseEntity<HealthOrganizationDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    @Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM })
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Boolean> deleteById(@PathVariable("id") String id) {
        Boolean result = service.deleteById(UUID.fromString(id));
        return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    @Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM })
    @RequestMapping(value = "/checkCode", method = RequestMethod.GET)
    public ResponseEntity<Boolean> checkCode(@RequestParam(value = "id", required = false) UUID id,
                                             @RequestParam("code") String code) {
        Boolean result = service.checkCode(id, code);
        return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }
}
