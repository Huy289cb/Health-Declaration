package com.globits.healthdeclaration.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;

import com.globits.core.service.GenericService;
import com.globits.healthdeclaration.domain.HDAdministrativeUnit;
import com.globits.healthdeclaration.dto.HDAdministrativeUnitDto;
import com.globits.healthdeclaration.functiondto.HDAdministrativeUnitImportExcel;
import com.globits.healthdeclaration.functiondto.HDAdministrativeUnitSearchDto;

public interface HDAdministrativeUnitService extends GenericService<HDAdministrativeUnit, UUID>{
	
	List<UUID> getAllHDAdministrativeUnitIdByParentId(UUID administrativeUnitId);
	//hàm này chỉ lấy thằng con, ko lấy thằng cha
	List<UUID> getAllChildIdByParentId(UUID parentId);

	List<HDAdministrativeUnit> getAllChildByParentId(UUID parentId);

	List<HDAdministrativeUnitDto> getAllChildByParentId(UUID parentId, String prefix);

	HDAdministrativeUnitDto getById(UUID id);

	HDAdministrativeUnitDto saveOrUpdate(HDAdministrativeUnitDto dto, UUID id);

	Boolean deleteById(UUID id);

	List<HDAdministrativeUnitDto> getAll();

	List<HDAdministrativeUnitDto> getAllBasic();

	List<HDAdministrativeUnitDto> getAllBasicInEdit(UUID id);

	void saveOrUpdateList(List<HDAdministrativeUnitDto> listFmsAdministrativeUnit);

    Page<HDAdministrativeUnitDto> searchByDto(HDAdministrativeUnitSearchDto dto);
    
	List<HDAdministrativeUnitDto> importExcel(List<HDAdministrativeUnitImportExcel> dtos);
}
