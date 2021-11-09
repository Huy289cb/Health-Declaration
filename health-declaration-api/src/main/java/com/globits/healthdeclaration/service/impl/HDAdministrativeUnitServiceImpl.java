package com.globits.healthdeclaration.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.persistence.Query;
import javax.transaction.Transactional;

import com.globits.healthdeclaration.domain.Family;
import org.joda.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.globits.security.domain.User;
import com.globits.core.service.impl.GenericServiceImpl;
import com.globits.healthdeclaration.domain.HDAdministrativeUnit;
import com.globits.healthdeclaration.dto.HDAdministrativeUnitDto;
import com.globits.healthdeclaration.functiondto.HDAdministrativeUnitImportExcel;
import com.globits.healthdeclaration.functiondto.HDAdministrativeUnitSearchDto;
import com.globits.healthdeclaration.repository.EncounterRepository;
import com.globits.healthdeclaration.repository.FamilyRepository;
import com.globits.healthdeclaration.repository.HDAdministrativeUnitRepository;
import com.globits.healthdeclaration.repository.HealthCareGroupAdministrativeUnitRepository;
import com.globits.healthdeclaration.repository.HealthOrganizationRepository;
import com.globits.healthdeclaration.repository.PractitionerRepository;
import com.globits.healthdeclaration.repository.UserAdministrativeUnitRepository;
import com.globits.healthdeclaration.service.HDAdministrativeUnitService;

