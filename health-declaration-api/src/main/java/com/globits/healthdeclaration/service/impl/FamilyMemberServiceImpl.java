package com.globits.healthdeclaration.service.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Hashtable;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.globits.core.domain.Person;
import com.globits.core.repository.PersonRepository;
import com.globits.core.service.impl.GenericServiceImpl;
import com.globits.healthdeclaration.HealthDeclarationEnumsType;
import com.globits.healthdeclaration.HealthDeclarationEnumsType.PersonalHealthRecordSeriusStatus;
import com.globits.healthdeclaration.domain.BackgroundDisease;
import com.globits.healthdeclaration.domain.Family;
import com.globits.healthdeclaration.domain.FamilyMember;
import com.globits.healthdeclaration.domain.Member;
import com.globits.healthdeclaration.domain.MemberBackgroundDisease;
import com.globits.healthdeclaration.domain.PersonalHealthRecord;
import com.globits.healthdeclaration.domain.UserOtp;
import com.globits.healthdeclaration.dto.FamilyMemberDto;
import com.globits.healthdeclaration.dto.MemberBackgroundDiseaseDto;
import com.globits.healthdeclaration.dto.PersonalHealthRecordDto;
import com.globits.healthdeclaration.functiondto.FamilyMemberSearchDto;
import com.globits.healthdeclaration.functiondto.HealthRecordReportDto;
import com.globits.healthdeclaration.functiondto.ReportResultDto;
import com.globits.healthdeclaration.functiondto.UserInfoDto;
import com.globits.healthdeclaration.repository.BackgroundDiseaseRepository;
import com.globits.healthdeclaration.repository.FamilyMemberRepository;
import com.globits.healthdeclaration.repository.FamilyRepository;
import com.globits.healthdeclaration.repository.MemberBackgroundDiseaseRepository;
import com.globits.healthdeclaration.repository.MemberRepository;
import com.globits.healthdeclaration.repository.PersonalHealthRecordRepository;
import com.globits.healthdeclaration.repository.PractitionerAndFamilyRepository;
import com.globits.healthdeclaration.repository.UserOtpRepository;
import com.globits.healthdeclaration.service.FamilyMemberService;
import com.globits.healthdeclaration.service.HDAdministrativeUnitService;
import com.globits.healthdeclaration.service.UserAdministrativeUnitService;
import com.globits.security.repository.UserRepository;

@Transactional
@Service
public class FamilyMemberServiceImpl extends GenericServiceImpl<FamilyMember, UUID> implements FamilyMemberService {
    @Autowired
    private EntityManager manager;
    @Autowired
    private FamilyMemberRepository repository;
    @Autowired
    private FamilyRepository familyRepository;
    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private BackgroundDiseaseRepository backgroundDiseaseRepository;
    @Autowired
    private MemberBackgroundDiseaseRepository memberBackgroundDiseaseRepository;
    @Autowired
    private UserAdministrativeUnitService userAdministrativeUnitService;
	@Autowired
	private PersonalHealthRecordRepository personalHealthRecordRepository;
	@Autowired
	private PractitionerAndFamilyRepository practitionerAndFamilyRepository;
	@Autowired
	private HDAdministrativeUnitService hdAdministrativeUnitService;
	@Autowired
	UserRepository userRepository;

	@Autowired
	private PersonRepository personRepository;
	@Autowired
	UserOtpRepository userOtpRepository;
    
