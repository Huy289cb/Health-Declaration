package com.globits.healthdeclaration.service.impl;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.globits.core.service.impl.GenericServiceImpl;
import com.globits.healthdeclaration.HealthDeclarationEnumsType;
import com.globits.healthdeclaration.domain.Encounter;
import com.globits.healthdeclaration.domain.EncounterSymptom;
import com.globits.healthdeclaration.domain.FamilyMember;
import com.globits.healthdeclaration.domain.Practitioner;
import com.globits.healthdeclaration.domain.Symptom;
import com.globits.healthdeclaration.dto.EncounterDto;
import com.globits.healthdeclaration.dto.EncounterSymptomDto;
import com.globits.healthdeclaration.functiondto.EncounterSearchDto;
import com.globits.healthdeclaration.repository.EncounterRepository;
import com.globits.healthdeclaration.repository.FamilyMemberRepository;
import com.globits.healthdeclaration.repository.PractitionerRepository;
import com.globits.healthdeclaration.repository.SymptomRepository;
import com.globits.healthdeclaration.service.EncounterService;

@Transactional
@Service
public class EncounterServiceImpl extends GenericServiceImpl<Encounter, UUID> implements EncounterService{
	@Autowired
	private EntityManager manager;

	@Autowired
	public EncounterRepository repository;
	
	@Autowired
    private SymptomRepository symptomRepository;

    @Autowired
    private FamilyMemberRepository familyMemberRepository;

    @Autowired
    private PractitionerRepository practitionerRepository;
    
	@Override
	public Page<EncounterDto> searchByDto(EncounterSearchDto dto) {
		if (dto == null) {
			return null;
		}
		int pageIndex = dto.getPageIndex();
		int pageSize = dto.getPageSize();

		if (pageIndex > 0) {
			pageIndex--;
		} else {
			pageIndex = 0;
		}

		String whereClause = "";
		String orderBy = " ";
		String sqlCount = "select count(entity.id) from Encounter as entity where (1=1) ";
		String sql = "select new com.globits.healthdeclaration.dto.EncounterDto(entity) from Encounter as entity where (1=1) ";

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			whereClause += " AND ( entity.name LIKE :text OR entity.code LIKE :text ) ";
		}

		sql += whereClause + orderBy;
		sqlCount += whereClause;
		Query q = manager.createQuery(sql, EncounterDto.class);
		Query qCount = manager.createQuery(sqlCount);

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			q.setParameter("text", '%' + dto.getText().trim() + '%');
			qCount.setParameter("text", '%' + dto.getText().trim() + '%');
		}
		int startPosition = pageIndex * pageSize;
		q.setFirstResult(startPosition);
		q.setMaxResults(pageSize);
		List<EncounterDto> entities = q.getResultList();
		long count = (long) qCount.getSingleResult();

		Pageable pageable = PageRequest.of(pageIndex, pageSize);
		Page<EncounterDto> result = new PageImpl<EncounterDto>(entities, pageable, count);

		return result;
	}

	@Override
	public EncounterDto getById(UUID id) {
		if (id != null) {
			Encounter entity = repository.getOne(id);
			if (entity != null) {
				return new EncounterDto(entity);
			}
		}
		return null;
	}

	@Override
	public EncounterDto saveOrUpdate(EncounterDto dto, UUID id) {
		if (dto != null && dto.getFamilyMember() != null && dto.getFamilyMember().getId() != null) {
			Encounter entity = null;
			if (id != null) {
				entity = repository.getOne(id);
			}
			if (entity == null) {
				entity = new Encounter();
				entity.setExaminationTime(new Date());
			}
			else {
				entity.setExaminationTime(dto.getExaminationTime());
			}

			entity.setType(dto.getType());
			entity.setUserAdministrativeUnit(dto.getUserAdministrativeUnit());
			entity.setExposureHistory(dto.getExposureHistory());
			entity.setTemperature(dto.getTemperature());
			entity.setBloodPressure(dto.getBloodPressure());
			entity.setBreathingRate(dto.getBreathingRate());
			entity.setSpo2(dto.getSpo2());
			entity.setInitialHandle(dto.getInitialHandle());
			entity.setOtherInformation(dto.getOtherInformation());
			entity.setHaveTest(dto.getHaveTest());
			entity.setHaveQuickTest(dto.getHaveQuickTest());
			entity.setQuickTestResults(dto.getQuickTestResults());
			entity.setHavePCR(dto.getHavePCR());
			entity.setPcrResults(dto.getPcrResults());
			entity.setExposureHistory(dto.getExposureHistory());
			entity.setMakeDecision(dto.getMakeDecision());
			entity.setWeight(dto.getWeight());
			entity.setHeight(dto.getHeight());

			if (dto.getPractitioner() != null && dto.getPractitioner().getId() != null) {
				Practitioner practitioner = practitionerRepository.getOne(dto.getPractitioner().getId());
	            if (practitioner != null && practitioner.getId() != null) {
	                entity.setPractitioner(practitioner);
				}
			}

            FamilyMember familyMember = familyMemberRepository.getOne(dto.getFamilyMember().getId());
            if (familyMember == null || familyMember.getId() == null) {
				return null;
			}
            entity.setFamilyMember(familyMember);
			
			if(dto.getNomalSystoms()!=null && dto.getNomalSystoms().size()>0) {
				Set<EncounterSymptom> normalSet = new HashSet<>();
				for(EncounterSymptomDto esDto : dto.getNomalSystoms()) {
					EncounterSymptom ess = new EncounterSymptom();
					if(esDto.getSymptom() != null && esDto.getSymptom().getId()!=null) {
						Symptom symptom =  symptomRepository.getOne(esDto.getSymptom().getId());
						if(symptom != null) {
							ess.setSymptom(symptom);
							ess.setType(HealthDeclarationEnumsType.SymptomType.type1.getNumber());
							ess.setEncounter(entity);
							normalSet.add(ess);
						}
					}
				}
				
				if(entity.getNomalSystoms() == null) {
					entity.setNomalSystoms(normalSet);
				} else {
					entity.getNomalSystoms().clear();
					entity.getNomalSystoms().addAll(normalSet);
				}
			} else if(entity.getNomalSystoms() != null) {
				entity.getNomalSystoms().clear();
			}
			if(dto.getSevereSymptoms()!=null && dto.getSevereSymptoms().size()>0) {
				Set<EncounterSymptom> severeSet = new HashSet<>();
				for(EncounterSymptomDto esDto : dto.getSevereSymptoms()) {
					EncounterSymptom ess = new EncounterSymptom();
					if(esDto.getSymptom() != null && esDto.getSymptom().getId()!=null) {
						Symptom symptom =  symptomRepository.getOne(esDto.getSymptom().getId());
						if(symptom != null) {
							ess.setSymptom(symptom);
							ess.setType(HealthDeclarationEnumsType.SymptomType.type2.getNumber());
							ess.setEncounter(entity);
							severeSet.add(ess);
						}
					}
				}
				if(entity.getSevereSymptoms() == null) {
					entity.setSevereSymptoms(severeSet);
				} else {
					entity.getSevereSymptoms().clear();
					entity.getSevereSymptoms().addAll(severeSet);
				}
			} else if(entity.getSevereSymptoms() != null) {
				entity.getNomalSystoms().clear();
			}
			entity = repository.save(entity);
			if (entity != null) {
				return new EncounterDto(entity);
			}
		}
		return null;
	}

	@Override
	public Boolean deleteById(UUID id) {
		if (id != null) {
			Encounter entity = repository.getOne(id);
			if (entity != null) {
				repository.deleteById(id);
				return true;
			}
		}
		return false;
	}
}
