package com.globits.healthdeclaration.rest;

import java.io.ByteArrayInputStream;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.globits.healthdeclaration.dto.HDAdministrativeUnitDto;
import com.globits.healthdeclaration.functiondto.HDAdministrativeUnitImportExcel;
import com.globits.healthdeclaration.service.HDAdministrativeUnitService;
import com.globits.healthdeclaration.service.ImportExcelService;
import com.globits.healthdeclaration.utilities.ImportExportExcelUtil;

@RestController
@RequestMapping("/api/uploadExcel")
public class RestUploadExcelController {
	@Autowired
	private ImportExcelService importExcelService;

	@Autowired
	private HDAdministrativeUnitService administrativeUnitService;
	@PostMapping("/sampleBag")
	@ResponseBody
	public ResponseEntity<?> importSample(@RequestParam("uploadfiles") MultipartFile[] uploadfiles) {
		importExcelService.importSample(uploadfiles);
		return null;
	}
	
	@RequestMapping(value = "/importUnitFile", method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<?> importUnitFile(@RequestParam("uploadfile") MultipartFile uploadfile) {
		try {
			ByteArrayInputStream bis = new ByteArrayInputStream(uploadfile.getBytes());
			List<HDAdministrativeUnitImportExcel> list = ImportExportExcelUtil.importAdministrativeUnitFromInputStream(bis);
			if(list != null && list.size()>0) {
				List<HDAdministrativeUnitDto> listData = administrativeUnitService.importExcel(list);				
			}

		} catch (Exception e) {
			System.out.println(e.getMessage());
			
		}
		return new ResponseEntity<>(HttpStatus.OK);
	}
}
