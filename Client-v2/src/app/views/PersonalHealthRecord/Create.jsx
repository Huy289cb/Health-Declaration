import React from "react";
import { toast } from "react-toastify";
import ConstantList from "../../appConfig";
import "react-toastify/dist/ReactToastify.css";
import "styles/globitsStyles.css";
import Pagination from "@material-ui/lab/Pagination";
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
  Radio,
  InputAdornment,
} from "@material-ui/core";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import FamilyInputPopup from "../Component/SelectFamilyPopup/InputPopup";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SaveIcon from "@material-ui/icons/Save";
import HomeIcon from "@material-ui/icons/Home";
import BlockIcon from "@material-ui/icons/Block";
import { searchByPage as getSymptoms } from "../Symptom/SymptomService";
import {
  addNew,
  update,
  searchByPage,
  getById,
} from "./PersonalHealthRecordService";
import MaterialTable from "material-table";
import NicePagination from "../Component/Pagination/NicePagination";
import ViewDialog from "./ViewDialog";
import localStorageService from "../../services/localStorageService";
import { getFamilyByUserLogin } from "../Family/Service";
import appConfig from "../../appConfig";
import { ConfirmationDialog } from "egret";
import SelectFamilyPopup from "../Component/SelectFamilyPopup/SelectFamilyPopup";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { searchByPage as getBackgroundDisease } from "../BackgroundDisease/BackgroundDiseaseService";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

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
    text: "",
    openViewDialog: false,
    openSaveDialog: false,
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
    if (source == "haveQuickTest") {
      this.setState({ radioHelperTextHaveQuickTest: "", radioErrorHaveQuickTest: false });
      if (event.target.defaultValue == "false") {
        this.setState({
          haveQuickTest: false,
        });
        this.resetHaveQuickTest();
      } else {
        this.setState({
          haveQuickTest: true,
        });
      }
      return;
    }
    if (source == "havePCR") {
      this.setState({ radioHelperTextHavePCR: "", radioErrorHavePCR: false });
      if (event.target.defaultValue == "false") {
        this.setState({
          havePCR: false,
        });
        this.resetHavePCR();
      } else {
        this.setState({
          havePCR: true,
        });
      }
      return;
    }
    if (source == "haveSymptom") {
      this.setState({
        radioHelperTextHaveSymptom: "",
        radioErrorHaveSymptom: false,
      });
      if (event.target.defaultValue == "false") {
        this.setState({
          haveSymptom: false,
          nomalSystoms: [],
          severeSymptoms: [],
          symptomText: "",
        });
      } else {
        this.setState({
          haveSymptom: true,
        });
      }
      return;
    }
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  resetHaveQuickTest = () => {
    this.setState({
      haveQuickTest: false,
      quickTestResults: null,
      quickTestDate: null,
      quickTestResultsError: false,
      quickTestResultsHelperText: "",
    });
  };
  resetHavePCR = () => {
    this.setState({
      havePCR: false,
      pcrResults: null,
      pcrTestDate: null,
      pcrResultsError: false,
      pcrResultsHelperText: "",
    });
  };
  openCircularProgress = () => {
    this.setState({ loading: true });
  };

  handleFormSubmit = async () => {
    await this.openCircularProgress();
    if (!this.validateData()) {
      this.setState({ loading: false });
      toast.warning("C?? tr?????ng b???t bu???c ch??a ???????c nh???p");
    } else {
      let { id, familyMember } = this.state;
      let { t } = this.props;
      if (
        familyMember &&
        familyMember.member &&
        familyMember.member.backgroundDiseases &&
        familyMember.member.backgroundDiseases.length > 0
      ) {
        familyMember.member.listBackgroundDisease = [];
        familyMember.member.backgroundDiseases.forEach((element) => {
          familyMember.member.listBackgroundDisease.push({
            backgroundDisease: element,
          });
        });
      }
      this.setState({ familyMember }, () => {
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
        obj.pulseRate = this.state.pulseRate;
        obj.pcrTestDate = this.state.pcrTestDate;
        obj.quickTestDate = this.state.quickTestDate;
        obj.haveQuickTest = this.state.haveQuickTest;
        obj.havePCR = this.state.havePCR;
        obj.pcrResults = this.state.pcrResults;
        obj.quickTestResults = this.state.quickTestResults;
        obj.symptomText = this.state.symptomText;
        obj.haveSymptom = this.state.haveSymptom;
        if (
          this.state.familyMember &&
          this.state.familyMember.member &&
          this.state.familyMember.member.weight
        ) {
          obj.weight = this.state.familyMember.member.weight;
        }
        if (this.state.nomalSystoms) {
          let c = [];
          this.state.nomalSystoms.forEach((e) => {
            let p = {};
            p.symptom = e;
            c.push(e);
          });
          obj.nomalSystoms = c;
        }
        if (this.state.severeSymptoms) {
          let c = [];
          this.state.severeSymptoms.forEach((e) => {
            let p = {};
            p.symptom = e;
            c.push(e);
          });
          obj.severeSymptoms = c;
        }
        addNew(obj).then((response) => {
          if (response.data != null && response.status == 200) {
            // this.resetState();
            this.setState({ loading: false, openSaveDialog: true, }, () => {
              // this.updatePageData()
            });
            toast.success("C???m ??n b???n ???? tham gia khai b??o th??ng tin y t???");
          }
        });
      });
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
      pulseRate: null,
      quickTestDate: null,
      pcrTestDate: null,
      haveSymptom: null,
      symptomText: "",
      familyMemberId: null,
    });
  };

  validateData = () => {
    let r = true;
    let { familyMember } = this.state;
    if (!familyMember) {
      this.setState({
        selectFamilyMemberHelperText: "????y l?? tr?????ng b???t bu???c",
        selectFamilyMemberError: true,
      });
      r = false;
    } 
    // else {
    //   if (
    //     familyMember.member.haveBackgroundDisease === null ||
    //     familyMember.member.haveBackgroundDisease === undefined
    //   ) {
    //     this.setState({
    //       radioHelperText: "????y l?? tr?????ng b???t bu???c",
    //       radioError: true,
    //     });
    //     r = false;
    //   }
    // }
    if (this.state.haveQuickTest === null || this.state.haveQuickTest === undefined) {
      this.setState({
        radioHelperTextHaveQuickTest: "????y l?? tr?????ng b???t bu???c",
        radioErrorHaveQuickTest: true,
      });
      r = false;
    }
    if (this.state.havePCR === null || this.state.havePCR === undefined) {
      this.setState({
        radioHelperTextHavePCR: "????y l?? tr?????ng b???t bu???c",
        radioErrorHavePCR: true,
      });
      r = false;
    }
    if (this.state.haveQuickTest && !this.state.quickTestResults) {
      this.setState({
        quickTestResultsHelperText: "????y l?? tr?????ng b???t bu???c",
        quickTestResultsError: true,
      });
      r = false;
    }
    if (this.state.havePCR && !this.state.pcrResults) {
      this.setState({
        pcrResultsHelperText: "????y l?? tr?????ng b???t bu???c",
        pcrResultsError: true,
      });
      r = false;
    }
    if (!this.state.breathingRate) {
      this.setState({breathingRateHelperText:"????y l?? tr?????ng b???t bu???c", breathingRateError:true})
      r = false;
    }
    if (!this.state.temperature) {
      this.setState({temperatureHelperText:"????y l?? tr?????ng b???t bu???c", temperatureError:true})
      r = false;
    }
    let symptomLength =
      this.state.nomalSystoms.length + this.state.severeSymptoms.length;
    if (
      !this.state.haveSymptom &&
      symptomLength == 0 &&
      !this.state.symptomText
    ) {
      // this.setState({radioHelperTextHaveSymptom: "????y l?? tr?????ng b???t bu???c", radioErrorHaveSymptom: true});
      toast.warning(
        "Ch???n \"kh??ng tri???u ch???ng\" ho???c ch???n/nh???p ??t nh???t 1 tri???u ch???ng"
      );
      r = false;
    }
    if (!this.state.pulseRate) {
      r = false;
    }
    if (r) {
      return true;
    } else {
      return false;
    }
  };

  componentDidMount() {
    if (localStorageService.getItem("role") === "ROLE_USER") {
      this.setState({ isUser: true });
      getFamilyByUserLogin().then(({ data }) => {
        this.setState({ family: data });
      });
    }
    getBackgroundDisease({ pageIndex: 0, pageSize: 1000 }).then(({ data }) => {
      this.setState({ listDataBackgroundDisease: [...data.content] });
    });

    let obj = {
      pageSize: 1000,
      pageIndex: 0,
    };
    getSymptoms(obj).then(({ data }) => {
      if (data && data.content) {
        let listNormalSymptom = [];
        let listSevereSymptom = [];
        data.content.forEach((item) => {
          if (item?.type == 1) {
            listNormalSymptom.push(item);
          }
          if (item?.type == 1) {
            listSevereSymptom.push(item);
          }
        });
        this.setState({ listNormalSymptom, listSevereSymptom });
      }
    });
    ValidatorForm.addValidationRule("diastolicBloodPressureMatch", (value) => {
      if (Number(value) > Number(this.state.systolicBloodPressure)) {
        return false;
      }
      return true;
    });
  }
  componentWillUnmount() {
    ValidatorForm.removeValidationRule("diastolicBloodPressureMatch");
  }
  componentWillMount() {}

  //history table
  //Paging handle start
  setPage = (page) => {
    this.setState({ page }, function () {
      this.updatePageData();
    });
  };
  setRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value, page: 1 }, function () {
      this.updatePageData();
    });
  };
  handleChangePage = (event, newPage) => {
    this.setPage(newPage);
  };
  //Paging handle end
  updatePageData = (item) => {
    let obj = {
      pageSize: 100,
      pageIndex: 0,
    };
    getSymptoms(obj).then(({ data }) => {
      if (data && data.content) {
        let listNormalSymptom = [];
        let listSevereSymptom = [];
        data.content.forEach((item) => {
          if (item?.type == 1) {
            listNormalSymptom.push(item);
          }
          if (item?.type == 2) {
            listSevereSymptom.push(item);
          }
        });
        console.log(listNormalSymptom);
        console.log(listSevereSymptom);
        this.setState({ listNormalSymptom, listSevereSymptom });
      }
    });
    var searchObject = { showHistoryForm: true };
    if (item != null) {
      this.setState(
        {
          page: 1,
          text: item.text,
        },
        () => {
          searchObject.text = this.state.text;
          searchObject.pageIndex = this.state.page;
          searchObject.pageSize = this.state.rowsPerPage;
          searchObject.familyMemberId = this.state.familyMemberId;
          searchByPage(searchObject).then(({ data }) => {
            this.setState({
              itemList: [...data.content],
              totalElements: data.totalElements,
              totalPages: data.totalPages,
            });
            if (data.content && data.content.length > 0) {
              this.updateLastData(data.content[0]);
            }
          });
        }
      );
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
        });
        if (data.content && data.content.length > 0) {
          this.updateLastData(data.content[0])
        }
      });
    }
  };

  updateLastData = (item) => {
    let iscurrentDate = moment(item?.declarationTime).isSame(moment(), "day");
    if(iscurrentDate) {
      this.setState({errorMemberMessage : "Th??nh vi??n n??y ???? khai b??o y t??? ng??y h??m nay", errorMember: true})
    }
    this.setState({
      haveQuickTest: item.haveQuickTest,
      quickTestResults: item.quickTestResults,
      havePCR: item.havePCR,
      pcrResults: item.pcrResults,
      quickTestDate: item.quickTestDate,
      pcrTestDate: item.pcrTestDate,
      temperature: item.temperature,
      breathingRate: item.breathingRate,
      spo2: item.spo2,
      diastolicBloodPressure: item.diastolicBloodPressure,
      systolicBloodPressure: item.systolicBloodPressure,
      pulseRate: item.pulseRate,
    });
    if (item.haveQuickTest) {
      this.setState({
        radioHelperTextHaveQuickTest: "",
        radioErrorHaveQuickTest: false,
      });
    }
    if (item.havePCR) {
      this.setState({
        radioHelperTextHavePCR: "",
        radioErrorHavePCR: false,
      });
    }
  }

  resetLastData = () => {
    this.setState({
      errorMemberMessage : "",
      haveQuickTest: null,
      quickTestResults: null,
      havePCR: null,
      pcrResults: null,
      quickTestDate: null,
      pcrTestDate: null,
      temperature: null,
      breathingRate: null,
      spo2: null,
      diastolicBloodPressure: null,
      systolicBloodPressure: null,
      radioHelperTextHaveQuickTest: "",
      radioErrorHaveQuickTest: false,
      radioHelperTextHavePCR: "",
      radioErrorHavePCR: false,
      pulseRate: null,
    });
  }

  handleClose = () => {
    this.setState(
      {
        openViewDialog: false,
        openSaveDialog: false,
      },
      () => {
        this.updatePageData();
      }
    );
  };

  getBMI = (height, weight) => {
    let bmi = (weight / ((height / 100) * (height / 100))).toFixed(2);
    let bmiText = "";
    if (bmi < 18.5) {
      bmiText = "Thi???u c??n";
    } else if (bmi >= 18.5 && bmi < 25) {
      bmiText = "C??n ?????i";
    } else if (bmi >= 25 && bmi < 30) {
      bmiText = "Th???a c??n";
    } else if (bmi >= 30 && bmi < 35) {
      bmiText = "B??o ph??";
    } else if (bmi >= 35) {
      bmiText = "B??o ph?? nguy hi???m";
    }
    this.setState({ bmi: bmi + " - " + bmiText, bmiText: bmiText });
  };

  selectListBackgroundDisease = (values) => {
    let { familyMember } = this.state;
    if (!familyMember) {
      familyMember = { member: {} };
    }
    familyMember.member.backgroundDiseases = values;
    this.setState({ familyMember });
  };

  renderSelectOptions = () =>
  {
    if ( this.state?.family?.familyMembers )
    {
      return this.state.family.familyMembers.map( ( item, i ) =>
      {
        return (
          <MenuItem key={ item.id } value={ item.id }>
            { item.member?.displayName ? item.member?.displayName : "" }
          </MenuItem>
        );
      } );
    }
  }

  changeFamilyMember = ( familyMemberId ) =>
  {
    let { family } = this.state;
    let familyMember = family && family.familyMembers ? family.familyMembers.find( element => element.id == familyMemberId ) : null;
    if ( familyMember && familyMember.id ) {
      this.resetLastData();
      this.setState( { familyMemberId: familyMember.id, familyMember: familyMember }, () =>
      {
        this.updatePageData();
      } )
      if ( familyMember )
      {
        familyMember.member.backgroundDiseases = [];
        if ( familyMember.member && familyMember.member.listBackgroundDisease )
        {
          familyMember.member.listBackgroundDisease.forEach( element =>
          {
            familyMember.member.backgroundDiseases.push( element.backgroundDisease );
          } );
          this.setState( { familyMember } );
        }
        if ( familyMember.member && familyMember.member.weight && familyMember.member.height )
        {
          this.getBMI( Number( familyMember.member.height ), Number( familyMember.member.weight ) );
        } else
        {
          this.setState( { bmi: "", bmiText: "" } );
        }
      }
    }
  }

  handleChangeHeightWeight = (value, type) => {
    const familyMember = this.state.familyMember;
    if (familyMember?.member) {
      familyMember.member[type] = value;
      this.setState( { familyMember }, () => {
        const familyMember = this.state.familyMember;
          if ( familyMember?.member?.weight && familyMember?.member?.height ) {
            this.getBMI( Number( familyMember?.member?.height ), Number( familyMember.member.weight ) );
          }
      } );
    } else {
      toast.warn("Ch??a ch???n th??nh vi??n");
    }
  }

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
      pulseRate,
      bmi,
      bmiText,
      openSaveDialog,
      quickTestDate,
      pcrTestDate,
      openFamilyPopup,
      haveQuickTest,
      quickTestResults,
      havePCR,
      pcrResults,
      loading,
      haveSymptom,
      symptomText,
      listDataBackgroundDisease,
      backgroundDiseases,
      familyMemberId,
    } = this.state;
    return (
      <>
        <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
          <DialogContent style={{ backgroundColor: "#fff" }}>
            <Grid container spacing={1}>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                {/* <Button
                  startIcon={<Icon>home</Icon>}
                  className="mr-12 btn btn-secondary d-inline-flex"
                  variant="contained"
                  onClick={() => {
                    this.props.history.push(
                      ConstantList.ROOT_PATH + "dashboard/analytics"
                    );
                  }}
                >
                  Trang ch???
                </Button> */}
                {!isUser && (
                  <>
                    <Button
                      size="small"
                      className="btn btn-primary-d btn-select-family"
                      variant="contained"
                      onClick={() => this.setState({ openFamilyPopup: true })}
                    >
                      Ch???n h??? gia ????nh
                    </Button>
                    <SelectFamilyPopup
                      open={openFamilyPopup}
                      handleSelect={(item) => {
                        this.setState({
                          family: item,
                          openFamilyPopup: false,
                          familyMember: {},
                          familyMemberId: null,
                        });
                        this.resetState();
                      }}
                      selectedItem={family ? family : {}}
                      handleClose={() =>
                        this.setState({ openFamilyPopup: false })
                      }
                      t={t}
                    />
                  </>
                )}

                <div className="pt-16">
                  (<span style={{ color: "red" }}> * </span>){" "}
                  <i>Tr?????ng b???t bu???c.</i>
                </div>
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <div className="head-line">Khai b??o y t???</div>
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Grid className="" container spacing={2} style={{ paddingTop: "12px" }}>
                  {/* code */}
                  {!isUser && (
                    <Grid item sm={ 12 } xs={ 12 }>
                      <TextValidator
                        className="nice-input w-100"
                        disabled
                        fullWidth
                        id="family"
                        size="small"
                        name="family"
                        label={ <span className="font">
                          <span style={ { color: "red" } }> * </span>
                          H??? gia ????nh
                        </span> }
                        value={
                          family ? ( family.code ? family.code + " | " : "" ) + ( family.name ? family.name + " | " : "" )
                            + ( family.detailAddress ? family.detailAddress : "" ) : ""
                        }
                        required
                        variant="outlined"
                        validators={ ["required"] }
                        errorMessages={ [t( "general.errorMessages_required" )] }
                      />
                    </Grid>
                  )}
                  <Grid item lg={ 3 } md={ 3 } sm={ 12 } xs={ 12 }>
                    <FormControl 
                    // error={this.state.errorMember}
                    className="nice-input" fullWidth={ true } variant="outlined" size="small">
                      <InputLabel htmlFor="familyMembers-simple">
                        {
                          <span className="">
                            <span style={ { color: "red" } }> * </span>
                            Ch???n th??nh vi??n gia ????nh
                          </span>
                        }
                      </InputLabel>
                      <Select
                        label={ <span className="">
                          <span style={ { color: "red" } }> * </span>
                            Ch???n th??nh vi??n gia ????nh
                        </span> }
                        value={ familyMemberId ? familyMemberId : "" }
                        onChange={ ( event ) => this.changeFamilyMember( event.target.value )}
                        validators={ ["required"] }
                        errorMessages={ [t( "general.required" )] }
                        disabled={!family}
                        onClick={() => {
                          if ( !this.state?.family?.familyMembers ) {
                            toast.warn("Ch??a ch???n h??? gia ????nh");
                          }
                        }}
                      >
                        { family?.familyMembers && this.renderSelectOptions() }
                      </Select>
                      <FormHelperText style={{color: "#3366ff"}}>{this.state.errorMemberMessage}</FormHelperText>
                    </FormControl>
                  </Grid>
                  {/* <Grid item lg={ 3 } md={ 3 } sm={ 6 } xs={ 6 }>
                    <TextValidator
                      className="nice-input w-100"
                      label="Tu???i"
                      disabled
                      type="number"
                      name="age"
                      value={ familyMember?.member?.age ? familyMember?.member?.age : "" }
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item lg={ 3 } md={ 3 } sm={ 6 } xs={ 6 }>
                    <TextValidator
                      className="nice-input w-100"
                      label="Gi???i t??nh"
                      disabled
                      type="text"
                      name="gender"
                      value={ (familyMember?.member?.gender == "F") ? "N???" : ( familyMember?.member?.gender == "M") ? "Nam" : ""}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  
                  <Grid item lg={ 3 } md={ 3 } sm={ 12 } xs={ 12 }>
                    <TextValidator
                        className="nice-input w-100"
                        label="S??? ??i???n tho???i c?? nh??n"
                        disabled
                        onChange={this.handleChange}
                        type="text"
                        name="phoneNumber"
                        value={familyMember?.member?.phoneNumber ? familyMember?.member?.phoneNumber : ""}
                        variant="outlined"
                        size="small"
                      />
                  </Grid> */}
                  <Grid item lg={ 3 } md={ 3 } sm={ 12 } xs={ 12 }>
                    <TextValidator
                      className="nice-input w-100"
                      label="Chi???u cao"
                      disabled={!familyMember?.member}
                      onChange={ ( event ) => {
                        this.handleChangeHeightWeight(event.target.value, 'height');
                      }}
                      type="text"
                      name="height"
                      value={ familyMember?.member?.height ? familyMember?.member?.height : "" }
                      variant="outlined"
                      size="small"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">(cm)</InputAdornment>
                      }}
                    />
                  </Grid>
                  <Grid item lg={ 3 } md={ 3 } sm={ 12 } xs={ 12 }>
                    <TextValidator
                      className="nice-input w-100"
                      label="C??n n???ng"
                      disabled={!familyMember?.member}
                      onChange={ ( event ) => {
                        this.handleChangeHeightWeight(event.target.value, 'weight');
                      }}
                      type="number"
                      name="weight"
                      value={ familyMember?.member?.weight ? familyMember?.member?.weight : "" }
                      variant="outlined"
                      size="small"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">(kg)</InputAdornment>
                      }}
                    />
                  </Grid>
                  <Grid item lg={ 3 } md={ 3 } sm={ 12 } xs={ 12 }>
                    <TextValidator
                      className="nice-input w-100"
                      label="Ch??? s??? BMI"
                      disabled
                      type="text"
                      name="bmi"
                      value={ bmi ? bmi : "" }
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  {/* <Grid item lg={ 3 } md={ 6 } sm={ 12 } xs={ 12 }>
                    <TextValidator
                      className="nice-input w-100"
                      label="????nh gi?? ch??? s??? BMI"
                      disabled
                      type="text"
                      name="bmiText"
                      value={ bmiText ? bmiText : "" }
                      variant="outlined"
                      size="small"
                    />
                  </Grid> */}
                  {/* <Grid item lg={ 3 } md={ 6 } sm={ 12 } xs={ 12 }>
                    <FormControl error={ this.state.radioError }
                      disabled={ familyMember ? false : true }
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}>
                      <span><span style={ { color: "red" } }> * </span>C?? b???nh n???n:</span>
                      <RadioGroup row aria-label="haveBackgroundDisease" name="haveBackgroundDisease"
                        value={ familyMember && familyMember.member ? familyMember.member.haveBackgroundDisease : null }
                        onChange={ ( event ) => {
                          if ( event.target.value === "true" ) {
                            familyMember.member.haveBackgroundDisease = true;
                          }
                          else {
                            familyMember.member.haveBackgroundDisease = false;
                            familyMember.member.backgroundDiseases = [];
                          }
                          this.setState( { familyMember, radioHelperText: "", radioError: false } )
                        }}>
                        <FormControlLabel value={ true }
                          control={ <Radio checked={ familyMember && familyMember.member ? ( familyMember.member.haveBackgroundDisease === true ? true : false ) : false } /> }
                          label="C??" />
                        <FormControlLabel value={ false }
                          control={ <Radio checked={ familyMember && familyMember.member ? ( familyMember.member.haveBackgroundDisease === false ? true : false ) : false } /> }
                          label="Kh??ng" />
                      </RadioGroup>
                      <FormHelperText>{ this.state.radioHelperText }</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item lg={ 9 } md={ 12 } sm={ 12 } xs={ 12 }>
                    <Autocomplete
                      className="nice-input w-100"
                      disabled={ familyMember && familyMember.member ? ( familyMember.member.haveBackgroundDisease ? false : true ) : true }
                      style={ { width: "100%", paddingTop: "0px" } }
                      multiple
                      id="combo-box-demo"
                      defaultValue={ familyMember && familyMember.member && familyMember.member.backgroundDiseases ? familyMember.member.backgroundDiseases : [] }
                      value={ familyMember && familyMember.member && familyMember.member.backgroundDiseases ? familyMember.member.backgroundDiseases : [] }
                      options={ listDataBackgroundDisease ? listDataBackgroundDisease : [] }
                      getOptionSelected={ ( option, value ) =>
                        option.id === value.id
                      }
                      getOptionLabel={ ( option ) => option.name ? option.name : "" }
                      onChange={ ( event, value ) =>
                      {
                        this.selectListBackgroundDisease( value );
                      } }
                      renderInput={ ( params ) => (
                        <TextValidator
                          { ...params }
                          value={ familyMember && familyMember.member && familyMember.member.backgroundDiseases ? familyMember.member.backgroundDiseases : [] }
                          label={<span className="font">B???nh n???n</span>}
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      ) }
                    />
                  </Grid> */}
                  <Grid item lg={12} md={12} sm={12} xs={12} >
                    <div className="head-line">X??t nghi???m COVID</div>
                    <div style={{ padding: "12px" }}>
                      <Grid container spacing={2}>
                        <Grid item lg={4} md={4} sm={12} xs={12}>
                          <FormControl error={ this.state.radioErrorHaveQuickTest }>
                              <div style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}>
                                <span><span style={ { color: "red" } }> * </span>X??t nghi???m nhanh:</span>
                                <RadioGroup row
                                  aria-label="position" name="position" defaultValue="top"
                                  onChange={ ( value ) => { this.handleChange( value, "haveQuickTest" ) } }
                                >
                                  <FormControlLabel
                                    value={ true }
                                    control={ <Radio checked={ haveQuickTest === true ? true : false } /> }
                                    label="C??"
                                    labelPlacement="end"
                                  />
                                  <FormControlLabel
                                    value={ false }
                                    control={ <Radio checked={ haveQuickTest === false ? true : false } /> }
                                    label="Kh??ng"
                                    labelPlacement="end"
                                  />
                                </RadioGroup>
                              </div>
                            <FormHelperText>{ this.state.radioHelperTextHaveQuickTest }</FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid item lg={4} md={4} sm={12} xs={12} style={{ display: haveQuickTest ? "block" : "none" }}>
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
                              label={
                                <span>
                                  <span style={{ color: "red" }}> * </span>
                                  Ng??y x??t nghi???m
                                </span>
                              }
                              format="dd/MM/yyyy"
                              size="small"
                              InputAdornmentProps={{ position: "end" }}
                              onChange={(date) =>
                                this.setState({ quickTestDate: date })
                              }
                              value={quickTestDate ? quickTestDate : null}
                              required={
                                haveQuickTest ? haveQuickTest : false
                              }
                            />
                          </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item lg={4} md={4} sm={12} xs={12} style={{ display: haveQuickTest ? "block" : "none" }}>
                          <FormControl
                            className="nice-input"
                            fullWidth={true}
                            error={this.state.quickTestResultsError}
                            variant="outlined"
                            size="small"
                          >
                            <InputLabel htmlFor="quickTestResults-simple">
                              {
                                <span>
                                  <span style={{ color: "red" }}> * </span>
                                  K???t qu??? x??t nghi???m nhanh
                                </span>
                              }
                            </InputLabel>
                            <Select
                              label={
                                <span>
                                  <span style={{ color: "red" }}> * </span>
                                  K???t qu??? x??t nghi???m nhanh
                                </span>
                              }
                              value={
                                quickTestResults ? quickTestResults : ""
                              }
                              onChange={(event) => {
                                this.setState({
                                  quickTestResults: event.target.value,
                                  quickTestResultsError: false,
                                  quickTestResultsHelperText: "",
                                });
                              }}
                              inputProps={{
                                name: "quickTestResults",
                                id: "quickTestResults-simple",
                              }}
                            >
                              {ConstantList.RESULT_TEST &&
                                ConstantList.RESULT_TEST.map((item) => {
                                  return (
                                    <MenuItem
                                      key={item.key}
                                      value={item.key}
                                    >
                                      {item.value ? item.value : ""}
                                    </MenuItem>
                                  );
                                })}
                            </Select>
                            <FormHelperText>{this.state.quickTestResultsHelperText}</FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item lg={4} md={4} sm={12} xs={12}>
                          <FormControl error={ this.state.radioErrorHavePCR }>
                            <div style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}>
                              <span><span style={ { color: "red" } }> * </span>X??t nghi???m PCR:</span>
                              <RadioGroup row
                                aria-label="position" name="position" defaultValue="top"
                                onChange={ ( value ) => { this.handleChange( value, "havePCR" ) } }
                              >
                                <FormControlLabel
                                  value={ true }
                                  control={ <Radio checked={ havePCR === true ? true : false } /> }
                                  label="C??"
                                  labelPlacement="end"
                                />
                                <FormControlLabel
                                  value={ false }
                                  control={ <Radio checked={ havePCR === false ? true : false } /> }
                                  label="Kh??ng"
                                  labelPlacement="end"
                                />
                              </RadioGroup>
                            </div>
                            <FormHelperText>{ this.state.radioHelperTextHavePCR }</FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid item lg={4} md={4} sm={12} xs={12} style={{ display: havePCR ? "block" : "none" }}>
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
                              label={
                                <span>
                                  <span style={{ color: "red" }}> * </span>
                                  Ng??y x??t nghi???m
                                </span>
                              }
                              format="dd/MM/yyyy"
                              size="small"
                              InputAdornmentProps={{ position: "end" }}
                              onChange={(date) =>
                                this.setState({ pcrTestDate: date })
                              }
                              value={pcrTestDate ? pcrTestDate : null}
                              required={havePCR ? havePCR : false}
                            />
                          </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item lg={4} md={4} sm={12} xs={12} style={{ display: havePCR ? "block" : "none" }}>
                          <FormControl
                            className="nice-input"
                            error={this.state.pcrResultsError}
                            fullWidth={true}
                            variant="outlined"
                            size="small"
                          >
                            <InputLabel htmlFor="pcrResults-simple">
                              {
                                <span>
                                  <span style={{ color: "red" }}> * </span>
                                  K???t qu??? x??t nghi???m PCR
                                </span>
                              }
                            </InputLabel>
                            <Select
                              label={
                                <span>
                                  <span style={{ color: "red" }}> * </span>
                                  K???t qu??? x??t nghi???m PCR
                                </span>
                              }
                              value={pcrResults ? pcrResults : ""}
                              onChange={(event) => {
                                this.setState({
                                  pcrResults: event.target.value,
                                  pcrResultsError: false,
                                  pcrResultsHelperText: "",
                                });
                              }}
                              inputProps={{
                                name: "pcrResults",
                                id: "pcrResults-simple",
                              }}
                            >
                              {ConstantList.RESULT_TEST &&
                                ConstantList.RESULT_TEST.map((item) => {
                                  return (
                                    <MenuItem
                                      key={item.key}
                                      value={item.key}
                                    >
                                      {item.value ? item.value : ""}
                                    </MenuItem>
                                  );
                                })}
                            </Select>
                            <FormHelperText>
                              {this.state.pcrResultsHelperText}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </div>
                  </Grid>

                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <div className="head-line">C??c ch??? s???</div>
                    <Grid container spacing={2} style={{ padding: "12px" }}>
                      <Grid item lg={4} md={4} sm={12} xs={12}>
                        <FormControl
                          error={this.state.temperatureError}
                          className="nice-input"
                          fullWidth={true}
                          variant="outlined"
                          size="small"
                        >
                          <InputLabel htmlFor="temperature-simple">
                            <span>
                              <span style={{ color: "red" }}> * </span>
                              Nhi???t ????? (??C)
                            </span>
                          </InputLabel>
                          <Select
                            label={<span>
                              <span style={{ color: "red" }}> * </span>
                              Nhi???t ????? (??C)
                            </span>}
                            value={temperature ? temperature : ""}
                            onChange={(event) => {
                              this.setState({
                                temperature: event.target.value,
                                temperatureError: false, temperatureHelperText: ""
                              });
                            }}
                            inputProps={{
                              name: "temperature",
                              id: "temperature-simple",
                            }}
                          >
                            {appConfig.TEMPERATURE_CONST.map((item) => {
                              return (
                                <MenuItem key={item.key} value={item.value}>
                                  {item.key ? item.key : ""}
                                </MenuItem>
                              );
                            })}
                          </Select>
                          <FormHelperText>{this.state.temperatureHelperText}</FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item lg={4} md={4} sm={12} xs={12}>
                        <FormControl
                          className="nice-input"
                          error={this.state.breathingRateError}
                          fullWidth={true}
                          variant="outlined"
                          size="small"
                        >
                          <InputLabel htmlFor="breathingRate-simple">
                            <span>
                              <span style={{ color: "red" }}> * </span>
                              Nh???p th??? (l???n/ph??t)
                            </span>
                          </InputLabel>
                          <Select
                            label={<span>
                              <span style={{ color: "red" }}> * </span>
                              Nh???p th??? (l???n/ph??t)
                            </span>}
                            value={breathingRate ? breathingRate : ""}
                            onChange={(event) => {
                              this.setState({
                                breathingRate: event.target.value,
                                breathingRateError: false, breathingRateHelperText: ""
                              });
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
                          <FormHelperText>{this.state.breathingRateHelperText}</FormHelperText> 
                        </FormControl>
                      </Grid>
                      <Grid item lg={4} md={4} sm={12} xs={12}>
                        <TextValidator
                          className="nice-input w-100"
                          label={
                            <span className="font">
                              <span style={{ color: "red" }}> * </span>
                              M???ch
                            </span>
                          }
                          onChange={this.handleChange}
                          type="number"
                          name="pulseRate"
                          value={ pulseRate ? pulseRate : "" }
                          validators={["required", "minNumber:0" ]}
                          errorMessages={["Tr?????ng n??y l?? b???t bu???c", "Ph???i l?? s??? d????ng"]}
                          variant="outlined"
                          size="small"
                          InputProps={{
                            endAdornment: <InputAdornment position="end">(l???n/ph??t)</InputAdornment>
                          }}
                        />
                      </Grid>
                      <Grid item lg={4} md={4} sm={12} xs={12}>
                        <FormControl
                          className="nice-input"
                          fullWidth={true}
                          variant="outlined"
                          size="small"
                        >
                          <InputLabel htmlFor="spo2-simple">
                            {<span>Ch??? s??? SpO2</span>}
                          </InputLabel>
                          <Select
                            label={<span>Ch??? s??? SpO2</span>}
                            value={spo2 ? spo2 : ""}
                            onChange={(event) => {
                              this.setState({ spo2: event.target.value });
                            }}
                            inputProps={{
                              name: "spo2",
                              id: "spo2-simple",
                            }}
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
                      <Grid item lg={4} md={4} sm={12} xs={12}>
                        <TextValidator
                          className="nice-input w-100"
                          label={
                            <span className="font">Huy???t ??p t???i ??a</span>
                          }
                          onChange={this.handleChange}
                          type="number"
                          name="systolicBloodPressure"
                          value={
                            systolicBloodPressure ? systolicBloodPressure : ""
                          }
                          validators={["minNumber:0"]}
                          errorMessages={["Ph???i l?? s??? d????ng"]}
                          variant="outlined"
                          size="small"
                          InputProps={{
                            endAdornment: <InputAdornment position="end">(mmHg)</InputAdornment>
                          }}
                        />
                      </Grid>
                      <Grid item lg={4} md={4} sm={12} xs={12}>
                        <TextValidator
                          className="nice-input w-100"
                          label={
                            <span className="font">
                              Huy???t ??p t???i thi???u"
                            </span>
                          }
                          onChange={this.handleChange}
                          type="number"
                          name="diastolicBloodPressure"
                          value={
                            diastolicBloodPressure ? diastolicBloodPressure : ""
                          }
                          validators={[
                            "diastolicBloodPressureMatch",
                            "minNumber:0",
                          ]}
                          errorMessages={[
                            "Huy???t ??p t???i thi???u ph???i nh??? h??n huy???t ??p t???i ??a",
                            "Ph???i l?? s??? d????ng",
                          ]}
                          variant="outlined"
                          size="small"
                          InputProps={{
                            endAdornment: <InputAdornment position="end">(mmHg)</InputAdornment>
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <div className="head-line"><span style={{ color: "red" }}> * </span>Tri???u ch???ng</div>
                    <Grid container style={{ padding: "12px" }}>
                      <Grid item lg={3} md={3} sm={12} xs={12}>
                        <FormControl
                          component="fieldset"
                          error={this.state.radioErrorHaveSymptom}
                        >
                          <FormControlLabel
                            value={true}
                            control={
                              <Checkbox
                                checked={haveSymptom ? haveSymptom : false}
                              />
                            }
                            onChange={(e) => {
                              this.setState({
                                haveSymptom: e.target.checked,
                                radioErrorHaveSymptom: false,
                                radioHelperTextHaveSymptom: "",
                              });
                            }}
                            label="Kh??ng c?? tri???u ch???ng"
                            labelPlacement="end"
                            disabled={
                              (nomalSystoms && nomalSystoms.length > 0
                                ? true
                                : false) ||
                              (severeSymptoms && severeSymptoms.length > 0
                                ? true
                                : false) ||
                              (symptomText ? true : false)
                            }
                          />
                          <FormHelperText>
                            {this.state.radioHelperTextHaveSymptom}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item lg={9} md={9} sm={12} xs={12}></Grid>
                      {listNormalSymptom &&
                        listNormalSymptom.map((item) => {
                          return (
                            <Grid item lg={4} md={4} sm={12} xs={12}>
                              <FormControlLabel
                                onChange={(event, value) => {
                                  if (value) {
                                    //th??m
                                    if (!nomalSystoms) {
                                      nomalSystoms = [];
                                    }
                                    nomalSystoms = [
                                      ...nomalSystoms,
                                      { symptom: item },
                                    ];
                                  } else {
                                    //xo??
                                    nomalSystoms = nomalSystoms.filter((e) => {
                                      return e.symptom.id != item.id;
                                    });
                                  }
                                  this.setState({ nomalSystoms });
                                }}
                                disabled={haveSymptom ? haveSymptom : false}
                                control={<Checkbox value={item} />}
                                label={
                                  item
                                    ? item.symptom
                                      ? item.symptom.name
                                      : item.name
                                    : ""
                                }
                              />
                            </Grid>
                          );
                        })}
                      {listSevereSymptom &&
                        listSevereSymptom.map((item) => {
                          return (
                            <Grid item lg={4} md={4} sm={12} xs={12}>
                              <FormControlLabel
                                onChange={(event, value) => {
                                  if (value) {
                                    //th??m
                                    if (!severeSymptoms) {
                                      severeSymptoms = [];
                                    }
                                    severeSymptoms = [
                                      ...severeSymptoms,
                                      { symptom: item },
                                    ];
                                  } else {
                                    //xo??
                                    severeSymptoms = severeSymptoms.filter(
                                      (e) => {
                                        return e.symptom.id != item.id;
                                      }
                                    );
                                  }
                                  this.setState({ severeSymptoms });
                                }}
                                disabled={haveSymptom ? haveSymptom : false}
                                control={<Checkbox value={item} />}
                                label={
                                  item
                                    ? item.symptom
                                      ? item.symptom.name
                                      : item.name
                                    : ""
                                }
                              />
                            </Grid>
                          );
                        })}
                        <Grid item sm={ 12 } xs={ 12 } className="mt-8">
                          <TextValidator
                            disabled={haveSymptom ? haveSymptom : false}
                            className="nice-input w-100"
                            label={
                              <span className="font">
                                Tri???u ch???ng kh??c
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
                    </Grid>
                  </Grid>
                </Grid>
                <div className="dialog-footer">
                  <DialogActions className="p-0">
                    <div className="flex flex-space-between flex-middle">
                      {isUser ? (
                        <Button
                          startIcon={<Icon>home</Icon>}
                          className="mr-12 btn btn-secondary d-inline-flex"
                          variant="contained"
                          onClick={() => {
                            this.props.history.push(
                              ConstantList.ROOT_PATH + "dashboard/analytics"
                            );
                          }}
                        >
                          Tr??? v??? trang ch???
                        </Button>
                      ) : (
                        <Button
                          startIcon={<ArrowBackIcon />}
                          className="mr-12 btn btn-secondary d-inline-flex"
                          variant="contained"
                          onClick={() => {
                            this.props.history.push(
                              ConstantList.ROOT_PATH + "family"
                            );
                          }}
                        >
                          Danh s??ch h??? gia ????nh
                        </Button>
                      )}
                      <Button
                        startIcon={<SaveIcon />}
                        className="mr-0 btn btn-primary-d d-inline-flex"
                        variant="contained"
                        color="primary"
                        disabled={loading ? true : false}
                        type="submit"
                      >
                        L??u
                      </Button>
                    </div>
                  </DialogActions>
                </div>
                {openSaveDialog && (
                  <ConfirmationDialog
                    open={openSaveDialog}
                    // onConfirmDialogClose={this.handleClose}
                    onYesClick={this.handleClose}
                    title={t("???? l??u th??nh c??ng")}
                    text={t("C???m ??n b???n ???? tham gia khai b??o y t???!")}
                    agree={t("OK")}
                    // cancel={t("confirm_dialog.delete.cancel")}
                  />
                )}
              </Grid>
            </Grid>
            {this.state.familyMemberId && (
              <>
                <div className="head-line">
                  L???ch s??? khai b??o y t??? c???a th??nh vi??n
                </div>
                <Grid container spacing={2} style={{ padding: "8px" }}>
                  <Grid item xs={12}>
                    <div style={{ maxWidth: "1920px", overflow: "auto" }}>
                      <MaterialTable
                        data={this.state.itemList ? this.state.itemList : []}
                        columns={[
                          {
                            title: "STT",
                            field: "custom",
                            align: "left",
                            width: "150",
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
                            render: (rowData) =>
                              (this.state.page - 1) * this.state.rowsPerPage +
                              rowData.tableData.id +
                              1,
                          },
                          {
                            title: "Ng??y/gi???",
                            field: "declarationTime",
                            align: "left",
                            width: "150",
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
                              return moment(rowData.declarationTime).format(
                                "HH:mm DD/MM/YYYY"
                              );
                            },
                          },
                          {
                            title: "Nhi???t ????? (??C)",
                            field: "temperature",
                            align: "left",
                            width: "150",
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
                              let temperature =
                                appConfig.TEMPERATURE_CONST.find(
                                  (element) =>
                                    element.value === rowData.temperature
                                );
                              if (temperature) {
                                return temperature.key;
                              }
                            },
                          },
                          {
                            title: "Nh???p th???(l???n/ph??t)",
                            field: "breathingRate",
                            align: "left",
                            width: "150",
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
                              let breathingRate =
                                appConfig.BREATHINGRATE_CONST.find(
                                  (element) =>
                                    element.value === rowData.breathingRate
                                );
                              if (breathingRate) {
                                return breathingRate.key;
                              }
                            },
                          },
                          {
                            title: "M???ch (l???n/ph??t)",
                            field: "pulseRate",
                            align: "left",
                            width: "150",
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
                              if (rowData.pulseRate) {
                                return rowData.pulseRate;
                              }
                            },
                          },
                          {
                            title: "Ch??? s??? SpO2",
                            field: "spo2",
                            align: "left",
                            width: "150",
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
                              let spo2 = appConfig.SPO2_CONST.find(
                                (element) => element.value === rowData.spo2
                              );
                              if (spo2) {
                                return spo2.key;
                              }
                            },
                          },
                          {
                            title: "Tri???u ch???ng",
                            field: "custom",
                            align: "left",
                            width: "150",
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
                              if (
                                (rowData.nomalSystoms &&
                                  rowData.nomalSystoms.length > 0) ||
                                (rowData.severeSymptoms &&
                                  rowData.severeSymptoms.length > 0) ||
                                rowData.symptomText
                              ) {
                                return (
                                  <ul
                                    style={{
                                      margin: 0,
                                      paddingInlineStart: "10px",
                                    }}
                                  >
                                    {rowData.symptomText && (
                                      <li>
                                        {rowData.symptomText
                                          ? rowData.symptomText
                                          : ""}
                                      </li>
                                    )}
                                    {rowData.nomalSystoms &&
                                      rowData.nomalSystoms.map((item) => (
                                        <li>
                                          {item.symptom
                                            ? item.symptom.name
                                            : ""}
                                        </li>
                                      ))}
                                    {rowData.severeSymptoms &&
                                      rowData.severeSymptoms.map((item) => (
                                        <li>
                                          {item.symptom
                                            ? item.symptom.name
                                            : ""}
                                        </li>
                                      ))}
                                  </ul>
                                );
                              }
                            },
                          },
                          {
                            title: t("Chi ti???t"),
                            field: "custom",
                            width: "150",
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
                            render: (rowData) => (
                              <IconButton
                                size="small"
                                onClick={() => {
                                  getById(rowData.id).then(({ data }) => {
                                    this.setState({
                                      item: data,
                                      openViewDialog: true,
                                    });
                                  });
                                }}
                              >
                                <Icon fontSize="small" color="primary">
                                  visibility
                                </Icon>
                              </IconButton>
                            ),
                          },
                        ]}
                        options={{
                          selection: false,
                          actionsColumnIndex: -1,
                          paging: false,
                          search: false,
                          rowStyle: (rowData, index) => ({
                            backgroundColor: index % 2 === 1 ? "#EEE" : "#FFF",
                          }),
                          maxBodyHeight: "300px",
                          headerStyle: {
                            backgroundColor: "#3366ff",
                            color: "#fff",
                            whiteSpace: "nowrap",
                          },
                          padding: "dense",
                          toolbar: false,
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
                    {this.state.itemList && this.state.itemList.length > 0 && (
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
                    )}
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
              </>
            )}
          </DialogContent>
        </ValidatorForm>
      </>
    );
  }
}
export default Create;
