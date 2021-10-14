package com.globits.healthdeclaration.service.impl;

import static com.globits.healthdeclaration.HealthDeclarationConstant.EXPIRED_TIME_OTP;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.persistence.Query;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.globits.core.repository.PersonRepository;
import com.globits.core.service.impl.GenericServiceImpl;
import com.globits.core.utils.SecurityUtils;
import com.globits.healthdeclaration.HealthDeclarationConstant;
import com.globits.healthdeclaration.HealthDeclarationEnumsType;
import com.globits.healthdeclaration.domain.Family;
import com.globits.healthdeclaration.domain.FamilyMember;
import com.globits.healthdeclaration.domain.HDAdministrativeUnit;
import com.globits.healthdeclaration.domain.HealthCareGroup;
import com.globits.healthdeclaration.domain.PersonalHealthRecord;
import com.globits.healthdeclaration.domain.UserAdministrativeUnit;
import com.globits.healthdeclaration.domain.UserOtp;
import com.globits.healthdeclaration.dto.FamilyDto;
import com.globits.healthdeclaration.dto.FamilyMemberDto;
import com.globits.healthdeclaration.dto.HealthCareGroupAdministrativeUnitDto;
import com.globits.healthdeclaration.dto.PractitionerDto;
import com.globits.healthdeclaration.dto.SmsSendResponseDto;
import com.globits.healthdeclaration.dto.UserAdministrativeUnitDto;
import com.globits.healthdeclaration.functiondto.ForgotPasswordDto;
import com.globits.healthdeclaration.functiondto.RegisterDto;
import com.globits.healthdeclaration.functiondto.UserAdministrativeUnitSearchDto;
import com.globits.healthdeclaration.functiondto.UserInfoDto;
import com.globits.healthdeclaration.repository.FamilyMemberRepository;
import com.globits.healthdeclaration.repository.FamilyRepository;
import com.globits.healthdeclaration.repository.HDAdministrativeUnitRepository;
import com.globits.healthdeclaration.repository.HealthCareGroupRepository;
import com.globits.healthdeclaration.repository.MemberRepository;
import com.globits.healthdeclaration.repository.PersonalHealthRecordRepository;
import com.globits.healthdeclaration.repository.PractitionerRepository;
import com.globits.healthdeclaration.repository.UserAdministrativeUnitRepository;
import com.globits.healthdeclaration.repository.UserOtpRepository;
import com.globits.healthdeclaration.service.FamilyMemberService;
import com.globits.healthdeclaration.service.FamilyService;
import com.globits.healthdeclaration.service.HDAdministrativeUnitService;
import com.globits.healthdeclaration.service.UserAdministrativeUnitService;
import com.globits.healthdeclaration.service.UserOtpService;
import com.globits.healthdeclaration.utilities.sms.OTPUtils;
import com.globits.security.domain.Role;
import com.globits.security.domain.User;
import com.globits.security.dto.RoleDto;
import com.globits.security.dto.UserDto;
import com.globits.security.repository.RoleRepository;
import com.globits.security.repository.UserRepository;
import com.globits.security.service.RoleService;
import com.globits.security.service.UserService;

