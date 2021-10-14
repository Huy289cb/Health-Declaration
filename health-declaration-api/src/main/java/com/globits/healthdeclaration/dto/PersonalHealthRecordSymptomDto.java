package com.globits.healthdeclaration.dto;

import com.globits.core.dto.BaseObjectDto;
import com.globits.healthdeclaration.domain.PersonalHealthRecordSymptom;

public class PersonalHealthRecordSymptomDto extends BaseObjectDto {

    private PersonalHealthRecordDto record;
    private SymptomDto symptom;
    private Integer type;

    public PersonalHealthRecordSymptomDto(PersonalHealthRecordSymptom entity, Boolean collapse) {
        super();
        if (entity != null) {
            this.id = entity.getId();
            this.type = entity.getType();
            if (entity.getSymptom() != null) {
                this.symptom = new SymptomDto(entity.getSymptom());
            }
            if (collapse) {
                if (entity.getRecord() != null) {
                    this.record = new PersonalHealthRecordDto(entity.getRecord(), false);
                }
            }
        }
    }

    public PersonalHealthRecordSymptomDto() {
    }

    public PersonalHealthRecordDto getRecord() {
        return record;
    }

    public void setRecord(PersonalHealthRecordDto record) {
        this.record = record;
    }

    public SymptomDto getSymptom() {
        return symptom;
    }

    public void setSymptom(SymptomDto symptom) {
        this.symptom = symptom;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }
}
