package com.globits.healthdeclaration.domain;

import java.util.Set;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.globits.core.domain.BaseObject;

@Entity
@Table(name = "tbl_family")
@XmlRootElement
public class Family extends BaseObject {
	
	private String code;//Mã hộ gia đình
	private String name;//họ tên
	private Integer age;//tuổi
	private String phoneNumber;//SĐT
	private String email;
	private String detailAddress; //dia chi chi tiet
	
	@ManyToOne
	@JoinColumn(name = "administrative_unit_id")
	@NotFound(action = NotFoundAction.IGNORE)
	private HDAdministrativeUnit administrativeUnit;// địa chỉ

	@JsonIgnore
	@OneToMany(mappedBy = "family", fetch = FetchType.LAZY)
	private Set<FamilyMember> familyMembers;// thông tin thành viên hộ gia đình

	@JsonIgnore
	@OneToMany(mappedBy = "family", fetch = FetchType.LAZY)
	private Set<PractitionerAndFamily> listPractitioner;// Danh sách nhân viên y tế chăm sóc

	@Column(name="serius_status") //HealthDeclarationEnumsType.PersonalHealthRecordSeriusStatus
	private Integer seriusStatus;

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

	public Integer getAge() {
		return age;
	}

	public void setAge(Integer age) {
		this.age = age;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
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

	public Set<FamilyMember> getFamilyMembers() {
		return familyMembers;
	}

	public void setFamilyMembers(Set<FamilyMember> familyMembers) {
		this.familyMembers = familyMembers;
	}

	public Set<PractitionerAndFamily> getListPractitioner() {
		return listPractitioner;
	}

	public void setListPractitioner(Set<PractitionerAndFamily> listPractitioner) {
		this.listPractitioner = listPractitioner;
	}

	public Integer getSeriusStatus() {
		return seriusStatus;
	}

	public void setSeriusStatus(Integer seriusStatus) {
		this.seriusStatus = seriusStatus;
	}
}
