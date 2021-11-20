package com.globits.healthdeclaration.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.globits.core.service.impl.GenericServiceImpl;
import com.globits.core.utils.SecurityUtils;
import com.globits.healthdeclaration.HealthDeclarationConstant;
import com.globits.healthdeclaration.domain.HDAdministrativeUnit;
import com.globits.healthdeclaration.domain.HealthCareGroup;
import com.globits.healthdeclaration.domain.Practitioner;
import com.globits.healthdeclaration.dto.PersonalHealthRecordDto;
import com.globits.healthdeclaration.dto.PractitionerDto;
import com.globits.healthdeclaration.functiondto.PractitionerSearchDto;
import com.globits.healthdeclaration.functiondto.UserInfoDto;
import com.globits.healthdeclaration.repository.HDAdministrativeUnitRepository;
import com.globits.healthdeclaration.repository.HealthCareGroupRepository;
import com.globits.healthdeclaration.repository.PractitionerRepository;
import com.globits.healthdeclaration.repository.UserAdministrativeUnitRepository;
import com.globits.healthdeclaration.service.PractitionerService;
import com.globits.healthdeclaration.service.UserAdministrativeUnitService;
import com.globits.security.domain.Role;
import com.globits.security.domain.User;
import com.globits.security.repository.RoleRepository;
import com.globits.security.repository.UserRepository;
import com.globits.security.service.UserService;

@Transactional
@Service
public class PractitionerServiceImpl extends GenericServiceImpl<Practitioner, UUID> implements PractitionerService {

	@Autowired
	private EntityManager manager;

	@Autowired
	public PractitionerRepository repository;
	@Autowired
	RoleRepository roleRepository;
	@Autowired
	UserService userService;
	@Autowired
	UserAdministrativeUnitRepository userAdministrativeUnitRepository;
	@Autowired
	HDAdministrativeUnitRepository administrativeUnitRepository;
	@Autowired
	HealthCareGroupRepository healthCareGroupRepository;
	@Autowired
	UserRepository userRepository;

	@Autowired
	private UserAdministrativeUnitService userAdministrativeUnitService;

	@Override
	public Page<PractitionerDto> searchByDto(PractitionerSearchDto dto) {
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
		if (!userInfo.isAdmin()) {
			if (userInfo.isMedicalTeam()) {
				if (userInfo.getUserUnit() != null && userInfo.getUserUnit().getHealthCareGroup() != null) {
					dto.setHealthCareGroupId(userInfo.getUserUnit().getHealthCareGroup().getId());
				}
				else {
					return new PageImpl<PractitionerDto>(new ArrayList<PractitionerDto>() , PageRequest.of(pageIndex, pageSize), 0);
				}
			}
		}

		String whereClause = "";
		String orderBy = " ORDER BY entity.healthCareGroup.code, entity.healthCareGroup.name ";
		String sqlCount = "select count(entity.id) from Practitioner as entity where (1=1) ";
		String sql = "select new com.globits.healthdeclaration.dto.PractitionerDto(entity) from Practitioner as entity where (1=1) ";
		if (dto.getHealthCareGroupId() != null) {
			whereClause += " AND (entity.healthCareGroup.id = :healthCareGroupId) ";
		}
		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			whereClause += " AND (entity.displayName LIKE :text OR entity.user.email LIKE :text OR entity.detailAddress LIKE :text OR entity.user.username LIKE :text OR entity.healthCareGroup.name LIKE :text ) ";
		}
		if (dto.getType() != null) {
			whereClause += " AND (entity.type = :type) ";
		}

		sql += whereClause + orderBy;
		sqlCount += whereClause;
		Query q = manager.createQuery(sql, PractitionerDto.class);
		Query qCount = manager.createQuery(sqlCount);

