package com.globits.healthdeclaration.rest;

import java.util.UUID;

import com.globits.healthdeclaration.functiondto.UserInfoDto;
import com.globits.healthdeclaration.service.UserAdministrativeUnitService;
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
import com.globits.healthdeclaration.dto.FamilyDto;
import com.globits.healthdeclaration.functiondto.FamilySearchDto;
import com.globits.healthdeclaration.service.FamilyService;

@RestController
@RequestMapping("/api/family")
public class RestFamilyController {

    @Autowired
    private FamilyService service;

    @Autowired
    private UserAdministrativeUnitService userAdministrativeUnitService;

	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_USER })
	@RequestMapping(value = "/searchByDto", method = RequestMethod.POST)
    public ResponseEntity<Page<FamilyDto>> searchByDto(@RequestBody FamilySearchDto dto) {
        Page<FamilyDto> result = service.searchByDto(dto);
        return new ResponseEntity<Page<FamilyDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }
	
	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_USER })
	@RequestMapping(value = "/searchByPage", method = RequestMethod.POST)
    public ResponseEntity<Page<FamilyDto>> searchByPage(@RequestBody FamilySearchDto dto) {
        Page<FamilyDto> result = service.searchByPage(dto);
        return new ResponseEntity<Page<FamilyDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }


	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_USER })
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public ResponseEntity<FamilyDto> getById(@PathVariable UUID id) {
        FamilyDto result = service.getById(id);
        return new ResponseEntity<FamilyDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_USER })
    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<FamilyDto> save(@RequestBody FamilyDto dto) {
        FamilyDto result = service.saveOrUpdate(dto, null);
        return new ResponseEntity<FamilyDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_USER })
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<FamilyDto> update(@RequestBody FamilyDto dto, @PathVariable("id") UUID id) {
        FamilyDto result = service.saveOrUpdate(dto, id);
        return new ResponseEntity<FamilyDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

	@Secured({ HealthDeclarationConstant.ROLE_ADMIN })
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Boolean> deleteById(@PathVariable("id") String id) {
        Boolean result = service.deleteById(UUID.fromString(id));
        return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_USER })
    @RequestMapping(value = "/getNewCode", method = RequestMethod.GET)
    public ResponseEntity<String> getNewCode() {
    	String result = service.getNewCode();
        return new ResponseEntity<String>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_USER })
    @RequestMapping(value = "/checkDuplicate", method = RequestMethod.GET)
    public ResponseEntity<Boolean> checkCode(@RequestParam(value = "id", required = false) UUID id,
                                             @RequestParam("code") String code, @RequestParam("phoneNumber") String phoneNumber) {
        Boolean result = service.checkDuplicate(id, code, phoneNumber);
        return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_USER })
    @RequestMapping(value = "/getAllInfoByUserLogin", method = RequestMethod.GET)
    public ResponseEntity<UserInfoDto> getAllInfoByUserLogin() {
        UserInfoDto result = userAdministrativeUnitService.getAllInfoByUserLogin();
        return new ResponseEntity<UserInfoDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_USER })
    @RequestMapping(value = "/getFamilyByUserLogin", method = RequestMethod.GET)
    public ResponseEntity<FamilyDto> getFamilyByUserLogin() {
        FamilyDto result = service.getFamilyByUserLogin();
        return new ResponseEntity<FamilyDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }
}
