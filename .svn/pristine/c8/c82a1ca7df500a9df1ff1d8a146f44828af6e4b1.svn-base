package com.globits.healthdeclaration.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.globits.healthdeclaration.domain.CommonKeyCode;

@Repository
public interface CommonKeyCodeRepository extends JpaRepository<CommonKeyCode, UUID> {

	@Query("from CommonKeyCode a where a.type=?1 ")
	CommonKeyCode getByType(int value);

}
