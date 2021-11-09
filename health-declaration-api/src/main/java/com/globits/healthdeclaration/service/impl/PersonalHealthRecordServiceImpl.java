package com.globits.healthdeclaration.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashSet;
import java.util.Hashtable;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import com.globits.healthdeclaration.domain.*;
import com.globits.healthdeclaration.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.globits.core.service.impl.GenericServiceImpl;
import com.globits.healthdeclaration.HealthDeclarationEnumsType;
import com.globits.healthdeclaration.HealthDeclarationEnumsType.PersonalHealthRecordSeriusStatus;
import com.globits.healthdeclaration.dto.FamilyDto;
import com.globits.healthdeclaration.dto.MemberDto;
import com.globits.healthdeclaration.dto.PersonalHealthRecordDto;
import com.globits.healthdeclaration.dto.PersonalHealthRecordSymptomDto;
import com.globits.healthdeclaration.functiondto.HealthRecordReportDto;
import com.globits.healthdeclaration.functiondto.PersonalHealthRecordSearchDto;
import com.globits.healthdeclaration.functiondto.ReportResultDto;
import com.globits.healthdeclaration.functiondto.UserInfoDto;
import com.globits.healthdeclaration.service.FamilyMemberService;
import com.globits.healthdeclaration.service.FamilyService;
import com.globits.healthdeclaration.service.HDAdministrativeUnitService;
import com.globits.healthdeclaration.service.HealthCareGroupService;
import com.globits.healthdeclaration.service.PersonalHealthRecordService;
import com.globits.healthdeclaration.service.PersonalHealthRecordSymptomService;
import com.globits.healthdeclaration.service.UserAdministrativeUnitService;

