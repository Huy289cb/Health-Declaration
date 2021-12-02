package com.globits.healthdeclaration.service.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import com.globits.healthdeclaration.domain.*;
import com.globits.healthdeclaration.repository.*;
import com.globits.healthdeclaration.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.globits.core.repository.PersonRepository;
import com.globits.core.service.impl.GenericServiceImpl;
import com.globits.core.utils.SecurityUtils;
import com.globits.healthdeclaration.HealthDeclarationConstant;
import com.globits.healthdeclaration.HealthDeclarationEnumsType;
import com.globits.healthdeclaration.dto.FamilyDto;
import com.globits.healthdeclaration.dto.FamilyMemberDto;
import com.globits.healthdeclaration.dto.MemberDto;
import com.globits.healthdeclaration.functiondto.FamilySearchDto;
import com.globits.healthdeclaration.functiondto.RegisterDto;
import com.globits.healthdeclaration.functiondto.UserInfoDto;
import com.globits.healthdeclaration.utilities.sms.OTPUtils;
import com.globits.security.domain.Role;
import com.globits.security.domain.User;
import com.globits.security.dto.RoleDto;
import com.globits.security.repository.RoleRepository;
import com.globits.security.repository.UserRepository;
import com.globits.security.service.RoleService;

@Transactional
@Service
public class FamilyServiceImpl extends GenericServiceImpl<Family, UUID> implements FamilyService {

	@Autowired
	private EntityManager manager;

	@Autowired
	private FamilyRepository repository;

	@Autowired
	HDAdministrativeUnitRepository hdAdministrativeUnitRepository;

	@Autowired
	FamilyMemberService familyMemberService;

	@Autowired
	FamilyMemberRepository familyMemberRepository;

	@Autowired
	RoleService roleService;

	@Autowired
	RoleRepository roleRepos;

	@Autowired
	UserRepository userRepository;

	@Autowired
	MemberRepository memberRepository;

	@Autowired
	CommonKeyCodeRepository commonKeyCodeRepository;

	@Autowired
	private UserAdministrativeUnitService userAdministrativeUnitService;

	@Autowired
	private UserAdministrativeUnitRepository userAdministrativeUnitRepository;

	@Autowired
	private HealthCareGroupRepository healthCareGroupRepository;

	@Autowired
	private PersonalHealthRecordRepository personalHealthRecordRepository;

	@Autowired
	private PractitionerAndFamilyRepository practitionerAndFamilyRepository;

	@Autowired
	private HealthCareGroupService healthCareGroupService;

	@Autowired
	private HDAdministrativeUnitService hdAdministrativeUnitService;

	@Autowired
	private UserOtpService userOtpService;

	@Autowired
	private UserOtpRepository userOtpRepository;

	@Autowired
	private PersonRepository personRepository;

	@Autowired
	private PersonalHealthRecordService personalHealthRecordService;
	
	@Override
	public Page<FamilyDto> searchByDto(FamilySearchDto dto) {
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

		if (!userInfo.isAdmin() && userInfo.isUser()) {
			if (userInfo.getFamilyMember() == null || userInfo.getFamilyMember().getFamily() == null) {
				return null;
			}
			dto.setFamilyId(userInfo.getFamilyMember().getFamily().getId());
		}

		if (!userInfo.isAdmin()) {
			if (userInfo.isMedicalTeam()) {
				dto.setListUnit(userInfo.getListUnit());
			}
			if (userInfo.isHealthCareStaff()) {
				if (userInfo.getUserDto() != null && userInfo.getUserDto().getPerson() != null) {
					dto.setPractitionerId(userInfo.getUserDto().getPerson().getId());
				} else {
					return new PageImpl<FamilyDto>(new ArrayList<FamilyDto>(), PageRequest.of(pageIndex, pageSize), 0);
				}
			}
		}

		if (dto.getAdministrativeUnitId() != null) {
			dto.getListUnit().add(dto.getAdministrativeUnitId());
			dto.getListUnit().addAll(
					hdAdministrativeUnitService.getAllChildIdByParentId(dto.getAdministrativeUnitId()));
		}

		if (dto.getHealthCareGroupId() != null) {
			dto.setListUnit(new ArrayList<UUID>());
			List<UUID> lst = healthCareGroupService.getAllAdministrativeUnitIdById(dto.getHealthCareGroupId());
			dto.getListUnit().addAll(lst);
			if (dto.getListUnit() == null || dto.getListUnit().size() <= 0) {
				return new PageImpl<FamilyDto>(new ArrayList<FamilyDto>(), PageRequest.of(pageIndex, pageSize), 0);
			}
		}

		String joinSql = "  ";
		String whereClause = " where (1=1) ";
		String orderBy = " ORDER BY entity.seriusStatus DESC, entity.createDate ";
		String sqlCount = "select count(DISTINCT entity.id) from Family as entity ";
		String sql = "select DISTINCT new com.globits.healthdeclaration.dto.FamilyDto(entity, true) from Family as entity ";

		if (dto.getPractitionerId() != null) {
			joinSql += " LEFT JOIN PractitionerAndFamily paf ON paf.family.id = entity.id ";
			whereClause += " AND paf.practitioner.id = :practitionerId ";
		}
		if (dto.getFamilyId() != null) {
			whereClause += " AND entity.id = :familyId ";
		}
		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			whereClause += " AND (entity.name LIKE :text "
					+ "OR entity.code LIKE :text OR entity.age LIKE :text " +
					"OR entity.phoneNumber LIKE :text " +
					"OR entity.detailAddress LIKE :text) ";
		}
		if (dto.getListUnit() != null && dto.getListUnit().size() > 0) {
			whereClause += " AND (entity.administrativeUnit.id IN :listUnit )";
		}

