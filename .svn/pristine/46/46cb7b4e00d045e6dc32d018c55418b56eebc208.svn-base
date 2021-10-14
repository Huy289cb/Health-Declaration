package com.globits.healthdeclaration.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

import com.globits.core.domain.BaseObject;

@Entity
@Table(name = "tbl_practitioner_and_family")
@XmlRootElement
public class PractitionerAndFamily extends BaseObject {

	@OneToOne
	@JoinColumn(name = "practitioner_id")
	private Practitioner practitioner;

	@OneToOne
	@JoinColumn(name = "family_id")
	private Family family;
	
	@Column(name="type")
	private Integer type;

	public Practitioner getPractitioner() {
		return practitioner;
	}

	public void setPractitioner(Practitioner practitioner) {
		this.practitioner = practitioner;
	}

	public Family getFamily() {
		return family;
	}

	public void setFamily(Family family) {
		this.family = family;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

}