    @Override
    public FamilyMemberDto saveOrUpdate(UUID id, FamilyMemberDto dto) {
    	UserInfoDto userInfo = userAdministrativeUnitService.getAllInfoByUserLogin();
        if (dto != null && dto.getMember() != null && dto.getFamily() != null && hasEditPermision(dto, id, userInfo)) {
        	
        	if (!userInfo.isAdmin()) {
				if (userInfo.isUser()) {
					if (userInfo.getFamilyMember() != null && userInfo.getFamilyMember() != null 
							&& userInfo.getFamilyMember().getFamily() != null && userInfo.getFamilyMember().getFamily().getId() != null
							&& userInfo.getFamilyMember().getFamily().getId().equals(dto.getFamily().getId())) {
						//đúng
					}
					else {
						return null;
					}
				}
			}
        	
            FamilyMember entity = null;
            Member member = null;
            Family family = null;
            if (id != null) {
                entity = repository.getById(id);
            }
            if (entity == null) {
                entity = new FamilyMember();
                member = new Member();
                family = new Family();
            }

            entity.setRelationship(dto.getRelationship());
            entity.setHostFamily(dto.isHostFamily());

            if (dto.getMember().getId() != null) {
            	member = (Member) memberRepository.getOne(dto.getMember().getId());
            }
        	if(member == null) {
        		return null;
        	}
            member.setDetailAddress(dto.getMember().getDetailAddress());
            member.setAge(dto.getMember().getAge());
            member.setAnamnesis(dto.getMember().getAnamnesis());
            member.setHealthInsuranceCardNumber(dto.getMember().getHealthInsuranceCardNumber());
            member.setIdCardNumber(dto.getMember().getIdCardNumber());
        	member.setDisplayName(dto.getMember().getDisplayName());
        	member.setPhoneNumber(dto.getMember().getPhoneNumber());
        	member.setWeight(dto.getMember().getWeight());
        	member.setHeight(dto.getMember().getHeight());
        	member.setEmail(dto.getMember().getEmail());
        	member.setGender(dto.getMember().getGender());
        	member.setIsPregnant(dto.getMember().getIsPregnant());
        	member.setSuspectedLevel(dto.getMember().getSuspectedLevel());
        	member.setHaveBackgroundDisease(dto.getMember().getHaveBackgroundDisease());
        	if (dto.getMember().getHaveBackgroundDisease() != null && dto.getMember().getHaveBackgroundDisease() && dto.getMember().getListBackgroundDisease() != null && dto.getMember().getListBackgroundDisease().size() > 0) {
        		HashSet<MemberBackgroundDisease> memberBackgroundDiseases = new HashSet<>();
                for (MemberBackgroundDiseaseDto memberBackgroundDiseaseDto : dto.getMember().getListBackgroundDisease()) {

            		BackgroundDisease backgroundDisease = null;
                	MemberBackgroundDisease mbd = new MemberBackgroundDisease();
                	if (memberBackgroundDiseaseDto.getId() != null) {
                		mbd = memberBackgroundDiseaseRepository.getOne(memberBackgroundDiseaseDto.getId());
					}
                	if (mbd == null) {
                		mbd = new MemberBackgroundDisease();
					}
                	if (memberBackgroundDiseaseDto.getBackgroundDisease() != null && memberBackgroundDiseaseDto.getBackgroundDisease().getId() != null) {
                		backgroundDisease = backgroundDiseaseRepository.getOne(memberBackgroundDiseaseDto.getBackgroundDisease().getId());
					}
                	if (backgroundDisease != null) {
                		mbd.setBackgroundDisease(backgroundDisease);
                		mbd.setMember(member);
                		memberBackgroundDiseases.add(mbd);
					}
                }
                
				if (member.getListBackgroundDisease() == null) {
					member.setListBackgroundDisease(memberBackgroundDiseases);
				} else {
					member.getListBackgroundDisease().clear();
					member.getListBackgroundDisease().addAll(memberBackgroundDiseases);
				}
            } else if (member.getListBackgroundDisease() != null) {
            	member.getListBackgroundDisease().clear();
			}

            if (dto.getFamily().getId() != null) {
            	family = familyRepository.getOne(dto.getFamily().getId());
            }
        	if(family == null) {
        		return null;
        	}

        	member = memberRepository.save(member);
            entity.setFamily(family);
            entity.setMember(member);
            entity = repository.save(entity);
            if (entity != null) {
                return new FamilyMemberDto(entity, true);
            }
        }
        return null;
    }

