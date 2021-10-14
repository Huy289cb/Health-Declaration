package com.globits.healthdeclaration.domain;

import java.util.Date;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
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

@Entity
@Table(name = "tbl_personal_health_record")
@XmlRootElement
public class PersonalHealthRecord extends BaseObject {

	@Column(name = "type")	//HealthDeclarationEnumsType.PersonalHealthRecordType
	private Integer type;//1.dân - 2.tổ y tế  3. bác sĩ - nhân viên y tế
    
    @ManyToOne
	@JoinColumn(name = "family_member_id")
	private FamilyMember familyMember;

	@OneToOne
	@JoinColumn(name = "practitioner_id")
	private Practitioner practitioner;	//Bác sĩ - nhân viên y tế

	@OneToOne
	@JoinColumn(name = "medical_team")
	private UserAdministrativeUnit medicalTeam;	//tổ y tế

    @Column(name = "spo2")
    private Integer spo2;

    @Column(name = "breathing_rate")
    private Integer breathingRate;

    @Column(name = "temperature")
    private Integer temperature;

	@Column(name = "systolic_blood_pressure")
	private Float systolicBloodPressure;// huyết áp tâm thu

	@Column(name = "diastolic_blood_pressure")
	private Float diastolicBloodPressure;// huyết áp tâm trương

    @Column(name = "resolve_status")// HealthDeclarationEnumsType.PersonalHealthRecordResolveStatus
    private Integer resolveStatus; //=> Trạng thái xử lý (Không cần xử lý = 0, chưa xử lý = 1, đang xử lý = 2, đã xử lý =3)

    @Column(name = "serius_status")// HealthDeclarationEnumsType.PersonalHealthRecordSeriusStatus
    private Integer seriusStatus;// => 1, 2, 3, 4 (Bình thường, Độ 1, Độ 2, Độ 3, Độ 4)

    @JsonIgnore
	@OneToMany(mappedBy = "record", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval=true)
    @Where(clause = "type = 1")
	private Set<PersonalHealthRecordSymptom> nomalSystoms; // triệu chứng thường gặp

    @JsonIgnore
	@OneToMany(mappedBy = "record", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval=true)
    @Where(clause = "type = 2")
	private Set<PersonalHealthRecordSymptom> severeSymptoms; // triệu chứng nặng

    @Column(name = "contact_person_name")
    private String contactPersonName;

    @Column(name = "contact_person_phone")
    private String contactPersonPhone;

    @Column(name = "contact_person_relation")
    private String contactPersonRelation;

    @Column(name ="declaration_time")
    private Date declarationTime; //ngày giờ khai báo

    @Column(name ="last_record")
    private Boolean lastRecord; //bản ghi cuối

	@Column(name = "make_decision")
	private EncounterMakeDecision makeDecision;// Ra quyết định

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

	@Column(name = "quick_test_date")
	private Date quickTestDate;// Ngày test nhanh

	@Column(name = "pcr_test_date")
	private Date pcrTestDate;// Ngày xét nghiệm PCR

    @ManyToOne
    @JoinColumn(name = "health_organization_id")
    @NotFound(action = NotFoundAction.IGNORE)
    private HealthOrganization healthOrganization; //Đơn vị y tế cấp cứu

    @Column(name = "have_symptom")
    private Boolean haveSymptom; //Có triệu chứng hay không

    @Column(name = "symptom_text")
    private String symptomText; //Triệu chứng cho người dùng nhập bằng tay

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public FamilyMember getFamilyMember() {
		return familyMember;
	}

	public void setFamilyMember(FamilyMember familyMember) {
		this.familyMember = familyMember;
	}

	public Practitioner getPractitioner() {
		return practitioner;
	}

	public void setPractitioner(Practitioner practitioner) {
		this.practitioner = practitioner;
	}

	public UserAdministrativeUnit getMedicalTeam() {
		return medicalTeam;
	}

