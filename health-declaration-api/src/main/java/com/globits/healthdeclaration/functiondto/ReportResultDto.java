package com.globits.healthdeclaration.functiondto;

import java.util.ArrayList;
import java.util.List;

public class ReportResultDto<T> {
	private String reportName;
	private String code;
	private String message;
	private String resultCode;
	private List<T> details;	
	public ReportResultDto() {
		this.details = new ArrayList<T>();
	}
	public ReportResultDto(String reportName, String note, String message, String resultCode, List<T> details) {
		super();
		this.reportName = reportName;
		this.code = note;
		this.message = message;
		this.resultCode = resultCode;
		this.details = details;
	}
	public String getReportName() {
		return reportName;
	}
	public void setReportName(String reportName) {
		this.reportName = reportName;
	}	
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public String getResultCode() {
		return resultCode;
	}
	public void setResultCode(String resultCode) {
		this.resultCode = resultCode;
	}
	public List<T> getDetails() {
		return details;
	}
	public void setDetails(List<T> details) {
		this.details = details;
	}
}
