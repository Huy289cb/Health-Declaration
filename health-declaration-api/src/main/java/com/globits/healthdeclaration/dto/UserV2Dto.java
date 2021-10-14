package com.globits.healthdeclaration.dto;

import java.util.List;
import java.util.stream.Collectors;

import com.globits.core.dto.PersonDto;
import com.globits.security.domain.User;
import com.globits.security.dto.RoleDto;

public class UserV2Dto {
	private Long id;
	private String email;
	private String password;
	private String username;
	private PersonDto person;
	private List<RoleDto> roles;

	public UserV2Dto() {

	}

	public UserV2Dto(User entity) {
		id = entity.getId();
		email = entity.getEmail();
		username = entity.getUsername();
		person = new PersonDto(entity.getPerson());

		roles = entity.getRoles()
				.parallelStream()
				.map(RoleDto::new)
				.collect(Collectors.toList());
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public PersonDto getPerson() {
		return person;
	}

	public void setPerson(PersonDto person) {
		this.person = person;
	}

	public List<RoleDto> getRoles() {
		return roles;
	}

	public void setRoles(List<RoleDto> roles) {
		this.roles = roles;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

}
