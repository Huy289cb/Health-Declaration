package com.globits.healthdeclaration.domain;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

import com.globits.core.domain.BaseObject;

@Entity
@Table(name = "tbl_user_otp")
@XmlRootElement
public class UserOtp extends BaseObject {
	@Column(name = "opt_type")
	private Integer otpType;// HealthDeclarationEnumsType.UserOtpType
	
	@Column(name = "otp")
	private String otp;

	@Column(name = "user_name")
	private String userName;

	@Column(name = "is_expired")
	private boolean isExpired;

	@Column(name = "is_used")
	private boolean isUsed;

	@Column(name = "expire_time")
	private Date expireTime;

	public Integer getOtpType() {
		return otpType;
	}

	public void setOtpType(Integer otpType) {
		this.otpType = otpType;
	}

	public String getOtp() {
		return otp;
	}

	public void setOtp(String otp) {
		this.otp = otp;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public boolean isExpired() {
		return isExpired;
	}

	public void setExpired(boolean isExpired) {
		this.isExpired = isExpired;
	}

	public Date getExpireTime() {
		return expireTime;
	}

	public void setExpireTime(Date expireTime) {
		this.expireTime = expireTime;
	}

	public boolean isUsed() {
		return isUsed;
	}

	public void setUsed(boolean isUsed) {
		this.isUsed = isUsed;
	}

}
