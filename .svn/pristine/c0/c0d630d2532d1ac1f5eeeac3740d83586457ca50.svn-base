package com.globits.healthdeclaration.service.impl;

import com.globits.core.service.impl.GenericServiceImpl;
import com.globits.healthdeclaration.domain.HDAdministrativeUnit;
import com.globits.healthdeclaration.domain.HealthOrganization;
import com.globits.healthdeclaration.dto.HealthOrganizationDto;
import com.globits.healthdeclaration.functiondto.HealthOrganizationSearchDto;
import com.globits.healthdeclaration.functiondto.SearchDto;
import com.globits.healthdeclaration.repository.HDAdministrativeUnitRepository;
import com.globits.healthdeclaration.repository.HealthOrganizationRepository;
import com.globits.healthdeclaration.service.HDAdministrativeUnitService;
import com.globits.healthdeclaration.service.HealthOrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Transactional
@Service
public class HealthOrganizationServiceImpl extends GenericServiceImpl<HealthOrganization, UUID> implements HealthOrganizationService {

    @Autowired
    private EntityManager manager;

    @Autowired
    private HealthOrganizationRepository repository;

    @Autowired
    private HDAdministrativeUnitRepository hdAdministrativeUnitRepository;

    @Autowired
    HDAdministrativeUnitService hdAdministrativeUnitService;

    @Override
    public Page<HealthOrganizationDto> searchByDto(HealthOrganizationSearchDto dto) {
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

        List<UUID> listAdministrativeUnitId = null;

        if (dto.getAdministrativeUnitId() != null) {
            listAdministrativeUnitId = new ArrayList<UUID>();
            listAdministrativeUnitId.add(dto.getAdministrativeUnitId());
            listAdministrativeUnitId.addAll(hdAdministrativeUnitService.getAllHDAdministrativeUnitIdByParentId(dto.getAdministrativeUnitId()));
        }

        String whereClause = "";
        String orderBy = " ";
        String sqlCount = "select count(DISTINCT entity.id) from HealthOrganization as entity where (1=1) ";
        String sql = "select new com.globits.healthdeclaration.dto.HealthOrganizationDto(entity) from HealthOrganization as entity where (1=1) ";

        if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
            whereClause += " AND (entity.name LIKE :text " + "OR entity.code LIKE :text ";
        }

        if (listAdministrativeUnitId != null && listAdministrativeUnitId.size() > 0) {
            whereClause += " AND ( entity.administrativeUnit.id IN (:listAdministrativeUnitId) ) ";
        }

        sql += whereClause + orderBy;
        sqlCount += whereClause;
        Query q = manager.createQuery(sql, HealthOrganizationDto.class);
        Query qCount = manager.createQuery(sqlCount);

        if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
            q.setParameter("text", '%' + dto.getText().trim() + '%');
            qCount.setParameter("text", '%' + dto.getText().trim() + '%');
        }

        if (listAdministrativeUnitId != null && listAdministrativeUnitId.size() > 0) {
            q.setParameter("listAdministrativeUnitId", listAdministrativeUnitId);
            qCount.setParameter("listAdministrativeUnitId", listAdministrativeUnitId);
        }

        int startPosition = pageIndex * pageSize;
        q.setFirstResult(startPosition);
        q.setMaxResults(pageSize);
        List<HealthOrganizationDto> entities = q.getResultList();
        long count = (long) qCount.getSingleResult();

        Pageable pageable = PageRequest.of(pageIndex, pageSize);
        Page<HealthOrganizationDto> result = new PageImpl<HealthOrganizationDto>(entities, pageable, count);

        return result;
    }

    @Override
    public HealthOrganizationDto getById(UUID id) {
        if (id != null) {
            HealthOrganization entity = repository.getOne(id);
            if (entity != null) {
                return new HealthOrganizationDto(entity);
            }
        }
        return null;
    }

    @Override
    public HealthOrganizationDto saveOrUpdate(HealthOrganizationDto dto, UUID id) {
        if (dto != null) {
            HealthOrganization entity = null;
            if (id != null) {
                entity = repository.getOne(id);
            }
            if (entity == null) {
                entity = new HealthOrganization();
            }

            entity.setName(dto.getName());
            entity.setCode(dto.getCode());
            if (dto.getAdministrativeUnit() != null) {
                HDAdministrativeUnit administrativeUnit = hdAdministrativeUnitRepository
                        .getOne(dto.getAdministrativeUnit().getId());
                entity.setAdministrativeUnit(administrativeUnit);
            } else {
                entity.setAdministrativeUnit(null);
            }
            entity = repository.save(entity);
            if (entity != null) {
                return new HealthOrganizationDto(entity);
            }
        }
        return null;
    }

    @Override
    public Boolean deleteById(UUID id) {
        if (id != null) {
            HealthOrganization entity = repository.getOne(id);
            if (entity != null) {
                repository.deleteById(id);
                return true;
            }
        }
        return false;
    }

    @Override
    public Boolean checkCode(UUID id, String code) {
        boolean result = true;
        if (code != null && StringUtils.hasText(code)) {
            List<HealthOrganization> entities = repository.findByCode(code);
            if (entities != null && entities.size() > 0) {
                for (HealthOrganization healthOrganization : entities) {
                    if (id != null) {
                        if (healthOrganization.getId().equals(id)) {
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
