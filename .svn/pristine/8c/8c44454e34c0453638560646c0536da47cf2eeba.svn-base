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
  InputAdornment
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { Component } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import {
  getByPageByParentId as getAdministrativeUnitByPage,
  getById as getAdministrativeUnitById,
} from "../AdministrativeUnit/AdministrativeUnitService";
import { searchByPage as getHealthCare } from "../HealthCareGroup/HealthCareGroupService";
import SelectHealthtCarePopup from "../HealthCareGroup/SelectHealthtCarePopup";
import {
  checkDuplicateUserName,
  savePractitionerOrg,
} from "./PractitionerService";
import { toast } from 'react-toastify';
import appConfig from "app/appConfig";
toast.configure({
  autoClose: 2000,
  draggable: false,
  limit: 3
});

class PractitionerEditorDialog extends Component {
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
    phoneNumber: '',
    gender: '',
    age: null,
    occupation: null,
    workPlace: '',
    detailAddress: '',
    displayName: '',
    shouldOpenSelectHealthCareGroupPopup: false
  };

  listGender = [
    { id: "M", name: "Nam" },
    { id: "F", name: "Nữ" },
    { id: "U", name: "Không rõ" },
  ];

  listOccupation = [
    { id: 1, name: "Bác sĩ" },
    { id: 2, name: 'Điều dưỡng' }
  ]

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
  validateSDT = (sdt) => {
    var cm = /^0[0-9]{9,10}$/
    if (sdt.match(cm)) {
      return true
    } else {
      return false;
    }
  }
  handleFormSubmit = () => {
    let { id, user, wardOfResidence } = this.state;
    let practitioner = {};
    practitioner.id = this.state.id;

    if (user == null) {
      user = {};
    }
    user.username = this.state.username;
    user.active = this.state.active;
    user.changePass = this.state.changePass;
    user.isActive = this.state.isActive;
    user.password = this.state.password;

    practitioner.user = user;
    if (this.state.healthCareGroup) {
      practitioner.healthCareGroup = { id: this.state.healthCareGroup.id };
    }
    practitioner.occupation = this.state.occupation;
    practitioner.age = this.state.age;
    practitioner.workPlace = this.state.workPlace;
    practitioner.detailAddress = this.state.detailAddress;
    practitioner.displayName = this.state.displayName;
    practitioner.gender = this.state.gender;
    practitioner.email = this.state.email;
    practitioner.phoneNumber = this.state.phoneNumber;
    practitioner.type = this.state.type;
    practitioner.zalo = this.state.zalo;
    if (this.state.phoneNumber != null && this.validateSDT(this.state.phoneNumber) == false) {
      toast.info("Số điện thoại không hợp lệ");
      return;
    } else if (this.state.zalo != null && this.validateSDT(this.state.zalo) == false) {
      toast.info("Số Zalo không hợp lệ");
      return;
    }
    checkDuplicateUserName(id, this.state.username).then((resp) => {
      if (resp.data && resp.data) {
        toast.success('Tên đăng nhập đã tồn tại!');
        return;
      } else {
        savePractitionerOrg(practitioner).then(() => {
          this.props.handleOKEditClose();
        });
      }
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
    this.setState({ ...item.user, org: item.org }, () => {
      this.setState({ id: item.id, user: item.user, org: item.org });
    });
    this.setState(item);
  }

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

  render() {
    let { open, handleClose, handleOKEditClose, t, i18n } = this.props;
    let {
      id,
      isAddNew,
      active,
      email,
      gender,
      username,
      changePass,
      password,
      confirmPassword,
      phoneNumber,
      age,
      displayName,
      occupation,
      workPlace,
      detailAddress,
      zalo,
      type
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
            {(id ? t("update") : t("Add")) + " " + t("practitioner.subtitle")}{" "}
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
                  onChange={this.handleChange}
                  type="text"
                  name="displayName"
                  variant="outlined"
                  size="small"
                  value={displayName}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <FormControl fullWidth={true} variant="outlined" size="small">
                  <InputLabel htmlFor="occupation-simple">
                    {
                      <span className="font">
                        {t("practitioner.occupation")}
                      </span>
                    }
                  </InputLabel>
                  <Select
                    label={
                      <span className="font">
                        {t("practitioner.occupation")}
                      </span>
                    }
                    value={occupation}
                    onChange={this.handleChange}
                    inputProps={{
                      name: "occupation",
                      id: "occupation-simple",
                    }}
                  >
                    {this.listOccupation.map((item) => {
                      return (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={3} xs={12}>
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
                    value={gender}
                    onChange={this.handleChange}
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
              <Grid item sm={3} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={
                    <span className="font">
                      <span style={{ color: "red" }}>*</span>
                      {t("practitioner.age")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="number"
                  name="age"
                  variant="outlined"
                  size="small"
                  value={age}
                  validators={["required", 'minNumber:0']}
                  errorMessages={[
                    t("general.errorMessages_required", "Phải là số dương")
                  ]}

                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={
                    <span className="font">
                      <span style={{ color: "red" }}>*</span>
                      {t("user.email")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="email"
                  name="email"
                  variant="outlined"
                  size="small"
                  value={email}
                  validators={["required", "isEmail"]}
                  errorMessages={[
                    t("general.errorMessages_required"),
                    "Email is not valid",
                  ]}
                />
              </Grid>
              <Grid item sm={3} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={
                    <span className="font">
                      <span style={{ color: "red" }}>*</span>
                      {t("practitioner.phoneNumber")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="phoneNumber"
                  variant="outlined"
                  size="small"
                  value={phoneNumber}
                  validators={["required"]}
                  errorMessages={[
                    t("general.errorMessages_required")
                  ]}
                />
              </Grid>
              <Grid item sm={3} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={
                    <span className="font">
                      <span style={{ color: "red" }}></span>
                      {t("Zalo")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="zalo"
                  variant="outlined"
                  size="small"
                  value={zalo}
                // validators={["required"]}
                // errorMessages={[
                //   t("general.errorMessages_required")
                // ]}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={
                    <span className="font">
                      {t("practitioner.workPlace")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="workPlace"
                  variant="outlined"
                  size="small"
                  value={workPlace}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <FormControl fullWidth={true} variant="outlined" size="small">
                  <InputLabel htmlFor="familyMembers-simple">
                    {
                      <span className="">
                        <span style={{ color: "red" }}> * </span>
                        {t("Phân loại nhân viên")}
                      </span>
                    }
                  </InputLabel>
                  <Select
                    label={<span className="">
                      <span style={{ color: "red" }}> * </span>
                      {t("Phân loại nhân viên")}
                    </span>}
                    value={type ? type : null}
                    onChange={(event) => {
                      this.setState({ type: event.target.value })
                    }}
                    inputProps={{
                      name: "practitionerType",
                      id: "practitionerType-simple",
                    }}
                    validators={["required"]}
                    errorMessages={[t("general.required")]}
                  >
                    {appConfig.PRACTITIONER_TYPE_CONST.map((item) => {
                      return (
                        <MenuItem key={item.display} value={item.value}>
                          {item.display ? item.display : ""}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={
                    <span className="font">
                      {t("practitioner.detailAddress")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="detailAddress"
                  variant="outlined"
                  size="small"
                  value={detailAddress}
                />
              </Grid>

              <Grid item lg={6} md={6} sm={6} xs={12}>
                <TextValidator
                  disabled
                  className="w-100"
                  id="healthCareGroup-id"
                  size="small"
                  name="healthCareGroup"
                  label={<span className="">
                    <span style={{ color: "red" }}> * </span>
                    {t("Tổ y tế")}
                  </span>}
                  value={this.state.healthCareGroup ? this.state.healthCareGroup.name : ""}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          size="small"
                          className="align-bottom"
                          variant="contained"
                          color="primary"
                          onClick={this.openParentPopup}
                        >
                          {t("general.popup.select")}
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  validators={["required"]}
                  errorMessages={[t("general.required")]}
                />

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
              {/*----- Active AutoGenCode --------*/}
              {isAddNew && (
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
                </Grid>
              )}
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
            <Grid
              container
              spacing={2}
              direction="row"
              justify="flex-end"
              alignItems="center"
              md={12}
              xs={12}
              lg={12}
              sm={12}
            >
              <Button
                variant="contained"
                color="secondary"
                className="mt-8 mr-16 mb-16"
                onClick={() => this.props.handleClose()}
              >
                {t("Cancel")}
              </Button>
              <Button
                variant="contained"
                className="mt-8 mr-16 mb-16"
                color="primary"
                type="submit"
              >
                {t("Save")}
              </Button>
            </Grid>
          </DialogActions>
        </ValidatorForm>

      </Dialog>
    );
  }
}

export default PractitionerEditorDialog;
