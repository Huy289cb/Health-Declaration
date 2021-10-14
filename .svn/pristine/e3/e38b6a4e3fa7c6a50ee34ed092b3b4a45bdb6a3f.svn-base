package com.globits.healthdeclaration.dto;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import com.globits.core.dto.BaseObjectDto;
import com.globits.healthdeclaration.domain.Family;
import com.globits.healthdeclaration.domain.FamilyMember;
import com.globits.healthdeclaration.domain.PractitionerAndFamily;

public class FamilyDto extends BaseObjectDto {

    private String code;//Mã hộ gia đình
    private String name;//họ tên
    private Integer age;//tuổi
    private String phoneNumber;//SĐT
    private String detailAddress; //dia chi chi tiet
    private String email;
    private HDAdministrativeUnitDto administrativeUnit;// địa chỉ
    private Set<FamilyMemberDto> familyMembers = new HashSet<>();
	private Set<PractitionerAndFamilyDto> listPractitioner = new HashSet<>();;// Danh sách nhân viên y tế chăm sóc
    private Boolean changePass = false;

    private String password;// password khi đănng ký thành viên;
    private Integer seriusStatus;
    private String otp;// mã otp đăng ký tài khoản
	private Float height;
	private Float weight;
	private String gender;
	private Boolean isPregnant;
	private String idCardNumber;
	private String healthInsuranceCardNumber;// Số thẻ bảo hiểm y tế
    private Boolean haveBackgroundDisease = false;//Có bệnh nền
    private List<MemberBackgroundDiseaseDto> listBackgroundDisease;//danh sách bệnh nền (tiền sử bệnh)

	private Set<UUID> listUnit = new HashSet<>();
    
    public FamilyDto() {
    }
    
    public FamilyDto(Family entity) {
       this(entity, true);
    }

    public FamilyDto(Family entity, Boolean collapse) {
        if (entity != null) {
            this.setId(entity.getId());
            this.code = entity.getCode();
            this.name = entity.getName();
            this.age = entity.getAge();
            this.phoneNumber = entity.getPhoneNumber();
            this.email = entity.getEmail();
            this.detailAddress = entity.getDetailAddress();
            this.seriusStatus = entity.getSeriusStatus();
            if (entity.getAdministrativeUnit() != null) {
                this.administrativeUnit = new HDAdministrativeUnitDto(entity.getAdministrativeUnit(), true, 1);
            }
            if (collapse) {
                if (entity.getFamilyMembers() != null && entity.getFamilyMembers().size() > 0) {
                    for (FamilyMember familyMember : entity.getFamilyMembers()) {
                        this.familyMembers.add(new FamilyMemberDto(familyMember, true));
                    }
                }
                if (entity.getListPractitioner() != null && entity.getListPractitioner().size() > 0) {
                    for (PractitionerAndFamily practitionerAndFamily : entity.getListPractitioner()) {
                        this.listPractitioner.add(new PractitionerAndFamilyDto(practitionerAndFamily));
                    }
    			}
            }
        }
    }
    
    public FamilyDto(Family entity, Boolean collapse, Integer type) {
        if (entity != null) {
            this.setId(entity.getId());
            this.code = entity.getCode();
            this.name = entity.getName();
            this.age = entity.getAge();
            this.phoneNumber = entity.getPhoneNumber();
            this.email = entity.getEmail();
            this.detailAddress = entity.getDetailAddress();
            this.seriusStatus = entity.getSeriusStatus();
            if (entity.getAdministrativeUnit() != null) {
                this.administrativeUnit = new HDAdministrativeUnitDto(entity.getAdministrativeUnit(), true, type); //type =2 cộng chuỗi đươn vị hành chính
            }
            if (collapse) {
                if (entity.getFamilyMembers() != null && entity.getFamilyMembers().size() > 0) {
                    for (FamilyMember familyMember : entity.getFamilyMembers()) {
                        this.familyMembers.add(new FamilyMemberDto(familyMember, true));
                    }
                }
                if (entity.getListPractitioner() != null && entity.getListPractitioner().size() > 0) {
                    for (PractitionerAndFamily practitionerAndFamily : entity.getListPractitioner()) {
                        this.listPractitioner.add(new PractitionerAndFamilyDto(practitionerAndFamily));
                    }
    			}
            }
        }
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getDetailAddress() {
        return detailAddress;
    }

    public void setDetailAddress(String detailAddress) {
        this.detailAddress = detailAddress;
    }

    public HDAdministrativeUnitDto getAdministrativeUnit() {
        return administrativeUnit;
    }

    public void setAdministrativeUnit(HDAdministrativeUnitDto administrativeUnit) {
        this.administrativeUnit = administrativeUnit;
    }

    public Set<PractitionerAndFamilyDto> getListPractitioner() {
		return listPractitioner;
	}

	public void setListPractitioner(Set<PractitionerAndFamilyDto> listPractitioner) {
		this.listPractitioner = listPractitioner;
	}

	public Set<FamilyMemberDto> getFamilyMembers() {
        return familyMembers;
    }

    public void setFamilyMembers(Set<FamilyMemberDto> familyMembers) {
        this.familyMembers = familyMembers;
    }

	public Boolean getChangePass() {
		return changePass;
	}

	public void setChangePass(Boolean changePass) {
		this.changePass = changePass;
	}

    public Integer getSeriusStatus() {
        return seriusStatus;
    }

    public void setSeriusStatus(Integer seriusStatus) {
        this.seriusStatus = seriusStatus;
    }

	public String getOtp() {
		return otp;
	}

	public void setOtp(String otp) {
		this.otp = otp;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public Boolean getIsPregnant() {
		return isPregnant;
	}

	public void setIsPregnant(Boolean isPregnant) {
		this.isPregnant = isPregnant;
	}

	public Float getHeight() {
		return height;
	}

	public void setHeight(Float height) {
		this.height = height;
	}

	public Float getWeight() {
		return weight;
	}

	public void setWeight(Float weight) {
		this.weight = weight;
	}

	public Set<UUID> getListUnit() {
		return listUnit;
	}

	public void setListUnit(Set<UUID> listUnit) {
		this.listUnit = listUnit;
	}

	public String getIdCardNumber() {
		return idCardNumber;
	}

	public void setIdCardNumber(String idCardNumber) {
		this.idCardNumber = idCardNumber;
	}

	public String getHealthInsuranceCardNumber() {
		return healthInsuranceCardNumber;
	}

	public void setHealthInsuranceCardNumber(String healthInsuranceCardNumber) {
		this.healthInsuranceCardNumber = healthInsuranceCardNumber;
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
}

