package com.globits.healthdeclaration.functiondto;

import java.util.UUID;

public class PractitionerAndFamilySearchDto extends SearchDto {
	private UUID practitionerId;

	public UUID getPractitionerId() {
		return practitionerId;
	}

	public void setPractitionerId(UUID practitionerId) {
		this.practitionerId = practitionerId;
	}
	
}
