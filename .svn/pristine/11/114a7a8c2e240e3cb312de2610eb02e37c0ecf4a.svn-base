package com.globits.healthdeclaration.dto;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import com.globits.core.dto.BaseObjectDto;
import com.globits.healthdeclaration.domain.HDAdministrativeUnit;

public class HDAdministrativeUnitDto extends BaseObjectDto {
	private String name;
	private String code;
	private Integer level;

	private HDAdministrativeUnitDto parent;

	private Set<HDAdministrativeUnitDto> subAdministrativeUnitsDto;
	private boolean isDuplicate;
	private String dupName;
	private String dupCode;

	private List<HDAdministrativeUnitDto> children;
	private String mapCode;
	private String longitude;// Kinh độ
	private String latitude;// Vĩ độ
	private String gMapX;// Google map X
	private String gMapY;// Google map Y
	private Double totalAcreage;// Tổng Diện tích
	private UUID parentId;
	private String emergencyPhone; // Số điện thoại cấp cứu
	private String hotZalo; // zalo nóng

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

	public HDAdministrativeUnitDto getParent() {
		return parent;
	}

	public void setParent(HDAdministrativeUnitDto parent) {
		this.parent = parent;
	}

	public Set<HDAdministrativeUnitDto> getSubAdministrativeUnitsDto() {
		return subAdministrativeUnitsDto;
	}

	public void setSubAdministrativeUnitsDto(Set<HDAdministrativeUnitDto> subAdministrativeUnitsDto) {
		this.subAdministrativeUnitsDto = subAdministrativeUnitsDto;
	}

	public boolean isDuplicate() {
		return isDuplicate;
	}

	public void setDuplicate(boolean isDuplicate) {
		this.isDuplicate = isDuplicate;
	}

	public String getDupName() {
		return dupName;
	}

	public void setDupName(String dupName) {
		this.dupName = dupName;
	}

	public String getDupCode() {
		return dupCode;
	}

	public void setDupCode(String dupCode) {
		this.dupCode = dupCode;
	}

	public List<HDAdministrativeUnitDto> getChildren() {
		return children;
	}

