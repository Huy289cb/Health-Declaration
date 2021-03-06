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
  IconButton
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { getAllBasicInEdit, addNew, update, checkDuplicate } from "./PractitionerAndFamilyService";
import Draggable from 'react-draggable';
import Paper from '@material-ui/core/Paper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SaveIcon from '@material-ui/icons/Save';
import BlockIcon from '@material-ui/icons/Block';
import Autocomplete from "@material-ui/lab/Autocomplete";
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import {
  getByPageByParentId as getAdministrativeUnitByPage,
  getUserById as getAdministrativeUnitById,
  searchByPage as getAdministrativeUnit
} from "../AdministrativeUnit/AdministrativeUnitService";
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

class PractitionerAndFamilyEditorDialog extends Component {
  state = {
    id: null,
    name: "",
    code: "",
    level: 0,
    provinceOfResidenceSearch: {
      pageIndex: 0,
      pageSize: 10000000,
      isGetAllCity: true,
    },
    provinceOfResidence: null,
    districtOfResidence: null,
    districtOfResidenceSearch: {},
    wardOfResidenceSearch: {},
    wardOfResidence: null,
    administrativeUnit: null,
    hamletOfResidenceSearch: {},
  };
  handleChange = (event, source) => {
    event.persist();
    if (source === "switch") {
      this.setState({ isActive: event.target.checked });
      return;
    }
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  // handleChange = (event, source) => {
  //   event.persist();
  //   if (source === "switch") {
  //     this.setState({ isActive: event.target.checked });
  //     return;
  //   }
  //   this.setState({
  //     [event.target.name]: event.target.value
  //   });
  // };

  // selectAdministrativeUnit = (event, item) => {
  //   this.setState({ parent: item ? item : null, parentId: item ? item.id : null });
  // }

  handleFormSubmit = async () => {
    // await this.openCircularProgress();
    let { id } = this.state;
    let { t } = this.props;
    let obj = {}
    obj.id = id;
    obj.code = this.state.code;
    obj.name = this.state.name;
    obj.age = this.state.age;
    obj.phoneNumber = this.state.phoneNumber;
    obj.password = this.state.password;
    obj.detailAddress = this.state.detailAddress;
    if (this.state.administrativeUnit) {
      obj.administrativeUnit = {id:this.state.administrativeUnit.id};
    }

    //check code v?? phone number
    checkDuplicate(id, obj.code, obj.phoneNumber).then((result) => {
      //N???u tr??? v??? true l?? code ho???c s??t ???? ???????c s??? d???ng
      if (result.data) {
        toast.warning('M?? ho???c s??? ??i???n tho???i ???? ???????c s??? d???ng, vui l??ng th??? l???i.');
        this.setState({ loading: false });
      } else {
        if (id) {
          update(obj).then(() => {
            toast.success(t('toast.update_success'));
            this.setState({ loading: false })
            this.props.handleClose()
          });
        } else {
          addNew(obj).then((response) => {
            if (response.data != null && response.status === 200) {
              this.state.id = response.data.id
              this.setState({ ...this.state, loading: false })
              toast.success(t('toast.add_success'));
              this.props.handleClose()
            }
          });
        }
      }
    });
  };
  handleSelectdministrativeUnit = (value, source) => {
    if ("provinceOfResidence" == source) {
      this.setState({ provinceOfResidence: value });

      if (value != null) {
        this.setState({
          districtOfResidenceSearch: {
            pageIndex: 0,
            pageSize: 10000000,
            parentId: value.id,
          },
          districtOfResidence: null,
          wardOfResidence: null,
          administrativeUnit: null,
        });
      } else {
        this.setState({ districtOfResidence: null });
        this.setState({ wardOfResidence: null });
        this.setState({ administrativeUnit: null });
        this.setState({
          districtOfResidenceSearch: { pageIndex: 0, pageSize: 10000000 },
        });
        this.setState({
          wardOfResidenceSearch: { pageIndex: 0, pageSize: 10000000 },
        });
        this.setState({
          hamletOfResidenceSearch: { pageIndex: 0, pageSize: 10000000 },
        });
      }
    }
    if ("districtOfResidence" == source) {
      this.setState({ districtOfResidence: value });
      if (value != null) {
        this.setState({
          wardOfResidenceSearch: {
            pageIndex: 0,
            pageSize: 10000000,
            parentId: value.id,
          },
          wardOfResidence: null,
        });
      } else {
        this.setState({ wardOfResidence: null });
        this.setState({
          wardOfResidenceSearch: { pageIndex: 0, pageSize: 10000000 },
        });
      }
    }
    if ("wardOfResidence" == source) {
      this.setState({ wardOfResidence: value });
      if (value != null) {
        this.setState({
          hamletOfResidenceSearch: {
            pageIndex: 0,
            pageSize: 10000000,
            parentId: value.id,
          },
          administrativeUnit: null,
        });
      } else {
        this.setState({ administrativeUnit: null });
        this.setState({
          hamletOfResidenceSearch: { pageIndex: 0, pageSize: 10000000 }
        });
      }
    }
    if ("administrativeUnit" == source) {
      this.setState({ administrativeUnit: value });
    }
  };

  componentWillUnmount() {
    this.props.updatePageData();
  }

  componentDidMount() {
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      if (value !== this.state.password) {
          return false;
      }
      return true;
  });
  }

  componentWillMount() {
    let { open, handleClose, item } = this.props;
    let {provinceOfResidence,districtOfResidence,wardOfResidence,provinceOfResidenceSearch} = this.state;
    if (item && item.administrativeUnit) {
      if (item.administrativeUnit.parent) {
        wardOfResidence = item.administrativeUnit.parent;
        if (wardOfResidence.parent) {
          districtOfResidence = wardOfResidence.parent;
          if (districtOfResidence.parent) {
            provinceOfResidence = districtOfResidence.parent;
          }
        }
      }
    }
    if (provinceOfResidence) {
      this.handleSelectdministrativeUnit(provinceOfResidence, "provinceOfResidence")
      if (districtOfResidence) {
        console.log(districtOfResidence);
        this.handleSelectdministrativeUnit(districtOfResidence, "districtOfResidence")
        if (wardOfResidence) {
          this.handleSelectdministrativeUnit(wardOfResidence, "wardOfResidence")
        }
      }
    } else {
      getAdministrativeUnitByPage(provinceOfResidenceSearch).then(({data}) => {
        if (data && data.content) {
          provinceOfResidence = data.content.find((element) => element.name === "H??? Ch?? Minh")
          if (provinceOfResidence) {
            this.handleSelectdministrativeUnit(provinceOfResidence, "provinceOfResidence");
            if (provinceOfResidence.subAdministrativeUnitsDto && provinceOfResidence.subAdministrativeUnitsDto.length > 0) {
              districtOfResidence = provinceOfResidence.subAdministrativeUnitsDto.find((element) => element.name === "Qu???n 7")
              this.handleSelectdministrativeUnit(districtOfResidence, "districtOfResidence");
            }
          }
        }
      })
    }
    this.setState({ ...item });
  }

  render() {
    let { open, handleClose, handleOKEditClose, t, i18n, readOnly } = this.props;
    let {
      id,
      name,
      code,
      phoneNumber,
      age,
      password,
      confirmPassword,
      detailAddress,
      districtOfResidence,
      wardOfResidence,
      wardOfResidenceSearch,
      administrativeUnit,
      hamletOfResidenceSearch,
      provinceOfResidence,
      provinceOfResidenceSearch,
      districtOfResidenceSearch

    } = this.state;
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
          style={{ cursor: 'move' }}
          id="draggable-dialog-title"
        >
          <span className="mb-20 text-white" > {(id ? t("general.button.edit") : t("general.button.add")) + " " + t("H??? gia ????nh")} </span>
          <IconButton style={{ position: "absolute", right: "10px", top: "10px" }} onClick={() => handleClose()}>
            <Icon color="disabled" title={t("general.button.close")}>close</Icon>
          </IconButton>
        </DialogTitle>

        <ValidatorForm ref="form" onSubmit={this.handleFormSubmit} >
          <div className="dialog-body">
            <DialogContent className="o-hidden">
              <Grid container spacing={2}>
                <Grid item md={6} sm={12}>
                  <TextValidator
                    className="w-100"
                    label={<span className="font">
                      <span style={{ color: "red" }}> *</span>
                      {t('M?? gia ????nh')}
                    </span>
                    }
                    // onChange={this.handleChange}
                    type="text"
                    name="code"
                    value={code}
                    validators={["required"]}
                    errorMessages={[t("general.errorMessages_required")]}
                    variant="outlined"
                    size="small"
                    disabled
                  />
                </Grid>

                <Grid item md={6} sm={12}>
                  <TextValidator
                    className="w-100"
                    label={<span className="font">
                      <span style={{ color: "red" }}> *</span>
                      {t('H??? v?? t??n ch??? h???')}
                    </span>
                    }
                    onChange={this.handleChange}
                    type="text"
                    name="name"
                    value={name}
                    validators={["required"]}
                    errorMessages={[t("general.errorMessages_required")]}
                    variant="outlined"
                    size="small"
                  />
                </Grid>

                <Grid item md={3} sm={12}>
                  <TextValidator
                    className="w-100"
                    label={<span className="font">
                      <span style={{ color: "red" }}> *</span>
                      {t('Tu???i')}
                    </span>
                    }
                    onChange={this.handleChange}
                    type="number"
                    name="age"
                    value={age}
                    validators={["required"]}
                    errorMessages={[t("general.errorMessages_required")]}
                    variant="outlined"
                    size="small"
                  />
                </Grid>

                <Grid item md={3} sm={12}>
                  <TextValidator
                    className="w-100"
                    label={<span className="font">
                      <span style={{ color: "red" }}> *</span>
                      {t('S??T')}
                    </span>
                    }
                    onChange={this.handleChange}
                    type="text"
                    name="phoneNumber"
                    value={phoneNumber}
                    validators={["required"]}
                    errorMessages={[t("general.errorMessages_required")]}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item md={3} sm={12}>
                  <TextValidator
                    className="w-100"
                    label={<span className="font">
                      <span style={{ color: "red" }}> *</span>
                      {t('M???t kh???u')}
                    </span>
                    }
                    onChange={this.handleChange}
                    type="password"
                    name="password"
                    value={password}
                    validators={["required"]}
                    errorMessages={[t("general.errorMessages_required")]}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item md={3} sm={12}>
                  <TextValidator
                    className="w-100"
                    label={<span className="font">
                      <span style={{ color: "red" }}> *</span>
                      {t('X??c nh???n m???t kh???u')}
                    </span>
                    }
                    onChange={this.handleChange}
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    validators={["required","isPasswordMatch"]}
                    errorMessages={[t("M???t kh???u kh??ng kh???p")]}
                    variant="outlined"
                    size="small"
                  />
                </Grid>

                {/* ????n v??? h??nh ch??nh */}
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <AsynchronousAutocomplete
                    label={
                      <span className="font">
                        <span style={{ color: "red" }}> * </span>
                        {t("T???nh/Th??nh Ph???")}
                      </span>
                    }
                    searchFunction={getAdministrativeUnitByPage}
                    searchObject={provinceOfResidenceSearch}
                    value={provinceOfResidence ? provinceOfResidence : null}
                    multiple={false}
                    defaultValue={
                      provinceOfResidence ? provinceOfResidence : null
                    }
                    displayLable={"name"}
                    className="w-100"
                    // validators={["required"]}
                    // errorMessages={[t("general.required")]}
                    onSelect={(value) => {
                      this.handleSelectdministrativeUnit(
                        value,
                        "provinceOfResidence"
                      );
                    }}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <AsynchronousAutocomplete
                    label={
                      <span className="font">
                        <span style={{ color: "red" }}> * </span>
                        {t("Qu???n huy???n")}
                      </span>
                    }
                    searchFunction={getAdministrativeUnitByPage}
                    searchObject={districtOfResidenceSearch}
                    value={districtOfResidence ? districtOfResidence : null}
                    multiple={false}
                    defaultValue={
                      districtOfResidence ? districtOfResidence : null
                    }
                    displayLable={"name"}
                    className="w-100"
                    // validators={["required"]}
                    // errorMessages={[t("general.required")]}
                    onSelect={(value) => {
                      this.handleSelectdministrativeUnit(
                        value,
                        "districtOfResidence"
                      );
                    }}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <AsynchronousAutocomplete
                    label={
                      <span className="font">
                        <span style={{ color: "red" }}> * </span>
                        {t("X??/Ph?????ng")}
                      </span>
                    }
                    searchFunction={getAdministrativeUnitByPage}
                    searchObject={wardOfResidenceSearch}
                    value={wardOfResidence ? wardOfResidence : null}
                    multiple={false}
                    defaultValue={wardOfResidence ? wardOfResidence : null}
                    displayLable={"name"}
                    className="w-100"
                    // validators={["required"]}
                    // errorMessages={[t("general.required")]}
                    onSelect={(value) => {
                      this.handleSelectdministrativeUnit(
                        value,
                        "wardOfResidence"
                      );
                    }}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <AsynchronousAutocomplete
                    label={
                      <span className="font">
                        <span style={{ color: "red" }}> * </span>
                        {t("T???")}
                      </span>
                    }
                    searchFunction={getAdministrativeUnitByPage}
                    searchObject={hamletOfResidenceSearch}
                    value={administrativeUnit ? administrativeUnit : null}
                    multiple={false}
                    defaultValue={administrativeUnit ? administrativeUnit : null}
                    displayLable={"name"}
                    className="w-100"
                    // validators={["required"]}
                    // errorMessages={[t("general.required")]}
                    onSelect={(value) => {
                      this.handleSelectdministrativeUnit(
                        value,
                        "administrativeUnit"
                      );
                    }}
                    variant="outlined"
                    size="small"
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <TextValidator
                    className="w-100 mb-16"
                    label={<span className="font">
                      <span style={{ color: "red" }}> *</span>
                      {t('?????a ch??? chi ti???t')}
                    </span>
                    }
                    onChange={this.handleChange}
                    type="text"
                    name="detailAddress"
                    value={detailAddress}
                    validators={["required"]}
                    errorMessages={[t("general.errorMessages_required")]}
                    variant="outlined"
                    size="small"
                  />
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
                  {t("general.button.cancel")}
                </Button>
                {!readOnly &&
                  <Button
                    startIcon={<SaveIcon />}
                    className="mr-0 btn btn-success d-inline-flex"
                    variant="contained"
                    color="primary"
                    type="submit">
                    {t("general.button.save")}
                  </Button>}
              </div>
            </DialogActions>
          </div>
        </ValidatorForm>
      
      </Dialog >
    );
  }
}

export default PractitionerAndFamilyEditorDialog;
