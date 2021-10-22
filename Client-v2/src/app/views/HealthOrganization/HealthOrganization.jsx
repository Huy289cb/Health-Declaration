import { Button, Collapse, Grid, Icon, IconButton } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import FilterListIcon from "@material-ui/icons/FilterList";
import localStorageService from "app/services/localStorageService";
import { Breadcrumb, ConfirmationDialog } from "egret";
import MaterialTable from 'material-table';
import React, { Component } from "react";
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'styles/globitsStyles.css';
import NicePagination from '../Component/Pagination/NicePagination';
import SearchInput from '../Component/SearchInput/SearchInput';
import Filter from "./Filter";
import HealthOrganizationEditorDialog from "./HealthOrganizationEditorDialog";
import { deleteById, getById, searchByPage } from "./Service";
toast.configure({
  autoClose: 2000,
  draggable: false,
  limit: 3
});

function MaterialButton(props) {
  const { t, i18n } = useTranslation();
  const { item } = props;
  return <div>
    <IconButton size="small" onClick={() => props.onSelect(item, 0)}>
      <Icon fontSize="small" color="primary">edit</Icon>
    </IconButton>
    <IconButton size="small" onClick={() => props.onSelect(item, 1)}>
      <Icon fontSize="small" color="error">delete</Icon>
    </IconButton>
  </div>;
}
class HealthOrganization extends Component {
  state = {
    rowsPerPage: 10,
    page: 1,
    keyword: '',
    // totalPages: 10,
    shouldOpenEditorDialog: false,
    shouldOpenConfirmationDialog: false,
    shouldOpenConfirmationDeleteListDialog: false,
  };

  updatePageData = (item) => {
    var searchObject = {};
    if (item != null) {
      this.setState({
        page: 1,
        text: item.text,
        administrativeUnitId: item.administrativeUnitId
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
    }, () => {
      this.updatePageData();
    });
  };

  handleEditItem = item => {
    this.setState({
        item: item,
        shouldOpenEditorDialog: true
    });
  };
  //handle popup open/close end

  //handle delete start
  handleDeleteList = async (list) => {
    let listAlert = [];
    let { t } = this.props;
    for (var i = 0; i < list.length; i++) {
      try {
        await deleteById(list[i].id);
      } catch (error) {
        listAlert.push(list[i].name);
      }
    }
    this.handleClose()
    toast.success(t('toast.delete_success'));
  };
  
  handleDeleteListItem = (event) => {
    let { t } = this.props
    if (this.data != null) {
      this.handleDeleteList(this.data).then(() => {
        this.updatePageData();
      })
    } else {
      toast.warning(t('toast.please_select'));
    };
  }

  handleConfirmDeleteItem = () => {
    let { t } = this.props;
    deleteById(this.state.id).then(({data}) => {
      if (data) {
        this.updatePageData();
        this.handleClose();
        toast.success(t('toast.delete_success'));
      }
      else{
        toast.error('Không thể xóa vì đã có dữ liệu cập nhật thông tin sức khỏe.');
        this.updatePageData();
      }
    }).catch(() => {
      toast.error('Không thể xóa vì đã có dữ liệu cập nhật thông tin sức khỏe.');
    });

    this.handleClose();
  };

  handleDelete = id => {
    this.setState({
      id,
      shouldOpenConfirmationDialog: true
    });
  };
  //handle delete end

  componentDidMount() {
    this.updatePageData();
    this.setState({role: localStorageService.getItem("role")});
  }

  handleCollapseFilter = () => {
    let { checkedFilter } = this.state;
    this.setState({ checkedFilter: !checkedFilter });
  };

  render() {
    const { t, i18n } = this.props;
    let {
      itemList,
      shouldOpenConfirmationDialog,
      shouldOpenConfirmationDeleteListDialog,
      shouldOpenEditorDialog,
      role,
      checkedFilter
    } = this.state;

    let columns = [
    {
        title: t('STT'),
        field: "custom",
        width: '150',
        render: (rowData) => (this.state.page - 1) * this.state.rowsPerPage + rowData.tableData.id + 1
    },
      {
        title: t('Mã'),
        field: "code",
        width: '150'
      },
      {
        title: t('Tên'),
        field: "name",
        width: '100'
      },
      {
        title: t('Đơn vị hành chính'),
        field: "administrativeUnit.name",
        width: '100',
        render: (rowData) => {
          let str = "";
          if (rowData.administrativeUnit){
            str = rowData.administrativeUnit.name;
            if (rowData.administrativeUnit.parent && rowData.administrativeUnit.parent.name) {
              str += " - " + rowData.administrativeUnit.parent.name;
            }
          }
          return str;
        }
      },
      {
        title: t("general.action"),
        field: "custom",
        width: '100',
        type: 'numeric',
        render: rowData => <MaterialButton item={rowData}
          onSelect={(rowData, method) => {
            if (method === 0) {
              getById(rowData.id).then(({ data }) => {
                this.setState({
                  item: data,
                  shouldOpenEditorDialog: true
                });
              })
            } else if (method === 1) {
              this.handleDelete(rowData.id);
            } else {
              alert('Call Selected Here:' + rowData.id);
            }
          }}
        />
      },
    ]
    return (
      <div className="m-sm-30">
        <div className="mb-sm-30">
          <Breadcrumb routeSegments={[{ name: t('Đơn vị y tế') }]} />
        </div>
        <Grid container spacing={3}>

          <Grid item md={6} sm={12}>
            <>
              <Button
                className="mb-16 mr-16 btn btn-success d-inline-flex"
                startIcon={<AddIcon />}
                variant="contained"
                onClick={() => {
                  this.handleEditItem({ startDate: new Date(), endDate: new Date() });
                }
                }
              >
                {t('general.button.add')}
              </Button>
              {/* <Button
                className="mb-16 mr-16 btn btn-warning d-inline-flex"
                variant="contained"
                startIcon={<DeleteIcon />}
                onClick={() => this.setState({ shouldOpenConfirmationDeleteListDialog: true })}>
                {t('general.button.delete')}
              </Button> */}

              {shouldOpenConfirmationDeleteListDialog && (
                <ConfirmationDialog
                  open={shouldOpenConfirmationDeleteListDialog}
                  onConfirmDialogClose={this.handleClose}
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
            <Grid container spacing={2} style={{display: "flex", justifyContent: "flex-end"}}>
              <Grid item lg={8} md={8} sm={6} xs={6}>
                  <SearchInput
                      search={this.updatePageData}
                      t={t}
                  />
              </Grid>
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
              </Grid>
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
                      t={t}
                  />
              </Collapse>
          </Grid>)}
          <Grid item xs={12}>
            <MaterialTable
              data={itemList}
              columns={columns}
              options={{
                selection: false,
                actionsColumnIndex: -1,
                paging: false,
                search: false,
                toolbar: false,
                maxBodyHeight: "440px",
                headerStyle: {
                  backgroundColor: "#3366ff",
                  color: "#fff",
                },
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
              <HealthOrganizationEditorDialog
                handleClose={this.handleClose}
                open={shouldOpenEditorDialog}
                updatePageData={this.updatePageData}
                item={this.state.item}
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

            {shouldOpenConfirmationDeleteListDialog && (
              <ConfirmationDialog
                open={shouldOpenConfirmationDeleteListDialog}
                onClose={this.handleClose}
                onYesClick={this.handleDeleteList}
                title={t("confirm_dialog.delete_list.title")}
                text={t('confirm_dialog.delete_list.text')}
                agree={t("confirm_dialog.delete_list.agree")}
                cancel={t("confirm_dialog.delete_list.cancel")}
              />
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default HealthOrganization;
