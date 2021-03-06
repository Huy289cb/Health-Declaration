import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  DialogTitle,
  DialogContent,
  FormControlLabel,
  FormHelperText,
  Checkbox,
  Paper,
  DialogActions,
  Icon,
  IconButton, TextareaAutosize, FormControl, Select, InputLabel, MenuItem, Input
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import InputAdornment from "@material-ui/core/InputAdornment";
import { saveOrUpdate, checkDuplicate } from "./FamilyMemberService";
import Draggable from 'react-draggable';
import { toast } from 'react-toastify';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import 'react-toastify/dist/ReactToastify.css';
import ConstantList from "../../appConfig";
import FamilyInputPopup from "../Component/SelectFamilyPopup/InputPopup"
import Autocomplete from "@material-ui/lab/Autocomplete";
import { searchByPage as getBackgroundDisease } from "../BackgroundDisease/BackgroundDiseaseService";
import { addMemberInBoard } from "app/redux/actions/ScrumBoardActions";
import localStorageService from "../../services/localStorageService";
import { getCurrentUser } from "../page-layouts/UserProfileService";
import { getFamilyByUserLogin } from "../Family/Service";
import "./style.css"
import SaveIcon from '@material-ui/icons/Save';
import BlockIcon from '@material-ui/icons/Block';

toast.configure({
  autoClose: 1000,
  draggable: false,
  limit: 3
});

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

class FamilyMemberEditorDialog extends Component {
  state = {
    id: null,
    family: null,
    member: null,
    relationship: '',
    gender: '',
    isPregnant: null,
    healthInsuranceCardNumber: '',
    anamnesis: '',
    address: '',
    age: null,
  };

  handleChange = (event, source) => {
    event.persist();
    if (source === "haveBackgroundDisease") {
      let { member } = this.state;
      member.haveBackgroundDisease = event.target.checked
      this.setState({ member });
      return;
    }
    let name = event.target.name;
    let value = event.target.value;
    if (source != null && source == "displayName") {
      let { member } = this.state;
      if (!member) { member = {} };
      member.displayName = event.target.value;
      this.setState({ member });
    }
    else if (source != null && source == "phoneNumber") {
      let { member } = this.state;
      if (!member) { member = {} };
      member.phoneNumber = event.target.value;
      this.setState({ member });
    }
    else if (source != null && source == "email") {
      let { member } = this.state;
      if (!member) { member = {} };
      member.email = event.target.value;
      this.setState({ member });
    }
    else if (source != null && source == "height") {
      let { member } = this.state;
      if (!member) { member = {} };
      member.height = event.target.value;
      this.setState({ member });
    }
    else if (source != null && source == "detailAddress") {
      let { member } = this.state;
      if (!member) { member = {} };
      member.detailAddress = event.target.value;
      this.setState({ member });
    }
    else if (source != null && source == "age") {
      let { member } = this.state;
      if (!member) { member = {} };
      member.age = event.target.value;
      this.setState({ member });
    }
    else if (source != null && source == "weight") {
      let { member } = this.state;
      if (!member) { member = {} };
      member.weight = event.target.value;
      this.setState({ member });
    }
    else if (source != null && source == "gender") {
      let { member } = this.state;
      if (!member) { member = {} }
      member.gender = event.target.defaultValue;
      if (event.target.defaultValue == "M") {
        member.isPregnant = false;
      }
      this.setState({ member, radioErrorGender: false, radioHelperTextGender: "" });
    }
    else if (source != null && source == "isPregnant") {
      let { member } = this.state;
      if (!member) { member = {} }
      member.isPregnant = event.target.checked;
      this.setState({ member })
    }
    else if (source != null && source == "healthInsuranceCardNumber") {
      let { member } = this.state;
      if (!member) { member = {} };
      member.healthInsuranceCardNumber = event.target.value;
      this.setState({ member });
    }
    else if (source != null && source == "idCardNumber") {
      let { member } = this.state;
      if (!member) { member = {} };
      member.idCardNumber = event.target.value;
      this.setState({ member });
    }
    else if (source != null && source == "noteBackgroundDiseases") {
      let { member } = this.state;
      if (!member) { member = {} };
      member.noteBackgroundDiseases = event.target.value;
      this.setState({ member });
    }
    else if(source != null && source == "suspectedLevel"){
      let { member } = this.state;
      if (!member) { member = {} };
      member.suspectedLevel = event.target.value;
      this.setState({ member });
    }
    else {
      this.setState({
        [event.target.name]: event.target.value
      });
    }
  };
  openCircularProgress = () => {
    this.setState({ loading: true });
  };

