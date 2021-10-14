package com.globits.healthdeclaration.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

import com.globits.core.domain.Person;

@Entity
@Table(name = "tbl_practitioner")
@XmlRootElement
public class Practitioner extends Person {

    @Column(name="age")
    private Integer age;//tuổi

    @Column(name="occupation")	//HealthDeclarationEnumsType.PractitionerOccupation
    private Integer occupation;//nghề nghiệp 
    
    @Column(name="work_place")
    private String workPlace;//Nơi làm việc - công tác

    @Column(name="detail_address")
    private String detailAddress;//đia chỉ

	@OneToOne
	@JoinColumn(name = "administrative_unit_id")
	private HDAdministrativeUnit administrativeUnit;

	@OneToOne
	@JoinColumn(name = "health_care_group_id")
	private HealthCareGroup healthCareGroup;

	private String zalo;

	private Integer type; //1 = từ xa, 2 = tại chỗ;

	public Integer getAge() {
		return age;
	}

	public void setAge(Integer age) {
		this.age = age;
	}

	public Integer getOccupation() {
		return occupation;
	}

	public void setOccupation(Integer occupation) {
		this.occupation = occupation;
	}

	public String getWorkPlace() {
		return workPlace;
	}

	public void setWorkPlace(String workPlace) {
		this.workPlace = workPlace;
	}

	public String getDetailAddress() {
		return detailAddress;
	}

	public void setDetailAddress(String detailAddress) {
		this.detailAddress = detailAddress;
	}

	public HDAdministrativeUnit getAdministrativeUnit() {
		return administrativeUnit;
	}

	public void setAdministrativeUnit(HDAdministrativeUnit administrativeUnit) {
		this.administrativeUnit = administrativeUnit;
	}

	public HealthCareGroup getHealthCareGroup() {
		return healthCareGroup;
	}

	public void setHealthCareGroup(HealthCareGroup healthCareGroup) {
		this.healthCareGroup = healthCareGroup;
	}

	public String getZalo() {
		return zalo;
	}

	public void setZalo(String zalo) {
		this.zalo = zalo;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}
}
