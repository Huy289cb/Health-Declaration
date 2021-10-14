package com.globits.healthdeclaration.service;

import com.globits.core.service.GenericService;
import com.globits.healthdeclaration.domain.PersonalHealthRecord;
import com.globits.healthdeclaration.dto.PersonalHealthRecordDto;
import com.globits.healthdeclaration.functiondto.HealthRecordReportDto;
import com.globits.healthdeclaration.functiondto.PersonalHealthRecordSearchDto;
import com.globits.healthdeclaration.functiondto.ReportResultDto;
import com.globits.healthdeclaration.functiondto.SearchDto;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface PersonalHealthRecordService extends GenericService<PersonalHealthRecord, UUID> {

    Page<PersonalHealthRecordDto> searchByDto(PersonalHealthRecordSearchDto dto);

    PersonalHealthRecordDto getById(UUID id);

    PersonalHealthRecordDto saveOrUpdate(PersonalHealthRecordDto dto, UUID id);

    Boolean deleteById(UUID id);

//	ReportResultDto<HealthRecordReportDto> getReportByAdminUnit(Integer resolveStatus, Integer seriusStatus, UUID communeId,
//			UUID townId, UUID residentialGroup, String groupByType);

//	List<PersonalHealthRecordDto> getListPatientByAdminUnit(Integer resolveStatus, Integer seriusStatus,
//			Integer seriusLevel, UUID communeId, UUID townId, UUID residentialGroup);

	PersonalHealthRecordDto updateStaus(PersonalHealthRecordDto dto, UUID id);

	ReportResultDto<HealthRecordReportDto> getReportByAdminUnit(Integer resolveStatus, Integer seriusStatus,
			UUID communeId, UUID quarterId, UUID townId, UUID residentialGroup, String groupByType);

	List<PersonalHealthRecordDto> getListPatientByAdminUnit(Integer resolveStatus, Integer seriusStatus,
			Integer seriusLevel, UUID communeId, UUID quarterId, UUID townId, UUID residentialGroup);

//    Boolean checkCode(UUID id, String code);
}
