import React from "react";
import { toast } from "react-toastify";
import ConstantList from "../../appConfig";
import "react-toastify/dist/ReactToastify.css";
import "styles/globitsStyles.css";
import { getAllInfoByUserLogin } from "../User/UserService";
import moment from "moment";
import {
  Button,
  Grid,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  TextField,
  FormLabel,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  IconButton,
  Icon
} from "@material-ui/core";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import FamilyInputPopup from "../Component/SelectFamilyPopup/InputPopup"
import Autocomplete from "@material-ui/lab/Autocomplete";
import SaveIcon from '@material-ui/icons/Save';
import BlockIcon from '@material-ui/icons/Block';
import { getById as getFamilyById } from "../Family/Service";
import { searchByPage as getSymptoms } from "../Symptom/SymptomService";
import { addNew, update, searchByPage, getById } from "./EncounterService";
import MaterialTable from 'material-table';
import NicePagination from '../Component/Pagination/NicePagination';
//import ViewDialog from "./EncounterDialog";

toast.configure({
  autoClose: 2000,
  draggable: false,
  limit: 3,
});

class CreateEncounter extends React.Component {
  state = {
    id: null,
    type: null,
    family: null,
    familyMember: null,
    name: "",
    code: "",
    level: 0,
    parent: {},
    nomalSystoms: [],
    severeSymptoms: [],
    shouldOpenSelectParentPopup: false,
    parentId: "",
    rowsPerPage: 10,
    page: 1,
    text: '',
    totalPages: 10,
    haveTest: null,
    haveQuickTest: null,
    quickTestResults: null,
    havePCR: null,
    pcrResults: null,
    openViewDialog: false,
    makeDecision: null,
  };

  handleChange = (event, source) => {
    event.persist();
    if (source === "switch") {
      this.setState({ isActive: event.target.checked });
      return;
    }
    this.setState({
      [event.target.name]: event.target.value,
    });
    if (source == "haveTest") {
      this.setState({
        haveTest: event.target.checked
      });
      return;
    }
    if (source == "haveQuickTest") {
      this.setState({
        haveQuickTest: event.target.checked
      });
      return;
    }
    if (source == "havePCR") {
      this.setState({
        havePCR: event.target.checked
      });
      return;
    }
  };
  openCircularProgress = () => {
    this.setState({ loading: true });
  };

  handleFormSubmit = async () => {
    await this.openCircularProgress();
    let { id } = this.state;
    let { t } = this.props;
    // console.log(this.state);
    let obj = {};
    obj.id = id;
    obj.type = this.state.type;
    obj.practitioner = this.state.practitioner;
    obj.family = this.state.family;
    obj.familyMember = this.state.familyMember;
    obj.spo2 = this.state.spo2;
    obj.breathingRate = this.state.breathingRate;
    obj.haveTest = this.state.haveTest;
    obj.haveQuickTest = this.state.haveQuickTest;
    obj.havePCR = this.state.havePCR;
    obj.pcrResults = this.state.pcrResults;
    obj.quickTestResults = this.state.quickTestResults;
    obj.makeDecision = this.state.makeDecision;
    obj.temperature = this.state.temperature;
    obj.bloodPressure = this.state.bloodPressure;
    obj.initialHandle = this.state.initialHandle;
    obj.otherInformation = this.state.otherInformation;
    obj.exposureHistory = this.state.exposureHistory;
    obj.examinationTime = this.state.examinationTime;
    if (this.state.familyMember && this.state.familyMember.member && this.state.familyMember.member.weight) {
      obj.weight = this.state.familyMember.member.weight;
    }

    if (this.state.nomalSystoms) {
      let c = [];
      this.state.nomalSystoms.forEach((e) => {
        let p = {};
        p.symptom = e;
        c.push(e);
      })
      obj.nomalSystoms = c;
    }
    if (this.state.severeSymptoms) {
      let c = [];
      this.state.severeSymptoms.forEach((e) => {
        let p = {};
        p.symptom = e;
        c.push(e);
      })
      obj.severeSymptoms = c;
    }

    if (this.validateData(obj)) {
      if (id) {
        update(obj, id).then(() => {
          toast.success(t('Cập nhật phiếu thăm khám thành công'));
          this.setState({
            loading: false,
            nomalSystoms: [],
            severeSymptoms: [],
            listNormalSymptom: [],
            listSevereSymptom: [],
            breathingRate: "",
            spo2: "",
            haveTest: null,
            haveQuickTest: null,
            quickTestResults: null,
            havePCR: null,
            pcrResults: null,
            openViewDialog: false,
            makeDecision: null,
            temperature: null,
            bloodPressure: null,
            otherInformation: null,
            initialHandle: null,
            exposureHistory: null,
            examinationTime: null,
          }, this.updatePageData());
        });
      } else {
        addNew(obj).then((response) => {
          if (response.data != null && response.status == 200) {
            // this.state.id = response.data.id
            this.setState({
              loading: false,
              nomalSystoms: [],
              severeSymptoms: [],
              listNormalSymptom: [],
              listSevereSymptom: [],
              breathingRate: "",
              spo2: "",
              haveTest: null,
              haveQuickTest: null,
              quickTestResults: null,
              havePCR: null,
              pcrResults: null,
              openViewDialog: false,
              makeDecision: null,
              temperature: null,
              bloodPressure: null,
              otherInformation: null,
              initialHandle: null,
              exposureHistory: null,
              examinationTime: null,
            }, this.updatePageData());
            toast.success(t('Cập nhật phiếu thăm khám thành công'));
          }
        });
      }
    }
  };

