package com.globits.healthdeclaration.domain;

import java.util.Set;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.globits.core.domain.BaseObject;

@Entity
@Table(name = "tbl_hd_administrative_unit")
@XmlRootElement
public class HDAdministrativeUnit extends BaseObject{
	private static final long serialVersionUID = 1L;
	@Column(name = "name")
	private String name;
	@Column(name = "code")
	private String code;	
	@Column(name = "level")
	private Integer level;
	
	@ManyToOne
	@JoinColumn(name = "parent_id")
	@NotFound(action = NotFoundAction.IGNORE)
	private HDAdministrativeUnit parent;//Đơn vị cha

	@JsonIgnore
	@OneToMany(mappedBy = "parent", fetch = FetchType.LAZY)
	private Set<HDAdministrativeUnit> subAdministrativeUnits;//Đơn vị con
	@Column(name = "map_code")
	private String mapCode;
	
	@Column(name = "longitude")
	private String longitude;// Kinh độ
	
	@Column(name = "latitude")
	private String latitude;// Vĩ độ

	@Column(name = "gMap_X")
	private String gMapX;// Google map X
	
	@Column(name = "gMap_Y")
	private String gMapY;// Google map Y
	
	@Column(name = "total_acreage")
	private Double totalAcreage;// Tổng Diện tích

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

	public Integer getLevel() {
		return level;
	}

	public void setLevel(Integer level) {
		this.level = level;
	}

	public HDAdministrativeUnit getParent() {
		return parent;
	}

	public void setParent(HDAdministrativeUnit parent) {
		this.parent = parent;
	}

	public Set<HDAdministrativeUnit> getSubAdministrativeUnits() {
		return subAdministrativeUnits;
	}

	public void setSubAdministrativeUnits(Set<HDAdministrativeUnit> subAdministrativeUnits) {
		this.subAdministrativeUnits = subAdministrativeUnits;
	}
	
	public String getMapCode() {
		return mapCode;
	}

	public void setMapCode(String mapCode) {
		this.mapCode = mapCode;
	}

	public String getLongitude() {
		return longitude;
	}

	public void setLongitude(String longitude) {
		this.longitude = longitude;
	}

	public String getLatitude() {
		return latitude;
	}

	public void setLatitude(String latitude) {
		this.latitude = latitude;
	}

	public String getgMapX() {
		return gMapX;
	}

	public void setgMapX(String gMapX) {
		this.gMapX = gMapX;
	}

	public String getgMapY() {
		return gMapY;
	}

	public void setgMapY(String gMapY) {
		this.gMapY = gMapY;
	}	

	public Double getTotalAcreage() {
		return totalAcreage;
	}

	public void setTotalAcreage(Double totalAcreage) {
		this.totalAcreage = totalAcreage;
	}

	public HDAdministrativeUnit() {
		this.setUuidKey(UUID.randomUUID());
	}
}
