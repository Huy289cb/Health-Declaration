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
                    <span className="mb-20 text-white" > Th??ng tin l???n khai b??o g???n nh???t </span>
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
                                                <span>Tr???ng th??i x??? l??</span>
                                            }
                                        </InputLabel>
                                        <Select
                                            label={
                                                <span>Tr???ng th??i x??? l??</span>
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
                                        <legend>Th??ng tin chi ti???t</legend>
                                        <Grid container spacing={1}>
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <b>Th???i gian khai b??o: </b>{moment(declarationTime).format("HH:mm DD/MM/YYYY")}
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <b>Lo???i khai b??o: </b>
                                                {type && appConfig.PERSONAL_HEALTH_RECORD_TYPE.map((item) => {
                                                    if (item.key == type) {
                                                        return item.value
                                                    }
                                                })
                                                }
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <b>Ng?????i khai b??o: </b>{familyMember.member ? familyMember.member.displayName : ""}
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <b>T??nh tr???ng hi???n t???i: </b>
                                                {seriusStatus && appConfig.SERIUS_STATUS_CONST.find((element) => element.value === seriusStatus).display}
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <b>X??t nghi???m nhanh: </b> {haveQuickTest ? "C??" : "Kh??ng"}
                                                <ul style={{ marginTop: 0, marginBottom: 0 }}>
                                                    {quickTestDate && <li>
                                                        <b>Ng??y x??t nghi???m: </b>{moment(quickTestDate).format("DD/MM/YYYY")}
                                                    </li>}
                                                    {quickTestResults && <li>
                                                        <b>K???t qu??? x??t nghi???m: </b>{appConfig.RESULT_TEST.find((e) => e.key == quickTestResults).value}
                                                    </li>}
                                                </ul>
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <b>X??t nghi???m PCR: </b> {havePCR ? "C??" : "Kh??ng"}
                                                <ul style={{ marginTop: 0, marginBottom: 0 }}>
                                                    {pcrTestDate && <li>
                                                        <b>Ng??y x??t nghi???m: </b>{moment(pcrTestDate).format("DD/MM/YYYY")}
                                                    </li>}
                                                    {pcrResults && <li>
                                                        <b>K???t qu??? x??t nghi???m: </b>{appConfig.RESULT_TEST.find((e) => e.key == pcrResults).value}
                                                    </li>}
                                                </ul>
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <b>Nh???p th???(l???n/ph??t): </b>
                                                {breathingRate && appConfig.BREATHINGRATE_CONST.find((element) => element.value === breathingRate)
                                                    && appConfig.BREATHINGRATE_CONST.find((element) => element.value === breathingRate).key}
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <b>Nhi???t ????? (??C): </b>
                                                {temperature && appConfig.TEMPERATURE_CONST.find((element) => element.value === temperature)
                                                    && appConfig.TEMPERATURE_CONST.find((element) => element.value === temperature).key}
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <b>Ch??? s??? SpO2: </b>
                                                {spo2 && appConfig.SPO2_CONST.find((element) => element.value === spo2)
                                                    && appConfig.SPO2_CONST.find((element) => element.value === spo2).key}
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <b>Huy???t ??p t???i thi???u: </b>{diastolicBloodPressure}
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <b>Huy???t ??p t???i ??a: </b>{systolicBloodPressure}
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <b>Tri???u ch???ng: </b>
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
                                                    : "Kh??ng"
                                                }
                                            </Grid>
                                            {type != appConfig.GET_PERSONAL_HEALTH_RECORD_TYPE.family &&
                                                <> 
                                                    <Grid item lg={6} md={6} sm={12} xs={12}>
                                                        <b>Ghi ch??: </b>{otherInformation ? otherInformation : "Kh??ng"}
                                                    </Grid>
                                                    <Grid item lg={6} md={6} sm={12} xs={12}>
                                                        <b>H?????ng x??? l??: </b>
                                                        {makeDecision && appConfig.ENCOUNTER_MAKE_DECISION.find((e) => e.key === makeDecision).description}
                                                    </Grid>
                                                </>
                                            }
                                            {/* {makeDecision && makeDecision === "decision1" &&
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <b>????n v??? y t???: </b>
                                                {healthOrganization ? healthOrganization.name : ""}
                                            </Grid>}     */}
                                            
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
                            ????ng
                        </Button>
                        <Button
                            startIcon={<SaveIcon />}
                            className="mr-12 btn btn-primary-d d-inline-flex"
                            variant="contained"
                            color="primary"
                            type="submit"
                        >
                            L??u
                        </Button>
                    </DialogActions>
                </ValidatorForm>
            </Dialog>
        );
    }
}

export default ViewDialog;