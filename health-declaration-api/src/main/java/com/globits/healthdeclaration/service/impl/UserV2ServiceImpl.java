package com.globits.healthdeclaration.service.impl;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.globits.healthdeclaration.dto.UserV2Dto;
import com.globits.healthdeclaration.functiondto.UserSearchDto;
import com.globits.healthdeclaration.service.UserV2Service;

@Service
public class UserV2ServiceImpl implements UserV2Service {
	@Autowired
	EntityManager manager;

	@Override
	public Page<UserV2Dto> searchByDto(UserSearchDto dto) {
		if(dto == null){
			return null;
		}

		int pageIndex = dto.getPageIndex();
		int pageSize = dto.getPageSize();

		if(pageIndex > 0)
			pageIndex--;
		else
			pageIndex = 0;

		String whereClause = " where (1=1) ";
		String orderBy = " ";
		String sqlCount = "SELECT COUNT(u) FROM User u";
		String sql =
				"SELECT new com.globits.healthdeclaration.dto.UserV2Dto(u) FROM User u";
		if(dto.getText() != null && StringUtils.hasText(dto.getText())){
			whereClause +=
					" AND (u.person.displayName LIKE :text OR u.person.phoneNumber LIKE :text" +
							" OR u.username LIKE :text OR u.email LIKE :text)";
		}

		sql += whereClause + orderBy;
		sqlCount += whereClause;
		Query q = manager.createQuery(sql, UserV2Dto.class);
		Query qCount = manager.createQuery(sqlCount);

		if(dto.getText() != null && StringUtils.hasText(dto.getText())){
			q.setParameter("text", '%' + dto.getText().trim() + '%');
			qCount.setParameter("text", '%' + dto.getText().trim() + '%');
		}

		int startPosition = pageIndex * pageSize;
		q.setFirstResult(startPosition);
		q.setMaxResults(pageSize);
		List<UserV2Dto> entities = q.getResultList();
		long count = (long) qCount.getSingleResult();

		Pageable pageable = PageRequest.of(pageIndex, pageSize);
		Page<UserV2Dto> result = new PageImpl<>(entities, pageable, count);

		return result;
	}
}