	public void setChildren(List<HDAdministrativeUnitDto> children) {
		this.children = children;
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

	public UUID getParentId() {
		return parentId;
	}

	public void setParentId(UUID parentId) {
		this.parentId = parentId;
	}

	public String getEmergencyPhone() {
		return emergencyPhone;
	}

	public void setEmergencyPhone(String emergencyPhone) {
		this.emergencyPhone = emergencyPhone;
	}

	public String getHotZalo() {
		return hotZalo;
	}

	public void setHotZalo(String hotZalo) {
		this.hotZalo = hotZalo;
	}

	public HDAdministrativeUnitDto() {
		super();
	}

	public HDAdministrativeUnitDto(HDAdministrativeUnit administrativeUnit, boolean simple, int child) {
		super();
		this.id = administrativeUnit.getId();	
		if (child == 2) {
			String name = "";
			if (administrativeUnit.getName() != null) {
				name += administrativeUnit.getName();
				if (administrativeUnit.getParent() != null && administrativeUnit.getParent().getName() != null) {
					HDAdministrativeUnit parent1 = administrativeUnit.getParent();
					name += " - " + parent1.getName();
					if (parent1.getParent() != null && parent1.getName() != null) {
						HDAdministrativeUnit parent2 = parent1.getParent();
						name += " - " + parent2.getName();
						if (parent2.getParent() != null && parent2.getName() != null) {
							HDAdministrativeUnit parent3 = parent2.getParent();
							name += " - " + parent3.getName();
						}
					}
				}
			}
			this.name = name;
		}else {
			this.name = administrativeUnit.getName();
		}
		this.code = administrativeUnit.getCode();
		this.level = administrativeUnit.getLevel();
		if (administrativeUnit.getParent() != null) {
			HDAdministrativeUnit parent = administrativeUnit.getParent();
			parent.setId(administrativeUnit.getParent().getId());
			parent.setCode(administrativeUnit.getParent().getCode());
			parent.setName(administrativeUnit.getParent().getName());
			parent.setLevel(administrativeUnit.getParent().getLevel());
			parent.setMapCode(administrativeUnit.getParent().getMapCode());
			parent.setLatitude(administrativeUnit.getParent().getLatitude());
			parent.setLongitude(administrativeUnit.getParent().getLongitude());
			parent.setgMapX(administrativeUnit.getParent().getgMapX());
			parent.setgMapY(administrativeUnit.getParent().getgMapY());
			parent.setTotalAcreage(administrativeUnit.getParent().getTotalAcreage());
			parent.setEmergencyPhone(administrativeUnit.getParent().getEmergencyPhone());
			parent.setHotZalo(administrativeUnit.getParent().getHotZalo());

			this.parent = new HDAdministrativeUnitDto(parent, true);
		}
	}

	public HDAdministrativeUnitDto(HDAdministrativeUnit administrativeUnit, boolean simple) {
		super();
		this.id = administrativeUnit.getId();
		this.name = administrativeUnit.getName();
		this.code = administrativeUnit.getCode();
		this.level = administrativeUnit.getLevel();
		this.latitude = administrativeUnit.getLatitude();
		this.longitude = administrativeUnit.getLongitude();
		this.mapCode = administrativeUnit.getMapCode();
		this.gMapX = administrativeUnit.getgMapX();
		this.gMapY = administrativeUnit.getgMapY();
		this.totalAcreage = administrativeUnit.getTotalAcreage();
		this.emergencyPhone = administrativeUnit.getEmergencyPhone();
		this.hotZalo = administrativeUnit.getHotZalo();

		if (administrativeUnit.getParent() != null) {
			HDAdministrativeUnit parent = administrativeUnit.getParent();
			parent.setId(administrativeUnit.getParent().getId());
			parent.setCode(administrativeUnit.getParent().getCode());
			parent.setName(administrativeUnit.getParent().getName());
			parent.setLevel(administrativeUnit.getParent().getLevel());
			parent.setMapCode(administrativeUnit.getParent().getMapCode());
			parent.setLatitude(administrativeUnit.getParent().getLatitude());
			parent.setLongitude(administrativeUnit.getParent().getLongitude());
			parent.setgMapX(administrativeUnit.getParent().getgMapX());
			parent.setgMapY(administrativeUnit.getParent().getgMapY());
			parent.setTotalAcreage(administrativeUnit.getParent().getTotalAcreage());
			parent.setEmergencyPhone(administrativeUnit.getParent().getEmergencyPhone());
			parent.setHotZalo(administrativeUnit.getParent().getHotZalo());

			this.parent = new HDAdministrativeUnitDto(parent, true);
		}
	}

	public HDAdministrativeUnitDto(HDAdministrativeUnit administrativeUnit) {
		super();
		this.id = administrativeUnit.getId();
		this.name = administrativeUnit.getName();
		this.code = administrativeUnit.getCode();
		this.level = administrativeUnit.getLevel();
		this.mapCode = administrativeUnit.getMapCode();
		this.latitude = administrativeUnit.getLatitude();
		this.longitude = administrativeUnit.getLongitude();
		this.gMapX = administrativeUnit.getgMapX();
		this.gMapY = administrativeUnit.getgMapY();
		this.totalAcreage = administrativeUnit.getTotalAcreage();
		this.emergencyPhone = administrativeUnit.getEmergencyPhone();
		this.hotZalo = administrativeUnit.getHotZalo();

		if (administrativeUnit.getParent() != null) {
			HDAdministrativeUnit parent = administrativeUnit.getParent();
			parent.setId(administrativeUnit.getParent().getId());
			parent.setCode(administrativeUnit.getParent().getCode());
			parent.setName(administrativeUnit.getParent().getName());
			parent.setLevel(administrativeUnit.getParent().getLevel());
			parent.setMapCode(administrativeUnit.getParent().getMapCode());
			parent.setLatitude(administrativeUnit.getParent().getLatitude());
			parent.setLongitude(administrativeUnit.getParent().getLongitude());
			parent.setgMapX(administrativeUnit.getParent().getgMapX());
			parent.setgMapY(administrativeUnit.getParent().getgMapY());
			parent.setTotalAcreage(administrativeUnit.getParent().getTotalAcreage());
			parent.setEmergencyPhone(administrativeUnit.getParent().getEmergencyPhone());
			parent.setHotZalo(administrativeUnit.getParent().getHotZalo());

			this.parent = new HDAdministrativeUnitDto(parent);
			this.parentId = administrativeUnit.getParent().getId();
		}

		Set<HDAdministrativeUnitDto> administrativeUnitsDtos = new HashSet<HDAdministrativeUnitDto>();
		if (administrativeUnit != null && administrativeUnit.getSubAdministrativeUnits() != null
				&& administrativeUnit.getSubAdministrativeUnits().size() > 0) {
			for (HDAdministrativeUnit adu : administrativeUnit.getSubAdministrativeUnits()) {
				HDAdministrativeUnitDto subAdministrativeUnitsDto = new HDAdministrativeUnitDto();
				subAdministrativeUnitsDto.setId(adu.getId());
				subAdministrativeUnitsDto.setCode(adu.getCode());
				subAdministrativeUnitsDto.setName(adu.getName());

				subAdministrativeUnitsDto.setMapCode(adu.getMapCode());
				subAdministrativeUnitsDto.setLatitude(adu.getLatitude());
				subAdministrativeUnitsDto.setLongitude(adu.getLongitude());
				subAdministrativeUnitsDto.setgMapX(adu.getgMapX());
				subAdministrativeUnitsDto.setgMapY(adu.getgMapY());
				subAdministrativeUnitsDto.setTotalAcreage(adu.getTotalAcreage());
				subAdministrativeUnitsDto.setEmergencyPhone(adu.getEmergencyPhone());
				subAdministrativeUnitsDto.setHotZalo(adu.getHotZalo());

				administrativeUnitsDtos.add(subAdministrativeUnitsDto);

			}
			this.subAdministrativeUnitsDto = administrativeUnitsDtos;
		}
		// this.setChildren(getListChildren(administrativeUnit));
	}

	private List<HDAdministrativeUnitDto> getListChildren(HDAdministrativeUnit unit) {
		List<HDAdministrativeUnitDto> ret = new ArrayList<HDAdministrativeUnitDto>();

		if (unit.getSubAdministrativeUnits() != null && unit.getSubAdministrativeUnits().size() > 0) {
			for (HDAdministrativeUnit s : unit.getSubAdministrativeUnits()) {
				HDAdministrativeUnitDto sDto = new HDAdministrativeUnitDto();
				sDto.setId(s.getId());
				sDto.setCode(s.getCode());
				sDto.setName(s.getName());
				sDto.setLevel(s.getLevel());
				sDto.setChildren(getListChildren(s));

				sDto.setMapCode(s.getMapCode());
				sDto.setLatitude(s.getLatitude());
				sDto.setLongitude(s.getLongitude());
				sDto.setgMapX(s.getgMapX());
				sDto.setgMapY(getgMapY());
				sDto.setTotalAcreage(getTotalAcreage());
				sDto.setEmergencyPhone(s.getEmergencyPhone());
				sDto.setHotZalo(s.getHotZalo());

				ret.add(sDto);
			}
		}
		return ret;
	}

	public HDAdministrativeUnitDto(HDAdministrativeUnit administrativeUnit, int chi) {
		super();
		this.id = administrativeUnit.getId();
		this.name = administrativeUnit.getName();
		this.code = administrativeUnit.getCode();
		this.level = administrativeUnit.getLevel();
		this.mapCode = administrativeUnit.getMapCode();
		this.latitude = administrativeUnit.getLatitude();
		this.longitude = administrativeUnit.getLongitude();
		this.gMapX = administrativeUnit.getgMapX();
		this.gMapY = administrativeUnit.getgMapY();
		this.totalAcreage = administrativeUnit.getTotalAcreage();
		this.emergencyPhone = administrativeUnit.getEmergencyPhone();
		this.hotZalo = administrativeUnit.getHotZalo();

		if (administrativeUnit.getParent() != null) {
			HDAdministrativeUnit parent = administrativeUnit.getParent();
			parent.setId(administrativeUnit.getParent().getId());
			parent.setCode(administrativeUnit.getParent().getCode());
			parent.setName(administrativeUnit.getParent().getName());
			parent.setLevel(administrativeUnit.getParent().getLevel());

			parent.setMapCode(administrativeUnit.getParent().getMapCode());
			parent.setLatitude(administrativeUnit.getParent().getLatitude());
			parent.setLongitude(administrativeUnit.getParent().getLongitude());
			parent.setgMapX(administrativeUnit.getParent().getgMapX());
			parent.setgMapY(administrativeUnit.getParent().getgMapY());
			parent.setTotalAcreage(administrativeUnit.getParent().getTotalAcreage());
			parent.setEmergencyPhone(administrativeUnit.getParent().getEmergencyPhone());
			parent.setHotZalo(administrativeUnit.getParent().getHotZalo());

			this.parent = new HDAdministrativeUnitDto(parent);
		}

		Set<HDAdministrativeUnitDto> administrativeUnitsDtos = new HashSet<HDAdministrativeUnitDto>();
		if (administrativeUnit != null && administrativeUnit.getSubAdministrativeUnits() != null
				&& administrativeUnit.getSubAdministrativeUnits().size() > 0) {
			for (HDAdministrativeUnit adu : administrativeUnit.getSubAdministrativeUnits()) {
				HDAdministrativeUnitDto subAdministrativeUnitsDto = new HDAdministrativeUnitDto();
				subAdministrativeUnitsDto.setId(adu.getId());
				subAdministrativeUnitsDto.setCode(adu.getCode());
				subAdministrativeUnitsDto.setName(adu.getName());
				administrativeUnitsDtos.add(subAdministrativeUnitsDto);

			}
			this.subAdministrativeUnitsDto = administrativeUnitsDtos;
		}
		this.setChildren(getListChildren(administrativeUnit));
	}

}
