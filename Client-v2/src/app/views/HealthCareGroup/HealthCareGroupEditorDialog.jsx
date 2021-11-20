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
  DialogActions, Icon, IconButton
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import InputAdornment from "@material-ui/core/InputAdornment";
import { searchByPage, getById, addNew, update, checkDuplicate } from "./HealthCareGroupService";
import SelectAdministrativeUnitPopup from "./SelectAdministrativeUnitPopup";
import { generateRandomId } from "utils";
import Draggable from 'react-draggable';
import MaterialTable, { MTableToolbar, Chip, MTableBody, MTableHeader } from 'material-table';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import Paper from '@material-ui/core/Paper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Autocomplete from "@material-ui/lab/Autocomplete";
import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';
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
function MaterialButton(props) {
  const { t, i18n } = useTranslation();
  const { item } = props;
  return <div>
    <IconButton size="small" onClick={() => props.onSelect(item, 1)}>
      <Icon fontSize="small" color="error">delete</Icon>
    </IconButton>
  </div>;
}
class HealthCareGroupEditorDialog extends Component {
  state = {
    id: null,
    isError1: false,
    name: "",
    code: "",
    address: "",
    phoneNumber1: null,
    phoneNumber2: null,
    parent: {},
    listHealthCareGroup: [],
    listHealthCareGroupAdministrativeUnits: [],
    listHealthCareGroupAdministrativeUnits: [],
    shouldOpenSelectAdministrativeUnitPopup: false,
    parentId: "",
    personInCharge: ""
  };
  handleChange = (event, source) => {
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

  //popup
  handleDialogClose = () => {
    this.setState({ shouldOpenSelectAdministrativeUnitPopup: false });
  };
  openParentPopup = (event) => {
    this.setState({ shouldOpenSelectAdministrativeUnitPopup: true });
  };
  handleSelectAdministrativeUnit = (itemParent) => {
    if (Object.keys(itemParent).length !== 0) {
      let { t } = this.props;
      let { id } = this.state;
      let { code, parent } = this.state;
      let idClone = id;
      let { item } = this.state;
      if (id) {
        let isCheck = false;
        let parentClone = itemParent;
        let children = this.props.item;
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
      let { listHealthCareGroupAdministrativeUnits } = this.state;
      if (!listHealthCareGroupAdministrativeUnits) { listHealthCareGroupAdministrativeUnits = [] };
      //check chọn trùng đơn vị
      let duplicate = listHealthCareGroupAdministrativeUnits.find((e) => e.administrativeUnit.id === itemParent.id);
      if (duplicate) {
        //nếu chọn trùng thì k làm gì cả.
        toast.warning("Đơn vị hành chính đã có trong danh sách!");
      } else {
        listHealthCareGroupAdministrativeUnits.push({ administrativeUnit: itemParent });
      }
      this.setState({ listHealthCareGroupAdministrativeUnits, shouldOpenSelectAdministrativeUnitPopup: false }, () => {
        console.log(this.state);
      });
    } else {
      toast.warning("Hãy chọn 1 đơn vị hành chính!");
    }
  };

  validateSDT = (sdt) => {
    var cm = /^0[0-9]{9,10}$/
    if (sdt.match(cm)) {
      return true
    } else {
      return false;
    }
  }

  handleFormSubmit = async () => {
    await this.openCircularProgress();
    let { id, code,phoneNumber1, phoneNumber2 } = this.state;
    console.log(this.state);
    let { t } = this.props;
    if (!(this.state.listHealthCareGroupAdministrativeUnits.length > 0)) {
      toast.warning('Đơn vị hành chính quản lý không được để trống');
    }
    else if (this.validateData()) {
      toast.warning('Trường dữ liệu không thể để trống');
    } else if(phoneNumber1 != null && phoneNumber1.length > 0 && phoneNumber2 != null && phoneNumber2.length > 0 && this.validateSDT(phoneNumber1) == false && this.validateSDT(phoneNumber2) == false){
      toast.warning("Số điện thoại không hợp lệ");
    } else {
      checkDuplicate({ ...this.state }).then(({ data }) => {
        if (data) {
          toast.info(t('Mã đã được sử dụng. Vui Lòng nhập mã khác'));
        } else {
          if (id) {
            update({
              ...this.state
            }, id).then(() => {
              toast.success(t('Cập nhật thành công'));
              this.setState({ ...this.state, loading: false });
              this.props.handleClose();
            });
          } else {
            addNew({
              ...this.state
            }).then((response) => {
              if (response.data != null && response.status == 200) {
                this.state.id = response.data.id
                this.setState({ ...this.state, loading: false })
                toast.success(t('Thêm mới thành công'));
                this.props.handleClose();
              }
            });
          }
        }
      })
    }
  };

  componentDidMount() {
  }
  componentWillMount() {
    let { open, handleClose, item } = this.props;
    this.setState(item);
  }

  validateData = () => {
    if (this.state.name.trim().length == 0 || this.state.code.trim().length == 0) {
      return true;
    }
    return false;
  }
  handleDelete = (row) => {
    let { listHealthCareGroupAdministrativeUnits } = this.state;
    const tasks = listHealthCareGroupAdministrativeUnits.filter(x => x.administrativeUnit.id !== row.administrativeUnit.id);
    this.setState({
      listHealthCareGroupAdministrativeUnits: tasks
    })

  }
  render() {
    let { open, handleClose, handleOKEditClose, t, i18n, item } = this.props;

    let {
      id,
      isError1,
      name,
      code,
      address,
      phoneNumber1,
      phoneNumber2,
      zalo, 
      // faceBook
      personInCharge,
    } = this.state;
    var stop = false;

    let columns = [
      {
        title: "Thao tác",
        field: "custom",
        align: "left",
        width: "250",
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
        render: rowData => <MaterialButton item={rowData}
          onSelect={(rowData, method) => {
            if (method === 1) {
              this.handleDelete(rowData);
            } else {
              alert('Call Selected Here:' + rowData.id);
            }
          }}
        />
      },
      {
        title: "Mã đơn vị", field: "", width: "150",
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
        render: rowData => <span>{rowData.administrativeUnit ? rowData.administrativeUnit.code : ''}</span>
      },
      {
        title: 'Tên đơn vị', field: "", align: "left", width: "150",
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
        render: rowData => <span>{rowData.administrativeUnit ? rowData.administrativeUnit.name : ''}</span>
      },

    ]
    return (
      <Dialog open={open} PaperComponent={PaperComponent} maxWidth={'md'} fullWidth={true}>
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          <span className="mb-20" > {(id ? t("general.button.update") : t("general.button.add")) + " " + t("healthCareGroup.popup")} </span>
          <IconButton style={{ position: "absolute", right: "10px", top: "10px" }} onClick={() => handleClose()}><Icon color="error"
            title={t("close")}>
            close
          </Icon>
          </IconButton>
        </DialogTitle>
        <ValidatorForm ref="form" onSubmit={this.handleFormSubmit} >
          <DialogContent>
            <Grid className="" container spacing={2}>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <TextValidator
                  className="w-100"
                  label={<span className="font">
                    <span style={{ color: "red" }}> *</span>
                    Mã tổ y tế
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
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <TextValidator
                  className="w-100"
                  label={<span className="font">
                    <span style={{ color: "red" }}> *</span>
                    Tên tổ y tế
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
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <TextValidator
                  className="w-100"
                  label={<span className="font">
                    <span style={{ color: "red" }}> * </span>
                    Số điện thoại cấp cứu
                  </span>}
                  onChange={this.handleChange}
                  type="tel"
                  name="phoneNumber1"
                  value={phoneNumber1}
                  validators={["required", "matchRegexp:^0[0-9]{9,10}$"]}
                  errorMessages={[t("general.errorMessages_required"), "Số điện thoại không hợp lệ"]}
                  variant="outlined"
                  size="small"
                />

              </Grid>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <TextValidator
                  className="w-100"
                  label={<span className="font">
                    <span style={{ color: "red" }}>  </span>
                    Số Zalo
                  </span>}
                  onChange={this.handleChange}
                  type="tel"
                  name="zalo"
                  value={zalo}
                  validators={["matchRegexp:^0[0-9]{9,10}$"]}
                  errorMessages={["Số điện thoại không hợp lệ"]}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              {/* <Grid item lg={6} md={6} sm={12} xs={12}>
                <TextValidator
                  className="w-100"
                  label={<span className="font">
                    {t('healthCareGroup.faceBook')}
                  </span>}
                  onChange={this.handleChange}
                  type="text"
                  name="faceBook"
                  value={faceBook}
                  // validators={["required"]}
                  // errorMessages={[t("general.errorMessages_required")]}
                  variant="outlined"
                  size="small"
                />
              </Grid> */}
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <TextValidator
                  className="w-100"
                  label={<span className="font">
                    <span style={{ color: "red" }}>  </span>
                    Người phụ trách
                  </span>}
                  onChange={this.handleChange}
                  type="text"
                  name="personInCharge"
                  value={personInCharge}
                  // validators={["required"]}
                  // errorMessages={[t("general.errorMessages_required")]}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <TextValidator
                  className="w-100"
                  label={<span className="font">
                    <span style={{ color: "red" }}> </span>
                    Số điện thoại người phụ trách
                  </span>}
                  onChange={this.handleChange}
                  type="tel"
                  name="phoneNumber2"
                  value={phoneNumber2}
                  validators={["matchRegexp:^0[0-9]{9,10}$"]}
                  errorMessages={["Số điện thoại không hợp lệ"]}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <TextValidator
                  className="w-100"
                  label={<span className="font">
                    <span style={{ color: "red" }}> * </span>
                    Địa chỉ
                  </span>}
                  onChange={this.handleChange}
                  type="text"
                  name="address"
                  value={address}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item sm={12} xs={12}>
                <Button
                  size="small"
                  className="btn btn-success"
                  variant="contained"
                  color="primary"
                  onClick={this.openParentPopup}>
                    <span className="font">
                      <span style={{ color: "red" }}> * </span>
                      Đơn vị hành chính quản lý
                    </span>
                </Button>
                {/* <TextValidator
                  size="small"
                  style={{ width: "80%" }}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                  label={
                    <span>
                      <span style={{ color: "red" }}></span>
                      {t("Đơn vị hành chính")}
                    </span>
                  }
                  className="w-80"
                  value={
                    this.state.parent != null ? this.state.parent.name ? this.state.parent.name : "" : ""
                  }
                /> */}

                {this.state.shouldOpenSelectAdministrativeUnitPopup && (
                  <SelectAdministrativeUnitPopup
                    open={this.state.shouldOpenSelectAdministrativeUnitPopup}
                    handleSelect={this.handleSelectAdministrativeUnit}
                    selectedItem={this.state.listHealthCareGroupAdministrativeUnits}
                    handleClose={this.handleDialogClose}
                    t={t}
                    i18n={i18n}
                  />
                )}
              </Grid>
              <Grid item sm={12} xs={12}>
                <MaterialTable
                  title={t('List')}
                  data={this.state.listHealthCareGroupAdministrativeUnits ? this.state.listHealthCareGroupAdministrativeUnits : []}
                  columns={columns}
                  options={{
                    selection: false,
                    actionsColumnIndex: -1,
                    paging: false,
                    search: false,
                    rowStyle: (rowData, index) => ({
                      backgroundColor: (index % 2 === 1) ? '#EEE' : '#FFF',
                    }),
                    maxBodyHeight: '450px',
                    minBodyHeight: '250px',
                    headerStyle: {
                      backgroundColor: "#3366ff",
                      color: "#fff",
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
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions spacing={4} className="flex flex-end flex-middle">
            <Button
              startIcon={<BlockIcon />}
              variant="contained"
              className="mr-12 btn btn-secondary d-inline-flex"
              variant="contained"
              color="secondary"
              onClick={() => this.props.handleClose()}>
              Huỷ
            </Button>
            <Button
              startIcon={<SaveIcon />}
              variant="contained"
              className="mr-12 btn btn-primary-d d-inline-flex"
              color="primary"
              type="submit">
              Lưu
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    );
  }
}

export default HealthCareGroupEditorDialog;
