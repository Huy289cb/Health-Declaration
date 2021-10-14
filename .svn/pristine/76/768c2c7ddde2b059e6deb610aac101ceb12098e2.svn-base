package com.globits.healthdeclaration.service.impl;

import java.util.Calendar;
import java.util.Date;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.globits.core.service.impl.GenericServiceImpl;
import com.globits.healthdeclaration.HealthDeclarationConstant;
import com.globits.healthdeclaration.HealthDeclarationEnumsType;
import com.globits.healthdeclaration.domain.UserOtp;
import com.globits.healthdeclaration.dto.FamilyDto;
import com.globits.healthdeclaration.dto.SmsSendResponseDto;
import com.globits.healthdeclaration.functiondto.RegisterDto;
import com.globits.healthdeclaration.repository.UserOtpRepository;
import com.globits.healthdeclaration.service.UserOtpService;
import com.globits.healthdeclaration.utilities.sms.OTPUtils;

@Transactional
@Service
public class UserOtpServiceImpl extends GenericServiceImpl<UserOtp, UUID> implements UserOtpService {
	@Autowired
	UserOtpRepository userOtpRepository;

	@Override
	public RegisterDto checkOtpCreateFamily(FamilyDto dto) {
		RegisterDto result = new RegisterDto();
		if (dto != null && dto.getPhoneNumber() != null && dto.getOtp() != null) {
			UserOtp userOtp = userOtpRepository.getByUserNameAndType(dto.getPhoneNumber(), HealthDeclarationEnumsType.UserOtpType.RegisterAccount.getValue());
			if (userOtp != null) {

				//Nếu tài khoản đã đăng ký thành công rồi sẽ không cho gửi mã đăng ký nữa
				if (userOtp.isUsed()) {
					result.setSuccess(false);
					result.setResult(HealthDeclarationEnumsType.RegisterUserType.IsUsed.getValue());
			    	result.setContent("Tài khoản của bạn đã được đăng ký và kích hoạt thành công, vui lòng chuyển sang đăng nhập.");
			    	return result;
				}
				//hoặc mã đã hết hạn
				//hoặc đã quá thời gian
				else if(userOtp.isExpired() || new Date().after(userOtp.getExpireTime())) {
					result.setSuccess(false);
					result.setResendOtp(true);
					result.setResult(HealthDeclarationEnumsType.RegisterUserType.Expired.getValue());
			    	result.setContent("Tài khoản của bạn chưa được kích hoạt, vui lòng nhấn 'gửi lại mã' và kích hoạt lại.");
			    	return result;
				}
				else if(!dto.getOtp().equals(userOtp.getOtp())){
					result.setSuccess(false);
					result.setResendOtp(true);
					result.setResult(HealthDeclarationEnumsType.RegisterUserType.WrongOtpCode.getValue());
			    	result.setContent("Mã OTP không trùng khớp, vui lòng thử lại hoặc gửi lại mã OTP khác.");
			    	return result;
				}
				else {
					result.setSuccess(true);
			    	return result;
				}
			}
			else {
				result.setSuccess(false);
				result.setResendOtp(false);
				result.setResult(HealthDeclarationEnumsType.RegisterUserType.AccountNotRegistered.getValue());
		    	result.setContent("Tài khoản chưa được đăng ký, vui lòng đăng ký tài khoản trước.");
		    	return result;
			}
		}
		return result;
	}

	@Override
	public RegisterDto resendOTP(String username, Integer type) {
		RegisterDto result = new RegisterDto();
		if (username != null && type != null) {
			UserOtp userOtp = userOtpRepository.getByUserNameAndType(username, HealthDeclarationEnumsType.UserOtpType.RegisterAccount.getValue());
			if (userOtp != null) {
			    Calendar calendar = Calendar.getInstance();
			    calendar.setTime(new Date());
			    calendar.add(Calendar.MINUTE, HealthDeclarationConstant.EXPIRED_TIME_OTP);

				//Nếu tài khoản đã đăng ký thành công rồi sẽ không cho gửi mã đăng ký nữa
				if (userOtp.isUsed()) {
					result.setSuccess(false);
					result.setResult(HealthDeclarationEnumsType.RegisterUserType.IsUsed.getValue());
			    	result.setContent(HealthDeclarationEnumsType.RegisterUserType.IsUsed.getDescription());
			    	return result;
				}
				else  {
					result.setSuccess(true);
					result.setResendOtp(true);
					result.setResult(HealthDeclarationEnumsType.RegisterUserType.Resend.getValue());
			    	result.setContent(HealthDeclarationEnumsType.RegisterUserType.Resend.getDescription());

				    SmsSendResponseDto sendOTP = OTPUtils.sendOTP(username);
				    if(sendOTP == null) {
						result.setSuccess(false);
				    	result.setContent("Có lỗi xảy ra khi gửi mã otp, vui lòng thử lại.");
						result.setResendOtp(true);
						userOtp.setExpired(true);
				    }
				    else if (!StringUtils.hasText(sendOTP.getOTP())) {
						result.setSuccess(false);
						result.setResendOtp(true);
						result.setContent(sendOTP.getErrorDescription());
						
						userOtp.setExpired(true);
					}
				    else {
				    	userOtp.setOtp(sendOTP.getOTP());
				    	userOtp.setExpireTime(calendar.getTime());
				    }
				    
				    userOtp =userOtpRepository.save(userOtp);
			    	
			    	return result;
				}
				
			}
		}
		return result;
	}

}