	@Override
    public FamilyMemberDto registry(UUID id, FamilyMemberDto dto) {
//        UserInfoDto userInfo = userAdministrativeUnitService.getAllInfoByUserLogin();
        if (dto != null && dto.getMember() != null && dto.getFamily() != null) {
            FamilyMember entity = null;
            Member member = null;
            Family family = null;
            if (id != null) {
                entity = repository.getById(id);
            }
            if (entity == null) {
                entity = new FamilyMember();
                member = new Member();
                family = new Family();
            }

            entity.setRelationship(dto.getRelationship());
            entity.setHostFamily(dto.isHostFamily());

            if (dto.getMember().getId() != null) {
                member = (Member) memberRepository.getOne(dto.getMember().getId());
            }
            if(member == null) {
                return null;
            }
            member.setDetailAddress(dto.getMember().getDetailAddress());
            member.setAge(dto.getMember().getAge());
            member.setAnamnesis(dto.getMember().getAnamnesis());
            member.setHealthInsuranceCardNumber(dto.getMember().getHealthInsuranceCardNumber());
            member.setIdCardNumber(dto.getMember().getIdCardNumber());
            member.setDisplayName(dto.getMember().getDisplayName());
            member.setPhoneNumber(dto.getMember().getPhoneNumber());
            member.setWeight(dto.getMember().getWeight());
            member.setHeight(dto.getMember().getHeight());
            member.setEmail(dto.getMember().getEmail());
            member.setGender(dto.getMember().getGender());
            member.setIsPregnant(dto.getMember().getIsPregnant());
            member.setHaveBackgroundDisease(dto.getMember().getHaveBackgroundDisease());
            if (dto.getMember().getHaveBackgroundDisease() != null && dto.getMember().getHaveBackgroundDisease() && dto.getMember().getListBackgroundDisease() != null && dto.getMember().getListBackgroundDisease().size() > 0) {
                HashSet<MemberBackgroundDisease> memberBackgroundDiseases = new HashSet<>();
                for (MemberBackgroundDiseaseDto memberBackgroundDiseaseDto : dto.getMember().getListBackgroundDisease()) {

                    BackgroundDisease backgroundDisease = null;
                    MemberBackgroundDisease mbd = new MemberBackgroundDisease();
                    if (memberBackgroundDiseaseDto.getId() != null) {
                        mbd = memberBackgroundDiseaseRepository.getOne(memberBackgroundDiseaseDto.getId());
                    }
                    if (mbd == null) {
                        mbd = new MemberBackgroundDisease();
                    }
                    if (memberBackgroundDiseaseDto.getBackgroundDisease() != null && memberBackgroundDiseaseDto.getBackgroundDisease().getId() != null) {
                        backgroundDisease = backgroundDiseaseRepository.getOne(memberBackgroundDiseaseDto.getBackgroundDisease().getId());
                    }
                    if (backgroundDisease != null) {
                        mbd.setBackgroundDisease(backgroundDisease);
                        mbd.setMember(member);
                        memberBackgroundDiseases.add(mbd);
                    }
                }

                if (member.getListBackgroundDisease() == null) {
                    member.setListBackgroundDisease(memberBackgroundDiseases);
                } else {
                    member.getListBackgroundDisease().clear();
                    member.getListBackgroundDisease().addAll(memberBackgroundDiseases);
                }
            } else if (member.getListBackgroundDisease() != null) {
                member.getListBackgroundDisease().clear();
            }

            if (dto.getFamily().getId() != null) {
                family = familyRepository.getOne(dto.getFamily().getId());
            }
            if(family == null) {
                return null;
            }

            member = memberRepository.save(member);
            entity.setFamily(family);
            entity.setMember(member);
            entity = repository.save(entity);
            if (entity != null) {
                return new FamilyMemberDto(entity, true);
            }
        }
        return null;
    }