  validateCMND = (cmnd) => {
    var cm = /^[0-9]{9,12}$/
    if (cmnd.match(cm)) {
      return true
    } else {
      return false;
    }
  }
  validateSDT = (sdt) => {
    var cm = /^0[0-9]{9,10}$/
    if (sdt.match(cm)) {
      return true
    } else {
      return false;
    }
  }
  validateSoBHYT = (bhyt) => {
    var cm = /^[a-zA-Z0-9]+$/
    if (bhyt.match(cm)) {
      return true
    } else {
      return false;
    }
  }
  handleFormSubmit = async () => {
    let { id, type, member } = this.state;
    let { t } = this.props;
    //validate radio c?? b???nh n???n
    if (this.state.member.gender === null || this.state.member.gender === undefined) {
      this.setState({
        radioHelperTextGender: "????y l?? tr?????ng b???t bu???c", radioErrorGender: true
      })
    } else if (this.state.member.haveBackgroundDisease === null || this.state.member.haveBackgroundDisease === undefined) {
      this.setState({ radioHelperText: "????y l?? tr?????ng b???t bu???c", radioError: true })
    } else {
      member.listBackgroundDisease = [];
      member.backgroundDiseases.forEach(element => {
        member.listBackgroundDisease.push({ backgroundDisease: element });
      });

      this.setState({ member }, function () {
        let obj = {};
        obj.id = id;
        obj.family = this.state.family;
        obj.member = this.state.member;
        obj.relationship = this.state.relationship;
        // obj.hostFamily = this.state.hostFamily;
        if (this.state.member.healthInsuranceCardNumber != null && this.validateSoBHYT(this.state.member.healthInsuranceCardNumber) == false) {
          toast.warning("S??? b???o hi???m y t??? kh??ng h???p l???");
        } else if (this.state.member.idCardNumber != null && this.validateCMND(this.state.member.idCardNumber) == false) {
          toast.warning("S??? CMND kh??ng h???p l???");
        } else if (this.state.member.phoneNumber != null && this.validateSDT(this.state.member.phoneNumber) == false) {
          toast.warning("S??? ??i???n tho???i kh??ng h???p l???");
        } else if (this.state.member.age < 0 || this.state.member.age > 120) {
          toast.warning("Tu???i kh??ng h???p l???");
        } else if (this.state.member.height < 0 || this.state.member.height > 250) {
          toast.warning("Chi???u cao kh??ng h???p l???");
        } else if (this.state.member.weight < 0 || this.state.member.weight > 250) {
          toast.warning("C??n n???ng kh??ng h???p l???");
        } else {
          // checkDuplicate(obj).then(({ data }) => {
            // if (data == 1) {
            //   toast.warning("S??? b???o hi???m y t??? ???? t???n t???i");
            // } else if (data == 2) {
            //   toast.warning("S??? CCCD, CMND ???? t???n t???i");
            // } else {
              if (id) {
                saveOrUpdate(obj).then(() => {
                  toast.success(t('???? c???p nh???t'));
                  this.setState({ loading: false });
                  this.props.handleClose();
                });
              } else {
                saveOrUpdate(obj).then((response) => {
                  if (response.data != null && response.status == 200) {
                    this.state.id = response.data.id
                    this.setState({ ...this.state, loading: false })
                    toast.success(t('???? th??m th??nh vi??n'));
                    this.props.handleClose();
                  }
                });
              }
            // }
          // })
        }
      });
    }

  };

  componentDidMount() {
  }

