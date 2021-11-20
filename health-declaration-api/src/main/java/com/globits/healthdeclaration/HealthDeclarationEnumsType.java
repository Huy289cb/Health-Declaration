package com.globits.healthdeclaration;

public class HealthDeclarationEnumsType {

	public static enum PersonalHealthRecordType{
		family(1),				//Hộ gia đình
		medical_team(2),		//Tổ y tế
		practitioner(3),		//bác sĩ - nhân viên y tế trực tiếp
		remoteWork(4);//bác sĩ - nhân viên y tế làm từ xa
		private Integer value;

		private PersonalHealthRecordType(Integer value) {
			this.value = value;
		}

		public Integer getValue() {
			return value;
		}

	}
	public enum SymptomType {
		// Triệu chứng thường gặp 
		type1(1, "Triệu chứng thường gặp"),

		// Triệu chứng nặng
		type2(2, "Triệu chứng nặng");

		private final int number;
		private final String description;

		private SymptomType(int number, String description) {
			this.number = number;
			this.description = description;
		}

		public int getNumber() {
			return number;
		}

		public String getDescription() {
			return description;
		}
	}

	public enum EncounterType {
		// Khám trực tiếp
		type1(1, "Khám trực tiếp"),

		//Khám qua điện thoại
		type2(2, "Khám qua điện thoại");

		private final int number;
		private final String description;

		private EncounterType(int number, String description) {
			this.number = number;
			this.description = description;
		}

		public int getNumber() {
			return number;
		}

		public String getDescription() {
			return description;
		}
	}

	public enum EncounterMakeDecision {
		// Khám trực tiếp
		decision1(1, "Chuyển đi cấp cứu"),

		//Khám qua điện thoại
		decision2(2, "Tiếp tục theo dõi ở nhà");

		private final int number;
		private final String description;

		private EncounterMakeDecision(int number, String description) {
			this.number = number;
			this.description = description;
		}

		public int getNumber() {
			return number;
		}

		public String getDescription() {
			return description;
		}
	}
	
	public static enum TypeOfCommonKeyCode{
		Family(1);						// Hộ gia đình
		private int value;    
		
		private TypeOfCommonKeyCode(int value) {
		    this.value = value;
		}
	
		public int getValue() {
			return value;
		}
	}
	
	public static enum UserUnitType {
		healthcareStaff("healthcareStaff"), //Nhân viên y tế
		doctor("doctor"); //Bác sĩ
		private String value;
		private UserUnitType(String value) {
			this.value = value;
		}
		public String getValue() {
			return value;
		}
		public void setValue(String value) {
			this.value = value;
		}	
	}	
	
	public static enum PersonalHealthRecordResolveStatus{
		NoProcessingRequired(-1),	//Không cần xử lý
		NoProcess(1),	//chưa xử lý
		Processing(2),	//đang xử lý
		Processed(3);	//đã xử lý
		
		private int value;    
		
		private PersonalHealthRecordResolveStatus(int value) {
		    this.value = value;
		}
	
		public int getValue() {
			return value;
		}
	}
	
	public static enum PersonalHealthRecordSeriusStatus{
		Level0(-1),	//Mức nguy cơ thấp
		Level1(1),	//Mức nguy cơ trung bình
		Level2(2),	//Mức nguy cơ cao
		Level3(3);	//Mức nguy cơ rất cao
		
		private int value;    
		
		private PersonalHealthRecordSeriusStatus(int value) {
		    this.value = value;
		}
	
		public int getValue() {
			return value;
		}
	}

	public static enum PersonalHealthRecordSpO2{
		// Chỉ số SpO2
//		opt1(-1),		//SpO2 <87
//		opt2(1),		//SpO2 87-89
//		opt3(2),		//SpO2 90-91
		opt4(3),		//SpO2 <92
		opt5(4),		//SpO2 92-94
		opt6(5),		//SpO2 95-96
		opt7(6);		//SpO2 >96

		private Integer value;

		private PersonalHealthRecordSpO2(Integer value) {
			this.value = value;
		}

		public Integer getValue() {
			return value;
		}

	}

	public static enum PersonalHealthRecordBreathingRate{
		// Chỉ số nhịp thở(lần/phút)
		opt1(-1), 	//<17
		opt2(1),		//17-20
		opt3(2),		//21-23
		opt4(3),		//24-26
		opt5(4),		//27-30
		opt6(5);		//>30

		private Integer value;

		private PersonalHealthRecordBreathingRate(Integer value) {
			this.value = value;
		}

		public Integer getValue() {
			return value;
		}
	}

	public static enum PersonalHealthRecordTemperature{
		// Nhiệt độ (độ C)
		opt1(-1),		//<36
		opt2(1),		//36-37
		opt3(2),		//37.1-37.5
		opt4(3),		//37.6-38
		opt5(4),		//38.1-38.4
		opt6(5),		//38.5-39
		opt7(6);		//>39

		private Integer value;

		private PersonalHealthRecordTemperature(Integer value) {
			this.value = value;
		}

		public Integer getValue() {
			return value;
		}

	}
	public static enum ReportGroupByType{
		//Phường
		commune("commune"),
		quarter("quarter"), //Khu phố
		//Tổ
		town("town");

		private String value;

		private ReportGroupByType(String value) {
			this.value = value;
		}
		public String getValue() {
			return value;
		}

	}
	
	public static enum PractitionerOccupation{
		doctor(1),		//bác sĩ
		nursing(2);		//điều dưỡng

		private Integer value;

		private PractitionerOccupation(Integer value) {
			this.value = value;
		}

		public Integer getValue() {
			return value;
		}
	}
	
	public static enum UserOtpType{
		RegisterAccount(1),		//Đăng ký tài khoản
		Forgot_Password(2);		//Quên mật khẩu

		private Integer value;

		private UserOtpType(Integer value) {
			this.value = value;
		}

		public Integer getValue() {
			return value;
		}
	}
	
	public static enum ResultType{
		positive(1),		//Dương tính
		negative(2);		//Âm tính

		private Integer value;

		private ResultType(Integer value) {
			this.value = value;
		}

		public Integer getValue() {
			return value;
		}
	}
	
	public static enum RegisterUserType{
		Resend(1,"Gửi lại OTP thành công."),		//Gửi lại OTP
		IsUsed(2, "Tài khoản của bạn đã được đăng ký và kích hoạt thành công, vui lòng chuyển sang đăng nhập."),		//Đã đăng ký tài khoản
		Expired(3, "Tài khoản của bạn chưa được kích hoạt, vui lòng nhấn 'gửi lại mã' nếu bạn chưa nhận được mã nào và kích hoạt lại."),		//Đã hết hạn
		WrongOtpCode(4, ""),	//Sai mã OTP
		AccountNotRegistered(5, "");	//Tài khoản chưa được đăng ký
		
		private Integer value;
		private final String description;

		private RegisterUserType(Integer value, String description) {
			this.value = value;
			this.description = description;
		}

		public Integer getValue() {
			return value;
		}

		public String getDescription() {
			return description;
		}
	}
	public enum SuspectedLevelType {
		normal("normal"), f0("f0"), f1("f1"), f2("f2");
		
		private String value;
		
		private SuspectedLevelType(String value) {
			this.value = value;
		}
		public String getValue() {
			return value;
		}

	}
	
}
