import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { withTranslation } from 'react-i18next';
const PersonalHealthRecord = EgretLoadable({
    loader: () =>
        import ("./PersonalHealthRecord")
});
const ViewComponent = withTranslation()(PersonalHealthRecord);

const Create = EgretLoadable({
    loader: () =>
        import ("./Create")
});
const ViewComponentCreate = withTranslation()(Create);

const PersonalHealthRecordRoutes = [
    {
        path: ConstantList.ROOT_PATH + "health-record",
        exact: true,
        component: ViewComponent
    },
    {
        path: ConstantList.ROOT_PATH + "create-health-record",
        exact: true,
        component: ViewComponentCreate
    },
    {
        path: ConstantList.ROOT_PATH + "create-health-record/(id)?/:id?/(page)?/:page?/(pageSize)?/:pageSize?",
        exact: true,
        component: ViewComponentCreate
    }

];

export default PersonalHealthRecordRoutes;