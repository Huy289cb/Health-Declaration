package com.globits.healthdeclaration.domain;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.globits.core.domain.BaseObject;

@Entity
@Table(name = "tbl_hd_health_care_group")
@XmlRootElement
public class HealthCareGroup extends BaseObject{
	private String code;//
	private String name;//
	private String address;//
	private String phoneNumber1;//
	private String phoneNumber2;//
	private String zalo;
	private String faceBook;

	@JsonIgnore
	@OneToMany(mappedBy = "healthCareGroup", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval=true)
	private Set<HealthCareGroupAdministrativeUnit> listHealthCareGroupAdministrativeUnits;//danh sách đơn vị hành chính trực thuộc (quản lý)

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getPhoneNumber1() {
		return phoneNumber1;
	}

	public void setPhoneNumber1(String phoneNumber1) {
		this.phoneNumber1 = phoneNumber1;
	}

	public String getPhoneNumber2() {
		return phoneNumber2;
	}

	public void setPhoneNumber2(String phoneNumber2) {
		this.phoneNumber2 = phoneNumber2;
	}

	public Set<HealthCareGroupAdministrativeUnit> getListHealthCareGroupAdministrativeUnits() {
		return listHealthCareGroupAdministrativeUnits;
	}

	public void setListHealthCareGroupAdministrativeUnits(
			Set<HealthCareGroupAdministrativeUnit> listHealthCareGroupAdministrativeUnits) {
		this.listHealthCareGroupAdministrativeUnits = listHealthCareGroupAdministrativeUnits;
	}

	public String getZalo() {
		return zalo;
	}

	public void setZalo(String zalo) {
		this.zalo = zalo;
	}

	public String getFaceBook() {
		return faceBook;
	}

	public void setFaceBook(String faceBook) {
		this.faceBook = faceBook;
	}

}