  componentDidMount() {
    let obj = {
      pageSize: 1000,
      pageIndex: 0
    }
    getSymptoms(obj).then(({ data }) => {
      if (data && data.content) {
        let listNormalSymptom = [];
        let listSevereSymptom = [];
        data.content.forEach((item) => {
          if (item.type) {
            if (item.type == "type1") {
              listNormalSymptom.push(item);
            }
            if (item.type == "type2") {
              listSevereSymptom.push(item);
            }
          }
        })
        this.setState({ listNormalSymptom, listSevereSymptom });
      }
    })
  }
  componentWillMount() {
    let { location } = this.props;
    //get practitioner nếu user đăng nhập là nhân viên y tế
    getAllInfoByUserLogin().then((resp) => {
      let data = resp ? resp.data : null;
      if (data && data.practitioner && data.practitioner.id) {
        this.setState({ practitioner: { id: data.practitioner.id } }, () => {
        });
      }
    })

    var familyMember, familyMemberId = null;
    if (location.state && location.state.familyMember) {
      familyMemberId = location.state.familyMember.id;
      if (location.state.familyMember.family && location.state.familyMember.family.id) {

        getFamilyById(location.state.familyMember.family.id).then(({ data }) => {
          if (data && data.id) {
            this.setState({ family: data }, () => {
              let { family } = this.state;
              if (family.familyMembers && familyMemberId) {
                const familyMember = family.familyMembers.find(element => element.id == familyMemberId);
                if (familyMember) {
                  this.setState({ familyMember: familyMember, familyMemberId: familyMemberId }, () => {
                    this.changeFamilyMember(familyMemberId);
                    this.updatePageData();
                  });
                }
              }
            });
          }
        })
      }
    }
  }

  validateData = (data) => {
    if (data) {
      if (!data.type) {
        toast.warning("Chưa chọn loại thăm khám.");
        return false;
      }
      else if (!data.family || !data.family.id) {
        toast.warning("Chưa chọn hộ gia đình.");
        return false;
      }
      else if (!data.familyMember || !data.familyMember.id) {
        toast.warning("Chưa chọn thành viên trong hộ gia đình.");
        return false;
      }
      else if (!data.makeDecision) {
        toast.warning("Chưa chọn quyết định.");
        return false;
      }
      else {
        return true;
      }
    }
    else {
      return false;
    }
  };

