package com.globits.healthdeclaration.dto;

import com.globits.core.dto.BaseObjectDto;
import com.globits.healthdeclaration.domain.Encounter;
import com.globits.healthdeclaration.domain.Symptom;
import com.globits.healthdeclaration.domain.EncounterSymptom;

public class EncounterSymptomDto extends BaseObjectDto{
	private Integer type;
	private EncounterDto encounter;
	private SymptomDto symptom;
	public EncounterSymptomDto() {
		
	}
	
	public EncounterSymptomDto(EncounterSymptom entity) {
		super();
		if(entity != null) {
			this.id = entity.getId();
			this.type = entity.getType();
			if (entity.getEncounter() != null) {
				this.encounter = new EncounterDto(entity.getEncounter());
			}
			if (entity.getSymptom() != null) {
				this.symptom = new SymptomDto(entity.getSymptom());
			}
		}
	}
	
	public EncounterSymptomDto(EncounterSymptom entity, Boolean collapse) {
		super();
		if(entity != null) {
			this.id = entity.getId();
			this.type = entity.getType();
			if (entity.getEncounter() != null) {
				this.encounter = new EncounterDto(entity.getEncounter(), false);
			}
			if (entity.getSymptom() != null) {
				this.symptom = new SymptomDto(entity.getSymptom());
			}
		}
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public EncounterDto getEncounter() {
		return encounter;
	}

	public void setEncounter(EncounterDto encounter) {
		this.encounter = encounter;
	}

	public SymptomDto getSymptom() {
		return symptom;
	}

	public void setSymptom(SymptomDto symptom) {
		this.symptom = symptom;
	}
	
}
