import React, { Component } from "react";
import { Grid, IconButton, Icon, Button, Collapse } from "@material-ui/core";
import MaterialTable from 'material-table';
import { searchByPage, getById, deleteItem, getNewCode } from "./Service";
import EditorDialog from "./EditorDialog";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'styles/globitsStyles.css';
import SearchInput from '../Component/SearchInput/SearchInput';
import NicePagination from '../Component/Pagination/NicePagination';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import DescriptionIcon from '@material-ui/icons/Description';
import localStorageService from "app/services/localStorageService";
import FilterListIcon from "@material-ui/icons/FilterList";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { getAllInfoByUserLogin } from "../User/UserService";
import Filter from "../PractitionerAndFamily/Filter";
import appConfig from "app/appConfig";
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import PractitionerDialog from "./PractitionerDialog";

toast.configure({
  autoClose: 2000,
  draggable: false,
  limit: 3
});

function MaterialButton(props) {
  const { t, i18n } = useTranslation();
  const { item, isEdit, isDelete, isView } = props;
  return <div>
    {/* {isEdit && <IconButton size="small" onClick={() => props.onSelect(item, 3)}>
      <AssignmentIndIcon fontSize="small" color="primary"/>
    </IconButton>} */}
    {isView && <IconButton size="small" onClick={() => props.onSelect(item, 2)}>
      <Icon fontSize="small" color="primary">visibility</Icon>
    </IconButton>}
    {isEdit && <IconButton size="small" onClick={() => props.onSelect(item, 0)}>
      <Icon fontSize="small" color="primary">edit</Icon>
    </IconButton>}
    {isDelete && <IconButton size="small" onClick={() => props.onSelect(item, 1)}>
      <Icon fontSize="small" color="error">delete</Icon>
    </IconButton>}
  </div>;
}
class FamilyList extends Component {
  state = {
    rowsPerPage: 10,
    page: 1,
    keyword: '',
    totalPages: 10,
    shouldOpenEditorDialog: false,
    shouldOpenConfirmationDialog: false,
    shouldOpenConfirmationDeleteListDialog: false,
    shouldOpenPractitionerDialog: false,
    isAddNew: false,
    isEdit: false,
    isDelete: false,
    isView: false,
    readOnly: false,
    filterItem: {}
  };

  updatePageData = (item) => {
    var searchObject = {};
    if (item != null) {
      this.setState({
        page: 1,
        text: item.text,
        healthCareGroupId: item.healthCareGroupId? item.healthCareGroupId: this.state.healthCareGroupId,
        administrativeUnitId: item.administrativeUnitId? item.administrativeUnitId: this.state.administrativeUnitId,
      }, () => {
        this.search(searchObject);
      })
    } else {

      this.search(searchObject);
    }
  };

  search = (searchObject) => {
    searchObject.text = this.state.text;
    searchObject.pageIndex = this.state.page;
    searchObject.pageSize = this.state.rowsPerPage;
    searchObject.healthCareGroupId = this.state.healthCareGroupId;
    searchObject.administrativeUnitId = this.state.administrativeUnitId;
    searchByPage(searchObject).then(({ data }) => {
      this.setState({
        itemList: [...data.content],
        totalElements: data.totalElements,
        totalPages: data.totalPages
      })
    }
    );
  }


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

  handleClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationDeleteListDialog: false,
      shouldOpenPractitionerDialog: false,
    }, () => {
      this.updatePageData();
    });
  };

  handleEditItem = item => {
    getNewCode().then((response) => {
      if (response && response.data) {
        item.code = response.data;
        this.setState({
          item: item,
          shouldOpenEditorDialog: true
        });
      }
      else {
        toast.warning('có lỗi xảy ra khi sinh mã hộ gia đình, vui lòng thử lại.');
      }
    });
  };
  //handle popup open/close end

  //handle delete start
  handleConfirmDeleteItem = async () => {
    let { t } = this.props;
    await deleteItem(this.state.id).then(({ data }) => {
      if (data) {
        toast.success(t('toast.delete_success'));
      }
      else {
        toast.warn("Có lỗi xảy ra, vui lòng thử lại sau");
      }
    }).catch(() => {
      toast.warn("Có lỗi xảy ra, vui lòng thử lại sau");
    });
    this.updatePageData();
    this.handleClose();
  };
  handleDelete = id => {
    this.setState({
      id,
      shouldOpenConfirmationDialog: true
    });
  };
  //handle delete end

  componentWillMount() {
    getAllInfoByUserLogin().then((resp) => {
      let data = resp ? resp.data : null;
      if (data) {
        if (data.admin) {
          this.setState({ isAddNew: true, isEdit: true, isDelete: true, isView: true }, () => {
            this.updatePageData();
            this.setState({ role: localStorageService.getItem("role") });
          });
        }
        if (data.medicalTeam) {
          this.setState({ isAddNew: true, isEdit: true, isDelete: false, isView: true }, () => {
            this.updatePageData();
            this.setState({ role: localStorageService.getItem("role") });
          });
        }
        if (data.healthCareStaff) {
          this.setState({ isAddNew: false, isEdit: false, isDelete: false, isView: true }, () => {
            this.updatePageData();
            this.setState({ role: localStorageService.getItem("role") });
          });
        }
        if (data.user) {
          this.setState({ isAddNew: false, isEdit: true, isDelete: false, isView: true }, () => {
            this.updatePageData();
            this.setState({ role: localStorageService.getItem("role") });
          });
        }
      }
    })
  }

  componentDidMount() {
  }

  handleCollapseFilter = () => {
    let { checkedFilter } = this.state;
    this.setState({ checkedFilter: !checkedFilter });
  };

  handleChangeFilter = (filterItem) => {
    this.setState({filterItem: filterItem}, () => console.log(this.state));
  }

  render() {
    const { t, i18n } = this.props;
    let {
      itemList,
      shouldOpenConfirmationDialog,
      shouldOpenConfirmationDeleteListDialog,
      shouldOpenEditorDialog,
      role, isDelete, isView, isEdit, readOnly, isAddNew,
      checkedFilter,
      shouldOpenPractitionerDialog,
    } = this.state;

    let columns = [
      {
        title: 'Chủ hộ',
        field: "name",
        width: '150'
      },
      {
        title: 'Tuổi',
        field: "age",
        width: '100'
      },
      {
        title: 'SĐT',
        field: "phoneNumber",
        width: '100'
      },
      {
        title: "Địa chỉ",
        field: "administrativeUnit.name",
      },
      {
        title: 'Nhân viên y tế tại chỗ',
        render: rowData => {
          if (rowData.listPractitioner && rowData.listPractitioner.length > 0) {
            let item = rowData.listPractitioner.find((e) => e.type == 2);
            if ( item ) {
              return <div>{`${item.practitioner.displayName}`}</div>
            }
          }
        }
      },
      {
        title: 'Nhân viên y tế từ xa',
        render: rowData => {
          if (rowData.listPractitioner && rowData.listPractitioner.length > 0) {
            let item = rowData.listPractitioner.find((e) => e.type == 1);
            if ( item ) {
              return <div>{`${item.practitioner.displayName}`}</div>
            }
          }
        }
      },
      {
        title: "Thao tác",
        field: "custom",
        width: '100',
        type: 'numeric',
        render: rowData => <MaterialButton item={rowData} isDelete={isDelete} isEdit={isEdit} isView={isView}
          onSelect={(rowData, method) => {
            if (method === 0) {
              getById(rowData.id).then(({ data }) => {
                this.setState({
                  item: data,
                  readOnly: false,
                  shouldOpenEditorDialog: true
                });
              })
            } else if (method === 1) {
              this.handleDelete(rowData.id);
            }
            else if (method === 2) {
              getById(rowData.id).then(({ data }) => {
                if (data) {
                  data.isView = true;
                }
                this.setState({
                  item: data,
                  readOnly: true,
                  shouldOpenEditorDialog: true
                });
              })
            } else if (method === 3) {
              getById(rowData.id).then(({ data }) => {
                this.setState({
                  item: data,
                  readOnly: false,
                  shouldOpenPractitionerDialog: true
                });
              })
            }
            else {
              alert('Call Selected Here:' + rowData.id);
            }
          }}
        />
      },
    ]
    return (
      <div className="m-sm-30">
        <div className="mb-sm-30">
          <Breadcrumb routeSegments={[{ name: t('Hộ gia đình') }]} />
        </div>
        <Grid container spacing={3}>

          <Grid item md={6} sm={12}>
            <>
              {isAddNew &&  <Button
                className="mb-16 mr-16 btn btn-success d-inline-flex"
                startIcon={<AddIcon />}
                variant="contained"
                onClick={() => { this.handleEditItem({ startDate: new Date(), endDate: new Date() });}}>
                {t('general.button.add')}
              </Button>}
              {/* {isDelete && <Button
                className="mb-16 mr-16 btn btn-warning d-inline-flex"
                variant="contained"
                startIcon={<DeleteIcon />}
                onClick={() => this.setState({ shouldOpenConfirmationDeleteListDialog: true })}>
                {t('general.button.delete')}
              </Button>} */}

              {shouldOpenConfirmationDeleteListDialog && (
                <ConfirmationDialog
                  open={shouldOpenConfirmationDeleteListDialog}
                  onClose={this.handleClose}
                  onYesClick={this.handleDeleteListItem}
                  title={t("confirm_dialog.delete_list.title")}
                  text={t('confirm_dialog.delete_list.text')}
                  agree={t("confirm_dialog.delete_list.agree")}
                  cancel={t("confirm_dialog.delete_list.cancel")}
                />
              )}
            </>
          </Grid>
          <Grid item md={6} sm={12} xs={12}>
            <Grid container spacing={2} style={{ display: "flex", justifyContent: "flex-end" }}>
              <Grid item lg={8} md={8} sm={6} xs={6}>
                <SearchInput
                  search={this.updatePageData}
                  t={t}
                />
              </Grid>
              {(role != "ROLE_USER") &&
                <Grid item lg={4} md={4} sm={6} xs={6}>
                  <Button
                    className="btn_s_right d-inline-flex btn btn-primary-d"
                    variant="contained"
                    onClick={this.handleCollapseFilter}
                    fullWidth
                  >
                    <FilterListIcon />
                    <span>{t("general.button.filter")}</span>
                    <ArrowDropDownIcon
                      style={
                        checkedFilter
                          ? {
                            transform: "rotate(180deg)",
                            transition: ".3s",
                            paddingRight: 5,
                          }
                          : {
                            transform: "rotate(0deg)",
                            transition: ".3s",
                            paddingLeft: 5,
                          }
                      }
                    />
                  </Button>
                </Grid>}
            </Grid>
          </Grid>
          {checkedFilter && (<Grid item lg={12} md={12} sm={12} xs={12}>
            <Collapse
              in={checkedFilter}
              style={{
                width: "100%",
              }}
            >
              <Filter
                search={this.updatePageData}
                filterItem={this.state.filterItem}
                handleChangeFilter={this.handleChangeFilter}
                t={t}
              />
            </Collapse>
          </Grid>)}
          <Grid item xs={12}>
            <MaterialTable
              data={itemList}
              columns={columns}
              // parentChildData={(row, rows) => {
              //   var list = rows.find((a) => a.id === row.parentId)
              //   return list
              // }}
              options={{
                selection: false,
                actionsColumnIndex: -1,
                paging: false,
                search: false,
                toolbar: false,
                // maxBodyHeight: "440px",
                headerStyle: {
                  backgroundColor: "#3366ff",
                  color: "#fff",
                },
                //tableLayout: 'fixed',
              }}
              onSelectionChange={(rows) => {
                this.data = rows;
                // this.setState({selectedItems:rows});
              }}
            />
            <NicePagination
              totalPages={this.state.totalPages}
              handleChangePage={this.handleChangePage}
              setRowsPerPage={this.setRowsPerPage}
              pageSize={this.state.rowsPerPage}
              pageSizeOption={[1, 2, 3, 5, 10, 25, 1000]}
              t={t}
              totalElements={this.state.totalElements}
              page={this.state.page}
            />

            {shouldOpenEditorDialog && (
              <EditorDialog
                handleClose={this.handleClose}
                open={shouldOpenEditorDialog}
                updatePageData={this.updatePageData}
                item={this.state.item}
                readOnly={this.state.readOnly}
                t={t} i18n={i18n}
              />
            )}
            {shouldOpenConfirmationDialog && (
              <ConfirmationDialog
                open={shouldOpenConfirmationDialog}
                onClose={this.handleClose}
                onYesClick={this.handleConfirmDeleteItem}
                title={t("confirm_dialog.delete.title")}
                text={t('confirm_dialog.delete.text')}
                agree={t("confirm_dialog.delete.agree")}
                cancel={t("confirm_dialog.delete.cancel")}
              />
            )}
            {shouldOpenPractitionerDialog &&
              <PractitionerDialog
                handleClose={this.handleClose}
                open={shouldOpenPractitionerDialog}
                item={this.state.item}
                readOnly={this.state.readOnly}
              />
            }

            {/* {shouldOpenConfirmationDeleteListDialog && (
              <ConfirmationDialog
                open={shouldOpenConfirmationDeleteListDialog}
                onClose={this.handleClose}
                onYesClick={this.handleDeleteList}
                title={t("confirm_dialog.delete_list.title")}
                text={t('confirm_dialog.delete_list.text')}
                agree={t("confirm_dialog.delete_list.agree")}
                cancel={t("confirm_dialog.delete_list.cancel")}
              />
            )} */}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default FamilyList;
