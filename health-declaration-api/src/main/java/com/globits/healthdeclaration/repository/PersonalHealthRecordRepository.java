package com.globits.healthdeclaration.repository;

import com.globits.healthdeclaration.domain.PersonalHealthRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PersonalHealthRecordRepository extends JpaRepository<PersonalHealthRecord, UUID> {

	@Query(" FROM PersonalHealthRecord entity where entity.familyMember.id =?1 AND lastRecord = true AND entity.id NOT IN (?2) ")
	List<PersonalHealthRecord> getListLastRecordByFamilyMemberId(UUID familyMemberId, UUID id);

	@Query(" FROM PersonalHealthRecord entity where entity.familyMember.family.id =?1 ")
	List<PersonalHealthRecord> getListByFamilyId(UUID id);

	@Query(" FROM PersonalHealthRecord entity where entity.familyMember.id =?1 ")
	List<PersonalHealthRecord> getListByFamilyMemberId(UUID id);

//    @Query("select count(entity.id) from PersonalHealthRecord entity where entity.code =?1 and (entity.id <> ?2 or ?2 is null) ")
//    Long checkCode(String code, UUID id);

}
