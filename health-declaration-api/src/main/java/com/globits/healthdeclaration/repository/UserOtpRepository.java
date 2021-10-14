package com.globits.healthdeclaration.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.globits.healthdeclaration.domain.UserOtp;

@Repository
public interface UserOtpRepository extends JpaRepository<UserOtp, UUID>  {

    @Query(" from UserOtp entity where entity.userName = ?1 and entity.otp = ?2")
    UserOtp getByUserNameAndOTP(String username, String otpCode);

	@Query(" FROM UserOtp entity where entity.userName =?1 AND entity.otpType = ?2 ")
	UserOtp getByUserNameAndType(String username, Integer value);

	@Query(" FROM UserOtp entity where entity.userName =?1 ")
	List<UserOtp> getByUserName(String username);
}
