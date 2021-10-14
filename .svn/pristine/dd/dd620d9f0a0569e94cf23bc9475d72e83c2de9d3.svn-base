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
import com.globits.healthdeclaration.domain.Symptom;
import com.globits.healthdeclaration.dto.SymptomDto;
import com.globits.healthdeclaration.functiondto.SymptomSearchDto;
import com.globits.healthdeclaration.repository.SymptomRepository;
import com.globits.healthdeclaration.service.SymptomService;

@Transactional
@Service
public class SymptomServiceImpl extends GenericServiceImpl<Symptom, UUID> implements SymptomService {

	@Autowired
	private EntityManager manager;

	@Autowired
	public SymptomRepository repository;

	@Override
	public Page<SymptomDto> searchByDto(SymptomSearchDto dto) {
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
		String orderBy = " ORDER BY entity.code ";
		String sqlCount = "select count(entity.id) from Symptom as entity where (1=1) ";
		String sql = "select new com.globits.healthdeclaration.dto.SymptomDto(entity) from Symptom as entity where (1=1) ";

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			whereClause += " AND ( entity.name LIKE :text OR entity.code LIKE :text ) ";
		}

		sql += whereClause + orderBy;
		sqlCount += whereClause;
		Query q = manager.createQuery(sql, SymptomDto.class);
		Query qCount = manager.createQuery(sqlCount);

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			q.setParameter("text", '%' + dto.getText().trim() + '%');
			qCount.setParameter("text", '%' + dto.getText().trim() + '%');
		}
		int startPosition = pageIndex * pageSize;
		q.setFirstResult(startPosition);
		q.setMaxResults(pageSize);
		List<SymptomDto> entities = q.getResultList();
		long count = (long) qCount.getSingleResult();

		Pageable pageable = PageRequest.of(pageIndex, pageSize);
		Page<SymptomDto> result = new PageImpl<SymptomDto>(entities, pageable, count);

		return result;
	}

	@Override
	public SymptomDto getById(UUID id) {
		if (id != null) {
			Symptom entity = repository.getOne(id);
			if (entity != null) {
				return new SymptomDto(entity);
			}
		}
		return null;
	}

	@Override
	public SymptomDto saveOrUpdate(SymptomDto dto, UUID id) {
		if (dto != null) {
			Symptom entity = null;
			if (id != null) {
				entity = repository.getOne(id);
			}
			if (entity == null) {
				entity = new Symptom();
			}

			entity.setName(dto.getName());
			entity.setCode(dto.getCode());
			entity.setType(dto.getType());
			entity.setDescription(dto.getDescription());
			entity = repository.save(entity);
			if (entity != null) {
				return new SymptomDto(entity);
			}
		}
		return null;
	}

	@Override
	public Boolean deleteById(UUID id) {
		if (id != null) {
			Symptom entity = repository.getOne(id);
			if (entity != null) {
				repository.deleteById(id);
				return true;
			}
		}
		return false;
	}

}
