import React, { Component } from "react";
import ConstantList from "../../appConfig";
import {
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
  Button
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { connect } from "react-redux";
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import { checkUserName, checkOTP, changeForgotPassword } from "./SessionService";
import { toast } from 'react-toastify';
import './SignIn.scss';
import "styles/globitsStyles.css";

toast.configure({
  autoClose: 1000,
  draggable: false,
  limit: 3
});

class ForgotPassword extends Component {
  state = {
    waitingForOTP: 180, //seconds
    waitingForOTPStatus: false,
    changePasswordStatus: false,
    phoneNumber: "",
    otpCode: "",
    password: "",
    rePassword: ""
  };

  //countdown clock for otp
  timer = null;

  handleChange = event => {
    event.persist();
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  validateSDT = (sdt) => {
    var cm = /^0[0-9]{9,10}$/
    if (sdt.match(cm)) {
      return true
    } else {
      return false;
    }
  }

  handleFormSubmit = async () => {
    let { t } = this.props;
    let { phoneNumber } = this.state;
    if (phoneNumber && !this.validateSDT(phoneNumber)) {
      toast.warning("Số điện thoại không hợp lệ");
    } else {
      checkUserName(phoneNumber).then((result) => {
        //Nếu trả về true là đã tồn tại số điện thoại
        if (result.data) {
          if (!result.data.error) {
            toast.success("Hãy nhập mã OTP nhận được từ tin nhắn");
            this.setState({waitingForOTPStatus: true, loading: false});
            this.timer = setInterval(this.countDown, 1000);
          } else {
            let msg = result.data.message;
            toast.warning(msg);
          }
          
        } else {
          toast.warning('Có lỗi xảy ra, vui lòng thử lại');
          this.setState({ loading: false });
        }
      });
    }
  };

  reSendOTP = () => {
    let { phoneNumber } = this.state;
    checkUserName(phoneNumber).then((result) => {
      //Nếu trả về true là đã tồn tại số điện thoại
      if (result.data) {
        if (!result.data.error)
        toast.success("Hãy nhập mã OTP nhận được từ tin nhắn");
        this.setState({waitingForOTPStatus: true, loading: false});
        this.timer = setInterval(this.countDown, 1000);
      } else {
        toast.warning('Có lỗi xảy ra, vui lòng thử lại');
        this.setState({ loading: false });
      }
    });
  }

  countDown = () => {
    let seconds = this.state.waitingForOTP - 1;
    this.setState({waitingForOTP: seconds});
    if (seconds === 0) { 
      clearInterval(this.timer);
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    ValidatorForm.removeValidationRule('isPasswordMatch');
  }

  handleFormSubmitOTPCode = async () => {
    let obj = {};
    obj.otpCode = this.state.otpCode;
    obj.phoneNumber = this.state.phoneNumber;
    checkOTP(obj).then((result) => {
      //Nếu trả về true là mã otp đúng
      if (result.data) {
        toast.success("Đã xác nhận mã OTP");
        this.setState({changePasswordStatus: true, loading: false});
      } else {
        toast.warning('Sai mã OTP, hãy kiểm tra lại');
        this.setState({ loading: false });
      }
    });
  }

  handleFormSubmitChangePassword = async() => {
    let obj = {};
    obj.password = this.state.password;
    obj.rePassword = this.state.rePassword;
    obj.phoneNumber = this.state.phoneNumber;
    obj.otpCode = this.state.otpCode;
    changeForgotPassword(obj).then((result) => {
      //Nếu trả về true là đã đổi mật khẩu thành công
      if (result.data) {
        toast.success("Thay đổi mật khẩu thành công!");
        this.setState({loading: false});
        this.props.history.push(ConstantList.ROOT_PATH+"session/signin");
      } 
      else {
        toast.success("OTP đã hết hạn!");
        this.setState({changePasswordStatus: false, waitingForOTPStatus: false, loading: false})
      }
    });
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
    
  }

  render() {
     let { t } = this.props;
     let { 
      phoneNumber,
      waitingForOTP,
      waitingForOTPStatus,
      otpCode,
      changePasswordStatus,
      password,
      rePassword
     } = this.state;
    return (
      <div className="signup flex" style={{overflowY: "auto"}}>
        <Grid container >
          <Grid className="" item lg={12} md={12} sm={12} xs={12}>
            <Card className="signup-card position-relative y-center h-100vh">
            <Grid className="login-right-side" item lg={6} md={6} sm={12} xs={12} >
                <img src={ConstantList.ROOT_PATH + "assets/images/background/login-bg-1.png"} alt="" />
              </Grid>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Grid item md={8} sm={8} xs={10} style={{ margin: 'auto', textAlign: 'center' }}>
                  <h2>{t('Quên mật khẩu')}</h2>
                  <div className="p-36 h-100 position-relative">
                    {!changePasswordStatus ? 
                    <>
                      {!waitingForOTPStatus ? 
                        <ValidatorForm ref="form" onSubmit={this.handleFormSubmit} >
                          <Grid container spacing={2}>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                              <span>Mời bạn nhập số điện thoại của hộ gia đình để lấy mã OTP.</span>
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                              <TextValidator
                                className="nice-input w-100 mb-24"
                                label={<span className="font">
                                  <span style={{ color: "red" }}> *</span>
                                  {t('Số điện thoại của hộ gia đình')}
                                </span>
                                }
                                onChange={this.handleChange}
                                type="text"
                                name="phoneNumber"
                                value={phoneNumber ? phoneNumber : ""}
                                validators={["required"]}
                                errorMessages={[t("general.errorMessages_required")]}
                                variant="outlined"
                                size="small"
                              />
                            </Grid>
                          </Grid>
                          <div className="flex flex-middle" style={{justifyContent: "space-around"}}>
                            <Button
                              className="capitalize"
                              variant="contained"
                              color="primary"
                              type="submit"
                            >
                              {t("Nhận mã OTP")}
                            </Button>
                            <span className="ml-16 mr-8"></span>
                            <Button
                              className="capitalize"
                              onClick={() =>
                                this.props.history.push(ConstantList.ROOT_PATH+"session/signin")
                              }
                            >
                              {t("Quay lại")}
                            </Button>
                          </div>
                      </ValidatorForm>
                      :
                      <ValidatorForm ref="form" onSubmit={this.handleFormSubmitOTPCode} >
                        <Grid container spacing={2}>
                          <Grid item lg={12} md={12} sm={12} xs={12}>
                            <TextValidator
                              className="nice-input w-100 mb-24"
                              label={<span className="font">
                                <span style={{ color: "red" }}> *</span>
                                {t('Mã OTP từ tin nhắn')}
                              </span>
                              }
                              onChange={this.handleChange}
                              type="text"
                              name="otpCode"
                              value={otpCode ? otpCode : ""}
                              validators={["required"]}
                              errorMessages={[t("general.errorMessages_required")]}
                              variant="outlined"
                              size="small"
                            />
                          </Grid>
                        </Grid>
                        <div className="flex flex-middle" style={{justifyContent: "space-around"}}>
                          <Button
                            className="capitalize"
                            variant="contained"
                            color="primary"
                            type="submit"
                          >
                            {t("Xác nhận")}
                          </Button>
                          <span className="ml-16 mr-8"></span>
                          <Button
                            className="capitalize"
                            disabled={waitingForOTP===0?false:true}
                            onClick={() => this.reSendOTP()}
                          >
                            {`Gửi lại mã OTP ${waitingForOTP===0?"":`(${waitingForOTP})`}`}
                          </Button>
                        </div>
                    </ValidatorForm>
                      }
                    </>
                    :
                    <ValidatorForm ref="form" onSubmit={this.handleFormSubmitChangePassword} >
                        <Grid container spacing={2}>
                          <Grid item lg={12} md={12} sm={12} xs={12}>
                            <TextValidator
                              className="nice-input w-100"
                              label={<span className="font">
                                <span style={{ color: "red" }}> *</span>
                                {t('Mật khẩu mới')}
                              </span>
                              }
                              onChange={this.handleChange}
                              type="password"
                              name="password"
                              value={password}
                              validators={["required", "matchRegexp:([A-Za-z0-9]{6,})"]}
                              errorMessages={[
                                t("general.errorMessages_required"),
                                t("user.password_message"),
                              ]}
                              variant="outlined"
                              size="small"
                            />
                          </Grid>
                          <Grid item lg={12} md={12} sm={12} xs={12}>
                            <TextValidator
                              className="nice-input w-100 mb-24"
                              label={<span className="font">
                                <span style={{ color: "red" }}> *</span>
                                {t('Nhập lại mật khẩu')}
                              </span>
                              }
                              onChange={this.handleChange}
                              type="password"
                              name="rePassword"
                              value={rePassword}
                              validators={["required", "isPasswordMatch"]}
                              errorMessages={[
                                t("general.errorMessages_required"),
                                t("user.password_match_message"),
                              ]}
                              variant="outlined"
                              size="small"
                            />
                          </Grid>
                        </Grid>
                        <div className="flex flex-middle" style={{justifyContent: "space-around"}}>
                          <Button
                            className="capitalize"
                            variant="contained"
                            color="primary"
                            type="submit"
                          >
                            {t("Đổi mật khẩu")}
                          </Button>
                          <span className="ml-16 mr-8"></span>
                          <Button
                            className="capitalize"
                            onClick={() =>
                              this.props.history.push(ConstantList.ROOT_PATH+"session/signin")
                            }
                          >
                            {t("sign_in.title")}
                          </Button>
                        </div>
                    </ValidatorForm>
                    }
                  </div>
                </Grid>
              </Grid>
              
            </Card>
          </Grid>
        </Grid>

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
)(ForgotPassword);
