import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  DialogTitle,
  DialogContent,
  FormControlLabel,
  Checkbox,
  DialogActions,
  Icon,
  IconButton
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { getAllBasicInEdit, addNew, update, checkDuplicate } from "./Service";
import InputAdornment from "@material-ui/core/InputAdornment";
import Draggable from 'react-draggable';
import Paper from '@material-ui/core/Paper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SaveIcon from '@material-ui/icons/Save';
import BlockIcon from '@material-ui/icons/Block';
import Autocomplete from "@material-ui/lab/Autocomplete";
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import {
  getByPageByParentId as getAdministrativeUnitByPage,
  getUserById as getAdministrativeUnitById,
  searchByPage as getAdministrativeUnit
} from "../AdministrativeUnit/AdministrativeUnitService";
import "styles/globitsStyles.css";
// import AdministrativeUnitForm from './AdministrativeUnitForm';

toast.configure({
  autoClose: 1000,
  draggable: false,
  limit: 3
});

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

class EditorDialog extends Component {
  state = {
    isAddNew: false,
    id: null,
    name: "",
    code: "",
    level: 0,
    changePass: true,
    provinceOfResidenceSearch: {
      pageIndex: 0,
      pageSize: 10000000,
      isGetAllCity: true,
    },
    provinceOfResidence: null,
    districtOfResidence: null,
    districtOfResidenceSearch: {},
    wardOfResidenceSearch: {},
    wardOfResidence: null,
    residentialArea: null,
    residentialAreaSearch: {},
    administrativeUnit: null,
    hamletOfResidenceSearch: {},
  };
  validateSDT = (sdt) => {
    var cm = /^0[0-9]{9,10}$/
    if (sdt.match(cm)) {
      return true
    } else {
      return false;
    }
  }
  handleChange = (event, source) => {
    event.persist();
    if (source === "switch") {
      this.setState({ isActive: event.target.checked });
      return;
    }
    if (source === "changePass") {
      this.setState({ changePass: event.target.checked });
      return;
    }
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleFormSubmit = async () => {
    // await this.openCircularProgress();
    let { id } = this.state;
    let { t } = this.props;
    let obj = {}
    obj.id = id;
    obj.code = this.state.code;
    obj.name = this.state.name;
    obj.age = this.state.age;
    obj.phoneNumber = this.state.phoneNumber;
    obj.password = this.state.password;
    obj.detailAddress = this.state.detailAddress;
    obj.email = this.state.email;
    obj.familyMembers = this.state.familyMembers;
    if (this.state.administrativeUnit) {
      obj.administrativeUnit = { id: this.state.administrativeUnit.id };
    }

    if (this.state.phoneNumber != null && this.validateSDT(this.state.phoneNumber) == false) {
      toast.warning("Số điện thoại không hợp lệ");
    } else {
      //check code và phone number
      checkDuplicate(id, obj.code, obj.phoneNumber).then((result) => {
        //Nếu trả về true là code hoặc sđt đã được sử dụng
        if (result.data) {
          toast.warning('Mã hoặc số điện thoại đã được sử dụng, vui lòng thử lại.');
          this.setState({ loading: false });
        } else {
          if (id) {
            update(obj).then(() => {
              toast.success(t('toast.update_success'));
              this.setState({ loading: false })
              this.props.handleClose()
            });
          } else {
            addNew(obj).then((response) => {
              if (response.data != null && response.status === 200) {
                this.state.id = response.data.id
                this.setState({ ...this.state, loading: false })
                toast.success(t('toast.add_success'));
                this.props.handleClose()
              }
            });
          }
        }
      });
    }
  };
  handleSelectdministrativeUnit = (value, source) => {
    //thành phố
    if ("provinceOfResidence" == source) {
      this.setState({ provinceOfResidence: value });

      if (value != null) {
        this.setState({
          districtOfResidenceSearch: {
            pageIndex: 0,
            pageSize: 10000000,
            parentId: value.id,
          },
          districtOfResidence: null,
          wardOfResidence: null,
          residentialArea: null,
          administrativeUnit: null,
        });
      } else {
        this.setState({ districtOfResidence: null });
        this.setState({ wardOfResidence: null });
        this.setState({ administrativeUnit: null });
        this.setState({
          districtOfResidenceSearch: { pageIndex: 0, pageSize: 10000000 },
        });
        this.setState({
          wardOfResidenceSearch: { pageIndex: 0, pageSize: 10000000 },
        });
        this.setState({
          residentialAreaSearch: { pageIndex: 0, pageSize: 10000000 }
        })
        this.setState({
          hamletOfResidenceSearch: { pageIndex: 0, pageSize: 10000000 },
        });
      }
    }
    //quận
    if ("districtOfResidence" == source) {
      this.setState({ districtOfResidence: value });
      if (value != null) {
        this.setState({
          wardOfResidenceSearch: {
            pageIndex: 0,
            pageSize: 10000000,
            parentId: value.id,
          },
          wardOfResidence: null,
        });
      } else {
        this.setState({ wardOfResidence: null, residentialArea: null, administrativeUnit: null });
        this.setState({
          wardOfResidenceSearch: { pageIndex: 0, pageSize: 10000000 },
        });
      }
    }
    //phường
    if ("wardOfResidence" == source) {
      this.setState({ wardOfResidence: value });
      if (value != null) {
        this.setState({
          residentialAreaSearch: {
            pageIndex: 0,
            pageSize: 10000000,
            parentId: value.id,
          },
          residentialArea: null,
          administrativeUnit: null,
        });
      } else {
        this.setState({ residentialArea: null, administrativeUnit: null });
        this.setState({
          residentialAreaSearch: { pageIndex: 0, pageSize: 10000000 }
        });
      }
    }
    //khu phố
    if ("residentialArea" == source) {
      this.setState({ residentialArea: value });
      if (value != null) {
        this.setState({
          hamletOfResidenceSearch: {
            pageIndex: 0,
            pageSize: 10000000,
            parentId: value.id,
          },
          administrativeUnit: null,
        });
      } else {
        this.setState({ administrativeUnit: null });
        this.setState({
          hamletOfResidenceSearch: { pageIndex: 0, pageSize: 10000000 }
        });
      }
    }
    //tổ dân phố
    if ("administrativeUnit" == source) {
      this.setState({ administrativeUnit: value });
    }
  };

  componentDidMount() {
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      if (value !== this.state.password) {
        return false;
      }
      return true;
    });
  }

  componentWillUnmount() {
    ValidatorForm.removeValidationRule('isPasswordMatch');
  }

  componentWillMount() {
    let { open, handleClose, item, isUser } = this.props;
    let { provinceOfResidence, districtOfResidence, residentialArea, wardOfResidence, provinceOfResidenceSearch } = this.state;
    if (item && item.administrativeUnit) {
      if (item.administrativeUnit.parent) {
        residentialArea = item.administrativeUnit.parent;
        if (residentialArea.parent) {
          wardOfResidence = residentialArea.parent;
          if (wardOfResidence.parent) {
            districtOfResidence = wardOfResidence.parent;
            if (districtOfResidence.parent) {
              provinceOfResidence = districtOfResidence.parent;
            }
          }
        }
      }
    }
    if (provinceOfResidence) {
      this.handleSelectdministrativeUnit(provinceOfResidence, "provinceOfResidence")
      if (districtOfResidence) {
        this.handleSelectdministrativeUnit(districtOfResidence, "districtOfResidence")
        if (wardOfResidence) {
          this.handleSelectdministrativeUnit(wardOfResidence, "wardOfResidence")
          if (residentialArea) {
            this.handleSelectdministrativeUnit(residentialArea, "residentialArea")
          }
        }
      }
    }
    else {
      getAdministrativeUnitByPage(provinceOfResidenceSearch).then(({ data }) => {
        if (data && data.content) {
          provinceOfResidence = data.content.find((element) => element.name === "Hồ Chí Minh")
          if (provinceOfResidence) {
            this.handleSelectdministrativeUnit(provinceOfResidence, "provinceOfResidence");
            if (provinceOfResidence.subAdministrativeUnitsDto && provinceOfResidence.subAdministrativeUnitsDto.length > 0) {
              districtOfResidence = provinceOfResidence.subAdministrativeUnitsDto.find((element) => element.name === "Quận 7")
              this.handleSelectdministrativeUnit(districtOfResidence, "districtOfResidence");
            }
          }
        }
      })
    }

    if (!item.id) {
      this.setState({ isAddNew: true });
    }
    this.setState({ ...item });
  }

  render() {
    let { open, handleClose, handleOKEditClose, t, i18n, readOnly, isUser } = this.props;
    let {
      id,
      name,
      code,
      phoneNumber,
      age,
      password,
      isAddNew,
      confirmPassword,
      detailAddress,
      districtOfResidence,
      wardOfResidence,
      wardOfResidenceSearch,
      administrativeUnit,
      hamletOfResidenceSearch,
      provinceOfResidence,
      provinceOfResidenceSearch,
      districtOfResidenceSearch,
      familyMembers,
      residentialArea,
      residentialAreaSearch,
      email,
      changePass
    } = this.state;
    return (
      <Dialog

        open={open}
        PaperComponent={PaperComponent}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
        // className="dialog-header bgc-primary-d1"
        // style={{ cursor: 'move' }}
        // id="draggable-dialog-title"
        >
          <span className="mb-20" > {(readOnly ? 'Thông tin' : (id ? t("general.button.edit") : t("general.button.add"))) + " " + t("hộ gia đình")} </span>
          <IconButton style={{ position: "absolute", right: "5px", top: "5px" }} onClick={() => handleClose()}>
            <Icon color="error" title={t("general.button.close")}>close</Icon>
          </IconButton>
        </DialogTitle>

        <ValidatorForm ref="form" onSubmit={this.handleFormSubmit} style={{
          overflowY: "auto",
          display: "flex",
          flexDirection: "column"
        }}>
          <div className="">
            <DialogContent className="o-hidden">
              <Grid container spacing={2}>
                {/* {!isUser &&
                  <Grid item md={6} sm={12} xs={12}>
                    <TextValidator
                      className="w-100"
                      label={<span className="font">
                        <span style={{ color: "red" }}> *</span>
                        {t('Mã gia đình')}
                      </span>
                      }
                      // onChange={this.handleChange}
                      type="text"
                      name="code"
                      value={code}
                      validators={["required"]}
                      errorMessages={[t("general.errorMessages_required")]}
                      variant="outlined"
                      size="small"
                      disabled
                    />
                  </Grid>
                } */}
                <Grid item md={6} sm={12} xs={12}>
                  <TextValidator
                    disabled={readOnly}
                    className="w-100"
                    label={<span className="font">
                      <span style={{ color: "red" }}> *</span>
                      Họ và tên chủ hộ
                    </span>
                    }
                    onChange={this.handleChange}
                    type="text"
                    name="name"
                    value={name}
                    validators={["required"]}
                    errorMessages={[t("general.errorMessages_required")]}
                    variant="outlined"
                    size="small"
                  />
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  <TextValidator
                    disabled={readOnly}
                    className="w-100"
                    label={<span className="font">
                      <span style={{ color: "red" }}> *</span>
                      {t('Tuổi')}
                    </span>
                    }
                    onChange={this.handleChange}
                    type="number"
                    name="age"
                    value={age}
                    validators={["required"]}
                    errorMessages={[t("general.errorMessages_required")]}
                    variant="outlined"
                    size="small"
                  />
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  <TextValidator
                    disabled={readOnly}
                    className="w-100"
                    label={<span className="font">
                      <span style={{ color: "red" }}> *</span>
                      {t('SĐT')}
                    </span>
                    }
                    onChange={this.handleChange}
                    type="text"
                    name="phoneNumber"
                    value={phoneNumber}
                    validators={["required"]}
                    errorMessages={[t("general.errorMessages_required")]}
                    variant="outlined"
                    size="small"
                   
                  />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <TextValidator
                    disabled={readOnly}
                    className="w-100"
                    label={
                      <span className="font">
                        Địa chỉ email
                      </span>
                    }
                    onChange={this.handleChange}
                    type="text"
                    name="email"
                    value={email ? email : ''}
                    validators={['isEmail']}
                    errorMessages={['Địa chỉ email không hợp lệ']}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                {isAddNew != null && isAddNew == true && (
                  <Grid item md={3} sm={12} sm={12}>
                    <TextValidator
                      disabled={readOnly}
                      className="w-100"
                      label={
                        <span className="font">
                          <span style={{ color: "red" }}>*</span>
                          {t("user.password")}
                        </span>
                      }
                      variant="outlined"
                      size="small"
                      onChange={this.handleChange}
                      name="password"
                      type="password"
                      value={password}
                      validators={["required", "matchRegexp:([A-Za-z0-9]{6,})"]}
                      errorMessages={[
                        t("general.errorMessages_required"),
                        t("user.password_message"),
                      ]}
                    />
                  </Grid>)}
                {isAddNew != null && isAddNew == true && (
                  <Grid item md={3} sm={12} sm={12}>
                    <TextValidator
                      disabled={readOnly}
                      className="w-100"
                      label={
                        <span className="font">
                          <span style={{ color: "red" }}>*</span>
                          {t("user.re_password")}
                        </span>
                      }
                      variant="outlined"
                      size="small"
                      onChange={this.handleChange}
                      name="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      validators={["required", "isPasswordMatch"]}
                      errorMessages={[
                        t("general.errorMessages_required"),
                        t("user.password_match_message"),
                      ]}
                    />
                  </Grid>
                )}
                {/* Đơn vị hành chính */}
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  {!readOnly && <AsynchronousAutocomplete
                    label={
                      <span className="font">
                        <span style={{ color: "red" }}> * </span>
                        {t("Tỉnh/Thành Phố")}
                      </span>
                    }
                    searchFunction={getAdministrativeUnitByPage}
                    searchObject={provinceOfResidenceSearch}
                    value={provinceOfResidence ? provinceOfResidence : null}
                    multiple={false}
                    defaultValue={
                      provinceOfResidence ? provinceOfResidence : null
                    }
                    displayLable={"name"}
                    className="w-100"
                    validators={["required"]}
                    errorMessages={[t("general.errorMessages_required")]}
                    onSelect={(value) => {
                      this.handleSelectdministrativeUnit(
                        value,
                        "provinceOfResidence"
                      );
                    }}
                    variant="outlined"
                    size="small"
                  />}
                  {readOnly && <TextValidator
                    disabled={readOnly}
                    className="w-100"
                    label={
                      <span className="font">
                        <span style={{ color: "red" }}> * </span>
                        {t("Tỉnh/Thành Phố")}
                      </span>
                    }
                    variant="outlined"
                    size="small"
                    name="provinceOfResidence"
                    type="text"
                    value={provinceOfResidence ? (provinceOfResidence.name ? provinceOfResidence.name : '') : ''}
                  />}
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  {!readOnly && <AsynchronousAutocomplete
                    disabled={readOnly}
                    label={
                      <span className="font">
                        <span style={{ color: "red" }}> * </span>
                        {t("Quận huyện")}
                      </span>
                    }
                    searchFunction={getAdministrativeUnitByPage}
                    searchObject={districtOfResidenceSearch}
                    value={districtOfResidence ? districtOfResidence : null}
                    multiple={false}
                    defaultValue={
                      districtOfResidence ? districtOfResidence : null
                    }
                    displayLable={"name"}
                    className="w-100"
                    validators={["required"]}
                    errorMessages={[t("general.errorMessages_required")]}
                    onSelect={(value) => {
                      this.handleSelectdministrativeUnit(
                        value,
                        "districtOfResidence"
                      );
                    }}
                    variant="outlined"
                    size="small"
                  />}
                  {readOnly && <TextValidator
                    disabled={readOnly}
                    className="w-100"
                    label={
                      <span className="font">
                        <span style={{ color: "red" }}> * </span>
                        {t("Quận huyện")}
                      </span>
                    }
                    variant="outlined"
                    size="small"
                    name="districtOfResidence"
                    type="text"
                    value={districtOfResidence ? (districtOfResidence.name ? districtOfResidence.name : '') : ''}
                  />}
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  {!readOnly && <AsynchronousAutocomplete
                    disabled={readOnly}
                    label={
                      <span className="font">
                        <span style={{ color: "red" }}> * </span>
                        {t("Xã/Phường")}
                      </span>
                    }
                    searchFunction={getAdministrativeUnitByPage}
                    searchObject={wardOfResidenceSearch}
                    value={wardOfResidence ? wardOfResidence : null}
                    multiple={false}
                    defaultValue={wardOfResidence ? wardOfResidence : null}
                    displayLable={"name"}
                    className="w-100"
                    validators={["required"]}
                    errorMessages={[t("general.errorMessages_required")]}
                    onSelect={(value) => {
                      this.handleSelectdministrativeUnit(
                        value,
                        "wardOfResidence"
                      );
                    }}
                    variant="outlined"
                    size="small"
                  />}
                  {readOnly && <TextValidator
                    disabled={readOnly}
                    className="w-100"
                    label={
                      <span className="font">
                        <span style={{ color: "red" }}> * </span>
                        {t("Xã/Phường")}
                      </span>
                    }
                    variant="outlined"
                    size="small"
                    name="wardOfResidence"
                    type="text"
                    value={wardOfResidence ? (wardOfResidence.name ? wardOfResidence.name : '') : ''}
                  />}
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  {!readOnly && <AsynchronousAutocomplete
                    disabled={readOnly}
                    label={
                      <span className="font">
                        <span style={{ color: "red" }}> * </span>
                        {t("Khu phố")}
                      </span>
                    }
                    searchFunction={getAdministrativeUnitByPage}
                    searchObject={residentialAreaSearch}
                    value={residentialArea ? residentialArea : null}
                    multiple={false}
                    defaultValue={residentialArea ? residentialArea : null}
                    displayLable={"name"}
                    className="w-100"
                    validators={["required"]}
                    errorMessages={[t("general.errorMessages_required")]}
                    onSelect={(value) => {
                      this.handleSelectdministrativeUnit(
                        value,
                        "residentialArea"
                      );
                    }}
                    variant="outlined"
                    size="small"
                  />}
                  {readOnly && <TextValidator
                    disabled={readOnly}
                    className="w-100"
                    label={
                      <span className="font">
                        <span style={{ color: "red" }}> * </span>
                        {t("Khu phố")}
                      </span>
                    }
                    variant="outlined"
                    size="small"
                    name="residentialArea"
                    type="text"
                    value={residentialArea ? (residentialArea.name ? residentialArea.name : '') : ''}
                  />}
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  {!readOnly && <AsynchronousAutocomplete
                    disabled={readOnly}
                    label={
                      <span className="font">
                        <span style={{ color: "red" }}> * </span>
                        {t("Tổ")}
                      </span>
                    }
                    searchFunction={getAdministrativeUnitByPage}
                    searchObject={hamletOfResidenceSearch}
                    value={administrativeUnit ? administrativeUnit : null}
                    multiple={false}
                    defaultValue={administrativeUnit ? administrativeUnit : null}
                    displayLable={"name"}
                    className="w-100"
                    validators={["required"]}
                    errorMessages={[t("general.errorMessages_required")]}
                    onSelect={(value) => {
                      this.handleSelectdministrativeUnit(
                        value,
                        "administrativeUnit"
                      );
                    }}
                    variant="outlined"
                    size="small"
                  />}
                  {readOnly && <TextValidator
                    disabled={readOnly}
                    className="w-100"
                    label={
                      <span className="font">
                        <span style={{ color: "red" }}> * </span>
                        {t("Tổ")}
                      </span>
                    }
                    variant="outlined"
                    size="small"
                    name="administrativeUnit"
                    type="text"
                    value={administrativeUnit ? (administrativeUnit.name ? administrativeUnit.name : '') : ''}
                  />}
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <TextValidator
                    disabled={readOnly}
                    className="w-100 mb-16"
                    label={<span className="font">
                      <span style={{ color: "red" }}> *</span>
                      {t('Địa chỉ chi tiết')}
                    </span>
                    }
                    multiline
                    rowsMax={4}
                    onChange={this.handleChange}
                    type="text"
                    name="detailAddress"
                    value={detailAddress}
                    validators={["required"]}
                    errorMessages={[t("general.errorMessages_required")]}
                    variant="outlined"
                    size="small"
                  />
                </Grid>

                {familyMembers && <Grid item xs={12}>
                  <fieldset className="member_table--wrapper">
                    <legend>Danh sách thành viên</legend>
                    <table className="member_table" border={1} style={{ 'width': '100%', overflow: 'auto' }}>
                      <tr>
                        <th>STT</th>
                        <th>Họ tên</th>
                        <th>Tuổi</th>
                        <th>Điện thoại</th>
                      </tr>
                      {familyMembers && (familyMembers).map((element, index) => {
                        if (element.member) {
                          return (
                            <tr>
                              <td>{index + 1}</td>
                              <td>{element.member.displayName}</td>
                              <td>{element.member.age}</td>
                              <td>{element.member.phoneNumber}</td>
                            </tr>
                          )
                        }
                      })}
                    </table>
                  </fieldset>

                </Grid>}
              </Grid>
            </DialogContent>
          </div>
          <DialogActions spacing={4} className="flex flex-end flex-middle">
            <Button
              startIcon={<BlockIcon />}
              variant="contained"
              className="mr-12 btn btn-secondary d-inline-flex"
              color="secondary"
              onClick={() => handleClose()}
            >
              Huỷ
            </Button>
            {!readOnly &&
              <Button
                startIcon={<SaveIcon />}
                className="mr-12 btn btn-primary-d d-inline-flex"
                variant="contained"
                color="primary"
                type="submit">
                Lưu
              </Button>}
          </DialogActions>
        </ValidatorForm>

      </Dialog >
    );
  }
}

export default EditorDialog;
