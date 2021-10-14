package com.globits.healthdeclaration.domain;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

import com.globits.core.domain.BaseObject;

@Entity
@Table(name = "tbl_hd_health_care_group_administrative_unit")
@XmlRootElement
public class HealthCareGroupAdministrativeUnit extends BaseObject{
	@ManyToOne
	@JoinColumn(name="health_care_group_id")
	private HealthCareGroup healthCareGroup;

	@OneToOne
	@JoinColumn(name = "administrative_unit_id")
	private HDAdministrativeUnit administrativeUnit;

	public HealthCareGroup getHealthCareGroup() {
		return healthCareGroup;
	}

	public void setHealthCareGroup(HealthCareGroup healthCareGroup) {
		this.healthCareGroup = healthCareGroup;
	}

	public HDAdministrativeUnit getAdministrativeUnit() {
		return administrativeUnit;
	}

	public void setAdministrativeUnit(HDAdministrativeUnit administrativeUnit) {
		this.administrativeUnit = administrativeUnit;
	}

}
