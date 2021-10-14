package com.globits.healthdeclaration.dto;

import com.globits.core.domain.AdministrativeUnit;
import com.globits.core.dto.BaseObjectDto;
import com.globits.healthdeclaration.domain.HealthCareGroup;
import com.globits.healthdeclaration.domain.HealthCareGroupAdministrativeUnit;
import java.util.Set;
import java.util.HashSet;

public class HealthCareGroupDto extends BaseObjectDto {

	// Tổ y tế dân phố
	private String code;
	private String name;
	private String address;
	private String phoneNumber1;
	private String phoneNumber2;
	private String zalo;
	private String faceBook;
	private Set<HealthCareGroupAdministrativeUnitDto> listHealthCareGroupAdministrativeUnits = new HashSet<>();

	public HealthCareGroupDto() {
		super();
	}

	public HealthCareGroupDto(HealthCareGroup entity) {
		this(entity, true);
	}

	public HealthCareGroupDto(HealthCareGroup entity, boolean simple) {
		if (entity != null) {
			this.id = entity.getId();
			this.code = entity.getCode();
			this.name = entity.getName();
			this.address = entity.getAddress();
			this.phoneNumber1 = entity.getPhoneNumber1();
			this.phoneNumber2 = entity.getPhoneNumber2();
			this.zalo = entity.getZalo();
			this.faceBook = entity.getFaceBook();
			if (simple) {
				if (entity.getListHealthCareGroupAdministrativeUnits() != null
						&& entity.getListHealthCareGroupAdministrativeUnits().size() > 0) {
					for (HealthCareGroupAdministrativeUnit healthcaregroupAdministrativeUnit : entity
							.getListHealthCareGroupAdministrativeUnits()) {
						this.listHealthCareGroupAdministrativeUnits.add(
								new HealthCareGroupAdministrativeUnitDto(healthcaregroupAdministrativeUnit, false));
					}
				}
			}
		}
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getPhoneNumber1() {
		return phoneNumber1;
	}

	public void setPhoneNumber1(String phoneNumber1) {
		this.phoneNumber1 = phoneNumber1;
	}

	public String getPhoneNumber2() {
		return phoneNumber2;
	}

	public void setPhoneNumber2(String phoneNumber2) {
		this.phoneNumber2 = phoneNumber2;
	}

	public String getZalo() {
		return zalo;
	}

	public void setZalo(String zalo) {
		this.zalo = zalo;
	}

	public String getFaceBook() {
		return faceBook;
	}

	public void setFaceBook(String faceBook) {
		this.faceBook = faceBook;
	}

	public Set<HealthCareGroupAdministrativeUnitDto> getListHealthCareGroupAdministrativeUnits() {
		return listHealthCareGroupAdministrativeUnits;
	}

	public void setListHealthCareGroupAdministrativeUnits(
			Set<HealthCareGroupAdministrativeUnitDto> listHealthCareGroupAdministrativeUnits) {
		this.listHealthCareGroupAdministrativeUnits = listHealthCareGroupAdministrativeUnits;
	}
}
