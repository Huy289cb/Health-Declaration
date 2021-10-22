import React, { Component } from "react";
import { FormControl, Input, Radio, InputAdornment, Grid, MuiThemeProvider, IconButton, Icon, TextField, Button, TableHead, TableCell, TableRow, Checkbox, TablePagination } from "@material-ui/core";
import MaterialTable, { MTableToolbar, Chip, MTableBody, MTableHeader } from 'material-table';
import { searchByPage, getById, deleteItem } from "./HealthCareGroupService";
import HealthCareGroupEditorDialog from "./HealthCareGroupEditorDialog";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import { Link } from "react-router-dom";
import SearchIcon from '@material-ui/icons/Search';
import shortid from "shortid";
import 'react-toastify/dist/ReactToastify.css';
import 'styles/globitsStyles.css';
import { saveAs } from 'file-saver';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import 'react-toastify/dist/ReactToastify.css';
import NicePagination from "../Component/Pagination/NicePagination";
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
class HealthCareGroupTable extends Component {
  state = {
    rowsPerPage: 10,
    page: 1,
    healthCareGroupList: [],
    item: {},
    text: '',
    totalPages: 10,
    shouldOpenEditorDialog: false,
    shouldOpenConfirmationDialog: false,
    shouldOpenConfirmationDeleteAllDialog: false,
  };
  constructor(props) {
    super(props);
    this.handleTextSearchChange = this.handleTextSearchChange.bind(this);
  }

  handleTextSearchChange = event => {
    this.setState({ text: event.target.value }, function () {
    })
  };
  handleKeyDownEnterSearch = (e) => {
    if (e.key === 'Enter') {
      this.search()
    }
  }
  async handleDeleteList(list) {
    let { t } = this.props;
    let deleteSuccess = 0, deleteError = 0, error = 0;
    for (let i = 0; i < list.length; i++) {
      //   await deleteAdministrativeUnit(list[i].id).then((res) => {
      //     deleteSuccess++;
      //   }
      //   ).catch(() => {
      //     error++
      //     // this.handleDialogClose();
      //   });
    }
    if (deleteSuccess != 0) {
      toast.info(t("Xóa thành công") + " " + deleteSuccess);
    }
    if (error != 0) {
      toast.warning(t('Xóa không thành công') + " " + error);
    }
    this.updatePageData();
    this.handleDialogClose();
  }
  handleDeleteAll = (event) => {
    let { t } = this.props;
    if (this.data != null) {
      this.handleDeleteList(this.data);
    } else {
      toast.warning(t('general.select_data'));
      this.handleDialogClose();
    };
  };
  search() {
    this.setState({ page: 0 }, function () {
      this.updatePageData();
    });
  }

  setPage = (page) => {
    this.setState({ page }, function () {
      this.updatePageData();
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
  handleDialogClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationDeleteAllDialog: false,
    }, function () {
      this.updatePageData();
    });

  };

  handleDelete = id => {
    this.setState({
      id,
      shouldOpenConfirmationDialog: true
    });
  };

  handleConfirmationResponse = () => {
    let { t } = this.props;
    deleteItem(this.state.id).then(() => {
      this.updatePageData();
      this.handleDialogClose();
      toast.success(t("Xóa thành công"));
    }).catch(() => {
      toast.warning(t('Xóa không thành công'));
      this.handleDialogClose();
    });
  };

  componentDidMount() {
    this.updatePageData();
  }
  updatePageData = () => {
    var searchObject = {};
    searchObject.text = this.state.text;
    searchObject.pageIndex = this.state.page;
    searchObject.pageSize = this.state.rowsPerPage;
    searchByPage(searchObject).then(({ data }) => {
      this.setState({ healthCareGroupList: [...data.content], totalElements: data.totalElements, totalPages: data.totalPages })
    });
  }

  render() {
    const { t, i18n } = this.props;
    let {
      rowsPerPage,
      page,
      text,
      healthCareGroupList,
      shouldOpenConfirmationDialog,
      shouldOpenConfirmationDeleteAllDialog,
      shouldOpenEditorDialog,
      totalElements
    } = this.state;

    let columns = [
      {
        title: t("general.action"),
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
      {
        title: t("Mã tổ y tế"), field: "code", width: "150",
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
      },
      {
        title: t('Tên tổ y tế'), field: "name", align: "left", width: "150",
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
      },

    ]
    return (
      <div className="m-sm-30">
        <div className="mb-sm-30">
          <Helmet>
            <title>{t("Tổ y tế")} | {t("web_site")}</title>
          </Helmet>
          <Breadcrumb routeSegments={[{ name: t("Danh mục"), path: "/directory/apartment" }, { name: t('Tổ y tế') }]} />
        </div>
        <Grid container spacing={3}>
          <Grid item lg={7} md={7} sm={12} xs={12}>
            <Button
              className="mb-16 mr-16 btn btn-success d-inline-flex"
              startIcon={<AddIcon />}
              variant="contained"
              onClick={() => {
                this.setState({ shouldOpenEditorDialog: true, item: {} })
                //this.handleEditItem({ startDate: new Date(), endDate: new Date() });
              }
              }
            >
              {t('general.button.add')}
            </Button>
          </Grid>
          <Grid item lg={5} md={5} sm={12} xs={12} >
            <FormControl fullWidth>
              <Input
                className='mt-10 search_box w-100 stylePlaceholder'
                type="text"
                name="text"
                value={text}
                onChange={this.handleTextSearchChange}
                onKeyDown={this.handleKeyDownEnterSearch}
                placeholder={t('Tìm kiếm')}
                id="search_box"
                startAdornment={
                  <InputAdornment >
                    <Link to="#"> <SearchIcon
                      onClick={() => this.search()}
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "0"
                      }} /></Link>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <MaterialTable
              title={t('List')}
              data={this.state.healthCareGroupList}
              columns={columns}

              parentChildData={(row, rows) => {
                var list = rows.find(a => a.id === row.parentId);
                return list;
              }}
              options={{
                selection: true,
                actionsColumnIndex: -1,
                paging: false,
                search: false,
                rowStyle: (rowData, index) => ({
                  backgroundColor: (index % 2 === 1) ? '#EEE' : '#FFF',
                }),
                maxBodyHeight: '450px',
                minBodyHeight: '370px',
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
              <HealthCareGroupEditorDialog
                handleClose={this.handleDialogClose}
                open={shouldOpenEditorDialog}
                item={this.state.item}
                t={t} i18n={i18n}
              />
            )}

            {shouldOpenConfirmationDialog && (
              <ConfirmationDialog
                open={shouldOpenConfirmationDialog}
                onClose={this.handleDialogClose}
                onYesClick={this.handleConfirmationResponse}
                title={t("confirm_dialog.delete.title")}
                text={t('confirm_dialog.delete.text')}
                agree={t("confirm_dialog.delete.agree")}
                cancel={t("confirm_dialog.delete.cancel")}
              />
            )}
            {shouldOpenConfirmationDeleteAllDialog && (
              <ConfirmationDialog
                open={shouldOpenConfirmationDeleteAllDialog}
                onClose={this.handleDialogClose}
                //onYesClick={this.handleDeleteAll}
                title={t("confirm_dialog.delete.title")}
                text={t('confirm_dialog.delete.text')}
                agree={t("confirm_dialog.delete.agree")}
                cancel={t("confirm_dialog.delete.cancel")}
              />
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default HealthCareGroupTable;
