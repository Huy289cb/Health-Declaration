package com.globits.healthdeclaration.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.globits.healthdeclaration.domain.PractitionerAndFamily;

@Repository
public interface PractitionerAndFamilyRepository extends JpaRepository<PractitionerAndFamily, UUID> {

	@Query(" FROM PractitionerAndFamily entity where entity.family.id =?1 AND entity.practitioner.id =?2 AND entity.type=?3 ")
	List<PractitionerAndFamily> getBy(UUID familyId, UUID practitionerId, Integer type);
	
	@Query(" FROM PractitionerAndFamily entity where entity.family.id =?1 AND entity.type=?2 ")
	List<PractitionerAndFamily> getBy(UUID familyId, Integer type);

	@Query(" FROM PractitionerAndFamily entity where entity.family.id =?1 ")
	List<PractitionerAndFamily> getByFamilyId(UUID familyId);

	@Query(" SELECT COUNT(DISTINCT entity.id) FROM PractitionerAndFamily entity where entity.family.id =?1 AND entity.practitioner.id =?2 ")
	Integer countAllByIdAndInListAdministrativeUnitId(UUID familyId, UUID practitionerId);

}
