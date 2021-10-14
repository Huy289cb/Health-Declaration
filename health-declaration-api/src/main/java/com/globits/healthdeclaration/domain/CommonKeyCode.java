package com.globits.healthdeclaration.domain;

import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

import com.globits.core.domain.BaseObject;

@Entity
@Table(name="tbl_common_key_code")
@XmlRootElement
public class CommonKeyCode extends BaseObject {
	
	@Column(name="type")
	private Integer type;//Loại mã
	
	@Column(name="object_type")
	private String objectType;//Hard-code
	
	@Column(name = "object_id",  nullable = true)
	private UUID objectId;//Hard-code theo object
	
	@Column(name ="current_index",nullable = false)
	private Integer currentIndex;

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public String getObjectType() {
		return objectType;
	}

	public void setObjectType(String objectType) {
		this.objectType = objectType;
	}

	public UUID getObjectId() {
		return objectId;
	}

	public void setObjectId(UUID objectId) {
		this.objectId = objectId;
	}

	public Integer getCurrentIndex() {
		return currentIndex;
	}

	public void setCurrentIndex(Integer currentIndex) {
		this.currentIndex = currentIndex;
	}

}
