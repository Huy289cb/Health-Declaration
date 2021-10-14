package com.globits.healthdeclaration.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.globits.healthdeclaration.domain.HealthCareGroup;
@Repository
public interface HealthCareGroupRepository extends JpaRepository<HealthCareGroup, UUID>{
	@Query("select entity FROM HealthCareGroup entity where entity.code =?1 ")
	List<HealthCareGroup> getByCode(String code);
}
