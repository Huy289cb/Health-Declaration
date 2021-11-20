import React, { Component } from "react";
import {
    Dialog,
    Button,
    Grid,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Icon,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@material-ui/core";
import Draggable from 'react-draggable';
import Paper from '@material-ui/core/Paper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BlockIcon from '@material-ui/icons/Block';
import moment from "moment";
import appConfig from "../../appConfig";
import { ValidatorForm } from "react-material-ui-form-validator";
import SaveIcon from '@material-ui/icons/Save';
import { updateStaus } from "../PersonalHealthRecord/PersonalHealthRecordService";

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

class ViewDialog extends Component {
    state = {

    };

    componentWillMount() {
        let { item } = this.props;
        this.setState({ ...item });
    }

    handleFormSubmit = () => {
        const { t } = this.props;
        let obj = {};
        obj.id = this.state.id;
        obj.resolveStatus = this.state.resolveStatus;
        obj.practitioner = this.state.practitioner;
        obj.medicalTeam = this.state.medicalTeam;
        obj.type = this.state.type;
        updateStaus(obj).then((res) => {
            if (res.data != null && res.status === 200) {
                toast.success(t('toast.update_success'));
                this.props.handleClose();
            }
        })
    }

    render() {
        let { open, handleClose, t } = this.props;
        let {
            declarationTime,
            familyMember,
            spo2,
            breathingRate,
            temperature,
            nomalSystoms,
            severeSymptoms,
            resolveStatus,
            seriusStatus,
            haveSymptom,
            symptomText,
            haveTest,
            haveQuickTest,
            quickTestDate,
            quickTestResults,
            havePCR,
            pcrTestDate,
            pcrResults,
            systolicBloodPressure,
            diastolicBloodPressure,
            otherInformation,
            type,
            makeDecision,
            healthOrganization
        } = this.state;
        console.log(this.state);
        return (
            <Dialog
                className="dialog-container"
                open={open}
                PaperComponent={PaperComponent}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle
                    className="dialog-header bgc-primary-d1"
                //   style={{ cursor: 'move' }}
                //   id="draggable-dialog-title"
                >
                    <span className="mb-20 text-white" > {t("Thông tin lần khai báo gần nhất")} </span>
                    <IconButton style={{ position: "absolute", right: "5px", top: "5px" }} onClick={() => handleClose()}>
                        <Icon color="disabled" title={t("general.button.close")}>close</Icon>
                    </IconButton>
                </DialogTitle>
                <ValidatorForm ref="form" onSubmit={this.handleFormSubmit} style={{
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column"
                }}>
                    <div className="">
                        <DialogContent className="o-hidden">
                            <Grid container spacing={1}>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <FormControl fullWidth={true} variant="outlined" size="small">
                                        <InputLabel htmlFor="temperature-simple">
                                            {
                                                <span>Trạng thái xử lý</span>
                                            }
                                        </InputLabel>
                                        <Select
                                            label={
                                                <span>Trạng thái xử lý</span>
                                            }
                                            value={resolveStatus ? resolveStatus : ""}
                                            onChange={(event) => {
                                                this.setState({ resolveStatus: event.target.value })
                                            }}
                                            inputProps={{
                                                name: "resolveStatus",
                                                id: "resolveStatus-simple",
                                            }}
                                            validators={["required"]}
                                            errorMessages={[t("general.required")]}
                                        >
                                            {appConfig.RESOLVE_STATUS_CONST.map((item) => {
                                                return (
                                                    <MenuItem key={item.key} value={item.value}>
                                                        {item.display ? item.display : ""}
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <fieldset>
                                        <legend>Thông tin chi tiết</legend>
                                        <Grid container spacing={1}>
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <b>Thời gian khai báo: </b>{moment(declarationTime).format("HH:mm DD/MM/YYYY")}
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <b>Loại khai báo: </b>
                                                {type && appConfig.PERSONAL_HEALTH_RECORD_TYPE.map((item) => {
                                                    if (item.key == type) {
                                                        return item.value
                                                    }
                                                })
                                                }
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <b>Người khai báo: </b>{familyMember.member ? familyMember.member.displayName : ""}
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <b>Tình trạng hiện tại: </b>
                                                {seriusStatus && appConfig.SERIUS_STATUS_CONST.find((element) => element.value === seriusStatus).display}
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <b>Xét nghiệm nhanh: </b> {haveQuickTest ? "Có" : "Không"}
                                                <ul style={{ marginTop: 0, marginBottom: 0 }}>
                                                    {quickTestDate && <li>
                                                        <b>Ngày xét nghiệm: </b>{moment(quickTestDate).format("DD/MM/YYYY")}
                                                    </li>}
                                                    {quickTestResults && <li>
                                                        <b>Kết quả xét nghiệm: </b>{appConfig.RESULT_TEST.find((e) => e.key == quickTestResults).value}
                                                    </li>}
                                                </ul>
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <b>Xét nghiệm PCR: </b> {havePCR ? "Có" : "Không"}
                                                <ul style={{ marginTop: 0, marginBottom: 0 }}>
                                                    {pcrTestDate && <li>
                                                        <b>Ngày xét nghiệm: </b>{moment(pcrTestDate).format("DD/MM/YYYY")}
                                                    </li>}
                                                    {pcrResults && <li>
                                                        <b>Kết quả xét nghiệm: </b>{appConfig.RESULT_TEST.find((e) => e.key == pcrResults).value}
                                                    </li>}
                                                </ul>
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <b>Nhịp thở(lần/phút): </b>
                                                {breathingRate && appConfig.BREATHINGRATE_CONST.find((element) => element.value === breathingRate)
                                                    && appConfig.BREATHINGRATE_CONST.find((element) => element.value === breathingRate).key}
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <b>Nhiệt độ (°C): </b>
                                                {temperature && appConfig.TEMPERATURE_CONST.find((element) => element.value === temperature)
                                                    && appConfig.TEMPERATURE_CONST.find((element) => element.value === temperature).key}
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <b>Chỉ số SpO2: </b>
                                                {spo2 && appConfig.SPO2_CONST.find((element) => element.value === spo2)
                                                    && appConfig.SPO2_CONST.find((element) => element.value === spo2).key}
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <b>Huyết áp tối thiểu: </b>{diastolicBloodPressure}
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <b>Huyết áp tối đa: </b>{systolicBloodPressure}
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <b>Triệu chứng: </b>
                                                {(symptomText || (nomalSystoms && nomalSystoms.length > 0) || (severeSymptoms && severeSymptoms.length > 0))
                                                    ?
                                                    <ul style={{ marginTop: 0, marginBottom: 0 }}>
                                                        {symptomText &&
                                                            <li>{symptomText}</li>
                                                        }
                                                        {nomalSystoms && nomalSystoms.map((item) => (
                                                            <li>{item.symptom ? item.symptom.name : ""}</li>
                                                        ))}
                                                        {severeSymptoms && severeSymptoms.map((item) => (
                                                            <li>{item.symptom ? item.symptom.name : ""}</li>
                                                        ))}
                                                    </ul>
                                                    : "Không"
                                                }
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <b>Ghi chú: </b>{otherInformation ? otherInformation : "Không"}
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <b>Hướng xử lý: </b>
                                                {makeDecision && appConfig.ENCOUNTER_MAKE_DECISION.find((e) => e.key === makeDecision).description}
                                            </Grid>
                                            {makeDecision && makeDecision === "decision1" &&
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <b>Đơn vị y tế: </b>
                                                {healthOrganization ? healthOrganization.name : ""}
                                            </Grid>}    
                                            
                                        </Grid>
                                    </fieldset>
                                </Grid>
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
                            Đóng
                        </Button>
                        <Button
                            startIcon={<SaveIcon />}
                            className="mr-12 btn btn-primary-d d-inline-flex"
                            variant="contained"
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

export default ViewDialog;