package com.globits.healthdeclaration.service.impl;

import com.globits.core.domain.Person;
import com.globits.core.service.impl.GenericServiceImpl;
import com.globits.healthdeclaration.domain.*;
import com.globits.healthdeclaration.dto.FamilyMemberDto;
import com.globits.healthdeclaration.dto.PersonalHealthRecordSymptomDto;
import com.globits.healthdeclaration.repository.PersonalHealthRecordRepository;
import com.globits.healthdeclaration.repository.PersonalHealthRecordSymptomRepository;
import com.globits.healthdeclaration.repository.SymptomRepository;
import com.globits.healthdeclaration.service.PersonalHealthRecordSymptomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;
import java.util.UUID;

@Transactional
@Service
public class PersonalHealthRecordSymptomServiceImpl extends GenericServiceImpl<PersonalHealthRecordSymptom, UUID> implements PersonalHealthRecordSymptomService{

    @Autowired
    private EntityManager manager;

    @Autowired
    private PersonalHealthRecordSymptomRepository repository;

    @Autowired
    private PersonalHealthRecordRepository personalHealthRecordRepository;

    @Autowired
    private SymptomRepository symptomRepository;

    @Override
    public PersonalHealthRecordSymptomDto saveOrUpdate(UUID id, PersonalHealthRecordSymptomDto dto) {
        if (dto != null) {
            PersonalHealthRecordSymptom entity = null;

            if (dto.getRecord() != null && dto.getRecord().getId() != null) {
                PersonalHealthRecord personalHealthRecord = personalHealthRecordRepository.getOne(dto.getRecord().getId());
                entity.setRecord(personalHealthRecord);
            }

            if (dto.getSymptom() != null && dto.getSymptom().getId() != null) {
                Symptom symptom = symptomRepository.getOne(dto.getSymptom().getId());
                entity.setSymptom(symptom);
            }

            entity = repository.save(entity);
            if (entity != null) {
                return new PersonalHealthRecordSymptomDto(entity, true);
            }
        }
        return null;
    }
}
