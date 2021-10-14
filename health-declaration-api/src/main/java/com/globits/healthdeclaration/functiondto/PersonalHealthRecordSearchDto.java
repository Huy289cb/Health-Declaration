package com.globits.healthdeclaration.functiondto;

import java.util.UUID;

public class PersonalHealthRecordSearchDto extends SearchDto {
	private UUID familyMemberId;
	private UUID familyId;
	private Boolean lastRecord; // bản ghi cuối
	private UUID practitionerId;
	private UUID healthCareGroupId;
	private UUID administrativeUnitId;
	private Boolean isShowHistoryForm;
	private Integer resolveStatus;
	
	public PersonalHealthRecordSearchDto() {
		super();
	}

	public UUID getFamilyMemberId() {
		return familyMemberId;
	}

	public void setFamilyMemberId(UUID familyMemberId) {
		this.familyMemberId = familyMemberId;
	}

	public UUID getFamilyId() {
		return familyId;
	}

	public void setFamilyId(UUID familyId) {
		this.familyId = familyId;
	}

	public Boolean getLastRecord() {
		return lastRecord;
	}

	public void setLastRecord(Boolean lastRecord) {
		this.lastRecord = lastRecord;
	}

	public UUID getPractitionerId() {
		return practitionerId;
	}

	public void setPractitionerId(UUID practitionerId) {
		this.practitionerId = practitionerId;
	}

	public UUID getHealthCareGroupId() {
		return healthCareGroupId;
	}

	public void setHealthCareGroupId(UUID healthCareGroupId) {
		this.healthCareGroupId = healthCareGroupId;
	}

	public UUID getAdministrativeUnitId() {
		return administrativeUnitId;
	}

	public void setAdministrativeUnitId(UUID administrativeUnitId) {
		this.administrativeUnitId = administrativeUnitId;
	}

	public Boolean getShowHistoryForm() {
		return isShowHistoryForm;
	}

	public void setShowHistoryForm(Boolean showHistoryForm) {
		isShowHistoryForm = showHistoryForm;
	}

	public Integer getResolveStatus() {
		return resolveStatus;
	}

	public void setResolveStatus(Integer resolveStatus) {
		this.resolveStatus = resolveStatus;
	}
}
