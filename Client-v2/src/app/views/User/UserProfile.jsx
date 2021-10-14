import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  Checkbox,
  TextField,
  FormControlLabel,
  DialogTitle,
  IconButton,
  Icon,
  Avatar,
  DialogActions,
  DialogContent
} from "@material-ui/core";
import ConstantList from "../../appConfig";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import {
  getUserByUsername,
  getAllInfoByUserLogin,
  getRoleUser,
  getAllRoles,
  saveUserOrg,
} from "./UserService";
import UserRoles from "app/services/UserRoles";
import { toast } from 'react-toastify';
import Draggable from 'react-draggable';
import Paper from '@material-ui/core/Paper';
import 'react-toastify/dist/ReactToastify.css';
import SaveIcon from '@material-ui/icons/Save';
import HomeIcon from '@material-ui/icons/Home';
import ChangePassWordAccordion from './ChangePassWordAccordion';
import { Breadcrumb, ConfirmationDialog } from "egret";
import { getCurrentUser, getAllOrgByUserId } from "./UserService";
import UserProfileForm from './UserProfileForm';
import UploadCropImagePopup from "../page-layouts/UploadCropImagePopup";
import ChangePasswordDiaglog from "./ChangePasswordPopup";
import authService from "../../services/jwtAuthService";
import axios from "axios";
const API_PATH = ConstantList.API_ENPOINT + "/api/fileUpload/";

toast.configure({
  autoClose: 2000,
  draggable: false,
  limit: 3
  //etc you get the idea
});
function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}
class UserProfile extends Component {
  state = {
    isAddNew: false,
    admin: false,
    healthCareStaff: false,
    medicalTeam: false,
    listUnit: [],
    listRole: [],
    roles: [],
    active: true,
    email: "",
    person: {},
    username: "",
    user: null,
    changePass: true,
    password: "",
    confirmPassword: "",
    familyMember: null,
    practitioner: null,
    userUnit: null,
    shouldOpenPasswordDialog: false,
  };

  listGender = [
    { id: "M", name: "Nam" },
    { id: "F", name: "Nữ" },
    { id: "U", name: "Không rõ" },
  ];

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

  handleDialogPasswordClose = () => {
    this.setState({
      shouldOpenPasswordDialog: false,
    });
  };

  openPasswordDialog = () => {
    this.setState({
      shouldOpenPasswordDialog: true,
    });
  };

  handleFormSubmit = (values) => {
    let { t } = this.props
    let { id, user } = this.state;
    let userOrg = {};
    if (user == null) {
      user = {};
    }
    user.username = values.username;
    user.email = values.email;
    user.person = values.person;
    user.person.displayName = values.displayName;
    user.person.gender = values.gender;
    user.roles = values.roles;
    // user.isActive = values.isActive;
    // user.password = values.password;
    userOrg.user = user;
    userOrg.org = values.org;
    userOrg.id = id;
    getUserByUsername(this.state.username).then((data) => {
      if (data.data && data.data.id) {
        if (!user.id || (id && data.data.id !== user.id)) {
          toast.warning(t('toast.user_exist'));
          return;
        }
      }
      saveUserOrg(userOrg).then(() => {
        toast.success(t('toast.update_success'));
        this.props.history.push('/user-manage');
      });
    });
  };

  selectRoles = (rolesSelected) => {
    this.setState({ roles: rolesSelected }, function () { });
  };

  handleDialogClose = () => {
    this.setState({
      shouldOpenImageDialog: false
    })
  }

  handleUpdate = (blobValue) => {
    const url = ConstantList.API_ENPOINT + "/api/users/updateavatar";
    let formData = new FormData();
    formData.set('uploadfile', blobValue)
    //formData.append('uploadfile',file);//Lưu ý tên 'uploadfile' phải trùng với tham số bên Server side
    const config = {
      headers: {
        'Content-Type': 'image/jpg'
      }
    }
    return axios.post(url, formData, config).then(response => {
      let user = response.data;
      this.setState({ user: user });
      authService.setLoginUser(user);
      this.handleDialogClose();
    });
  }

  componentDidMount() {
  }
  componentWillMount() {
    getAllInfoByUserLogin().then((resp) => {
      // this.setState({ ...data.userDto }, () => {
      //   this.setState({ id: data.id, user: item.user });
      // });
      let data = resp ? resp.data : null;
      if (data) {
        this.setState({ user: data.userDto }, () => {
        });
      }
    });

    if (!UserRoles.isAdmin()) {
      // getRoleUser().then(({ data }) => {
      //   this.setState({
      //     listRole: data,
      //   });
      // });
    } else {
      getAllRoles().then(({ data }) => {
        this.setState({
          listRole: data,
        });
      });
    }
  }

  handleOpenUploadDialog = () => {
    this.setState({
      shouldOpenImageDialog: true
    });
  }

  backToHome = () => {
    this.props.history.push({
      pathname: '/dashboard/analytics'
    });
  }

