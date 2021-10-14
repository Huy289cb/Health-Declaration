package com.globits.healthdeclaration.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.globits.core.domain.BaseObject;

@Entity
@Table(name = "tbl_encounter_symptom")
@XmlRootElement
public class EncounterSymptom extends BaseObject {

    @Column(name = "type")
    private Integer type;

    @ManyToOne
	@JoinColumn(name = "encounter_id")
	@NotFound(action = NotFoundAction.IGNORE)
	private Encounter encounter;

    @ManyToOne
	@JoinColumn(name = "symptom_id")
	@NotFound(action = NotFoundAction.IGNORE)
	private Symptom symptom;

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public Encounter getEncounter() {
		return encounter;
	}

	public void setEncounter(Encounter encounter) {
		this.encounter = encounter;
	}

	public Symptom getSymptom() {
		return symptom;
	}

	public void setSymptom(Symptom symptom) {
		this.symptom = symptom;
	}
    
}