@Transactional
@Service
public class PersonalHealthRecordServiceImpl extends GenericServiceImpl<PersonalHealthRecord, UUID>
		implements PersonalHealthRecordService {

	@Autowired
	private EntityManager manager;

	@Autowired
	private PersonalHealthRecordRepository repository;
	
	@Autowired
	private FamilyRepository familyRepository;
	
	@Autowired
	private FamilyMemberRepository familyMemberRepository;

	@Autowired
	private PersonalHealthRecordSymptomService personalHealthRecordSymptomService;

	@Autowired
	private PersonalHealthRecordSymptomRepository personalHealthRecordSymptomRepository;

	@Autowired
	private SymptomRepository symptomRepository;

	@Autowired
	private FamilyMemberService familyMemberService;

	@Autowired
	private UserAdministrativeUnitService userAdministrativeUnitService;

	@Autowired
	private UserAdministrativeUnitRepository userAdministrativeUnitRepository;

//    @Autowired
//    private AdministrativeUnitService administrativeUnitService;

	@Autowired
	HDAdministrativeUnitService hdAdministrativeUnitService;

	@Autowired
	private FamilyService familyService;

	@Autowired
	private PractitionerRepository practitionerRepository;

	@Autowired
	private HealthCareGroupService healthCareGroupService;

	@Autowired
	private HealthOrganizationRepository healthOrganizationRepository;

	@Autowired
	private PractitionerAndFamilyRepository practitionerAndFamilyRepository;
	@Autowired
	private MemberRepository memberRepository; 

	@Override
	public Page<PersonalHealthRecordDto> searchByDto(PersonalHealthRecordSearchDto dto) {
		UserInfoDto userInfo = userAdministrativeUnitService.getAllInfoByUserLogin();
		if (dto == null || userInfo == null) {
			return null;
		}
		int pageIndex = dto.getPageIndex();
		int pageSize = dto.getPageSize();

		if (pageIndex > 0) {
			pageIndex--;
		} else {
			pageIndex = 0;
		}
		List<UUID> listAdministrativeUnitId = null;
		if(!userInfo.isAdmin() && userInfo.isUser()) {
			if (userInfo.getFamilyMember() != null && userInfo.getFamilyMember().getFamily() != null
					 && userInfo.getFamilyMember().getFamily().getId() != null) {
				dto.setFamilyId(userInfo.getFamilyMember().getFamily().getId());
			}
			else {
				return new PageImpl<PersonalHealthRecordDto>(new ArrayList<PersonalHealthRecordDto>(),
						PageRequest.of(pageIndex, pageSize), 0);
			}
		}
		
		if (userInfo.isHealthCareStaff()) {
			if (userInfo.getUserDto() != null && userInfo.getUserDto().getPerson() != null) {
				dto.setPractitionerId(userInfo.getUserDto().getPerson().getId());
			} else {
				return new PageImpl<PersonalHealthRecordDto>(new ArrayList<PersonalHealthRecordDto>(),
						PageRequest.of(pageIndex, pageSize), 0);
			}
			/*
			 * if (userInfo.getListUnit() != null && userInfo.getListUnit().size() > 0) {
			 * listAdministrativeUnitId = new ArrayList<UUID>();
			 * listAdministrativeUnitId.addAll(userInfo.getListUnit()); } else { return new
			 * PageImpl<PersonalHealthRecordDto>(new ArrayList<PersonalHealthRecordDto>(),
			 * PageRequest.of(pageIndex, pageSize), 0); }
			 */
		}
		if (userInfo.isMedicalTeam()) {
			if (userInfo.getUserUnit() != null && userInfo.getUserUnit().getHealthCareGroup() != null) {
				dto.setHealthCareGroupId(userInfo.getUserUnit().getHealthCareGroup().getId());
			} else {
				return new PageImpl<PersonalHealthRecordDto>(new ArrayList<PersonalHealthRecordDto>(),
						PageRequest.of(pageIndex, pageSize), 0);
			}
		}
		if (dto.getAdministrativeUnitId() != null) {
			listAdministrativeUnitId = new ArrayList<UUID>();
			listAdministrativeUnitId.add(dto.getAdministrativeUnitId());
			listAdministrativeUnitId.addAll(
					hdAdministrativeUnitService.getAllHDAdministrativeUnitIdByParentId(dto.getAdministrativeUnitId()));
		}
		if (dto.getHealthCareGroupId() != null) {
			listAdministrativeUnitId = new ArrayList<UUID>();
			List<UUID> lst = healthCareGroupService.getAllAdministrativeUnitIdById(dto.getHealthCareGroupId());
			listAdministrativeUnitId.addAll(lst);
			if (listAdministrativeUnitId == null || listAdministrativeUnitId.size() <= 0) {
				return new PageImpl<PersonalHealthRecordDto>(new ArrayList<PersonalHealthRecordDto>(),
						PageRequest.of(pageIndex, pageSize), 0);
			}
		}

		String joinSql = "  ";
		String whereClause = " where (1=1) ";
		String orderBy = " ORDER BY  entity.seriusStatus desc, entity.createDate desc ";
		if (dto.getShowHistoryForm() != null && dto.getShowHistoryForm()) {
			orderBy = " ORDER BY entity.createDate desc ";
		}
		String sqlCount = "select count(DISTINCT entity.id) from PersonalHealthRecord as entity ";
		String sql = "select DISTINCT new com.globits.healthdeclaration.dto.PersonalHealthRecordDto(entity, true) from PersonalHealthRecord as entity ";

		if (dto.getType() != null) {
			whereClause += " AND (entity.type = :type) ";
		}
		if (dto.getPractitionerId() != null) {
			joinSql += " LEFT JOIN PractitionerAndFamily paf ON paf.family.id = entity.familyMember.family.id ";
			whereClause += " AND paf.practitioner.id = :practitionerId ";
		}
		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			whereClause += " AND (entity.familyMember.family.name LIKE :text " +
					"OR entity.familyMember.family.phoneNumber LIKE :text " +
					"OR entity.familyMember.relationship LIKE :text ) ";
		}

		if (dto.getFamilyMemberId() != null) {
			whereClause += " AND (entity.familyMember.id = :familyMemberId) ";
		}
		if (dto.getFamilyId() != null) {
			whereClause += " AND (entity.familyMember.family.id = :familyId) ";
		}
        if (dto.getResolveStatus() != null) {
            whereClause += "AND (entity.resolveStatus = :resolveStatus) ";
        }
		if (dto.getLastRecord() != null) {
			whereClause += " AND (entity.lastRecord = :lastRecord) ";
		}
		if (listAdministrativeUnitId != null && listAdministrativeUnitId.size() > 0) {
			whereClause += " AND ( entity.familyMember.family.administrativeUnit.id IN (:listAdministrativeUnitId) ) ";
		}
		sql += joinSql + whereClause + orderBy;
		sqlCount += joinSql + whereClause;
		Query q = manager.createQuery(sql, PersonalHealthRecordDto.class);
		Query qCount = manager.createQuery(sqlCount);

		if (dto.getType() != null) {
			q.setParameter("type", dto.getType());
			qCount.setParameter("type", dto.getType());
		}
		if (dto.getPractitionerId() != null) {
			q.setParameter("practitionerId", dto.getPractitionerId());
			qCount.setParameter("practitionerId", dto.getPractitionerId());
		}
		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			q.setParameter("text", '%' + dto.getText().trim() + '%');
			qCount.setParameter("text", '%' + dto.getText().trim() + '%');
		}
		if (dto.getFamilyMemberId() != null) {
			q.setParameter("familyMemberId", dto.getFamilyMemberId());
			qCount.setParameter("familyMemberId", dto.getFamilyMemberId());
		}
		if (dto.getFamilyId() != null) {
			q.setParameter("familyId", dto.getFamilyId());
			qCount.setParameter("familyId", dto.getFamilyId());
		}
        if (dto.getResolveStatus() != null) {
            q.setParameter("resolveStatus", dto.getResolveStatus());
            qCount.setParameter("resolveStatus", dto.getResolveStatus());
        }
		if (dto.getLastRecord() != null) {
			q.setParameter("lastRecord", dto.getLastRecord());
			qCount.setParameter("lastRecord", dto.getLastRecord());
		}
		if (listAdministrativeUnitId != null && listAdministrativeUnitId.size() > 0) {
			q.setParameter("listAdministrativeUnitId", listAdministrativeUnitId);
			qCount.setParameter("listAdministrativeUnitId", listAdministrativeUnitId);
		}
		int startPosition = pageIndex * pageSize;
		q.setFirstResult(startPosition);
		q.setMaxResults(pageSize);
		List<PersonalHealthRecordDto> entities = q.getResultList();
		long count = (long) qCount.getSingleResult();

		Pageable pageable = PageRequest.of(pageIndex, pageSize);
		Page<PersonalHealthRecordDto> result = new PageImpl<PersonalHealthRecordDto>(entities, pageable, count);

		return result;
	}

	@Override
	public PersonalHealthRecordDto getById(UUID id) {
		if (id != null) {
			PersonalHealthRecord entity = repository.getOne(id);
			if (entity != null) {
				return new PersonalHealthRecordDto(entity, true);
			}
		}
		return null;
	}

	@Override
	public PersonalHealthRecordDto saveOrUpdate(PersonalHealthRecordDto dto, UUID id) {
		UserInfoDto userInfo = userAdministrativeUnitService.getAllInfoByUserLogin();
		if (dto != null && hasEditPermision(dto, id, userInfo)) {
			boolean updateLastRecord = false;
			PersonalHealthRecord entity = null;
			if (id != null) {
				entity = repository.getOne(id);
			}
			if (entity == null) {
				updateLastRecord = true;
				entity = new PersonalHealthRecord();
				entity.setResolveStatus(
						HealthDeclarationEnumsType.PersonalHealthRecordResolveStatus.NoProcess.getValue());
				entity.setLastRecord(true);
				if (dto.getType() == null) {
					entity.setType(HealthDeclarationEnumsType.PersonalHealthRecordType.family.getValue());
				}
			}
			if (dto.getType() != null) {
				entity.setType(dto.getType());
			}
			entity.setOtherInformation(dto.getOtherInformation());
			entity.setMakeDecision(dto.getMakeDecision());
			entity.setBreathingRate(dto.getBreathingRate());
			entity.setSpo2(dto.getSpo2());
			entity.setTemperature(dto.getTemperature());
			entity.setContactPersonName(dto.getContactPersonName());
			entity.setContactPersonPhone(dto.getContactPersonPhone());
			entity.setContactPersonRelation(dto.getContactPersonRelation());
			entity.setDiastolicBloodPressure(dto.getDiastolicBloodPressure());
			entity.setSystolicBloodPressure(dto.getSystolicBloodPressure());
			entity.setHaveTest(dto.getHaveTest());
			entity.setHaveQuickTest(dto.getHaveQuickTest());
			entity.setQuickTestResults(dto.getQuickTestResults());
			entity.setHavePCR(dto.getHavePCR());
			entity.setPcrResults(dto.getPcrResults());
			entity.setQuickTestDate(dto.getQuickTestDate());
			entity.setPcrTestDate(dto.getPcrTestDate());
			entity.setHaveSymptom(dto.getHaveSymptom());
			entity.setSymptomText(dto.getSymptomText());

			if (dto.getPractitioner() != null && dto.getPractitioner().getId() != null) {
				Practitioner practitioner = practitionerRepository.getOne(dto.getPractitioner().getId());
				if (practitioner != null && practitioner.getId() != null) {
					entity.setPractitioner(practitioner);
				}
			}

			if (dto.getMedicalTeam() != null && dto.getMedicalTeam().getId() != null) {
				UserAdministrativeUnit medicalTeam = userAdministrativeUnitRepository
						.getOne(dto.getMedicalTeam().getId());
				if (medicalTeam != null && medicalTeam.getId() != null) {
					entity.setMedicalTeam(medicalTeam);
				}
			}

			if (dto.getHealthOrganization() != null && dto.getHealthOrganization().getId() != null) {
				HealthOrganization healthOrganization = healthOrganizationRepository
						.getOne(dto.getHealthOrganization().getId());
				if (healthOrganization != null && healthOrganization.getId() != null) {
					entity.setHealthOrganization(healthOrganization);
				}
			}

			if (dto.getResolveStatus() != null) {
				entity.setResolveStatus(dto.getResolveStatus());
			} else {
				entity.setResolveStatus(
						HealthDeclarationEnumsType.PersonalHealthRecordResolveStatus.Processing.getValue());
				//nếu hướng xử lý là chuyển đi cấp cứu => trạng thái xử lý = đã xử lý
				if (dto.getMakeDecision() != null && dto.getMakeDecision().equals(HealthDeclarationEnumsType.EncounterMakeDecision.decision1)) {
					entity.setResolveStatus(
							HealthDeclarationEnumsType.PersonalHealthRecordResolveStatus.Processed.getValue());
				}
			}
			entity.setSeriusStatus(HealthDeclarationEnumsType.PersonalHealthRecordSeriusStatus.Level0.getValue());
			// nếu có triệu chứng nhẹ: seriusStatus: 1
//			if ((dto.getNomalSystoms() != null && dto.getNomalSystoms().size() > 0)) {
//				entity.setSeriusStatus(HealthDeclarationEnumsType.PersonalHealthRecordSeriusStatus.Level1.getValue());
//			}
//			// nếu có triệu chứng nặng: seriusStatus: 2
//			if (dto.getSevereSymptoms() != null && dto.getSevereSymptoms().size() > 0) {
//				entity.setSeriusStatus(HealthDeclarationEnumsType.PersonalHealthRecordSeriusStatus.Level2.getValue());
//			}
//			// nếu nhịp thở > 24 : seriusStatus: 3
//			if ((dto.getBreathingRate() != null
//					&& (dto.getBreathingRate() >= HealthDeclarationEnumsType.PersonalHealthRecordBreathingRate.opt4
//							.getValue()))) {
//				entity.setSeriusStatus(HealthDeclarationEnumsType.PersonalHealthRecordSeriusStatus.Level3.getValue());
//			}

			entity.setDeclarationTime(new Date());

			if (dto.getFamilyMember() != null && dto.getFamilyMember().getId() != null) {
				//Cập nhật cấp dộ nghi nhiêm cho các thành viên gia đình
				familyMemberService.saveOrUpdate(dto.getFamilyMember().getId(), dto.getFamilyMember());
				FamilyMember familyMember = familyMemberRepository.getOne(dto.getFamilyMember().getId());
				if(dto.getQuickTestResults() == HealthDeclarationEnumsType.ResultType.positive.getValue() || dto.getPcrResults() == HealthDeclarationEnumsType.ResultType.positive.getValue()) {
					updateSuspectedLevel(familyMember);
				}
				
//				// nếu spo2 < 90 hoặc 94 (nếu không có bệnh nền): seriusStatus: 3
//				if (dto.getSpo2() != null
//						&& dto.getSpo2() <= HealthDeclarationEnumsType.PersonalHealthRecordSpO2.opt2.getValue()) {
//					entity.setSeriusStatus(
//							HealthDeclarationEnumsType.PersonalHealthRecordSeriusStatus.Level3.getValue());
//				}
//				// hoặc 94 (nếu không có bệnh nền): seriusStatus: 3
//				if (familyMember.getMember() != null
//						&& (familyMember.getMember().getHaveBackgroundDisease() == null || familyMember.getMember().getHaveBackgroundDisease() == false)
//						&& dto.getSpo2() != null
//						&& dto.getSpo2() <= HealthDeclarationEnumsType.PersonalHealthRecordSpO2.opt5.getValue()) {
//					entity.setSeriusStatus(
//							HealthDeclarationEnumsType.PersonalHealthRecordSeriusStatus.Level3.getValue());
//				}
				if (familyMember != null && familyMember.getMember() != null) {
					//Mức nguy cơ trung bình
					//1. tuổi từ 46-64 và k mắc bệnh nền
					//2. sốt > 37.5, ho, đau họng, rát họng, đau ngực
					//3. sp02 95- 96%
					//4. tuôi <= 45 và mắc bệnh lý nền
					if (familyMember.getMember().getAge() != null && familyMember.getMember().getAge() > 45 && familyMember.getMember().getAge() < 65) {
						entity.setSeriusStatus(HealthDeclarationEnumsType.PersonalHealthRecordSeriusStatus.Level1.getValue());
					}
					if (dto.getTemperature() != null && dto.getTemperature() > HealthDeclarationEnumsType.PersonalHealthRecordTemperature.opt3.getValue()) {
						entity.setSeriusStatus(HealthDeclarationEnumsType.PersonalHealthRecordSeriusStatus.Level1.getValue());
					}
					if (dto.getSpo2() != null && dto.getSpo2().equals(HealthDeclarationEnumsType.PersonalHealthRecordSpO2.opt6.getValue())) {
						entity.setSeriusStatus(HealthDeclarationEnumsType.PersonalHealthRecordSeriusStatus.Level1.getValue());
					}
					if (familyMember.getMember().getAge() != null && familyMember.getMember().getAge() <= 45 && familyMember.getMember().getHaveBackgroundDisease() != null && familyMember.getMember().getHaveBackgroundDisease()) {
						entity.setSeriusStatus(HealthDeclarationEnumsType.PersonalHealthRecordSeriusStatus.Level1.getValue());
					}

					//Mức nguy cơ cao
					//1. tuồi >= 65 và không mắc bệnh nền
					//2. Phụ nữ có thai
					//3. dưới 5 tuổi
					//4. spo2 từ 93-94%
					if (familyMember.getMember().getAge() != null && familyMember.getMember().getAge() >= 65) {
						entity.setSeriusStatus(HealthDeclarationEnumsType.PersonalHealthRecordSeriusStatus.Level2.getValue());
					}
					if (familyMember.getMember().getGender() != null && familyMember.getMember().getGender().equals("F") && familyMember.getMember().getIsPregnant() != null && familyMember.getMember().getIsPregnant()) {
						entity.setSeriusStatus(HealthDeclarationEnumsType.PersonalHealthRecordSeriusStatus.Level2.getValue());
					}
					if (familyMember.getMember().getAge() != null && familyMember.getMember().getAge() < 5) {
						entity.setSeriusStatus(HealthDeclarationEnumsType.PersonalHealthRecordSeriusStatus.Level2.getValue());
					}
					//4. đang k có mức 93-94% nên theo mức opt5=94
					if (dto.getSpo2() != null && dto.getSpo2().equals(HealthDeclarationEnumsType.PersonalHealthRecordSpO2.opt5.getValue())) {
						entity.setSeriusStatus(HealthDeclarationEnumsType.PersonalHealthRecordSeriusStatus.Level2.getValue());
					}

					//Mức nguy cơ rất cao
					//1. Tuổi >=65 và mắc bệnh lý nền
					//2. người bệnh đang trong tình trạng cấp cứu
					//3. spo2 <= 92
					//4. người bệnh đang có tình trạng: thở máy, có ống mở khí quản, liệt tứ chi, đang điều trị hoá trị

					if (familyMember.getMember().getAge() != null && familyMember.getMember().getAge() >= 65 && familyMember.getMember().getHaveBackgroundDisease() != null && familyMember.getMember().getHaveBackgroundDisease() != null && familyMember.getMember().getHaveBackgroundDisease()) {
						entity.setSeriusStatus(HealthDeclarationEnumsType.PersonalHealthRecordSeriusStatus.Level3.getValue());
					}
					if (dto.getSpo2() != null && dto.getSpo2() < HealthDeclarationEnumsType.PersonalHealthRecordSpO2.opt5.getValue()) {
						entity.setSeriusStatus(HealthDeclarationEnumsType.PersonalHealthRecordSeriusStatus.Level3.getValue());
					}

					//nếu chuyển đi cấp cứu = đã xử lý = mức nguy cơ = 0
					if (dto.getMakeDecision() != null && dto.getMakeDecision().equals(HealthDeclarationEnumsType.EncounterMakeDecision.decision1)) {
						entity.setSeriusStatus(HealthDeclarationEnumsType.PersonalHealthRecordSeriusStatus.Level0.getValue());
					}
				}
				entity.setFamilyMember(familyMember);
			} else {
				entity.setFamilyMember(null);
			}

			if (dto.getNomalSystoms() != null && dto.getNomalSystoms().size() > 0) {
				Set<PersonalHealthRecordSymptom> nomalSymtomSet = new HashSet<>();
				for (PersonalHealthRecordSymptomDto nomalSymtomDto : dto.getNomalSystoms()) {
					PersonalHealthRecordSymptom phrs = new PersonalHealthRecordSymptom();

					if (nomalSymtomDto.getSymptom() != null && nomalSymtomDto.getSymptom().getId() != null) {
						Symptom symptom = symptomRepository.getOne(nomalSymtomDto.getSymptom().getId());
						if (symptom != null) {
							phrs.setSymptom(symptom);
							phrs.setRecord(entity);
							phrs.setType(HealthDeclarationEnumsType.SymptomType.type1.getNumber());

							nomalSymtomSet.add(phrs);
						}
					}
				}

				if (entity.getNomalSystoms() == null) {
					entity.setNomalSystoms(nomalSymtomSet);
				} else {
					entity.getNomalSystoms().clear();
					entity.getNomalSystoms().addAll(nomalSymtomSet);
				}
			} else if (entity.getNomalSystoms() != null) {
				entity.getNomalSystoms().clear();
			}

			if (dto.getSevereSymptoms() != null && dto.getSevereSymptoms().size() > 0) {
				Set<PersonalHealthRecordSymptom> severeSymptomSet = new HashSet<>();
				for (PersonalHealthRecordSymptomDto severeSymptomDto : dto.getSevereSymptoms()) {
					PersonalHealthRecordSymptom phrs = new PersonalHealthRecordSymptom();

					if (severeSymptomDto.getSymptom() != null && severeSymptomDto.getSymptom().getId() != null) {
						Symptom symptom = symptomRepository.getOne(severeSymptomDto.getSymptom().getId());
						if (symptom != null) {
							phrs.setSymptom(symptom);
							phrs.setRecord(entity);
							phrs.setType(HealthDeclarationEnumsType.SymptomType.type2.getNumber());

							severeSymptomSet.add(phrs);
						}
					}
				}

				if (entity.getSevereSymptoms() == null) {
					entity.setSevereSymptoms(severeSymptomSet);
				} else {
					entity.getSevereSymptoms().clear();
					entity.getSevereSymptoms().addAll(severeSymptomSet);
				}
			} else if (entity.getSevereSymptoms() != null) {
				entity.getSevereSymptoms().clear();
			}

			entity = repository.save(entity);
			// update bản ghi cuối cùng
			if (updateLastRecord) {
				if (entity.getId() != null && entity.getFamilyMember() != null
						&& entity.getFamilyMember().getId() != null) {
					// Lấy tất cả các bản ghi PersonalHealthRecord của family menber ra và set
					// lastRecord = false (trừ bản ghi cuối)
					List<PersonalHealthRecord> list = repository
							.getListLastRecordByFamilyMemberId(entity.getFamilyMember().getId(), entity.getId());
					for (PersonalHealthRecord personalHealthRecord : list) {
						personalHealthRecord.setLastRecord(false);
						repository.save(personalHealthRecord);
					}
				}
			}

			if (dto.getFamilyMember() != null && dto.getFamilyMember().getFamily() != null
					&& dto.getFamilyMember().getFamily().getId() != null) {

				FamilyDto familyDto = familyService.getById(dto.getFamilyMember().getFamily().getId());
				// Lấy trạng thái nghiêm trọng của người nghiêm trọng nhất trong gia đình làm
				// trạng thái của gia đình
				if (familyDto.getSeriusStatus() != null && (familyDto.getSeriusStatus() < entity.getSeriusStatus())) {
					familyDto.setSeriusStatus(entity.getSeriusStatus());
					familyService.saveOrUpdate(familyDto, familyDto.getId());
				} else {
					familyDto.setSeriusStatus(entity.getSeriusStatus());
					familyService.saveOrUpdate(familyDto, familyDto.getId());
				}

			}

			if (entity != null) {
				return new PersonalHealthRecordDto(entity, true);
			}

		}
		return null;
	}

	private void updateSuspectedLevel(FamilyMember familyMember) {
		if(familyMember != null) {
			UUID idFamily = familyMember.getFamily().getId();
			UUID idMember = familyMember.getMember().getId();
			List<MemberDto> list = familyMemberRepository.listMembers(idFamily);
			Member member = null;
			if(list != null && list.size() > 0) {
				for(MemberDto item: list) {
					member = memberRepository.getOne(item.getId());
					if(item.getSuspectedLevel() == null) {
						member.setSuspectedLevel(HealthDeclarationEnumsType.SuspectedLevelType.f1.getValue());
					}
					if(item.getSuspectedLevel() != null && !item.getSuspectedLevel().equals(HealthDeclarationEnumsType.SuspectedLevelType.f0.getValue())) {
						member.setSuspectedLevel(HealthDeclarationEnumsType.SuspectedLevelType.f1.getValue());
					}
					if(item.getId().equals(idMember)) {
						member.setSuspectedLevel(HealthDeclarationEnumsType.SuspectedLevelType.f0.getValue());
					}
					
					member = memberRepository.save(member);
				}
			}
		}
	}

	@Override
	public Boolean deleteById(UUID id) {
		if (id != null && hasDeletePermision(id)) {
			PersonalHealthRecord entity = repository.getOne(id);
			if (entity != null) {
				repository.deleteById(id);
				return true;
			}
		}
		return false;
	}

	@Override
	public ReportResultDto<HealthRecordReportDto> getReportByAdminUnit(Integer resolveStatus, Integer seriusStatus,
			UUID communeId, UUID quarterId, UUID townId, UUID residentialGroup, String groupByType) {
		UserInfoDto userDto = userAdministrativeUnitService.getAllInfoByUserLogin();
		if (userDto == null
				|| (!userDto.isAdmin() && (userDto.getListUnit() == null || userDto.getListUnit().size() < 1))) {
			return null;
		}
		Set<UUID> adminUnitIds = new HashSet<UUID>();
		if (userDto != null && userDto.getListUnit() != null && userDto.getListUnit().size() > 0) {
			adminUnitIds.addAll(userDto.getListUnit());
			for (UUID id : userDto.getListUnit()) {
				List<UUID> listChild = hdAdministrativeUnitService.getAllChildIdByParentId(id);
				adminUnitIds.addAll(listChild);
			}
		}
		ReportResultDto<HealthRecordReportDto> ret = new ReportResultDto<HealthRecordReportDto>();
		ret.setCode(groupByType);
		// Không triệu chứng
		String selectAdminUnitClause = "";
		if (groupByType.equals(HealthDeclarationEnumsType.ReportGroupByType.town.getValue())) {
			selectAdminUnitClause = " h.familyMember.family.administrativeUnit.id, h.familyMember.family.administrativeUnit.parent.parent.id, "
					+ " h.familyMember.family.administrativeUnit.name, ";	
		}
		if (groupByType.equals(HealthDeclarationEnumsType.ReportGroupByType.quarter.getValue())) {
			selectAdminUnitClause = " h.familyMember.family.administrativeUnit.parent.id, h.familyMember.family.administrativeUnit.parent.parent.id,"
					+ " h.familyMember.family.administrativeUnit.parent.name, ";	
		}
		if (groupByType.equals(HealthDeclarationEnumsType.ReportGroupByType.commune.getValue())) {
			selectAdminUnitClause = " h.familyMember.family.administrativeUnit.parent.parent.id, h.familyMember.family.administrativeUnit.parent.parent.id, "
					+ " h.familyMember.family.administrativeUnit.parent.parent.name, ";	
		}

		String sqlNoSymtom = " SELECT new com.globits.healthdeclaration.functiondto.HealthRecordReportDto" + " ("
				+ selectAdminUnitClause + " COUNT(h.id),0L,0L,0L) " + " FROM PersonalHealthRecord h "
				+ " WHERE h.lastRecord=true AND h.seriusStatus = " + HealthDeclarationEnumsType.PersonalHealthRecordSeriusStatus.Level0.getValue() ;
//				+ " AND h.id not in (SELECT p.record.id FROM PersonalHealthRecordSymptom p)" + " AND NOT "
//				+ " ((h.spo2<2 AND (h.familyMember.member.haveBackgroundDisease=false OR h.familyMember.member.haveBackgroundDisease IS NULL )) "
//				+ " OR (h.spo2<4 AND h.familyMember.member.haveBackgroundDisease=true)" + " OR (h.breathingRate>3)) ";

		String sqlNormal = " SELECT new com.globits.healthdeclaration.functiondto.HealthRecordReportDto" + " ("
				+ selectAdminUnitClause + " 0L,COUNT(h.id),0L,0L) " + " FROM PersonalHealthRecord h "
				+ " WHERE h.lastRecord=true AND h.seriusStatus = " + HealthDeclarationEnumsType.PersonalHealthRecordSeriusStatus.Level1.getValue() ;
//				+ " AND h.id in (SELECT p.record.id FROM PersonalHealthRecordSymptom p WHERE p.type=1) "
//				+ " AND h.id not in (SELECT p.record.id FROM PersonalHealthRecordSymptom p WHERE p.type=2) "
//				+ " AND NOT " + " ((h.spo2<2 AND (h.familyMember.member.haveBackgroundDisease=false OR h.familyMember.member.haveBackgroundDisease IS NULL )) "
//				+ " OR (h.spo2<4 AND h.familyMember.member.haveBackgroundDisease=true)" + " OR (h.breathingRate>3)) ";

		String sqlMedium = " SELECT new com.globits.healthdeclaration.functiondto.HealthRecordReportDto" + " ("
				+ selectAdminUnitClause + " 0L,0L,COUNT(h.id),0L) " + " FROM PersonalHealthRecord h "
				+ " WHERE h.lastRecord=true AND h.seriusStatus = " + HealthDeclarationEnumsType.PersonalHealthRecordSeriusStatus.Level2.getValue() ;
//				+ " AND h.id in (SELECT p.record.id FROM PersonalHealthRecordSymptom p WHERE p.type=1) "
//				+ " AND h.id in (SELECT p.record.id FROM PersonalHealthRecordSymptom p WHERE p.type=2) " + " AND NOT "
//				+ " ((h.spo2<2 AND (h.familyMember.member.haveBackgroundDisease=false OR h.familyMember.member.haveBackgroundDisease IS NULL )) "
//				+ " OR (h.spo2<4 AND h.familyMember.member.haveBackgroundDisease=true)" + " OR (h.breathingRate>3)) ";

		String sqlSerious = " SELECT new com.globits.healthdeclaration.functiondto.HealthRecordReportDto" + " ("
				+ selectAdminUnitClause + " 0L,0L,0L,COUNT(h.id)) " + " FROM PersonalHealthRecord h "
				+ " WHERE h.lastRecord=true AND h.seriusStatus = " + HealthDeclarationEnumsType.PersonalHealthRecordSeriusStatus.Level3.getValue() ;
//				+ " AND ((h.spo2<2 AND (h.familyMember.member.haveBackgroundDisease=false OR h.familyMember.member.haveBackgroundDisease IS NULL )) "
//				+ " 	OR (h.spo2<4 AND h.familyMember.member.haveBackgroundDisease=true)"
//				+ "     OR (h.breathingRate>3)) ";

		String whereClause = "";
		if (resolveStatus != null && resolveStatus > 0) {
			whereClause += " AND h.resolveStatus=:resolveStatus ";
		}
		if (seriusStatus != null && seriusStatus > 0) {
			whereClause += " AND h.seriusStatus=:seriusStatus ";
		}
		if (communeId != null && !communeId.equals(new UUID(0L, 0L))) {
			whereClause += " AND h.familyMember.family.administrativeUnit.parent.parent.id=:communeId ";
		}
		if(quarterId != null && !quarterId.equals(new UUID(0L, 0L))) {
			whereClause += " AND h.familyMember.family.administrativeUnit.parent.id=:quarterId ";
		}
		if (townId != null && !townId.equals(new UUID(0L, 0L))) {
			whereClause += " AND h.familyMember.family.administrativeUnit.id=:townId ";
		}
		if (!userDto.isAdmin()) {
			whereClause += " AND h.familyMember.family.administrativeUnit.id in (:adminUnitIds) ";
		}

		String groupByClause = "  ";

		if (groupByType.equals(HealthDeclarationEnumsType.ReportGroupByType.commune.getValue())) {
			groupByClause = " GROUP BY h.familyMember.family.administrativeUnit.parent.parent.id, h.familyMember.family.administrativeUnit.parent.parent.name ";
		}
		
		if (groupByType.equals(HealthDeclarationEnumsType.ReportGroupByType.quarter.getValue())) {
			groupByClause = " GROUP BY h.familyMember.family.administrativeUnit.parent.id, h.familyMember.family.administrativeUnit.parent.name ";
		}
		
		
		if (groupByType.equals(HealthDeclarationEnumsType.ReportGroupByType.town.getValue())) {
			groupByClause = " GROUP BY h.familyMember.family.administrativeUnit.id, h.familyMember.family.administrativeUnit.name ";
		}

		Query qNoSymtom = manager.createQuery(sqlNoSymtom + whereClause + groupByClause, HealthRecordReportDto.class);
		Query qNormal = manager.createQuery(sqlNormal + whereClause + groupByClause , HealthRecordReportDto.class);
		Query qMedium = manager.createQuery(sqlMedium + whereClause + groupByClause , HealthRecordReportDto.class);
		Query qSerious = manager.createQuery(sqlSerious + whereClause + groupByClause, HealthRecordReportDto.class);
		if (resolveStatus != null && resolveStatus > 0) {
			qNoSymtom.setParameter("resolveStatus", resolveStatus);
			qNormal.setParameter("resolveStatus", resolveStatus);
			qMedium.setParameter("resolveStatus", resolveStatus);
			qSerious.setParameter("resolveStatus", resolveStatus);
		}
		if (seriusStatus != null && seriusStatus > 0) {
			qNoSymtom.setParameter("seriusStatus", seriusStatus);
			qNormal.setParameter("seriusStatus", seriusStatus);
			qMedium.setParameter("seriusStatus", seriusStatus);
			qSerious.setParameter("seriusStatus", seriusStatus);
		}
		if (communeId != null && !communeId.equals(new UUID(0L, 0L))) {
			qNoSymtom.setParameter("communeId", communeId);
			qNormal.setParameter("communeId", communeId);
			qMedium.setParameter("communeId", communeId);
			qSerious.setParameter("communeId", communeId);
		}
		if (quarterId != null && !quarterId.equals(new UUID(0L, 0L))) {
			qNoSymtom.setParameter("quarterId", quarterId);
			qNormal.setParameter("quarterId", quarterId);
			qMedium.setParameter("quarterId", quarterId);
			qSerious.setParameter("quarterId", quarterId);
		}
		if (townId != null && !townId.equals(new UUID(0L, 0L))) {
			qNoSymtom.setParameter("townId", townId);
			qNormal.setParameter("townId", townId);
			qMedium.setParameter("townId", townId);
			qSerious.setParameter("townId", townId);
		}
		if (!userDto.isAdmin()) {
			qNoSymtom.setParameter("adminUnitIds", adminUnitIds);
			qNormal.setParameter("adminUnitIds", adminUnitIds);
			qMedium.setParameter("adminUnitIds", adminUnitIds);
			qSerious.setParameter("adminUnitIds", adminUnitIds);
//    		whereClause+=" AND h.familyMember.family.administrativeUnit.id in (:adminUnitIds) ";
		}
		List<HealthRecordReportDto> listNoSymtom = qNoSymtom.getResultList();
		List<HealthRecordReportDto> listNormal = qNormal.getResultList();
		List<HealthRecordReportDto> listMedium = qMedium.getResultList();
		List<HealthRecordReportDto> listSerious = qSerious.getResultList();

		Hashtable<UUID, HealthRecordReportDto> hash = new Hashtable<UUID, HealthRecordReportDto>();
		if (listNoSymtom != null && listNoSymtom.size() > 0) {
			for (HealthRecordReportDto healthRecordReportDto : listNoSymtom) {
				HealthRecordReportDto obj = hash.get(healthRecordReportDto.getAdminUnitId());
				if (obj != null) {
					obj.setNoSymtom(obj.getNoSymtom() + healthRecordReportDto.getNoSymtom());
				} else {
					hash.put(healthRecordReportDto.getAdminUnitId(), healthRecordReportDto);
				}
			}
		}
		if (listNormal != null && listNormal.size() > 0) {
			for (HealthRecordReportDto healthRecordReportDto : listNormal) {
				HealthRecordReportDto obj = hash.get(healthRecordReportDto.getAdminUnitId());
				if (obj != null) {
					obj.setNormal(obj.getNormal() + healthRecordReportDto.getNormal());
				} else {
					hash.put(healthRecordReportDto.getAdminUnitId(), healthRecordReportDto);
				}
			}
		}
		if (listMedium != null && listMedium.size() > 0) {
			for (HealthRecordReportDto healthRecordReportDto : listMedium) {
				HealthRecordReportDto obj = hash.get(healthRecordReportDto.getAdminUnitId());
				if (obj != null) {
					obj.setMedium(obj.getMedium() + healthRecordReportDto.getMedium());
				} else {
					hash.put(healthRecordReportDto.getAdminUnitId(), healthRecordReportDto);
				}
			}
		}
		if (listSerious != null && listSerious.size() > 0) {
			for (HealthRecordReportDto healthRecordReportDto : listSerious) {
				HealthRecordReportDto obj = hash.get(healthRecordReportDto.getAdminUnitId());
				if (obj != null) {
					obj.setSerious(obj.getSerious() + healthRecordReportDto.getSerious());
				} else {
					hash.put(healthRecordReportDto.getAdminUnitId(), healthRecordReportDto);
				}
			}
		}
		List<HealthRecordReportDto> listHealRecord = new ArrayList<HealthRecordReportDto>(hash.values());
		if(listHealRecord != null && listHealRecord.size() > 0) {
			Collections.sort(listHealRecord, new Comparator<HealthRecordReportDto>() {
				@Override
				public int compare(HealthRecordReportDto bottle1, HealthRecordReportDto bottle2) {
					return bottle1.getAdminUnit().compareTo(bottle2.getAdminUnit());
				}
			});
		}
		ret.setDetails(listHealRecord);
		return ret;
	}

	@Override
	public List<PersonalHealthRecordDto> getListPatientByAdminUnit(Integer resolveStatus, Integer seriusStatus,
			Integer seriusLevel, UUID communeId, UUID quarterId, UUID townId, UUID residentialGroup) {
		UserInfoDto userDto = userAdministrativeUnitService.getAllInfoByUserLogin();
		if (userDto == null
				|| (!userDto.isAdmin() && (userDto.getListUnit() == null || userDto.getListUnit().size() < 1))) {
			return null;
		}
		Set<UUID> adminUnitIds = new HashSet<UUID>();
		if (userDto != null && userDto.getListUnit() != null && userDto.getListUnit().size() > 0) {
			adminUnitIds.addAll(userDto.getListUnit());
			for (UUID id : userDto.getListUnit()) {
				List<UUID> listChild = hdAdministrativeUnitService.getAllChildIdByParentId(id);
				adminUnitIds.addAll(listChild);
			}
		}
		
		String sql = " SELECT new com.globits.healthdeclaration.dto.PersonalHealthRecordDto(h,false) "
				+ " FROM PersonalHealthRecord h " + " WHERE h.lastRecord=true ";
		String whereClause = "";
		if (seriusLevel == PersonalHealthRecordSeriusStatus.Level0.getValue()) {
//			whereClause += " AND h.id not in (SELECT p.record.id FROM PersonalHealthRecordSymptom p)" + " AND NOT "
//					+ " ((h.spo2<2 AND (h.familyMember.member.haveBackgroundDisease=false OR h.familyMember.member.haveBackgroundDisease IS NULL )) "
//					+ " OR (h.spo2<4 AND h.familyMember.member.haveBackgroundDisease=true)"
//					+ " OR (h.breathingRate>3)) ";
			whereClause += " AND h.seriusStatus = " + HealthDeclarationEnumsType.PersonalHealthRecordSeriusStatus.Level0.getValue() ;
		}
		if (seriusLevel == PersonalHealthRecordSeriusStatus.Level1.getValue()) {
//			whereClause += " AND h.id in (SELECT p.record.id FROM PersonalHealthRecordSymptom p WHERE p.type=1) "
//					+ " AND h.id not in (SELECT p.record.id FROM PersonalHealthRecordSymptom p WHERE p.type=2) "
//					+ " AND NOT " + " ((h.spo2<2 AND (h.familyMember.member.haveBackgroundDisease=false OR h.familyMember.member.haveBackgroundDisease IS NULL )) "
//					+ " OR (h.spo2<4 AND h.familyMember.member.haveBackgroundDisease=true)"
//					+ " OR (h.breathingRate>3)) ";
			whereClause += " AND h.seriusStatus = " + HealthDeclarationEnumsType.PersonalHealthRecordSeriusStatus.Level1.getValue() ;
		}
		if (seriusLevel == PersonalHealthRecordSeriusStatus.Level2.getValue()) {
//			whereClause += " AND h.id in (SELECT p.record.id FROM PersonalHealthRecordSymptom p WHERE p.type=1) "
//					+ " AND h.id in (SELECT p.record.id FROM PersonalHealthRecordSymptom p WHERE p.type=2) "
//					+ " AND NOT " + " ((h.spo2<2 AND (h.familyMember.member.haveBackgroundDisease=false OR h.familyMember.member.haveBackgroundDisease IS NULL )) "
//					+ " OR (h.spo2<4 AND h.familyMember.member.haveBackgroundDisease=true)"
//					+ " OR (h.breathingRate>3)) ";
			whereClause += " AND h.seriusStatus = " + HealthDeclarationEnumsType.PersonalHealthRecordSeriusStatus.Level2.getValue() ;
		}
		if (seriusLevel == PersonalHealthRecordSeriusStatus.Level3.getValue()) {
//			whereClause += " AND ((h.spo2<2 AND (h.familyMember.member.haveBackgroundDisease=false OR h.familyMember.member.haveBackgroundDisease IS NULL )) "
//					+ " OR (h.spo2<4 AND h.familyMember.member.haveBackgroundDisease=true)"
//					+ "	OR ((h.breathingRate>3))) ";
			whereClause += " AND h.seriusStatus = " + HealthDeclarationEnumsType.PersonalHealthRecordSeriusStatus.Level3.getValue() ;
		}
		if (resolveStatus != null && resolveStatus > 0) {
			whereClause += " AND h.resolveStatus=:resolveStatus ";
		}
		if (seriusStatus != null && seriusStatus > 0) {
			whereClause += " AND h.seriusStatus=:seriusStatus ";
		}
		if (communeId != null && !communeId.equals(new UUID(0L, 0L))) {
			whereClause += " AND h.familyMember.family.administrativeUnit.parent.parent.id=:communeId ";
		}
		if (quarterId != null && !quarterId.equals(new UUID(0L, 0L))) {
			whereClause += " AND h.familyMember.family.administrativeUnit.parent.id=:quarterId ";
		}
		if (townId != null && !townId.equals(new UUID(0L, 0L))) {
			whereClause += " AND h.familyMember.family.administrativeUnit.id=:townId ";
		}
		if (!userDto.isAdmin()) {
			whereClause += " AND h.familyMember.family.administrativeUnit.id in (:adminUnitIds) ";
		}

		Query q = manager.createQuery(sql + whereClause, PersonalHealthRecordDto.class);

		if (resolveStatus != null && resolveStatus > 0) {
			q.setParameter("resolveStatus", resolveStatus);
		}
		if (seriusStatus != null && seriusStatus > 0) {
			q.setParameter("seriusStatus", seriusStatus);
		}
		if (communeId != null && !communeId.equals(new UUID(0L, 0L))) {
			q.setParameter("communeId", communeId);
		}
		if (quarterId != null && !quarterId.equals(new UUID(0L, 0L))) {
			q.setParameter("quarterId", quarterId);
		}
		if (townId != null && !townId.equals(new UUID(0L, 0L))) {
			q.setParameter("townId", townId);
		}
		if (!userDto.isAdmin()) {
			q.setParameter("adminUnitIds", adminUnitIds);
		}

		return q.getResultList();
	}

	@Override
	public PersonalHealthRecordDto updateStaus(PersonalHealthRecordDto dto, UUID id) {

		if (dto != null && id != null) {
			boolean updateLastRecord = true;
			PersonalHealthRecord entity = repository.getOne(id);
			if (entity == null) {
				return null;
			}

			if (dto.getType() != null) {
				entity.setType(dto.getType());
				if (dto.getType().equals(HealthDeclarationEnumsType.PersonalHealthRecordType.practitioner.getValue())) {
					if (dto.getPractitioner() != null && dto.getPractitioner().getId() != null) {
						Practitioner practitioner = practitionerRepository.getOne(dto.getPractitioner().getId());
						if (practitioner != null && practitioner.getId() != null) {
							entity.setPractitioner(practitioner);
							entity.setType(HealthDeclarationEnumsType.PersonalHealthRecordType.practitioner.getValue());
						}
					}
				}
				if (dto.getType().equals(HealthDeclarationEnumsType.PersonalHealthRecordType.medical_team.getValue())) {
					if (dto.getMedicalTeam() != null && dto.getMedicalTeam().getId() != null) {
						UserAdministrativeUnit medicalTeam = userAdministrativeUnitRepository
								.getOne(dto.getMedicalTeam().getId());
						if (medicalTeam != null && medicalTeam.getId() != null) {
							entity.setMedicalTeam(medicalTeam);
							entity.setType(HealthDeclarationEnumsType.PersonalHealthRecordType.medical_team.getValue());
						}
					}
				}
			}

			entity.setResolveStatus(dto.getResolveStatus());

			entity = repository.save(entity);
			// update bản ghi cuối cùng
			if (updateLastRecord) {
				if (entity.getId() != null && entity.getFamilyMember() != null
						&& entity.getFamilyMember().getId() != null) {
					// Lấy tất cả các bản ghi PersonalHealthRecord của family menber ra và set
					// lastRecord = false (trừ bản ghi cuối)
					List<PersonalHealthRecord> list = repository
							.getListLastRecordByFamilyMemberId(entity.getFamilyMember().getId(), entity.getId());
					for (PersonalHealthRecord personalHealthRecord : list) {
						personalHealthRecord.setLastRecord(false);
						repository.save(personalHealthRecord);
					}
				}
			}

			if (dto.getFamilyMember() != null && dto.getFamilyMember().getFamily() != null
					&& dto.getFamilyMember().getFamily().getId() != null) {

				FamilyDto familyDto = familyService.getById(dto.getFamilyMember().getFamily().getId());
				// Lấy trạng thái nghiêm trọng của người nghiêm trọng nhất trong gia đình làm
				// trạng thái của gia đình
				if (familyDto.getSeriusStatus() != null && (familyDto.getSeriusStatus() < entity.getSeriusStatus())) {
					familyDto.setSeriusStatus(entity.getSeriusStatus());
					familyService.saveOrUpdate(familyDto, familyDto.getId());
				} else {
					familyDto.setSeriusStatus(entity.getSeriusStatus());
					familyService.saveOrUpdate(familyDto, familyDto.getId());
				}
			}

			if (entity != null) {
				return new PersonalHealthRecordDto(entity, true);
			}

		}
		return null;
	}

	private boolean hasEditPermision(PersonalHealthRecordDto dto, UUID id, UserInfoDto userInfo) {
		if (userInfo != null && dto != null && dto.getFamilyMember() != null && dto.getFamilyMember().getId() != null) {
			FamilyMember familyMember = familyMemberRepository.getById(dto.getFamilyMember().getId());
			if (familyMember != null && familyMember.getFamily() != null && familyMember.getFamily().getId() != null) {
				if (userInfo.isAdmin()) {
					return true;
				}
				else {
					if (userInfo.isMedicalTeam() && userInfo.getListUnit() != null && userInfo.getListUnit().size() > 0) {
						Integer count = familyRepository.countAllByIdAndInListAdministrativeUnitId(familyMember.getFamily().getId(), userInfo.getListUnit());
						if (count != null && count > 0) {
							return true;
						}
					}
					if (userInfo.isHealthCareStaff() && userInfo.getPractitioner() != null) {
						Integer count = practitionerAndFamilyRepository.countAllByIdAndInListAdministrativeUnitId(familyMember.getFamily().getId(), userInfo.getPractitioner().getId());
						if (count != null && count > 0) {
							return true;
						}
					}
					if (userInfo.isUser() && userInfo.getFamilyMember() != null && userInfo.getFamilyMember().getFamily() != null
							 && userInfo.getFamilyMember().getFamily().getId() != null
							 && userInfo.getFamilyMember().getFamily().getId().equals(familyMember.getFamily().getId())) {
						return true;
					}
				}
			}
		}
		return false;
	}

	private boolean hasDeletePermision(UUID id) {
		UserInfoDto userInfo = userAdministrativeUnitService.getAllInfoByUserLogin();
		if (userInfo != null && userInfo.isAdmin()) {
			return true;
		}
		return false;
	}

//    @Override
//    public Boolean checkCode(UUID id, String code) {
//        if (code != null && StringUtils.hasText(code)) {
//            Long count = repository.checkCode(code, id);
//            return count != 0l;
//        }
//        return null;
//    }
}
