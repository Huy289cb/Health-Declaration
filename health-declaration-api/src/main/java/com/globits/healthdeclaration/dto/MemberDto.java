package com.globits.healthdeclaration.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.globits.core.dto.PersonDto;
import com.globits.healthdeclaration.domain.Member;
import com.globits.healthdeclaration.domain.MemberBackgroundDisease;

public class MemberDto extends PersonDto {

    private String detailAddress;//đia chỉ chi tiết
    private Integer age;//tuổi
    private String healthInsuranceCardNumber;//Số thẻ bảo hiểm y tế
    private String suspectedLevel; //Cấp độ nghi nhiễm:BÌnh thường, F0, F1
    private String idCardNumber;
    private String anamnesis;//tiền sử bệnh
    private Float weight;//Cân nặng
    private Float height;//Chiều cao
    private String email;//email
    private Boolean isPregnant;//Mang thai
    private Boolean haveBackgroundDisease = false;//Có bệnh nền
	private List<MemberBackgroundDiseaseDto> listBackgroundDisease;//danh sách bệnh nền (tiền sử bệnh)
    private String noteBackgroundDiseases;

    public MemberDto(Member entity) {
        super();
        if (entity != null) {
            this.id = entity.getId();
            this.displayName = entity.getDisplayName();
            this.phoneNumber=entity.getPhoneNumber();
            this.detailAddress = entity.getDetailAddress();
            this.age = entity.getAge();
            this.weight = entity.getWeight();
            this.height = entity.getHeight();
            this.email = entity.getEmail();
            this.gender = entity.getGender();
            this.isPregnant = entity.getIsPregnant();
            this.haveBackgroundDisease = entity.getHaveBackgroundDisease();
            this.healthInsuranceCardNumber = entity.getHealthInsuranceCardNumber();
            this.idCardNumber = entity.getIdCardNumber();
            this.anamnesis = entity.getAnamnesis();
            this.suspectedLevel = entity.getSuspectedLevel();
            this.noteBackgroundDiseases = entity.getNoteBackgroundDiseases();
            if (entity.getListBackgroundDisease() != null && entity.getListBackgroundDisease().size() > 0) {
                this.listBackgroundDisease = new ArrayList<>();
                for (MemberBackgroundDisease memberBackgroundDisease : entity.getListBackgroundDisease()) {
                    this.listBackgroundDisease.add(new MemberBackgroundDiseaseDto(memberBackgroundDisease));
                }
            }
        }
    }

    public MemberDto(Member entity, boolean simple) {
        super();
        if (entity != null) {
            this.id = entity.getId();
            this.displayName = entity.getDisplayName();
            this.phoneNumber=entity.getPhoneNumber();
            this.weight = entity.getWeight();
            this.height = entity.getHeight();
            this.email = entity.getEmail();
            this.gender = entity.getGender();
            this.isPregnant = entity.getIsPregnant();
            this.haveBackgroundDisease = entity.getHaveBackgroundDisease();
            this.detailAddress = entity.getDetailAddress();
            this.age = entity.getAge();
            this.healthInsuranceCardNumber = entity.getHealthInsuranceCardNumber();
            this.idCardNumber = entity.getIdCardNumber();
            this.anamnesis = entity.getAnamnesis();
            this.suspectedLevel = entity.getSuspectedLevel();
            this.noteBackgroundDiseases = entity.getNoteBackgroundDiseases();
        }
    }

    public MemberDto() {

    }

    public String getDetailAddress() {
        return detailAddress;
    }

    public void setDetailAddress(String detailAddress) {
        this.detailAddress = detailAddress;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getHealthInsuranceCardNumber() {
        return healthInsuranceCardNumber;
    }

    public void setHealthInsuranceCardNumber(String healthInsuranceCardNumber) {
        this.healthInsuranceCardNumber = healthInsuranceCardNumber;
    }

    public String getIdCardNumber() {
		return idCardNumber;
	}

	public void setIdCardNumber(String idCardNumber) {
		this.idCardNumber = idCardNumber;
	}

	public String getAnamnesis() {
        return anamnesis;
    }

    public void setAnamnesis(String anamnesis) {
        this.anamnesis = anamnesis;
    }

	public Float getWeight() {
		return weight;
	}

	public void setWeight(Float weight) {
		this.weight = weight;
	}

	
	public Float getHeight() {
		return height;
	}

	public void setHeight(Float height) {
		this.height = height;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Boolean getIsPregnant() {
		return isPregnant;
	}

	public void setIsPregnant(Boolean isPregnant) {
		this.isPregnant = isPregnant;
	}

	public Boolean getHaveBackgroundDisease() {
		return haveBackgroundDisease;
	}

	public void setHaveBackgroundDisease(Boolean haveBackgroundDisease) {
		this.haveBackgroundDisease = haveBackgroundDisease;
	}

	public List<MemberBackgroundDiseaseDto> getListBackgroundDisease() {
		return listBackgroundDisease;
	}

	public void setListBackgroundDisease(List<MemberBackgroundDiseaseDto> listBackgroundDisease) {
		this.listBackgroundDisease = listBackgroundDisease;
	}

	public String getSuspectedLevel() {
		return suspectedLevel;
	}

	public void setSuspectedLevel(String suspectedLevel) {
		this.suspectedLevel = suspectedLevel;
	}

    public String getNoteBackgroundDiseases() {
        return noteBackgroundDiseases;
    }

    public void setNoteBackgroundDiseases(String noteBackgroundDiseases) {
        this.noteBackgroundDiseases = noteBackgroundDiseases;
    }
}
