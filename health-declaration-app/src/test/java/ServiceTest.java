import static org.hamcrest.Matchers.hasSize;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.jsonPath;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static sun.nio.cs.Surrogate.is;

import com.globits.healthdeclaration.domain.BackgroundDisease;
import com.globits.healthdeclaration.dto.BackgroundDiseaseDto;
import com.globits.healthdeclaration.dto.HealthCareGroupDto;
import com.globits.healthdeclaration.dto.SymptomDto;
import com.globits.healthdeclaration.functiondto.BackgroundDiseaseSearchDto;
import com.globits.healthdeclaration.functiondto.HealthCareGroupSearchDto;
import com.globits.healthdeclaration.functiondto.SearchDto;
import com.globits.healthdeclaration.repository.BackgroundDiseaseRepository;
import com.globits.healthdeclaration.rest.RestBackgroundDiseaseController;
import com.globits.healthdeclaration.service.BackgroundDiseaseService;
import com.globits.healthdeclaration.service.HealthCareGroupService;
import com.globits.healthdeclaration.service.SymptomService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultMatcher;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.globits.config.DatabaseConfig;
import com.globits.security.dto.UserDto;
import com.globits.security.service.UserService;

import java.util.UUID;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = DatabaseConfig.class)
@Transactional(propagation = Propagation.REQUIRED)
public class ServiceTest {

	@Autowired
	UserService service;

	@Autowired
	HealthCareGroupService healthCareGroupService;

	@Autowired
	BackgroundDiseaseService backgroundDiseaseService;

	@Autowired
	BackgroundDiseaseRepository backgroundDiseaseRepository;

	@Autowired
	SymptomService symptomService;

	@Test
	public void testBackgroundDiseaseWorks() {
//		Page<UserDto> page = service.findByPage(1, 10);
//		assertTrue(page.getTotalElements() >= 0);
//
		BackgroundDiseaseSearchDto searchDto = new BackgroundDiseaseSearchDto();
		searchDto.setPageIndex(1);
		searchDto.setPageSize(10);
		Page<BackgroundDiseaseDto> page = backgroundDiseaseService.searchByDto(searchDto);
		assertTrue(page.getTotalElements() >= 0);

		BackgroundDiseaseDto backgroundDiseaseDto = new BackgroundDiseaseDto();
		backgroundDiseaseDto.setCode("AAAA");
		backgroundDiseaseDto.setName(null);
		backgroundDiseaseDto.setId(UUID.fromString("188be1d2-be1b-4bb9-9245-ef7589862383"));

		backgroundDiseaseDto = backgroundDiseaseService.saveOrUpdate(backgroundDiseaseDto, UUID.fromString("188be1d2-be1b-4bb9-9245-ef7589862383"));
		assertNotNull(backgroundDiseaseDto.getId());
	}
}
