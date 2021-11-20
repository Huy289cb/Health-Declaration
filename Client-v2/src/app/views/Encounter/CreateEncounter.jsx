import React from "react";
import { toast } from "react-toastify";
import ConstantList from "../../appConfig";
import "react-toastify/dist/ReactToastify.css";
import "styles/globitsStyles.css";
import { getAllInfoByUserLogin } from "../User/UserService";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import moment from "moment";
import
{
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
  InputAdornment,
} from "@material-ui/core";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import FamilyInputPopup from "../Component/SelectFamilyPopup/InputPopup"
import SelectFamilyPopup from "../Component/SelectFamilyPopup/SelectFamilyPopup"
import Autocomplete from "@material-ui/lab/Autocomplete";
import SaveIcon from '@material-ui/icons/Save';
import HomeIcon from '@material-ui/icons/Home';
import { getById as getFamilyById } from "../Family/Service";
import { searchByPage as getSymptoms } from "../Symptom/SymptomService";
import { addNew, update, searchByPage, getById } from "./EncounterService";
import MaterialTable from 'material-table';
import NicePagination from '../Component/Pagination/NicePagination';
import
{
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { ConfirmationDialog } from "egret";
import SelectHealthOrganization from "../HealthOrganization/SelectHealthOrganizationPopup";
import { searchByPage as getBackgroundDisease } from "../BackgroundDisease/BackgroundDiseaseService";
import ViewDialog from "../dashboard/ViewDialog";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

toast.configure( {
  autoClose: 2000,
  draggable: false,
  limit: 3,
} );

class CreateEncounter extends React.Component
{
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
    rowsPerPage: 2,
    page: 1,
    text: '',
    // totalPages: 10,
    isViewType: false,
    isVisible: false,
    haveQuickTest: null,
    quickTestResults: null,
    havePCR: null,
    pcrResults: null,
    openViewDialog: false,
    makeDecision: null,
    medicalTeam: null,
    practitioner: null,
    openSaveDialog: false,
    shouldOpenSelectHealthOrganization: false,
    haveSymptom: null,
    loading: false
  };

  handleChange = ( event, source ) =>
  {
    event.persist();
    if ( source === "switch" )
    {
      this.setState( { isActive: event.target.checked } );
      return;
    }
    this.setState( {
      [event.target.name]: event.target.value,
    } );
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
    if ( source == "haveSymptom" )
    {
      this.setState( { radioHelperTextHaveSymptom: "", radioErrorHaveSymptom: false } );
      if ( event.target.defaultValue == "false" )
      {
        this.setState( {
          haveSymptom: false,
          nomalSystoms: [],
          severeSymptoms: [],
          symptomText: ""
        } );
      } else
      {
        this.setState( {
          haveSymptom: true
        } );
      }
      return;
    }
  };
  resetHaveQuickTest = () =>
  {
    this.setState( { haveQuickTest: false, quickTestResults: null, quickTestDate: null, quickTestResultsError: false, quickTestResultsHelperText: "" } )
  }
  resetHavePCR = () =>
  {
    this.setState( { havePCR: false, pcrResults: null, pcrTestDate: null, pcrResultsError: false, pcrResultsHelperText: "" } )
  }
  openCircularProgress = () =>
  {
    this.setState( { loading: true, } );
  };

  handleFormSubmit = async () =>
  {
    await this.openCircularProgress();
    let { t } = this.props;
    let { id, familyMember } = this.state;
    if ( familyMember && familyMember.member && familyMember.member.backgroundDiseases
      && familyMember.member.backgroundDiseases.length > 0 )
    {
      familyMember.member.listBackgroundDisease = [];
      familyMember.member.backgroundDiseases.forEach( element =>
      {
        familyMember.member.listBackgroundDisease.push( { backgroundDisease: element } );
      } );
    }
    this.setState( { familyMember }, () =>
    {
      let obj = {};
      obj.id = id;
      obj.type = this.state.type;
      obj.practitioner = this.state.practitioner;
      obj.medicalTeam = this.state.medicalTeam;
      obj.family = this.state.family;
      obj.familyMember = this.state.familyMember;
      obj.spo2 = this.state.spo2;
      obj.breathingRate = this.state.breathingRate;
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
      obj.systolicBloodPressure = this.state.systolicBloodPressure;
      obj.diastolicBloodPressure = this.state.diastolicBloodPressure;
      obj.pcrTestDate = this.state.pcrTestDate;
      obj.quickTestDate = this.state.quickTestDate;
      obj.healthOrganization = this.state.healthOrganization;
      obj.haveSymptom = this.state.haveSymptom;
      obj.symptomText = this.state.symptomText;
      obj.pulseRate = this.state.pulseRate;
      if ( this.state.familyMember && this.state.familyMember.member && this.state.familyMember.member.weight )
      {
        obj.weight = this.state.familyMember.member.weight;
      }

      if ( this.state.nomalSystoms )
      {
        let c = [];
        this.state.nomalSystoms.forEach( ( e ) =>
        {
          let p = {};
          p.symptom = e;
          c.push( e );
        } )
        obj.nomalSystoms = c;
      }
      if ( this.state.severeSymptoms )
      {
        let c = [];
        this.state.severeSymptoms.forEach( ( e ) =>
        {
          let p = {};
          p.symptom = e;
          c.push( e );
        } )
        obj.severeSymptoms = c;
      }

      if ( this.validateData( obj ) )
      {
        if ( id )
        {
          update( obj, id ).then( () =>
          {
            toast.success( t( 'Cập nhật phiếu thăm khám thành công' ) );
            // this.resetState();
            this.setState( {
              loading: false,
              openSaveDialog: true,
            }, this.updatePageData() );
          } );
        } else
        {
          addNew( obj ).then( ( response ) =>
          {
            if ( response.data != null && response.status == 200 )
            {
              // this.state.id = response.data.id
              this.resetState();
              this.setState( {
                loading: false,
                openSaveDialog: true,
              }, this.updatePageData() );
              toast.success( t( 'Cập nhật phiếu thăm khám thành công' ) );
            }
          } );
        }
      }
      else
      {
        this.setState( { loading: false } );
      }
    } )
  };

  resetState = () =>
  {
    this.setState( {
      nomalSystoms: [],
      severeSymptoms: [],
      listNormalSymptom: [],
      listSevereSymptom: [],
      breathingRate: "",
      spo2: "",
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
      systolicBloodPressure: null,
      diastolicBloodPressure: null,
      quickTestDate: null,
      pcrTestDate: null,
      haveSymptom: null,
      healthOrganization: null,
      symptomText: "",
      pulseRate: null,
    } )
  }

  componentDidMount ()
  {
    let obj = {
      pageSize: 1000,
      pageIndex: 0
    }
    getBackgroundDisease( { pageIndex: 0, pageSize: 1000 } ).then( ( { data } ) =>
    {
      this.setState( { listDataBackgroundDisease: [...data.content] } );
    } )
    getSymptoms( obj ).then( ( { data } ) =>
    {
      if ( data && data.content )
      {
        let listNormalSymptom = [];
        let listSevereSymptom = [];
        data.content.forEach( ( item ) =>
        {
          if ( item?.type == 1 )
          {
            listNormalSymptom.push( item );
          }
          if ( item?.type == 2 )
          {
            listSevereSymptom.push( item );
          }
        } )
        this.setState( { listNormalSymptom, listSevereSymptom } );
      }
    } )
    ValidatorForm.addValidationRule( 'diastolicBloodPressureMatch', ( value ) =>
    {
      if ( Number( value ) > Number( this.state.systolicBloodPressure ) )
      {
        return false;
      }
      return true;
    } );
  }
  componentWillUnmount ()
  {
    ValidatorForm.removeValidationRule( 'diastolicBloodPressureMatch' );
  }
  componentWillMount ()
  {
    let { location } = this.props;
    //get practitioner nếu user đăng nhập là nhân viên y tế
    getAllInfoByUserLogin().then( ( resp ) =>
    {
      let data = resp ? resp.data : null;
      if ( data )
      {
        if ( data.healthCareStaff )
        {
          if ( data && data.practitioner && data.practitioner.id )
          {
            let isViewType = false;
            let isVisible = false;
            if ( data.practitioner.type == 1 )
            { //Làm từ xa
              var type = ConstantList.GET_PERSONAL_HEALTH_RECORD_TYPE.remoteWork;
              isViewType = true;
            } else
            {
              var type = ConstantList.GET_PERSONAL_HEALTH_RECORD_TYPE.practitioner;
              isViewType = true;
              isVisible = true;
            }
            this.setState( { practitioner: { id: data.practitioner.id }, type: type, isViewType: isViewType, isVisible: isVisible } );
          }
        }
        else if ( data.medicalTeam )
        {
          if ( data && data.userUnit && data.userUnit.id )
          {
            var type = ConstantList.GET_PERSONAL_HEALTH_RECORD_TYPE.medical_team;
            this.setState( { medicalTeam: { id: data.userUnit.id }, type: type }, () =>
            {
              // console.log( this.state );
            } );
          }
        }
      }
    } )

    var familyMember, familyMemberId = null;
    if ( location.state && location.state.familyMember )
    {
      familyMemberId = location.state.familyMember.id;
      if ( location.state.familyMember.family && location.state.familyMember.family.id )
      {

        getFamilyById( location.state.familyMember.family.id ).then( ( { data } ) =>
        {
          if ( data && data.id )
          {
            this.setState( { family: data }, () =>
            {
              let { family } = this.state;
              if ( family.familyMembers && familyMemberId )
              {
                const familyMember = family.familyMembers.find( element => element.id == familyMemberId );
                if ( familyMember )
                {
                  this.setState( { familyMember: familyMember, familyMemberId: familyMemberId }, () =>
                  {
                    this.changeFamilyMember( familyMemberId );
                    this.updatePageData();
                  } );
                }
              }
            } );
          }
        } )
      }
    }
  }

  validateData = ( data ) =>
  {
    if ( data )
    {
      if ( !data.family || !data.family.id )
      {
        toast.warning( "Chưa chọn hộ gia đình." );
        return false;
      }
      else if ( !data.familyMember || !data.familyMember.id )
      {
        toast.warning( "Chưa chọn thành viên trong hộ gia đình." );
        return false;
      }
      else if ( data.haveQuickTest && !data.quickTestResults )
      {
        toast.warning( "Chưa chọn kết quả xét nghiệm nhanh." );
        // this.setState({quickTestResultsHelperText:"Đây là trường bắt buộc",quickTestResultsError:true})
        return false;
      }
      else if ( data.havePCR && !data.pcrResults )
      {
        // this.setState({pcrResultsHelperText:"Đây là trường bắt buộc",pcrResultsError:true})
        toast.warning( "Chưa chọn kết quả xét nghiệm PCR." );
        return false;
      }
      // else if (this.state.haveSymptom === null || this.state.haveSymptom === undefined) {
      //   this.setState({ radioHelperTextHaveSymptom: "Đây là trường bắt buộc", radioErrorHaveSymptom: true })
      //   return false;
      // }
      else if ( !data.makeDecision )
      {
        toast.warning( "Chưa chọn hướng xử lý." );
        return false;
      } 
      // else if ( data.makeDecision && data.makeDecision == "decision1" && !data.healthOrganization )
      // {
      //   toast.warning( "Chưa đơn vị y tế" );
      //   return false;
      // }
      let symptomLength = this.state.nomalSystoms.length + this.state.severeSymptoms.length;
      if ( !this.state.haveSymptom && symptomLength == 0 && !this.state.symptomText )
      {
        // this.setState({radioHelperTextHaveSymptom: "Đây là trường bắt buộc", radioErrorHaveSymptom: true});
        toast.warning( "Chọn không triệu chứng hoặc chọn/nhập ít nhất 1 triệu chứng" )
        return false;
      }
      else
      {
        return true;
      }
    }
    else
    {
      return false;
    }
  };

  //history table
  //Paging handle start
  setPage = ( page ) =>
  {
    this.setState( { page }, function ()
    {
      this.updatePageData()
    } )
  }
  setRowsPerPage = ( event ) =>
  {
    this.setState( { rowsPerPage: event.target.value, page: 1 }, function ()
    {
      this.updatePageData()
    } )
  }
  handleChangePage = ( event, newPage ) =>
  {
    this.setPage( newPage )
  }
  //Paging handle end
  updatePageData = ( item ) =>
  {
    let obj = {
      pageSize: 1000,
      pageIndex: 0
    }
    getSymptoms( obj ).then( ( { data } ) =>
    {
      if ( data && data.content )
      {
        let listNormalSymptom = [];
        let listSevereSymptom = [];
        data.content.forEach( ( item ) =>
        {
          if ( item.type )
          {
            if ( item.type == 1 )
            {
              listNormalSymptom.push( item );
            }
            if ( item.type == 2 )
            {
              listSevereSymptom.push( item );
            }
          }
        } )
        this.setState( { listNormalSymptom, listSevereSymptom } );
      }
    } )
    var searchObject = { showHistoryForm: true };
    if ( item != null )
    {
      this.setState( {
        page: 1,
        text: item.text,
        orgType: item.orgType,
      }, () =>
      {
        searchObject.text = this.state.text;
        searchObject.pageIndex = this.state.page;
        searchObject.pageSize = this.state.rowsPerPage;
        searchObject.familyMemberId = this.state.familyMemberId;
        searchByPage( searchObject ).then( ( { data } ) =>
        {
          this.setState( {
            itemList: [...data.content],
            totalElements: data.totalElements,
            totalPages: data.totalPages
          } )
          if ( data.content && data.content.length > 0 ) {
            this.updateLastData(data.content[0])
          }
        }
        );
      } )
    } else
    {
      searchObject.text = this.state.text;
      searchObject.pageIndex = this.state.page;
      searchObject.pageSize = this.state.rowsPerPage;
      searchObject.familyMemberId = this.state.familyMemberId;
      searchByPage( searchObject ).then( ( { data } ) =>
      {
        this.setState( {
          itemList: [...data.content],
          totalElements: data.totalElements,
          totalPages: data.totalPages,
        } )
        if ( data.content && data.content.length > 0 ) {
          this.updateLastData(data.content[0])
        }
      } );
    }
  };

  updateLastData = (item) => {
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

  handleClose = () =>
  {
    this.setState( {
      openViewDialog: false,
      openSaveDialog: false,
    }, () =>
    {
      this.updatePageData();
    } );
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
    if ( familyMember && familyMember.id )
    {
      this.resetState();
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

  getBMI = ( height, weight ) =>
  {
    let bmi = ( weight / ( ( height / 100 ) * ( height / 100 ) ) ).toFixed( 2 );
    let bmiText = "";
    if ( bmi < 18.5 )
    {
      bmiText = "Thiếu cân";
    } else if ( bmi >= 18.5 && bmi < 25 )
    {
      bmiText = "Cân đối";
    } else if ( bmi >= 25 && bmi < 30 )
    {
      bmiText = "Thừa cân";
    } else if ( bmi >= 30 && bmi < 35 )
    {
      bmiText = "Béo phì";
    } else if ( bmi >= 35 )
    {
      bmiText = "Béo phì nguy hiểm";
    }
    this.setState( { bmi: bmi, bmiText: bmiText } );
  }

  //handle select healthOrg
  handleSelectHealthOrganization = ( value ) =>
  {
    this.setState( { healthOrganization: value, shouldOpenSelectHealthOrganization: false } );
  }
  handleDialogClose = () =>
  {
    this.setState( { shouldOpenSelectHealthOrganization: false } )
  }

  backToHome = () =>
  {
    this.props.history.push( {
      pathname: '/dashboard/analytics'
    } );
  }

  haveSymptomChange = ( value ) =>
  {
    this.setState( { haveSymptom: value }, () =>
    {
      if ( value )
      {
        this.setState( { nomalSystoms: [], severeSymptoms: [] } );
      }
    } );
  }

  checkedNormalSymptom = ( item ) =>
  {
    let { nomalSystoms } = this.state;
    if ( nomalSystoms && nomalSystoms.length > 0 )
    {
      var value = nomalSystoms.filter( ( e ) =>
      {
        return e.symptom.id == item.id;
      } );
      var result = ( value != null && value.length > 0 ) ? true : false;
      return result;
    }
    else
    {
      return false
    }
  }

  checkedSevereSymptoms = ( item ) =>
  {
    let { severeSymptoms } = this.state;
    if ( severeSymptoms && severeSymptoms.length > 0 )
    {
      var value = severeSymptoms.filter( ( e ) =>
      {
        return e.symptom.id == item.id;
      } );
      var result = ( value != null && value.length > 0 ) ? true : false;
      return result;
    }
    else
    {
      return false
    }
  }

  selectListBackgroundDisease = ( values ) =>
  {
    let { familyMember } = this.state;
    if ( !familyMember ) { familyMember = { member: {} } };
    familyMember.member.backgroundDiseases = values;
    this.setState( { familyMember } );
  };

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
      toast.warn("Chưa chọn thành viên");
    }
  }

  render () {
    let { t } = this.props;
    let {
      id,
      family,
      familyMember,
      nomalSystoms,
      severeSymptoms,
      listNormalSymptom,
      listSevereSymptom,
      breathingRate,
      spo2,
      anamnesis,
      pulseRate,
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
      systolicBloodPressure,
      diastolicBloodPressure,
      quickTestDate,
      pcrTestDate,
      bmi,
      bmiText,
      openSaveDialog,
      openFamilyPopup,
      healthOrganization,
      haveSymptom,
      symptomText,
      loading, isViewType, type,
      listDataBackgroundDisease,
      openViewDialog, isVisible
    } = this.state;
    return (
      <>
        <ValidatorForm ref="form" onSubmit={ this.handleFormSubmit }>
          <DialogContent style={ { backgroundColor: "#fff" } }>
            <Grid container spacing={ 1 }>
              <Grid item lg={ 12 } md={ 12 } sm={ 12 } xs={ 12 }>
                <Button
                  startIcon={ <HomeIcon /> }
                  variant="contained"
                  className="mr-12 btn btn-secondary d-inline-flex"
                  color="secondary"
                  onClick={ () => this.backToHome() }
                >
                  Trang chủ
                </Button>
                <Button
                  size="small"
                  className="btn btn-primary-d"
                  variant="contained"
                  onClick={ () => this.setState( { openFamilyPopup: true } ) }
                >
                  <div className="btn-select-family">Chọn hộ gia đình</div>
                </Button>
                <SelectFamilyPopup
                  open={ openFamilyPopup }
                  handleSelect={ ( item ) =>
                  {
                    this.setState( { family: item, openFamilyPopup: false, familyMember: {}, familyMemberId: null } );
                    this.resetState();
                  } }
                  selectedItem={ family ? family : {} }
                  handleClose={ () => this.setState( { openFamilyPopup: false } ) }
                  t={t}
                />
              </Grid>
              <Grid item lg={ 12 } md={ 12 } sm={ 12 } xs={ 12 }>
                <div className="head-line mb-8">Phiếu thăm khám</div>
                <div style={{ display: 'flex'}}>
                  <div>Ghi chú:</div>
                    <div className="pl-16">
                      (<span style={{ color: "red" }}> * </span>){" "}
                      <i>Trường bắt buộc.</i>
                    </div>
                    <div className="pl-16" style={{ display: "inline-block" }}>
                      ({" "}
                      <div
                        style={{
                          display: "inline-block",
                          width: "12px",
                          height: "12px",
                          backgroundColor: "#eee",
                        }}
                      ></div>{" "}
                      ) <i>Trường chỉ xem.</i>
                    </div>
                  </div>
              </Grid>
              { isViewType && <Grid item lg={ 12 } md={ 12 } sm={ 12 } xs={ 12 }>
                <FormControl className="nice-input" fullWidth={ true } variant="outlined" size="small">
                  <InputLabel htmlFor="type-simple">
                    {
                      <span>
                        <span style={ { color: "red" } }> * </span>
                        <span>Loại thăm khám</span>
                      </span>
                    }
                  </InputLabel>
                  <Select
                    label={
                      <span>Loại thăm khám</span>
                    }
                    value={ type ? type : "" }
                    disabled={ !isVisible }
                    onChange={ ( event ) =>
                    {
                      this.setState( { type: event.target.value } )
                    } }
                    inputProps={ {
                      name: "type",
                      id: "type-simple",
                    } }
                  >
                    { ConstantList.PERSONAL_HEALTH_RECORD_TYPE && ConstantList.PERSONAL_HEALTH_RECORD_TYPE.map( ( item ) =>
                    {
                      if ( item.key == 3 || item.key == 4 )
                      {
                        return (
                          <MenuItem key={ item.key } value={ item.key }>
                            { item.value ? item.value : "" }
                          </MenuItem>
                        );
                      }
                    } ) }
                  </Select>
                </FormControl>
              </Grid> }
              <Grid item lg={ 12 } md={ 12 } sm={ 12 } xs={ 12 }>
                <Grid className="" container spacing={ 2 } style={ { paddingTop: "12px" } }>
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
                        Hộ gia đình
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
                  <Grid item lg={ 3 } md={ 3 } sm={ 12 } xs={ 12 }>
                    <FormControl className="nice-input" fullWidth={ true } variant="outlined" size="small">
                      <InputLabel htmlFor="familyMembers-simple">
                        {
                          <span className="">
                            <span style={ { color: "red" } }> * </span>
                            Chọn thành viên gia đình
                          </span>
                        }
                      </InputLabel>
                      <Select
                        label={ <span className="">
                          <span style={ { color: "red" } }> * </span>
                            Chọn thành viên gia đình
                        </span> }
                        value={ familyMemberId ? familyMemberId : "" }
                        onChange={ ( event ) => this.changeFamilyMember( event.target.value )}
                        validators={ ["required"] }
                        errorMessages={ [t( "general.required" )] }
                        disabled={!family}
                        onClick={() => {
                          if ( !this.state?.family?.familyMembers ) {
                            toast.warn("Chưa chọn hộ gia đình");
                          }
                        }}
                      >
                        { family?.familyMembers && this.renderSelectOptions() }
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item lg={ 3 } md={ 3 } sm={ 6 } xs={ 6 }>
                    <TextValidator
                      className="nice-input w-100"
                      label="Tuổi"
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
                      label="Giới tính"
                      disabled
                      type="text"
                      name="gender"
                      value={ (familyMember?.member?.gender == "F") ? "Nữ" : ( familyMember?.member?.gender == "M") ? "Nam" : ""}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  
                  <Grid item lg={ 3 } md={ 3 } sm={ 12 } xs={ 12 }>
                    <TextValidator
                        className="nice-input w-100"
                        label="Số điện thoại cá nhân"
                        disabled
                        onChange={this.handleChange}
                        type="text"
                        name="phoneNumber"
                        value={familyMember?.member?.phoneNumber ? familyMember?.member?.phoneNumber : ""}
                        variant="outlined"
                        size="small"
                      />
                  </Grid>
                  <Grid item lg={ 3 } md={ 3 } sm={ 12 } xs={ 12 }>
                    <TextValidator
                      className="nice-input w-100"
                      label="Chiều cao"
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
                      label="Cân nặng"
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
                  <Grid item lg={ 3 } md={ 6 } sm={ 12 } xs={ 12 }>
                    <TextValidator
                      className="nice-input w-100"
                      label="Chỉ số BMI"
                      disabled
                      type="number"
                      name="bmi"
                      value={ bmi ? bmi : "" }
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item lg={ 3 } md={ 6 } sm={ 12 } xs={ 12 }>
                    <TextValidator
                      className="nice-input w-100"
                      label="Đánh giá chỉ số BMI"
                      disabled
                      type="text"
                      name="bmiText"
                      value={ bmiText ? bmiText : "" }
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item lg={ 3 } md={ 6 } sm={ 12 } xs={ 12 }>
                    <FormControl error={ this.state.radioError }
                      disabled={ familyMember ? false : true }
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}>
                      <span><span style={ { color: "red" } }> * </span>Có bệnh nền:</span>
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
                          label="Có" />
                        <FormControlLabel value={ false }
                          control={ <Radio checked={ familyMember && familyMember.member ? ( familyMember.member.haveBackgroundDisease === false ? true : false ) : false } /> }
                          label="Không" />
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
                          label={<span className="font">Bệnh nền</span>}
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      ) }
                    />
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12} >
                    <div className="head-line">Xét nghiệm COVID</div>
                    <div style={{ padding: "12px" }}>
                      <Grid container spacing={2}>
                        <Grid item lg={4} md={4} sm={12} xs={12}>
                          <FormControl error={ this.state.radioErrorHaveQuickTest }
                              style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}>
                            <span><span style={ { color: "red" } }> * </span>Xét nghiệm nhanh:</span>
                            <RadioGroup row
                              aria-label="position" name="position" defaultValue="top"
                              onChange={ ( value ) => { this.handleChange( value, "haveQuickTest" ) } }
                            >
                              <FormControlLabel
                                value={ true }
                                control={ <Radio checked={ haveQuickTest === true ? true : false } /> }
                                label="Có"
                                labelPlacement="end"
                              />
                              <FormControlLabel
                                value={ false }
                                control={ <Radio checked={ haveQuickTest === false ? true : false } /> }
                                label="Không"
                                labelPlacement="end"
                              />
                            </RadioGroup>
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
                                  Ngày xét nghiệm
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
                                  Kết quả xét nghiệm nhanh
                                </span>
                              }
                            </InputLabel>
                            <Select
                              label={
                                <span>
                                  <span style={{ color: "red" }}> * </span>
                                  Kết quả xét nghiệm nhanh
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
                          <FormControl error={ this.state.radioErrorHavePCR }
                              style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}>
                            <span><span style={ { color: "red" } }> * </span>Xét nghiệm PCR:</span>
                            <RadioGroup row
                              aria-label="position" name="position" defaultValue="top"
                              onChange={ ( value ) => { this.handleChange( value, "havePCR" ) } }
                            >
                              <FormControlLabel
                                value={ true }
                                control={ <Radio checked={ havePCR === true ? true : false } /> }
                                label="Có"
                                labelPlacement="end"
                              />
                              <FormControlLabel
                                value={ false }
                                control={ <Radio checked={ havePCR === false ? true : false } /> }
                                label="Không"
                                labelPlacement="end"
                              />
                            </RadioGroup>
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
                                  Ngày xét nghiệm
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
                                  Kết quả xét nghiệm PCR
                                </span>
                              }
                            </InputLabel>
                            <Select
                              label={
                                <span>
                                  <span style={{ color: "red" }}> * </span>
                                  Kết quả xét nghiệm PCR
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
                  <Grid item lg={ 12 } md={ 12 } sm={ 12 } xs={ 12 }>
                    <div className="head-line mb-8">Các chỉ số</div>
                    <Grid container spacing={ 2 }>
                      <Grid item lg={ 4 } md={ 4 } sm={ 12 } xs={ 12 }>
                        <FormControl className="nice-input" fullWidth={ true } variant="outlined" size="small">
                          <InputLabel htmlFor="temperature-simple">
                            {
                              <span><span style={{ color: "red" }}> * </span>Nhiệt độ (°C)</span>
                            }
                          </InputLabel>
                          <Select
                            label={
                              <span><span style={{ color: "red" }}> * </span>Nhiệt độ (°C)</span>
                            }
                            value={ temperature ? temperature : "" }
                            onChange={ ( event ) =>
                            {
                              this.setState( { temperature: event.target.value } )
                            } }
                            inputProps={ {
                              name: "temperature",
                              id: "temperature-simple",
                            }}
                            validators={ ["required"] }
                            errorMessages={ [t( "general.required" )] }
                          >
                            { ConstantList.TEMPERATURE_CONST && ConstantList.TEMPERATURE_CONST.map( ( item ) =>
                            {
                              return (
                                <MenuItem key={ item.key } value={ item.value }>
                                  { item.key ? item.key : "" }
                                </MenuItem>
                              );
                            } ) }
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item lg={ 4 } md={ 4 } sm={ 12 } xs={ 12 }>
                        <FormControl className="nice-input" fullWidth={ true } variant="outlined" size="small">
                          <InputLabel htmlFor="breathingRate-simple">
                            {
                              <span><span style={{ color: "red" }}> * </span>Nhịp thở (lần/phút)</span>
                            }
                          </InputLabel>
                          <Select
                            label={
                              <span>Nhịp thở (lần/phút)</span>
                            }
                            value={ breathingRate ? breathingRate : "" }
                            onChange={ ( event ) =>
                            {
                              this.setState( { breathingRate: event.target.value } )
                            } }
                            inputProps={ {
                              name: "breathingRate",
                              id: "breathingRate-simple",
                            } }
                          >
                            { ConstantList.BREATHINGRATE_CONST && ConstantList.BREATHINGRATE_CONST.map( ( item ) =>
                            {
                              return (
                                <MenuItem key={ item.key } value={ item.value }>
                                  { item.key ? item.key : "" }
                                </MenuItem>
                              );
                            } ) }
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item lg={4} md={4} sm={12} xs={12}>
                        <TextValidator
                          className="nice-input w-100"
                          label={
                            <span className="font">
                              <span style={{ color: "red" }}> * </span>
                              Mạch
                            </span>
                          }
                          onChange={this.handleChange}
                          type="number"
                          name="pulseRate"
                          value={ pulseRate ? pulseRate : "" }
                          validators={["required", "minNumber:0" ]}
                          errorMessages={["Trường này là bắt buộc", "Phải là số dương"]}
                          variant="outlined"
                          size="small"
                          InputProps={{
                            endAdornment: <InputAdornment position="end">(lần/phút)</InputAdornment>
                          }}
                        />
                      </Grid>
                      <Grid item lg={ 4 } md={ 4 } sm={ 12 } xs={ 12 }>
                        <FormControl className="nice-input" fullWidth={ true } variant="outlined" size="small">
                          <InputLabel htmlFor="spo2-simple">
                            {
                              <span>Chỉ số SpO2</span>
                            }
                          </InputLabel>
                          <Select
                            label={
                              <span>Chỉ số SpO2</span>
                            }
                            value={ spo2 ? spo2 : "" }
                            onChange={ ( event ) =>
                            {
                              this.setState( { spo2: event.target.value } )
                            } }
                            inputProps={ {
                              name: "spo2",
                              id: "spo2-simple",
                            } }
                          // validators={["required"]}
                          // errorMessages={[t("general.required")]}
                          >
                            { ConstantList.SPO2_CONST && ConstantList.SPO2_CONST.map( ( item ) =>
                            {
                              return (
                                <MenuItem key={ item.key } value={ item.value }>
                                  { item.key ? item.key : "" }
                                </MenuItem>
                              );
                            } ) }
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item lg={ 4 } md={ 4 } sm={ 12 } xs={ 12 }>
                        <TextValidator
                          className="nice-input w-100"
                          label={
                            <span className="font">
                              Huyết áp tối đa
                            </span>
                          }
                          onChange={ this.handleChange }
                          type="number"
                          name="systolicBloodPressure"
                          value={ systolicBloodPressure ? systolicBloodPressure : "" }
                          validators={ ['minNumber:0'] }
                          errorMessages={ ["Phải là số dương"] }
                          variant="outlined"
                          size="small"
                          InputProps={{
                            endAdornment: <InputAdornment position="end">(mmHg)</InputAdornment>
                          }}
                        />
                      </Grid>
                      <Grid item lg={ 4 } md={4} sm={ 12 } xs={ 12 }>
                        <TextValidator
                          className="nice-input w-100"
                          label={
                            <span className="font">
                              Huyết áp tối thiểu
                            </span>
                          }
                          onChange={ this.handleChange }
                          type="number"
                          name="diastolicBloodPressure"
                          value={ diastolicBloodPressure ? diastolicBloodPressure : "" }
                          validators={ ["diastolicBloodPressureMatch", 'minNumber:0'] }
                          errorMessages={ ["Huyết áp tối thiểu phải nhỏ hơn huyết áp tối đa", "Phải là số dương"] }
                          variant="outlined"
                          size="small"
                          InputProps={{
                            endAdornment: <InputAdornment position="end">(mmHg)</InputAdornment>
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item lg={ 12 } md={ 12 } sm={ 12 } xs={ 12 }>
                    <div className="head-line"><span style={ { color: "red" } }> * </span>Triệu chứng</div>
                    <Grid container>
                      <Grid item lg={ 3 } md={ 3 } sm={ 12 } xs={ 12 }>
                        <FormControl component="fieldset" error={ this.state.radioErrorHaveSymptom }>
                          <FormControlLabel
                            value={ true }
                            control={ <Checkbox checked={ haveSymptom ? haveSymptom : false } /> }
                            onChange={ ( e ) =>
                            {
                              this.setState( { haveSymptom: e.target.checked, radioErrorHaveSymptom: false, radioHelperTextHaveSymptom: "" } )
                            } }
                            label="Không có triệu chứng"
                            labelPlacement="end"
                            disabled={
                              ( (nomalSystoms && nomalSystoms.length > 0) ? true : false ) ||
                              ( (severeSymptoms && severeSymptoms.length > 0) ? true : false ) ||
                              ( symptomText ? true : false )
                            }
                          />
                          <FormHelperText>{ this.state.radioHelperTextHaveSymptom }</FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item lg={ 9 } md={ 9 } sm={ 12 } xs={ 12 }></Grid>
                        { listNormalSymptom && listNormalSymptom.map( ( item ) =>
                        {
                          return (
                            <Grid item lg={ 4 } md={ 4 } sm={ 12 } xs={ 12 }>
                              <FormControlLabel
                                onChange={ ( event, value ) =>
                                {
                                  if ( value )
                                  {
                                    //thêm
                                    if ( !nomalSystoms )
                                    {
                                      nomalSystoms = [];
                                    }
                                    nomalSystoms = [...nomalSystoms, { symptom: item }]
                                  } else
                                  {
                                    //xoá
                                    nomalSystoms = nomalSystoms.filter( ( e ) =>
                                    {
                                      return e.symptom.id != item.id;
                                    } )
                                  }
                                  this.setState( { nomalSystoms } );
                                } }
                                disabled={ haveSymptom ? haveSymptom : false }
                                control={ <Checkbox value={ item } /> }
                                label={ item ? ( item.symptom ? item.symptom.name : item.name ) : '' }
                              />
                            </Grid>
                          )
                        })}
                        { listSevereSymptom && listSevereSymptom.map( ( item ) => {
                          return (
                            <Grid item lg={ 4 } md={ 4 } sm={ 12 } xs={ 12 }>
                              <FormControlLabel
                                onChange={ ( event, value ) => {
                                  if ( value ) {
                                    //thêm
                                    if ( !severeSymptoms ) {
                                      severeSymptoms = [];
                                    }
                                    severeSymptoms = [...severeSymptoms, { symptom: item }]
                                  } else {
                                    //xoá
                                    severeSymptoms = severeSymptoms.filter( ( e ) => {
                                      return e.symptom.id != item.id;
                                    })
                                  }
                                  this.setState( { severeSymptoms } );
                                } }
                                disabled={ haveSymptom ? haveSymptom : false }
                                control={ <Checkbox value={ item } /> }
                                label={ item ? ( item.symptom ? item.symptom.name : item.name ) : '' }
                              />
                            </Grid>
                          )
                        })}
                        <Grid item sm={ 12 } xs={ 12 } className="mt-8">
                          <TextValidator
                            disabled={ haveSymptom ? haveSymptom : false }
                            className="nice-input w-100"
                            label={
                              <span className="font">
                                Triệu chứng khác
                              </span>
                            }
                            onChange={ this.handleChange }
                            type="text"
                            name="symptomText"
                            value={ symptomText ? symptomText : "" }
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                    </Grid>
                  </Grid>
                  <Grid item lg={ 12 } md={ 12 } sm={ 12 } xs={ 12 }>
                    <Grid container spacing={ 2 }>
                      <Grid item lg={ 12 } md={ 12 } sm={ 12 } xs={ 12 }>
                        <TextField
                          className="nice-input w-100"
                          label={
                            <span className="font">
                              Ghi chú
                            </span>
                          }
                          multiline={ true }
                          rows={ 3 }
                          onChange={ this.handleChange }
                          type="text"
                          name="otherInformation"
                          value={ otherInformation ? otherInformation : "" }
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                      <Grid item lg={ 12 } md={ 12 } sm={ 12 } xs={ 12 }>
                        <Grid container spacing={ 1 }>
                          <Grid item lg={ 6 } md={ 6 } sm={ 12 } xs={ 12 }>
                            <FormControl className="nice-input" fullWidth={ true } variant="outlined" size="small">
                              <InputLabel htmlFor="makeDecision-simple">
                                {
                                  <span>
                                    <span style={ { color: "red" } }> * </span>
                                    <span>Hướng xử lý</span>
                                  </span>
                                }
                              </InputLabel>
                              <Select
                                label={
                                  <span>Hướng xử lý</span>
                                }
                                value={ makeDecision ? makeDecision : "" }
                                onChange={ ( event ) =>
                                {
                                  this.setState( { makeDecision: event.target.value } )
                                } }
                                inputProps={ {
                                  name: "makeDecision",
                                  id: "makeDecision-simple",
                                } }
                              >
                                { ConstantList.ENCOUNTER_MAKE_DECISION && ConstantList.ENCOUNTER_MAKE_DECISION.map( ( item ) =>
                                {
                                  return (
                                    <MenuItem key={ item.key } value={ item.key }>
                                      { item.description ? item.description : "" }
                                    </MenuItem>
                                  );
                                } ) }
                              </Select>
                            </FormControl>
                          </Grid>
                          {/* { ( makeDecision && makeDecision == "decision1" ) &&
                            <Grid item lg={ 6 } md={ 6 } sm={ 12 } xs={ 12 }>
                              <Grid container spacing={ 1 }>
                                <Grid item lg={ 9 } md={ 9 } sm={ 12 } xs={ 12 }>
                                  <TextValidator
                                    className="nice-input w-100"
                                    label={
                                      <span className="font">
                                        Đơn vị y tế
                                      </span>
                                    }
                                    // onChange={this.handleChange}
                                    disabled
                                    type="text"
                                    name="healthOrganization"
                                    value={ healthOrganization ? healthOrganization.name ? healthOrganization.name : "" : "" }
                                    variant="outlined"
                                    size="small"
                                  />
                                </Grid>
                                <Grid item lg={ 3 } md={ 3 } sm={ 12 } xs={ 12 }>
                                  <Button
                                    size="small"
                                    className="btn btn-primary-d"
                                    style={ { float: "right" } }
                                    variant="contained"
                                    onClick={ () =>
                                    {
                                      this.setState( { shouldOpenSelectHealthOrganization: true } );
                                    } }
                                  >
                                    Chọn đơn vị y tế
                                  </Button>
                                </Grid>
                                { this.state.shouldOpenSelectHealthOrganization && (
                                  <SelectHealthOrganization
                                    open={ this.state.shouldOpenSelectHealthOrganization }
                                    handleSelect={ this.handleSelectHealthOrganization }
                                    selectedItem={ healthOrganization ? healthOrganization : {} }
                                    handleClose={ this.handleDialogClose }
                                    t={t}
                                  />
                                ) }
                              </Grid>
                            </Grid> } */}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <div className="dialog-footer">
                  <DialogActions className="p-0">
                    <div className="flex flex-space-between flex-middle">
                      <Button
                        startIcon={<ArrowBackIcon />}
                        className="mr-12 btn btn-secondary d-inline-flex"
                        variant="contained"
                        onClick={ () => { this.props.history.push( ConstantList.ROOT_PATH + "personal-health-record" ) } }>
                        Danh sách kết quả cập nhật
                      </Button>
                      <Button
                        disabled={ loading ? loading : false }
                        startIcon={ <SaveIcon /> }
                        className="mr-0 btn btn-primary-d d-inline-flex"
                        variant="contained"
                        color="primary"
                        type="submit">
                        Lưu
                      </Button>
                    </div>
                  </DialogActions>
                  { openSaveDialog && (
                    <ConfirmationDialog
                      open={ openSaveDialog }
                      onYesClick={ this.handleClose }
                      title="Đã lưu thành công"
                      text='Đã lưu lại dữ liệu thăm khám!'
                      agree="OK"
                    />
                  ) }
                </div>



              </Grid>
            </Grid>
            { this.state.familyMemberId &&
              <>
              <div className="head-line mb-8">Lịch sử khai báo y tế/thăm khám của thành viên</div>
                <Grid className="" container spacing={ 2 }>
                  <Grid item xs={ 12 }>
                    <MaterialTable
                      data={ this.state.itemList ? this.state.itemList : [] }
                      columns=
                      {
                        [
                          {
                            title: 'STT', field: "custom", align: "left", width: "150",
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
                            render: ( rowData ) =>
                            {
                              return rowData.tableData.id + 1;
                            }
                          },
                          {
                            title: 'Ngày/giờ', field: "declarationTime", align: "left", width: "150",
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
                            render: ( rowData ) =>
                            {
                              return moment( rowData.declarationTime ).format( "HH:mm DD/MM/YYYY" );
                            }
                          },
                          {
                            title: 'Nhiệt độ (°C)', field: "temperature", align: "left", width: "150",
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
                            render: rowData =>
                            {
                              let temperature = ConstantList.TEMPERATURE_CONST ? ConstantList.TEMPERATURE_CONST.find( ( element ) => element.value === rowData.temperature ) : null;
                              if ( temperature )
                              {
                                return temperature.key
                              }
                            }
                          },
                          {
                            title: 'Nhịp thở(lần/phút)', field: "breathingRate", align: "left", width: "150",
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
                            render: rowData =>
                            {
                              let breathingRate = ConstantList.BREATHINGRATE_CONST ? ConstantList.BREATHINGRATE_CONST.find( ( element ) => element.value === rowData.breathingRate ) : null;
                              if ( breathingRate )
                              {
                                return breathingRate.key;
                              }
                            }
                          },
                          {
                            title: 'Chỉ số SpO2', field: "spo2", align: "left", width: "150",
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
                            render: rowData =>
                            {
                              let spo2 = ConstantList.SPO2_CONST ? ConstantList.SPO2_CONST.find( ( element ) => element.value === rowData.spo2 ) : null;
                              if ( spo2 )
                              {
                                return spo2.key;
                              }
                            }
                          },
                          {
                            title: 'Triệu chứng', field: "custom", align: "left", width: "150",
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
                            render: ( rowData ) =>
                            {
                              // let str = "";
                              // rowData.nomalSystoms && 
                              // rowData.nomalSystoms.forEach((e) => {
                              //     str += e.symptom.name + ", "
                              // });
                              // str = str.replace(/,\s*$/, "");
                              // return str;
                              if ( ( rowData.nomalSystoms && rowData.nomalSystoms.length > 0 )
                                || ( rowData.severeSymptoms && rowData.severeSymptoms.length > 0 )
                                || rowData.symptomText )
                              {
                                return (
                                  <ul style={ { margin: 0, paddingInlineStart: "10px" } }>
                                    { rowData.symptomText &&
                                      <li>{ rowData.symptomText ? rowData.symptomText : "" }</li> }
                                    { rowData.nomalSystoms && rowData.nomalSystoms.map( ( item ) => (
                                      <li>{ item.symptom ? item.symptom.name : "" }</li>
                                    ) ) }
                                    { rowData.severeSymptoms && rowData.severeSymptoms.map( ( item ) => (
                                      <li>{ item.symptom ? item.symptom.name : "" }</li>
                                    ) ) }
                                  </ul>
                                )
                              }
                            }
                          },
                          {
                            title: 'Chi tiết', field: "custom", width: "150",
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
                              <IconButton size="small" onClick={ () =>
                              {
                                getById( rowData.id ).then( ( { data } ) =>
                                {
                                  this.setState( {
                                    item: data,
                                    openViewDialog: true
                                  } );
                                } )
                              } }>
                                <Icon fontSize="small" color="primary">visibility</Icon>
                              </IconButton>
                          },
                        ]
                      }
                      options={ {
                        selection: false,
                        actionsColumnIndex: -1,
                        paging: false,
                        search: false,
                        rowStyle: ( rowData, index ) => ( {
                          backgroundColor: ( index % 2 === 1 ) ? '#EEE' : '#FFF',
                        } ),
                        maxBodyHeight: '450px',
                        minBodyHeight: '200px',
                        headerStyle: {
                          backgroundColor: '#3366ff',
                          color: '#fff',
                          whiteSpace: 'nowrap'
                        },
                        padding: 'dense',
                        toolbar: false
                      } }
                      onSelectionChange={ ( rows ) =>
                      {
                        this.data = rows;
                      } }
                      localization={ {
                        body: {
                          emptyDataSourceMessage: `${ t(
                            "general.emptyDataMessageTable"
                          ) }`,
                        },
                      } }
                    />
                    { this.state.itemList && this.state.itemList.length > 0 &&
                      <NicePagination
                        totalPages={ this.state.totalPages }
                        handleChangePage={ this.handleChangePage }
                        setRowsPerPage={ this.setRowsPerPage }
                        pageSize={ this.state.rowsPerPage }
                        pageSizeOption={ [1, 2, 3, 5, 10, 25, 50] }
                        t={t}
                        totalElements={ this.state.totalElements }
                        page={ this.state.page }
                        isSimple={ true }
                      />
                    }
                    { openViewDialog && (
                      <ViewDialog
                        handleClose={ this.handleClose }
                        open={ openViewDialog }
                        updatePageData={ this.updatePageData }
                        item={ this.state.item }
                        t={t}
                      />
                    ) }
                  </Grid>
                </Grid>
              </>
            }
          </DialogContent>
        </ValidatorForm>

      </>
    );
  }
}
export default CreateEncounter;
