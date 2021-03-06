import React from "react";
import { Redirect } from "react-router-dom";
import homeRoutes from "./views/home/HomeRoutes";
import sessionRoutes from "./views/sessions/SessionRoutes";
import dashboardRoutes from "./views/dashboard/DashboardRoutes";
import administrativeUnitRoutes from "./views/AdministrativeUnit/AdministrativeUnitRoutes";
import UserRoutes from "./views/User/UserRoutes";
import roleRoutes from "./views/Role/RoleRoutes";
import ConstantList from "./appConfig";
import MenuRoutes from "./views/Menus/MenuRoutes";
import symptomRoutes from "./views/Symptom/SymptomRoutes";
import backgroundDiseaseRoutes from "./views/BackgroundDisease/BackgroundDiseaseRoutes";
import encounterRoutes from "./views/Encounter/EncounterRoutes";
import Organization from "./views/Organization/OrganizationRoutes";
import familyRoutes from "./views/Family/Routes"; 
import familyMemberRoutes from "./views/FamilyMember/FamilyMemberRouter"; 
import PersonalHealthRecordRoutes from "./views/PersonalHealthRecord/PersonalHealthRecordRoutes";
import healthCareGroupRoutes from "./views/HealthCareGroup/HealthCareGroupRoutes";
import TutorialRoutes from "./views/Tutorial/TutorialRoutes";
import PatientNeedsHelpRoutes from "./views/Report/PatientNeedsHelp/PatientNeedsHelpRouter";
import PractitionerRoutes from "./views/Practitioner/PractitionerRoutes";
import PractitionerAndFamilyRoutes from "./views/PractitionerAndFamily/PractitionerAndFamilyRoutes";
import HealthOrganizationRoutes from "./views/HealthOrganization/Routes";
import UserHealthCareGroupRoutes from "./views/UserHealthCareGroup/UserHealthCareGroupRoutes";
import ReportSuspectedLevelRouter from "./views/Report/ReportSuspectedLevel/ReportSuspectedLevelRouter";
// import HealthOrgRoutes from "./views/HealthOrg/HealthOrgRoutes";
// import EthnicityRoutes from "./views/Ethnicity/EthnicityRoutes";

const redirectRoute = [
  {
    path: ConstantList.ROOT_PATH,
    exact: true,
    component: () => <Redirect to={ConstantList.HOME_PAGE} />//Luôn trỏ về HomePage được khai báo trong appConfig
  }
];

const errorRoute = [
  {
    component: () => <Redirect to={ConstantList.ROOT_PATH + "session/404"} />
  }
];

const routes = [
  ...homeRoutes,
  ...sessionRoutes,
  ...dashboardRoutes,
  ...administrativeUnitRoutes,
  ...UserRoutes,
  ...roleRoutes,
  ...MenuRoutes,
  ...Organization,
  ...symptomRoutes,
  ...healthCareGroupRoutes,
  ...backgroundDiseaseRoutes,
  ...familyRoutes,
  ...familyMemberRoutes,
  ...encounterRoutes,
  ...PersonalHealthRecordRoutes,
  ...TutorialRoutes,
  ...PatientNeedsHelpRoutes,
  ...PractitionerRoutes,
  ...PractitionerAndFamilyRoutes,
  ...HealthOrganizationRoutes,
  ...UserHealthCareGroupRoutes,
  ...ReportSuspectedLevelRouter,
  // ...HealthOrgRoutes,
  // ...EthnicityRoutes,
  ...redirectRoute,
  ...errorRoute,
];

export default routes;
