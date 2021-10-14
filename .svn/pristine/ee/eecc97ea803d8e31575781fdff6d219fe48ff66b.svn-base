import axios from "axios";
import ConstantList from "../../appConfig";

var path = "/api/health-organization";

export const searchByPage = (searchDto) => {
    var url = ConstantList.API_ENPOINT + path + "/searchByDto";
    return axios.post(url, searchDto);
};

export const checkCode = (id, code) => {
    const config = { params: { id: id, code: code} };
    var url = ConstantList.API_ENPOINT + path + "/checkCode";
    return axios.get(url, config);
};

export const getById = id => {
    var url = ConstantList.API_ENPOINT + path + "/" + id;
    return axios.get(url);
};

export const deleteById = id => {
    return axios.delete(ConstantList.API_ENPOINT + path + "/" + id);
};

export const addNew = obj => {
    return axios.post(ConstantList.API_ENPOINT + path, obj);
};

export const update = obj => {
    return axios.put(ConstantList.API_ENPOINT + path + "/" + obj.id, obj);
};
