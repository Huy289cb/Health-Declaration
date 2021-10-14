import React from "react";
import { toast } from "react-toastify";
import ConstantList from "../../appConfig";
import "react-toastify/dist/ReactToastify.css";
import "styles/globitsStyles.css";
import Pagination from '@material-ui/lab/Pagination';
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
  Icon,
  FormHelperText,
  RadioGroup,
  Radio
} from "@material-ui/core";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import FamilyInputPopup from "../Component/SelectFamilyPopup/InputPopup"
import Autocomplete from "@material-ui/lab/Autocomplete";
import SaveIcon from '@material-ui/icons/Save';
import HomeIcon from '@material-ui/icons/Home';
import BlockIcon from '@material-ui/icons/Block';
import { searchByPage as getSymptoms } from "../Symptom/SymptomService";
import { addNew, update, searchByPage, getById } from "./PersonalHealthRecordService";
import MaterialTable from 'material-table';
import NicePagination from '../Component/Pagination/NicePagination';
import ViewDialog from "./ViewDialog";
import localStorageService from "../../services/localStorageService";
import { getFamilyByUserLogin } from "../Family/Service";
import appConfig from "../../appConfig";
import "./style.css";
import { ConfirmationDialog } from "egret";
import SelectFamilyPopup from "../Component/SelectFamilyPopup/SelectFamilyPopup"
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { searchByPage as getBackgroundDisease } from "../BackgroundDisease/BackgroundDiseaseService";

toast.configure({
  autoClose: 2000,
  draggable: false,
  limit: 3,
});

class Create extends React.Component {
  state = {
    id: null,
    name: "",
    code: "",
    level: 0,
    parent: {},
    nomalSystoms: [],
    severeSymptoms: [],
    shouldOpenSelectParentPopup: false,
    parentId: "",
    rowsPerPage: 2,
    page: 1,
    text: '',
    openViewDialog: false,
    openSaveDialog: false
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
      this.setState({radioHelperTextHaveTest: "", radioErrorHaveTest: false});
      if (event.target.defaultValue == "false") {
        this.setState({
          haveTest: false
        });
        this.resetHaveQuickTest();
        this.resetHavePCR();
      } else {
        this.setState({
          haveTest: true
        });
      }
      return;
    }
    if (source == "haveQuickTest") {
      if (!event.target.checked) {
        this.resetHaveQuickTest();
      } else {
        this.setState({
          haveQuickTest: event.target.checked
        });
      }
      return;
    }
    if (source == "havePCR") {
      if (!event.target.checked) {
        this.resetHavePCR();
      } else {
        this.setState({
          havePCR: event.target.checked
        });
      }
      return;
    }
    if (source == "haveSymptom") {
      this.setState({radioHelperTextHaveSymptom: "", radioErrorHaveSymptom: false});
      if (event.target.defaultValue == "false") {
        this.setState({
          haveSymptom: false,
          nomalSystoms: [],
          severeSymptoms: [],
          symptomText: ""
        });
      } else {
        this.setState({
          haveSymptom: true
        });
      }
      return;
    }
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  resetHaveQuickTest = () => {
    this.setState({haveQuickTest: false, quickTestResults: null, quickTestDate: null, quickTestResultsError: false, quickTestResultsHelperText: ""})
  }
  resetHavePCR = () => {
    this.setState({havePCR: false, pcrResults: null, pcrTestDate: null, pcrResultsError: false, pcrResultsHelperText: ""})
  }
  openCircularProgress = () => {
    this.setState({ loading: true });
  };

  handleFormSubmit = async () => {
    await this.openCircularProgress();
    if (!this.validateData()) {
      this.setState({loading: false});
      toast.warning("Có trường bắt buộc chưa được nhập");
    } else {
      let { id, familyMember } = this.state;
      let { t } = this.props;
      if (familyMember && familyMember.member && familyMember.member.backgroundDiseases && familyMember.member.backgroundDiseases.length > 0) {
        familyMember.member.listBackgroundDisease = [];
        familyMember.member.backgroundDiseases.forEach(element => {
          familyMember.member.listBackgroundDisease.push({ backgroundDisease: element });
        });
      }
      this.setState({familyMember}, () => {
        let obj = {};
        obj.id = id;
        obj.familyMember = this.state.familyMember;
        obj.spo2 = this.state.spo2;
        obj.breathingRate = this.state.breathingRate;
        obj.temperature = this.state.temperature;
        obj.contactPersonName = this.state.contactPersonName;
        obj.contactPersonPhone = this.state.contactPersonPhone;
        obj.contactPersonRelation = this.state.contactPersonRelation;
        obj.systolicBloodPressure = this.state.systolicBloodPressure;
        obj.diastolicBloodPressure = this.state.diastolicBloodPressure;
        obj.pcrTestDate = this.state.pcrTestDate;
        obj.quickTestDate = this.state.quickTestDate;
        obj.haveTest = this.state.haveTest;
        obj.haveQuickTest = this.state.haveQuickTest;
        obj.havePCR = this.state.havePCR;
        obj.pcrResults = this.state.pcrResults;
        obj.quickTestResults = this.state.quickTestResults;
        obj.symptomText = this.state.symptomText;
        obj.haveSymptom = this.state.haveSymptom;
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
        addNew(obj).then((response) => {
          if (response.data != null && response.status == 200) {
            this.resetState();
            this.setState({
              loading: false,
              openSaveDialog: true,
            }, this.updatePageData());
            toast.success(t('Cảm ơn bạn đã tham gia khai báo thông tin y tế.'));
          }
        });
      })
    }
  };

