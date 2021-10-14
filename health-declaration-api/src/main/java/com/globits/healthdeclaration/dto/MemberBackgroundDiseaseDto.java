package com.globits.healthdeclaration.dto;

import com.globits.core.dto.BaseObjectDto;
import com.globits.healthdeclaration.domain.MemberBackgroundDisease;

public class MemberBackgroundDiseaseDto extends BaseObjectDto {
	private MemberDto member;
	private BackgroundDiseaseDto backgroundDisease;
	
	public MemberBackgroundDiseaseDto() {
		super();
	}
	public MemberBackgroundDiseaseDto(MemberBackgroundDisease entity) {
		super();
		if(entity != null) {
			this.id = entity.getId();
			if(entity.getMember() != null) {
				this.member = new MemberDto(entity.getMember(), true);
			}
			if(entity.getBackgroundDisease() != null) {
				this.backgroundDisease = new BackgroundDiseaseDto(entity.getBackgroundDisease());
			}
		}
	}
	public MemberDto getMember() {
		return member;
	}
	public void setMember(MemberDto member) {
		this.member = member;
	}
	public BackgroundDiseaseDto getBackgroundDisease() {
		return backgroundDisease;
	}
	public void setBackgroundDisease(BackgroundDiseaseDto backgroundDisease) {
		this.backgroundDisease = backgroundDisease;
	}

}
