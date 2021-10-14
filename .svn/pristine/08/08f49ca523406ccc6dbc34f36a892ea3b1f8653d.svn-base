import { EgretLoadable } from "egret";
import ConstantList from "../../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const PatientNeedsHelp = EgretLoadable({
  loader: () => import("./PatientNeedsHelp")
});

const ViewComponent = withTranslation()(PatientNeedsHelp);

const PatientNeedsHelpRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"report/patientNeedsHelp",
    exact: true,
    component: ViewComponent
  }
];

export default PatientNeedsHelpRoutes;
