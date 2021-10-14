import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const HealthCareGroupTable = EgretLoadable({
    loader: () =>
        import ("./HealthCareGroupTable")
});

const ViewComponent = withTranslation()(HealthCareGroupTable);

const healthCareGroupRoutes = [{
    path: ConstantList.ROOT_PATH + "health-care-group",
    exact: true,
    component: ViewComponent
}];

export default healthCareGroupRoutes;