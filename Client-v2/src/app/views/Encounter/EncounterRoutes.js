import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { withTranslation } from 'react-i18next';
const EncounterRecord = EgretLoadable({
    loader: () =>
        import ("./EncounterRecord")
});
const ViewComponent = withTranslation()(EncounterRecord);

const CreateEncounter = EgretLoadable({
    loader: () =>
        import ("./CreateEncounter")
});
const ViewComponentCreate = withTranslation()(CreateEncounter);

const encounterRoutes = [
    {
        path: ConstantList.ROOT_PATH + "encounter-record",
        exact: true,
        component: ViewComponent
    },
    {
        path: ConstantList.ROOT_PATH + "encounter/create",
        exact: true,
        component: ViewComponentCreate
    },
    {
        path: ConstantList.ROOT_PATH + "encounter/create/(id)?/:id?/(page)?/:page?/(pageSize)?/:pageSize?",
        exact: true,
        component: ViewComponentCreate
    }

];

export default encounterRoutes;