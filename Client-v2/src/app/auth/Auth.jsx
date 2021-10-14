import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import { setUserData } from "../redux/actions/UserActions";
import jwtAuthService from "../services/jwtAuthService";
import localStorageService from "../services/localStorageService";
import firebaseAuthService from "../services/firebase/firebaseAuthService";
import history from "history.js";
import ConstantList from "../appConfig";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure({
  autoClose: 4000,
  draggable: false,
  limit: 3
});

class Auth extends Component {
  state = {};

  constructor(props) {
    super(props);
    axios.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        console.log(error);
        if (error.response == null) {
          return Promise.reject(error);
        } else {
          if (401 === error.response.status) {
            toast.warning('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.');
            jwtAuthService.setSession(null);
            jwtAuthService.removeUser();
            history.push({
              pathname: ConstantList.LOGIN_PAGE,
              // state: { returnUrl: window.location.pathname },
            });
            return Promise.reject(error);
          } else {
            return Promise.reject(error);
          }
        }
      }
    );

    let user = localStorageService.getItem("auth_user");
    let token = localStorageService.getItem("jwt_token");
    //let tokenData = localStorageService.getSessionItem("token_data");
    //console.log(tokenData);
    let expire_time = localStorageService.getSessionItem("token_expire_time");
    let dateObj = new Date(expire_time);
    if (token) {
      jwtAuthService.setSession(token);
    }
    var isExpired = false;
    if (dateObj != null) {
      if (dateObj < Date.now()) {
        isExpired = true;
      }
    }
    if (user != null && (isExpired == false)) {
      this.props.setUserData(user);
    } else {
      if (window.location.pathname == ConstantList.REGISTRY_PAGE) {
        history.push(ConstantList.REGISTRY_PAGE)
      } else if (window.location.pathname == ConstantList.FORGOT_PASSWORD_PAGE) {
        history.push(ConstantList.FORGOT_PASSWORD_PAGE)
      } else {
        history.push(ConstantList.LOGIN_PAGE)
      }
    }

    //this.checkJwtAuth();
    // this.checkFirebaseAuth();
  }

  checkJwtAuth = () => {
    jwtAuthService.loginWithToken().then(user => {
      this.props.setUserData(user);
    });
  };

  checkFirebaseAuth = () => {
    firebaseAuthService.checkAuthStatus(user => {
      if (user) {
        console.log(user.uid);
        console.log(user.email);
        console.log(user.emailVerified);
        console.log(user.getItem);
      } else {
        console.log("not logged in");
      }
    });
  };

  render() {
    const { children } = this.props;
    return <Fragment>{children}</Fragment>;
  }
}

const mapStateToProps = state => ({
  setUserData: PropTypes.func.isRequired,
  login: state.login
});

export default connect(
  mapStateToProps,
  { setUserData }
)(Auth);
