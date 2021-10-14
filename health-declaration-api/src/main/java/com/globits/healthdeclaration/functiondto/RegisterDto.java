package com.globits.healthdeclaration.functiondto;

public class RegisterDto {
	private boolean success = false;
	private boolean resendOtp = false;
	private String content ="Có lỗi xảy ra, vui lòng thử lại.";
	private Integer result;

	public RegisterDto() {
		super();
	}

	public boolean isResendOtp() {
		return resendOtp;
	}

	public void setResendOtp(boolean resendOtp) {
		this.resendOtp = resendOtp;
	}

	public Integer getResult() {
		return result;
	}

	public void setResult(Integer result) {
		this.result = result;
	}

	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}
}
