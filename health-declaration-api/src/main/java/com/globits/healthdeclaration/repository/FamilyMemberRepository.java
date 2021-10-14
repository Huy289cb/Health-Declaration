package com.globits.healthdeclaration.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.globits.healthdeclaration.domain.FamilyMember;
import com.globits.healthdeclaration.domain.Member;
import com.globits.healthdeclaration.dto.MemberDto;

@Repository
public interface FamilyMemberRepository extends JpaRepository<FamilyMember, UUID> {

    @Query(" from FamilyMember entity where entity.id =?1 ")
	FamilyMember getById(UUID id);

    @Query(" from FamilyMember entity where entity.member.id =?1 ")
	List<FamilyMember> getByMemberId(UUID id);
    
    @Query(" from FamilyMember entity where entity.member.healthInsuranceCardNumber =?1 ")
	List<FamilyMember> getByInsurance(String insurance);
    
    @Query(" from FamilyMember entity where entity.member.idCardNumber =?1 ")
	List<FamilyMember> getByIdCardNumber(String idCardNumber);

    @Query(" from FamilyMember entity where entity.family.id =?1 ")
	List<FamilyMember> getByFamilyId(UUID id);

    @Query("select new com.globits.healthdeclaration.dto.MemberDto(entity.member, false) from FamilyMember entity where entity.family.id = ?1 ")
    List<MemberDto> listMembers(UUID idFamily);
}
