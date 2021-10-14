package com.globits.healthdeclaration.repository;

import com.globits.healthdeclaration.domain.PersonalHealthRecordSymptom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PersonalHealthRecordSymptomRepository extends JpaRepository<PersonalHealthRecordSymptom, UUID> {

}
