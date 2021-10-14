package com.globits.healthdeclaration.service;


import java.util.UUID;

import org.springframework.data.domain.Page;

import com.globits.core.service.GenericService;
import com.globits.healthdeclaration.domain.Family;
import com.globits.healthdeclaration.dto.FamilyDto;
import com.globits.healthdeclaration.functiondto.FamilySearchDto;
import com.globits.healthdeclaration.functiondto.RegisterDto;

public interface FamilyService extends GenericService<Family, UUID> {

    Page<FamilyDto> searchByDto(FamilySearchDto dto);

    FamilyDto getById(UUID id);

    FamilyDto saveOrUpdate(FamilyDto dto, UUID id);

    RegisterDto registry(FamilyDto dto);

    Boolean deleteById(UUID fromString);

	String getNewCode();

	Boolean checkDuplicate(UUID id, String code, String phoneNumber);

    FamilyDto getFamilyByUserLogin();

	boolean checkUserName(String phoneNumber);

	RegisterDto checkUserNameRegisterUser(String phoneNumber);

	Page<FamilyDto> searchByPage(FamilySearchDto dto);

	FamilyDto saveOrUpdateQ5(FamilyDto dto, UUID id);

}
