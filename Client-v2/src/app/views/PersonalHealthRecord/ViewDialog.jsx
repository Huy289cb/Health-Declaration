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
  List,
  ListItem,
  ListItemText,
  Typography
} from "@material-ui/core";
import Draggable from 'react-draggable';
import Paper from '@material-ui/core/Paper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BlockIcon from '@material-ui/icons/Block';
import moment from "moment";
import appConfig from "../../appConfig";

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
        pulseRate,
    } = this.state;
    return (
      <Dialog
        className="dialog-container"
        open={open}
        PaperComponent={PaperComponent}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          className="dialog-header bgc-primary-d1"
          // style={{ cursor: 'move' }}
          // id="draggable-dialog-title"
        >
          <span className="mb-20 text-white" > {t("Chi tiết cập nhật thông tin sức khoẻ")} </span>
          <IconButton style={{ position: "absolute", right: "10px", top: "10px" }} onClick={() => handleClose()}>
            <Icon color="disabled">close</Icon>
          </IconButton>
        </DialogTitle>
        <div className="dialog-body">
            <DialogContent className="o-hidden">
            <Grid container spacing={1}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <b>Thời gian khai báo: </b>{moment(declarationTime).format("HH:mm DD/MM/YYYY")}
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <b>Người khai báo: </b>{familyMember.member ? familyMember.member.displayName : ""}
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
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <b>Nhịp thở(lần/phút): </b>
                    {breathingRate ? appConfig.BREATHINGRATE_CONST.find((element) => element.value === breathingRate).key : ""}
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <b>Nhiệt độ (°C): </b>
                    {temperature ? appConfig.TEMPERATURE_CONST.find((element) => element.value === temperature).key : ""}
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <b>Mạch (lần/phút): </b>{pulseRate}
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <b>Chỉ số SpO2: </b>
                    {spo2 ? appConfig.SPO2_CONST.find((element) => element.value === spo2).key : ""}
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <b>Huyết áp tối thiểu: </b>{diastolicBloodPressure}
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <b>Huyết áp tối đa: </b>{systolicBloodPressure}
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <b>Triệu chứng: </b>
                    {(symptomText || (nomalSystoms && nomalSystoms.length > 0) || (severeSymptoms && severeSymptoms.length > 0))
                    ?
                    <ul style={{marginTop: 0, marginBottom: 0}}>
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
            </Grid>
            </DialogContent>
        </div>
        <div className="dialog-footer">
            <DialogActions className="p-0">
            <div className="flex flex-space-between flex-middle">
                <Button
                startIcon={<BlockIcon />}
                variant="contained"
                className="mr-12 btn btn-secondary d-inline-flex"
                color="secondary"
                onClick={() => handleClose()}
                >
                Đóng
                </Button>
            </div>
            </DialogActions>
        </div>
    </Dialog>
    );
  }
}

export default ViewDialog;