		sql += joinSql + whereClause + orderBy;
		sqlCount += joinSql + whereClause;

		Query q = manager.createQuery(sql, FamilyDto.class);
		Query qCount = manager.createQuery(sqlCount);

		if (dto.getPractitionerId() != null) {
			q.setParameter("practitionerId", dto.getPractitionerId());
			qCount.setParameter("practitionerId", dto.getPractitionerId());
		}
		if (dto.getFamilyId() != null) {
			q.setParameter("familyId", dto.getFamilyId());
			qCount.setParameter("familyId", dto.getFamilyId());
		}
		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			q.setParameter("text", '%' + dto.getText().trim() + '%');
			qCount.setParameter("text", '%' + dto.getText().trim() + '%');
		}
		if (dto.getListUnit() != null && dto.getListUnit().size() > 0) {
			q.setParameter("listUnit", dto.getListUnit());
			qCount.setParameter("listUnit", dto.getListUnit());
		}
		int startPosition = pageIndex * pageSize;
		q.setFirstResult(startPosition);
		q.setMaxResults(pageSize);
		List<FamilyDto> entities = q.getResultList();
		long count = (long) qCount.getSingleResult();

		Pageable pageable = PageRequest.of(pageIndex, pageSize);
		Page<FamilyDto> result = new PageImpl<FamilyDto>(entities, pageable, count);

		return result;
	}
	
	@Override
	public Page<FamilyDto> searchByPage(FamilySearchDto dto) { 
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

		if (!userInfo.isAdmin() && userInfo.isUser()) {
			if (userInfo.getFamilyMember() == null || userInfo.getFamilyMember().getFamily() == null) {
				return null;
			}
			dto.setFamilyId(userInfo.getFamilyMember().getFamily().getId());
		}

		if (!userInfo.isAdmin()) {
			if (userInfo.isMedicalTeam()) {
				dto.setListUnit(userInfo.getListUnit());
			}
			if (userInfo.isHealthCareStaff()) {
				if (userInfo.getUserDto() != null && userInfo.getUserDto().getPerson() != null) {
					dto.setPractitionerId(userInfo.getUserDto().getPerson().getId());
				} else {
					return new PageImpl<FamilyDto>(new ArrayList<FamilyDto>(), PageRequest.of(pageIndex, pageSize), 0);
				}
			}
		}

		if (dto.getAdministrativeUnitId() != null) {
			dto.getListUnit().clear();
			dto.getListUnit().add(dto.getAdministrativeUnitId());
			dto.getListUnit().addAll(
					hdAdministrativeUnitService.getAllChildIdByParentId(dto.getAdministrativeUnitId()));
		}

		if (dto.getHealthCareGroupId() != null) {
			dto.setListUnit(new ArrayList<UUID>());
			List<UUID> lst = healthCareGroupService.getAllAdministrativeUnitIdById(dto.getHealthCareGroupId());
			dto.getListUnit().addAll(lst);
			if (dto.getListUnit() == null || dto.getListUnit().size() <= 0) {
				return new PageImpl<FamilyDto>(new ArrayList<FamilyDto>(), PageRequest.of(pageIndex, pageSize), 0);
			}
		}

		String joinSql = "  ";
		String whereClause = " where (1=1) ";
		String orderBy = " ORDER BY entity.createDate ";
		String sqlCount = "select count(entity.id) from Family as entity ";
		String sql = "select new com.globits.healthdeclaration.dto.FamilyDto(entity, true) from Family as entity ";

		if(dto.getPractitionerId() != null || dto.getText() != null){
			joinSql += " LEFT JOIN PractitionerAndFamily paf ON paf.family.id = entity.id ";

			if(dto.getPractitionerId() != null){
				whereClause += " AND paf.practitioner.id = :practitionerId ";
			}

			if(dto.getText() != null && StringUtils.hasText(dto.getText())){
				whereClause += " AND (entity.name LIKE :text "
						+ "OR entity.code LIKE :text OR entity.age LIKE :text OR entity.phoneNumber LIKE :text OR entity.detailAddress LIKE :text ) "
						+ " OR paf.practitioner.displayName LIKE :text";
		}

		if (dto.getFamilyId() != null) {
			whereClause += " AND entity.id = :familyId ";
		}

		}
		if (dto.getListUnit() != null && dto.getListUnit().size() > 0) {
			whereClause += " AND (entity.administrativeUnit.id IN :listUnit )";
		}

		sql += joinSql + whereClause + orderBy;
		sqlCount += joinSql + whereClause;

		Query q = manager.createQuery(sql, FamilyDto.class);
		Query qCount = manager.createQuery(sqlCount);

		if (dto.getPractitionerId() != null) {
			q.setParameter("practitionerId", dto.getPractitionerId());
			qCount.setParameter("practitionerId", dto.getPractitionerId());
		}
		if (dto.getFamilyId() != null) {
			q.setParameter("familyId", dto.getFamilyId());
			qCount.setParameter("familyId", dto.getFamilyId());
		}
		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			q.setParameter("text", '%' + dto.getText().trim() + '%');
			qCount.setParameter("text", '%' + dto.getText().trim() + '%');
		}
		if (dto.getListUnit() != null && dto.getListUnit().size() > 0) {
			q.setParameter("listUnit", dto.getListUnit());
			qCount.setParameter("listUnit", dto.getListUnit());
		}
		int startPosition = pageIndex * pageSize;
		q.setFirstResult(startPosition);
		q.setMaxResults(pageSize);
		List<FamilyDto> entities = q.getResultList();
		long count = (long) qCount.getSingleResult();

		Pageable pageable = PageRequest.of(pageIndex, pageSize);
		Page<FamilyDto> result = new PageImpl<FamilyDto>(entities, pageable, count);

		return result;
	}

	@Override
	public FamilyDto getById(UUID id) {
		UserInfoDto userInfo = userAdministrativeUnitService.getAllInfoByUserLogin();
		if (!userInfo.isAdmin() && userInfo.isUser()) {
			if (id != null) {
				if (userInfo.getFamilyMember() != null && userInfo.getFamilyMember().getFamily() != null
						&& !userInfo.getFamilyMember().getFamily().getId().equals(id)) {
					return null;
				}
			}
		}	
		if(id != null) {
			Family entity = repository.getOne(id);

			FamilyDto dto = null;

			if(entity != null){
				dto = new FamilyDto(entity, true);
			}

			Set<UUID> listAdministrativeId = new HashSet<>();
			HDAdministrativeUnit hdAdministrativeUnit = entity.getAdministrativeUnit();

			while(hdAdministrativeUnit != null
					&& hdAdministrativeUnit.getLevel() >= HealthDeclarationConstant.ADMINISTRATIVE_DISTRICT_LEVEL){
				listAdministrativeId.add(hdAdministrativeUnit.getId());

				hdAdministrativeUnit = hdAdministrativeUnit.getParent();
			}

			dto.setListUnit(listAdministrativeId);

			return dto;
		}
		return null;
	}

	@Override
	public FamilyDto saveOrUpdate(FamilyDto dto, UUID id) {
		UserInfoDto userInfo = userAdministrativeUnitService.getAllInfoByUserLogin();
		if (!userInfo.isAdmin() && userInfo.isUser()) {
			if (id != null) {
				if (userInfo.getFamilyMember() != null && userInfo.getFamilyMember().getFamily() != null
						&& !userInfo.getFamilyMember().getFamily().getId().equals(id)) {
					return null;
				}
			}
		}
		if (!checkDuplicate(id, dto.getCode(), dto.getPhoneNumber()) && hasEditPermision(dto, id, userInfo)) {
			if (dto != null) {
				Family entity = null;
				Member member = null;
				User user = null;
				if (id != null) {
					entity = repository.getOne(id);
				}
				if (entity == null) {
					entity = new Family();
					member = new Member();
					user = new User();
					entity.setCode(dto.getCode());
				}

				entity.setName(dto.getName());
				entity.setAge(dto.getAge());
				entity.setPhoneNumber(dto.getPhoneNumber());
				entity.setDetailAddress(dto.getDetailAddress());
				entity.setEmail(dto.getEmail());
				entity.setSeriusStatus(dto.getSeriusStatus());

				if (dto.getAdministrativeUnit() != null && dto.getAdministrativeUnit().getId() != null) {
					HDAdministrativeUnit administrativeUnit = hdAdministrativeUnitRepository
							.getOne(dto.getAdministrativeUnit().getId());
					entity.setAdministrativeUnit(administrativeUnit);
				} else {
					entity.setAdministrativeUnit(null);
				}

//				if (dto.getFamilyMembers() != null && dto.getFamilyMembers().size() > 0) {
//					Set<FamilyMember> familyMemberSet = new HashSet<>();
//					for (FamilyMemberDto familyMemberDto : dto.getFamilyMembers()) {
//						Family family = repository.getOne(dto.getId());
//						familyMemberDto.setFamily(new FamilyDto(family, false));
//						if (familyMemberDto.getId() != null) {
//							familyMemberDto = familyMemberService.saveOrUpdate(familyMemberDto.getId(),
//									familyMemberDto);
//						} else {
//							familyMemberDto = familyMemberService.saveOrUpdate(null, familyMemberDto);
//						}
//						FamilyMember familyMember = familyMemberRepository.getOne(familyMemberDto.getId());
//						if (familyMember.getHostFamily() == true) {
//							familyMember.getMember().setPhoneNumber(dto.getPhoneNumber());
//							familyMember.getMember().setAge(dto.getAge());
//							familyMember.getMember().setEmail(dto.getEmail());
//							familyMember.getMember().setDisplayName(dto.getName());
//						}
//						familyMemberSet.add(familyMember);
//					}
//					if (familyMemberSet.size() > 0) {
//						if (entity.getFamilyMembers() == null) {
//							entity.setFamilyMembers(familyMemberSet);
//						} else {
//							entity.getFamilyMembers().clear();
//							entity.getFamilyMembers().addAll(familyMemberSet);
//						}
//					}
//					entity.setFamilyMembers(familyMemberSet);
//				} else {
//					entity.setFamilyMembers(null);
//				}

				if (id == null) {

					// tạo tài khoản cho Hộ gia đình
					RoleDto role = new RoleDto();
					List<RoleDto> allRoles = roleService.findAll();
					for (RoleDto item : allRoles) {
						if (item.getName().equals("ROLE_USER")) {
							role.setName(item.getName());
							role.setId(item.getId());
							role.setDescription(item.getDescription());
						}
					}
					ArrayList gs;
					gs = new ArrayList();
					Role r = (Role) this.roleRepos.getOne(role.getId());
					if (r != null) {
						gs.add(r);
					}
					// }

					user.getRoles().clear();
					user.getRoles().addAll(gs);
					user.setUsername(dto.getPhoneNumber());
					user.setPassword(SecurityUtils.getHashPassword(dto.getPassword()));
					// user.setPassword(SecurityUtils.getHashPassword("123456"));

					member.setDisplayName(dto.getName());
					member.setPhoneNumber(dto.getPhoneNumber());
					member.setAge(dto.getAge());
					member.setDetailAddress(dto.getDetailAddress());
					member.setEmail(dto.getEmail());
					member.setUser(user);
					member.setIdCardNumber(dto.getIdCardNumber());
					member.setHealthInsuranceCardNumber(dto.getHealthInsuranceCardNumber());
					member.setGender(dto.getGender());
					member.setWeight(dto.getWeight());
					member.setHeight(dto.getHeight());
					member.setIsPregnant(dto.getIsPregnant());

					user.setPerson(member);
					user.setEmail(dto.getEmail());
					user = (User) this.userRepository.save(user);
				}

				entity = repository.save(entity);

				// tạo family member cho chủ hộ
				if (entity.getFamilyMembers() == null || entity.getFamilyMembers().size() <= 0) {
					this.createFamilyMemberForHeadOfHousehold(entity, user, dto);
				}

				if(entity != null){
					return new FamilyDto(entity, true);
				}
			}
		} else{

		}
		return null;
	}

	@Override
	public FamilyDto saveOrUpdateQ5(FamilyDto dto, UUID id) {
		UserInfoDto userInfo = userAdministrativeUnitService.getAllInfoByUserLogin();
		if(!userInfo.isAdmin() && userInfo.isUser()){
			if(id != null){
				if(userInfo.getFamilyMember() != null && userInfo.getFamilyMember().getFamily() != null
						&& !userInfo.getFamilyMember().getFamily().getId().equals(id)){
					return null;
				}
			}
		}
		if(!checkDuplicate(id, dto.getCode(), dto.getPhoneNumber()) && hasEditPermision(dto, id, userInfo)){
			if(dto != null){
				Family entity = null;
				Member member = null;
				User user = null;
				if(id != null){
					entity = repository.getOne(id);
				}
				if(entity == null){
					entity = new Family();
					member = new Member();
					user = new User();
					entity.setCode(dto.getCode());
				}

				entity.setName(dto.getName());
				entity.setAge(dto.getAge());
				entity.setPhoneNumber(dto.getPhoneNumber());
				entity.setDetailAddress(dto.getDetailAddress());
				entity.setEmail(dto.getEmail());
				entity.setSeriusStatus(dto.getSeriusStatus());

				if(dto.getAdministrativeUnit() != null && dto.getAdministrativeUnit().getId() != null){
					HDAdministrativeUnit administrativeUnit = hdAdministrativeUnitRepository
							.getOne(dto.getAdministrativeUnit().getId());
					entity.setAdministrativeUnit(administrativeUnit);
				} else{
					entity.setAdministrativeUnit(null);
				}

				// if (dto.getFamilyMembers() != null && dto.getFamilyMembers().size() > 0) {
				// Set<FamilyMember> familyMemberSet = new HashSet<>();
				// for (FamilyMemberDto familyMemberDto : dto.getFamilyMembers()) {
				// Family family = repository.getOne(dto.getId());
				// familyMemberDto.setFamily(new FamilyDto(family, false));
				// if (familyMemberDto.getId() != null) {
				// familyMemberDto = familyMemberService.saveOrUpdate(familyMemberDto.getId(),
				// familyMemberDto);
				// } else {
				// familyMemberDto = familyMemberService.saveOrUpdate(null, familyMemberDto);
				// }
				// FamilyMember familyMember =
				// familyMemberRepository.getOne(familyMemberDto.getId());
				// if (familyMember.getHostFamily() == true) {
				// familyMember.getMember().setPhoneNumber(dto.getPhoneNumber());
				// familyMember.getMember().setAge(dto.getAge());
				// familyMember.getMember().setEmail(dto.getEmail());
				// familyMember.getMember().setDisplayName(dto.getName());
				// }
				// familyMemberSet.add(familyMember);
				// }
				// if (familyMemberSet.size() > 0) {
				// if (entity.getFamilyMembers() == null) {
				// entity.setFamilyMembers(familyMemberSet);
				// } else {
				// entity.getFamilyMembers().clear();
				// entity.getFamilyMembers().addAll(familyMemberSet);
				// }
				// }
				// entity.setFamilyMembers(familyMemberSet);
				// } else {
				// entity.setFamilyMembers(null);
				// }

				if(id == null){

					// tạo tài khoản cho Hộ gia đình
					RoleDto role = new RoleDto();
					List<RoleDto> allRoles = roleService.findAll();
					for(RoleDto item: allRoles){
						if(item.getName().equals("ROLE_USER")){
							role.setName(item.getName());
							role.setId(item.getId());
							role.setDescription(item.getDescription());
						}
					}
					ArrayList gs;
					gs = new ArrayList();
					Role r = (Role) this.roleRepos.getOne(role.getId());
					if(r != null){
						gs.add(r);
					}
					// }

					user.getRoles().clear();
					user.getRoles().addAll(gs);
					user.setUsername(dto.getPhoneNumber());
					user.setPassword(SecurityUtils.getHashPassword(dto.getPassword()));
					// user.setPassword(SecurityUtils.getHashPassword("123456"));

					member.setDisplayName(dto.getName());
					member.setPhoneNumber(dto.getPhoneNumber());
					member.setAge(dto.getAge());
					member.setDetailAddress(dto.getDetailAddress());
					member.setEmail(dto.getEmail());
					member.setUser(user);
					member.setIdCardNumber(dto.getIdCardNumber());
					member.setHealthInsuranceCardNumber(dto.getHealthInsuranceCardNumber());
					member.setGender(dto.getGender());
					member.setWeight(dto.getWeight());
					member.setHeight(dto.getHeight());
					member.setIsPregnant(dto.getIsPregnant());

					user.setPerson(member);
					user.setEmail(dto.getEmail());
					user = (User) this.userRepository.save(user);
				}

				entity = repository.save(entity);

				// tạo family member cho chủ hộ
				if(entity.getFamilyMembers() == null || entity.getFamilyMembers().size() <= 0){
					this.createFamilyMemberForHeadOfHousehold(entity, user, dto);
				}

				// Update family member Q5, 1 size
				if(entity.getFamilyMembers() != null && entity.getFamilyMembers().size() == 1){
					updateFamilyMemberForHeadOfHouseholdQ5(entity, dto);
				}

				if (entity != null) {
					return new FamilyDto(entity, true);
				}
			}
		} else {
			
		}
		return null;
	}

	@Override
	public RegisterDto registry(FamilyDto dto) {
		RegisterDto result = null;
		result = userOtpService.checkOtpCreateFamily(dto);
		if (result == null || !result.isSuccess()) {
			return result;
		}
		if (dto != null) {
			Family entity = new Family();
			Member member = null;
			User user = null;
			
			member = new Member();
			user = new User();
			entity.setCode(dto.getCode());

			entity.setName(dto.getName());
			entity.setAge(dto.getAge());
			entity.setPhoneNumber(dto.getPhoneNumber());
			entity.setEmail(dto.getEmail());
			entity.setDetailAddress(dto.getDetailAddress());

			HDAdministrativeUnit administrativeUnit = null;
			if (dto.getAdministrativeUnit() != null && dto.getAdministrativeUnit().getId() != null) {
				administrativeUnit = hdAdministrativeUnitRepository
						.getOne(dto.getAdministrativeUnit().getId());
				entity.setAdministrativeUnit(administrativeUnit);
			}
			
			if (administrativeUnit == null) {
				return null;
			}
			entity.setAdministrativeUnit(administrativeUnit); 

			entity = repository.save(entity);

//            tạo family member cho chủ hộ
			// this.createFamilyMemberForHeadOfHouseholdForRegistry(entity);
			createFamilyMemberForHeadOfHouseholdForRegistry(entity, dto);

			if (entity != null) {
				return result;
			}
		}
		return result;
	}

	private void createFamilyMemberForHeadOfHousehold(Family family, User user) {
		if (family != null && family.getId() != null && user != null && user.getPerson() != null) {
			FamilyMemberDto dto = new FamilyMemberDto();
			dto.setFamily(new FamilyDto(family, false));
			MemberDto member = new MemberDto();
			member.setId(user.getPerson().getId());
			member.setDisplayName(family.getName());
			member.setPhoneNumber(family.getPhoneNumber());
			member.setAge(family.getAge());
			member.setEmail(family.getEmail());
			member.setDetailAddress(family.getDetailAddress());
			member.setSuspectedLevel(HealthDeclarationEnumsType.SuspectedLevelType.normal.getValue());
			dto.setMember(member);
			dto.setHostFamily(true);
			dto.setRelationship("Chủ hộ");

			familyMemberService.saveOrUpdate(null, dto);
		}
	}

	private void createFamilyMemberForHeadOfHousehold(Family family, User user, FamilyDto familyDto) {
		if(family != null && family.getId() != null && user != null && user.getPerson() != null){
			FamilyMemberDto dto = new FamilyMemberDto();
			dto.setFamily(new FamilyDto(family, false));
			MemberDto member = new MemberDto();
			member.setId(user.getPerson().getId());
			member.setDisplayName(family.getName());
			member.setPhoneNumber(family.getPhoneNumber());
			member.setAge(family.getAge());
			member.setEmail(family.getEmail());
			member.setDetailAddress(family.getDetailAddress());
			member.setSuspectedLevel(HealthDeclarationEnumsType.SuspectedLevelType.normal.getValue());

			member.setIdCardNumber(familyDto.getIdCardNumber());
			member.setHealthInsuranceCardNumber(familyDto.getHealthInsuranceCardNumber());
			member.setGender(familyDto.getGender());
			member.setWeight(familyDto.getWeight());
			member.setHeight(familyDto.getHeight());
			member.setIsPregnant(familyDto.getIsPregnant());

			dto.setMember(member);
			dto.setHostFamily(true);
			dto.setRelationship("Chủ hộ");

			familyMemberService.saveOrUpdate(null, dto);
		}
	}

	private void updateFamilyMemberForHeadOfHouseholdQ5(Family family, FamilyDto familyDto) {
		if(family != null && family.getId() != null){
			FamilyMemberDto dto = null;
			MemberDto member = null;
			for(FamilyMember familyMember: family.getFamilyMembers()){
				if(familyMember.getHostFamily()){

					dto = new FamilyMemberDto(familyMember);
					member = new MemberDto(familyMember.getMember());
				}
			}

			member.setDisplayName(family.getName());
			member.setPhoneNumber(family.getPhoneNumber());
			member.setAge(family.getAge());
			member.setEmail(family.getEmail());
			member.setDetailAddress(family.getDetailAddress());
			member.setSuspectedLevel(HealthDeclarationEnumsType.SuspectedLevelType.normal.getValue());

			member.setIdCardNumber(familyDto.getIdCardNumber());
			member.setHealthInsuranceCardNumber(familyDto.getHealthInsuranceCardNumber());
			member.setGender(familyDto.getGender());
			member.setWeight(familyDto.getWeight());
			member.setHeight(familyDto.getHeight());
			member.setIsPregnant(familyDto.getIsPregnant());
			member.setHaveBackgroundDisease(familyDto.getHaveBackgroundDisease());
			member.setListBackgroundDisease(familyDto.getListBackgroundDisease());

			dto.setMember(member);
			dto.setHostFamily(true);
			dto.setRelationship("Chủ hộ");

			familyMemberService.saveOrUpdate(dto.getId(), dto);
		}
	}

	private void createFamilyMemberForHeadOfHouseholdForRegistry(Family family) {
		if (family != null && family.getId() != null) {
			FamilyMember entity = new FamilyMember();
			//cập nhật lại user
			User user = userAdministrativeUnitRepository.getUserByUserNameInCreateFamily(family.getPhoneNumber());
			if(user != null) {
				user.setActive(true);
				user = userRepository.save(user);
				
				//create member
				Member member = new Member();
				member.setDisplayName(family.getName());
				member.setPhoneNumber(family.getPhoneNumber());
				member.setEmail(family.getEmail());
				member.setAge(family.getAge());
				member.setDetailAddress(family.getDetailAddress());
				member.setUser(user);
				member = memberRepository.save(member);
				
				entity.setFamily(family);
				entity.setMember(member);
				entity.setHostFamily(true);

				entity = familyMemberService.save(entity);

				UserOtp userOtp = userOtpRepository.getByUserNameAndType(family.getPhoneNumber(), HealthDeclarationEnumsType.UserOtpType.RegisterAccount.getValue());
				if (userOtp!= null) {
					userOtp.setExpired(true);
					userOtp.setUsed(true);
					OTPUtils.sentPhone.put(family.getPhoneNumber(), 0L);
					userOtpRepository.save(userOtp);

				}
				
			}
		}
	}

	private void createFamilyMemberForHeadOfHouseholdForRegistry(Family family, FamilyDto familyDto) {
		if(family != null && family.getId() != null){
			FamilyMember entity = new FamilyMember();
			// cập nhật lại user
			User user = userAdministrativeUnitRepository.getUserByUserNameInCreateFamily(family.getPhoneNumber());
			if(user != null){
				user.setActive(true);
				user = userRepository.save(user);

				// create member
				Member member = new Member();
				member.setDisplayName(family.getName());
				member.setPhoneNumber(family.getPhoneNumber());
				member.setEmail(family.getEmail());
				member.setAge(family.getAge());
				member.setDetailAddress(family.getDetailAddress());
				member.setUser(user);
				member.setGender(familyDto.getGender());
				member.setHeight(familyDto.getHeight());
				member.setWeight(familyDto.getWeight());
				member.setIsPregnant(familyDto.getIsPregnant());
				member = memberRepository.save(member);

				entity.setFamily(family);
				entity.setMember(member);
				entity.setHostFamily(true);

				entity = familyMemberService.save(entity);

				UserOtp userOtp = userOtpRepository.getByUserNameAndType(family.getPhoneNumber(),
						HealthDeclarationEnumsType.UserOtpType.RegisterAccount.getValue());
				if(userOtp != null){
					userOtp.setExpired(true);
					userOtp.setUsed(true);
					OTPUtils.sentPhone.put(family.getPhoneNumber(), 0L);
					userOtpRepository.save(userOtp);

				}

			}
		}
	}

	@Override
	public Boolean deleteById(UUID id) {
		if (id != null && hasDeletePermision(id)) {
			Family entity = repository.getOne(id);
			if (entity != null) {
				List<PersonalHealthRecord> lst = personalHealthRecordRepository.getListByFamilyId(id);
				if (lst != null || lst.size() > 0) {
					return false;
//					for (PersonalHealthRecord phr : lst) {
//						Boolean delete = personalHealthRecordService.deleteById(phr.getId());
//						if (delete == null || !delete) {
//							return false;
//						}
//					}
				}
				if (entity.getFamilyMembers() != null) {
					for (FamilyMember familyMember : entity.getFamilyMembers()) {
						Boolean delete = familyMemberService.deleteById(familyMember.getId(), true);
						if (delete == null || !delete) {
							return false;
						}

					}
				}

				List<PractitionerAndFamily> lstPractitionerAndFamily = practitionerAndFamilyRepository
						.getByFamilyId(id);
				if (lstPractitionerAndFamily != null && lstPractitionerAndFamily.size() > 0) {
					for (PractitionerAndFamily practitionerAndFamily : lstPractitionerAndFamily) {
						practitionerAndFamilyRepository.deleteById(practitionerAndFamily.getId());
					}
				}

				repository.deleteById(id);
				return true;
			}
		}
		return false;
	}

	@Override
	public Boolean checkDuplicate(UUID id, String code, String phoneNumber) {
		boolean result = true;
		if (code != null && StringUtils.hasText(code) && phoneNumber != null && StringUtils.hasText(phoneNumber)) {
			result = checkCode(id, code);
			if (result) {
				return result;
			}

			result = checkPhoneNumber(id, phoneNumber);
			if (result) {
				return result;
			}

			if (id == null) {
				result = checkUserName(phoneNumber);
			}
		}
		return result;
	}

	@Override
	public FamilyDto getFamilyByUserLogin() {
		UserInfoDto userInfoDto = userAdministrativeUnitService.getAllInfoByUserLogin();
		if (userInfoDto != null && userInfoDto.getFamilyMember() != null
				&& userInfoDto.getFamilyMember().getFamily() != null) {
			UUID id = userInfoDto.getFamilyMember().getFamily().getId();
			if (id != null) {
				return getById(id);
			}
		}
		return null;
	}

	@Override
	public boolean checkUserName(String phoneNumber) {
		boolean resutl = true;
		// check với username
		List<User> listUser = userAdministrativeUnitRepository.findByUsername(phoneNumber);
		if (listUser != null && listUser.size() > 0) {

		} else {
			resutl = false;
		}
		return resutl;
	}

	private boolean checkPhoneNumber(UUID id, String phoneNumber) {
		boolean resutl = true;
		if (phoneNumber != null && StringUtils.hasText(phoneNumber)) {
			List<Family> entities = repository.findByPhoneNumber(phoneNumber);
			if (entities != null && entities.size() > 0) {
				for (Family family : entities) {
					if (id != null) {
						if (family.getId().equals(id)) {
							resutl = false;
							break;
						}
					}
				}
			} else {
				resutl = false;
			}
		}
		return resutl;
	}

	@Override
	public String getNewCode() {
		// tự sinh mã
		String hardCode = "HGD";
		String batchCode = "";
		CommonKeyCode commonKeyCode = commonKeyCodeRepository
				.getByType(HealthDeclarationEnumsType.TypeOfCommonKeyCode.Family.getValue());
		if (commonKeyCode == null || commonKeyCode.getId() == null) {
			commonKeyCode = new CommonKeyCode();
			commonKeyCode.setType(HealthDeclarationEnumsType.TypeOfCommonKeyCode.Family.getValue());
			commonKeyCode.setCurrentIndex(0);
		}

		Integer max = commonKeyCode.getCurrentIndex() + 1;
		batchCode = hardCode + String.format(HealthDeclarationConstant.STRING_FORMAT_CODE_HEALTH_DECLARATION, max);

		commonKeyCode.setCurrentIndex(max);
		commonKeyCode = commonKeyCodeRepository.save(commonKeyCode);
		return batchCode;
	}

	public Boolean checkCode(UUID id, String code) {
		boolean resutl = true;
		if (code != null && StringUtils.hasText(code)) {
			List<Family> entities = repository.findByCode(code);
			if (entities != null && entities.size() > 0) {
				for (Family family : entities) {
					if (id != null) {
						if (family.getId().equals(id)) {
							resutl = false;
							break;
						}
					}
				}
			} else {
				resutl = false;
			}
		}
		return resutl;
	}

	@Override
	public RegisterDto checkUserNameRegisterUser(String phoneNumber) {
		RegisterDto result = new RegisterDto();
		if (phoneNumber != null && StringUtils.hasText(phoneNumber)) {
			result = new RegisterDto();
			// check với username
			List<User> listUser = userAdministrativeUnitRepository.findByUsername(phoneNumber);
			if (listUser != null && listUser.size() > 0) {
				result.setContent("Số điện thoại đã được sử dụng, vui lòng sử dụng số điện thoại khác.");
				if (listUser.size() == 1) {
					UserOtp userOtp = userOtpRepository.getByUserNameAndType(listUser.get(0).getUsername(), 
							HealthDeclarationEnumsType.UserOtpType.RegisterAccount.getValue());
					if (userOtp != null) {

						//Nếu tài khoản đã đăng ký thành công rồi sẽ không cho gửi mã đăng ký nữa
						if (userOtp.isUsed()) {
							result.setSuccess(false);
							result.setResult(HealthDeclarationEnumsType.RegisterUserType.IsUsed.getValue());
					    	result.setContent("Tài khoản của bạn đã được đăng ký và kích hoạt thành công, vui lòng chuyển sang đăng nhập.");
					    	return result;
						}
						else{
							result.setSuccess(false);
							result.setResendOtp(true);
							result.setResult(HealthDeclarationEnumsType.RegisterUserType.Expired.getValue());
					    	result.setContent("Tài khoản của bạn chưa được kích hoạt, vui lòng nhấn 'gửi lại mã' nếu bạn chưa nhận được mã OTP.");
					    	return result;
						}
					}
				}
			} else {
				result.setSuccess(true);
			}
		}
		else {
			result.setContent("Số điện thoại trống.");
		}
		return result;
	}

	private boolean hasEditPermision(FamilyDto dto, UUID id, UserInfoDto userInfo) {
		if (userInfo != null && dto != null) {
			if (userInfo.isAdmin()) {
				return true;
			} else if (id == null) {
				if (userInfo.isMedicalTeam()) {
					return true;
				}
			} else {
				// trường hợp sửa
				if (userInfo.isMedicalTeam() && userInfo.getListUnit() != null && userInfo.getListUnit().size() > 0) {
					Integer count = repository.countAllByIdAndInListAdministrativeUnitId(id, userInfo.getListUnit());
					if (count != null && count > 0) {
						return true;
					}
				}
				/*
				 * if (userInfo.isHealthCareStaff() && userInfo.getPractitioner() != null) {
				 * Integer count =
				 * practitionerAndFamilyRepository.countAllByIdAndInListAdministrativeUnitId(id,
				 * userInfo.getPractitioner().getId()); if (count != null && count > 0) { return
				 * true; } }
				 */
				if (userInfo.isUser() && userInfo.getFamilyMember() != null
						&& userInfo.getFamilyMember().getFamily() != null
						&& userInfo.getFamilyMember().getFamily().getId() != null
						&& userInfo.getFamilyMember().getFamily().getId().equals(id)) {
					return true;
				}
			}
		}
		return false;
	}

	private boolean hasDeletePermision(UUID id) {
		UserInfoDto userInfo = userAdministrativeUnitService.getAllInfoByUserLogin();
		if (id != null && userInfo != null) {
			if (userInfo.isAdmin()) {
				return true;
			}
		}
		return false;
	}

}
