import axios from "axios";
import ConstantList from "../../appConfig";

var path = "/api/background_disease";

export const searchByPage = (searchDto) => {
    var url = ConstantList.API_ENPOINT + path + "/searchByDto";
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

export const checkCode = (id, code) => {
    const config = { params: { id: id, code: code } };
    var url = ConstantList.API_ENPOINT + path + "/checkCode";
    return axios.get(url, config);
};

export const getById = id => {
    var url = ConstantList.API_ENPOINT + path + "/" + id;
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
export const addNew = bd => {
    return axios.post(ConstantList.API_ENPOINT + path, bd);
};
export const update = bd => {

    return axios.put(ConstantList.API_ENPOINT + path + "/" + bd.id, bd);
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