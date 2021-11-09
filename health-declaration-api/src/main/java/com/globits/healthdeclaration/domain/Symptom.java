package com.globits.healthdeclaration.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

import com.globits.core.domain.BaseObject;
import com.globits.healthdeclaration.HealthDeclarationEnumsType.SymptomType;

@Entity
@Table(name = "tbl_symptom")
@XmlRootElement
public class Symptom extends BaseObject {

	@Column(name = "type", nullable = true)
	private Integer type;//(Type : basic = 1; Serious =2)

	private String code;//
	private String name;//
	private String description;//
	
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

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}
}
