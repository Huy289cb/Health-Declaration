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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.globits.healthdeclaration.HealthDeclarationConstant;
import com.globits.healthdeclaration.dto.UserAdministrativeUnitDto;
import com.globits.healthdeclaration.functiondto.UserAdministrativeUnitSearchDto;
import com.globits.healthdeclaration.functiondto.UserInfoDto;
import com.globits.healthdeclaration.service.UserAdministrativeUnitService;
import com.globits.security.dto.RoleDto;
import com.globits.security.dto.UserDto;
import com.globits.security.service.UserService;

@RestController
@RequestMapping("/api/userAdministrativeUnit")
public class RestUserAdministrativeUnitController {

	@Autowired
	private UserAdministrativeUnitService service;

	@Autowired
	private UserService userService;

	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_USER })
	@RequestMapping(value = "/searchByDto", method = RequestMethod.POST)
	public ResponseEntity<Page<UserAdministrativeUnitDto>> searchByDto(
			@RequestBody UserAdministrativeUnitSearchDto dto) {
		Page<UserAdministrativeUnitDto> result = service.searchByDto(dto);
		return new ResponseEntity<Page<UserAdministrativeUnitDto>>(result,
				(result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_USER })
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public ResponseEntity<UserAdministrativeUnitDto> getById(@PathVariable UUID id) {
		UserAdministrativeUnitDto result = service.getById(id);
		return new ResponseEntity<UserAdministrativeUnitDto>(result,
				(result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF })
	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<UserAdministrativeUnitDto> save(@RequestBody UserAdministrativeUnitDto dto) {
		UserAdministrativeUnitDto result = service.saveOrUpdate(dto, null);
		return new ResponseEntity<UserAdministrativeUnitDto>(result,
				(result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF })
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public ResponseEntity<UserAdministrativeUnitDto> update(@RequestBody UserAdministrativeUnitDto dto,
			@PathVariable("id") UUID id) {
		UserAdministrativeUnitDto result = service.saveOrUpdate(dto, id);
		return new ResponseEntity<UserAdministrativeUnitDto>(result,
				(result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF })
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Boolean> deleteById(@PathVariable("id") String id) {
		Boolean result = service.deleteById(UUID.fromString(id));
		return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_USER })
	@RequestMapping(value = "/check-email", method = RequestMethod.POST)
	public boolean checkEmail(@RequestBody UserAdministrativeUnitDto dto) {
		boolean result = true;
		result = service.checkEmail(dto.getUser().getEmail(), dto.getUser().getId());
		return result;
	}

	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_USER })
	@RequestMapping(value = "/check-username", method = RequestMethod.POST)
	public boolean checkUsername(@RequestBody UserAdministrativeUnitDto dto) {
		boolean result = true;
		result = service.checkUsername(dto.getUser().getUsername(), dto.getUser().getId());
		return result;
	}

	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_USER })
    @RequestMapping(value = "/getRoleUser", method = RequestMethod.GET)
    public ResponseEntity<List<RoleDto>> getRoleUser() {
    	List<RoleDto> result = service.getRoleUser();
        return new ResponseEntity<List<RoleDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }
	
	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_USER })
	@RequestMapping(value = "/getUserByUsername", method = RequestMethod.GET)
	public UserDto findByUsername(@RequestParam(value = "username", required = true) String username) {
		if (username == null) {
			return null;
		}
		return userService.findByUsername(username);
	}

	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_USER })
	@RequestMapping(value = "/getUserByEmail", method = RequestMethod.GET)
	public UserDto findByEmail(@RequestParam(value = "email", required = true) String email) {
		if (email == null) {
			return null;
		}
		return userService.findByEmail(email);
	}

	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_USER })
    @RequestMapping(value = "/getAllInfoByUserLogin", method = RequestMethod.GET)
    public ResponseEntity<UserInfoDto> getAllInfoByUserLogin() {
		UserInfoDto result = service.getAllInfoByUserLogin();
        return new ResponseEntity<UserInfoDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

	@Secured({ HealthDeclarationConstant.ROLE_ADMIN})
    @RequestMapping(value = "/deleteAllByPhoneNumber/{phoneNumber}", method = RequestMethod.GET)
    public ResponseEntity<Boolean> deleteAllByPhoneNumber(@PathVariable("phoneNumber") String phoneNumber) {
		Boolean result = service.deleteAllByPhoneNumber(phoneNumber);
        return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }
}
