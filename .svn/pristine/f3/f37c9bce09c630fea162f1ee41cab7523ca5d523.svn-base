import React, { Component } from "react";
import ConstantList from "../../appConfig";
import {
  Card,
  Checkbox,
  InputAdornment,
  Input,
  FormControlLabel,
  Grid,
  Button,
  withStyles,
  CircularProgress,
  FormControl
} from "@material-ui/core";
import { ValidatorForm } from "react-material-ui-form-validator";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import { withRouter } from "react-router-dom";
import { loginWithEmailAndPassword } from "../../redux/actions/LoginActions";
import localStorageService from "app/services/localStorageService";
import PersonIcon from '@material-ui/icons/Person';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import './SignIn.scss';

const styles = theme => ({
  wrapper: {
    position: "relative"
  },

  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12
  }
});

class SignIn extends Component {
  state = {
    email: localStorageService.getItem("rememberAccount")?.email,
    password: localStorageService.getItem("rememberAccount")?.password,
    agreement: "",
    rememberAccount: localStorageService.getItem("rememberAccount")?.rememberAccount,
  };
  handleChange = event => {
    event.persist();
    this.setState({
      [event.target.name]: event.target.value
    });
    if (localStorageService.getItem("rememberAccount")?.rememberAccount) {
      localStorageService.setItem("rememberAccount", {...localStorageService.getItem("rememberAccount"), [event.target.name] :event.target.value });
    }
  };
  handleFormSubmit = event => {
    this.props.loginWithEmailAndPassword({ ...this.state });
  };
  setRememberAccount(event) {
    let { email,password} = this.state;
    this.setState({
      [event.target.name]: event.target.checked
    });
    if (event.target.checked) {
      localStorageService.setItem("rememberAccount", {rememberAccount: event.target.checked, email:email, password:password })
    } else {
      localStorageService.removeItem("rememberAccount");
    }
    
  }
  render() {
    const { t, i18n,  } = this.props;
    let { email, password, rememberAccount } = this.state;
    let { classes} = this.props;
    return (
      <div className="signup flex w-100 h-100vh">
        <Grid container >
          <Grid className="" item lg={12} md={12} sm={12} xs={12}>
            <Card className="signup-card position-relative y-center h-100vh">
              <Grid className="login-right-side" item lg={6} md={6} sm={12} xs={12} >
                <img src={ConstantList.ROOT_PATH + "assets/images/background/login-bg-1.png"} alt="" />
              </Grid>
              <Grid className="login-left-side" item lg={6} md={6} sm={12} xs={12}>
                <Grid item md={8} sm={8} xs={10} style={{ margin: 'auto', textAlign: 'center' }}>
                  <h2>{t('sign_in.title')}</h2>
                  <div className="p-36 h-100 position-relative">
                    <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
                      <Grid
                        className="mb-24 flex login-user-input"
                        alignItems='center'
                      >
                        <div class='w-100'>
                          <FormControl
                            fullWidth
                            required='true'

                          >
                            <Input
                              className=" w-100"
                              onChange={this.handleChange}
                              placeholder={t('user.username')}
                              type="text"
                              name="email"
                              variant="outlined"
                              value={email}

                              startAdornment={
                                <InputAdornment>
                                  <PersonIcon style={{ color: '#2a80c8' }} />
                                </InputAdornment>
                              }
                            />
                          </FormControl>

                        </div>

                      </Grid>
                      <Grid
                        className='flex login-password-input'
                        alignItems='center'
                      >
                        <div class='w-100'>
                          <FormControl
                            fullWidth
                            required='true'
                          >
                            <Input
                              className=" w-100"
                              onChange={this.handleChange}
                              placeholder={t('user.password')}
                              type="password"
                              name="password"
                              variant="outlined"
                              value={password}

                              startAdornment={
                                <InputAdornment>
                                  <VpnKeyIcon style={{ color: '#2a80c8' }} />
                                </InputAdornment>
                              }
                            />
                          </FormControl>
                        </div>
                      </Grid>

                      <Grid className='mb-24' item xs={12} sm={12} md={12} style={{ display: 'flex', justifyContent: "space-between" }}>
                        <FormControlLabel
                          value={rememberAccount}
                          control={
                            <Checkbox
                              id="rememberAccount"
                              className="remember-account"
                              checked={rememberAccount}
                              onChange={e => this.setRememberAccount(e)}
                              name="rememberAccount"
                              value={rememberAccount}
                              inputProps={{
                                "aria-label":
                                  "primary checkbox",
                              }}
                            />
                          }
                          label={t("user.remember_me")}
                          labelPlacement="end"
                        />
                        <Button
                          className="capitalize"
                          onClick={() =>
                            this.props.history.push(ConstantList.ROOT_PATH + "session/forgot-password")
                          }
                        >
                          {t("Quên mật khẩu?")}
                        </Button>
                      </Grid>

                      <Grid container spacing={3}>
                        <Grid item md={6} xs={12} sm={12}>
                          <div className="flex flex-middle mb-8">
                            <div className={classes.wrapper} style={{ width: "100%" }}>
                              <Button
                                variant="contained"
                                color="primary"
                                disabled={this.props.login.loading}
                                type="submit"
                              >
                                {t("sign_in.title")}
                              </Button>
                              {this.props.login.loading && (
                                <CircularProgress
                                  size={24}
                                  className={classes.buttonProgress}
                                />
                              )}
                            </div>
                          </div>
                        </Grid>
                        <Grid item md={6} xs={12} sm={12}>
                          <div className="flex flex-middle mb-8">
                            <div className={classes.wrapper} style={{ width: "100%" }}>
                              <Button
                                variant="contained"
                                color="secondary"
                                disabled={this.props.login.loading}
                                onClick={() => {
                                  this.props.history.push({
                                    pathname: '/session/signup'
                                  });
                                }}
                                type="button"
                              >
                                {t("sign_up.title")}
                              </Button>
                              {this.props.login.loading && (
                                <CircularProgress
                                  size={24}
                                  className={classes.buttonProgress}
                                />
                              )}
                            </div>
                          </div>
                        </Grid>
                      </Grid>

                    </ValidatorForm>
                  </div>
                </Grid>
              </Grid>

            </Card>
          </Grid>
        </Grid>

      </div>

    );
  }
}

const mapStateToProps = state => ({
  loginWithEmailAndPassword: PropTypes.func.isRequired,
  login: state.login
});
export default withStyles(styles, { withTheme: true })(
  withRouter(
    connect(
      mapStateToProps,
      { loginWithEmailAndPassword }
    )(SignIn)
  )
);
