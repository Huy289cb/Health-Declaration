package com.globits.healthdeclaration.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;

import com.globits.core.service.GenericService;
import com.globits.healthdeclaration.domain.UserAdministrativeUnit;
import com.globits.healthdeclaration.dto.FamilyDto;
import com.globits.healthdeclaration.dto.PractitionerDto;
import com.globits.healthdeclaration.dto.UserAdministrativeUnitDto;
import com.globits.healthdeclaration.functiondto.ForgotPasswordDto;
import com.globits.healthdeclaration.functiondto.RegisterDto;
import com.globits.healthdeclaration.functiondto.UserAdministrativeUnitSearchDto;
import com.globits.healthdeclaration.functiondto.UserInfoDto;
import com.globits.security.domain.User;
import com.globits.security.dto.RoleDto;
import com.globits.security.dto.UserDto;

public interface UserAdministrativeUnitService extends GenericService<UserAdministrativeUnit, UUID> {

	Page<UserAdministrativeUnitDto> searchByDto(UserAdministrativeUnitSearchDto dto);

	UserAdministrativeUnitDto getById(UUID id);

	UserAdministrativeUnitDto saveOrUpdate(UserAdministrativeUnitDto dto, UUID id);

	Boolean deleteById(UUID fromString);

	UserDto getCurrentUserDto();

	User getCurrentUser();

	boolean checkUsername(String username, Long id);

	boolean checkEmail(String email, Long id);

	List<RoleDto> getRoleUser();

	UserInfoDto getAllInfoByUserLogin();

	UserAdministrativeUnitDto getUserOrganizationDtoByUserId(Long id);

	PractitionerDto getPractitionerDtoByUserId(Long id);

	Boolean checkOTP(ForgotPasswordDto dto);

	ForgotPasswordDto checkUsernameAndSendOTP(String phoneNumber);

	Boolean changeForgotPassword(ForgotPasswordDto dto);

	RegisterDto registerUser(FamilyDto dto);

	Boolean deleteAllByPhoneNumber(String phoneNumber);

}
