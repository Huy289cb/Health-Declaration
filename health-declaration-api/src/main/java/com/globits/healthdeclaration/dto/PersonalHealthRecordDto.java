package com.globits.healthdeclaration.dto;

import com.globits.core.dto.BaseObjectDto;
import com.globits.healthdeclaration.HealthDeclarationEnumsType.EncounterMakeDecision;
import com.globits.healthdeclaration.domain.PersonalHealthRecord;
import com.globits.healthdeclaration.domain.PersonalHealthRecordSymptom;
import com.globits.healthdeclaration.domain.Practitioner;
import com.globits.healthdeclaration.domain.UserAdministrativeUnit;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;

public class PersonalHealthRecordDto extends BaseObjectDto {

	private Integer type;// 1.dân - 2.tổ y tế 3. bác sĩ - nhân viên y tế
	private FamilyMemberDto familyMember;
	private Integer spo2;
	private Integer breathingRate;
	private Integer temperature;
	private Set<PersonalHealthRecordSymptomDto> nomalSystoms;
	private Set<PersonalHealthRecordSymptomDto> severeSymptoms;
	private String contactPersonName;
	private String contactPersonPhone;
	private String contactPersonRelation;
	private Date declarationTime;
	private Boolean lastRecord = false; // bản ghi cuối
	private Integer seriusStatus;
	private Integer resolveStatus;
	private EncounterMakeDecision makeDecision;// Ra quyết định
	private String otherInformation;// Thông tin khác
	private PractitionerDto practitioner; // Bác sĩ - nhân viên y tế
	private UserAdministrativeUnitDto medicalTeam; // tổ y tế
	private Float systolicBloodPressure;// huyết áp tâm thu
	private Float diastolicBloodPressure;// huyết áp tâm trương
	private Boolean haveTest;// Có xét nghiệm hay không
	private Boolean haveQuickTest;// Có test nhanh hay không
	private Integer quickTestResults;// Kết quả test nhanh
	private Date quickTestDate;// Ngày test nhanh
	private Boolean havePCR;// Có xét nghiệm hay không
	private Date pcrTestDate;// Ngày xét nghiệm PCR
	private Integer pcrResults;// Kết quả xét nghiệm PCR
	private HealthOrganizationDto healthOrganization;//Đơn vị y tế cấp cứu
	private Boolean haveSymptom; //Có triệu chứng hay không
	private String symptomText; //Triệu chứng cho người dùng nhập bằng tay

	public PersonalHealthRecordDto(PersonalHealthRecord entity, Boolean collapse) {
		super();
		if (entity != null) {
			this.id = entity.getId();
			this.type = entity.getType();
			this.otherInformation = entity.getOtherInformation();
			this.makeDecision = entity.getMakeDecision();
			this.spo2 = entity.getSpo2();
			this.breathingRate = entity.getBreathingRate();
			this.temperature = entity.getTemperature();
			this.contactPersonName = entity.getContactPersonName();
			this.contactPersonPhone = entity.getContactPersonPhone();
			this.contactPersonRelation = entity.getContactPersonRelation();
			this.declarationTime = entity.getDeclarationTime();
			this.lastRecord = entity.getLastRecord();
			this.seriusStatus = entity.getSeriusStatus();
			this.resolveStatus = entity.getResolveStatus();
			this.systolicBloodPressure = entity.getSystolicBloodPressure();
			this.diastolicBloodPressure = entity.getDiastolicBloodPressure();

			this.haveTest = entity.getHaveTest();
			this.haveQuickTest = entity.getHaveQuickTest();
			this.quickTestResults = entity.getQuickTestResults();
			this.havePCR = entity.getHavePCR();
			this.pcrResults = entity.getPcrResults();
			this.quickTestDate = entity.getQuickTestDate();
			this.pcrTestDate = entity.getPcrTestDate();

			this.haveSymptom = entity.getHaveSymptom();
			this.symptomText = entity.getSymptomText();

			if (entity.getFamilyMember() != null) {
				this.familyMember = new FamilyMemberDto(entity.getFamilyMember(), true);
			}
			if (entity.getPractitioner() != null) {
				this.practitioner = new PractitionerDto(entity.getPractitioner());
			}
			if (entity.getMedicalTeam() != null) {
				this.medicalTeam = new UserAdministrativeUnitDto(entity.getMedicalTeam());
			}
			if (entity.getHealthOrganization() != null) {
				this.healthOrganization = new HealthOrganizationDto(entity.getHealthOrganization());
			}
			if (collapse) {
				if (entity.getNomalSystoms() != null && entity.getNomalSystoms().size() > 0) {
					this.nomalSystoms = new HashSet<>();
					for (PersonalHealthRecordSymptom symptom : entity.getNomalSystoms()) {
						this.nomalSystoms.add(new PersonalHealthRecordSymptomDto(symptom, true));
					}
				}
				if (entity.getSevereSymptoms() != null && entity.getSevereSymptoms().size() > 0) {
					this.severeSymptoms = new HashSet<>();
					for (PersonalHealthRecordSymptom symptom : entity.getSevereSymptoms()) {
						this.severeSymptoms.add(new PersonalHealthRecordSymptomDto(symptom, true));
					}
				}
			}
		}
	}

