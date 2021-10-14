package com.globits.healthdeclaration.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.Set;
import java.util.HashSet;
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
import com.globits.healthdeclaration.domain.HDAdministrativeUnit;
import com.globits.healthdeclaration.domain.HealthCareGroup;
import com.globits.healthdeclaration.domain.HealthCareGroupAdministrativeUnit;
import com.globits.healthdeclaration.dto.HealthCareGroupAdministrativeUnitDto;
import com.globits.healthdeclaration.dto.HealthCareGroupDto;
import com.globits.healthdeclaration.functiondto.HealthCareGroupSearchDto;
import com.globits.healthdeclaration.functiondto.UserInfoDto;
import com.globits.healthdeclaration.repository.HealthCareGroupRepository;
import com.globits.healthdeclaration.repository.HDAdministrativeUnitRepository;
import com.globits.healthdeclaration.repository.HealthCareGroupAdministrativeUnitRepository;
import com.globits.healthdeclaration.service.HealthCareGroupService;
import com.globits.healthdeclaration.service.UserAdministrativeUnitService;
import com.globits.security.domain.User;
import com.globits.healthdeclaration.service.HDAdministrativeUnitService;
import com.globits.healthdeclaration.service.HealthCareGroupAdministrativeUnitService;

@Transactional
@Service
public class HealthCareGroupServiceImpl extends GenericServiceImpl<HealthCareGroup, UUID> implements HealthCareGroupService{
	@Autowired
	private EntityManager manager;

	@Autowired
	public HealthCareGroupRepository repository;
	
	@Autowired
	public HealthCareGroupAdministrativeUnitRepository haRepository;
	@Autowired
	public HDAdministrativeUnitRepository hdRepository;
	@Autowired
	HealthCareGroupAdministrativeUnitService haService;
	@Autowired
	public HDAdministrativeUnitService hdAdministrativeUnitService;

	@Autowired
	private UserAdministrativeUnitService userAdministrativeUnitService;

	@Override
	public Page<HealthCareGroupDto> searchByDto(HealthCareGroupSearchDto dto) {
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

		if (!userInfo.isAdmin() && (userInfo.isMedicalTeam() || userInfo.isHealthCareStaff())) {
			dto.setListUnit(userInfo.getListUnit());
		}
		if (dto.getAdministrativeUnitId() != null) {
			if (dto.getListUnit() == null) {
				dto.setListUnit(new ArrayList<UUID>());
			}
			dto.getListUnit().add(dto.getAdministrativeUnitId());
			List<UUID> lst = hdAdministrativeUnitService.getAllHDAdministrativeUnitIdByParentId(dto.getAdministrativeUnitId());
			dto.getListUnit().addAll(lst);
		}

		String whereClause = " where (1=1) ";
		String joinSql = " ";
		String orderBy = " ORDER BY entity.code, entity.name ";
		String sqlCount = "select count(DISTINCT entity.id) from HealthCareGroup as entity ";
		String sql = "select DISTINCT new com.globits.healthdeclaration.dto.HealthCareGroupDto(entity) from HealthCareGroup as entity ";

		if (dto.getListUnit() != null && dto.getListUnit().size() > 0) {
			joinSql += " JOIN HealthCareGroupAdministrativeUnit hcgau ON hcgau.healthCareGroup.id = entity.id ";
			whereClause += " AND ( hcgau.administrativeUnit.id IN (:lstAdministrativeUnitId) ) ";
		}
		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			whereClause += " AND ( entity.name LIKE :text OR entity.code LIKE :text ) ";
		}

		sql += joinSql + whereClause + orderBy;
		sqlCount += joinSql + whereClause;
		Query q = manager.createQuery(sql, HealthCareGroupDto.class);
		Query qCount = manager.createQuery(sqlCount);

