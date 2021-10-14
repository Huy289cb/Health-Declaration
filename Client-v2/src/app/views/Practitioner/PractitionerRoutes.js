import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const Practitioner = EgretLoadable({
  loader: () => import("./Practitioner")
});
const ViewComponent = withTranslation()(Practitioner);

const PractitionerRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"practitioner",
    exact: true,
    component: ViewComponent
  }
];

export default PractitionerRoutes;