    @Override
	public Page<FamilyMemberDto> searchByDto(FamilyMemberSearchDto dto) {
    	UserInfoDto userInfo = userAdministrativeUnitService.getAllInfoByUserLogin();
        if (dto == null || userInfo == null) {
            return null;
        }
        int pageIndex = dto.getPageIndex();
        int pageSize = dto.getPageSize();

        if (pageIndex > 0) {
            pageIndex--;
        } else {
            pageIndex = 0;
        }
        List<UUID> listAdministrativeUnitId = null;
        if (!userInfo.isAdmin()) {

			if (userInfo.isUser()) {
				if (userInfo.getFamilyMember() == null || userInfo.getFamilyMember().getFamily() == null) {
					return new PageImpl<FamilyMemberDto>(new ArrayList<FamilyMemberDto>() , PageRequest.of(pageIndex, pageSize), 0);
				}
				dto.setFamilyId(userInfo.getFamilyMember().getFamily().getId());
			}
			if (userInfo.isMedicalTeam()) {
				if (listAdministrativeUnitId == null) {
					listAdministrativeUnitId = new ArrayList<UUID>();
				}
				listAdministrativeUnitId.addAll(userInfo.getListUnit());
				if (listAdministrativeUnitId == null || listAdministrativeUnitId.size() <= 0) {
					return new PageImpl<FamilyMemberDto>(new ArrayList<FamilyMemberDto>() , PageRequest.of(pageIndex, pageSize), 0);
				}
			}
			if (userInfo.isHealthCareStaff()) {
				if (userInfo.getUserDto() != null && userInfo.getUserDto().getPerson() != null) {
					dto.setPractitionerId(userInfo.getUserDto().getPerson().getId());
				}
				else {
					return new PageImpl<FamilyMemberDto>(new ArrayList<FamilyMemberDto>() , PageRequest.of(pageIndex, pageSize), 0);
				}
			}
		}
        String joinSql = "  ";
        String whereClause = " where (1=1) ";
        String orderBy = " ORDER BY entity.createDate  ";
        String sqlCount = "select count(entity.id) from FamilyMember as entity ";
        String sql = "select new com.globits.healthdeclaration.dto.FamilyMemberDto(entity, true) from FamilyMember as entity ";

        if (listAdministrativeUnitId != null && listAdministrativeUnitId.size() > 0) {
            whereClause += " AND entity.family.administrativeUnit.id IN (:listAdministrativeUnitId) ";
		}
        if (dto.getPractitionerId() != null) {
        	joinSql += " JOIN PractitionerAndFamily paf ON paf.family.id = entity.family.id ";
            whereClause += " AND paf.practitioner.id = :practitionerId ";
		}
        if (dto.getFamilyId() != null) {
            whereClause += " AND entity.family.id = :familyId ";
        }
        if (dto.getMemberId() != null) {
            whereClause += " AND entity.member.id = :memberId ";
        }
        if (dto.getHostFamily() != null) {
            whereClause += " AND entity.hostFamily = :hostFamily ";
        }

		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			whereClause += " AND (entity.member.displayName LIKE :text OR " +
					"entity.member.healthInsuranceCardNumber LIKE :text OR entity.family.name LIKE :text " +
					"OR entity.relationship LIKE :text ) ";
		}

        sql += joinSql + whereClause + orderBy;
        sqlCount += joinSql + whereClause;
        
        Query q = manager.createQuery(sql, FamilyMemberDto.class);
        Query qCount = manager.createQuery(sqlCount);

        if (listAdministrativeUnitId != null && listAdministrativeUnitId.size() > 0) {
            q.setParameter("listAdministrativeUnitId", listAdministrativeUnitId);
            qCount.setParameter("listAdministrativeUnitId", listAdministrativeUnitId);
		}
        if (dto.getPractitionerId() != null) {
            q.setParameter("practitionerId", dto.getPractitionerId());
            qCount.setParameter("practitionerId", dto.getPractitionerId());
		}
        if (dto.getFamilyId() != null) {
            q.setParameter("familyId", dto.getFamilyId());
            qCount.setParameter("familyId", dto.getFamilyId());
        }
        if (dto.getMemberId() != null) {
            q.setParameter("memberId", dto.getMemberId());
            qCount.setParameter("memberId", dto.getMemberId());
        }
        if (dto.getHostFamily() != null) {
            q.setParameter("hostFamily", dto.getHostFamily());
            qCount.setParameter("hostFamily", dto.getHostFamily());
        }
		if (dto.getText() != null && StringUtils.hasText(dto.getText())) {
			q.setParameter("text", '%' + dto.getText().trim() + '%');
			qCount.setParameter("text", '%' + dto.getText().trim() + '%');
		}
        int startPosition = pageIndex * pageSize;
        q.setFirstResult(startPosition);
        q.setMaxResults(pageSize);
        List<FamilyMemberDto> entities = q.getResultList();
        long count = (long) qCount.getSingleResult();

