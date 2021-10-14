package com.globits.healthdeclaration.repository;

import com.globits.healthdeclaration.domain.Family;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FamilyRepository extends JpaRepository<Family, UUID> {
    @Query("select count(entity.id) from Family entity where entity.code =?1 and (entity.id <> ?2 or ?2 is null) ")
    Long checkCode(String code, UUID id);

    @Query(" from Family entity where entity.code =?1 ")
	List<Family> findByCode(String code);

    @Query(" from Family entity where entity.phoneNumber =?1 ")
	List<Family> findByPhoneNumber(String phoneNumber);

    @Query(" SELECT COUNT(DISTINCT entity.id) from Family entity where entity.id =?1 AND entity.administrativeUnit.id IN (?2) ")
	Integer countAllByIdAndInListAdministrativeUnitId(UUID id, List<UUID> listUnit);
    
    @Query("SELECT COUNT(entity.id) from Family entity WHERE entity.administrativeUnit.id = ?1")
    Integer countFamilyByUnit(UUID id);

}
