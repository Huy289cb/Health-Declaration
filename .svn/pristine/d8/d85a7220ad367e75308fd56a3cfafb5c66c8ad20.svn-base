import axios from "axios";
import ConstantList from "../../appConfig";

var path = "/api/familyMember";
export const searchByDto = (searchDto) => {
  var url = ConstantList.API_ENPOINT + path + "/searchByDto" ;
  return axios.post(url, searchDto);
};

export const checkDuplicate = (searchDto) => {
  var url = ConstantList.API_ENPOINT + path + "/checkDuplicate" ;
  return axios.post(url, searchDto);
};

export const deleteItem = id => {
  return axios.delete(ConstantList.API_ENPOINT + path + "/" + id);
};

export const getById = id => {
  var url = ConstantList.API_ENPOINT + path+ "/" + id;
  return axios.get(url);
};
export const saveOrUpdate = dto => {
  if (dto.id) {
    return axios.put(ConstantList.API_ENPOINT + path + "/" + dto.id, dto);
  }
  else{
    return axios.post(ConstantList.API_ENPOINT + path, dto);
  }
};