        Pageable pageable = PageRequest.of(pageIndex, pageSize);
        Page<FamilyMemberDto> result = new PageImpl<FamilyMemberDto>(entities, pageable, count);

        return result;
	}

	@Override
	public FamilyMemberDto getById(UUID id) {
		UserInfoDto userInfo = userAdministrativeUnitService.getAllInfoByUserLogin();
		
		if (id != null) {
			FamilyMember entity = repository.getOne(id);
			if(!userInfo.isAdmin() && userInfo.isUser()) {
				if(userInfo.getFamilyMember() != null && userInfo.getFamilyMember().getFamily() != null && !userInfo.getFamilyMember().getFamily().getId().equals(entity.getFamily().getId())) {
					return null;
				}
			}
			if (entity != null) {
				return new FamilyMemberDto(entity, true);
			}
		}
		return null;
	}

	@Override
	public Boolean deleteById(UUID id, boolean isDeleteHostFamily) {
		UserInfoDto userInfo = userAdministrativeUnitService.getAllInfoByUserLogin();
		if (id != null) {
			FamilyMember entity = repository.getOne(id);
			if(!userInfo.isAdmin() && userInfo.isUser()) {
				if(userInfo.getFamilyMember() != null && userInfo.getFamilyMember().getFamily() != null && !userInfo.getFamilyMember().getFamily().getId().equals(entity.getFamily().getId())) {
					return null;
				}
			}
			if (entity != null 
					&& (!entity.getHostFamily() || isDeleteHostFamily) && hasDeletePermision(entity)) {
				List<PersonalHealthRecord> lst = personalHealthRecordRepository.getListByFamilyMemberId(id);
				Person person = null;
				if (lst == null || lst.size() <= 0) {
					if (entity.getMember() != null) {
						person = personRepository.getOne(entity.getMember().getId());
						if (person != null) {
							if (person.getUser() != null) {
								//remove otp user
								List<UserOtp> lstUserotp = userOtpRepository.getByUserName(person.getUser().getUsername());
								if (lstUserotp != null && lstUserotp.size() > 0) {
									for (UserOtp userOtp : lstUserotp) {
										userOtpRepository.delete(userOtp);
									}
								}
								userRepository.delete(person.getUser());
							}
							
						}
					}
					repository.deleteById(id);
					if (person != null) {
						/* memberRepository.deleteById(person.getId()); */
					}
					return true;
				}
			}
		}
		return false;
	}

	@Override
	public Integer checkDuplicate(FamilyMemberDto dto) {
		Integer result = 0;
		if(checkDuplicateInsurance(dto) == true) {
			return 1; //trùng số số bảo hiểm y tế
		}
		if(checkDuplicateIdCardNumber(dto) == true) {
			return 2; //Trùng số cccd,cmnd
		}
		return result;
	}
	
	public Boolean checkDuplicateInsurance(FamilyMemberDto dto) {
		Boolean result = false;
		if(dto.getMember().getHealthInsuranceCardNumber() != null) {
			result = true;
			List<FamilyMember> entities = repository.getByInsurance(dto.getMember().getHealthInsuranceCardNumber());
			if(entities != null && entities.size() > 0) {
				for(FamilyMember familyMember: entities) {
					if(dto.getId() != null) {
						if(familyMember.getId().equals(dto.getId())) {
							result =  false;
							break;
						}
					}
				}
			}else {
				result = false;
			}
		}
		
		return result;
	}
	
	public Boolean checkDuplicateIdCardNumber(FamilyMemberDto dto) {
		Boolean result = false;
		if(dto.getMember().getIdCardNumber() != null) {
			result = true;
			List<FamilyMember> entities = repository.getByIdCardNumber(dto.getMember().getIdCardNumber());
			if(entities != null && entities.size() > 0) {
				for(FamilyMember familyMember: entities) {
					if(dto.getId() != null) {
						if(familyMember.getId().equals(dto.getId())) {
							result =  false;
							break;
						}
					}
				}
			}else {
				result = false;
			}
		}
		return result;
	}

    private boolean hasEditPermision(FamilyMemberDto dto, UUID id, UserInfoDto userInfo) {
		if (userInfo != null && dto != null && dto.getFamily() != null && dto.getFamily().getId() != null) {
			if (userInfo.isAdmin()) {
				return true;
			}
			else if (id == null) {
				if (userInfo.isMedicalTeam()) {
					return true;
				}
				
				if (userInfo.isUser() && userInfo.getFamilyMember() != null && userInfo.getFamilyMember().getFamily() != null
						 && userInfo.getFamilyMember().getFamily().getId() != null
						 && userInfo.getFamilyMember().getFamily().getId().equals(dto.getFamily().getId())) {
					return true;
				}
			}
			else {
				//trường hợp sửa
				FamilyMember familyMember = repository.getById(id);
				if (familyMember != null && familyMember.getFamily() != null && familyMember.getFamily().getId() != null) {
					if (userInfo.isMedicalTeam() && userInfo.getListUnit() != null && userInfo.getListUnit().size() > 0) {
						Integer count = familyRepository.countAllByIdAndInListAdministrativeUnitId(familyMember.getFamily().getId(), userInfo.getListUnit());
						if (count != null && count > 0) {
							return true;
						}
					}
					
					if (userInfo.isHealthCareStaff() && userInfo.getListUnit() != null && userInfo.getListUnit().size() > 0) {
						Integer count = familyRepository.countAllByIdAndInListAdministrativeUnitId(familyMember.getFamily().getId(), userInfo.getListUnit());
						if (count != null && count > 0) {
							return true;
						}
					}
					
					if (userInfo.isUser() && userInfo.getFamilyMember() != null && userInfo.getFamilyMember().getFamily() != null
							 && userInfo.getFamilyMember().getFamily().getId() != null
							 && userInfo.getFamilyMember().getFamily().getId().equals(familyMember.getFamily().getId())) {
						return true;
					}
				}
			}
		}
		return false;
	}
	
	private boolean hasDeletePermision(FamilyMember entity) {
		UserInfoDto userInfo = userAdministrativeUnitService.getAllInfoByUserLogin();
		if (entity != null && userInfo != null && entity.getFamily() != null && entity.getFamily().getId() != null) {
			if (userInfo.isAdmin()) {
				return true;
			}
		}
		return false;
	}

	@Override
	public ReportResultDto<HealthRecordReportDto> reportSuspectedLevel(UUID communeId, UUID quarterId, UUID townId, String groupByType) {
		UserInfoDto userDto = userAdministrativeUnitService.getAllInfoByUserLogin();
		if (userDto == null
				|| (!userDto.isAdmin() && (userDto.getListUnit() == null || userDto.getListUnit().size() < 1))) {
			return null;
		}
		Set<UUID> adminUnitIds = new HashSet<UUID>();
		if (userDto != null && userDto.getListUnit() != null && userDto.getListUnit().size() > 0) {
			adminUnitIds.addAll(userDto.getListUnit());
			for (UUID id : userDto.getListUnit()) {
				List<UUID> listChild = hdAdministrativeUnitService.getAllChildIdByParentId(id);
				adminUnitIds.addAll(listChild);
			}
		}
		ReportResultDto<HealthRecordReportDto> ret = new ReportResultDto<HealthRecordReportDto>();
		ret.setCode(groupByType);
		
		String selectAdminUnitClause = "";
		if (groupByType.equals(HealthDeclarationEnumsType.ReportGroupByType.town.getValue())) {
			selectAdminUnitClause = " h.family.administrativeUnit.id, h.family.administrativeUnit.parent.parent.id, "
					+ " h.family.administrativeUnit.name, ";
		}
		if (groupByType.equals(HealthDeclarationEnumsType.ReportGroupByType.quarter.getValue())) {
			selectAdminUnitClause = " h.family.administrativeUnit.parent.id, h.family.administrativeUnit.parent.parent.id,"
					+ " h.family.administrativeUnit.parent.name, ";
		}
		if (groupByType.equals(HealthDeclarationEnumsType.ReportGroupByType.commune.getValue())) {
			selectAdminUnitClause = " h.family.administrativeUnit.parent.parent.id, h.family.administrativeUnit.parent.parent.id, "
					+ " h.family.administrativeUnit.parent.parent.name, ";
		}
		String sqlf0 = " SELECT new com.globits.healthdeclaration.functiondto.HealthRecordReportDto" + " ("
				+ selectAdminUnitClause + " COUNT(h.id),0L) " + " FROM FamilyMember h "
				+ " WHERE h.member.suspectedLevel = '" + HealthDeclarationEnumsType.SuspectedLevelType.f0.getValue() + "' ";
		String sqlf1 = " SELECT new com.globits.healthdeclaration.functiondto.HealthRecordReportDto" + " ("
				+ selectAdminUnitClause + " 0L, COUNT(h.id)) " + " FROM FamilyMember h "
				+ " WHERE h.member.suspectedLevel = '" + HealthDeclarationEnumsType.SuspectedLevelType.f1.getValue() +"' ";
		
		String whereClause = "";
		if (communeId != null && !communeId.equals(new UUID(0L, 0L))) {
			whereClause += " AND h.family.administrativeUnit.parent.parent.id=:communeId ";
		}
		if(quarterId != null && !quarterId.equals(new UUID(0L, 0L))) {
			whereClause += " AND h.family.administrativeUnit.parent.id=:quarterId ";
		}
		if (townId != null && !townId.equals(new UUID(0L, 0L))) {
			whereClause += " AND h.family.administrativeUnit.id=:townId ";
		}
		if (!userDto.isAdmin()) {
			whereClause += " AND h.family.administrativeUnit.id in (:adminUnitIds) ";
		}
		String groupByClause = "  ";
		if (groupByType.equals(HealthDeclarationEnumsType.ReportGroupByType.commune.getValue())) {
			groupByClause = " GROUP BY h.family.administrativeUnit.parent.parent.id, h.family.administrativeUnit.parent.parent.name ";
		}
		
		if (groupByType.equals(HealthDeclarationEnumsType.ReportGroupByType.quarter.getValue())) {
			groupByClause = " GROUP BY h.family.administrativeUnit.parent.id, h.family.administrativeUnit.parent.name ";
		}
		
		if (groupByType.equals(HealthDeclarationEnumsType.ReportGroupByType.town.getValue())) {
			groupByClause = " GROUP BY h.family.administrativeUnit.id, h.family.administrativeUnit.name ";
		}

		Query qF0 = manager.createQuery(sqlf0 + whereClause + groupByClause, HealthRecordReportDto.class);
		Query qF1 = manager.createQuery(sqlf1 + whereClause + groupByClause, HealthRecordReportDto.class);
		
		if (communeId != null && !communeId.equals(new UUID(0L, 0L))) {
			qF0.setParameter("communeId", communeId);
			qF1.setParameter("communeId", communeId);
		}
		if (quarterId != null && !quarterId.equals(new UUID(0L, 0L))) {
			qF1.setParameter("quarterId", quarterId);
			qF0.setParameter("quarterId", quarterId);
		}
		if (townId != null && !townId.equals(new UUID(0L, 0L))) {
			qF0.setParameter("townId", townId);
			qF1.setParameter("townId", townId);
		}
		if (!userDto.isAdmin()) {
			qF0.setParameter("adminUnitIds", adminUnitIds);
			qF1.setParameter("adminUnitIds", adminUnitIds);
		}
		
		List<HealthRecordReportDto> listF0 = qF0.getResultList();
		List<HealthRecordReportDto> listF1 = qF1.getResultList();
		
		Hashtable<UUID, HealthRecordReportDto> hash = new Hashtable<UUID, HealthRecordReportDto>();
		if (listF0 != null && listF0.size() > 0) {
			for (HealthRecordReportDto healthRecordReportDto : listF0) {
				HealthRecordReportDto obj = hash.get(healthRecordReportDto.getAdminUnitId());
				if (obj != null) {
					obj.setF0(obj.getF0() + healthRecordReportDto.getF0());
				} else {
					hash.put(healthRecordReportDto.getAdminUnitId(), healthRecordReportDto);
				}
			}
		}
		
		if (listF1 != null && listF1.size() > 0) {
			for (HealthRecordReportDto healthRecordReportDto : listF1) {
				HealthRecordReportDto obj = hash.get(healthRecordReportDto.getAdminUnitId());
				if (obj != null) {
					obj.setF1(obj.getF1() + healthRecordReportDto.getF1());
				} else {
					hash.put(healthRecordReportDto.getAdminUnitId(), healthRecordReportDto);
				}
			}
		}
		
		ret.setDetails(new ArrayList<HealthRecordReportDto>(hash.values()));
		return ret;
	}

	@Override
	public List<FamilyMemberDto> listPatientByAdminUnit(String suspectedLevel, UUID communeId, UUID quarterId, UUID townId){
		UserInfoDto userDto = userAdministrativeUnitService.getAllInfoByUserLogin();
		if (userDto == null
				|| (!userDto.isAdmin() && (userDto.getListUnit() == null || userDto.getListUnit().size() < 1))) {
			return null;
		}
		Set<UUID> adminUnitIds = new HashSet<UUID>();
		if (userDto != null && userDto.getListUnit() != null && userDto.getListUnit().size() > 0) {
			adminUnitIds.addAll(userDto.getListUnit());
			for (UUID id : userDto.getListUnit()) {
				List<UUID> listChild = hdAdministrativeUnitService.getAllChildIdByParentId(id);
				adminUnitIds.addAll(listChild);
			}
		}
		String sql = " SELECT new com.globits.healthdeclaration.dto.FamilyMemberDto(h,true) "
				+ " FROM FamilyMember h " + " WHERE ";
		String whereClause = "";
		if (suspectedLevel.equals(HealthDeclarationEnumsType.SuspectedLevelType.f0.getValue())) {
			whereClause += " h.member.suspectedLevel = '" + HealthDeclarationEnumsType.SuspectedLevelType.f0.getValue() +"' " ;
		}
		if (suspectedLevel.equals(HealthDeclarationEnumsType.SuspectedLevelType.f1.getValue())) {
			whereClause += " h.member.suspectedLevel = '" + HealthDeclarationEnumsType.SuspectedLevelType.f1.getValue() +"' " ;
		}
		if (communeId != null && !communeId.equals(new UUID(0L, 0L))) {
			whereClause += " AND h.family.administrativeUnit.parent.parent.id=:communeId ";
		}
		if (quarterId != null && !quarterId.equals(new UUID(0L, 0L))) {
			whereClause += " AND h.family.administrativeUnit.parent.id=:quarterId ";
		}
		if (townId != null && !townId.equals(new UUID(0L, 0L))) {
			whereClause += " AND h.family.administrativeUnit.id=:townId ";
		}
		if (!userDto.isAdmin()) {
			whereClause += " AND h.family.administrativeUnit.id in (:adminUnitIds) ";
		}
		Query q = manager.createQuery(sql + whereClause, FamilyMemberDto.class);
		
		if (communeId != null && !communeId.equals(new UUID(0L, 0L))) {
			q.setParameter("communeId", communeId);
		}
		if (quarterId != null && !quarterId.equals(new UUID(0L, 0L))) {
			q.setParameter("quarterId", quarterId);
		}
		if (townId != null && !townId.equals(new UUID(0L, 0L))) {
			q.setParameter("townId", townId);
		}
		if (!userDto.isAdmin()) {
			q.setParameter("adminUnitIds", adminUnitIds);
		}

		return q.getResultList();
	}
}
