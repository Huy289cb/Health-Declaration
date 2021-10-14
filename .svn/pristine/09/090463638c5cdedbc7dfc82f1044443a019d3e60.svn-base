package com.globits.healthdeclaration.utilities.sms;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Date;
import java.util.HashMap;

import com.globits.healthdeclaration.dto.SmsSendResponseDto;

public class OTPUtils {
    public static HashMap<String, Long> sentPhone = new HashMap<String, Long>();

    public static String generate(int maxLength) {
        SecureRandom secureRandom;
        try {
            secureRandom = SecureRandom.getInstance("SHA1PRNG");
            final StringBuilder otp = new StringBuilder(maxLength);
            for (int i = 0; i < maxLength; i++) {
                otp.append(secureRandom.nextInt(9));
            }
            return otp.toString();
        } catch (NoSuchAlgorithmException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return null;
    }

    public static SmsSendResponseDto sendOTP(String phoneNumber) {
        if (!sentPhone.containsKey(phoneNumber) || sentPhone.get(phoneNumber) < ((new Date().getTime()) / 1000)) {
            SMSUtils smsUtils = new SMSFTPUtils();
            String OTP = generate(6);
            String content = String.format(
                    "Ma OTP cua ban la %s, hieu luc 3 phut. Vui long KHONG cung cap cho bat ky ai", OTP);
            SmsSendResponseDto smsSendResponseDto = smsUtils.send(phoneNumber.replace("+84", "0"), content);
            smsSendResponseDto.setOTP(OTP);
            if (smsSendResponseDto.getError() == null || smsSendResponseDto.getError().isEmpty()) {
                sentPhone.put(phoneNumber, (new Date().getTime()) / 1000 + 180);
            }
            return smsSendResponseDto;
        } else {
            SmsSendResponseDto smsSendResponseDto = new SmsSendResponseDto();
            smsSendResponseDto.setError("error");
            smsSendResponseDto.setErrorDescription("Da gui tin nhan, vui long gui lại sau 3 phut");
            return smsSendResponseDto;
        }

    }

    public static void main(String[] args) {
        SmsSendResponseDto smsSendResponseDto = sendOTP("+84866105471");
        smsSendResponseDto = sendOTP("+84866105471");
    }
}
