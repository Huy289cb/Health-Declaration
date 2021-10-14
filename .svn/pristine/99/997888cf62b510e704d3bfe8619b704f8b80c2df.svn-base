import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const PractitionerAndFamily = EgretLoadable({
    loader: () =>
        import ("./PractitionerAndFamily")
});

const ViewComponent = withTranslation()(PractitionerAndFamily);

const PractitionerAndFamilyRoutes = [{
    path: ConstantList.ROOT_PATH + "practitionerAndFamily",
    exact: true,
    component: ViewComponent
}];

export default PractitionerAndFamilyRoutes;