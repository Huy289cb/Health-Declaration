package com.globits.healthdeclaration.dto;

import com.globits.core.dto.BaseObjectDto;
import com.globits.healthdeclaration.domain.HealthOrganization;

public class HealthOrganizationDto extends BaseObjectDto {

    private String name;

    private String code;

    private HDAdministrativeUnitDto administrativeUnit;

    public HealthOrganizationDto() {
        super();
    }

    public HealthOrganizationDto(HealthOrganization entity) {
        super();
        if (entity != null) {
            this.id = entity.getId();
            this.name = entity.getName();
            this.code = entity.getCode();
            if (entity.getAdministrativeUnit() != null) {
                this.administrativeUnit = new HDAdministrativeUnitDto(entity.getAdministrativeUnit(), true);
            }
        }
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public HDAdministrativeUnitDto getAdministrativeUnit() {
        return administrativeUnit;
    }

    public void setAdministrativeUnit(HDAdministrativeUnitDto administrativeUnit) {
        this.administrativeUnit = administrativeUnit;
    }
}
