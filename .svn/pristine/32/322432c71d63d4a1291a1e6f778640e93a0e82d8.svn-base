package com.globits.healthdeclaration.rest;


import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.globits.healthdeclaration.HealthDeclarationEnumsType;
import com.globits.healthdeclaration.dto.FamilyDto;
import com.globits.healthdeclaration.dto.HDAdministrativeUnitDto;
import com.globits.healthdeclaration.functiondto.ForgotPasswordDto;
import com.globits.healthdeclaration.functiondto.HDAdministrativeUnitSearchDto;
import com.globits.healthdeclaration.functiondto.RegisterDto;
import com.globits.healthdeclaration.service.FamilyService;
import com.globits.healthdeclaration.service.HDAdministrativeUnitService;
import com.globits.healthdeclaration.service.UserAdministrativeUnitService;
import com.globits.healthdeclaration.service.UserOtpService;


@RestController
@RequestMapping(value = "/public")
public class RestPublicController {

    @Autowired
    HDAdministrativeUnitService service;

    @Autowired
    FamilyService familyService;

    @Autowired
    UserAdministrativeUnitService userAdministrativeUnitService;

    @Autowired
    UserOtpService userOtpService;

    @PostMapping(value = "/administrativeUnit/searchByDto")
    public ResponseEntity<?> searchByDto(@RequestBody HDAdministrativeUnitSearchDto dto) {
        Page<HDAdministrativeUnitDto> result = service.searchByDto(dto);
        return new ResponseEntity<>(result, result != null ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

//    @PostMapping(value = "family/searchByDto")
//    public ResponseEntity<Page<FamilyDto>> searchByDto(@RequestBody FamilySearchDto dto) {
//        Page<FamilyDto> result = familyService.searchByDto(dto);
//        return new ResponseEntity<Page<FamilyDto>>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
//    }
    
    @GetMapping(value = "/resendOtpRegister")
    public ResponseEntity<RegisterDto> resendOtpRegister(@RequestParam("phoneNumber") String phoneNumber) {
    	RegisterDto result = userOtpService.resendOTP(phoneNumber, HealthDeclarationEnumsType.UserOtpType.RegisterAccount.getValue());
        return new ResponseEntity<RegisterDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }
    
    @PostMapping(value = "/register")
    public ResponseEntity<RegisterDto> registerUser(@RequestBody FamilyDto dto) {
    	RegisterDto result = userAdministrativeUnitService.registerUser(dto);
        return new ResponseEntity<RegisterDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }
    
    @PostMapping(value = "/createFamily")
    public ResponseEntity<RegisterDto> registry(@RequestBody FamilyDto dto) {
    	RegisterDto result = familyService.registry(dto);
        return new ResponseEntity<RegisterDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    @GetMapping(value = "/family/getNewCode")
    public ResponseEntity<String> getNewCode() {
        String result = familyService.getNewCode();
        return new ResponseEntity<String>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    @GetMapping(value = "/family/checkDuplicate")
    public ResponseEntity<Boolean> checkCode(@RequestParam(value = "id", required = false) UUID id,
                                             @RequestParam("code") String code, @RequestParam("phoneNumber") String phoneNumber) {
        Boolean result = familyService.checkDuplicate(id, code, phoneNumber);
        return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    @GetMapping(value = "/checkUserName")
    public ResponseEntity<ForgotPasswordDto> checkUserName(@RequestParam("phoneNumber") String phoneNumber) {
        ForgotPasswordDto result = userAdministrativeUnitService.checkUsernameAndSendOTP(phoneNumber);
        return new ResponseEntity<ForgotPasswordDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    @PostMapping(value = "/checkOTP")
    public ResponseEntity<Boolean> checkOTP(@RequestBody ForgotPasswordDto dto) {
        Boolean result = userAdministrativeUnitService.checkOTP(dto);
        return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    @PostMapping(value = "/changeForgotPassword")
    public ResponseEntity<Boolean> changeForgotPassword(@RequestBody ForgotPasswordDto dto) {
        Boolean result = userAdministrativeUnitService.changeForgotPassword(dto);
        return new ResponseEntity<Boolean>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

//    @RequestMapping(value = "/family/getByCode/{code}", method = RequestMethod.GET)
//    public ResponseEntity<FamilyDto> getByCode(@PathVariable String code) {
//        FamilyDto result = familyService.getByCode(code);
//        return new ResponseEntity<FamilyDto>(result, (result != null) ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
//    }


}
