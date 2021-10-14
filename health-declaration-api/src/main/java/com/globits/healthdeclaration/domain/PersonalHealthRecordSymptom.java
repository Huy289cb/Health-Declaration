package com.globits.healthdeclaration.domain;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;

import com.globits.core.domain.BaseObject;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

@Entity
@Table(name = "tbl_personal_health_record_symptom")
@XmlRootElement
public class PersonalHealthRecordSymptom extends BaseObject {

    @ManyToOne
	@JoinColumn(name = "personal_health_record")
	@NotFound(action = NotFoundAction.IGNORE)
	private PersonalHealthRecord record;

    @ManyToOne
	@JoinColumn(name = "symptom_id")
	@NotFound(action = NotFoundAction.IGNORE)
	private Symptom symptom;

    @Column(name = "type")
    private Integer type;

    public PersonalHealthRecord getRecord() {
        return record;
    }

    public void setRecord(PersonalHealthRecord record) {
        this.record = record;
    }

    public Symptom getSymptom() {
        return symptom;
    }

    public void setSymptom(Symptom symptom) {
        this.symptom = symptom;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }
}