  componentWillMount() {
    let { open, handleClose, item } = this.props;
    if (!item.member) { item.member = {} };
    if (localStorageService.getItem('role') === "ROLE_USER") {
      this.setState({ isUser: true });
      getFamilyByUserLogin().then(({ data }) => {
        this.setState({ family: data });
        if (!item.member.detailAddress) {
          item.member.detailAddress = data.detailAddress;
          this.setState(item);
        }
      })
    }

    item.member.backgroundDiseases = [];
    if (item.member && item.member.listBackgroundDisease) {
      item.member.listBackgroundDisease.forEach(element => {
        item.member.backgroundDiseases.push(element.backgroundDisease);
      });
    }
    this.setState(item, () => {
      console.log(this.state);
    });
    getBackgroundDisease({ pageIndex: 0, pageSize: 1000 }).then(({ data }) => {
      this.setState({ listDataBackgroundDisease: [...data.content] });
    })
  }

  selectListBackgroundDisease = (values) => {
    let { member } = this.state;
    if (!member) { member = {} };
    member.backgroundDiseases = values;
    this.setState({ member });
  };

  render() {
    let { open, handleClose, handleOKEditClose, t, i18n, readOnly } = this.props;
    let {
      id,
      family,
      member,
      relationship,
      listDataBackgroundDisease,
      isUser
    } = this.state;

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: 250,
        },
      },
    };
    return (
      <Dialog open={open} PaperComponent={PaperComponent} maxWidth={'md'} fullWidth={true}>
        <DialogTitle
        // style={{ cursor: 'move' }} 
        // id="draggable-dialog-title"
        >
          <span className="mb-20" > {(readOnly && readOnly == true) ? 'Xem th??ng tin' : (t("FamilyMember.titlePopupEdit"))} </span>
          <IconButton style={{ position: "absolute", right: "10px", top: "10px" }} onClick={() => handleClose()}><Icon color="error"
            title={t("close")}>
            close
          </Icon>
          </IconButton>
        </DialogTitle>
        <ValidatorForm ref="form" onSubmit={this.handleFormSubmit} style={{
          overflowY: "auto",
          display: "flex",
          flexDirection: "column"
        }}>
          <DialogContent>
            <Grid className="" container spacing={2}>
              {!isUser &&
                <Grid item sm={12} xs={12}>
                  <FamilyInputPopup
                    disabled={isUser || readOnly}
                    family={family ? family : null}
                    setFamily={(item) => {
                      this.setState({ family: item });
                    }}
                    size="small"
                    variant="outlined"
                    label={
                      <span className="font">
                        <span style={{ color: "red" }}> *</span>
                        H??? gia ????nh
                      </span>
                    }
                  />
                </Grid>}
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <TextValidator
                  disabled={readOnly}
                  className="w-100"
                  label={
                    <span className="font">
                      <span style={{ color: "red" }}> * </span>
                      H??? v?? t??n
                    </span>
                  }
                  onChange={(value) => { this.handleChange(value, "displayName") }}
                  type="text"
                  name="name"
                  value={member ? (member.displayName ? member.displayName : '') : ''}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item lg={8} md={8} sm={12} xs={12} className="radio_gender">
                <FormControl component="fieldset" error={this.state.radioErrorGender}
                  disabled={readOnly}>
                  <FormLabel component="legend"><span style={{ color: "red" }}> *</span>Gi???i t??nh: </FormLabel>
                  <RadioGroup row className="radio_group_gender"
                    aria-label="position" name="position" defaultValue={member?.gender ? member.gender : null}
                    onChange={(value) => { this.handleChange(value, "gender") }}
                  >
                    <FormControlLabel
                      value="M"
                      control={<Radio />}
                      label="Nam"
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value="F"
                      control={<Radio />}
                      label="N???"
                      labelPlacement="end"
                    />
                  </RadioGroup>
                  <FormHelperText>{this.state.radioHelperTextGender}</FormHelperText>
                </FormControl>
                <div style={{ display: member ? (member.gender == "F" ? "block" : "none") : "none", marginLeft: "12px" }}>
                  <FormControlLabel
                    disabled={readOnly}
                    control={
                      <Checkbox
                        checked={member && member.gender == "F" ? member.isPregnant : false}
                        onChange={(value) => { this.handleChange(value, "isPregnant") }}
                        name="isPregnant"
                      />
                    }
                    label="??ang mang thai/nu??i con nh???(<12 th??ng)"
                  />
                </div>
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <FormControl className="nice-input" fullWidth={true} variant="outlined" size="small">
                  <InputLabel htmlFor="type-simple">
                    {
                      <span>M???c ????? nghi nhi???m</span>
                    }
                  </InputLabel>
                  <Select
                    label={
                      <span>M???c ????? nghi nhi???m</span>
                    }
                    value={member && member.suspectedLevel ? member.suspectedLevel : ""}
                    onChange={(value) => { this.handleChange(value, "suspectedLevel") }}
                    inputProps={{
                      name: "type",
                      id: "type-simple",
                    }}
                  // validators={["required"]}
                  // errorMessages={[t("general.required")]}
                  >
                    {ConstantList.SUSPECTEDLEVEL && ConstantList.SUSPECTEDLEVEL.map((item) => {
                      return (
                        <MenuItem key={item.key} value={item.key}>
                          {item.value ? item.value : ""}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <TextValidator
                  disabled={readOnly}
                  className="w-100"
                  label={
                    <span className="font">
                      <span style={{ color: "red" }}> * </span>Tu???i
                    </span>
                  }
                  onChange={(value) => { this.handleChange(value, "age") }}
                  type="number"
                  name="age"
                  value={member ? (member.age ? member.age : '') : ''}
                  variant="outlined"
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                  size="small"
                />
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <TextValidator
                  disabled={readOnly}
                  className="w-100"
                  label={
                    <span className="font">
                      <span style={{ color: "red" }}> * </span>C??n n???ng(kg)
                    </span>
                  }
                  onChange={(value) => { this.handleChange(value, "weight") }}
                  type="text"
                  name="weight"
                  value={member ? (member.weight ? member.weight : '') : ''}
                  variant="outlined"
                  validators={["required", 'isFloat']}
                  errorMessages={[t("general.errorMessages_required"), t('general.isFloat')]}
                  size="small"
                  step={0.0001}
                />
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <TextValidator
                  disabled={readOnly}
                  className="w-100"
                  label={
                    <span className="font">
                      <span style={{ color: "red" }}> * </span>Chi???u cao(cm)
                    </span>
                  }
                  onChange={(value) => { this.handleChange(value, "height") }}
                  type="text"
                  name="height"
                  value={member ? (member.height ? member.height : '') : ''}
                  variant="outlined"
                  validators={["required", "isFloat"]}
                  errorMessages={[t("general.errorMessages_required"), t('general.isFloat')]}
                  size="small"
                  step={0.0001}
                />
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <TextValidator
                  disabled={readOnly}
                  className="w-100"
                  label={
                    <span className="font">
                      S??? ??i???n tho???i
                    </span>
                  }
                  onChange={(value) => { this.handleChange(value, "phoneNumber") }}
                  type="text"
                  name="phoneNumber"
                  value={member ? (member.phoneNumber ? member.phoneNumber : '') : ''}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <TextValidator
                  disabled={readOnly}
                  className="w-100"
                  label={
                    <span className="font">
                      ?????a ch??? email
                    </span>
                  }
                  onChange={(value) => { this.handleChange(value, "email") }}
                  type="text"
                  name="email"
                  value={member ? (member.email ? member.email : '') : ''}
                  validators={['isEmail']}
                  errorMessages={['?????a ch??? email kh??ng h???p l???']}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item lg={3} md={3} sm={12} xs={12}>
                <TextValidator
                  disabled={readOnly}
                  className="w-100"
                  label={
                    <span className="font">
                      M???i quan h???
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="relationship"
                  value={relationship}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item lg={3} md={3} sm={12} xs={12}>
                <TextValidator
                  disabled={readOnly}
                  className="w-100"
                  label={
                    <span className="font">
                      <span style={{ color: "red" }}> * </span>?????a ch???
                    </span>
                  }
                  onChange={(value) => { this.handleChange(value, "detailAddress") }}
                  type="text"
                  name="detailAddress"
                  value={member ? (member.detailAddress ? member.detailAddress : '') : ''}
                  variant="outlined"
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                  size="small"
                />
              </Grid>
              <Grid item lg={3} md={3} sm={12} xs={12}>
                <TextValidator
                  disabled={readOnly}
                  className="w-100"
                  label={
                    <span className="font">
                      S??? th??? b???o hi???m y t???
                    </span>
                  }
                  onChange={(value) => { this.handleChange(value, "healthInsuranceCardNumber") }}
                  type="text"
                  name="healthInsuranceCardNumber"
                  value={member ? (member.healthInsuranceCardNumber ? member.healthInsuranceCardNumber : '') : ''}
                  variant="outlined"
                  // validators={["required"]}
                  // errorMessages={[t("general.errorMessages_required")]}
                  size="small"
                />
              </Grid>
              <Grid item lg={3} md={3} sm={12} xs={12}>
                <TextValidator
                  disabled={readOnly}
                  className="w-100"
                  label={
                    <span className="font">
                      S??? CMND
                    </span>
                  }
                  onChange={(value) => { this.handleChange(value, "idCardNumber") }}
                  type="text"
                  name="idCardNumber"
                  value={member ? (member.idCardNumber ? member.idCardNumber : '') : ''}
                  variant="outlined"
                  // validators={["required"]}
                  // errorMessages={[t("general.errorMessages_required")]}
                  size="small"
                />
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <FormControl component="fieldset" error={this.state.radioError}
                  disabled={readOnly}>
                  <FormLabel component="legend"><span style={{ color: "red" }}> * </span>C?? b???nh n???n: </FormLabel>
                  <RadioGroup row aria-label="haveBackgroundDisease" name="haveBackgroundDisease"
                    value={member.haveBackgroundDisease}
                    onChange={(event) => {
                      console.log(event.target.value);
                      if (event.target.value === "true") {
                        member.haveBackgroundDisease = true;
                      }
                      else {
                        member.haveBackgroundDisease = false;
                        member.backgroundDiseases = [];
                      }
                      this.setState({ member, radioHelperText: "", radioError: false })
                    }}>
                    <FormControlLabel value={true}
                      control={<Radio checked={member ? (member.haveBackgroundDisease === true ? true : false) : false} />}
                      label="C??" />
                    <FormControlLabel value={false}
                      control={<Radio checked={member ? (member.haveBackgroundDisease === false ? true : false) : false} />}
                      label="Kh??ng" />
                  </RadioGroup>
                  <FormHelperText>{this.state.radioHelperText}</FormHelperText>


                </FormControl>
              </Grid>
              {member.haveBackgroundDisease &&
              <>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Autocomplete
                      disabled={readOnly}
                      style={{ width: "100%" }}
                      multiple
                      id="combo-box-demo"
                      defaultValue={(member && member.backgroundDiseases) ? member.backgroundDiseases : []}
                      options={listDataBackgroundDisease ? listDataBackgroundDisease : []}
                      getOptionSelected={(option, value) =>
                        option.id === value.id
                      }
                      getOptionLabel={(option) => option.name}
                      onChange={(event, value) => {
                        this.selectListBackgroundDisease(value);
                      }}
                      renderInput={(params) => (
                        <TextValidator
                          disabled={readOnly}
                          {...params}
                          value={(member && member.backgroundDiseases) ? member.backgroundDiseases : []}
                          label={
                            <span className="font">
                              Ti???n s??? b???nh
                            </span>
                          }
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      )}
                    />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <TextValidator
                    disabled={readOnly}
                    className="w-100"
                    label={
                      <span className="font">
                        Ghi ch?? t??nh tr???ng b???nh n???n
                      </span>
                    }
                    onChange={(value) => { this.handleChange(value, "noteBackgroundDiseases") }}
                    type="text"
                    name="idCardNumber"
                    value={member ? (member.noteBackgroundDiseases ? member.noteBackgroundDiseases : '') : ''}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
              </>}
            </Grid>
          </DialogContent>

          <DialogActions spacing={4} className="flex flex-end flex-middle">
            <Button
              startIcon={<BlockIcon />}
              variant="contained"
              className="mr-12 btn btn-secondary d-inline-flex"
              color="secondary"
              onClick={() => this.props.handleClose()}>
              Hu???
            </Button>
            {!readOnly && <Button
              startIcon={<SaveIcon />}
              variant="contained"
              className="mr-12 btn btn-primary-d d-inline-flex"
              color="primary"
              // onClick={() => this.handleSave()}
              type="submit">
              L??u
            </Button>}
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    );
  }
}

export default FamilyMemberEditorDialog;
