import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const User = EgretLoadable({
  loader: () => import("./User")
});
const ViewComponentUser = withTranslation()(User);

const UserProfile = EgretLoadable({
  loader: () => import("./UserProfile")
});

const ViewComponent = withTranslation()(UserProfile);

const UserHealthCareGroupRoutes = [
  // {
  //   path:  ConstantList.ROOT_PATH+"user-profile",
  //   exact: true,
  //   component: ViewComponent
  // },
  {
    path:  ConstantList.ROOT_PATH+"user_manager/user-healthcare-group",
    exact: true,
    component: ViewComponentUser
  }
];

export default UserHealthCareGroupRoutes;
