import axios from "axios";
import ConstantList from "../../appConfig";

var path = "/api/practitionerAndFamily";
var pathFamily = "/api/family";

export const countFamilyMemberByPractitionerId = (id) => {
    var url = ConstantList.API_ENPOINT + path + "/countFamilyMemberByPractitionerId/" + id;
    return axios.get(url);
};

export const searchByPage = (searchDto) => {
    var url = ConstantList.API_ENPOINT + path + "/searchByDto";
    return axios.post(url, searchDto);
};

export const searchByPageFamily = (searchDto) => {
    var url = ConstantList.API_ENPOINT + pathFamily + "/searchByDto";
    return axios.post(url, searchDto);
};

export const getByPageByParentId = (searchDto) => {
    if (searchDto.parentId != null || searchDto.isGetAllCity) {
        var url = ConstantList.API_ENPOINT + path + "/searchByDto";
        return axios.post(url, searchDto);
    }
    searchDto.pageSize = 0;
    return axios.post(url, searchDto);
};

export const checkDuplicate = (id, code, phoneNumber) => {
    const config = { params: { id: id, code: code, phoneNumber: phoneNumber } };
    var url = ConstantList.API_ENPOINT + path + "/checkDuplicate";
    return axios.get(url, config);
};

export const getById = id => {
    var url = ConstantList.API_ENPOINT + path + "/" + id;
    return axios.get(url);
};
export const getNewCode = () => {
    var url = ConstantList.API_ENPOINT + path + "/getNewCode";
    return axios.get(url);
};

export const getAllBasicInEdit = (id) => {
    var url = ConstantList.API_ENPOINT + path + "/getAllBasicInEdit";
    if (id) {
        url += "/" + id;
    }
    return axios.get(url);
};
export const deleteItem = id => {
    return axios.delete(ConstantList.API_ENPOINT + path + "/" + id);
};
export const addNew = symptom => {
    return axios.post(ConstantList.API_ENPOINT + path, symptom);
};
export const update = symptom => {

    return axios.put(ConstantList.API_ENPOINT + path + "/" + symptom.id, symptom);
};
export const getByRoot = () => {
    var url = ConstantList.API_ENPOINT + path + "/getByRoot";
    return axios.get(url);
};
export const getAllChildByParentId = (id) => {
    var url = ConstantList.API_ENPOINT + path + "/getAllChildByParentId/" + id;
    return axios.get(url);
};
export const getItemAndChildById = (parentId) => {
    var url = ConstantList.API_ENPOINT + path + "/getItemAndChildById/" + parentId;
    return axios.get(url);
};

export const getAllInfoByUserLogin = () => {
    var url = ConstantList.API_ENPOINT + path + "/getAllInfoByUserLogin";
    return axios.get(url);
};

export const getFamilyByUserLogin = () => {
    var url = ConstantList.API_ENPOINT + path + "/getFamilyByUserLogin";
    return axios.get(url);
};

export const assignmentById = (familyId, practitionerId, type) => {
    var url = ConstantList.API_ENPOINT + path + "/assignment/" + familyId + "/" + practitionerId + "/" + type;
    return axios.get(url);
}

export const updateListFamily = dto => {
    return axios.post(ConstantList.API_ENPOINT + path + "/updateListFamily", dto);
};
