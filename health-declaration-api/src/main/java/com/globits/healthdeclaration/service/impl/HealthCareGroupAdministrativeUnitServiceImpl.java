package com.globits.healthdeclaration.service.impl;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import com.globits.healthdeclaration.domain.*;
import com.globits.healthdeclaration.dto.BackgroundDiseaseDto;
import com.globits.healthdeclaration.dto.FamilyDto;
import com.globits.healthdeclaration.dto.MemberBackgroundDiseaseDto;
import com.globits.healthdeclaration.dto.HealthCareGroupAdministrativeUnitDto;
import com.globits.healthdeclaration.repository.BackgroundDiseaseRepository;
import com.globits.healthdeclaration.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.globits.core.domain.Person;
import com.globits.core.repository.PersonRepository;
import com.globits.core.service.impl.GenericServiceImpl;
import com.globits.healthdeclaration.dto.HealthCareGroupAdministrativeUnitDto;
import com.globits.healthdeclaration.functiondto.HealthCareGroupAdministrativeUnitSearchDto;
import com.globits.healthdeclaration.repository.HealthCareGroupAdministrativeUnitRepository;
import com.globits.healthdeclaration.repository.FamilyRepository;
import com.globits.healthdeclaration.service.HealthCareGroupAdministrativeUnitService;

@Transactional
@Service
public class HealthCareGroupAdministrativeUnitServiceImpl extends GenericServiceImpl<HealthCareGroupAdministrativeUnit, UUID> implements HealthCareGroupAdministrativeUnitService{
	 @Autowired
	    private EntityManager manager;

	    @Autowired
	    private HealthCareGroupAdministrativeUnitRepository repository;

		@Override
		public HealthCareGroupAdministrativeUnitDto saveOrUpdate(UUID id, HealthCareGroupAdministrativeUnitDto dto) {
			if (dto != null) {
				HealthCareGroupAdministrativeUnit entity = null;
				if (id != null) {
					entity = repository.getOne(id);
				}
				if (entity == null) {
					entity = new HealthCareGroupAdministrativeUnit();
				}

				
				entity = repository.save(entity);
				if (entity != null) {
					return new HealthCareGroupAdministrativeUnitDto(entity);
				}
			}
			return null;
		}

}
