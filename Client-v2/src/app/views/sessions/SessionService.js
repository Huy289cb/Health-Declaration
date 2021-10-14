import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH = ConstantList.API_ENPOINT + "/public/user/";
const PUBLIC_PATH = ConstantList.API_ENPOINT + "/public/";

export const signUpAccount = item => {
  var url = API_PATH + "register";
  return axios.post(url, item);
};

export const checkEmail = item => {
  var url = API_PATH + "checkEmail";
  return axios.post(url, item);
};

//lấy mã hộ gia đình
export const getNewCode = () => {
  var url = PUBLIC_PATH + "family/getNewCode";
  return axios.get(url);
};

export const checkDuplicate = (id, code, phoneNumber) => {
  const config = { params: { id: id, code: code, phoneNumber: phoneNumber } };
  var url = PUBLIC_PATH + "family/checkDuplicate";
  return axios.get(url, config);
};

export const register = item => {
  var url = PUBLIC_PATH + "register";
  return axios.post(url, item);
};

export const resendOtpRegister = phoneNumber => {
  var url = PUBLIC_PATH + "resendOtpRegister";
  return axios.get(url, {
    params: {
      phoneNumber
    }
  })
};

export const createFamily = item => {
  var url = PUBLIC_PATH + "createFamily";
  return axios.post(url, item);
};

//địa chỉ
export const getByPageByParentId = (searchDto) => {
  var url = PUBLIC_PATH + "administrativeUnit/searchByDto";
  if (searchDto == null) {
    searchDto.pageSize = 0;
  }
  return axios.post(url, searchDto);
};

export const checkUserName = phoneNumber => {
  var url = PUBLIC_PATH + "checkUserName";
  return axios.get(url, {
    params: {
      phoneNumber
    }
  })
};

export const checkOTP = obj => {
  var url = PUBLIC_PATH + "checkOTP";
  return axios.post(url, obj);
};

export const changeForgotPassword = obj => {
  var url = PUBLIC_PATH + "changeForgotPassword";
  return axios.post(url, obj);
};