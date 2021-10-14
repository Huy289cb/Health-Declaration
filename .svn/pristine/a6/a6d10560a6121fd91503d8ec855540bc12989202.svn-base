package com.globits.healthdeclaration.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.globits.healthdeclaration.domain.UserAdministrativeUnit;
import com.globits.healthdeclaration.dto.UserAdministrativeUnitDto;
import com.globits.security.domain.User;

@Repository
public interface UserAdministrativeUnitRepository extends JpaRepository<UserAdministrativeUnit, UUID> {
	@Query("select entity FROM UserAdministrativeUnit entity where entity.user.email =?1 ")
	List<UserAdministrativeUnit> findByEmail(String email);
	
	@Query("select entity FROM UserAdministrativeUnit entity where entity.user.username =?1 ")
	List<UserAdministrativeUnit> findByusername(String username);
	
	@Query("select entity FROM UserAdministrativeUnit entity where entity.user.id =?1 ")
	List<UserAdministrativeUnit> getAllByUserId(Long id);
	
	@Query("select new com.globits.healthdeclaration.dto.UserAdministrativeUnitDto(entity) FROM UserAdministrativeUnit entity where entity.user.id =?1 ")
	List<UserAdministrativeUnitDto> getAllOrgByUserId(Long id);
	
	@Query("select new com.globits.healthdeclaration.dto.UserAdministrativeUnitDto(entity) FROM UserAdministrativeUnit entity where entity.user.id =?1 ")
	List<UserAdministrativeUnitDto> getByUserId(Long id);

	@Query(" FROM User entity where entity.username =?1 AND entity.person IS NOT NULL ")
	List<User> findByUsername(String phoneNumber);
	
	@Query("SELECT COUNT(entity.id) from UserAdministrativeUnit entity WHERE entity.administrativeUnit.id = ?1")
	Integer countUserAdministrativeUnitByUnit(UUID id);

	@Query(" FROM User entity where entity.username =?1 AND entity.active = false ")
	User getUserByUserNameInCreateFamily(String phoneNumber);

}
