package com.globits.healthdeclaration.service;

import java.util.UUID;

import com.globits.core.service.GenericService;
import com.globits.healthdeclaration.domain.UserOtp;
import com.globits.healthdeclaration.dto.FamilyDto;
import com.globits.healthdeclaration.functiondto.RegisterDto;

public interface UserOtpService extends GenericService<UserOtp, UUID> {

	RegisterDto checkOtpCreateFamily(FamilyDto dto);

	RegisterDto resendOTP(String username, Integer value);

}
