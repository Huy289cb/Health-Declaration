package com.globits.healthdeclaration.functiondto;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.globits.healthdeclaration.dto.FamilyMemberDto;
import com.globits.healthdeclaration.dto.PractitionerDto;
import com.globits.healthdeclaration.dto.UserAdministrativeUnitDto;
import com.globits.security.dto.UserDto;

public class UserInfoDto {
	private UserAdministrativeUnitDto userUnit;
	private UserDto userDto;
	private PractitionerDto practitioner; // Nhân viên y tế
	private FamilyMemberDto familyMember;
	private boolean isAdmin = false;
	private boolean isHealthCareStaff = false; // role Nhân viên y tế
	private boolean isMedicalTeam = false; // role Tổ y tế
	private boolean isUser = false; // Hộ gia đình
	private List<UUID> listUnit = new ArrayList<>();
	public UserAdministrativeUnitDto getUserUnit() {
		return userUnit;
	}
	public void setUserUnit(UserAdministrativeUnitDto userUnit) {
		this.userUnit = userUnit;
	}
	
	public UserDto getUserDto() {
		return userDto;
	}
	public void setUserDto(UserDto userDto) {
		this.userDto = userDto;
	}
	public PractitionerDto getPractitioner() {
		return practitioner;
	}
	public void setPractitioner(PractitionerDto practitioner) {
		this.practitioner = practitioner;
	}
	public FamilyMemberDto getFamilyMember() {
		return familyMember;
	}
	public void setFamilyMember(FamilyMemberDto familyMember) {
		this.familyMember = familyMember;
	}
	public boolean isAdmin() {
		return isAdmin;
	}
	public void setAdmin(boolean isAdmin) {
		this.isAdmin = isAdmin;
	}
	public boolean isHealthCareStaff() {
		return isHealthCareStaff;
	}
	public void setHealthCareStaff(boolean isHealthCareStaff) {
		this.isHealthCareStaff = isHealthCareStaff;
	}
	public boolean isMedicalTeam() {
		return isMedicalTeam;
	}
	public void setMedicalTeam(boolean isMedicalTeam) {
		this.isMedicalTeam = isMedicalTeam;
	}
	public boolean isUser() {
		return isUser;
	}
	public void setUser(boolean isUser) {
		this.isUser = isUser;
	}
	public List<UUID> getListUnit() {
		return listUnit;
	}
	public void setListUnit(List<UUID> listUnit) {
		this.listUnit = listUnit;
	}

}