	public void setMedicalTeam(UserAdministrativeUnit medicalTeam) {
		this.medicalTeam = medicalTeam;
	}

	public Integer getSpo2() {
		return spo2;
	}

	public void setSpo2(Integer spo2) {
		this.spo2 = spo2;
	}

	public Integer getBreathingRate() {
		return breathingRate;
	}

	public void setBreathingRate(Integer breathingRate) {
		this.breathingRate = breathingRate;
	}

	public Integer getTemperature() {
		return temperature;
	}

	public void setTemperature(Integer temperature) {
		this.temperature = temperature;
	}

	public Float getSystolicBloodPressure() {
		return systolicBloodPressure;
	}

	public void setSystolicBloodPressure(Float systolicBloodPressure) {
		this.systolicBloodPressure = systolicBloodPressure;
	}

	public Float getDiastolicBloodPressure() {
		return diastolicBloodPressure;
	}

	public void setDiastolicBloodPressure(Float diastolicBloodPressure) {
		this.diastolicBloodPressure = diastolicBloodPressure;
	}

	public Integer getResolveStatus() {
		return resolveStatus;
	}

	public void setResolveStatus(Integer resolveStatus) {
		this.resolveStatus = resolveStatus;
	}

	public Integer getSeriusStatus() {
		return seriusStatus;
	}

	public void setSeriusStatus(Integer seriusStatus) {
		this.seriusStatus = seriusStatus;
	}

	public Set<PersonalHealthRecordSymptom> getNomalSystoms() {
		return nomalSystoms;
	}

	public void setNomalSystoms(Set<PersonalHealthRecordSymptom> nomalSystoms) {
		this.nomalSystoms = nomalSystoms;
	}

	public Set<PersonalHealthRecordSymptom> getSevereSymptoms() {
		return severeSymptoms;
	}

	public void setSevereSymptoms(Set<PersonalHealthRecordSymptom> severeSymptoms) {
		this.severeSymptoms = severeSymptoms;
	}

	public String getContactPersonName() {
		return contactPersonName;
	}

	public void setContactPersonName(String contactPersonName) {
		this.contactPersonName = contactPersonName;
	}

	public String getContactPersonPhone() {
		return contactPersonPhone;
	}

	public void setContactPersonPhone(String contactPersonPhone) {
		this.contactPersonPhone = contactPersonPhone;
	}

	public String getContactPersonRelation() {
		return contactPersonRelation;
	}

	public void setContactPersonRelation(String contactPersonRelation) {
		this.contactPersonRelation = contactPersonRelation;
	}

	public Date getDeclarationTime() {
		return declarationTime;
	}

	public void setDeclarationTime(Date declarationTime) {
		this.declarationTime = declarationTime;
	}

	public Boolean getLastRecord() {
		return lastRecord;
	}

	public void setLastRecord(Boolean lastRecord) {
		this.lastRecord = lastRecord;
	}

	public EncounterMakeDecision getMakeDecision() {
		return makeDecision;
	}

	public void setMakeDecision(EncounterMakeDecision makeDecision) {
		this.makeDecision = makeDecision;
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

	public Date getQuickTestDate() {
		return quickTestDate;
	}

	public void setQuickTestDate(Date quickTestDate) {
		this.quickTestDate = quickTestDate;
	}

	public Date getPcrTestDate() {
		return pcrTestDate;
	}

	public void setPcrTestDate(Date pcrTestDate) {
		this.pcrTestDate = pcrTestDate;
	}

	public HealthOrganization getHealthOrganization() {
		return healthOrganization;
	}

	public void setHealthOrganization(HealthOrganization healthOrganization) {
		this.healthOrganization = healthOrganization;
	}

	public Boolean getHaveSymptom() {
		return haveSymptom;
	}

	public void setHaveSymptom(Boolean haveSymptom) {
		this.haveSymptom = haveSymptom;
	}

	public String getSymptomText() {
		return symptomText;
	}

	public void setSymptomText(String symptomText) {
		this.symptomText = symptomText;
	}
}
