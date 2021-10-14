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
import { resendOtpRegister, createFamily } from "./SessionService";
import InputAdornment from "@material-ui/core/InputAdornment";
import Draggable from 'react-draggable';
import Paper from '@material-ui/core/Paper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SaveIcon from '@material-ui/icons/Save';
import ReplayIcon from '@material-ui/icons/Replay';
import BlockIcon from '@material-ui/icons/Block';
import Autocomplete from "@material-ui/lab/Autocomplete";
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import {
    getByPageByParentId as getAdministrativeUnitByPage,
    getUserById as getAdministrativeUnitById,
    searchByPage as getAdministrativeUnit
} from "../AdministrativeUnit/AdministrativeUnitService";
import "styles/globitsStyles.css";
import history from "history.js";
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

class SignUpInputOTP extends Component {
    state = {
        isAddNew: false,
        otp: null,
        phone: null,
        success: false,
        resendOtp: false,
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

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    componentWillMount() {
        let { item } = this.props;
        this.setState(item);
    }

    resendOtpRegister = () => {
        resendOtpRegister(this.state.phoneNumber).then((response) => {
            if (response && response.data != null && response.status === 200) {
                if (response.data.success) {
                    this.setState({ ...this.state, loading: false });
                    toast.success(response.data.content);
                }
                else {
                    this.setState({ ...this.state, loading: false });
                    toast.warning(response.data.content);
                }
            }
            else {
                this.setState({ ...this.state, loading: false });
                toast.warning('Có lỗi xảy ra khi đăng ký tài khoản, vui lòng thử lại.');
            }
        });
    }

    handleFormSubmit = async () => {
        createFamily(this.state).then((response) => {
            if (response && response.data != null && response.status === 200) {
                if (response.data.success) {
                    this.setState({ ...this.state, loading: false });
                    toast.success('Kích hoạt tài khoản thành công. Mời bạn đăng nhập.');
                    setTimeout(function () {
                        history.push({
                            pathname: '/session/signin'
                        });
                    }, 2000);
                }
                else {
                    this.setState({ ...this.state, loading: false });
                    toast.warning(response.data.content);
                }
            }
            else {
                this.setState({ ...this.state, loading: false });
                toast.warning('Có lỗi xảy ra khi đăng ký tài khoản, vui lòng thử lại.');
            }
        });
    }

    render() {
        let { open, handleClose, t, i18n } = this.props;
        let {
            phoneNumber,
            otp,
            success,
            resendOtp,
            content,
        } = this.state;
        return (
            <Dialog

                open={open}
                PaperComponent={PaperComponent}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle
                // className="dialog-header bgc-primary-d1"
                // style={{ cursor: 'move' }}
                // id="draggable-dialog-title"
                >
                    <span className="mb-20" > Xác nhận OTP </span>
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
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    {content}
                                </Grid>

                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <TextValidator
                                        className="nice-input w-100 mb-24"
                                        label={<span className="font">
                                            <span style={{ color: "red" }}> *</span>
                                            {t('Nhập mã OTP')}
                                        </span>
                                        }
                                        onChange={this.handleChange}
                                        type="text"
                                        name="otp"
                                        value={otp ? otp : ""}
                                        validators={["required"]}
                                        errorMessages={[t("general.errorMessages_required")]}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>
                    </div>
                    <DialogActions spacing={4} className="flex flex-end flex-middle">
                        <Button
                            startIcon={<BlockIcon />}
                            variant="contained"
                            className="mr-12"
                            color="secondary"
                            onClick={() => handleClose()}
                        >
                            {t("general.button.cancel")}
                        </Button>
                        <Button
                            startIcon={<ReplayIcon />}
                            className="mr-12"
                            variant="contained"
                            color="primary"
                            onClick={this.resendOtpRegister}>
                            Gửi lại mã OTP
                        </Button>
                        <Button
                            startIcon={<SaveIcon />}
                            className="mr-12"
                            variant="contained"
                            color="primary"
                            type="submit">
                            Xác nhận
                        </Button>
                    </DialogActions>
                </ValidatorForm>

            </Dialog >
        );
    }
}

export default SignUpInputOTP;
