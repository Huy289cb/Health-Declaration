package com.globits.healthdeclaration.rest;

import com.globits.healthdeclaration.HealthDeclarationConstant;
import com.globits.healthdeclaration.dto.PersonalHealthRecordDto;
import com.globits.healthdeclaration.functiondto.HealthRecordReportDto;
import com.globits.healthdeclaration.functiondto.PersonalHealthRecordSearchDto;
import com.globits.healthdeclaration.functiondto.ReportResultDto;
import com.globits.healthdeclaration.functiondto.SearchDto;
import com.globits.healthdeclaration.service.PersonalHealthRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/health-record")
public class RestPersonalHealthRecordController {

    @Autowired
    private PersonalHealthRecordService service;

    @RequestMapping(value = "searchByDto", method = RequestMethod.POST)
    @Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_USER })
    public ResponseEntity<Page<PersonalHealthRecordDto>> searchByDto(@RequestBody PersonalHealthRecordSearchDto dto) {
        Page<PersonalHealthRecordDto> result = service.searchByDto(dto);
        return new ResponseEntity<Page<PersonalHealthRecordDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_USER })
    public ResponseEntity<PersonalHealthRecordDto> getById(@PathVariable UUID id) {
        PersonalHealthRecordDto result = service.getById(id);
        return new ResponseEntity<PersonalHealthRecordDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    @RequestMapping(method = RequestMethod.POST)
    @Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_USER })
    public ResponseEntity<PersonalHealthRecordDto> save(@RequestBody PersonalHealthRecordDto dto) {
        PersonalHealthRecordDto result = service.saveOrUpdate(dto, null);
        return new ResponseEntity<PersonalHealthRecordDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    @Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM })
    public ResponseEntity<PersonalHealthRecordDto> update(@RequestBody PersonalHealthRecordDto dto, @PathVariable("id") UUID id) {
        PersonalHealthRecordDto result = service.saveOrUpdate(dto, id);
        return new ResponseEntity<PersonalHealthRecordDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @Secured({ HealthDeclarationConstant.ROLE_ADMIN })
    public ResponseEntity<Boolean> deleteById(@PathVariable("id") String id) {
        Boolean result = service.deleteById(UUID.fromString(id));
        return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    @RequestMapping(value = "/reportByAdminUnit/{resolveStatus}/{seriusStatus}/{communeId}/{quarterId}/{townId}/{residentialGroup}/{groupByType}", method = RequestMethod.GET)
	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM, HealthDeclarationConstant.ROLE_USER })
    public ResponseEntity<ReportResultDto<HealthRecordReportDto> > reportByAdminUnit(
    		@PathVariable Integer resolveStatus, 
    		@PathVariable Integer seriusStatus,
    		@PathVariable UUID communeId,
    		@PathVariable UUID quarterId,
    		@PathVariable UUID townId,
    		@PathVariable UUID residentialGroup,
    		@PathVariable String groupByType) {
    	ReportResultDto<HealthRecordReportDto>  result = service.getReportByAdminUnit(resolveStatus, seriusStatus, communeId, quarterId, townId, residentialGroup, groupByType);
        return new ResponseEntity<ReportResultDto<HealthRecordReportDto> >(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }
    @RequestMapping(value = "/getListPatientByAdminUnit/{resolveStatus}/{seriusStatus}/{seriousLevel}/{communeId}/{quarterId}/{townId}/{residentialGroup}", method = RequestMethod.GET)
	@Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM })
    public List<PersonalHealthRecordDto> getListPatientByAdminUnit(
    		@PathVariable Integer resolveStatus,
    		@PathVariable Integer seriusStatus, 
    		@PathVariable Integer seriousLevel,
    		@PathVariable UUID communeId,
    		@PathVariable UUID quarterId,
    		@PathVariable UUID townId, 
    		@PathVariable UUID residentialGroup){    	
    	 List<PersonalHealthRecordDto> result = service.getListPatientByAdminUnit(resolveStatus, seriusStatus, seriousLevel, communeId, quarterId, townId, residentialGroup);
    	 return result;
    }

    @RequestMapping(value = "updateStaus/{id}", method = RequestMethod.PUT)
    @Secured({ HealthDeclarationConstant.ROLE_ADMIN, HealthDeclarationConstant.ROLE_HEALTHCARE_STAFF, HealthDeclarationConstant.ROLE_MEDICAL_TEAM })
    public ResponseEntity<PersonalHealthRecordDto> updateStaus(@RequestBody PersonalHealthRecordDto dto, @PathVariable("id") UUID id) {
        PersonalHealthRecordDto result = service.updateStaus(dto, id);
        return new ResponseEntity<PersonalHealthRecordDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }
}
