package com.globits.healthdeclaration.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.globits.core.domain.BaseObject;

@Entity
@Table(name = "tbl_family_member")
@XmlRootElement
public class FamilyMember extends BaseObject {

	@ManyToOne
	@JoinColumn(name = "family_id")
	@NotFound(action = NotFoundAction.IGNORE)
	private Family family;

	@ManyToOne
	@JoinColumn(name = "member_id")
	@NotFound(action = NotFoundAction.IGNORE)
	private Member member;

	@Column(name="host_family")
	private Boolean hostFamily;//là chủ hộ

	@Column(name="relationship")
	private String relationship;//mối quan hệ

	public Family getFamily() {
		return family;
	}

	public void setFamily(Family family) {
		this.family = family;
	}

	public Member getMember() {
		return member;
	}

	public void setMember(Member member) {
		this.member = member;
	}

	public Boolean getHostFamily() {
		return hostFamily;
	}

	public void setHostFamily(Boolean hostFamily) {
		this.hostFamily = hostFamily;
	}

	public String getRelationship() {
		return relationship;
	}

	public void setRelationship(String relationship) {
		this.relationship = relationship;
	}

}