@Service
public class UserAdministrativeUnitServiceImpl extends GenericServiceImpl<UserAdministrativeUnit, UUID>
		implements UserAdministrativeUnitService {
	@Autowired
	RoleRepository roleRepository;
	@Autowired
	UserService userService;
	@Autowired
	UserRepository userRepository;
	@Autowired
	PersonRepository personRepository;
	@Autowired
	UserAdministrativeUnitRepository userAdministrativeUnitRepository;
	@Autowired
	HDAdministrativeUnitRepository administrativeUnitRepository;
	@Autowired
	HealthCareGroupRepository healthCareGroupRepository;
	@Autowired
	FamilyMemberRepository familyMemberRepository;
	@Autowired
	MemberRepository memberRepository;
	@Autowired
	PractitionerRepository practitionerRepository;
	@Autowired
	FamilyService familyService;

	@Autowired
	RoleService roleService;

	@Autowired
	RoleRepository roleRepos;
	@Autowired
	UserOtpRepository userOtpRepository;

	@Autowired
	private UserOtpService userOtpService;

	@Autowired
	private FamilyMemberService familyMemberService;

	@Autowired
	private FamilyRepository familyRepository;
	
	@Autowired
	private PersonalHealthRecordRepository personalHealthRecordRepository;
	@Autowired
	private HDAdministrativeUnitService hDAdministrativeUnitService; 
	@Override
	@Transactional(readOnly = true)
	public UserDto getCurrentUserDto() {
		User entity = getCurrentUser();
		if (entity != null)
			return new UserDto(entity);

		return null;
	}

	@Override
	@Transactional(readOnly = true)
	public User getCurrentUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		User user = (User) authentication.getPrincipal();
		if (user != null && user.getUsername() != null) {
			User entity = userRepository.findByUsernameAndPerson(user.getUsername());

			if (entity != null)
				return entity;
		}

		return null;
	}

	@Override
	public Page<UserAdministrativeUnitDto> searchByDto(UserAdministrativeUnitSearchDto dto) {
		if (dto == null) {
			return null;
		}
			
		UserInfoDto userOrganization = this.getAllInfoByUserLogin();
		if (userOrganization == null) {
			return null;
		}
		
		
		int pageIndex = dto.getPageIndex();
		int pageSize = dto.getPageSize();

		if (pageIndex > 0)
			pageIndex--;
		else
			pageIndex = 0;

		String whereClause = " where (1=1) ";
		String orderBy = " ";
		String sqlCount = "select count(*) from UserAdministrativeUnit as user "
				+ " join User as u on user.user.id = u.id ";
		String sql = "select new com.globits.healthdeclaration.dto.UserAdministrativeUnitDto(user,u) from UserAdministrativeUnit as user "
						+ " join User as u on user.user.id = u.id ";
		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			whereClause += " AND (u.person.displayName LIKE :text OR user.userType LIKE :text OR u.person.phoneNumber LIKE :text)";
		}
		
		if (!userOrganization.isAdmin()) {
			if(userOrganization.isUser() && userOrganization.getUserUnit() != null 
					&& userOrganization.getUserUnit().getHealthCareGroup() != null && userOrganization.getUserUnit().getHealthCareGroup().getId() != null ) {
				whereClause += " AND (user.healthCareGroup.id = :healthCareGroup) ";
			}
		}
		sql += whereClause + orderBy;
		sqlCount += whereClause;
		Query q = manager.createQuery(sql, UserAdministrativeUnitDto.class);
		Query qCount = manager.createQuery(sqlCount);

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			q.setParameter("text", '%' + dto.getText().trim() + '%');
			qCount.setParameter("text", '%' + dto.getText().trim() + '%');
		}
		
		if (!userOrganization.isAdmin()) {
			if(userOrganization.isUser() && userOrganization.getUserUnit() != null 
					&& userOrganization.getUserUnit().getHealthCareGroup() != null && userOrganization.getUserUnit().getHealthCareGroup().getId() != null ) {
				q.setParameter("healthCareGroup", userOrganization.getUserUnit().getHealthCareGroup().getId() );
				qCount.setParameter("healthCareGroup", userOrganization.getUserUnit().getHealthCareGroup().getId());
			}
		}

		int startPosition = pageIndex * pageSize;
		q.setFirstResult(startPosition);
		q.setMaxResults(pageSize);
		List<UserAdministrativeUnitDto> entities = q.getResultList();
		long count = (long) qCount.getSingleResult();

		Pageable pageable = PageRequest.of(pageIndex, pageSize);
		Page<UserAdministrativeUnitDto> result = new PageImpl<>(entities, pageable, count);

		return result;
	}

	@Override
	public UserAdministrativeUnitDto getById(UUID id) {
		if (id != null) {
			UserAdministrativeUnit entity = userAdministrativeUnitRepository.getOne(id);
			if (entity != null)
				return new UserAdministrativeUnitDto(entity);
		}
		return null;
	}

	@Override
	public UserAdministrativeUnitDto saveOrUpdate(UserAdministrativeUnitDto dto, UUID id) {
		if (dto != null && dto.getUser() != null && dto.getUser() != null) {
			UserAdministrativeUnit userUnit = null;
			User user = null;

			if (dto.getUser() != null) {
				UserDto userDto = userService.save(dto.getUser());
				if (userDto != null) {
					user = userDto.toEntity();
				}
				if (user == null || userDto.getId() == null) {
					return null;
				} else if (id != null && dto.getId().equals(id)) {
					userUnit = userAdministrativeUnitRepository.getOne(id);
				}

				if (userUnit == null) {
					userUnit = new UserAdministrativeUnit();
				}
				HealthCareGroup careGroup = null;
				if (dto.getHealthCareGroup() != null && dto.getHealthCareGroup().getId() != null) {
					careGroup = healthCareGroupRepository.getOne(dto.getHealthCareGroup().getId());
				}
				userUnit.setHealthCareGroup(careGroup);

				if (dto.getRole() != null && dto.getRole().getId() != null) {
					Role role = roleRepository.getOne(dto.getRole().getId());
					if (role != null)
						userUnit.setRole(role);
				}

				if (dto.getAdministrativeUnit() != null && dto.getAdministrativeUnit().getId() != null) {
					HDAdministrativeUnit administrativeUnit = administrativeUnitRepository
							.getOne(dto.getAdministrativeUnit().getId());

					if (administrativeUnit != null)
						userUnit.setAdministrativeUnit(administrativeUnit);
				}

				userUnit.setUser(user);
				userUnit.setUserType(dto.getUserType());

				userUnit = userAdministrativeUnitRepository.save(userUnit);
				return new UserAdministrativeUnitDto(userUnit);
			}
			return null;
		}
		return null;
	}

	@Override
	public Boolean deleteById(UUID fromString) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean checkEmail(String email, Long id) {
		if (email != null && StringUtils.hasText(email)) {
			List<UserAdministrativeUnit> entities = userAdministrativeUnitRepository.findByEmail(email);
			if (entities != null && entities.size() > 0) {
				User entity = entities.get(0).getUser();
				if (id != null && entity.getId().equals(id))
					return false;
				return true;
			}
			return false;
		}
		return false;
	}

	@Override
	public boolean checkUsername(String username, Long id) {
		if (username != null && StringUtils.hasText(username)) {
			List<UserAdministrativeUnit> entities = userAdministrativeUnitRepository.findByusername(username);
			if (entities != null && entities.size() > 0) {
				User entity = entities.get(0).getUser();
				if (id != null && entity.getId().equals(id))
					return false;
				return true;
			}
			return false;
		}
		return false;
	}

	@Override
	public List<RoleDto> getRoleUser() {
		List<Role> roles = roleRepository.findAll();
		List<RoleDto> roleDto = new ArrayList<>();
		if (roles != null && roles.size() > 0)
			for (Role item : roles) {
				if (item.getAuthority().equals(HealthDeclarationConstant.ROLE_USER)
						|| item.getName().equals(HealthDeclarationConstant.ROLE_USER)
						|| item.getAuthority().equals(HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF)
						|| item.getName().equals(HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF)) {
					roleDto.add(new RoleDto(item));
				}
			}

		return roleDto;
	}

	@Override
	public UserAdministrativeUnitDto getUserOrganizationDtoByUserId(Long id) {
		// TODO Auto-generated method stub
		List<UserAdministrativeUnitDto> list = userAdministrativeUnitRepository.getByUserId(id);
		if (list != null && list.size() > 0 && list.get(0).getId() != null)
			return list.get(0);
		return null;
	}
	@Override
	public PractitionerDto getPractitionerDtoByUserId(Long id) {
		List<PractitionerDto> list = practitionerRepository.getByUserId(id);
		if (list != null && list.size() > 0 && list.get(0).getId() != null)
			return list.get(0);
		return null;
	}

	@Override
	public Boolean checkOTP(ForgotPasswordDto dto) {
		if (dto.getPhoneNumber() != null) {
			User user = userRepository.findByUsername(dto.getPhoneNumber());
			if (user != null) {
				UserOtp userOtp = userOtpRepository.getByUserNameAndOTP(user.getUsername(), dto.getOtpCode());
				if (userOtp != null ) {
					if(userOtp.getOtp().equals(dto.getOtpCode())) {
						if (userOtp.getOtpType().equals(HealthDeclarationEnumsType.UserOtpType.Forgot_Password.getValue())) {
							if (userOtp.getExpireTime().after(new Date())) {
								userOtp.setUsed(true);
								OTPUtils.sentPhone.put(dto.getPhoneNumber(), 0L);
								userOtpRepository.save(userOtp);
								return true;
							} else {
								userOtp.setExpired(true);
								userOtpRepository.save(userOtp);
								return false;
							}
						}
						return false;
					}
					return false;
				}
				return false;
			}
			return false;
		}
		return false;
	}

	@Override
	public ForgotPasswordDto checkUsernameAndSendOTP(String phoneNumber) {
		User user = userRepository.findByUsername(phoneNumber);
		ForgotPasswordDto result = new ForgotPasswordDto();
		result.setError(true);
		if (user != null) {
			SmsSendResponseDto smsSendResponseDto =  OTPUtils.sendOTP(phoneNumber);
			if (smsSendResponseDto.getError() == null) {
				result.setError(false);
				UserOtp userOtp = new UserOtp();
				userOtp.setOtp(smsSendResponseDto.getOTP());
				userOtp.setUserName(phoneNumber);
				userOtp.setOtpType(HealthDeclarationEnumsType.UserOtpType.Forgot_Password.getValue());
				userOtp.setUsed(false);
				userOtp.setExpired(false);
				Calendar currentTimeNow = Calendar.getInstance();
				currentTimeNow.add(Calendar.MINUTE, EXPIRED_TIME_OTP);
				Date expiredTime = currentTimeNow.getTime();
				userOtp.setExpireTime(expiredTime);
				userOtpRepository.save(userOtp);
			} else {
				result.setMessage("Đã gửi OTP, vui lòng gửi lại sau 3 phút!");
			}
			return result;
		} else {
			result.setMessage("Số điện thoại chưa được đăng ký!");
		}
		return result;
	}

	@Override
	public Boolean changeForgotPassword(ForgotPasswordDto dto) {
		if (dto.getPhoneNumber() != null) {
			User user = userRepository.findByUsername(dto.getPhoneNumber());
			if (user != null) {
				UserOtp userOtp = userOtpRepository.getByUserNameAndOTP(user.getUsername(), dto.getOtpCode());
				if (userOtp != null ) {
					if(userOtp.getOtp().equals(dto.getOtpCode())) {
						if (userOtp.getExpireTime().after(new Date())) {
							user.setPassword(dto.getPassword());
							user.setConfirmPassword(dto.getRePassword());
							userService.changePassword(new UserDto(user));
							return true;
						}
						return false;
					}
				} else {
					userOtp.setExpired(true);
					userOtpRepository.save(userOtp);
				}
				return false;
			}
			return false;
		}
		return false;
	}

	@Override
	public UserInfoDto getAllInfoByUserLogin() {
		UserInfoDto userInfoDto = null;
		UserDto user = getCurrentUserDto();
		if (user != null && user.getId() != null) {
			userInfoDto = new UserInfoDto();
			userInfoDto.setUserDto(user);
			userInfoDto = getRolesByUser(userInfoDto, user);
			UserAdministrativeUnitDto dto = getUserOrganizationDtoByUserId(user.getId());
			PractitionerDto practitionerDto = getPractitionerDtoByUserId(user.getId());
			if (dto != null && dto.getId() != null ) {
				userInfoDto.setUserUnit(dto);
				userInfoDto = getListAUnit(userInfoDto, dto, null);
			}
			if(practitionerDto != null && practitionerDto.getId() != null) {
				userInfoDto.setPractitioner(practitionerDto);
				userInfoDto = getListAUnit(userInfoDto, null, practitionerDto);
			}
		}
		return userInfoDto;
	}

	private UserInfoDto getListAUnit(UserInfoDto userInfoDto, UserAdministrativeUnitDto UnitDto, PractitionerDto paDto) {
		if(!userInfoDto.isAdmin() && userInfoDto.isMedicalTeam()) {
			if(UnitDto != null && UnitDto.getHealthCareGroup() != null && UnitDto.getHealthCareGroup().getListHealthCareGroupAdministrativeUnits() != null && UnitDto.getHealthCareGroup().getListHealthCareGroupAdministrativeUnits().size() > 0) {
				List<UUID> ids = new ArrayList<>();
				for(HealthCareGroupAdministrativeUnitDto item: UnitDto.getHealthCareGroup().getListHealthCareGroupAdministrativeUnits()) {
					UUID id = item.getAdministrativeUnit().getId();
					List<UUID> listID = hDAdministrativeUnitService.getAllChildIdByParentId(id);
					if(listID != null && listID.size() > 0) {
						for(UUID id1: listID) {
							ids.add(id1);
						}
					}
					ids.add(id);
				}
				userInfoDto.setListUnit(ids);
			}
		}
		if(!userInfoDto.isAdmin() && userInfoDto.isHealthCareStaff()) {
			if(paDto != null && paDto.getHealthCareGroup() != null && paDto.getHealthCareGroup().getListHealthCareGroupAdministrativeUnits() != null && paDto.getHealthCareGroup().getListHealthCareGroupAdministrativeUnits().size() > 0) {
				List<UUID> ids = new ArrayList<>();
				for(HealthCareGroupAdministrativeUnitDto item: paDto.getHealthCareGroup().getListHealthCareGroupAdministrativeUnits()) {
					UUID id = item.getAdministrativeUnit().getId();
					List<UUID> listID = hDAdministrativeUnitService.getAllChildIdByParentId(id);
					if(listID != null && listID.size() > 0) {
						for(UUID id1: listID) {
							ids.add(id1);
						}
					}
					ids.add(id);
				}
				userInfoDto.setListUnit(ids);
			}
		}
		
		return userInfoDto;
	}

	private UserInfoDto getRolesByUser(UserInfoDto info, UserDto currentUser) {
		if (currentUser != null && info != null) {
			for (RoleDto role : currentUser.getRoles()) {
				if (role.getAuthority().equals(HealthDeclarationConstant.ROLE_ADMIN)
						|| role.getName().equals(HealthDeclarationConstant.ROLE_ADMIN)) {
					info.setAdmin(true);
				}
				if (role.getAuthority().equals(HealthDeclarationConstant.ROLE_USER)
						|| role.getName().equals(HealthDeclarationConstant.ROLE_USER)) {
					info.setUser(true);
					
					if (currentUser.getPerson() != null) {
						List<FamilyMember> fm = familyMemberRepository.getByMemberId(currentUser.getPerson().getId());
						if (fm != null && fm.size() > 0) {
							info.setFamilyMember(new FamilyMemberDto(fm.get(0), true));
						}
					}
				}
				if (role.getAuthority().equals(HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF)
						|| role.getName().equals(HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF)) {
					info.setHealthCareStaff(true);
				}
				if(role.getAuthority().equals(HealthDeclarationConstant.ROLE_MEDICAL_TEAM)
						|| role.getName().equals(HealthDeclarationConstant.ROLE_MEDICAL_TEAM)) {
					info.setMedicalTeam(true);
				}
			}
			return info;
		}
		return null;
	}

	@Override
	public RegisterDto registerUser(FamilyDto dto) {
		// TODO Auto-generated method stub
		RegisterDto result = null;
		User user = null;
		if (dto != null) {
			result = familyService.checkUserNameRegisterUser(dto.getPhoneNumber());
			if (result != null && result.isSuccess()) {
				result = new RegisterDto();
				user = new User();
				// tạo tài khoản cho Hộ gia đình
				RoleDto role = new RoleDto();
				List<RoleDto> allRoles = roleService.findAll();
				for (RoleDto item : allRoles) {
					if (item.getName().equals(HealthDeclarationConstant.ROLE_USER)) {
						role.setName(item.getName());
						role.setId(item.getId());
						role.setDescription(item.getDescription());
					}
				}
				ArrayList gs;
				gs = new ArrayList();
				Role r = (Role) this.roleRepos.getOne(role.getId());
				if (r != null) {
					gs.add(r);
				}
				// }

				user.getRoles().clear();
				user.getRoles().addAll(gs);
				user.setUsername(dto.getPhoneNumber());
				user.setPassword(SecurityUtils.getHashPassword(dto.getPassword()));
				user.setActive(false);

				user.setEmail(dto.getEmail());
				user = (User) this.userRepository.save(user);
				
				if (user != null && user.getId() != null) {
					UserOtp otp = null;
					otp = userOtpRepository.getByUserNameAndType(user.getUsername(), HealthDeclarationEnumsType.UserOtpType.RegisterAccount.getValue());
					
					if (otp != null) {
						//Nếu tài khoản đã đăng ký thành công rồi sẽ không cho gửi mã đăng ký nữa
						if (otp.isUsed()) {
							result.setSuccess(false);
							result.setResult(HealthDeclarationEnumsType.RegisterUserType.IsUsed.getValue());
					    	result.setContent(HealthDeclarationEnumsType.RegisterUserType.IsUsed.getDescription());
					    	return result;
						}
						//hoặc mã đã hết hạn
						//hoặc đã quá thời gian
						else if(otp.isExpired() || new Date().after(otp.getExpireTime())) {
							result.setSuccess(false);
							result.setResendOtp(true);
							result.setResult(HealthDeclarationEnumsType.RegisterUserType.Expired.getValue());
					    	result.setContent(HealthDeclarationEnumsType.RegisterUserType.Expired.getDescription());
					    	return result;
						}
					}
					else {
						otp =new UserOtp();
						otp.setUserName(user.getUsername());
						otp.setOtpType(HealthDeclarationEnumsType.UserOtpType.RegisterAccount.getValue());
					    
						otp.setUsed(false);
						otp.setExpired(false);
					    Calendar calendar = Calendar.getInstance();
					    calendar.setTime(new Date());
					    calendar.add(Calendar.MINUTE, HealthDeclarationConstant.EXPIRED_TIME_OTP);

					    SmsSendResponseDto sendOTP = OTPUtils.sendOTP(user.getUsername());
					    if(sendOTP == null) {
							result.setSuccess(false);
					    	result.setContent("Có lỗi xảy ra khi gửi mã otp, vui lòng thử lại.");
							result.setResendOtp(true);
					    	otp.setExpired(true);
					    }
					    else if (!StringUtils.hasText(sendOTP.getOTP())) {
							result.setSuccess(false);
							result.setResendOtp(true);
							result.setContent(sendOTP.getErrorDescription());
							
					    	otp.setExpired(true);
						}
					    else {
						    otp.setOtp(sendOTP.getOTP());
							otp.setExpireTime(calendar.getTime());
					    }
						
						otp =userOtpRepository.save(otp);
						
						if (otp != null && otp.getId() != null) {
							result.setSuccess(true);
							result.setContent("Tạo tài khoản thành công, vui lòng nhập mã OTP để kích hoạt tài khoản.");
						}
						return result;
					}
				}
			}
			else if(result.isResendOtp() && dto.getPhoneNumber() != null){
		    	userOtpService.resendOTP(dto.getPhoneNumber(), HealthDeclarationEnumsType.UserOtpType.RegisterAccount.getValue());
			}
		}
		return result;
	}

	@Override
	public Boolean deleteAllByPhoneNumber(String phoneNumber) {
		if (phoneNumber != null) {
			List<Family> lstFamily = familyRepository.findByPhoneNumber(phoneNumber);
			if (lstFamily != null &&  lstFamily.size() > 0) {
				for (Family family : lstFamily) {
					boolean haveDelete = true;
					List<FamilyMember> lstFamilyMember = familyMemberRepository.getByFamilyId(family.getId());
					if (lstFamilyMember != null &&  lstFamilyMember.size() > 0) {
						for (FamilyMember familyMember : lstFamilyMember) {
							List<PersonalHealthRecord> lstPersonalHealthRecord = personalHealthRecordRepository.getListByFamilyMemberId(familyMember.getId());
							if (lstPersonalHealthRecord != null && lstPersonalHealthRecord.size() > 0) {
								haveDelete = false;
							}
						}
					}
					if (haveDelete) {
						familyService.deleteById(family.getId());
					}
				}
			}
			return true;
		}
		return false;
	}

}
