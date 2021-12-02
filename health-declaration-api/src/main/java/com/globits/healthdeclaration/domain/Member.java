package com.globits.healthdeclaration.domain;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.globits.core.domain.Person;

@Entity
@Table(name = "tbl_member")
@XmlRootElement
public class Member extends Person {

    @Column(name="detail_address")
    private String detailAddress;//đia chỉ chi tiết

    @Column(name="age")
    private Integer age;//tuổi

    @Column(name="weight")
    private Float weight;//Cân nặng
    
    @Column(name="height")
    private Float height;//Chiều cao
    
    @Column(name="email")
    private String email;//email
    
    @Column(name="have_background_disease")
    private Boolean haveBackgroundDisease;//Có bệnh nền

    @Column(name="is_pregnant")
    private Boolean isPregnant;//Có mang thai

    @Column(name="health_insurance_card_number")
    private String healthInsuranceCardNumber;//Số thẻ bảo hiểm y tế
    
    @Column(name="id_card_number")
    private String idCardNumber;//Số CMND, CCCD

    @Column(name="anamnesis")
    private String anamnesis;//tiền sử bệnh
    
	@Column(name="suspected_level")
	private String suspectedLevel; //Cấp độ nghi nhiễm:BÌnh thường, F0, F1
    
	@JsonIgnore
	@OneToMany(mappedBy = "member", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval=true)
	private Set<MemberBackgroundDisease> listBackgroundDisease;//danh sách bệnh nền (tiền sử bệnh)

	@Column(name="note_background_diseases")
	private String noteBackgroundDiseases;//Ghi chú tình trạng bệnh nền

	public String getNoteBackgroundDiseases() {
		return noteBackgroundDiseases;
	}

	public void setNoteBackgroundDiseases(String noteBackgroundDiseases) {
		this.noteBackgroundDiseases = noteBackgroundDiseases;
	}

	public String getDetailAddress() {
		return detailAddress;
	}

	public void setDetailAddress(String detailAddress) {
		this.detailAddress = detailAddress;
	}

	public Integer getAge() {
		return age;
	}

	public void setAge(Integer age) {
		this.age = age;
	}

	public Float getWeight() {
		return weight;
	}

	public void setWeight(Float weight) {
		this.weight = weight;
	}

	public Float getHeight() {
		return height;
	}

	public void setHeight(Float height) {
		this.height = height;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Boolean getHaveBackgroundDisease() {
		return haveBackgroundDisease;
	}

	public void setHaveBackgroundDisease(Boolean haveBackgroundDisease) {
		this.haveBackgroundDisease = haveBackgroundDisease;
	}

	public Boolean getIsPregnant() {
		return isPregnant;
	}

	public void setIsPregnant(Boolean isPregnant) {
		this.isPregnant = isPregnant;
	}

	public String getHealthInsuranceCardNumber() {
		return healthInsuranceCardNumber;
	}

	public void setHealthInsuranceCardNumber(String healthInsuranceCardNumber) {
		this.healthInsuranceCardNumber = healthInsuranceCardNumber;
	}

	public String getIdCardNumber() {
		return idCardNumber;
	}

	public void setIdCardNumber(String idCardNumber) {
		this.idCardNumber = idCardNumber;
	}

	public String getAnamnesis() {
		return anamnesis;
	}

	public void setAnamnesis(String anamnesis) {
		this.anamnesis = anamnesis;
	}

	public Set<MemberBackgroundDisease> getListBackgroundDisease() {
		return listBackgroundDisease;
	}

	public void setListBackgroundDisease(Set<MemberBackgroundDisease> listBackgroundDisease) {
		this.listBackgroundDisease = listBackgroundDisease;
	}

	public String getSuspectedLevel() {
		return suspectedLevel;
	}

	public void setSuspectedLevel(String suspectedLevel) {
		this.suspectedLevel = suspectedLevel;
	}
}
