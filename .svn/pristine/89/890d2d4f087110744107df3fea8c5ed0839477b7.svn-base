import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const BackgroundDiseaseTable = EgretLoadable({
    loader: () =>
        import ("./BackgroundDiseaseTable")
});

const ViewComponent = withTranslation()(BackgroundDiseaseTable);

const backgroundDiseaseRoutes = [{
    path: ConstantList.ROOT_PATH + "background-disease",
    exact: true,
    component: ViewComponent
}];

export default backgroundDiseaseRoutes;