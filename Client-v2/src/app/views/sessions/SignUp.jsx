import {
  Button, Card,
  Checkbox, FormControl, FormControlLabel, FormHelperText, Grid
} from "@material-ui/core";
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import React, { Component } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { connect } from "react-redux";
import { toast } from 'react-toastify';
import ConstantList from "../../appConfig";
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import {
  getByPageByParentId as getAdministrativeUnitByPage, getNewCode, register
} from "./SessionService";
import './SignIn.scss';
import SignUpInputOTP from "./SignUpInputOTP";

toast.configure({
  autoClose: 4000,
  draggable: false,
  limit: 3
});

class SignUp extends Component {
  state = {
    name: "",
    code: "",
    level: 0,
    provinceOfResidenceSearch: {
      pageIndex: 0,
      pageSize: 10000000,
      isGetAllCity: true,
    },
    email: null,
    provinceOfResidence: null,
    districtOfResidence: null,
    districtOfResidenceSearch: {},
    wardOfResidenceSearch: {},
    wardOfResidence: null,
    administrativeUnit: null,
    hamletOfResidenceSearch: {},
    residentialAreaSearch: {},
    residentialArea: null,
    openPopupInputOTP: false,
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleChangeSelect = (event, value) => {
    this.setState({ [event.target.name]: value });
  }

  handleFormSubmit = async () => {
    let { id } = this.state;
    let { t } = this.props;
    let obj = {}
    obj.id = id;
    obj.success = this.state.success;
    obj.code = this.state.code;
    obj.name = this.state.name;
    obj.age = this.state.age;
    obj.email = this.state.email;
    obj.phoneNumber = this.state.phoneNumber;
    obj.detailAddress = this.state.detailAddress;
    obj.password = this.state.password;
    obj.height = this.state.height;
    obj.weight = this.state.weight;
    obj.gender = this.state.gender;
    obj.isPregnant = this.state.isPregnant;

    if (this.state.administrativeUnit) {
      obj.administrativeUnit = { id: this.state.administrativeUnit.id };
    }
    if (this.checkValid(obj)) {
      register(obj).then((response) => {
        if (response && response.data != null && response.status === 200) {
          this.state.item = obj;
          this.state.item.success = response.data.success;
          this.state.item.content = response.data.content;
          this.state.item.resendOtp = response.data.resendOtp;
          if (response.data.success || response.data.resendOtp) {
            this.setState({ ...this.state, loading: false, openPopupInputOTP: true });
            toast.success(response.data.content);
          }
          else {
            this.setState({ ...this.state, loading: false });
            toast.warning(response.data.content);
          }
        }
        else {
          this.setState({ ...this.state, loading: false });
          toast.warning(t('C?? l???i x???y ra khi ????ng k?? t??i kho???n, vui l??ng th??? l???i.'));
        }
      });
    }
  };

  validateSDT = (sdt) => {
    var cm = /^0[0-9]{9,10}$/
    if (sdt.match(cm)) {
      return true
    } else {
      return false;
    }
  }

  checkValid = (obj) => {
    if (obj) {
      if (!obj.name) {
        toast.warning('Vui l??ng nh???p h??? v?? t??n ch??? h???.');
        return false;
      }
      else if (!obj.age) {
        toast.warning('Vui l??ng nh???p tu???i.');
        return false;
      }
      else if (!obj.phoneNumber) {
        toast.warning('Vui l??ng nh???p s??? ??i???n tho???i.');
        return false;
      } else if(obj.phoneNumber != null && obj.phoneNumber.length > 0 && !this.validateSDT(obj.phoneNumber)){
        toast.warning('S??? ??i???n tho???i kh??ng ????ng ?????nh d???ng')
      }
      else if (!obj.administrativeUnit || !obj.administrativeUnit.id) {
        toast.warning('Vui l??ng ch???n t??? m?? b???n ??ang ???.');
        return false;
      }
      else if (!obj.detailAddress) {
        toast.warning('Vui l??ng nh???p ?????a ch??? chi ti???t.');
        return false;
      }
      else if (!obj.password) {
        toast.warning('Vui l??ng nh???p m???t kh???u.');
        return false;
      }
      else {
        return true;
      }
    }
    return false;
  }

  handleSelectdministrativeUnit = (value, source) => {
    //th??nh ph???
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
    //qu???n
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
    //ph?????ng
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
    //khu ph???
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
    //t??? d??n ph???
    if ("administrativeUnit" == source) {
      this.setState({ administrativeUnit: value });
    }
  };

  componentWillUnmount() {
    ValidatorForm.removeValidationRule('isPasswordMatch');
  }

  componentDidMount() {
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      if (value !== this.state.password) {
        return false;
      }
      return true;
    });
  }

  componentWillMount() {
    getNewCode().then((response) => {
      if (response && response.data) {
        this.setState({ code: response.data });
      }
      else {
        toast.warning('c?? l???i x???y ra khi sinh m?? h??? gia ????nh, vui l??ng th??? l???i.');
      }
    });
    let { provinceOfResidence, districtOfResidence, wardOfResidence, provinceOfResidenceSearch } = this.state;
    getAdministrativeUnitByPage(provinceOfResidenceSearch).then(({ data }) => {
      if (data && data.content) {
        provinceOfResidence = data.content.find((element) => element.name === "H??? Ch?? Minh")
        if (provinceOfResidence) {
          this.handleSelectdministrativeUnit(provinceOfResidence, "provinceOfResidence");
          if (provinceOfResidence.subAdministrativeUnitsDto && provinceOfResidence.subAdministrativeUnitsDto.length > 0) {
            districtOfResidence = provinceOfResidence.subAdministrativeUnitsDto.find((element) => element.name === "Qu???n 7")
            if (districtOfResidence) {
              this.handleSelectdministrativeUnit(districtOfResidence, "districtOfResidence");
              getAdministrativeUnitByPage({
                pageIndex: 0,
                pageSize: 10000000,
                parentId: districtOfResidence.id
              }).then(({ data }) => {
                if (data && data.content) {
                  wardOfResidence = data.content.find((element) => element.name === "Ph?????ng T??n Ki???ng")
                  if (wardOfResidence) {
                    this.handleSelectdministrativeUnit(wardOfResidence, "wardOfResidence");
                  }
                }
              })
            }
          }
        }
      }
    })
  }

  handleClose = () => {
    this.setState({
      openPopupInputOTP: false
    }, () => {

    });
  };

  render() {
    let { t, i18n } = this.props;
    let {
      name,
      code,
      phoneNumber,
      age,
      detailAddress,
      districtOfResidence,
      wardOfResidence,
      wardOfResidenceSearch,
      administrativeUnit,
      hamletOfResidenceSearch,
      provinceOfResidence,
      residentialArea,
      provinceOfResidenceSearch,
      districtOfResidenceSearch,
      residentialAreaSearch,
      password,
      rePassword,
      email,
      openPopupInputOTP,
      gender
    } = this.state;
    return (
      <div className="signup flex">
        <Grid container>
          <Grid className="" item lg={12} md={12} sm={12} xs={12}>
            <Card className="signup-card position-relative y-center h-100vh">
              <Grid className="login-right-side" item lg={6} md={6} sm={12} xs={12} >
                <img src={ConstantList.ROOT_PATH + "assets/images/background/login-bg-1.png"} alt="" />
              </Grid>
              <Grid item lg={6} md={6} sm={12} xs={12} className="vertical-scroll">
                <Grid
                  container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justify="center">
                  <Grid item md={10} sm={12} xs={12} style={{ marginTop: '15px', textAlign: 'center' }}>
                    <h2>{t('sign_up.title')}</h2>
                    <div className="p-16 pt-0 h-100 position-relative">
                      <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
                        <Grid className={'body-sign-up'} style={{
                          display: "flex",
                          flexDirection: "column"
                        }}>
                          <Grid container spacing={2} className={'container-sign-up mt-16'} >
                            {/* <Grid item lg={12} md={12} sm={12} xs={12}>
                          <TextValidator
                            className="w-100"
                            label={<span className="font">
                              <span style={{ color: "red" }}> *</span>
                              {t('M?? gia ????nh')}
                            </span>
                            }
                            type="text"
                            name="code"
                            value={code}
                            validators={["required"]}
                            errorMessages={[t("general.errorMessages_required")]}
                            variant="outlined"
                            size="small"
                            disabled
                          />
                        </Grid> */}

                            <Grid item lg={6} md={6} sm={12} xs={12}>
                              <TextValidator
                                className="w-100"
                                label={<span className="font">
                                  <span style={{ color: "red" }}> *</span>
                                  {t('H??? v?? t??n ch??? h???')}
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

                            <Grid item lg={6} md={6} sm={12} xs={12}>
                              <TextValidator
                                className="w-100"
                                label={<span className="font">
                                  <span style={{ color: "red" }}> *</span>
                                  {t('Tu???i')}
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

                            <Grid item lg={6} md={6} sm={12} xs={12}>
                              <TextValidator
                                className="w-100"
                                label={
                                  <span className="font">
                                    <span style={{ color: "red" }}> *</span>C??n n???ng(kg)
                                  </span>
                                }
                                onChange={this.handleChange}
                                type="text"
                                name="weight"
                                value={this.state.weight ? this.state.weight : ''}
                                variant="outlined"
                                validators={["required", 'isFloat']}
                                errorMessages={[t("general.errorMessages_required"), t('general.isFloat')]}
                                size="small"
                                step={0.0001}
                              />
                            </Grid>
                            
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                              <TextValidator
                                className="w-100"
                                label={
                                  <span className="font">
                                    <span style={{ color: "red" }}> *</span>Chi???u cao(cm)
                                  </span>
                                }
                                onChange={(value) => { this.handleChange(value, "height") }}
                                type="text"
                                name="height"
                                value={this.state.height ? this.state.height : ''}
                                variant="outlined"
                                validators={["required", "isFloat"]}
                                errorMessages={[t("general.errorMessages_required"), t('general.isFloat')]}
                                size="small"
                                step={0.0001}
                              />
                            </Grid>

                              <Grid item lg={6} md={6} sm={6} xs={6} className="radio_gender text-align-left">
                                <FormControl component="fieldset" error={this.state.checkSubmit && !this.state.gender}>
                                  <FormLabel component="legend"><span style={{ color: "red" }}> *</span>Gi???i t??nh: </FormLabel>
                                  <RadioGroup 
                                    row 
                                    className="radio_group_gender margin-left-1rem"
                                    aria-label="position" 
                                    name="gender"
                                    onChange={this.handleChangeSelect}
                                  >
                                    <FormControlLabel
                                      value="M"
                                      control={<Radio />}
                                      label="Nam"
                                      labelPlacement="end"
                                    />
                                    
                                    <FormControlLabel
                                      value="F"
                                      control={<Radio />}
                                      label="N???"
                                      labelPlacement="end"
                                    />
                                  </RadioGroup>

                                  {(this.state.checkSubmit && !this.state.gender) && <FormHelperText>{t("general.errorMessages_required")}</FormHelperText>}
                                </FormControl>
                              </Grid>
                              
                              <Grid item lg={6} md={6} sm={6} xs={6} className="align-self-center text-align-left">
                                <div style={{ display: gender === "F" ? "block" : "none"}} className="padding-top-075rem">
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={gender === "F" ? this.state.isPregnant : false}
                                        onChange={this.handleChangeSelect}
                                        name="isPregnant"
                                      />
                                    }
                                    label="C?? mang thai"
                                  />
                                </div>
                              </Grid>

                            <Grid item lg={6} md={6} sm={12} xs={12}>
                              <TextValidator
                                className="w-100"
                                label={<span className="font">
                                  <span style={{ color: "red" }}> *</span>
                                  {t('S??? ??i???n tho???i')}
                                </span>
                                }
                                onChange={this.handleChange}
                                type="text"
                                name="phoneNumber"
                                value={phoneNumber}
                                validators={["matchRegexp:^0[1-9][0-9]*$", "required", ]}
                                errorMessages={[t("general.isPhoneNumber"), t("general.errorMessages_required")]}
                                variant="outlined"
                                size="small"
                              />
                            </Grid>

                            <Grid item lg={6} md={6} sm={12} xs={12}>
                              <TextValidator
                                className="w-100"
                                label={
                                  <span className="font">
                                    Email
                                  </span>
                                }
                                onChange={this.handleChange}
                                type="text"
                                name="email"
                                value={email ? email : ''}
                                validators={['isEmail']}
                                errorMessages={['Email kh??ng h???p l???']}
                                variant="outlined"
                                size="small"
                              />
                            </Grid>

                            {/* ????n v??? h??nh ch??nh */}
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                              <AsynchronousAutocomplete
                                label={
                                  <span className="font">
                                    <span style={{ color: "red" }}> * </span>
                                    {t("T???nh/Th??nh Ph???")}
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
                              />
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                              <AsynchronousAutocomplete
                                label={
                                  <span className="font">
                                    <span style={{ color: "red" }}> * </span>
                                    {t("Qu???n huy???n")}
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
                              />
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                              <AsynchronousAutocomplete
                                label={
                                  <span className="font">
                                    <span style={{ color: "red" }}> * </span>
                                    {t("X??/Ph?????ng")}
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
                              />
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                              <AsynchronousAutocomplete
                                label={
                                  <span className="font">
                                    <span style={{ color: "red" }}> * </span>
                                    {t("Khu ph???")}
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
                              />
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                              <AsynchronousAutocomplete
                                label={
                                  <span className="font">
                                    <span style={{ color: "red" }}> * </span>
                                    {t("T???")}
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
                              />
                            </Grid>

                            <Grid item lg={12} md={12} sm={12} xs={12}>
                              <TextValidator
                                className="w-100"
                                label={<span className="font">
                                  <span style={{ color: "red" }}> *</span>
                                  {t('?????a ch??? chi ti???t')}
                                </span>
                                }
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
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                              <TextValidator
                                className="w-100"
                                label={<span className="font">
                                  <span style={{ color: "red" }}> *</span>
                                  {'M???t kh???u'}
                                </span>
                                }
                                onChange={this.handleChange}
                                type="password"
                                name="password"
                                value={password}
                                validators={["required"]}
                                errorMessages={[t("general.errorMessages_required")]}
                                variant="outlined"
                                size="small"
                              />
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                              <TextValidator
                                className="w-100 mb-16"
                                label={<span className="font">
                                  <span style={{ color: "red" }}> *</span>
                                  {'Nh???p l???i m???t kh???u'}
                                </span>
                                }
                                onChange={this.handleChange}
                                type="password"
                                name="rePassword"
                                value={rePassword}
                                validators={['required', 'isPasswordMatch']}
                                errorMessages={[t("general.errorMessages_required"), 'M???t kh???u ch??a tr??ng kh???p']}
                                variant="outlined"
                                size="small"
                              />
                            </Grid>
                          </Grid>

                        </Grid>
                        <Grid container style={{ justifyContent: "center" }} className={'mt-16'}>
                          <Button
                            className="capitalize"
                            variant="contained"
                            color="primary"
                            type="submit"
                            onClick={() => this.setState({checkSubmit: true})}
                          >
                            {t("sign_up.title")}
                          </Button>
                          <span className="m-8 mr-16 ml-16">ho???c</span>
                          <Button
                            className="capitalize"
                            variant="contained"
                            color="secondary"
                            onClick={() =>
                              this.props.history.push(ConstantList.ROOT_PATH + "session/signin")
                            }
                          >
                            {t("sign_in.title")}
                          </Button>
                        </Grid>
                      </ValidatorForm>

                    </div>
                  </Grid>
                </Grid>
              </Grid>

            </Card>
          </Grid>
        </Grid>
        {openPopupInputOTP && (
          <SignUpInputOTP
            handleClose={this.handleClose}
            open={openPopupInputOTP}
            item={this.state.item}
            t={t} i18n={i18n}
          />
        )}

      </div>
      // <div className="signup flex flex-center w-100 h-100vh">
      //   <div className="p-8">
      //     <Card className="signup-card position-relative y-center">
      //       <Grid container>
      //         <Grid item lg={5} md={5} sm={5} xs={12}>
      //           <div className="p-32 flex flex-center bg-light-gray flex-middle h-100">
      //             <img
      //               src="/assets/images/illustrations/posting_photo.svg"
      //               alt=""
      //             />
      //           </div>
      //         </Grid>
      //         <Grid item lg={7} md={7} sm={7} xs={12}>
      //           <div className="p-36 h-100">

      //           </div>
      //         </Grid>
      //       </Grid>
      //     </Card>
      //   </div>
      // </div>
    );
  }
}

const mapStateToProps = state => ({
  // setUser: PropTypes.func.isRequired
});

export default connect(
  mapStateToProps,
  {}
)(SignUp);
