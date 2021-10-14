import axios from "axios";
import ConstantList from "../../appConfig";
let path = "/api/health-record";
export const getDashboardAnalytics = (searchobject) => {
    return axios.post(ConstantList.API_ENPOINT + "/api/dashboard/analytics", searchobject);
};
export const reportByAdminUnit = (resolveStatus, seriusStatus, communeId, quarterId, townId, residentialGroup, groupByType) => {
    var url = ConstantList.API_ENPOINT + path +"/reportByAdminUnit"
    +"/"+resolveStatus
    +"/"+seriusStatus
    +"/"+communeId
    +"/"+quarterId
    +"/"+townId
    +"/"+residentialGroup
    +"/"+groupByType;
    return axios.get(url);
};
export const getListPatientByAdminUnit = (resolveStatus, seriusStatus, seriousLevel, communeId, quarterId, townId, residentialGroup) => {
    var url = ConstantList.API_ENPOINT + path +"/getListPatientByAdminUnit"
    +"/"+resolveStatus
    +"/"+seriusStatus
    +"/"+seriousLevel
    +"/"+communeId
    +"/"+quarterId
    +"/"+townId
    +"/"+residentialGroup;
    return axios.get(url);
};