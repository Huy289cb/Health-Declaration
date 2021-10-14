import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  DialogTitle,
  DialogContent,
  FormControlLabel,
  Checkbox,
  DialogActions,
  Icon,
  IconButton
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { addNew, update, checkCode } from "./Service";
import Draggable from 'react-draggable';
import Paper from '@material-ui/core/Paper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SaveIcon from '@material-ui/icons/Save';
import BlockIcon from '@material-ui/icons/Block';
import SelectAdministrativeUnitPopup from "../HealthCareGroup/SelectAdministrativeUnitPopup";

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

class HealthOrganizationEditorDialog extends Component {
  state = {
    name: "",
    code: "",
    shouldOpenSelectAdministrativeUnitPopup: false,
  };

  handleChange = (event, source) => {
    event.persist();
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  openCircularProgress = () => {
    this.setState({ loading: true });
  };

  handleFormSubmit = async () => {
    await this.openCircularProgress();
    let { id } = this.state;
    let { t } = this.props;
    let obj = {}
    obj.id = id;
    obj.code = this.state.code;
    obj.name = this.state.name;
    obj.administrativeUnit = this.state.administrativeUnit;

    //check code
    checkCode(id, obj.code).then((result) => {
      //Nếu trả về true là code đã được sử dụng
      if (result.data) {
        toast.warning('Mã đã được sử dụng, vui lòng thử lại.');
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

  componentWillUnmount() {
    this.props.updatePageData();
  }

  componentDidMount() {

  }

  componentWillMount() {
    let { item } = this.props;

    if (!item.id) {
      this.setState({ isAddNew: true });
    }
    this.setState({ ...item });
  }

  //handle slect administrativeUnit
  openParentPopup = (event) => {
    this.setState({ shouldOpenSelectAdministrativeUnitPopup: true });
  };
  handleDialogClose = () => {
    this.setState({ shouldOpenSelectAdministrativeUnitPopup: false });
  };
  handleSelectAdministrativeUnit = (item) => {
    this.setState({ administrativeUnit: item, shouldOpenSelectAdministrativeUnitPopup: false });
  };

  render() {
    let { open, handleClose, t, readOnly } = this.props;
    let {
      id,
      name,
      code,
      administrativeUnit
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
          style={{ cursor: 'move' }}
          id="draggable-dialog-title"
        >
          <span className="mb-20 text-white" > {(id ? t("general.button.edit") : t("general.button.add")) + " " + t("Đơn vị y tế")} </span>
          <IconButton style={{ position: "absolute", right: "10px", top: "10px" }} onClick={() => handleClose()}>
            <Icon color="disabled" title={t("general.button.close")}>close</Icon>
          </IconButton>
        </DialogTitle>

        <ValidatorForm ref="form" onSubmit={this.handleFormSubmit} >
          <div className="dialog-body">
            <DialogContent className="o-hidden">
              <Grid container spacing={2}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <TextValidator
                    className="w-100"
                    label={<span className="font">
                      <span style={{ color: "red" }}> *</span>
                      {t('Mã đơn vị y tế')}
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

                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <TextValidator
                    className="w-100"
                    label={<span className="font">
                      <span style={{ color: "red" }}> *</span>
                      {t('Tên đơn vị y tế')}
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
                {administrativeUnit &&
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextValidator
                        className="w-100"
                        label={<span className="font">
                        <span style={{ color: "red" }}> *</span>
                        {t('Đơn vị hành chính')}
                        </span>
                        }
                        // onChange={this.handleChange}
                        disabled
                        type="text"
                        name="administrativeUnit"
                        value={administrativeUnit? administrativeUnit.name ? administrativeUnit.name : "" : ""}
                        validators={["required"]}
                        errorMessages={[t("general.errorMessages_required")]}
                        variant="outlined"
                        size="small"
                    />
                </Grid>}
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Button
                        size="small"
                        className="btn btn-primary"
                        // style={{ float: "right" }}
                        variant="contained"
                        color="primary"
                        onClick={this.openParentPopup}>
                        {t("Chọn đơn vị hành chính")}
                    </Button>
                </Grid>
                
                {this.state.shouldOpenSelectAdministrativeUnitPopup && (
                  <SelectAdministrativeUnitPopup
                    open={this.state.shouldOpenSelectAdministrativeUnitPopup}
                    handleSelect={this.handleSelectAdministrativeUnit}
                    selectedItem={administrativeUnit ? administrativeUnit : {}}
                    handleClose={this.handleDialogClose}
                    t={t}
                  />
                )}
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

export default HealthOrganizationEditorDialog;