import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  Icon,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import UserRoles from "app/services/UserRoles";
import React, { Component } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import {
  getByPageByParentId as getAdministrativeUnitByPage,
  getById as getAdministrativeUnitById,
} from "../AdministrativeUnit/AdministrativeUnitService";
import { searchByPage as getHealthCare } from "../HealthCareGroup/HealthCareGroupService";
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import SelectHealthtCarePopup from "../HealthCareGroup/SelectHealthtCarePopup";
import {
  getAllRoles,
  getRoleUser,
  getUserByUsername,
  saveUserOrg,
} from "./UserService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SaveIcon from '@material-ui/icons/Save';
import BlockIcon from '@material-ui/icons/Block';

toast.configure({
  autoClose: 2000,
  draggable: false,
  limit: 3,
});
class UserEditorDialog extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    isAddNew: false,
    listRole: [],
    roles: [],
    active: true,
    email: "",
    person: {},
    username: "",
    org: {},
    changePass: true,
    password: "",
    confirmPassword: "",
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
    isCodeStatus: true,
    shouldOpenSelectHealthCareGroupPopup: false
  };

  listGender = [
    { id: "M", name: "Nam" },
    { id: "F", name: "Nữ" },
    { id: "U", name: "Không rõ" },
  ];

  // userType = [
  //   { id: 'healthcareStaff', name: "Nhân viên y tế" },
  //   { id: 'doctor', name: 'Bác sĩ' }
  // ]

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
    if (source === "active") {
      this.setState({ active: event.target.checked });
      return;
    }
    if (source === "isCodeStatus") {
      this.setState({ codeStatus: event.target.checked });
      return;
    }
    if (source === "displayName") {
      let { person } = this.state;
      person = person ? person : {};
      person.displayName = event.target.value;
      this.setState({ person: person });
      return;
    }
    if (source === "gender") {
      let { person } = this.state;
      person = person ? person : {};
      person.gender = event.target.value;
      this.setState({ person: person });
      return;
    }
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  openParentPopup = (event) => {
    this.setState({ shouldOpenSelectHealthCareGroupPopup: true });
  }

  handleSelectHealthCare = (value) => {
    this.setState({ healthCareGroup: value });
    this.setState({ shouldOpenSelectHealthCareGroupPopup: false });
  }
  handleDialogClose = () => {
    this.setState({ shouldOpenSelectHealthCareGroupPopup: false })
  }
  handleFormSubmit = () => {
    let { id, user, wardOfResidence } = this.state;
    let userOrg = {};

    if (user == null) {
      user = {};
    }
    user.username = this.state.username;
    user.email = this.state.email;
    user.person = this.state.person;
    user.roles = this.state.roles;
    user.active = this.state.active;
    user.changePass = this.state.changePass;
    user.isActive = this.state.isActive;
    user.password = this.state.password;

    userOrg.user = user;
    // userOrg.userType = this.state.userType;
    userOrg.healthCareGroup = this.state.healthCareGroup;
    userOrg.org = this.state.org;
    userOrg.id = this.state.id;
    userOrg.administrativeUnit = wardOfResidence;

    getUserByUsername(this.state.username).then((data) => {
      if (data.data && data.data.id) {
        if (!user.id || (id && data.data.id != user.id)) {
          toast.warn("Tên đăng nhập đã tồn tại!");
          return;
        }
      }
      saveUserOrg(userOrg).then(() => {
        this.props.handleOKEditClose();
        if (this.state.id) {
          toast.success("Đã cập nhật tài khoản");
        } else {
          toast.success("Thêm tài khoản thành công");
        }
      }).catch(() => {
        toast.warn("Có lỗi xảy ra, vui lòng thử lại sau")
      });
    });
  };

  selectRoles = (rolesSelected) => {
    this.setState({ roles: rolesSelected }, function () { });
  };

  componentWillMount() {
    let { open, handleClose, item } = this.props;
    if (!item.id) {
      this.setState({ isAddNew: true, user: item.user });
    }
    this.setState(item);
    this.setState({ ...item.user, org: item.org }, () => {
      this.setState({ id: item.id, user: item.user, org: item.org });
    });

    if (!UserRoles.isAdmin()) {
      // getAllInfoByUserLogin().then(({ data }) => {
      //   console.log(data);
      //   let idHealthOrg = data?.userOrganization?.org?.id;
      //   this.setState({ idHealthOrg: idHealthOrg }, () => {
      //     this.getHealthCareGroup();
      //   });
      // });
      this.getAdministrativeUnit();
      getRoleUser().then(({ data }) => {
        this.setState({
          listRole: data,
        });
      });
    } else {
      this.getAdministrativeUnit();
      getAllRoles().then(({ data }) => {
        this.setState({
          listRole: data,
        });
      });
    }
  }

  getAdministrativeUnit = () => {
    let { administrativeUnit } = this.props.item;

    if (administrativeUnit) {
      getAdministrativeUnitById(administrativeUnit.id).then(({ data }) => {
        this.setState({
          wardOfResidence: administrativeUnit,
          districtOfResidence: data.parent,
          provinceOfResidence: data.parent.parent,
        });
      });
    }
  };

  componentDidMount() {
    // custom rule will have name 'isPasswordMatch'
    ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
      if (value !== this.state.password) {
        return false;
      }
      return true;
    });
  }
  selectHealthCareGroup = (event, value) => {
    this.setState({ healthCareGroup: value });
  };

  handleSelectdministrativeUnit = (value, source) => {
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
        });
      } else {
        this.setState({ districtOfResidence: null });
        this.setState({ wardOfResidence: null });
        this.setState({
          districtOfResidenceSearch: { pageIndex: 0, pageSize: 10000000 },
        });
        this.setState({
          wardOfResidenceSearch: { pageIndex: 0, pageSize: 10000000 },
        });
      }
    }
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
        this.setState({ wardOfResidence: null });
        this.setState({
          wardOfResidenceSearch: { pageIndex: 0, pageSize: 10000000 },
        });
      }
    }
    if ("wardOfResidence" == source) {
      this.setState({ wardOfResidence: value });
    }
  };

  render() {
    let { open, handleClose, handleOKEditClose, t, i18n } = this.props;
    let {
      id,
      isAddNew,
      listRole,
      roles,
      active,
      email,
      person,
      username,
      changePass,
      password,
      confirmPassword,
      provinceOfResidenceSearch,
      provinceOfResidence,
      districtOfResidence,
      districtOfResidenceSearch,
      wardOfResidenceSearch,
      wardOfResidence,
      // userType
    } = this.state;
    let searchObject = { pageIndex: 0, pageSize: 100000 };
    return (
      <Dialog open={open} maxWidth={"md"} fullWidth>
        <DialogTitle
          className="styleColor"
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
        >
          <span className="mb-20 styleColor">
            {" "}
            {(id ? t("update") : t("Add")) + " " + t("user.title")}{" "}
          </span>
          <IconButton
            style={{ position: "absolute", right: "10px", top: "10px" }}
            onClick={() => handleClose()}
          >
            <Icon color="error" title={t("close")}>
              close
            </Icon>
          </IconButton>
        </DialogTitle>
        <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
          <DialogContent
            dividers
            style={{
              overflow: "hidden",
            }}
          >
            <Grid className="" container spacing={2}>
              <Grid item sm={6} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={
                    <span className="font">
                      <span style={{ color: "red" }}>*</span>
                      {t("user.display_name")}
                    </span>
                  }
                  onChange={(displayName) =>
                    this.handleChange(displayName, "displayName")
                  }
                  type="text"
                  name="name"
                  variant="outlined"
                  size="small"
                  value={person ? person.displayName : ""}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <FormControl fullWidth={true} variant="outlined" size="small">
                  <InputLabel htmlFor="gender-simple">
                    {
                      <span className="font">
                        {t("user.gender")}
                      </span>
                    }
                  </InputLabel>
                  <Select
                    label={
                      <span className="font">
                        {t("user.gender")}
                      </span>
                    }
                    value={person ? person.gender : ""}
                    onChange={(gender) => this.handleChange(gender, "gender")}
                    inputProps={{
                      name: "gender",
                      id: "gender-simple",
                    }}
                  >
                    {this.listGender.map((item) => {
                      return (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              {isAddNew &&
              <Grid item sm={6} xs={12}>
                <TextValidator
                  InputProps={{
                    readOnly: !isAddNew,
                  }}
                  className="w-100 "
                  label={
                    <span className="font">
                      <span style={{ color: "red" }}>*</span>
                      {t("user.username")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="username"
                  variant="outlined"
                  size="small"
                  value={username}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                />
              </Grid>}
              <Grid item sm={6} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={
                    <span className="font">
                      {t("user.email")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="email"
                  name="email"
                  variant="outlined"
                  size="small"
                  value={email}
                  validators={["isEmail"]}
                  errorMessages={["Email is not valid",]}
                />
              </Grid>
              {/* <Grid item sm={6} xs={12}>
                <FormControl fullWidth={true} variant="outlined" size="small">
                  <InputLabel htmlFor="type-simple">
                    {
                      <span className="font">
                        {t("user.type")}
                      </span>
                    }
                  </InputLabel>
                  <Select
                    label={
                      <span className="font">
                        {t("user.type")}
                      </span>
                    }
                    value={userType ? userType : ""}
                    onChange={(userType) => this.handleChange(userType, "userType")}
                    inputProps={{
                      name: "userType",
                      id: "userType-simple",
                    }}
                  >
                    {this.userType.map((item) => {
                      return (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid> */}

              {/* <Grid item lg={6} md={6} sm={6} xs={12}>
                <AsynchronousAutocomplete
                  label={
                    <span className="font">
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
                  onSelect={(value) => {
                    this.handleSelectdministrativeUnit(
                      value,
                      "provinceOfResidence"
                    );
                  }}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item lg={6} md={6} sm={6} xs={12}>
                <AsynchronousAutocomplete
                  label={
                    <span className="font">
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
                  onSelect={(value) => {
                    this.handleSelectdministrativeUnit(
                      value,
                      "districtOfResidence"
                    );
                  }}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item lg={6} md={6} sm={6} xs={12}>
                <AsynchronousAutocomplete
                  label={
                    <span className="font">
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
                  onSelect={(value) => {
                    this.handleSelectdministrativeUnit(
                      value,
                      "wardOfResidence"
                    );
                  }}
                  variant="outlined"
                  size="small"
                />
              </Grid> */}

              {/* <Grid item lg={6} md={6} sm={6} xs={12}>
                <Autocomplete
                  disableClearable
                  id="combo-box"
                  options={this.state.listHealthCareGroup ? this.state.listHealthCareGroup : []}
                  value={this.state.healthCareGroup ? this.state.healthCareGroup : null}
                  size="small"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      value={this.state.healthCareGroup ? this.state.healthCareGroup : null}
                      label={
                        <span>
                          <span style={{ color: "red" }}></span>
                          {t("Tổ y tế")}
                        </span>
                      }
                      variant="outlined"
                    />
                  )}
                  getOptionLabel={(option) => option.name}
                  getOptionSelected={(option, value) => option.id === value.id}
                  onChange={(event, value) => {
                    this.selectHealthCareGroup(event, value);
                  }}
                />
              </Grid> */}
              <Grid item lg={6} md={6} sm={6} xs={12}>
                <TextField
                  disabled
                  className="w-80"
                  id="healthCareGroup-id"
                  size="small"
                  name="healthCareGroup"
                  label={t("Tổ y tế")}
                  value={this.state.healthCareGroup ? this.state.healthCareGroup.name : ""}
                  variant="outlined"
                />
                <Button
                  size="small"
                  className="btn btn-primary-d"
                  style={{ float: "right" }}
                  variant="contained"
                  onClick={this.openParentPopup}
                >
                  {t("general.popup.select")}
                </Button>
                {this.state.shouldOpenSelectHealthCareGroupPopup && (
                  <SelectHealthtCarePopup
                    open={this.state.shouldOpenSelectHealthCareGroupPopup}
                    handleSelect={this.handleSelectHealthCare}
                    selectedItem={
                      this.state.healthCareGroup ? this.state.healthCareGroup : null
                    }
                    handleClose={this.handleDialogClose}
                    t={t}
                    i18n={i18n}
                  />
                )}
              </Grid>
              <Grid item sm={6} xs={12}>
                {listRole && (
                  <Autocomplete
                    style={{ width: "100%" }}
                    multiple
                    id="combo-box-demo"
                    defaultValue={roles}
                    options={listRole}
                    getOptionSelected={(option, value) =>
                      option.id === value.id
                    }
                    getOptionLabel={(option) => option.authority}
                    onChange={(event, value) => {
                      this.selectRoles(value);
                    }}
                    renderInput={(params) => (
                      <TextValidator
                        {...params}
                        value={roles}
                        label={
                          <span className="font">
                            <span style={{ color: "red" }}>*</span>
                            {t("user.role.title")}
                          </span>
                        }
                        variant="outlined"
                        size="small"
                        fullWidth
                        validators={["required"]}
                        errorMessages={[t("user.please_select_permission")]}
                      />
                    )}
                  />
                )}
              </Grid>
              {!isAddNew && (
                <Grid item sm={6} xs={12}>
                  <FormControlLabel
                    value={changePass}
                    name="changePass"
                    onChange={(changePass) =>
                      this.handleChange(changePass, "changePass")
                    }
                    control={<Checkbox checked={changePass} />}
                    label={t("user.change_pass")}
                  />
                </Grid>
              )}
              {/* <Grid item sm={6} xs={12}>
                <FormControlLabel
                  value={active}
                  name="active"
                  onChange={(active) => this.handleChange(active, "active")}
                  control={<Checkbox checked={active} />}
                  label={t("user.active")}
                />
              </Grid> */}
              {/*----- Active AutoGenCode --------*/}

              {changePass != null && changePass == true ? (
                <Grid item container spacing={2}>
                  <Grid item sm={6} xs={12}>
                    <TextValidator
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
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <TextValidator
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
                </Grid>
              ) : (
                <div></div>
              )}
            </Grid>
          </DialogContent>
          <DialogActions spacing={4} className="flex flex-end flex-middle">
              <Button
                startIcon={<BlockIcon />}
                variant="contained"
                className="mr-12 btn btn-secondary d-inline-flex"
                color="secondary"
                onClick={() => this.props.handleClose()}
              >
                Huỷ
              </Button>
              <Button
                startIcon={<SaveIcon />}
                variant="contained"
                className="mr-12 btn btn-primary-d d-inline-flex"
                color="primary"
                type="submit"
              >
                Lưu
              </Button>
          </DialogActions>
        </ValidatorForm>

      </Dialog>
    );
  }
}

export default UserEditorDialog;
