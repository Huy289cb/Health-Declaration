package com.globits.healthdeclaration.dto;

import java.util.List;
import java.util.UUID;

import com.globits.core.dto.BaseObjectDto;
import com.globits.healthdeclaration.domain.Family;
import com.globits.healthdeclaration.domain.Practitioner;
import com.globits.healthdeclaration.domain.PractitionerAndFamily;

public class PractitionerAndFamilyDto extends BaseObjectDto {
	private FamilyDto family;
	private PractitionerDto practitioner;
	private List<FamilyDto> listFamily;
	private UUID practitionerId;
	private Integer type;

	public PractitionerAndFamilyDto(PractitionerAndFamily entity, Practitioner practitioner, Family family) {
		super();
		if (entity != null && entity.getId() != null) {
			this.id = entity.getId();
			if (entity.getFamily() != null) {
				this.family = new FamilyDto(entity.getFamily(), false);
			}
			if (entity.getPractitioner() != null) {
				this.practitioner = new PractitionerDto(entity.getPractitioner());
			}
			this.type = entity.getType();
		}
		else {
			if (family != null) {
				this.family = new FamilyDto(family, false);
			}
			if (practitioner != null) {
				this.practitioner = new PractitionerDto(practitioner);
			}
		}
	}

	public PractitionerAndFamilyDto(PractitionerAndFamily entity) {
		super();
		if (entity != null) {
			this.id = entity.getId();
			if (entity.getFamily() != null) {
				this.family = new FamilyDto(entity.getFamily(), false);
			}
			if (entity.getPractitioner() != null) {
				this.practitioner = new PractitionerDto(entity.getPractitioner());
			}
			this.type = entity.getType();
		}
	}

	public PractitionerAndFamilyDto() {
		super();
	}

	public FamilyDto getFamily() {
		return family;
	}

	public void setFamily(FamilyDto family) {
		this.family = family;
	}

	public PractitionerDto getPractitioner() {
		return practitioner;
	}

	public void setPractitioner(PractitionerDto practitioner) {
		this.practitioner = practitioner;
	}

	public List<FamilyDto> getListFamily() {
		return listFamily;
	}

	public void setListFamily(List<FamilyDto> listFamily) {
		this.listFamily = listFamily;
	}

	public UUID getPractitionerId() {
		return practitionerId;
	}

	public void setPractitionerId(UUID practitionerId) {
		this.practitionerId = practitionerId;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

}
