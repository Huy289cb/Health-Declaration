package com.globits.healthdeclaration.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.globits.core.domain.BaseObject;
import com.globits.healthdeclaration.HealthDeclarationEnumsType.UserUnitType;
import com.globits.security.domain.Role;
import com.globits.security.domain.User;

@Entity
@Table(name = "tbl_user_administrative_unit")
@XmlRootElement
public class UserAdministrativeUnit extends BaseObject {
	@ManyToOne
	@JoinColumn(name="user_id")
	private User user;

	@OneToOne
	@JoinColumn(name = "administrative_unit_id")
	private HDAdministrativeUnit administrativeUnit;

	@OneToOne
	@JoinColumn(name = "health_care_group_id")
	private HealthCareGroup healthCareGroup;

	@ManyToOne
	@JoinColumn(name="role_id")
	@NotFound(action = NotFoundAction.IGNORE)
	private Role role;
	
	@Column(name = "type", nullable = true)
	@Enumerated(value = EnumType.STRING)
	private UserUnitType userType;

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public HDAdministrativeUnit getAdministrativeUnit() {
		return administrativeUnit;
	}

	public void setAdministrativeUnit(HDAdministrativeUnit administrativeUnit) {
		this.administrativeUnit = administrativeUnit;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public HealthCareGroup getHealthCareGroup() {
		return healthCareGroup;
	}

	public void setHealthCareGroup(HealthCareGroup healthCareGroup) {
		this.healthCareGroup = healthCareGroup;
	}

	public UserUnitType getUserType() {
		return userType;
	}

	public void setUserType(UserUnitType userType) {
		this.userType = userType;
	}
}
