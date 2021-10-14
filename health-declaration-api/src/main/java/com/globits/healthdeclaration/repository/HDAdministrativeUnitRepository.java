package com.globits.healthdeclaration.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.globits.healthdeclaration.domain.HDAdministrativeUnit;
import com.globits.healthdeclaration.dto.HDAdministrativeUnitDto;

@Repository
public interface HDAdministrativeUnitRepository extends JpaRepository<HDAdministrativeUnit, UUID> {
	
	@Query("select u.id from HDAdministrativeUnit u  where u.parent.id = ?1")
	List<UUID> getAllIdByParentId(UUID parentId);
	
	@Query("select COUNT(u.id) from HDAdministrativeUnit u  where u.parent.id = ?1")
	Integer countIdByParentId(UUID parentId);

	List<HDAdministrativeUnit> getAllEntityByParentId(UUID uuid);

	List<HDAdministrativeUnitDto> getAllByParentId(UUID parentId);

	HDAdministrativeUnitDto getById(UUID parentId);
	
	@Query("select u from HDAdministrativeUnit u  where u.id = ?1")
	HDAdministrativeUnit findById(Long id);
	
	@Query("SELECT u FROM HDAdministrativeUnit u WHERE u.name = ?1 and u.level = ?2 ")
	List<HDAdministrativeUnit> findByName(String name, Integer level);
	
	@Query("SELECT u FROM HDAdministrativeUnit u WHERE u.name = ?1 and u.parent.id = ?2 and u.level = ?3")
	List<HDAdministrativeUnit> findByNameAndParent(String name, UUID id, Integer level);
	
	@Query("SELECT count(u) FROM HDAdministrativeUnit u WHERE u.level = ?1 ")
	Integer countCity(Integer level);
	
	@Query("SELECT count(u) FROM HDAdministrativeUnit u WHERE u.parent.id = ?1 and u.level = ?2 ")
	Integer countAdministrativeUnit(UUID patient, Integer level);

	@Query("select u from HDAdministrativeUnit u  where u.id = ?1")
	HDAdministrativeUnit findOne(UUID parentId);

	List<HDAdministrativeUnit> findListByCode(String code);

	@Query("select new com.globits.healthdeclaration.dto.HDAdministrativeUnitDto(administrative,true) from HDAdministrativeUnit administrative ")
	List<HDAdministrativeUnitDto> getAll();

	@Query("select new com.globits.healthdeclaration.dto.HDAdministrativeUnitDto(administrative,true, 1) from HDAdministrativeUnit administrative ")
	List<HDAdministrativeUnitDto> getAllBasic();

	@Query("select new com.globits.healthdeclaration.dto.HDAdministrativeUnitDto(administrative,true, 1) from HDAdministrativeUnit administrative WHERE administrative.id NOT IN(?1) ")
	List<HDAdministrativeUnitDto> getAllBasicInEdit(UUID id);
	
	@Query("select administrative from HDAdministrativeUnit administrative WHERE administrative.name =?1 and administrative.parent.name =?2 ")
	List<HDAdministrativeUnit> getAdministrativeUnitByName(String  name ,String parentName );

	@Query("select administrative from HDAdministrativeUnit administrative WHERE administrative.parent.id =?2 and (administrative.code LIKE ?1 OR administrative.name LIKE ?1) ")
	List<HDAdministrativeUnit> getByNameOrCodeAndParentId(String nameCode, UUID id);

	@Query("select administrative from HDAdministrativeUnit administrative WHERE administrative.parent IS NULL AND (administrative.code LIKE ?1 OR administrative.name LIKE ?1) ")
	List<HDAdministrativeUnit> getProvinceByNameOrCode(String provinceImport);
}