  resetState = () => {
    this.setState({
      nomalSystoms: [],
      severeSymptoms: [],
      listNormalSymptom: [],
      listSevereSymptom: [],
      breathingRate: "",
      spo2: "",
      haveTest: null,
      haveQuickTest: false,
      quickTestResults: null,
      havePCR: false,
      pcrResults: null,
      openViewDialog: false,
      makeDecision: null,
      temperature: null,
      bloodPressure: null,
      otherInformation: null,
      initialHandle: null,
      exposureHistory: null,
      examinationTime: null,
      systolicBloodPressure: null,
      diastolicBloodPressure: null,
      quickTestDate: null,
      pcrTestDate: null,
      haveSymptom: null,
      symptomText: "",
    })
  }

  validateData = () => {
    let r = true;
    let {familyMember} = this.state;
    if (!familyMember) {
      this.setState({selectFamilyMemberHelperText: "Đây là trường bắt buộc", selectFamilyMemberError: true})
      r = false;
    } else {
      if (familyMember.member.haveBackgroundDisease === null || familyMember.member.haveBackgroundDisease === undefined) {
        this.setState({ radioHelperText: "Đây là trường bắt buộc", radioError: true })
        r = false;
      }
      // if (familyMember.member.haveBackgroundDisease && (familyMember.member.backgroundDiseases && familyMember.member.backgroundDiseases.length == 0)) {
      //   toast.warning("Chưa chọn bệnh nền")
      //   r = false;
      // }
    }
    if (this.state.haveTest === null || this.state.haveTest === undefined) {
      this.setState({radioHelperTextHaveTest: "Đây là trường bắt buộc", radioErrorHaveTest: true})
      r = false;
    }
    if (this.state.haveTest && !(this.state.haveQuickTest || this.state.havePCR)) {
      toast.warning("Chưa chọn loại xét nghiệm COVID");
      r = false;
    }
    if (this.state.haveQuickTest && !this.state.quickTestResults) {
      this.setState({quickTestResultsHelperText:"Đây là trường bắt buộc",quickTestResultsError:true})
      r = false;
    } 
    if (this.state.havePCR && !this.state.pcrResults) {
      this.setState({pcrResultsHelperText:"Đây là trường bắt buộc",pcrResultsError:true})
      r = false;
    } 
    // if (!this.state.breathingRate) {
    //   this.setState({breathingRateHelperText:"Đây là trường bắt buộc",breathingRateError:true})
    //   r = false;
    // }
    let symptomLength = this.state.nomalSystoms.length + this.state.severeSymptoms.length;
    if (!this.state.haveSymptom && symptomLength == 0 && !this.state.symptomText) {
      // this.setState({radioHelperTextHaveSymptom: "Đây là trường bắt buộc", radioErrorHaveSymptom: true});
      toast.warning("Chọn không triệu chứng hoặc chọn/nhập ít nhất 1 triệu chứng")
      r = false;
    }
    // if (this.state.haveSymptom) {
    //   if (symptomLength == 0 && !this.state.symptomText) {
    //     r = false;
        
    //   }
    // }
    if (r) {
      return true;
    } else {
      return false;
    }
  };

