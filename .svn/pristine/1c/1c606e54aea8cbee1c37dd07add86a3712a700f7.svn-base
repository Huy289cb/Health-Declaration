package com.globits.healthdeclaration.rest;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.globits.healthdeclaration.HealthDeclarationConstant;
import com.globits.healthdeclaration.dto.FamilyMemberDto;
import com.globits.healthdeclaration.dto.PersonalHealthRecordDto;
import com.globits.healthdeclaration.functiondto.FamilyMemberSearchDto;
import com.globits.healthdeclaration.functiondto.HealthRecordReportDto;
import com.globits.healthdeclaration.functiondto.ReportResultDto;
import com.globits.healthdeclaration.service.FamilyMemberService;

@RestController
@RequestMapping("/api/familyMember")
public class RestFamilyMemberController {

    @Autowired
    private FamilyMemberService service;

    @Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_USER })
    @RequestMapping(value = "searchByDto", method = RequestMethod.POST)
    public ResponseEntity<Page<FamilyMemberDto>> searchByDto(@RequestBody FamilyMemberSearchDto dto) {
        Page<FamilyMemberDto> result = service.searchByDto(dto);
        return new ResponseEntity<Page<FamilyMemberDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    @Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_USER })
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public ResponseEntity<FamilyMemberDto> getById(@PathVariable UUID id) {
        FamilyMemberDto result = service.getById(id);
        return new ResponseEntity<FamilyMemberDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    @Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_USER })
    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<FamilyMemberDto> save(@RequestBody FamilyMemberDto dto) {
        FamilyMemberDto result = service.saveOrUpdate(null, dto);
        return new ResponseEntity<FamilyMemberDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    @Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_USER })
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<FamilyMemberDto> update(@RequestBody FamilyMemberDto dto, @PathVariable("id") UUID id) {
        FamilyMemberDto result = service.saveOrUpdate(id, dto);
        return new ResponseEntity<FamilyMemberDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    @Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_USER })
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Boolean> deleteById(@PathVariable("id") String id) {
        Boolean result = service.deleteById(UUID.fromString(id), false);
        return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }
    
    @Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_USER })
    @RequestMapping(value = "/checkDuplicate", method = RequestMethod.POST)
    public ResponseEntity<Integer> checDuplicate(@RequestBody FamilyMemberDto dto) {
    	Integer result = service.checkDuplicate(dto);
        return new ResponseEntity<Integer>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }
    
    @RequestMapping(value = "/reportByAdminUnit/{communeId}/{quarterId}/{townId}/{groupByType}", method = RequestMethod.GET)
	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_USER })
    public ResponseEntity<ReportResultDto<HealthRecordReportDto> > reportByAdminUnit(
    		@PathVariable UUID communeId,
    		@PathVariable UUID quarterId,
    		@PathVariable UUID townId,
    		@PathVariable String groupByType) {
    	ReportResultDto<HealthRecordReportDto>  result = service.reportSuspectedLevel(communeId, quarterId, townId, groupByType);
        return new ResponseEntity<ReportResultDto<HealthRecordReportDto> >(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }
    
    @RequestMapping(value = "/getListPatientByAdminUnit/{suspectedLevel}/{communeId}/{quarterId}/{townId}", method = RequestMethod.GET)
   	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM })
       public List<FamilyMemberDto> getListPatientByAdminUnit(
       		@PathVariable String suspectedLevel,
       		@PathVariable UUID communeId,
       		@PathVariable UUID quarterId,
       		@PathVariable UUID townId){    	
       	 List<FamilyMemberDto> result = service.listPatientByAdminUnit(suspectedLevel, communeId, quarterId, townId);
       	 return result;
       }

}
