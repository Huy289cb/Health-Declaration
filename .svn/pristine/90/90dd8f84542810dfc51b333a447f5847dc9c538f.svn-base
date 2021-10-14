package com.globits.healthdeclaration.utilities.sms;

import java.util.Base64;
import java.util.Date;
import java.util.HashMap;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import com.globits.healthdeclaration.HealthDeclarationConstant;
import com.globits.healthdeclaration.dto.FptSmsAuthResponseDto;
import com.globits.healthdeclaration.dto.FptSmsSendResponseDto;
import com.globits.healthdeclaration.dto.SmsSendResponseDto;

public class SMSFTPUtils implements SMSUtils {

    private static String fptToken;
    private static long expiredTime;

    @Override
    public SmsSendResponseDto send(String phoneNumber, String content) {
        SmsSendResponseDto smsSendResponseDto = new SmsSendResponseDto();
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("access_token", getToken());
            jsonObject.put("session_id", HealthDeclarationConstant.FPT_SMS_AUTHEN_REQUEST_ID);
            jsonObject.put("BrandName", HealthDeclarationConstant.FPT_SMS_SEND_BRANDNAME);
            jsonObject.put("Phone", phoneNumber);
            jsonObject.put("Message", Base64.getEncoder().encodeToString(content.getBytes()));
            jsonObject.put("RequestId", HealthDeclarationConstant.FPT_SMS_SEND_REQUEST_ID);
            HttpEntity<String> request = new HttpEntity<String>(jsonObject.toString(), headers);
            ResponseEntity<FptSmsSendResponseDto> responseEntityPerson = restTemplate
                    .postForEntity(HealthDeclarationConstant.FPT_SMS_SEND_LINK, request, FptSmsSendResponseDto.class);
            return responseEntityPerson.getBody();

        } catch (Exception e) {
            // TODO Auto-generated catch block
            smsSendResponseDto.setError("error");
            smsSendResponseDto.setErrorDescription(e.getMessage());
            return smsSendResponseDto;
        }
    }

    @Override
    public String getToken() throws JSONException {
        if (expiredTime < (new Date().getTime()) / 1000) {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("client_id", HealthDeclarationConstant.FPT_SMS_AUTHEN_CLIENT_ID);
            jsonObject.put("client_secret", HealthDeclarationConstant.FPT_SMS_AUTHEN_CLIENT_SECRET);
            jsonObject.put("scope", HealthDeclarationConstant.FPT_SMS_AUTHEN_SCOPE);
            jsonObject.put("session_id", HealthDeclarationConstant.FPT_SMS_AUTHEN_REQUEST_ID);
            jsonObject.put("grant_type", HealthDeclarationConstant.FPT_SMS_AUTHEN_GRANT_TYPE);
            HttpEntity<String> request = new HttpEntity<String>(jsonObject.toString(), headers);
            ResponseEntity<FptSmsAuthResponseDto> responseEntityPerson = restTemplate
                    .postForEntity(HealthDeclarationConstant.FPT_SMS_AUTHEN_LINK, request, FptSmsAuthResponseDto.class);
            String token = responseEntityPerson.getBody().getAccessToken();
            fptToken = token;
            expiredTime = (new Date().getTime()) / 1000 + responseEntityPerson.getBody().getExpiresIn();
        }
        return fptToken;
    }
}
