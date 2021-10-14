package com.globits.healthdeclaration.service;

import java.util.UUID;

import org.springframework.data.domain.Page;

import com.globits.core.service.GenericService;
import com.globits.healthdeclaration.domain.Sample;
import com.globits.healthdeclaration.dto.SampleDto;
import com.globits.healthdeclaration.functiondto.SampleSearchDto;

public interface SampleService extends GenericService<Sample, UUID> {

	Page<SampleDto> searchByDto(SampleSearchDto dto);

	SampleDto saveOrUpdate(SampleDto dto, UUID id);

	SampleDto getById(UUID id);

	Boolean deleteById(UUID id);

	SampleDto getByCode(String code);

}
