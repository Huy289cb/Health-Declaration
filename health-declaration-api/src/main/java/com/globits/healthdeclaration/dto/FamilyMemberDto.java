package com.globits.healthdeclaration.dto;

import com.globits.core.dto.BaseObjectDto;
import com.globits.healthdeclaration.domain.FamilyMember;

public class FamilyMemberDto extends BaseObjectDto {
    private FamilyDto family;
    private MemberDto member;
    private boolean hostFamily;//là chủ hộ?
    private String relationship;//mối quan hệ
    
    public FamilyMemberDto() {
    }

    public FamilyMemberDto(FamilyMember entity, Boolean collapse) {
        if (entity != null) {
        	this.id = entity.getId();
            if (entity.getMember() != null) {
                this.member = new MemberDto(entity.getMember());
            }
            this.hostFamily = entity.getHostFamily();
            this.relationship = entity.getRelationship();
            if (collapse) {
                if (entity.getFamily() != null) {
                    this.family = new FamilyDto(entity.getFamily(), false, 2);
                }
            }
        }
    }

	public FamilyMemberDto(FamilyMember entity) {
		if(entity != null){
			id = entity.getId();
			hostFamily = entity.getHostFamily();
			relationship = entity.getRelationship();

			if(entity.getFamily() != null){
				family = new FamilyDto(entity.getFamily());
			}

			if(entity.getMember() != null){
				member = new MemberDto(entity.getMember());
			}
		}
	}

    public FamilyDto getFamily() {
        return family;
    }

    public void setFamily(FamilyDto family) {
        this.family = family;
    }

    public MemberDto getMember() {
        return member;
    }

    public void setMember(MemberDto member) {
        this.member = member;
    }

    public boolean isHostFamily() {
		return hostFamily;
	}

	public void setHostFamily(boolean hostFamily) {
		this.hostFamily = hostFamily;
	}

	public String getRelationship() {
        return relationship;
    }

    public void setRelationship(String relationship) {
        this.relationship = relationship;
    }
  
}