@Transactional
@Service
public class HDAdministrativeUnitServiceImpl extends GenericServiceImpl<HDAdministrativeUnit, UUID>
		implements HDAdministrativeUnitService {
	@Autowired
	private HDAdministrativeUnitRepository repository;
	@Autowired
	private EncounterRepository encounterRepository;
	@Autowired
	private FamilyRepository familyRepository;
	@Autowired
	private HealthCareGroupAdministrativeUnitRepository healthCareGroupAdministrativeUnitRepository;
	@Autowired
	private HealthOrganizationRepository healthOrganizationRepository;
	@Autowired
	private PractitionerRepository practitionerRepository;
	@Autowired
	private UserAdministrativeUnitRepository userAdministrativeUnitRepository;
	
	@Override
	public List<UUID> getAllHDAdministrativeUnitIdByParentId(UUID parentId) {
		List<UUID> ret = new ArrayList<UUID>();
		ret.add(parentId);
		List<UUID> list = repository.getAllIdByParentId(parentId);
		if (list != null && list.size() > 0) {
			ret.addAll(list);
			for (UUID long1 : list) {
				List<UUID> lst = new ArrayList<UUID>();
				lst = repository.getAllIdByParentId(long1);
				if (lst != null && lst.size() > 0) {
					ret.addAll(lst);
				}
			}
		}
//		HDAdministrativeUnit au=repository.findOne(parentId);
		return ret;
	}

	@Override
	public List<UUID> getAllChildIdByParentId(UUID parentId) {
		List<UUID> ret = new ArrayList<UUID>();
		List<UUID> list = repository.getAllIdByParentId(parentId);
		if (list != null && list.size() > 0) {
			ret.addAll(list);
			for (UUID childId : list) {
				List<UUID> listChild = getAllChildIdByParentId(childId);
				if (listChild != null && listChild.size() > 0) {
					ret.addAll(listChild);
				}
			}
		}
		return ret;
	}

	@Override
	public List<HDAdministrativeUnit> getAllChildByParentId(UUID uuid) {
		List<HDAdministrativeUnit> ret = new ArrayList<>();
		List<HDAdministrativeUnit> list = repository.getAllEntityByParentId(uuid);
		if (list != null && list.size() > 0) {
			ret.addAll(list);
			for (HDAdministrativeUnit childId : list) {
				List<HDAdministrativeUnit> listChild = getAllChildByParentId(childId.getId());
				if (listChild != null && listChild.size() > 0) {
					ret.addAll(listChild);
				}
			}
		}
		return ret;
	}

	@Override
	public List<HDAdministrativeUnitDto> getAllChildByParentId(UUID parentId, String prefix) {
		List<HDAdministrativeUnitDto> ret = new ArrayList<HDAdministrativeUnitDto>();
		if (prefix == "") {
			HDAdministrativeUnitDto parent = repository.getById(parentId);
			if (parent != null) {
				parent.setName(prefix + parent.getName());
				ret.add(parent);
			}
			prefix = "..";
		}
		List<HDAdministrativeUnitDto> list = repository.getAllByParentId(parentId);
		if (list != null && list.size() > 0) {
			ret.addAll(list);
			for (HDAdministrativeUnitDto childId : list) {
				if (prefix != "") {
					childId.setName(prefix + childId.getName());
					ret.add(childId);
				}
				List<HDAdministrativeUnitDto> listChild = getAllChildByParentId(childId.getId(), prefix + "..");
				if (listChild != null && listChild.size() > 0) {
					ret.addAll(listChild);
				}
			}
		}
		return ret;
	}

	@Override
	public Page<HDAdministrativeUnitDto> searchByDto(HDAdministrativeUnitSearchDto dto) {
		if (dto == null) {
			return null;
		}
		int pageIndex = dto.getPageIndex();
		int pageSize = dto.getPageSize();

		if (pageIndex > 0) {
			pageIndex--;
		} else {
			pageIndex = 0;
		}

		String whereClause = "";
		String orderBy = " ORDER BY entity.level ASC, length(entity.name), entity.name,  entity.code ";
		String sqlCount = "select count(entity.id) from HDAdministrativeUnit as entity where (1=1) ";
		String sql = "select new com.globits.healthdeclaration.dto.HDAdministrativeUnitDto(entity) from HDAdministrativeUnit as entity where (1=1) ";
		whereClause += "  and ( entity.voided = 0 or entity.voided is null ) ";
		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			whereClause += " AND (entity.name LIKE :text OR entity.code LIKE :text ) ";
		}
		if (dto.getParentId() != null) {
			whereClause += " AND (entity.parent.id=:parentId ) ";
		}
		if (dto.getIsGetAllCity() != null && dto.getIsGetAllCity()) {
			whereClause += " AND (entity.parent.id IS NULL ) ";
		}
		
		sql += whereClause + orderBy;
		sqlCount += whereClause;
		Query q = manager.createQuery(sql, HDAdministrativeUnitDto.class);
		Query qCount = manager.createQuery(sqlCount);

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			q.setParameter("text", '%' + dto.getText().trim() + '%');
			qCount.setParameter("text", '%' + dto.getText().trim() + '%');
		}
		if (dto.getParentId() != null) {
			q.setParameter("parentId", dto.getParentId());
			qCount.setParameter("parentId", dto.getParentId());
		}
		int startPosition = pageIndex * pageSize;
		q.setFirstResult(startPosition);
		q.setMaxResults(pageSize);
		List<HDAdministrativeUnitDto> entities = q.getResultList();
		long count = (long) qCount.getSingleResult();

		Pageable pageable = PageRequest.of(pageIndex, pageSize);
		Page<HDAdministrativeUnitDto> result = new PageImpl<HDAdministrativeUnitDto>(entities, pageable, count);

		return result;
	}

	@Override
	public HDAdministrativeUnitDto getById(UUID id) {
		if (id != null) {
			HDAdministrativeUnit entity = repository.getOne(id);
			if (entity != null) {
				return new HDAdministrativeUnitDto(entity);
			}
		}
		return null;
	}

	@Override
	public HDAdministrativeUnitDto saveOrUpdate(HDAdministrativeUnitDto dto, UUID id) {
		if (dto != null) {
			HDAdministrativeUnit HDAdministrativeUnit = null;
			Boolean isEdit = false;
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			User modifiedUser = null;
			LocalDateTime currentDate = LocalDateTime.now();
			String currentUserName = "Unknown User";
			if (authentication != null) {
				modifiedUser = (User) authentication.getPrincipal();
				currentUserName = modifiedUser.getUsername();
			}
			if (id != null) {// trường hợp edit
				isEdit = true;
				HDAdministrativeUnit = this.repository.findOne(id);
			} else if (dto.getId() != null) {
				HDAdministrativeUnit = this.repository.findOne(dto.getId());
			}
			/*
			 * else if (dto.getCode() != null) { List<HDAdministrativeUnit> aus =
			 * this.repository .findListByCode(dto.getCode()); if (aus != null && aus.size()
			 * == 1) { HDAdministrativeUnit = aus.get(0); } else if (aus != null &&
			 * aus.size() > 1) { for (HDAdministrativeUnit item : aus) { if
			 * (item.getName().equals(dto.getName())) { HDAdministrativeUnit = item; break;
			 * } } } }
			 */

			if (HDAdministrativeUnit == null) {// trường hợp thêm mới
				HDAdministrativeUnit = new HDAdministrativeUnit();
				HDAdministrativeUnit.setCreateDate(currentDate);
				HDAdministrativeUnit.setCreatedBy(currentUserName);
			}

			if (dto.getName() != null)
				HDAdministrativeUnit.setName(dto.getName());

			if (dto.getCode() != null)
				HDAdministrativeUnit.setCode(dto.getCode());

			if (dto.getMapCode() != null)
				HDAdministrativeUnit.setMapCode(dto.getMapCode());

			if (dto.getLatitude() != null)
				HDAdministrativeUnit.setLatitude(dto.getLatitude());

			if (dto.getLongitude() != null)
				HDAdministrativeUnit.setLongitude(dto.getLongitude());

			if (dto.getgMapX() != null)
				HDAdministrativeUnit.setgMapX(dto.getgMapX());

			if (dto.getgMapY() != null)
				HDAdministrativeUnit.setgMapY(dto.getgMapY());

			if (dto.getTotalAcreage() != null)
				HDAdministrativeUnit.setTotalAcreage(dto.getTotalAcreage());

			if (dto.getParent() != null) {
				HDAdministrativeUnit parent = null;
				if (dto.getParent().getId() != null) {
					parent = this.repository.findOne(dto.getParent().getId());
				} else if (dto.getParent().getCode() != null) {
					List<HDAdministrativeUnit> aus = this.repository.findListByCode(dto.getParent().getCode());
					if (aus != null && aus.size() == 1) {
						parent = aus.get(0);
					} else if (aus != null && aus.size() > 1) {
						for (HDAdministrativeUnit item : aus) {
							if (item.getName().equals(dto.getParent().getName())) {
								parent = item;
								break;
							}
						}
					}
				}
				if (parent != null) {
					HDAdministrativeUnit.setParent(parent);
					if (parent.getLevel() != null && parent.getLevel() > 0) {
						HDAdministrativeUnit.setLevel(parent.getLevel() + 1);
					}
				}
			} else {
				HDAdministrativeUnit.setLevel(1); // level = 1 là cấp thành phố
				HDAdministrativeUnit.setParent(null);
			}

			this.repository.save(HDAdministrativeUnit);
			dto.setId(HDAdministrativeUnit.getId());
			return dto;
		}
		return null;
	}

	@Override
	public Boolean deleteById(UUID id) {
		if (id != null) {
			Integer encounter = encounterRepository.countEncounterByUnit(id);
			Integer family = familyRepository.countFamilyByUnit(id);
			Integer healthCareGroupAdministrativeUnit = healthCareGroupAdministrativeUnitRepository.countHealthCareGroupAdministrativeUnitByUnit(id);
			Integer healthOrganization = healthOrganizationRepository.countHealthOrganizationByUnit(id);
			Integer practitioner = practitionerRepository.countPractitionerByUnit(id);
			Integer userAdministrativeUnit = userAdministrativeUnitRepository.countUserAdministrativeUnitByUnit(id);
			Integer unit = repository.countIdByParentId(id);
 			if(encounter == 0 && family == 0 && healthCareGroupAdministrativeUnit == 0 && healthOrganization == 0 && practitioner == 0 && userAdministrativeUnit == 0 && unit == 0) {
				HDAdministrativeUnit entity = repository.getOne(id);
				if (entity != null) {
					repository.deleteById(id);
					return true;
				}
			}
		}
		return false;
	}

	@Override
	public List<HDAdministrativeUnitDto> getAll() {
		// TODO Auto-generated method stub
		List<HDAdministrativeUnitDto> dtos = repository.getAll();
		return dtos;
	}

	@Override
	public List<HDAdministrativeUnitDto> getAllBasic() {
		List<HDAdministrativeUnitDto> dtos = repository.getAllBasic();
		return dtos;
	}

	@Override
	public List<HDAdministrativeUnitDto> getAllBasicInEdit(UUID id) {
		List<HDAdministrativeUnitDto> dtos = new ArrayList<HDAdministrativeUnitDto>();
		if (id != null) {
			dtos = repository.getAllBasicInEdit(id);
		} else {
			dtos = repository.getAllBasic();
		}
		return dtos;
	}

	@Override
	public void saveOrUpdateList(List<HDAdministrativeUnitDto> listHDAdministrativeUnit) {
		ArrayList<HDAdministrativeUnitDto> ret = new ArrayList<HDAdministrativeUnitDto>();
		for (int i = 0; i < listHDAdministrativeUnit.size(); i++) {
			HDAdministrativeUnitDto dto = listHDAdministrativeUnit.get(i);
			saveAdministrativeImport(dto, dto.getId());
		}
	}

	private void saveAdministrativeImport(HDAdministrativeUnitDto dto, UUID id) {

		HDAdministrativeUnit fmsAdministrativeUnit = null;
		Boolean isEdit = false;
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		User modifiedUser = null;
		LocalDateTime currentDate = LocalDateTime.now();
		String currentUserName = "Unknown User";
		if (authentication != null) {
			modifiedUser = (User) authentication.getPrincipal();
			currentUserName = modifiedUser.getUsername();
		}
		if (id != null) {// trường hợp edit
			isEdit = true;
			fmsAdministrativeUnit = repository.findOne(id);
		} else if (dto.getId() != null) {
			fmsAdministrativeUnit = repository.findOne(dto.getId());
		} else if (dto.getCode() != null) {
			List<HDAdministrativeUnit> aus = repository.findListByCode(dto.getCode());
			if (aus != null && aus.size() == 1) {
				fmsAdministrativeUnit = aus.get(0);
			} else if (aus != null && aus.size() > 1) {
				for (HDAdministrativeUnit item : aus) {
					if (item.getName().equals(dto.getName())) {
						fmsAdministrativeUnit = item;
						break;
					}
				}
			}
		}

		if (fmsAdministrativeUnit == null) {// trường hợp thêm mới
			fmsAdministrativeUnit = new HDAdministrativeUnit();
			fmsAdministrativeUnit.setCreateDate(currentDate);
			fmsAdministrativeUnit.setCreatedBy(currentUserName);
		}

		if (dto.getName() != null)
			fmsAdministrativeUnit.setName(dto.getName());

		if (dto.getCode() != null)
			fmsAdministrativeUnit.setCode(dto.getCode());

		if (dto.getMapCode() != null)
			fmsAdministrativeUnit.setMapCode(dto.getMapCode());

		if (dto.getLatitude() != null)
			fmsAdministrativeUnit.setLatitude(dto.getLatitude());

		if (dto.getLongitude() != null)
			fmsAdministrativeUnit.setLongitude(dto.getLongitude());

		if (dto.getgMapX() != null)
			fmsAdministrativeUnit.setgMapX(dto.getgMapX());

		if (dto.getgMapY() != null)
			fmsAdministrativeUnit.setgMapY(dto.getgMapY());

		if (dto.getTotalAcreage() != null)
			fmsAdministrativeUnit.setTotalAcreage(dto.getTotalAcreage());

		if (dto.getParent() != null) {
			HDAdministrativeUnit parent = null;
			if (dto.getParent().getId() != null) {
				parent = repository.findOne(dto.getParent().getId());
			} else if (dto.getParent().getCode() != null) {
				List<HDAdministrativeUnit> aus = repository.findListByCode(dto.getParent().getCode());
				if (aus != null && aus.size() == 1) {
					parent = aus.get(0);
				} else if (aus != null && aus.size() > 1) {
					for (HDAdministrativeUnit item : aus) {
						if (item.getName().equals(dto.getParent().getName())) {
							parent = item;
							break;
						}
					}
				}
			}
			if (parent != null) {
				fmsAdministrativeUnit.setParent(parent);
				if (parent.getLevel() != null && parent.getLevel() > 0) {
					fmsAdministrativeUnit.setLevel(parent.getLevel() + 1);
				}
			}
		} else {
			fmsAdministrativeUnit.setLevel(1); // level = 1 là cấp thành phố
			fmsAdministrativeUnit.setParent(null);
		}

		repository.save(fmsAdministrativeUnit);
		dto.setId(fmsAdministrativeUnit.getId());
	}

	@Override
	public List<HDAdministrativeUnitDto> importExcel(List<HDAdministrativeUnitImportExcel> dtos) {
		if (dtos != null && dtos.size() > 0) {
			List<HDAdministrativeUnitDto> listData = new ArrayList<HDAdministrativeUnitDto>();

			for (HDAdministrativeUnitImportExcel dto : dtos) {
				HDAdministrativeUnit city = null;
				HDAdministrativeUnit district = null;
				HDAdministrativeUnit commune = null;

				if (dto.getTenTinh() != null) {
					List<HDAdministrativeUnit> listUnit = repository.findByName(dto.getTenTinh(), 1);
					if (listUnit != null && listUnit.size() > 0) {
						city = listUnit.get(0);
					}
					if (city == null) {
						Integer cityCount = repository.countCity(1) + 1;
						String count = "";
						if (cityCount > 0 && cityCount < 10) {
							count = "10" + cityCount;
						} else {
							count = "1" + cityCount;
						}
						city = new HDAdministrativeUnit();
						city.setName(dto.getTenTinh());
						city.setCode(count);
						city.setLevel(1);
						city = repository.save(city);
					}
				} // end tinh

				if (city != null) {
					if (dto.getTenHuyen() != null) {
						List<HDAdministrativeUnit> listUnit = repository.findByNameAndParent(dto.getTenHuyen(),
								city.getId(), 2);
						if (listUnit != null && listUnit.size() > 0) {
							district = listUnit.get(0);
						}
						if (district == null) {
							Integer unitCount = repository.countAdministrativeUnit(city.getId(), 2) + 1;
							String count = "";
							if (unitCount > 0 && unitCount < 10) {
								count = city.getCode() + "0" + unitCount;
							} else {
								count = city.getCode() + unitCount;
							}
							district = new HDAdministrativeUnit();
							district.setParent(city);
							district.setName(dto.getTenHuyen());
							district.setCode(count);
							district.setLevel(2);
							district = this.repository.save(district);
						}
					}
				} // end quan, huyen

				if (district != null) {
					if (dto.getTenXa() != null) {
						String tenXa = "";
						if (dto.getLoaiXa() != null) {
							tenXa = dto.getLoaiXa() + " ";
						}
						tenXa += dto.getTenXa();
						List<HDAdministrativeUnit> listUnit = repository.findByNameAndParent(tenXa,
								district.getId(), 3);
						if (listUnit != null && listUnit.size() > 0) {
							commune = listUnit.get(0);
						}
						if (commune == null) {
							Integer unitCount = repository.countAdministrativeUnit(district.getId(), 3) + 1;
							String count = "";
							if (unitCount > 0 && unitCount < 10) {
								count = district.getCode() + "0" + unitCount;
							} else {
								count = district.getCode() + unitCount;
							}
							commune = new HDAdministrativeUnit();
							
							commune.setParent(district);
							commune.setName(tenXa);
							commune.setLevel(3);
							commune.setLongitude(dto.getKinhDo());
							commune.setLatitude(dto.getViDo());
							commune.setgMapX(dto.getKinhDo());
							commune.setgMapY(dto.getViDo());
							commune.setCode(count);
							commune = repository.save(commune);
						}
					}
				} // end xa
			}
			return listData;
		}
		return null;
	}

	@Override
	public Boolean checkCode(HDAdministrativeUnitDto dto) {
		boolean result= true;
		if (dto.getCode() != null && StringUtils.hasText(dto.getCode())) {
			List<HDAdministrativeUnit> entities = repository.findListByCode(dto.getCode());
			if (entities != null && entities.size() > 0) {
				for (HDAdministrativeUnit administrativeUnit : entities) {
					if (dto.getId() != null) {
						if (administrativeUnit.getId().equals(dto.getId())) {
							result = false;
							break;
						}
					}
				}
			} else {
				result = false;
			}
		}
		return result;
	}

}
