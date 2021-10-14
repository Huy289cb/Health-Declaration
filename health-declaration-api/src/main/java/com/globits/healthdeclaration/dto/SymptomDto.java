package com.globits.healthdeclaration.dto;

import com.globits.core.dto.BaseObjectDto;
import com.globits.healthdeclaration.HealthDeclarationEnumsType.SymptomType;
import com.globits.healthdeclaration.domain.Symptom;

public class SymptomDto extends BaseObjectDto {
	private SymptomType type;//(Type : basic = 1; Serious =2)

	private String code;//
	private String name;//
	private String description;//
	
	public SymptomType getType() {
		return type;
	}
	public void setType(SymptomType type) {
		this.type = type;
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
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public SymptomDto() {
		super();
	}

	public SymptomDto(Symptom entity) {
		super();
		if (entity != null) {
			this.id =entity.getId();
			this.type =entity.getType();
			this.code=entity.getCode();
			this.name=entity.getName();
			this.description=entity.getDescription();
		}
	}
}
