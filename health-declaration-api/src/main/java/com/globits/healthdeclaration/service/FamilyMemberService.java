package com.globits.healthdeclaration.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;

import com.globits.core.service.GenericService;
import com.globits.healthdeclaration.domain.FamilyMember;
import com.globits.healthdeclaration.dto.FamilyMemberDto;
import com.globits.healthdeclaration.functiondto.FamilyMemberSearchDto;
import com.globits.healthdeclaration.functiondto.HealthRecordReportDto;
import com.globits.healthdeclaration.functiondto.ReportResultDto;

public interface FamilyMemberService extends GenericService<FamilyMember, UUID> {

    FamilyMemberDto saveOrUpdate(UUID id, FamilyMemberDto dto);

	FamilyMemberDto registry(UUID id, FamilyMemberDto dto);

	Page<FamilyMemberDto> searchByDto(FamilyMemberSearchDto dto);

	FamilyMemberDto getById(UUID id);

	Boolean deleteById(UUID id, boolean isDeleteHostFamily);

	Integer checkDuplicate(FamilyMemberDto dto);

	ReportResultDto<HealthRecordReportDto> reportSuspectedLevel(UUID communeId, UUID quarterId, UUID townId,
			String groupByType);

	List<FamilyMemberDto> listPatientByAdminUnit(String suspectedLevel, UUID communeId, UUID quarterId, UUID townId);

}