  //history table
  //Paging handle start
  setPage = (page) => {
    this.setState({ page }, function () {
      this.updatePageData()
    })
  }
  setRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value, page: 1 }, function () {
      this.updatePageData()
    })
  }
  handleChangePage = (event, newPage) => {
    this.setPage(newPage)
  }
  //Paging handle end
  updatePageData = (item) => {
    let obj = {
      pageSize: 1000,
      pageIndex: 0
    }
    getSymptoms(obj).then(({ data }) => {
      if (data && data.content) {
        let listNormalSymptom = [];
        let listSevereSymptom = [];
        data.content.forEach((item) => {
          if (item.type) {
            if (item.type == "type1") {
              listNormalSymptom.push(item);
            }
            if (item.type == "type2") {
              listSevereSymptom.push(item);
            }
          }
        })
        this.setState({ listNormalSymptom, listSevereSymptom });
      }
    })
    var searchObject = {};
    if (item != null) {
      this.setState({
        page: 1,
        text: item.text,
        orgType: item.orgType,
      }, () => {
        searchObject.text = this.state.text;
        searchObject.pageIndex = this.state.page;
        searchObject.pageSize = this.state.rowsPerPage;
        searchObject.familyMemberId = this.state.familyMemberId;
        searchByPage(searchObject).then(({ data }) => {
          this.setState({
            itemList: [...data.content],
            totalElements: data.totalElements,
            totalPages: data.totalPages
          })
          if (data.content && data.content.length > 0) {
            this.setState({
            })
          }
        }
        );
      })
    } else {
      searchObject.text = this.state.text;
      searchObject.pageIndex = this.state.page;
      searchObject.pageSize = this.state.rowsPerPage;
      searchByPage(searchObject).then(({ data }) => {
        this.setState({
          itemList: [...data.content],
          totalElements: data.totalElements,
          totalPages: data.totalPages,
        })
        if (data.content && data.content.length > 0) {
          this.setState({
            contactPersonName: data.content[0].contactPersonName,
            contactPersonPhone: data.content[0].contactPersonPhone,
            contactPersonRelation: data.content[0].contactPersonRelation,
          })
        }
      });
    }
  };

  handleClose = () => {
    this.setState({
      openViewDialog: false,
    }, () => {
      this.updatePageData();
    });
  };

  renderSelectOptions = () => {

    if (this.state && this.state.family && this.state.family.familyMembers) {
      return this.state.family.familyMembers.map((item, i) => {
        return (
          <MenuItem key={item.id} value={item.id}>
            {item.member && item.member.displayName ? item.member.displayName : ""}
          </MenuItem>
        );
      });
    }
  }

  changeFamilyMember = (familyMemberId) => {
    let {family} = this.state;
    let familyMember = family && family.familyMembers ? family.familyMembers.find(element => element.id == familyMemberId) : null;
    if (familyMember && familyMember.id) {
      this.setState({ familyMemberId: familyMember.id, familyMember: familyMember })
      if (familyMember) {
        let str = "";
        familyMember.member && familyMember.member.listBackgroundDisease
          && familyMember.member.listBackgroundDisease.forEach((e) => {
            console.log(e.backgroundDisease.name);
            str += e.backgroundDisease.name + ", "
          });
        str = str.replace(/,\s*$/, "");
        this.setState({ anamnesis: str }, () => {
          this.updatePageData();
        });
      }
    }
  }

  render() {
    let { t } = this.props;
    let {
      id,
      type,
      family,
      familyMember,
      nomalSystoms,
      severeSymptoms,
      listNormalSymptom,
      listSevereSymptom,
      breathingRate,
      spo2,
      anamnesis,
      familyMemberId,
      haveTest,
      haveQuickTest,
      quickTestResults,
      havePCR,
      pcrResults,
      makeDecision,
      temperature,
      bloodPressure,
      otherInformation,
      initialHandle,
      exposureHistory,
      examinationTime,
    } = this.state;
    return (
      <>
        <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
          <DialogContent style={{ backgroundColor: "#fff" }}>
            <fieldset>
              <legend>Phiếu thăm khám</legend>
              <Grid className="" container spacing={2} style={{ padding: "8px" }}>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                  <FormControl fullWidth={true} variant="outlined" size="small">
                    <InputLabel htmlFor="type-simple">
                      {
                        <span>
                          <span style={{ color: "red" }}> * </span>
                          <span>{t("Loại thăm khám")}</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      label={
                        <span>{t("Loại thăm khám")}</span>
                      }
                      value={type ? type : ""}
                      onChange={(event) => {
                        this.setState({ type: event.target.value })
                      }}
                      inputProps={{
                        name: "type",
                        id: "type-simple",
                      }}
                    >
                      {ConstantList.ENCOUNTER_TYPE && ConstantList.ENCOUNTER_TYPE.map((item) => {
                        return (
                          <MenuItem key={item.key} value={item.key}>
                            {item.description ? item.description : ""}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                {<Grid item sm={8} xs={8}>
                  <FamilyInputPopup
                    family={family}
                    setFamily={(item) => {
                      this.setState({ family: item });
                    }}
                    size="small"
                    variant="outlined"
                    label={
                      <span className="font">
                        <span style={{ color: "red" }}> *</span>
                        {t("Hộ gia đình")}
                      </span>
                    }
                  />
                </Grid>}
                <Grid item lg={4} md={4} sm={12} xs={12}>
                  <FormControl fullWidth={true} variant="outlined" size="small">
                    <InputLabel htmlFor="familyMembers-simple">
                      {
                        <span className="">
                          <span style={{ color: "red" }}> * </span>
                          {t("Chọn thành viên gia đình")}
                        </span>
                      }
                    </InputLabel>
                    <Select
                      label={<span className="">
                        <span style={{ color: "red" }}> * </span>
                        {t("Chọn thành viên gia đình")}
                      </span>}
                      value={familyMemberId ? familyMemberId : ''}
                      onChange={(event) => this.changeFamilyMember(event.target.value)}
                      inputProps={{
                        name: "familyMembers",
                        id: "familyMembers-simple",
                      }}
                      validators={["required"]}
                      errorMessages={[t("general.required")]}
                    >
                      {family && family.familyMembers && this.renderSelectOptions()}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                  <TextValidator
                    className="w-100"
                    label={t("Họ tên")}
                    disabled
                    // onChange={this.handleChange}
                    type="text"
                    name="name"
                    value={familyMember ? (familyMember.member ? familyMember.member.displayName : "") : ""}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                  <TextValidator
                    className="w-100"
                    label={t("Số thẻ BHYT")}
                    disabled
                    // onChange={this.handleChange}
                    type="text"
                    name="healthInsuranceCardNumber"
                    value={familyMember ? (familyMember.member ? (familyMember.member.healthInsuranceCardNumber ? familyMember.member.healthInsuranceCardNumber : "") : "") : ""}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                {/* <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Grid container spacing={1}> */}
                <Grid item lg={2} md={2} sm={6} xs={6}>
                  <TextValidator
                    className="w-100"
                    label={t("Tuổi")}
                    disabled
                    // onChange={this.handleChange}
                    type="number"
                    name="age"
                    value={familyMember ? (familyMember.member ? familyMember.member.age : "") : ""}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item lg={2} md={2} sm={6} xs={6}>
                  <TextValidator
                    className="w-100"
                    label={t("Giới tính")}
                    disabled
                    // onChange={this.handleChange}
                    type="text"
                    name="gender"
                    value={familyMember ? (familyMember.member ? (familyMember.member.gender == "F" ? "Nữ" : "Nam") : "") : ""}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                {/* <Grid item lg={2} md={2} sm={6} xs={6}>
                      <TextValidator
                        className="w-100"
                        label={t("Chiều cao")}
                        disabled
                        // onChange={this.handleChange}
                        type="text"
                        name="height"
                        value={familyMember ? (familyMember.member ? familyMember.member.height : "") : ""}
                        variant="outlined"
                        size="small"
                      />
                    </Grid> */}
                <Grid item lg={2} md={2} sm={12} xs={12}>
                  <TextValidator
                    className="w-100"
                    label={t("Cân nặng(kg)")}
                    // disabled={(familyMember && familyMember.member) ? true : false}
                    onChange={(event) => {
                      // if (familyMember && familyMember.member) {
                      familyMember.member.weight = event.target.value;
                      this.setState({ familyMember });
                      // }
                    }}
                    type="number"
                    name="weight"
                    value={familyMember ? (familyMember.member ? (familyMember.member.weight ? familyMember.member.weight : "") : "") : ""}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                {/* </Grid>
                </Grid> */}
                <Grid item lg={2} md={2} sm={12} xs={12}>
                  <TextValidator
                    className="w-100"
                    label={t("Số điện thoại")}
                    disabled
                    // onChange={this.handleChange}
                    type="text"
                    name="phoneNumber"
                    value={familyMember ? (familyMember.member ? (familyMember.member.phoneNumber ? familyMember.member.phoneNumber : "") : "") : ""}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                  <TextValidator
                    className="w-100"
                    label={t("Email")}
                    disabled
                    // onChange={this.handleChange}
                    type="text"
                    name="email"
                    value={familyMember ? (familyMember.member ? (familyMember.member.email ? familyMember.member.email : "") : "") : ""}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <TextField
                    className="w-100"
                    label={t("Tiền sử bệnh")}
                    disabled
                    // onChange={this.handleChange}
                    type="text"
                    name="healthInsuranceCardNumber"
                    value={anamnesis ? anamnesis : ""}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <fieldset>
                    <legend>Các chỉ số: </legend>
                    <Grid container spacing={2} style={{ padding: "4px" }}>
                      <Grid item lg={3} md={3} sm={12} xs={12}>
                        <FormControl fullWidth={true} variant="outlined" size="small">
                          <InputLabel htmlFor="temperature-simple">
                            {
                              <span>{t("Nhiệt độ (°C)")}</span>
                            }
                          </InputLabel>
                          <Select
                            label={
                              <span>{t("Nhiệt độ (°C)")}</span>
                            }
                            value={temperature ? temperature : ""}
                            onChange={(event) => {
                              this.setState({ temperature: event.target.value })
                            }}
                            inputProps={{
                              name: "temperature",
                              id: "temperature-simple",
                            }}
                            validators={["required"]}
                            errorMessages={[t("general.required")]}
                          >
                            {ConstantList.TEMPERATURE_CONST && ConstantList.TEMPERATURE_CONST.map((item) => {
                              return (
                                <MenuItem key={item.key} value={item.value}>
                                  {item.key ? item.key : ""}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item lg={3} md={3} sm={12} xs={12}>
                        <FormControl fullWidth={true} variant="outlined" size="small">
                          <InputLabel htmlFor="breathingRate-simple">
                            {
                              <span>{t("Nhịp thở (lần/phút)")}</span>
                            }
                          </InputLabel>
                          <Select
                            label={
                              <span>{t("Nhịp thở (lần/phút)")}</span>
                            }
                            value={breathingRate ? breathingRate : ""}
                            onChange={(event) => {
                              this.setState({ breathingRate: event.target.value })
                            }}
                            inputProps={{
                              name: "breathingRate",
                              id: "breathingRate-simple",
                            }}
                            validators={["required"]}
                            errorMessages={[t("general.required")]}
                          >
                            {ConstantList.BREATHINGRATE_CONST && ConstantList.BREATHINGRATE_CONST.map((item) => {
                              return (
                                <MenuItem key={item.key} value={item.value}>
                                  {item.key ? item.key : ""}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item lg={3} md={3} sm={12} xs={12}>
                        <FormControl fullWidth={true} variant="outlined" size="small">
                          <InputLabel htmlFor="spo2-simple">
                            {
                              <span>{t("Chỉ số SpO2")}</span>
                            }
                          </InputLabel>
                          <Select
                            label={
                              <span>{t("Chỉ số SpO2")}</span>
                            }
                            value={spo2 ? spo2 : ""}
                            onChange={(event) => {
                              this.setState({ spo2: event.target.value })
                            }}
                            inputProps={{
                              name: "spo2",
                              id: "spo2-simple",
                            }}
                          // validators={["required"]}
                          // errorMessages={[t("general.required")]}
                          >
                            {ConstantList.SPO2_CONST && ConstantList.SPO2_CONST.map((item) => {
                              return (
                                <MenuItem key={item.key} value={item.value}>
                                  {item.key ? item.key : ""}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item lg={3} md={3} sm={12} xs={12}>
                        <TextValidator
                          className="w-100"
                          label={
                            <span className="font">
                              {t("Huyết áp")}
                            </span>
                          }
                          onChange={this.handleChange}
                          type="number"
                          name="bloodPressure"
                          value={bloodPressure}
                          variant="outlined"
                          size="small"
                        />
                      </Grid>

                    </Grid>
                  </fieldset>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <fieldset>
                    <legend>Thông số xét nghiệm: </legend>
                    <Grid container spacing={2} style={{ padding: "4px" }}>
                      <Grid item lg={4} md={4} sm={12} xs={12}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={haveTest}
                              onChange={(value) => { this.handleChange(value, "haveTest") }}
                              name="haveTest"
                            />
                          }
                          label="Có xét nghiệm"
                        />
                      </Grid>
                      <Grid item lg={4} md={4} sm={12} xs={12}>
                        <div style={{ display: haveTest ? "block" : "none" }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={haveQuickTest}
                                onChange={(value) => { this.handleChange(value, "haveQuickTest") }}
                                name="haveQuickTest"
                              />
                            }
                            label="Có xét nghiệm nhanh"
                          />
                          <div style={{ display: haveQuickTest ? "block" : "none" }}>

                            <FormControl fullWidth={true} variant="outlined" size="small">
                              <InputLabel htmlFor="quickTestResults-simple">
                                {
                                  <span>{t("Kết quả xét nghiệm nhanh")}</span>
                                }
                              </InputLabel>
                              <Select
                                label={
                                  <span>{t("Kết quả xét nghiệm nhanh")}</span>
                                }
                                value={quickTestResults ? quickTestResults : ""}
                                onChange={(event) => {
                                  this.setState({ quickTestResults: event.target.value })
                                }}
                                inputProps={{
                                  name: "quickTestResults",
                                  id: "quickTestResults-simple",
                                }}
                              >
                                {ConstantList.RESULT_TEST && ConstantList.RESULT_TEST.map((item) => {
                                  return (
                                    <MenuItem key={item.key} value={item.key}>
                                      {item.value ? item.value : ""}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                          </div>
                        </div>
                      </Grid>
                      <Grid item lg={4} md={4} sm={12} xs={12}>
                        <div style={{ display: haveTest ? "block" : "none" }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={havePCR}
                                onChange={(value) => { this.handleChange(value, "havePCR") }}
                                name="havePCR"
                              />
                            }
                            label="Có xét nghiệm PCR"
                          />
                          <div style={{ display: havePCR ? "block" : "none" }}>

                            <FormControl fullWidth={true} variant="outlined" size="small">
                              <InputLabel htmlFor="pcrResults-simple">
                                {
                                  <span>{t("Kết quả xét nghiệm PCR")}</span>
                                }
                              </InputLabel>
                              <Select
                                label={
                                  <span>{t("Kết quả xét nghiệm PCR")}</span>
                                }
                                value={pcrResults ? pcrResults : ""}
                                onChange={(event) => {
                                  this.setState({ pcrResults: event.target.value })
                                }}
                                inputProps={{
                                  name: "pcrResults",
                                  id: "pcrResults-simple",
                                }}
                              >
                                {ConstantList.RESULT_TEST && ConstantList.RESULT_TEST.map((item) => {
                                  return (
                                    <MenuItem key={item.key} value={item.key}>
                                      {item.value ? item.value : ""}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                          </div>

                        </div>
                      </Grid>
                    </Grid>
                  </fieldset>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <fieldset>
                    <legend>Triệu chứng: </legend>
                    <Grid container>
                      {listNormalSymptom && listNormalSymptom.map((item) => {
                        return (
                          <Grid item lg={3} md={6} sm={12} xs={12}>
                            <FormControlLabel
                              onChange={(event, value) => {
                                if (value) {
                                  //thêm
                                  if (!nomalSystoms) {
                                    nomalSystoms = [];
                                  }
                                  nomalSystoms = [...nomalSystoms, { symptom: item }]
                                } else {
                                  //xoá
                                  nomalSystoms = nomalSystoms.filter((e) => {
                                    return e.symptom.id != item.id;
                                  })
                                }
                                this.setState({ nomalSystoms });
                              }}
                              control={<Checkbox value={item} />}
                              label={item ? (item.symptom ? item.symptom.name : item.name) : ''}
                            />
                          </Grid>
                        )
                      })}
                      {listSevereSymptom && listSevereSymptom.map((item) => {
                        return (
                          <Grid item lg={3} md={6} sm={12} xs={12}>
                            <FormControlLabel
                              onChange={(event, value) => {
                                if (value) {
                                  //thêm
                                  if (!severeSymptoms) {
                                    severeSymptoms = [];
                                  }
                                  severeSymptoms = [...severeSymptoms, { symptom: item }]
                                } else {
                                  //xoá
                                  severeSymptoms = severeSymptoms.filter((e) => {
                                    return e.id != item.id;
                                  })
                                }
                                this.setState({ severeSymptoms });
                              }}
                              control={<Checkbox value={item} />}
                              label={item ? (item.symptom ? item.symptom.name : item.name) : ''}
                            />
                          </Grid>
                        )
                      })}
                    </Grid>
                  </fieldset>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Grid container spacing={2}>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <TextValidator
                        className="w-100"
                        label={
                          <span className="font">
                            {t("Lịch sử tiếp xúc F0")}
                          </span>
                        }
                        onChange={this.handleChange}
                        type="text"
                        name="exposureHistory"
                        value={exposureHistory}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <TextValidator
                        className="w-100"
                        label={
                          <span className="font">
                            {t("Xử lý ban đầu")}
                          </span>
                        }
                        onChange={this.handleChange}
                        type="text"
                        name="initialHandle"
                        value={initialHandle}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>

                      <FormControl fullWidth={true} variant="outlined" size="small">
                        <InputLabel htmlFor="makeDecision-simple">
                          {
                            <span>
                              <span style={{ color: "red" }}> * </span>
                              <span>{t("Ra quyết định")}</span>
                            </span>
                          }
                        </InputLabel>
                        <Select
                          label={
                            <span>{t("Ra quyết định")}</span>
                          }
                          value={makeDecision ? makeDecision : ""}
                          onChange={(event) => {
                            this.setState({ makeDecision: event.target.value })
                          }}
                          inputProps={{
                            name: "makeDecision",
                            id: "makeDecision-simple",
                          }}
                        >
                          {ConstantList.ENCOUNTER_MAKE_DECISION && ConstantList.ENCOUNTER_MAKE_DECISION.map((item) => {
                            return (
                              <MenuItem key={item.key} value={item.key}>
                                {item.description ? item.description : ""}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <TextValidator
                        className="w-100"
                        label={
                          <span className="font">
                            {t("Thông tin khác")}
                          </span>
                        }
                        onChange={this.handleChange}
                        type="text"
                        name="otherInformation"
                        value={otherInformation}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <div className="dialog-footer">
                <DialogActions className="p-0">
                  <div className="flex flex-space-between flex-middle">
                    <Button
                      startIcon={<SaveIcon />}
                      className="mr-0 btn btn-success d-inline-flex"
                      variant="contained"
                      color="primary"
                      type="submit">
                      {t("general.button.save")}
                    </Button>
                  </div>
                </DialogActions>
              </div>
            </fieldset>
            {this.state.familyMemberId &&
              <fieldset className="history_table" style={{ marginTop: "8px" }}>
                <legend>Lịch sử cập nhật thông tin sức khoẻ của thành viên</legend>
                <Grid className="" container spacing={2} style={{ padding: "8px" }}>
                  <Grid item xs={12}>
                    <MaterialTable
                      data={this.state.itemList ? this.state.itemList : []}
                      columns=
                      {
                        [
                          {
                            title: t('STT'), field: "custom", align: "left", width: "150",
                            headerStyle: {
                              minWidth: "40px",
                              paddingLeft: "10px",
                              paddingRight: "0px",
                            },
                            cellStyle: {
                              minWidth: "40px",
                              paddingLeft: "10px",
                              paddingRight: "0px",
                              textAlign: "left",
                            },
                            render: (rowData) => {
                              return rowData.tableData.id + 1;
                            }
                          },
                          // {
                          //   title: t('Họ tên'), field: "temperature", align: "left", width: "150",
                          //   headerStyle: {
                          //     minWidth: "150px",
                          //     paddingLeft: "10px",
                          //     paddingRight: "0px",
                          //   },
                          //   cellStyle: {
                          //     minWidth: "150px",
                          //     paddingLeft: "10px",
                          //     paddingRight: "0px",
                          //     textAlign: "left",
                          //   },
                          //   render: (rowData) => {
                          //     if (rowData.familyMember && rowData.familyMember.member && rowData.familyMember.member.displayName) {
                          //       return rowData.familyMember.member.displayName;
                          //     }
                          //   }
                          // },
                          // {
                          //   title: t('Tuổi'), field: "temperature", align: "left", width: "150",
                          //   headerStyle: {
                          //     minWidth: "150px",
                          //     paddingLeft: "10px",
                          //     paddingRight: "0px",
                          //   },
                          //   cellStyle: {
                          //     minWidth: "150px",
                          //     paddingLeft: "10px",
                          //     paddingRight: "0px",
                          //     textAlign: "left",
                          //   },
                          //   render: (rowData) => {
                          //     if (rowData.familyMember && rowData.familyMember.member && rowData.familyMember.member.age) {
                          //       return rowData.familyMember.member.age;
                          //     }
                          //   }
                          // },
                          {
                            title: t('Ngày/giờ'), field: "declarationTime", align: "left", width: "150",
                            headerStyle: {
                              minWidth: "150px",
                              paddingLeft: "10px",
                              paddingRight: "0px",
                            },
                            cellStyle: {
                              minWidth: "150px",
                              paddingLeft: "10px",
                              paddingRight: "0px",
                              textAlign: "left",
                            },
                            render: (rowData) => {
                              return moment(rowData.declarationTime).format("HH:mm DD/MM/YYYY");
                            }
                          },
                          {
                            title: t('Nhiệt độ (°C)'), field: "temperature", align: "left", width: "150",
                            headerStyle: {
                              minWidth: "150px",
                              paddingLeft: "10px",
                              paddingRight: "0px",
                            },
                            cellStyle: {
                              minWidth: "150px",
                              paddingLeft: "10px",
                              paddingRight: "0px",
                              textAlign: "left",
                            },
                            render: rowData => {
                              let temperature = ConstantList.TEMPERATURE_CONST ? ConstantList.TEMPERATURE_CONST.find((element) => element.value === rowData.temperature) : null;
                              if (temperature) {
                                return temperature.key
                              }
                            }
                          },
                          {
                            title: t('Nhịp thở(lần/phút)'), field: "breathingRate", align: "left", width: "150",
                            headerStyle: {
                              minWidth: "150px",
                              paddingLeft: "10px",
                              paddingRight: "0px",
                            },
                            cellStyle: {
                              minWidth: "150px",
                              paddingLeft: "10px",
                              paddingRight: "0px",
                              textAlign: "left",
                            },
                            render: rowData => {
                              let breathingRate = ConstantList.BREATHINGRATE_CONST ? ConstantList.BREATHINGRATE_CONST.find((element) => element.value === rowData.breathingRate) : null;
                              if (breathingRate) {
                                return breathingRate.key;
                              }
                            }
                          },
                          {
                            title: t('Chỉ số SpO2'), field: "spo2", align: "left", width: "150",
                            headerStyle: {
                              minWidth: "150px",
                              paddingLeft: "10px",
                              paddingRight: "0px",
                            },
                            cellStyle: {
                              minWidth: "150px",
                              paddingLeft: "10px",
                              paddingRight: "0px",
                              textAlign: "left",
                            },
                            render: rowData => {
                              let spo2 = ConstantList.SPO2_CONST ? ConstantList.SPO2_CONST.find((element) => element.value === rowData.spo2) : null;
                              if (spo2) {
                                return spo2.key;
                              }
                            }
                          },
                          {
                            title: t('Triệu chứng'), field: "custom", align: "left", width: "150",
                            headerStyle: {
                              minWidth: "150px",
                              paddingLeft: "10px",
                              paddingRight: "0px",
                            },
                            cellStyle: {
                              minWidth: "150px",
                              paddingLeft: "10px",
                              paddingRight: "0px",
                              textAlign: "left",
                            },
                            render: (rowData) => {
                              // let str = "";
                              // rowData.nomalSystoms && 
                              // rowData.nomalSystoms.forEach((e) => {
                              //     str += e.symptom.name + ", "
                              // });
                              // str = str.replace(/,\s*$/, "");
                              // return str;
                              if ((rowData.nomalSystoms && rowData.nomalSystoms.length > 0)
                                || (rowData.severeSymptoms && rowData.severeSymptoms.length > 0)) {
                                return (
                                  <ul style={{ margin: 0, paddingInlineStart: "10px" }}>
                                    {rowData.nomalSystoms && rowData.nomalSystoms.map((item) => (
                                      <li>{item.symptom ? item.symptom.name : ""}</li>
                                    ))}
                                    {rowData.severeSymptoms && rowData.severeSymptoms.map((item) => (
                                      <li>{item.symptom ? item.symptom.name : ""}</li>
                                    ))}
                                  </ul>
                                )
                              }
                            }
                          },
                          // {
                          //   title: t('Triệu chứng nặng'), field: "custom", align: "left", width: "150",
                          //   headerStyle: {
                          //     minWidth: "150px",
                          //     paddingLeft: "10px",
                          //     paddingRight: "0px",
                          //   },
                          //   cellStyle: {
                          //     minWidth: "150px",
                          //     paddingLeft: "10px",
                          //     paddingRight: "0px",
                          //     textAlign: "left",
                          //   },
                          //   render: (rowData) => {
                          //     let str = "";
                          //     rowData.severeSymptoms && 
                          //     rowData.severeSymptoms.forEach((e) => {
                          //         str += e.symptom.name + ", "
                          //     });
                          //     str = str.replace(/,\s*$/, "");
                          //     return str;
                          //   }
                          // }
                        ]
                      }
                      options={{
                        selection: false,
                        actionsColumnIndex: -1,
                        paging: false,
                        search: false,
                        rowStyle: (rowData, index) => ({
                          backgroundColor: (index % 2 === 1) ? '#EEE' : '#FFF',
                        }),
                        maxBodyHeight: '450px',
                        minBodyHeight: '200px',
                        headerStyle: {
                          backgroundColor: '#3366ff',
                          color: '#fff',
                          whiteSpace: 'nowrap'
                        },
                        padding: 'dense',
                        toolbar: false
                      }}
                      onSelectionChange={(rows) => {
                        this.data = rows;
                      }}
                      localization={{
                        body: {
                          emptyDataSourceMessage: `${t(
                            "general.emptyDataMessageTable"
                          )}`,
                        },
                      }}
                    />
                    {this.state.itemList && this.state.itemList.length > 0 &&
                      <NicePagination
                        totalPages={this.state.totalPages}
                        handleChangePage={this.handleChangePage}
                        setRowsPerPage={this.setRowsPerPage}
                        pageSize={this.state.rowsPerPage}
                        pageSizeOption={[1, 2, 3, 5, 10, 25, 50]}
                        t={t}
                        totalElements={this.state.totalElements}
                        page={this.state.page}
                        isSimple={true}
                      />
                    }
                    {/* {openViewDialog && (
                      <ViewDialog
                        handleClose={this.handleClose}
                        open={openViewDialog}
                        updatePageData={this.updatePageData}
                        item={this.state.item}
                        t={t}
                      />
                    )} */}
                  </Grid>
                </Grid>
              </fieldset>
            }
          </DialogContent>
        </ValidatorForm>

      </>
    );
  }
}
export default CreateEncounter;
