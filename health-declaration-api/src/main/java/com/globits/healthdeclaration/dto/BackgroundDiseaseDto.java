package com.globits.healthdeclaration.dto;

import com.globits.core.dto.BaseObjectDto;
import com.globits.healthdeclaration.domain.BackgroundDisease;

public class BackgroundDiseaseDto extends BaseObjectDto{
	
	private String code;
	private String name;
	private String description;
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
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public BackgroundDiseaseDto() {
		super();
	}
	
	public BackgroundDiseaseDto(BackgroundDisease entity) {
		super();
		if(entity != null) {
			this.id = entity.getId();
			this.code = entity.getCode();
			this.name = entity.getName();
			this.description = entity.getDescription();
		}
	}
}