  render() {
    let { t, i18n } = this.props;
    let {
      id,
      listRole,
      roles,
      email,
      person,
      user,
      username,
    } = this.state;
    return (
      <div className="m-sm-30">
        <div className="mb-sm-30">
          <Breadcrumb routeSegments={[
            { name: t('navigation.manage.user') },
            { name: t('navigation.manage.personal_info') }
          ]} />
        </div>
        <div className="user-profile__sidenav flex-column flex-middle">
          {this.state.user && this.state.user ? (
            <Avatar
              className="avatar mb-20"
              src={ConstantList.API_ENPOINT + this.state.user.imagePath}
              onClick={
                this.handleOpenUploadDialog
              }
            />
          ) :
            (
              <div>
                <Avatar
                  className="avatar mb-20"
                  src={ConstantList.ROOT_PATH + "assets/images/avatar.jpg"}
                  onClick={
                    this.handleOpenUploadDialog
                  }
                />
              </div>
            )}
          {user?.displayName}
        </div>
        <Grid container>
          <Grid item md={12}>
            <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
              <div className="dialog-body">
                <DialogContent className="o-hidden">
                  <Grid className="mb-16" container spacing={2}>
                    <Grid item lg={4} md={4} sm={6} xs={12}>
                      <TextValidator
                        className="w-100"
                        disabled={true}
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
                        value={(user && user.person) ? (user.person.displayName ? user.person.displayName : '') : ""}
                        validators={["required"]}
                        errorMessages={[t("general.errorMessages_required")]}
                      />
                    </Grid>
                    <Grid item lg={4} md={4} sm={6} xs={12}>
                      <FormControl fullWidth={true} variant="outlined" size="small">
                        <InputLabel htmlFor="gender-simple">
                          {
                            <span className="font">
                              <span style={{ color: "red" }}>*</span>
                              {t("user.gender")}
                            </span>
                          }
                        </InputLabel>
                        <Select
                          disabled={true}
                          label={
                            <span className="font">
                              <span style={{ color: "red" }}>*</span>
                              {t("user.gender")}
                            </span>
                          }
                          value={(user && user.person) ? (user.person.gender ? user.person.gender : '') : ""}
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
                    <Grid item lg={4} md={4} sm={6} xs={12}>
                      <TextValidator
                        className="w-100"
                        disabled={true}
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
                        value={user ? (user.username ? user.username : '') : ''}
                        validators={["required"]}
                        errorMessages={[t("general.errorMessages_required")]}
                      />
                    </Grid>
                    <Grid item lg={4} md={4} sm={6} xs={12}>
                      <TextValidator
                        className="w-100"
                        disabled={true}
                        label={
                          <span className="font">
                            {/* <span style={{ color: "red" }}>*</span> */}
                            {t("user.email")}
                          </span>
                        }
                        onChange={this.handleChange}
                        type="email"
                        name="email"
                        variant="outlined"
                        size="small"
                        value={(user && user.person) ? (user.person.email ? user.person.email : '') : ""}
                        validators={["isEmail"]}
                        errorMessages={[
                          // t("general.errorMessages_required"),
                          "Email is not valid",
                        ]}
                      />
                    </Grid>
                    <Grid item lg={4} md={4} sm={6} xs={12}>
                      <TextValidator
                        className="w-100"
                        disabled
                        label={
                          <span className="font">
                            {/* <span style={{ color: "red" }}>*</span> */}
                            {t("Số điện thoại")}
                          </span>
                        }
                        onChange={this.handleChange}
                        type="phoneNumber"
                        name="phoneNumber"
                        variant="outlined"
                        size="small"
                        value={(user && user.person) ? (user.person.phoneNumber ? user.person.phoneNumber : '') : ""}
                      // validators={["required"]}
                      // errorMessages={[t("general.errorMessages_required")]}
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
              </div>
              <div className="dialog-footer">
                <DialogActions className="p-0">
                  <div className="flex flex-space-between flex-middle">
                    <Button
                      startIcon={<HomeIcon />}
                      variant="contained"
                      className="mr-12 btn btn-secondary d-inline-flex"
                      color="secondary"
                      onClick={() => this.backToHome()}
                    >
                      {t("Về trang chủ")}
                    </Button>
                    {/* <Button
                      startIcon={<SaveIcon />}
                      className="mr-12 btn btn-success d-inline-flex"
                      variant="contained"
                      color="primary"
                      type="submit">
                      {t("general.button.save")}
                    </Button> */}

                    <Button
                      variant="contained"
                      color="primary"
                      type="button"
                      onClick={() => this.openPasswordDialog()}
                    >
                      {t("user.change_pass")}
                    </Button>
                    {this.state.shouldOpenImageDialog && (
                      <UploadCropImagePopup t={t} i18n={i18n}
                        handleClose={this.handleDialogClose}
                        handleUpdate={this.handleUpdate}
                        open={this.state.shouldOpenImageDialog}
                        uploadUrl={API_PATH + "avatarUpload"}
                        acceptType="png;jpg;gif;jpeg"
                      />
                    )}
                    {this.state.shouldOpenPasswordDialog && (
                      <ChangePasswordDiaglog
                        t={t}
                        i18n={i18n}
                        handleClose={this.handleDialogPasswordClose}
                        handleUpdate={this.handleUpdate}
                        open={this.state.shouldOpenPasswordDialog}
                        acceptType="png;jpg;gif;jpeg"
                        user={user}
                      />
                    )}
                  </div>
                </DialogActions>
              </div>
            </ValidatorForm>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default UserProfile;