	public PersonalHealthRecordDto() {
	}

	public PersonalHealthRecordDto(FamilyMemberDto familyMember, Integer spo2, Integer breathingRate,
			Integer temperature, Set<PersonalHealthRecordSymptomDto> nomalSystoms,
			Set<PersonalHealthRecordSymptomDto> severeSymptoms, String contactPersonName, String contactPersonPhone,
			String contactPersonRelation, Date declarationTime, Boolean lastRecord, Integer seriusStatus,
			Integer resolveStatus) {
		super();
		this.familyMember = familyMember;
		this.spo2 = spo2;
		this.breathingRate = breathingRate;
		this.temperature = temperature;
		this.nomalSystoms = nomalSystoms;
		this.severeSymptoms = severeSymptoms;
		this.contactPersonName = contactPersonName;
		this.contactPersonPhone = contactPersonPhone;
		this.contactPersonRelation = contactPersonRelation;
		this.declarationTime = declarationTime;
		this.lastRecord = lastRecord;
		this.seriusStatus = seriusStatus;
		this.resolveStatus = resolveStatus;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public FamilyMemberDto getFamilyMember() {
		return familyMember;
	}

	public void setFamilyMember(FamilyMemberDto familyMember) {
		this.familyMember = familyMember;
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

	public Set<PersonalHealthRecordSymptomDto> getNomalSystoms() {
		return nomalSystoms;
	}

	public void setNomalSystoms(Set<PersonalHealthRecordSymptomDto> nomalSystoms) {
		this.nomalSystoms = nomalSystoms;
	}

	public Set<PersonalHealthRecordSymptomDto> getSevereSymptoms() {
		return severeSymptoms;
	}

	public void setSevereSymptoms(Set<PersonalHealthRecordSymptomDto> severeSymptoms) {
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

	public Integer getSeriusStatus() {
		return seriusStatus;
	}

	public void setSeriusStatus(Integer seriusStatus) {
		this.seriusStatus = seriusStatus;
	}

	public Integer getResolveStatus() {
		return resolveStatus;
	}

	public void setResolveStatus(Integer resolveStatus) {
		this.resolveStatus = resolveStatus;
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

	public PractitionerDto getPractitioner() {
		return practitioner;
	}

	public void setPractitioner(PractitionerDto practitioner) {
		this.practitioner = practitioner;
	}

	public UserAdministrativeUnitDto getMedicalTeam() {
		return medicalTeam;
	}

	public void setMedicalTeam(UserAdministrativeUnitDto medicalTeam) {
		this.medicalTeam = medicalTeam;
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

	public Date getQuickTestDate() {
		return quickTestDate;
	}

	public void setQuickTestDate(Date quickTestDate) {
		this.quickTestDate = quickTestDate;
	}

	public Boolean getHavePCR() {
		return havePCR;
	}

	public void setHavePCR(Boolean havePCR) {
		this.havePCR = havePCR;
	}

	public Date getPcrTestDate() {
		return pcrTestDate;
	}

	public void setPcrTestDate(Date pcrTestDate) {
		this.pcrTestDate = pcrTestDate;
	}

	public Integer getPcrResults() {
		return pcrResults;
	}

	public void setPcrResults(Integer pcrResults) {
		this.pcrResults = pcrResults;
	}

	public HealthOrganizationDto getHealthOrganization() {
		return healthOrganization;
	}

	public void setHealthOrganization(HealthOrganizationDto healthOrganization) {
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