		if (dto.getHealthCareGroupId() != null) {
			q.setParameter("healthCareGroupId", dto.getHealthCareGroupId());
			qCount.setParameter("healthCareGroupId", dto.getHealthCareGroupId());
		}
		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			q.setParameter("text", '%' + dto.getText().trim() + '%');
			qCount.setParameter("text", '%' + dto.getText().trim() + '%');
		}
		if (dto.getType() != null) {
			q.setParameter("type", dto.getType());
			qCount.setParameter("type", dto.getType());
		}
		int startPosition = pageIndex * pageSize;
		q.setFirstResult(startPosition);
		q.setMaxResults(pageSize);
		List<PractitionerDto> entities = q.getResultList();
		long count = (long) qCount.getSingleResult();

		Pageable pageable = PageRequest.of(pageIndex, pageSize);
		Page<PractitionerDto> result = new PageImpl<PractitionerDto>(entities, pageable, count);

		return result;
	}

	@Override
	public PractitionerDto getById(UUID id) {
		if (id != null) {
			Practitioner entity = repository.getOne(id);
			if (entity != null) {
				return new PractitionerDto(entity);
			}
		}
		return null;
	}

	@Override
	public PractitionerDto saveOrUpdate(PractitionerDto dto, UUID id) {
		if (dto != null) {
			Practitioner entity = null;
			User user = null;
			boolean createUser = false;
			if (id != null) {
				entity = repository.getOne(id);
			}
			if (entity == null) {
				if (dto.getUser() != null && !checkDuplicateUserName(id, dto.getUser().getUsername())) {
					entity = new Practitioner();
					createUser = true;
				} else {
					return null;
				}
			}
			if (dto.getDisplayName() == null || StringUtils.isEmpty(dto.getDisplayName())) {
				return null;
			}
			if (dto.getEmail() == null || StringUtils.isEmpty(dto.getEmail())) {
				return null;
			}
			if (dto.getPhoneNumber() == null || StringUtils.isEmpty(dto.getPhoneNumber())) {
				return null;
			}
			if (dto.getZalo() == null || StringUtils.isEmpty(dto.getZalo())) {
				return null;
			}
			if (dto.getType() == null) {
				return null;
			}
			if (dto.getHealthCareGroup() == null) {
				return null;
			}
			if (dto.getUser() == null || dto.getUser().getUsername() == null ||
					StringUtils.isEmpty(dto.getUser().getUsername())) {
				return null;
			}
			if (dto.getUser() == null || dto.getUser().getPassword() == null ||
					StringUtils.isEmpty(dto.getUser().getPassword())) {
				return null;
			}
			entity.setDisplayName(dto.getDisplayName());
			entity.setAge(dto.getAge());
			entity.setPhoneNumber(dto.getPhoneNumber());
			entity.setDetailAddress(dto.getDetailAddress());
			entity.setOccupation(dto.getOccupation());
			entity.setGender(dto.getGender());
			entity.setWorkPlace(dto.getWorkPlace());
			entity.setEmail(dto.getEmail());
			entity.setZalo(dto.getZalo());
			entity.setType(dto.getType());

			HDAdministrativeUnit administrativeUnit = null;
			if (dto.getAdministrativeUnit() != null && dto.getAdministrativeUnit().getId() != null) {
				administrativeUnit = administrativeUnitRepository.getOne(dto.getAdministrativeUnit().getId());
			}
			if (administrativeUnit != null)
				entity.setAdministrativeUnit(administrativeUnit);

			HealthCareGroup careGroup = null;
			if (dto.getHealthCareGroup() != null && dto.getHealthCareGroup().getId() != null) {
				careGroup = healthCareGroupRepository.getOne(dto.getHealthCareGroup().getId());
			}
			entity.setHealthCareGroup(careGroup);

			if (createUser) {
				// tạo tài khoản
				Role role = roleRepository.findByName(HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF);
				if (role != null) {
					user = new User();
					ArrayList gs;
					gs = new ArrayList();
					gs.add(role);

					user.getRoles().clear();
					user.getRoles().addAll(gs);
					user.setEmail(dto.getEmail());
					user.setUsername(dto.getUser().getUsername());
					user.setPassword(SecurityUtils.getHashPassword(dto.getUser().getPassword()));

					user.setPerson(entity);
					user = (User) userRepository.save(user);
					entity.setUser(user);
				}
			}
			if (dto.getUser() != null && dto.getUser().getId() != null && dto.getUser().getChangePass()
					&& dto.getUser().getPassword() != null) {
				user = userRepository.getOne(dto.getUser().getId());
				if (user != null) {
					user.setPassword(SecurityUtils.getHashPassword(dto.getUser().getPassword()));
					userRepository.save(user);
				}
			}
			entity = repository.save(entity);

			if (entity != null) {
				return new PractitionerDto(entity);
			}
		}
		return null;
	}

	@Override
	public boolean checkDuplicateUserName(UUID personId, String username) {
		boolean isDuplicate = true;
		List<User> users = userAdministrativeUnitRepository.findByUsername(username);
		if (users != null && users.size() > 0) {
			if (personId != null) {
				for (User user : users) {
					if (user.getPerson() != null && user.getPerson().getId().equals(personId)) {
						isDuplicate = false;
					}
				}
			}
		} else {
			isDuplicate = false;
		}

		return isDuplicate;
	}

	@Override
	public Boolean deleteById(UUID id) {
		if (id != null) {
			Practitioner entity = repository.getOne(id);
			if (entity != null) {
				repository.deleteById(id);
				return true;
			}
		}
		return false;
	}

}