		if (dto.getListUnit() != null && dto.getListUnit().size() > 0) {
			q.setParameter("lstAdministrativeUnitId", dto.getListUnit());
			qCount.setParameter("lstAdministrativeUnitId", dto.getListUnit());
		}
		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			q.setParameter("text", '%' + dto.getText().trim() + '%');
			qCount.setParameter("text", '%' + dto.getText().trim() + '%');
		}
		int startPosition = pageIndex * pageSize;
		q.setFirstResult(startPosition);
		q.setMaxResults(pageSize);
		List<HealthCareGroupDto> entities = q.getResultList();
		long count = (long) qCount.getSingleResult();

		Pageable pageable = PageRequest.of(pageIndex, pageSize);
		Page<HealthCareGroupDto> result = new PageImpl<HealthCareGroupDto>(entities, pageable, count);

		return result;
	}

	@Override
	public HealthCareGroupDto getById(UUID id) {
		if (id != null) {
			HealthCareGroup entity = repository.getOne(id);
			if (entity != null) {
				return new HealthCareGroupDto(entity);
			}
		}
		return null;
	}

	@Override
	public HealthCareGroupDto saveOrUpdate(HealthCareGroupDto dto, UUID id) {
		if (dto != null) {
			HealthCareGroup entity = null;
			if (id != null) {
				entity = repository.getOne(id);
			}
			if (entity == null) {
				entity = new HealthCareGroup();
			}

			entity.setName(dto.getName());
			entity.setCode(dto.getCode());
			entity.setAddress(dto.getAddress());
			entity.setPhoneNumber1(dto.getPhoneNumber1());
			entity.setPhoneNumber2(dto.getPhoneNumber2());
			entity.setZalo(dto.getZalo());
			entity.setFaceBook(dto.getFaceBook());
			if(dto.getListHealthCareGroupAdministrativeUnits()!=null && dto.getListHealthCareGroupAdministrativeUnits().size()>0) {
				Set<HealthCareGroupAdministrativeUnit> healthCareGroupAdministrativeUnitSet = new HashSet<>();
				for(HealthCareGroupAdministrativeUnitDto haDto : dto.getListHealthCareGroupAdministrativeUnits()) {
					
					HealthCareGroupAdministrativeUnit ha = null;
					if(haDto.getId()!= null) {
						ha = haRepository.getOne(haDto.getId());
					}
					if(ha == null) {
						ha = new HealthCareGroupAdministrativeUnit();
					}
					if(haDto.getAdministrativeUnit() != null && haDto.getAdministrativeUnit().getId() != null) {
						HDAdministrativeUnit hd = hdRepository.getOne(haDto.getAdministrativeUnit().getId());
						if(hd!= null) {
							ha.setAdministrativeUnit(hd);
							ha.setHealthCareGroup(entity);
							healthCareGroupAdministrativeUnitSet.add(ha);
						}
					}
					
				}
				if (entity.getListHealthCareGroupAdministrativeUnits() == null) {
					entity.setListHealthCareGroupAdministrativeUnits(healthCareGroupAdministrativeUnitSet);
				} else {
					entity.getListHealthCareGroupAdministrativeUnits().clear();
					entity.getListHealthCareGroupAdministrativeUnits().addAll(healthCareGroupAdministrativeUnitSet);
				}
            } else if (entity.getListHealthCareGroupAdministrativeUnits() != null) {
            	entity.getListHealthCareGroupAdministrativeUnits().clear();
			}
			entity = repository.save(entity);
			if (entity != null) {
				return new HealthCareGroupDto(entity);
			}
		}
		return null;
	}

	@Override
	public Boolean deleteById(UUID id) {
		if (id != null) {
			HealthCareGroup entity = repository.getOne(id);
			if (entity != null) {
				repository.deleteById(id);
				return true;
			}
		}
		return false;
	}

	@Override
	public List<UUID> getAllAdministrativeUnitIdById(UUID healthCareGroupId) {
		List<UUID> results = null;
		if (healthCareGroupId != null) {
			results = new ArrayList<>();
			List<UUID> lst = haRepository.getAllAdministrativeUnitIdById(healthCareGroupId);
			if (lst != null && lst.size() > 0) {
				results.addAll(lst);
				for (UUID uuid : lst) {
					results.addAll(hdAdministrativeUnitService.getAllHDAdministrativeUnitIdByParentId(uuid));
				}
			}
		}
		return results;
	}
	@Override
	public Boolean checkDuplicateCode(UUID id, String code) {
		boolean isDuplicate = true;
		List<HealthCareGroup> list = repository.getByCode(code);
		if (list != null && list.size() > 0) {
			if (id != null) {
				for (HealthCareGroup item : list) {
					if (item.getId().equals(id)) {
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
	public List<HealthCareGroupDto> getListHealthCareGroup(List<UUID> ids){
		List<HealthCareGroupDto> list = new ArrayList<>(); 
		if(ids != null && ids.size() > 0) {
			for(UUID id: ids) {
				List<HealthCareGroupDto> listHCG = haRepository.listHealthCareGroupByUnit(id);
				if(listHCG != null && listHCG.size() > 0) {
					for(HealthCareGroupDto dto: listHCG) {
						list.add(dto);
					}
				}
			}
		}
		return list;
	}
}
