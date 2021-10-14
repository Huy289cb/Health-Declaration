package com.globits.healthdeclaration.domain;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

import com.globits.core.domain.BaseObject;

@Entity
@Table(name = "tbl_member_background_disease")
@XmlRootElement
public class MemberBackgroundDisease extends BaseObject {
	@ManyToOne
	@JoinColumn(name="member_id")
	private Member member;

	@OneToOne
	@JoinColumn(name = "background_disease_id")
	private BackgroundDisease backgroundDisease;

	public Member getMember() {
		return member;
	}

	public void setMember(Member member) {
		this.member = member;
	}

	public BackgroundDisease getBackgroundDisease() {
		return backgroundDisease;
	}

	public void setBackgroundDisease(BackgroundDisease backgroundDisease) {
		this.backgroundDisease = backgroundDisease;
	}

}
