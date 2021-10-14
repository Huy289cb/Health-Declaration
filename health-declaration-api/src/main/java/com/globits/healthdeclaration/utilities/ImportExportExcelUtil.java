package com.globits.healthdeclaration.utilities;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;

import com.globits.healthdeclaration.functiondto.HDAdministrativeUnitImportExcel;

@Component
public class ImportExportExcelUtil {
	public static List<HDAdministrativeUnitImportExcel> importAdministrativeUnitFromInputStream(InputStream is) throws IOException {
		List<HDAdministrativeUnitImportExcel> listData = new ArrayList<HDAdministrativeUnitImportExcel>();
		try {
            // cảnh báo
            @SuppressWarnings("resource")
            Workbook workbook = new XSSFWorkbook(is);
            Sheet datatypeSheet = workbook.getSheetAt(0);
            int rowIndex = 1;
            int falseIndex = 1;
            int num = datatypeSheet.getLastRowNum();
            while (rowIndex < num) {
                Row currentRow = datatypeSheet.getRow(rowIndex);
                Cell currentCell = null;
                if (currentRow != null) {
                	HDAdministrativeUnitImportExcel dto = new HDAdministrativeUnitImportExcel();
                    Integer index = 2; //Tên tỉnh
                    currentCell = currentRow.getCell(index);
                    if (currentCell != null && currentCell.getCellTypeEnum() == CellType.NUMERIC) {
                        String tenTinh = String.valueOf((int)currentCell.getNumericCellValue());
                        dto.setTenTinh(tenTinh);
                    } else if (currentCell != null && currentCell.getCellTypeEnum() == CellType.STRING
                            && currentCell.getStringCellValue() != null) {
                        String tenTinh = currentCell.getStringCellValue().trim();
                        dto.setTenTinh(tenTinh);
                    }
                    

                    index = 3; //tên huyện
                    currentCell = currentRow.getCell(index);
                    if (currentCell != null && currentCell.getCellTypeEnum() == CellType.NUMERIC) {
                        String tenHuyen = String.valueOf((int)currentCell.getNumericCellValue());
                        dto.setTenHuyen(tenHuyen);
                    } else if (currentCell != null && currentCell.getCellTypeEnum() == CellType.STRING
                            && currentCell.getStringCellValue() != null) {
                        String tenHuyen = currentCell.getStringCellValue().trim();
                        dto.setTenHuyen(tenHuyen);
                    }
                    
					index = 4; //tên xã
					currentCell = currentRow.getCell(index);
					if (currentCell != null && currentCell.getCellTypeEnum() == CellType.NUMERIC) {
						String tenXa	= String.valueOf((int)currentCell.getNumericCellValue());
						dto.setTenXa(tenXa);
					} else if (currentCell != null && currentCell.getCellTypeEnum() == CellType.STRING
							&& currentCell.getStringCellValue() != null) {
						String tenXa = currentCell.getStringCellValue().trim();
						dto.setTenXa(tenXa);
					}
					
					index = 5; //loại xã
					currentCell = currentRow.getCell(index);
					if (currentCell != null && currentCell.getCellTypeEnum() == CellType.NUMERIC) {
						String loaiXa	= String.valueOf((int)currentCell.getNumericCellValue());
						dto.setLoaiXa(loaiXa);
					} else if (currentCell != null && currentCell.getCellTypeEnum() == CellType.STRING
							&& currentCell.getStringCellValue() != null) {
						String loaiXa = currentCell.getStringCellValue().trim();
						dto.setLoaiXa(loaiXa);
					}
					
					index = 6; //kinh do
					currentCell = currentRow.getCell(index);
					if (currentCell != null && currentCell.getCellTypeEnum() == CellType.NUMERIC) {
						double a = currentCell.getNumericCellValue();
						String kinhDo	= String.valueOf((double)currentCell.getNumericCellValue());
						dto.setKinhDo(kinhDo);
					} else if (currentCell != null && currentCell.getCellTypeEnum() == CellType.STRING
							&& currentCell.getStringCellValue() != null) {
						String kinhDo = currentCell.getStringCellValue().trim();
						dto.setKinhDo(kinhDo);
					}
					
					index = 7; //vi do
					currentCell = currentRow.getCell(index);
					if (currentCell != null && currentCell.getCellTypeEnum() == CellType.NUMERIC) {
						String viDo	= String.valueOf((double)currentCell.getNumericCellValue());
						dto.setViDo(viDo);
					} else if (currentCell != null && currentCell.getCellTypeEnum() == CellType.STRING
							&& currentCell.getStringCellValue() != null) {
						String viDo = currentCell.getStringCellValue().trim();
						dto.setViDo(viDo);
					}
					
                    listData.add(dto);
                }
                rowIndex++;
            }

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
		return listData;
	}
}
