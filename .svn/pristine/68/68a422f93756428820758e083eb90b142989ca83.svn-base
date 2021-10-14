package com.globits.healthdeclaration.dto;

import com.globits.core.dto.BaseObjectDto;
import com.globits.core.dto.PersonDto;
import com.globits.healthdeclaration.HealthDeclarationEnumsType.UserUnitType;
import com.globits.healthdeclaration.domain.UserAdministrativeUnit;
import com.globits.security.domain.User;
import com.globits.security.dto.RoleDto;
import com.globits.security.dto.UserDto;

public class UserAdministrativeUnitDto extends BaseObjectDto {
	private UserDto user;
	private HDAdministrativeUnitDto administrativeUnit;
	private HealthCareGroupDto healthCareGroup;
	private RoleDto role;
	private UserUnitType userType;

	public UserAdministrativeUnitDto(UserAdministrativeUnit entity) {
		if (entity != null) {
			id = entity.getId();
			if (entity.getUser() != null) {
				this.user = new UserDto(entity.getUser());
				if (entity.getUser().getPerson() != null) {
					this.user.setPerson(new PersonDto(entity.getUser().getPerson()));
				}
			}
			if (entity.getAdministrativeUnit() != null) {
				this.administrativeUnit = new HDAdministrativeUnitDto(entity.getAdministrativeUnit(), true);
			}
			if(entity.getHealthCareGroup() != null) {
				this.healthCareGroup = new HealthCareGroupDto(entity.getHealthCareGroup());
			}
			if (entity.getRole() != null) {
				this.role = new RoleDto(entity.getRole());
			}
			this.userType = entity.getUserType();
		}
	}

	public UserAdministrativeUnitDto(UserAdministrativeUnit entity, User user) {
		if (entity != null) {
			id = entity.getId();
			if (entity.getUser() != null) {
				this.user = new UserDto(entity.getUser());
			}
			if (entity.getAdministrativeUnit() != null) {
				this.administrativeUnit = new HDAdministrativeUnitDto(entity.getAdministrativeUnit(), true);
			}
			if(entity.getHealthCareGroup() != null) {
				this.healthCareGroup = new HealthCareGroupDto(entity.getHealthCareGroup());
			}
			if (entity.getRole() != null) {
				this.role = new RoleDto(entity.getRole());
			}
			this.userType = entity.getUserType();
		}
		this.user = new UserDto(user);
	}

	public UserAdministrativeUnitDto() {
		super();
	}

	public UserDto getUser() {
		return user;
	}

	public void setUser(UserDto user) {
		this.user = user;
	}

	public HDAdministrativeUnitDto getAdministrativeUnit() {
		return administrativeUnit;
	}

	public void setAdministrativeUnit(HDAdministrativeUnitDto administrativeUnit) {
		this.administrativeUnit = administrativeUnit;
	}

	public RoleDto getRole() {
		return role;
	}

	public void setRole(RoleDto role) {
		this.role = role;
	}

	public HealthCareGroupDto getHealthCareGroup() {
		return healthCareGroup;
	}

	public void setHealthCareGroup(HealthCareGroupDto healthCareGroup) {
		this.healthCareGroup = healthCareGroup;
	}

	public UserUnitType getUserType() {
		return userType;
	}

	public void setUserType(UserUnitType userType) {
		this.userType = userType;
	}

}
