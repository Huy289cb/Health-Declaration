package com.globits.healthdeclaration.dto;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;

import com.globits.core.dto.BaseObjectDto;
import com.globits.healthdeclaration.HealthDeclarationEnumsType.EncounterMakeDecision;
import com.globits.healthdeclaration.HealthDeclarationEnumsType.EncounterType;
import com.globits.healthdeclaration.domain.Encounter;
import com.globits.healthdeclaration.domain.EncounterSymptom;
import com.globits.healthdeclaration.domain.UserAdministrativeUnit;

public class EncounterDto extends BaseObjectDto {
	private PractitionerDto practitioner;
	private EncounterType type;
	private FamilyMemberDto familyMember;
	private UserAdministrativeUnit userAdministrativeUnit;
	private Date examinationTime;// Thời gian khám
	private String exposureHistory;// tiền sử tiếp xúc F0
	private Float temperature;// Nhiệt độ
	private Float bloodPressure;// huyết áp
	private Float breathingRate;// nhịp thở
    private Float weight;//Cân nặng
    private Float height;//Chiều cao
	private BigDecimal spo2;
	private String initialHandle;// xử lý ban đầu (tạm thời để string)
	private String otherInformation;// Thông tin khác
	private Boolean haveTest;// Có xét nghiệm hay không
	private Boolean haveQuickTest;// Có test nhanh hay không
	private Integer quickTestResults;// Kết quả test nhanh
	private Boolean havePCR;// Có xét nghiệm hay không
	private Integer pcrResults;// Kết quả xét nghiệm PCR
	private EncounterMakeDecision makeDecision;// Ra quyết định
	private Set<EncounterSymptomDto> nomalSystoms; // triệu chứng thường gặp
	private Set<EncounterSymptomDto> severeSymptoms; // triệu chứng nặng

	public EncounterDto() {
		super();
	}

	public EncounterDto(Encounter entity) {
		super();
		if (entity != null) {
			this.id = entity.getId();
			this.type = entity.getType();
			this.userAdministrativeUnit = entity.getUserAdministrativeUnit();
			this.examinationTime = entity.getExaminationTime();
			this.exposureHistory = entity.getExposureHistory();
			this.temperature = entity.getTemperature();
			this.bloodPressure = entity.getBloodPressure();
			this.breathingRate = entity.getBreathingRate();
			this.spo2 = entity.getSpo2();
			this.initialHandle = entity.getInitialHandle();
			this.otherInformation = entity.getOtherInformation();
			this.haveTest = entity.getHaveTest();
			this.haveQuickTest = entity.getHaveQuickTest();
			this.quickTestResults = entity.getQuickTestResults();
			this.havePCR = entity.getHavePCR();
			this.pcrResults = entity.getPcrResults();
			this.makeDecision = entity.getMakeDecision();
            this.weight = entity.getWeight();
            this.height = entity.getHeight();

			if (entity.getPractitioner() != null) {
				this.practitioner = new PractitionerDto(entity.getPractitioner());
			}
			if (entity.getFamilyMember() != null) {
				this.familyMember = new FamilyMemberDto(entity.getFamilyMember(), true);
			}
			if (entity.getNomalSystoms() != null && entity.getNomalSystoms().size() > 0) {
				this.nomalSystoms = new HashSet<>();
				for (EncounterSymptom symptom : entity.getNomalSystoms()) {
					this.nomalSystoms.add(new EncounterSymptomDto(symptom, true));
				}
			}
			if (entity.getSevereSymptoms() != null && entity.getSevereSymptoms().size() > 0) {
				this.severeSymptoms = new HashSet<>();
				for (EncounterSymptom symptom : entity.getSevereSymptoms()) {
					this.severeSymptoms.add(new EncounterSymptomDto(symptom, true));
				}
			}
		}
	}

	public EncounterDto(Encounter entity, boolean simple) {
		super();
		if (entity != null) {
			this.id = entity.getId();
			this.type = entity.getType();
			this.userAdministrativeUnit = entity.getUserAdministrativeUnit();
			this.examinationTime = entity.getExaminationTime();
			this.exposureHistory = entity.getExposureHistory();
			this.temperature = entity.getTemperature();
			this.bloodPressure = entity.getBloodPressure();
			this.breathingRate = entity.getBreathingRate();
			this.spo2 = entity.getSpo2();
			this.initialHandle = entity.getInitialHandle();
			this.otherInformation = entity.getOtherInformation();
			this.haveTest = entity.getHaveTest();
			this.haveQuickTest = entity.getHaveQuickTest();
			this.quickTestResults = entity.getQuickTestResults();
			this.havePCR = entity.getHavePCR();
			this.pcrResults = entity.getPcrResults();
			this.makeDecision = entity.getMakeDecision();
            this.weight = entity.getWeight();
            this.height = entity.getHeight();

			if (entity.getPractitioner() != null) {
				this.practitioner = new PractitionerDto(entity.getPractitioner());
			}
			if (entity.getFamilyMember() != null) {
				this.familyMember = new FamilyMemberDto(entity.getFamilyMember(), true);
			}
		}
	}

	public PractitionerDto getPractitioner() {
		return practitioner;
	}

	public void setPractitioner(PractitionerDto practitioner) {
		this.practitioner = practitioner;
	}

	public EncounterType getType() {
		return type;
	}

	public void setType(EncounterType type) {
		this.type = type;
	}

	public FamilyMemberDto getFamilyMember() {
		return familyMember;
	}

	public void setFamilyMember(FamilyMemberDto familyMember) {
		this.familyMember = familyMember;
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

	public Set<EncounterSymptomDto> getNomalSystoms() {
		return nomalSystoms;
	}

	public void setNomalSystoms(Set<EncounterSymptomDto> nomalSystoms) {
		this.nomalSystoms = nomalSystoms;
	}

	public Set<EncounterSymptomDto> getSevereSymptoms() {
		return severeSymptoms;
	}

	public void setSevereSymptoms(Set<EncounterSymptomDto> severeSymptoms) {
		this.severeSymptoms = severeSymptoms;
	}

}
