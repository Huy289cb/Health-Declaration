package com.globits.healthdeclaration.utilities;

import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.util.CellReference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.globits.healthdeclaration.dto.SampleDto;
import com.globits.healthdeclaration.repository.SampleRepository;

//@Service
public class DownloadExcelUtils {
//	@Autowired
//	HandleTimeUtils handleTimeUtils;

//	@Autowired
//	HandleDateUtils handleDateUtils;

	@Autowired
	SampleRepository sampleBagRepository;

	public static void handleSheetSample(List<SampleDto> listSample, Sheet sheet) {
		CellReference cr = new CellReference("A4");
		int rowIndexStart = cr.getRow();

		Cell cell;
		for (SampleDto sampleBag : listSample) {
			rowIndexStart++;
			Row row = sheet.createRow(rowIndexStart);

			cr = new CellReference("A" + rowIndexStart);
			cell = row.createCell(cr.getCol());
			if (sampleBag.getCode() != null)
				cell.setCellValue(sampleBag.getCode());

			cr = new CellReference("B" + rowIndexStart);
			cell = row.createCell(cr.getCol());

		}
	}

}
