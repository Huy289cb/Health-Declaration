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
import com.globits.healthdeclaration.domain.Family;
import com.globits.healthdeclaration.domain.Practitioner;
import com.globits.healthdeclaration.domain.PractitionerAndFamily;
import com.globits.healthdeclaration.dto.FamilyDto;
import com.globits.healthdeclaration.dto.PractitionerAndFamilyDto;
import com.globits.healthdeclaration.functiondto.PractitionerAndFamilySearchDto;
import com.globits.healthdeclaration.functiondto.UserInfoDto;
import com.globits.healthdeclaration.repository.FamilyRepository;
import com.globits.healthdeclaration.repository.PractitionerAndFamilyRepository;
import com.globits.healthdeclaration.repository.PractitionerRepository;
import com.globits.healthdeclaration.service.PractitionerAndFamilyService;
import com.globits.healthdeclaration.service.UserAdministrativeUnitService;

@Transactional
@Service
public class PractitionerAndFamilyServiceImpl extends GenericServiceImpl<PractitionerAndFamily, UUID> implements PractitionerAndFamilyService {

	@Autowired
	private EntityManager manager;

	@Autowired
	public PractitionerAndFamilyRepository repository;

	@Autowired
	public FamilyRepository familyRepository;

	@Autowired
	public PractitionerRepository practitionerRepository;

    @Autowired
    private UserAdministrativeUnitService userAdministrativeUnitService;

	@Override
	public Page<PractitionerAndFamilyDto> searchByDto(PractitionerAndFamilySearchDto dto) {
    	UserInfoDto userInfo = userAdministrativeUnitService.getAllInfoByUserLogin();
        if (dto == null || userInfo == null) {
            return null;
        }
        
		/*
		 * List<UUID> listAUID = null; if (!userInfo.isAdmin()) { if
		 * (userInfo.isHealthCareStaff() &&
		 * userInfo.getUserUnit().getAdministrativeUnit() != null) {
		 * listAUID.add(userInfo.getUserUnit().getAdministrativeUnit().getId()); } }
		 */
        
        if (!userInfo.isAdmin() && userInfo.isHealthCareStaff()) {
			if (userInfo.getUserUnit() != null && userInfo.getUserUnit().getUser() != null && userInfo.getUserUnit().getUser().getPerson() != null) {
				dto.setPractitionerId(userInfo.getUserUnit().getUser().getPerson().getId());
			}
		}
        int pageIndex = dto.getPageIndex();
        int pageSize = dto.getPageSize();

        if (pageIndex > 0) {
            pageIndex--;
        } else {
            pageIndex = 0;
        }

        String whereClause = " where (1=1) ";
        String joinSql = " RIGHT JOIN Practitioner p ON p.id = entity.practitioner.id "
        		+ " RIGHT JOIN Family f ON f.id = entity.family.id ";
        String orderBy = " ORDER BY entity.createDate  ";
        
        String sqlCount = "select count(entity.id) from PractitionerAndFamily as entity ";
        String sql = "select new com.globits.healthdeclaration.dto.PractitionerAndFamilyDto(entity, p, f) from PractitionerAndFamily as entity ";

        if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
            whereClause += " AND (entity.name LIKE :text " + "OR entity.code LIKE :text) ";
        }
        if (dto.getPractitionerId() != null) {
            whereClause += " AND ( entity.practitioner.id = :practitionerId ) ";
		}
		/*
		 * if (listAUID != null) { whereClause +=
		 * " AND ( entity.administrativeUnit.id IN (:listAUID) OR entity.administrativeUnit.parent.id IN (:listAUID) "
		 * +
		 * " OR entity.administrativeUnit.parent.parent.id IN (:listAUID)  OR entity.administrativeUnit.parent.parent.parent.id IN (:listAUID) ) "
		 * ; }
		 */
        sql += joinSql + whereClause + orderBy;
        sqlCount += joinSql + whereClause;
        Query q = manager.createQuery(sql, PractitionerAndFamilyDto.class);
        Query qCount = manager.createQuery(sqlCount);

        if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
            q.setParameter("text", '%' + dto.getText().trim() + '%');
            qCount.setParameter("text", '%' + dto.getText().trim() + '%');
        }
        if (dto.getPractitionerId() != null) {
            q.setParameter("text", dto.getPractitionerId());
            qCount.setParameter("text", dto.getPractitionerId());
		}
		/*
		 * if (listAUID != null) { q.setParameter("listAUID", listAUID);
		 * qCount.setParameter("listAUID", listAUID); }
		 */
        int startPosition = pageIndex * pageSize;
        q.setFirstResult(startPosition);
        q.setMaxResults(pageSize);
        List<PractitionerAndFamilyDto> entities = q.getResultList();
        long count = (long) qCount.getSingleResult();

        Pageable pageable = PageRequest.of(pageIndex, pageSize);
        Page<PractitionerAndFamilyDto> result = new PageImpl<PractitionerAndFamilyDto>(entities, pageable, count);

        return result;
	}

	@Override
	public PractitionerAndFamilyDto assignment(UUID familyId, UUID practitionerId, Integer type) {
		
		if (familyId != null && practitionerId != null && type!=null) {
			List<PractitionerAndFamily> entites = repository.getBy(familyId, type);
			if(entites!=null && entites.size()>0) {
				repository.deleteInBatch(entites);
			}
			Family f = familyRepository.getOne(familyId);
			Practitioner p = practitionerRepository.getOne(practitionerId);
			if (f != null && p != null) {
				PractitionerAndFamily paf= new PractitionerAndFamily();
				paf.setFamily(f);
				paf.setPractitioner(p);
				paf.setType(type);
				paf = repository.save(paf);
				return new PractitionerAndFamilyDto(paf);
			}
		}
		return null;
	}
	
	@Override
	public List<PractitionerAndFamilyDto> updateListFamily(List<FamilyDto> listFamily, UUID practitionerId, Integer type) {
		List<PractitionerAndFamilyDto> list = new ArrayList<PractitionerAndFamilyDto>();
		if(listFamily != null && listFamily.size() > 0) {
			for(FamilyDto item: listFamily) {
				list.add(assignment(item.getId(), practitionerId,type));
			}
		}
		return list;
	}

}
