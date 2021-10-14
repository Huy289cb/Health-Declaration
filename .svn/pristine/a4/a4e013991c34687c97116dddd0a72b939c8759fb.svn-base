import { EgretLoadable } from "egret";
import ConstantList from "../../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const ReportSuspectedLevel = EgretLoadable({
  loader: () => import("./ReportSuspectedLevel")
});

const ViewComponent = withTranslation()(ReportSuspectedLevel);

const ReportSuspectedLevelRouter = [
  {
    path:  ConstantList.ROOT_PATH+"report/report-suspected-level",
    exact: true,
    component: ViewComponent
  }
];

export default ReportSuspectedLevelRouter;
