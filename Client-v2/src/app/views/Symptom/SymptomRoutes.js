import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const SymptomTable = EgretLoadable({
    loader: () =>
        import ("./SymptomTable")
});

const ViewComponent = withTranslation()(SymptomTable);

const symptomRoutes = [{
    path: ConstantList.ROOT_PATH + "symptom",
    exact: true,
    component: ViewComponent
}];

export default symptomRoutes;