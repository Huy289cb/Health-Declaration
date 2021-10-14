import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const FamilyList = EgretLoadable({
    loader: () =>
        import ("./FamilyList")
});

const ViewComponent = withTranslation()(FamilyList);

const Routes = [{
    path: ConstantList.ROOT_PATH + "family",
    exact: true,
    component: ViewComponent
}];

export default Routes;