import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const FamilyMember = EgretLoadable({
  loader: () => import("./FamilyMember")
});

const ViewComponent = withTranslation()(FamilyMember);

const FamilyMemberRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"familyMember",
    exact: true,
    component: ViewComponent
  }
];

export default FamilyMemberRoutes;
