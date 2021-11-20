package com.globits.healthdeclaration.service.impl;
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
import com.globits.healthdeclaration.domain.BackgroundDisease;

import com.globits.healthdeclaration.dto.BackgroundDiseaseDto;

import com.globits.healthdeclaration.functiondto.BackgroundDiseaseSearchDto;
import com.globits.healthdeclaration.repository.BackgroundDiseaseRepository;
import com.globits.healthdeclaration.service.BackgroundDiseaseService;

@Transactional
@Service
public class BackgroundDiseaseServiceImpl extends GenericServiceImpl<BackgroundDisease, UUID> implements BackgroundDiseaseService{

	@Autowired
	public BackgroundDiseaseRepository repository;
	
	@Autowired
	private EntityManager manager;

	@Override
	public Page<BackgroundDiseaseDto> searchByDto(BackgroundDiseaseSearchDto dto) {
		// TODO Auto-generated method stub
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
		String orderBy = " ORDER BY entity.code asc ";
		String sqlCount = "select count(entity.id) from BackgroundDisease as entity where (1=1) ";
		String sql = "select new com.globits.healthdeclaration.dto.BackgroundDiseaseDto(entity) from BackgroundDisease as entity where (1=1) ";

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			whereClause += " AND ( entity.name LIKE :text OR entity.code LIKE :text ) ";
		}

		sql += whereClause + orderBy;
		sqlCount += whereClause;
		Query q = manager.createQuery(sql, BackgroundDiseaseDto.class);
		Query qCount = manager.createQuery(sqlCount);

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			q.setParameter("text", '%' + dto.getText().trim() + '%');
			qCount.setParameter("text", '%' + dto.getText().trim() + '%');
		}
		int startPosition = pageIndex * pageSize;
		q.setFirstResult(startPosition);
		q.setMaxResults(pageSize);
		List<BackgroundDiseaseDto> entities = q.getResultList();
		long count = (long) qCount.getSingleResult();

		Pageable pageable = PageRequest.of(pageIndex, pageSize);
		Page<BackgroundDiseaseDto> result = new PageImpl<BackgroundDiseaseDto>(entities, pageable, count);

		return result;
	}

	@Override
	public BackgroundDiseaseDto getById(UUID id) {
		// TODO Auto-generated method stub
		if (id != null) {
			 BackgroundDisease entity = repository.getOne(id);
			if (entity != null) {
				return new  BackgroundDiseaseDto(entity);
			}
		}
		return null;
	}

	@Override
	public BackgroundDiseaseDto saveOrUpdate(BackgroundDiseaseDto dto, UUID id) {
		// TODO Auto-generated method stub
		if (dto != null) {
			BackgroundDisease entity = null;
			if (id != null) {
				entity = repository.getOne(id);
			}
			if (entity == null) {
				entity = new BackgroundDisease();
			}

			if (dto.getName() == null || StringUtils.isEmpty(dto.getName())) {
				return null;
			}
			if (dto.getCode() == null || StringUtils.isEmpty(dto.getCode())) {
				return null;
			}
			entity.setName(dto.getName());
			entity.setCode(dto.getCode());
			entity.setDescription(dto.getDescription());
			entity = repository.save(entity);
			if (entity != null) {
				return new BackgroundDiseaseDto(entity);
			}
		}
		return null;	}

	@Override
	public Boolean deleteById(UUID id) {
		// TODO Auto-generated method stub
		if (id != null) {
			BackgroundDisease entity = repository.getOne(id);
			if (entity != null) {
				repository.deleteById(id);
				return true;
			}
		}
		return false;

	}
	

}
