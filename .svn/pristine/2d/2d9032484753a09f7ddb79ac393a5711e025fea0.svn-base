package com.globits.healthdeclaration.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.globits.healthdeclaration.HealthDeclarationConstant;
import com.globits.healthdeclaration.dto.UserV2Dto;
import com.globits.healthdeclaration.functiondto.UserSearchDto;
import com.globits.healthdeclaration.service.UserV2Service;

@RestController
@RequestMapping("/api/users/v2")
public class RestUserV2Controller {
	@Autowired
	private UserV2Service userV2Service;

	@Secured({
			HealthDeclarationConstant.ROLE_ADMIN
	})
	@PostMapping("/search")
	public ResponseEntity<Page<UserV2Dto>> searchByDto(@RequestBody UserSearchDto dto) {
		Page<UserV2Dto> result = userV2Service.searchByDto(dto);
		return new ResponseEntity<Page<UserV2Dto>>(result,
				(result != null)? HttpStatus.OK : HttpStatus.BAD_REQUEST);
	}

}
