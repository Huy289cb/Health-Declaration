import static org.hamcrest.Matchers.hasSize;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestBuilders.formLogin;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.security.test.web.servlet.response.SecurityMockMvcResultMatchers.authenticated;
import static org.springframework.security.test.web.servlet.response.SecurityMockMvcResultMatchers.unauthenticated;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.jsonPath;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static sun.nio.cs.Surrogate.is;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.springtestdbunit.annotation.DatabaseSetup;
import com.globits.core.utils.BeanUtils;
import com.globits.healthdeclaration.domain.BackgroundDisease;
import com.globits.healthdeclaration.dto.BackgroundDiseaseDto;
import com.globits.healthdeclaration.dto.FamilyDto;
import com.globits.healthdeclaration.dto.HealthCareGroupDto;
import com.globits.healthdeclaration.dto.SymptomDto;
import com.globits.healthdeclaration.functiondto.BackgroundDiseaseSearchDto;
import com.globits.healthdeclaration.functiondto.HealthCareGroupSearchDto;
import com.globits.healthdeclaration.functiondto.SearchDto;
import com.globits.healthdeclaration.repository.BackgroundDiseaseRepository;
import com.globits.healthdeclaration.repository.FamilyRepository;
import com.globits.healthdeclaration.repository.PractitionerAndFamilyRepository;
import com.globits.healthdeclaration.rest.RestBackgroundDiseaseController;
import com.globits.healthdeclaration.rest.RestFamilyController;
import com.globits.healthdeclaration.service.BackgroundDiseaseService;
import com.globits.healthdeclaration.service.FamilyService;
import com.globits.healthdeclaration.service.HealthCareGroupService;
import com.globits.healthdeclaration.service.SymptomService;
import com.globits.security.domain.User;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.common.exceptions.InvalidClientException;
import org.springframework.security.oauth2.common.exceptions.InvalidGrantException;
import org.springframework.security.oauth2.common.exceptions.InvalidRequestException;
import org.springframework.security.oauth2.common.util.OAuth2Utils;
import org.springframework.security.oauth2.provider.*;
import org.springframework.security.oauth2.provider.request.DefaultOAuth2RequestValidator;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.context.support.WithSecurityContext;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.ResultMatcher;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.globits.config.DatabaseConfig;
import com.globits.security.dto.UserDto;
import com.globits.security.service.UserService;
import org.springframework.util.StringUtils;
import org.springframework.web.context.WebApplicationContext;

import java.lang.annotation.*;
import java.util.*;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = DatabaseConfig.class)
@Transactional(propagation = Propagation.REQUIRED)
//@AutoConfigureMockMvc
//@WithMockUser(username = "admin", roles = "ADMIN")
public class ServiceTest {

//	@Autowired
//	private MockMvc mockMvc;

//	@Autowired
//	private BackgroundDiseaseService backgroundDiseaseService;
//
//	@Autowired
//	private WebApplicationContext webApplicationContext;

	@Autowired
	private PractitionerAndFamilyRepository practitionerAndFamilyRepository;



//	@Test
//	public void getEmployeeByIdAPI() throws Exception
//	{
//		mockMvc.perform( MockMvcRequestBuilders
//						.get("/api/family/{id}", "275c3327-30b5-4ca3-802e-5087cec7862d")
//						.accept(MediaType.APPLICATION_JSON))
//				.andDo(print())
//				.andExpect(status().isOk());
//	}

//	@Before()
//	public void setup()
//	{
//		//Init MockMvc Object and build
//		mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
//	}

	@Test
	public void testFamily() throws Exception {

		Integer c = 0;
		c = practitionerAndFamilyRepository.countFamilyMemberByPractitionerId(UUID.fromString("da96f930-d7f6-458a-a0d1-33a4f7820fb3"));
		System.out.println(c);
//		assertTrue(familyRepository.findById(UUID.fromString("019fc27a-b141-49ae-97e7-edf6febe696e")).isPresent());
//		mockMvc.perform(get("/health-declaration/api/family/{id}", "275c3327-30b5-4ca3-802e-5087cec7862d"))
//				.andDo(print())
//				.andExpect(status().isOk());

//		FamilyDto f = new FamilyDto();
//		f.setId(UUID.fromString("275c3327-30b5-4ca3-802e-5087cec7862d"));
//		ObjectMapper mapper = new ObjectMapper();
//		String json = mapper.writeValueAsString(f);
//		mockMvc.perform(delete("/health-declaration/api/family/{id}", f.getId()).content(json)).andDo(print()).andExpect(status().isOk());

	}
//
//
//	@Test
//	public void testLogin() throws Exception {
////		mockMvc.perform(formLogin("/oauth/token")
////				.user("admin")
////				.password("admin")
////						.acceptMediaType(MediaType.APPLICATION_FORM_URLENCODED))
////				.andExpect(authenticated());
//
////		mockMvc.perform(get("/oauth/token")
////								.header("Authorization", "Basic Y29yZV9jbGllbnQ6c2VjcmV0")
////								.contentType(MediaType.APPLICATION_FORM_URLENCODED)
////								.param("username", "admin")
////								.param("password", "admin")
////								.param("client_id", "core_client")
////								.param("grant_type", "password")
////								.param("client_secret", "secret"))
////				.andExpect(status().isOk());
//	}

//	@Test
//	public void testDeleteBackgroundDisease() {
//		assertTrue(backgroundDiseaseService.deleteById(UUID.fromString("bfe42109-1b41-4f9e-ae41-a0d8a5438ed7")));
//	}

//	@Test
//	public void testBackgroundDiseaseWorks() {
////		Page<UserDto> page = service.findByPage(1, 10);
////		assertTrue(page.getTotalElements() >= 0);
////
//		BackgroundDiseaseSearchDto searchDto = new BackgroundDiseaseSearchDto();
//		searchDto.setPageIndex(1);
//		searchDto.setPageSize(10);
//		Page<BackgroundDiseaseDto> page = backgroundDiseaseService.searchByDto(searchDto);
//		assertTrue(page.getTotalElements() >= 0);
//
//		BackgroundDiseaseDto backgroundDiseaseDto = new BackgroundDiseaseDto();
//		backgroundDiseaseDto.setCode("AAAA");
//		backgroundDiseaseDto.setName(null);
//		backgroundDiseaseDto.setId(UUID.fromString("188be1d2-be1b-4bb9-9245-ef7589862383"));
//
//		backgroundDiseaseDto = backgroundDiseaseService.saveOrUpdate(backgroundDiseaseDto, UUID.fromString("188be1d2-be1b-4bb9-9245-ef7589862383"));
//		assertNotNull(backgroundDiseaseDto.getId());
//	}


}

//@Target({ElementType.METHOD, ElementType.TYPE})
//@Retention(RetentionPolicy.RUNTIME)
//@Inherited
//@Documented
//@WithSecurityContext(
//		factory = WithMockUserSecurityContextFactory.class
//)
//public @interface WithMockUser {
//	String value() default "user";
//
//	String username() default "";
//
//	String[] roles() default {"USER"};
//
//	String password() default "password";
//}