  componentDidMount() {
    if (localStorageService.getItem('role') === "ROLE_USER") {
      this.setState({isUser: true});
      getFamilyByUserLogin().then(({ data }) => {
        this.setState({family: data});
      })
    }
    getBackgroundDisease({ pageIndex: 0, pageSize: 1000 }).then(({ data }) => {
      this.setState({ listDataBackgroundDisease: [...data.content] });
    })

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
    ValidatorForm.addValidationRule('diastolicBloodPressureMatch', (value) => {
      if (Number(value) > Number(this.state.systolicBloodPressure)) {
          return false;
      }
      return true;
    });
  }
  componentWillUnmount() {
    ValidatorForm.removeValidationRule('diastolicBloodPressureMatch');
  }
  componentWillMount() {

  }


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
    var searchObject = {showHistoryForm: true};
    if (item != null) {
      this.setState({
        page: 1,
        text: item.text,
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
              haveTest: data.content[0].haveTest,
              haveQuickTest: data.content[0].haveQuickTest,
              quickTestResults: data.content[0].quickTestResults,
              havePCR: data.content[0].havePCR,
              pcrResults: data.content[0].pcrResults,
              quickTestDate: data.content[0].quickTestDate,
              pcrTestDate: data.content[0].pcrTestDate,
            })
            if (data.content[0].haveTest) {
              this.setState({radioHelperTextHaveTest: "", radioErrorHaveTest: false});
            }
          }
        }
        );
      })
    } else {
      searchObject.text = this.state.text;
      searchObject.pageIndex = this.state.page;
      searchObject.pageSize = this.state.rowsPerPage;
      searchObject.familyMemberId = this.state.familyMemberId;
      searchByPage(searchObject).then(({ data }) => {
        this.setState({
          itemList: [...data.content],
          totalElements: data.totalElements,
          totalPages: data.totalPages,
        })
        if (data.content && data.content.length > 0) {
          this.setState({
            haveTest: data.content[0].haveTest,
            haveQuickTest: data.content[0].haveQuickTest,
            quickTestResults: data.content[0].quickTestResults,
            havePCR: data.content[0].havePCR,
            pcrResults: data.content[0].pcrResults,
            quickTestDate: data.content[0].quickTestDate,
            pcrTestDate: data.content[0].pcrTestDate,
          })
          if (data.content[0].haveTest) {
            this.setState({radioHelperTextHaveTest: "", radioErrorHaveTest: false});
          }
        }
      });
    }
  };

  handleClose = () => {
    this.setState({
      openViewDialog: false,
      openSaveDialog: false,
    }, () => {
      this.updatePageData();
    });
  };

  getBMI = (height, weight) => {
    let bmi = (weight/((height/100)*(height/100))).toFixed(2);
    let bmiText = "";
    if (bmi < 18.5) {
      bmiText = "Thiếu cân";
    } else if (bmi >= 18.5 && bmi < 25) {
      bmiText = "Cân đối";
    } else if (bmi >= 25 && bmi < 30) {
      bmiText = "Thừa cân";
    } else if (bmi >= 30 && bmi < 35) {
      bmiText = "Béo phì";
    } else if (bmi >= 35) {
      bmiText = "Béo phì nguy hiểm";
    }
    this.setState({bmi: bmi, bmiText: bmiText});
  }

  selectListBackgroundDisease = (values) => {
    let { familyMember } = this.state;
    if (!familyMember) { familyMember = {member:{}} };
    familyMember.member.backgroundDiseases = values;
    this.setState({ familyMember });
  };

  render() {
    let { t } = this.props;
    let {
      family,
      familyMember,
      contactPersonName,
      contactPersonPhone,
      contactPersonRelation,
      nomalSystoms,
      severeSymptoms,
      listNormalSymptom,
      listSevereSymptom,
      breathingRate,
      spo2,
      temperature,
      anamnesis,
      openViewDialog,
      isUser,
      systolicBloodPressure,
      diastolicBloodPressure,
      bmi,
      bmiText,
      openSaveDialog,
      quickTestDate,
      pcrTestDate,
      openFamilyPopup,
      haveTest,
      haveQuickTest,
      quickTestResults,
      havePCR,
      pcrResults,
      loading,
      haveSymptom,
      symptomText,
      listDataBackgroundDisease,
      backgroundDiseases,
    } = this.state;
    return (
      <>
        <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
          <DialogContent style={{ backgroundColor: "#fff" }}>
            <Grid container spacing={1}>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Button
                    startIcon={<Icon>home</Icon>}
                    className="mr-12 btn btn-secondary d-inline-flex"
                    variant="contained"
                    onClick={() => {this.props.history.push(ConstantList.ROOT_PATH+"dashboard/analytics")}}>
                    {t("Trở về trang chủ")}
                  </Button>
                  {!isUser && 
                  <>
                  <Button
                    size="small"
                    className="btn btn-primary-d"
                    variant="contained"
                    onClick={() => this.setState({openFamilyPopup: true})}
                  >
                      <div className="btn-select-family">{t("Chọn hộ gia đình khác")}</div>
                  </Button>
                  <SelectFamilyPopup
                      open={openFamilyPopup}
                      handleSelect={(item) => {
                        this.setState({ family: item, openFamilyPopup: false, familyMember: {}, familyMemberId: null });
                        this.resetState();
                      }}
                      selectedItem={family ? family : {}}
                      handleClose={() => this.setState({openFamilyPopup: false})}
                      t={t}
                  />
                  </>
                  }
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <div>Ghi chú:</div>
                <div>
                  (<span style={{ color: "red" }}> * </span>) <i>Trường bắt buộc</i>
                </div>
                <div style={{display: "inline-block"}}>
                  ( <div style={{display: "inline-block",width: "12px", height: "12px", backgroundColor: "#eee"}}></div> ) <i>Trường chỉ xem</i>
                </div>
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <fieldset>
                <legend>Cập nhật thông tin sức khoẻ cho thành viên</legend>
              <Grid className="" container spacing={2} style={{ padding: "8px" }}>
                {/* code */}
                {!isUser && <Grid item lg={12} md={12} sm={12} xs={12}>
                  {/* <FamilyInputPopup
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
                  /> */}
                  <TextValidator
                        className="nice-input w-100"
                        disabled
                        fullWidth
                        id="family"
                        size="small"
                        name="family"
                        label={<span className="font">
                          <span style={{ color: "red" }}> * </span>
                          {t("Hộ gia đình")}
                        </span>}
                        value={
                            family ? (family.code ? family.code + " | " : "") + (family.name ? family.name + " | " : "") 
                            + (family.detailAddress ? family.detailAddress : "") : ""
                        }
                        required
                        variant="outlined"
                        validators={["required"]}
                        errorMessages={[t("general.errorMessages_required")]}
                    />
                </Grid>}
                <Grid item lg={3} md={3} sm={12} xs={12}>
                  <FormControl className="nice-input" error={this.state.selectFamilyMemberError}
                  fullWidth={true} variant="outlined" size="small">
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
                      value={familyMember ? familyMember : null}
                      onChange={(event) => {
                        this.setState({ familyMember: event.target.value, selectFamilyMemberHelperText: "", selectFamilyMemberError: false });
                        if (event.target.value) {
                          event.target.value.member.backgroundDiseases = [];
                          if (event.target.value.member && event.target.value.member.listBackgroundDisease) {
                            event.target.value.member.listBackgroundDisease.forEach(element => {
                              event.target.value.member.backgroundDiseases.push(element.backgroundDisease);
                            });
                            this.setState({familyMember: event.target.value});
                          }
                          // let str = "";
                          // event.target.value.member && event.target.value.member.listBackgroundDisease
                          //   && event.target.value.member.listBackgroundDisease.forEach((e) => {
                          //     str += e.backgroundDisease.name + ", "
                          //   });
                          // str = str.replace(/,\s*$/, "");
                          // this.setState({ anamnesis: str });
                          if(event.target.value.member && event.target.value.member.weight && event.target.value.member.height){
                            this.getBMI(Number(event.target.value.member.height), Number(event.target.value.member.weight));
                          } else {
                            this.setState({bmi: "", bmiText: ""});
                          }
                          this.setState({ familyMemberId: event.target.value.id }, () => {
                            this.updatePageData();
                          })
                        }
                      }}
                      inputProps={{
                        name: "familyMembers",
                        id: "familyMembers-simple",
                      }}
                      validators={["required"]}
                      errorMessages={[t("general.required")]}
                    >
                      {family && family.familyMembers && family.familyMembers.map((item) => {
                        return (
                          <MenuItem key={item.id} value={item}>
                            {item.member && item.member.displayName ? item.member.displayName : ""}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    <FormHelperText>{this.state.selectFamilyMemberHelperText}</FormHelperText>
                  </FormControl>
                </Grid>
                {/* <Grid item lg={6} md={6} sm={12} xs={12}>
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
                </Grid> */}
                {/* <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Grid container spacing={1}> */}
                    <Grid item lg={1} md={1} sm={6} xs={6}>
                      <TextValidator
                        className="nice-input w-100"
                        label={t("Tuổi")}
                        disabled
                        // onChange={this.handleChange}
                        type="number"
                        name="age"
                        value={familyMember ? (familyMember.member ? (familyMember.member.age ? familyMember.member.age : "") : "") : ""}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    <Grid item lg={2} md={2} sm={6} xs={6}>
                      <TextValidator
                        className="nice-input w-100"
                        label={t("Giới tính")}
                        disabled
                        // onChange={this.handleChange}
                        type="text"
                        name="gender"
                        value={familyMember ? (familyMember.member ? (familyMember.member.gender=="F"?"Nữ":(familyMember.member.gender=="M"?"Nam":"")) : "") : ""}
                        variant="outlined"
                        size="small"
                      />
                      </Grid>
                      <Grid item lg={2} md={2} sm={12} xs={12}>
                      <TextValidator
                        className="nice-input w-100"
                        label={t("Chiều cao(cm)")}
                        disabled
                        // onChange={this.handleChange}
                        type="text"
                        name="height"
                        value={familyMember ? (familyMember.member ? (familyMember.member.height ? familyMember.member.height : "") : "") : ""}
                        variant="outlined"
                        size="small"
                        step={0.0001}
                      />
                    </Grid>
                    <Grid item lg={2} md={2} sm={12} xs={12}>
                      <TextValidator
                        className="nice-input w-100"
                        label={t("Cân nặng(kg)")}
                        // disabled={(familyMember && familyMember.member) ? true : false}
                        onChange={(event) => {
                          // if (familyMember && familyMember.member) {
                            familyMember.member.weight = event.target.value;
                            this.setState({familyMember});
                            if (familyMember.member.height) {
                              this.getBMI(Number(familyMember.member.height), Number(event.target.value));
                            }
                          // }
                        }}
                        type="text"
                        name="weight"
                        value={familyMember ? (familyMember.member ? (familyMember.member.weight ? familyMember.member.weight : "") : "") : ""}
                        variant="outlined"
                        size="small"
                        step={0.0001}
                      />
                    </Grid>
                    <Grid item lg={2} md={2} sm={12} xs={12}>
                      <TextValidator
                        className="nice-input w-100"
                        label={t("Chỉ số BMI")}
                        disabled
                        type="text"
                        name="bmi"
                        value={bmi ? bmi : ""}
                        variant="outlined"
                        size="small"
                        step={0.0001}
                      />
                    </Grid>
                  {/* </Grid>
                </Grid> */}
                <Grid item lg={3} md={3} sm={12} xs={12}>
                  {familyMember && familyMember.member && familyMember.member.phoneNumber &&
                  <a href={"tel:" + (familyMember ? (familyMember.member ? (familyMember.member.phoneNumber ? familyMember.member.phoneNumber : "") : "") : "")}>
                    <Button
                      startIcon={<Icon>call</Icon>}
                      variant="contained"
                      className="btn-primary-d d-inline-flex w-100"
                    >
                      {familyMember ? (familyMember.member ? (familyMember.member.phoneNumber ? familyMember.member.phoneNumber : "") : "") : ""}
                    </Button>
                  </a>}
                  {/* <TextValidator
                    className="nice-input w-100"
                    label={t("Số điện thoại cá nhân")}
                    disabled
                    // onChange={this.handleChange}
                    type="text"
                    name="phoneNumber"
                    value={familyMember ? (familyMember.member ? (familyMember.member.phoneNumber ? familyMember.member.phoneNumber : "") : "") : ""}
                    variant="outlined"
                    size="small"
                  /> */}
                </Grid>
                <Grid item lg={3} md={3} sm={12} xs={12}>
                  <TextValidator
                    className="nice-input w-100"
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
                <Grid item lg={3} md={3} sm={12} xs={12}>
                  <TextValidator
                    className="nice-input w-100"
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
                <Grid item lg={3} md={3} sm={12} xs={12}>
                  <TextValidator
                    className="nice-input w-100"
                    label={t("Đánh giá chỉ số BMI")}
                    disabled
                    type="text"
                    name="bmiText"
                    value={bmiText ? bmiText : ""}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item lg={3} md={3} sm={12} xs={12}>
                  <FormControl component="fieldset" error={this.state.radioError}
                    disabled={familyMember ? false : true}>
                    <FormLabel component="legend"><span style={{ color: "red" }}> * </span>Có bệnh nền: </FormLabel>
                    <RadioGroup row aria-label="haveBackgroundDisease" name="haveBackgroundDisease"
                      value={familyMember && familyMember.member ? familyMember.member.haveBackgroundDisease : null}
                      onChange={(event) => {
                        if (event.target.value === "true") {
                          familyMember.member.haveBackgroundDisease = true;
                        }
                        else {
                          familyMember.member.haveBackgroundDisease = false;
                          familyMember.member.backgroundDiseases = [];
                        }
                        this.setState({ familyMember, radioHelperText: "", radioError: false })
                      }}>
                      <FormControlLabel value={true}
                        control={<Radio checked={familyMember && familyMember.member ? (familyMember.member.haveBackgroundDisease === true ? true : false) : false} />}
                        label="Có" />
                      <FormControlLabel value={false}
                        control={<Radio checked={familyMember && familyMember.member ? (familyMember.member.haveBackgroundDisease === false ? true : false) : false} />}
                        label="Không" />
                    </RadioGroup>
                    <FormHelperText>{this.state.radioHelperText}</FormHelperText>


                  </FormControl>
                </Grid>
                <Grid item lg={9} md={9} sm={12} xs={12}>
                  <Autocomplete
                    className="nice-input w-100"
                    disabled={familyMember && familyMember.member ? (familyMember.member.haveBackgroundDisease ? false : true) : true}
                    style={{ width: "100%" }}
                    multiple
                    id="combo-box-demo"
                    defaultValue={familyMember && familyMember.member && familyMember.member.backgroundDiseases ? familyMember.member.backgroundDiseases : []}
                    value={familyMember && familyMember.member && familyMember.member.backgroundDiseases ? familyMember.member.backgroundDiseases : []}
                    options={listDataBackgroundDisease ? listDataBackgroundDisease : []}
                    getOptionSelected={(option, value) =>
                      option.id === value.id
                    }
                    getOptionLabel={(option) => option.name ? option.name : ""}
                    onChange={(event, value) => {
                      this.selectListBackgroundDisease(value);
                    }}
                    renderInput={(params) => (
                      <TextValidator
                        {...params}
                        value={familyMember && familyMember.member && familyMember.member.backgroundDiseases ? familyMember.member.backgroundDiseases : []}
                        label={
                          <span className="font">
                            {t("Tiền sử bệnh")}
                          </span>
                        }
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    )}
                  />
                  {/* <TextField
                    className="nice-input w-100"
                    label={t("Tiền sử bệnh")}
                    disabled
                    // onChange={this.handleChange}
                    type="text"
                    name="healthInsuranceCardNumber"
                    value={anamnesis ? anamnesis : ""}
                    variant="outlined"
                    size="small"
                  // multiline
                  // rows={3}
                  /> */}

                </Grid>
                {/* <Grid item lg={12} md={12} sm={12} xs={12}>
                  <fieldset>
                    <legend>Người liên hệ khác: </legend>
                    <Grid container spacing={2} style={{ padding: "4px" }}>
                      <Grid item lg={4} md={4} sm={12} xs={12}>
                        <TextValidator
                          className="w-100"
                          label={t("Họ tên")}
                          onChange={this.handleChange}
                          type="text"
                          name="contactPersonName"
                          value={contactPersonName ? contactPersonName : ""}
                          // validators={["required"]}
                          // errorMessages={[t("general.errorMessages_required")]}
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                      <Grid item lg={4} md={4} sm={12} xs={12}>
                        <TextValidator
                          className="w-100"
                          label={t("Mối quan hệ")}
                          onChange={this.handleChange}
                          type="text"
                          name="contactPersonRelation"
                          value={contactPersonRelation ? contactPersonRelation : ""}
                          // validators={["required"]}
                          // errorMessages={[t("general.errorMessages_required")]}
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                      <Grid item lg={4} md={4} sm={12} xs={12}>
                        <TextValidator
                          className="w-100"
                          label={t("Số điện thoại liên hệ")}
                          onChange={this.handleChange}
                          type="text"
                          name="contactPersonPhone"
                          value={contactPersonPhone ? contactPersonPhone : ""}
                          // validators={["required"]}
                          // errorMessages={[t("general.errorMessages_required")]}
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                    </Grid>
                  </fieldset>
                </Grid> */}
                <Grid item lg={12} md={12} sm={12} xs={12}>
                      <fieldset>
                        <legend>Xét nghiệm COVID</legend>
                        <Grid container spacing={2} style={{ padding: "4px" }}>
                          <Grid item lg={4} md={4} sm={12} xs={12}>
                            <FormControl component="fieldset" error={this.state.radioErrorHaveTest}>
                              <FormLabel component="legend"><span style={{ color: "red" }}> * </span>Có xét nghiệm: </FormLabel>
                              <RadioGroup row
                                aria-label="position" name="position" defaultValue="top"
                                onChange={(value) => { this.handleChange(value, "haveTest") }}
                              >
                                <FormControlLabel
                                  value={true}
                                  control={<Radio checked={haveTest === true ? true : false} />}
                                  label="Có"
                                  labelPlacement="end"
                                />
                                <FormControlLabel
                                  value={false}
                                  control={<Radio checked={haveTest === false ? true : false} />}
                                  label="Không"
                                  labelPlacement="end"
                                />
                              </RadioGroup>
                              <FormHelperText>{this.state.radioHelperTextHaveTest}</FormHelperText>
                            </FormControl>
                          </Grid>
                          <Grid item lg={4} md={4} sm={12} xs={12}>
                            <div style={{ display: haveTest ? "block" : "none" }}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={haveQuickTest ? haveQuickTest : false}
                                    onChange={(value) => { this.handleChange(value, "haveQuickTest") }}
                                    name="haveQuickTest"
                                  />
                                }
                                label={<span><span style={{ color: "red" }}> * </span>Có xét nghiệm nhanh</span>}
                              />
                              <div style={{ display: haveQuickTest ? "block" : "none" }}>
                                <Grid container spacing={2}>
                                  <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                      <KeyboardDatePicker
                                        disableFuture
                                        className="nice-input"
                                        fullWidth
                                        id="quickTestDate"
                                        name="quickTestDate"
                                        autoOk
                                        variant="inline"
                                        inputVariant="outlined"
                                        label={<span><span style={{ color: "red" }}> * </span>Ngày xét nghiệm</span>}
                                        format="dd/MM/yyyy"
                                        size="small"
                                        InputAdornmentProps={{ position: "end" }}
                                        onChange={date => this.setState({quickTestDate: date})}
                                        value={quickTestDate ? quickTestDate : null}
                                        required={haveQuickTest ? haveQuickTest : false}
                                      />
                                    </MuiPickersUtilsProvider>
                                  </Grid>
                                  <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <FormControl className="nice-input" fullWidth={true} error={this.state.quickTestResultsError}
                                    variant="outlined" size="small">
                                      <InputLabel htmlFor="quickTestResults-simple">
                                        {
                                          <span><span style={{ color: "red" }}> * </span>{t("Kết quả xét nghiệm nhanh")}</span>
                                        }
                                      </InputLabel>
                                      <Select
                                        label={
                                          <span><span style={{ color: "red" }}> * </span>{t("Kết quả xét nghiệm nhanh")}</span>
                                        }
                                        value={quickTestResults ? quickTestResults : ""}
                                        onChange={(event) => {
                                          this.setState({ quickTestResults: event.target.value,
                                             quickTestResultsError: false, quickTestResultsHelperText: "" })
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
                                      <FormHelperText>{this.state.quickTestResultsHelperText}</FormHelperText> 
                                    </FormControl>
                                    
                                  </Grid>
                                </Grid>
                              </div>
                            </div>
                          </Grid>
                          <Grid item lg={4} md={4} sm={12} xs={12}>
                            <div style={{ display: haveTest ? "block" : "none" }}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={havePCR ? havePCR : false}
                                    onChange={(value) => { this.handleChange(value, "havePCR") }}
                                    name="havePCR"
                                  />
                                }
                                label={<span><span style={{ color: "red" }}> * </span>Có xét nghiệm PCR</span>}
                              />
                              <div style={{ display: havePCR ? "block" : "none" }}>
                                <Grid container spacing={2}>
                                  <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                      <KeyboardDatePicker
                                        disableFuture
                                        className="nice-input"
                                        fullWidth
                                        id="pcrTestDate"
                                        name="pcrTestDate"
                                        autoOk
                                        variant="inline"
                                        inputVariant="outlined"
                                        label={<span><span style={{ color: "red" }}> * </span>Ngày xét nghiệm</span>}
                                        format="dd/MM/yyyy"
                                        size="small"
                                        InputAdornmentProps={{ position: "end" }}
                                        onChange={date => this.setState({pcrTestDate: date})}
                                        value={pcrTestDate ? pcrTestDate : null}
                                        required={havePCR ? havePCR : false}
                                      />
                                    </MuiPickersUtilsProvider>
                                  </Grid>
                                  <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <FormControl className="nice-input" error={this.state.pcrResultsError}
                                    fullWidth={true} variant="outlined" size="small">
                                      <InputLabel htmlFor="pcrResults-simple">
                                        {
                                          <span><span style={{ color: "red" }}> * </span>{t("Kết quả xét nghiệm PCR")}</span>
                                        }
                                      </InputLabel>
                                      <Select
                                        label={
                                          <span><span style={{ color: "red" }}> * </span>{t("Kết quả xét nghiệm PCR")}</span>
                                        }
                                        value={pcrResults ? pcrResults : ""}
                                        onChange={(event) => {
                                          this.setState({ pcrResults: event.target.value,
                                          pcrResultsError: false, pcrResultsHelperText: ""})
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
                                      <FormHelperText>{this.state.pcrResultsHelperText}</FormHelperText> 
                                    </FormControl>
                                  </Grid>
                                </Grid>
                              </div>

                            </div>
                          </Grid>
                        </Grid>
                      </fieldset>
                    </Grid>
                    
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <fieldset>
                    <legend>Các chỉ số: </legend>
                    <Grid container spacing={2} style={{ padding: "4px" }}>
                    <Grid item lg={2} md={4} sm={12} xs={12}>
                        <FormControl className="nice-input" fullWidth={true} variant="outlined" size="small">
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
                            {appConfig.TEMPERATURE_CONST.map((item) => {
                              return (
                                <MenuItem key={item.key} value={item.value}>
                                  {item.key ? item.key : ""}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item lg={2} md={4} sm={12} xs={12}>
                        <FormControl className="nice-input" 
                        // error={this.state.breathingRateError}
                        fullWidth={true} variant="outlined" size="small">
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
                              this.setState({ breathingRate: event.target.value,
                                // breathingRateError: false, breathingRateHelperText: "" 
                              })
                            }}
                            inputProps={{
                              name: "breathingRate",
                              id: "breathingRate-simple",
                            }}
                          >
                            {appConfig.BREATHINGRATE_CONST.map((item) => {
                              return (
                                <MenuItem key={item.key} value={item.value}>
                                  {item.key ? item.key : ""}
                                </MenuItem>
                              );
                            })}
                          </Select>
                          {/* <FormHelperText>{this.state.breathingRateHelperText}</FormHelperText>  */}
                        </FormControl>
                      </Grid>
                      <Grid item lg={2} md={4} sm={12} xs={12}>
                        <FormControl className="nice-input" fullWidth={true} variant="outlined" size="small">
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
                            {appConfig.SPO2_CONST.map((item) => {
                              return (
                                <MenuItem key={item.key} value={item.value}>
                                  {item.key ? item.key : ""}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item lg={3} md={6} sm={12} xs={12}>
                        <TextValidator
                          className="nice-input w-100"
                          label={
                            <span className="font">
                              {t("Huyết áp tối đa")}
                            </span>
                          }
                          onChange={this.handleChange}
                          type="number"
                          name="systolicBloodPressure"
                          value={systolicBloodPressure ? systolicBloodPressure : ""}
                          validators={['minNumber:0']}
                          errorMessages={["Phải là số dương"]}
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                      <Grid item lg={3} md={6} sm={12} xs={12}>
                        <TextValidator
                          className="nice-input w-100"
                          label={
                            <span className="font">
                              {t("Huyết áp tối thiểu")}
                            </span>
                          }
                          onChange={this.handleChange}
                          type="number"
                          name="diastolicBloodPressure"
                          value={diastolicBloodPressure ? diastolicBloodPressure : ""}
                          validators={["diastolicBloodPressureMatch", 'minNumber:0']}
                          errorMessages={["Huyết áp tối thiểu phải nhỏ hơn huyết áp tối đa", "Phải là số dương"]}
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                    </Grid>
                  </fieldset>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <fieldset>
                    <legend><span style={{ color: "red" }}> * </span>Triệu chứng: </legend>
                    <Grid container>
                      <Grid item lg={3} md={4} sm={12} xs={12}>
                        <FormControl component="fieldset" error={this.state.radioErrorHaveSymptom}>
                            <FormControlLabel
                              value={true}
                              control={<Checkbox checked={haveSymptom ? haveSymptom : false} />}
                              onChange={(e) => {
                                this.setState({haveSymptom: e.target.checked, radioErrorHaveSymptom: false, radioHelperTextHaveSymptom: ""})
                              }}
                              label="Không có triệu chứng"
                              labelPlacement="end"
                              disabled={
                                (nomalSystoms && nomalSystoms.length > 0 ? true : false) ||
                                (severeSymptoms && severeSymptoms.length > 0 ? true : false) ||
                                (symptomText ? true : false)
                              }
                            />
                          {/* <FormLabel component="legend"><span style={{ color: "red" }}> *</span>Có triệu chứng: </FormLabel>
                          <RadioGroup row
                            aria-label="position" name="position" defaultValue="top"
                            onChange={(value) => { this.handleChange(value, "haveSymptom") }}
                          >
                            <FormControlLabel
                              value={true}
                              control={<Radio checked={haveSymptom === true ? true : false} />}
                              label="Có"
                              labelPlacement="end"
                            />
                            <FormControlLabel
                              value={false}
                              control={<Radio checked={haveSymptom === false ? true : false} />}
                              label="Không"
                              labelPlacement="end"
                            />
                          </RadioGroup> */}
                          <FormHelperText>{this.state.radioHelperTextHaveSymptom}</FormHelperText>
                        </FormControl>
                      </Grid>
                        <Grid item lg={9} md={8} sm={12} xs={12}>
                        <TextValidator
                          disabled={haveSymptom ? haveSymptom : false}
                          className="nice-input w-100"
                          label={
                            <span className="font">
                              {t("Triệu chứng khác")}
                            </span>
                          }
                          multiLine={true}
                          rows={5}
                          onChange={this.handleChange}
                          type="text"
                          name="symptomText"
                          value={symptomText ? symptomText : ""}
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
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
                              disabled={haveSymptom ? haveSymptom : false}
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
                              disabled={haveSymptom ? haveSymptom : false}
                              control={<Checkbox value={item} />}
                              label={item ? (item.symptom ? item.symptom.name : item.name) : ''}
                            />
                          </Grid>
                        )
                      })}
                    </Grid>
                  </fieldset>
                </Grid>
                {/* <Grid item lg={6} md={6} sm={12} xs={12}>
                  <fieldset>
                    <legend>Triệu chứng nặng: </legend>
                    <Grid container spacing={2} style={{ padding: "4px" }}>
                      {listSevereSymptom && listSevereSymptom.map((item) => {
                        return (
                          <Grid item lg={6} md={6} sm={12} xs={12}>
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
                </Grid> */}
              </Grid>
              <div className="dialog-footer">
                <DialogActions className="p-0">
                  <div className="flex flex-space-between flex-middle">
                    {isUser 
                    ?
                      <Button
                        startIcon={<Icon>home</Icon>}
                        className="mr-12 btn btn-secondary d-inline-flex"
                        variant="contained"
                        onClick={() => {this.props.history.push(ConstantList.ROOT_PATH+"dashboard/analytics")}}>
                        {t("Trở về trang chủ")}
                      </Button>
                    :
                    <Button
                      className="mr-12 btn btn-secondary d-inline-flex"
                      variant="contained"
                      onClick={() => {this.props.history.push(ConstantList.ROOT_PATH+"family")}}>
                      {t("Trở lại danh sách hộ gia đình")}
                    </Button>}
                    <Button
                      startIcon={<SaveIcon />}
                      className="mr-0 btn btn-success d-inline-flex"
                      variant="contained"
                      color="primary"
                      disabled={loading ? true : false}
                      type="submit">
                      {t("general.button.save")}
                    </Button>
                  </div>
                </DialogActions>
              </div>
              {openSaveDialog && (
                <ConfirmationDialog
                  open={openSaveDialog}
                  // onConfirmDialogClose={this.handleClose}
                  onYesClick={this.handleClose}
                  title={t("Đã lưu thành công")}
                  text={t('Cảm ơn bạn đã tham gia khai báo y tế!')}
                  agree={t("OK")}
                  // cancel={t("confirm_dialog.delete.cancel")}
                />
              )}
            </fieldset>
              </Grid>
            </Grid>
            {this.state.familyMemberId &&
              <fieldset className="history_table" style={{ marginTop: "8px" }}>
                <legend>Lịch sử cập nhật thông tin sức khoẻ của thành viên</legend>
                <Grid className="" container spacing={2} style={{ padding: "8px" }}>
                  <Grid item xs={12}>
                    <div style={{maxWidth: "1920px", overflow: "auto"}}>
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
                              render: (rowData) => (this.state.page - 1) * this.state.rowsPerPage + rowData.tableData.id + 1
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
                                let temperature = appConfig.TEMPERATURE_CONST.find((element) => element.value === rowData.temperature);
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
                                let breathingRate = appConfig.BREATHINGRATE_CONST.find((element) => element.value === rowData.breathingRate);
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
                                let spo2 = appConfig.SPO2_CONST.find((element) => element.value === rowData.spo2);
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
                                || (rowData.severeSymptoms && rowData.severeSymptoms.length > 0)
                                || rowData.symptomText) {
                                  return (
                                    <ul style={{margin: 0, paddingInlineStart: "10px"}}>
                                        {rowData.symptomText &&
                                          <li>{rowData.symptomText ? rowData.symptomText : ""}</li>}
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
                            {
                              title: t('Chi tiết'), field: "custom", width: "150",
                              align: "center",
                              headerStyle: {
                                minWidth: "50px",
                                paddingLeft: "10px",
                                paddingRight: "20px",
                              },
                              cellStyle: {
                                minWidth: "50px",
                                paddingLeft: "10px",
                                paddingRight: "20px",
                              },
                              render: rowData =>
                                <IconButton size="small" onClick={() => {
                                  getById(rowData.id).then(({ data }) => {
                                    this.setState({
                                      item: data,
                                      openViewDialog: true
                                    });
                                  })
                                }}>
                                  <Icon fontSize="small" color="primary">visibility</Icon>
                                </IconButton>
                            },
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
                          maxBodyHeight: '300px',
                          headerStyle: {
                            backgroundColor: '#358600',
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

                    </div>
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
                    {openViewDialog && (
                      <ViewDialog
                        handleClose={this.handleClose}
                        open={openViewDialog}
                        updatePageData={this.updatePageData}
                        item={this.state.item}
                        t={t}
                      />
                    )}
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
export default Create;