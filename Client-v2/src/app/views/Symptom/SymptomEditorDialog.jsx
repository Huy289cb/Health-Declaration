import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  FormControlLabel,
  Switch,
  DialogTitle,
  DialogContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  DialogActions, Icon, IconButton, FormHelperText
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import {searchByPage, getById, addNew, update, checkCode } from "./SymptomService";
//import SelectParentPopup from "./SelectParentPopup";
import { generateRandomId } from "utils";
import Draggable from 'react-draggable';
import Paper from '@material-ui/core/Paper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Autocomplete from "@material-ui/lab/Autocomplete";

import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import { SYMPTOM_TYPE } from "../../appConfig";
import SaveIcon from '@material-ui/icons/Save';
import BlockIcon from '@material-ui/icons/Block';

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

class SymptomEditorDialog extends Component {
  state = {
    id: null,
    name: "",
    code: "",
    level: 0,
    parent: {},
    listSymptom:[],
    shouldOpenSelectParentPopup: false,
    parentId: "",
    type: "",
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
  openCircularProgress = () => {
    this.setState({ loading: true });
  };

  selectType = (event, item) => {
    this.setState({[event.target.name]: event.target.value});
    this.setState({errorType: false, errorTypeText: ""})
  }
  //popup
  handleDialogClose = () => {
    this.setState({ shouldOpenSelectParentPopup: false });
  };
  openParentPopup = (event) => {
    this.setState({ shouldOpenSelectParentPopup: true });
  };
  handleSelectParent = (itemParent) => {
    let { t } = this.props;
    let { id } = this.state;
    let { code, parent } = this.state;
    let idClone = id;
    let { item } = this.state;
    if (id) {
        let isCheck = false;
        let parentClone = itemParent;
        let children = this.props.item;
        // if(typeof)
        if (children.parentId === null && children.id == parentClone.id) {
            isCheck = true;
        }
        while (parentClone != null) {
            if (parentClone.id == children.id) {
                isCheck = true;
                break;
            } else {
                parentClone = parentClone.parent;
            }
        }
        if (isCheck) {
            alert(t("user.warning_parent"));
            return;
        }
    }
    this.setState({ parent: itemParent });
    this.setState({ shouldOpenSelectParentPopup: false });
};
  handleFormSubmit = async () => {
    await this.openCircularProgress();
    let { id, code } = this.state;
    let { t } = this.props;
    if (this.validateData()) {
      toast.warning('Tr?????ng d??? li???u kh??ng th??? ????? tr???ng');
    } else {
      if (id) {
        update({
          ...this.state
        },id).then(() => {
          toast.success(t('C???p nh???t th??nh c??ng'));
          this.setState({...this.state, loading: false });
          this.props.handleClose();
        });
      } else {
        addNew({
          ...this.state
        }).then((response) => {
          if (response.data != null && response.status == 200) {
            this.state.id = response.data.id
            this.setState({ ...this.state, loading: false })
            toast.success(t('Th??m m???i th??nh c??ng'));
            this.props.handleClose();
          }
        });
      }
    }
  };

  componentDidMount() {
    getById(this.state.id ? this.state.id : null).then((data) => {
      this.setState({ listSymptom: data.data });
     
    });
  }
  componentWillMount() {
    let { open, handleClose, item } = this.props;
    this.setState(item);
  }

  validateData = () => {
    if (this.state.name.trim().length == 0 || this.state.code.trim().length == 0) {
      return true;
    }
    if (!this.state.type) {
      this.setState({errorType: true, errorTypeText: "Tr?????ng n??y kh??ng ???????c b??? tr???ng"})
      return true;
    }
    return false;
  }

  render() {
    let { open, handleClose, handleOKEditClose, t, i18n, item } = this.props;
   
    let {
      id,
      name,
      code,
      level,
      parent,
      parentId,
      listSymptom,
      isActive,
      type,
      loading,
    } = this.state;
    var stop = false;
    return (
      <Dialog open={open} PaperComponent={PaperComponent} maxWidth={'sm'} fullWidth={true}>
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          <span className="mb-20" > {(id ? t("update") : t("Th??m m???i")) + " " + t("tri???u ch???ng")} </span>
          <IconButton style={{ position: "absolute", right: "10px", top: "10px" }} onClick={() => handleClose()}><Icon color="error"
            title={t("close")}>
            close
          </Icon>
          </IconButton>
        </DialogTitle>
        <ValidatorForm ref="form" onSubmit={this.handleFormSubmit} >
          <DialogContent>
            <Grid className="" container spacing={2}>
              {/* code */}
              <Grid item sm={12} xs={12}>
                <TextValidator
                  className="w-100"
                  label={<span className="font">
                    <span style={{ color: "red" }}> * </span>
                    M?? tri???u ch???ng
                  </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="code"
                  value={code}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              {/* name */}
              <Grid item sm={12} xs={12}>
                <TextValidator
                  className="w-100"
                  label={<span className="font">
                    <span style={{ color: "red" }}> * </span>
                    T??n tri???u ch???ng
                  </span>}
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
              {/* Type */}
              <Grid item sm={12} xs={12}>
                <FormControl error={this.state.errorType} fullWidth={true} variant="outlined" size="small">
                    <InputLabel htmlFor="type-simple">
                      <span className="font">
                        <span style={{ color: "red" }}> * </span>
                        Lo???i tri???u ch???ng
                      </span>
                    </InputLabel>
                    <Select
                        label={<span className="font">
                          <span style={{ color: "red" }}> * </span>
                          Lo???i tri???u ch???ng
                        </span>}
                        value={type ? type : null}
                        onChange={(key) => this.selectType(key)}
                        inputProps={{
                            name: "type",
                            id: "objectType-simple",
                        }}
                    >
                        {SYMPTOM_TYPE.map((item) => {
                            return (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.display}
                                </MenuItem>
                            );
                        })}
                    </Select>
                    <FormHelperText>{this.state.errorTypeText}</FormHelperText>
                </FormControl>
              </Grid>
              {/* parent */}
              {/* <Grid item sm={12} xs={12}>
                <Button
                    size="small"
                    style={{ float: "right" }}
                    variant="contained"
                    color="primary"
                    onClick={this.openParentPopup}>
                    {t("general.select")}
                </Button>
                <TextValidator
                    size="small"
                    // InputLabelProps={{ shrink: true }}
                    style={{ width: "85%" }}
                    InputProps={{
                        readOnly: true,
                    }}
                    label={
                        <span>
                            <span style={{ color: "red" }}></span>
                            {t("????n v??? c???p tr??n")}
                        </span>
                    }
                    // className="w-80"
                    value={
                        this.state.parent != null ? this.state.parent.name ? this.state.parent.name : "" : ""
                    }
                />

                {this.state.shouldOpenSelectParentPopup && (
                    <SelectParentPopup
                        open={this.state.shouldOpenSelectParentPopup}
                        handleSelect={this.handleSelectParent}
                        selectedItem={
                            this.state.item != null && this.state.item.parent != null
                                ? this.state.item.parent
                                : {}
                        }
                        handleClose={this.handleDialogClose}
                        t={t}
                        i18n={i18n}
                    />
                )}
              </Grid> */}
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
            <Button
              startIcon={<SaveIcon />}
              variant="contained"
              className="mr-12 btn btn-primary-d d-inline-flex"
              color="primary"
              type="submit">
              L??u
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    );
  }
}

export default SymptomEditorDialog;
