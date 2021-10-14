package com.globits.healthdeclaration.dto;

import com.globits.core.dto.BaseObjectDto;
import com.globits.healthdeclaration.domain.HealthCareGroupAdministrativeUnit;
import com.globits.healthdeclaration.dto.HDAdministrativeUnitDto;
import com.globits.healthdeclaration.dto.HealthCareGroupDto;

public class HealthCareGroupAdministrativeUnitDto extends BaseObjectDto{

	private HealthCareGroupDto healthCareGroup;
	private HDAdministrativeUnitDto administrativeUnit;
	
	
	public HealthCareGroupAdministrativeUnitDto() {
	}
	public HealthCareGroupAdministrativeUnitDto(HealthCareGroupAdministrativeUnit entity) {
		this(entity, true);
	}
	public HealthCareGroupAdministrativeUnitDto(HealthCareGroupAdministrativeUnit entity, Boolean sample) {
		if(entity != null) {
			this.id = entity.getId();
			if(entity.getAdministrativeUnit()!=null) {
				if(sample) {
					this.administrativeUnit = new HDAdministrativeUnitDto(entity.getAdministrativeUnit());
				}else {
					this.administrativeUnit = new HDAdministrativeUnitDto(entity.getAdministrativeUnit(), false, 2);
				}
			}
			if(entity.getHealthCareGroup() != null) {
				this.healthCareGroup = new HealthCareGroupDto(entity.getHealthCareGroup(), false);
			}
		}
	}
	public HealthCareGroupDto getHealthCareGroup() {
		return healthCareGroup;
	}
	public void setHealthCareGroup(HealthCareGroupDto healthCareGroup) {
		this.healthCareGroup = healthCareGroup;
	}
	public HDAdministrativeUnitDto getAdministrativeUnit() {
		return administrativeUnit;
	}
	public void setAdministrativeUnit(HDAdministrativeUnitDto administrativeUnit) {
		this.administrativeUnit = administrativeUnit;
	}
	
	
}
