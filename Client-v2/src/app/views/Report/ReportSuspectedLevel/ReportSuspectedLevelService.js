import axios from "axios";
import ConstantList from "../../../appConfig";
let path = "/api/familyMember";
export const getDashboardAnalytics = (searchobject) => {
    return axios.post(ConstantList.API_ENPOINT + "/api/dashboard/analytics", searchobject);
};
export const reportByAdminUnit = (communeId, quarterId, townId, groupByType) => {
    var url = ConstantList.API_ENPOINT + path +"/reportByAdminUnit"
    +"/"+communeId
    +"/"+quarterId
    +"/"+townId
    +"/"+groupByType;
    return axios.get(url);
};
export const getListPatientByAdminUnit = (suspectedLevel, communeId, quarterId, townId) => {
    var url = ConstantList.API_ENPOINT + path +"/getListPatientByAdminUnit"
    +"/"+suspectedLevel
    +"/"+communeId
    +"/"+quarterId
    +"/"+townId;
    return axios.get(url);
};