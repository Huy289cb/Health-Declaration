package com.globits.healthdeclaration.domain;

import java.math.BigDecimal;
import java.util.Date;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;
import org.hibernate.annotations.Where;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.globits.core.domain.BaseObject;
import com.globits.healthdeclaration.HealthDeclarationEnumsType.EncounterMakeDecision;
import com.globits.healthdeclaration.HealthDeclarationEnumsType.EncounterType;

@Entity
@Table(name = "tbl_encounter")
@XmlRootElement
public class Encounter extends BaseObject {

	@OneToOne
	@JoinColumn(name = "practitioner_id")
	private Practitioner practitioner;

	@ManyToOne
	@JoinColumn(name = "family_member_id")
	private FamilyMember familyMember;

	@Column(name = "type", nullable = true)
	@Enumerated(value = EnumType.STRING)
	private EncounterType type;

	@ManyToOne
	@JoinColumn(name = "user_administrative_unit_id")
	@NotFound(action = NotFoundAction.IGNORE)
	private UserAdministrativeUnit userAdministrativeUnit;

	@Column(name = "examination_time")
	private Date examinationTime;// Thời gian khám

	@Column(name = "exposure_history")
	private String exposureHistory;// tiền sử tiếp xúc F0

	private Float temperature;// Nhiệt độ

	@Column(name = "blood_pressure")
	private Float bloodPressure;// huyết áp

	@Column(name = "breathing_rate")
	private Float breathingRate;// huyết áp

    @Column(name="weight")
    private Float weight;//Cân nặng
    
    @Column(name="height")
    private Float height;//Chiều cao

	@Column(name = "spo2")
	private BigDecimal spo2;

	@Column(name = "initial_handle")
	private String initialHandle;// xử lý ban đầu (tạm thời để string)

	@Column(name = "other_information")
	private String otherInformation;// Thông tin khác

	@Column(name = "have_test")
	private Boolean haveTest;// Có xét nghiệm hay không

	@Column(name = "have_quick_test")
	private Boolean haveQuickTest;// Có test nhanh hay không

	@Column(name = "quick_test_results")
	private Integer quickTestResults;// Kết quả test nhanh

	@Column(name = "have_pcr")
	private Boolean havePCR;// Có xét nghiệm hay không

	@Column(name = "pcr_results")
	private Integer pcrResults;// Kết quả xét nghiệm PCR

	@Column(name = "make_decision")
	private EncounterMakeDecision makeDecision;// Ra quyết định

	@JsonIgnore
	@OneToMany(mappedBy = "encounter", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
	@Where(clause = "type = 1")
	private Set<EncounterSymptom> nomalSystoms; // triệu chứng thường gặp

	@JsonIgnore
	@OneToMany(mappedBy = "encounter", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
	@Where(clause = "type = 2")
	private Set<EncounterSymptom> severeSymptoms; // triệu chứng nặng

	public Practitioner getPractitioner() {
		return practitioner;
	}

	public void setPractitioner(Practitioner practitioner) {
		this.practitioner = practitioner;
	}

	public FamilyMember getFamilyMember() {
		return familyMember;
	}

	public void setFamilyMember(FamilyMember familyMember) {
		this.familyMember = familyMember;
	}

	public EncounterType getType() {
		return type;
	}

	public void setType(EncounterType type) {
		this.type = type;
	}

	public UserAdministrativeUnit getUserAdministrativeUnit() {
		return userAdministrativeUnit;
	}

	public void setUserAdministrativeUnit(UserAdministrativeUnit userAdministrativeUnit) {
		this.userAdministrativeUnit = userAdministrativeUnit;
	}

	public Date getExaminationTime() {
		return examinationTime;
	}

	public void setExaminationTime(Date examinationTime) {
		this.examinationTime = examinationTime;
	}

	public String getExposureHistory() {
		return exposureHistory;
	}

	public void setExposureHistory(String exposureHistory) {
		this.exposureHistory = exposureHistory;
	}

	public Float getTemperature() {
		return temperature;
	}

	public void setTemperature(Float temperature) {
		this.temperature = temperature;
	}

	public Float getBloodPressure() {
		return bloodPressure;
	}

	public void setBloodPressure(Float bloodPressure) {
		this.bloodPressure = bloodPressure;
	}

	public Float getBreathingRate() {
		return breathingRate;
	}

	public void setBreathingRate(Float breathingRate) {
		this.breathingRate = breathingRate;
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

	public BigDecimal getSpo2() {
		return spo2;
	}

	public void setSpo2(BigDecimal spo2) {
		this.spo2 = spo2;
	}

	public String getInitialHandle() {
		return initialHandle;
	}

	public void setInitialHandle(String initialHandle) {
		this.initialHandle = initialHandle;
	}

	public String getOtherInformation() {
		return otherInformation;
	}

	public void setOtherInformation(String otherInformation) {
		this.otherInformation = otherInformation;
	}

	public Boolean getHaveTest() {
		return haveTest;
	}

	public void setHaveTest(Boolean haveTest) {
		this.haveTest = haveTest;
	}

	public Boolean getHaveQuickTest() {
		return haveQuickTest;
	}

	public void setHaveQuickTest(Boolean haveQuickTest) {
		this.haveQuickTest = haveQuickTest;
	}

	public Integer getQuickTestResults() {
		return quickTestResults;
	}

	public void setQuickTestResults(Integer quickTestResults) {
		this.quickTestResults = quickTestResults;
	}

	public Boolean getHavePCR() {
		return havePCR;
	}

	public void setHavePCR(Boolean havePCR) {
		this.havePCR = havePCR;
	}

	public Integer getPcrResults() {
		return pcrResults;
	}

	public void setPcrResults(Integer pcrResults) {
		this.pcrResults = pcrResults;
	}

	public EncounterMakeDecision getMakeDecision() {
		return makeDecision;
	}

	public void setMakeDecision(EncounterMakeDecision makeDecision) {
		this.makeDecision = makeDecision;
	}

	public Set<EncounterSymptom> getNomalSystoms() {
		return nomalSystoms;
	}

	public void setNomalSystoms(Set<EncounterSymptom> nomalSystoms) {
		this.nomalSystoms = nomalSystoms;
	}

	public Set<EncounterSymptom> getSevereSymptoms() {
		return severeSymptoms;
	}

	public void setSevereSymptoms(Set<EncounterSymptom> severeSymptoms) {
		this.severeSymptoms = severeSymptoms;
	}
}
