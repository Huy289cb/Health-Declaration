package com.globits.healthdeclaration.dto;

import com.globits.core.dto.PersonDto;
import com.globits.healthdeclaration.domain.Practitioner;
import com.globits.security.dto.UserDto;

public class PractitionerDto extends PersonDto {
	private Integer age;// tuổi

	// HealthDeclarationEnumsType.PractitionerOccupation
	private Integer occupation;// nghề nghiệp

	private String workPlace;// Nơi làm việc - công tác

	private String detailAddress;// đia chỉ

	private HDAdministrativeUnitDto administrativeUnit;
	
	private HealthCareGroupDto healthCareGroup;
	
	//dto them
	private UserDto user;

	private String zalo;

	private Integer type;

	public PractitionerDto() {
		super();
	}

	public PractitionerDto(Practitioner entity) {
		super();
		if (entity != null) {
            this.id = entity.getId();
            this.displayName = entity.getDisplayName();
            this.phoneNumber=entity.getPhoneNumber();
            this.occupation = entity.getOccupation();
            this.workPlace=entity.getWorkPlace();
            this.detailAddress = entity.getDetailAddress();
            this.age = entity.getAge();
            this.email = entity.getEmail();
            this.gender = entity.getGender();
            this.zalo = entity.getZalo();
            this.type = entity.getType();
            if (entity.getUser() != null) {
                this.user = new UserDto(entity.getUser());
			}
			if (entity.getAdministrativeUnit() != null) {
				this.administrativeUnit = new HDAdministrativeUnitDto(entity.getAdministrativeUnit(), true);
			}
			if(entity.getHealthCareGroup() != null) {
				this.healthCareGroup = new HealthCareGroupDto(entity.getHealthCareGroup());
			}
		}
	}

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

	public HDAdministrativeUnitDto getAdministrativeUnit() {
		return administrativeUnit;
	}

	public void setAdministrativeUnit(HDAdministrativeUnitDto administrativeUnit) {
		this.administrativeUnit = administrativeUnit;
	}

	public HealthCareGroupDto getHealthCareGroup() {
		return healthCareGroup;
	}

	public void setHealthCareGroup(HealthCareGroupDto healthCareGroup) {
		this.healthCareGroup = healthCareGroup;
	}

	public UserDto getUser() {
		return user;
	}

	public void setUser(UserDto user) {
		this.user = user;
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
