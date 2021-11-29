import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH = ConstantList.API_ENPOINT + "/api/practitioner";

export const searchByDto = (dto) => {
    var params = "/searchByDto";
    var url = API_PATH + params;
    return axios.post(url, dto);
};

export const savePractitionerOrg = item => {
    if (item.id) {
        return axios.put(API_PATH + "/" + item.id, item);
    } else {
        return axios.post(API_PATH, item);
    }
};

export const getById = id => {
    var url = API_PATH + "/" + id;
    return axios.get(url);
};
export const getAllOrgByUserId = id => {
    var url = API_PATH + "/getAllOrgByUserId/" + id;
    return axios.get(url);
};

export const getAllInfoByUserLogin = () => {
    var url = API_PATH + "/getAllInfoByUserLogin";
    return axios.get(url);
};

export const getRoleUser = () => {
    var url = API_PATH + "/getRoleUser";
    return axios.get(url);
};

export const changeCodeStatus = () => {
    var url = API_PATH + "/changeCodeStatus";
    return axios.get(url);
};


export const searchByPage = (searchDto) => {
    var url = API_PATH + "/searchByDto";
    return axios.post(url, searchDto);
};

export const findUserByUserName = (username, page, pageSize) => {
    var params = "username/" + username + "/" + page + "/" + pageSize;
    var url = API_PATH + params;
    return axios.get(url);
};

export const getItemById = id => {
    var url = API_PATH + id;
    return axios.get(url);
};

export const checkDuplicateUserName = (id, username) => {
    const config = { params: { id: id, username: username } };
    var url = API_PATH + "/checkDuplicateUserName";
    return axios.get(url, config);
};

export const getUserByEmail = (email) => {
    const config = { params: { email: email } };
    var url = API_PATH + "/getUserByEmail";
    return axios.get(url, config);
};

export const deleteItem = id => {
    return axios.delete(API_PATH + "/" + id);
};