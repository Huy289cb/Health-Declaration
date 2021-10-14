import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { withTranslation } from 'react-i18next';
const Tutorial = EgretLoadable({
    loader: () =>
        import ("./Tutorial")
});

const ViewComponent = withTranslation()(Tutorial);

const SPO2Tutorial = EgretLoadable({
    loader: () =>
        import ("./SPO2Tutorial")
});

const ViewComponentSPO2 = withTranslation()(SPO2Tutorial);

const TutorialRoutes = [
    {
        path: ConstantList.ROOT_PATH + "tutorial",
        exact: true,
        component: ViewComponent
    },
    {
        path: ConstantList.ROOT_PATH + "spo2-tutorial",
        exact: true,
        component: ViewComponentSPO2
    }
];

export default TutorialRoutes;