import { Button, FormControl, Grid, Icon, IconButton, Input, InputAdornment, TablePagination } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import { Breadcrumb, ConfirmationDialog } from "egret";
import MaterialTable from 'material-table';
import React, { Component } from "react";
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'styles/globitsStyles.css';
import BackgroundDiseaseEditorDialog from "./BackgroundDiseaseEditorDialog";
import { deleteItem, getById, searchByPage } from "./BackgroundDiseaseService";
import NicePagination from '../Component/Pagination/NicePagination';

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
class BackgroundDiseaseTable extends Component {
  state = {
    rowsPerPage: 10,
    page: 1,
    backgroundDiseaseList: [],
    item: {},
    keyword: '',
    shouldOpenEditorDialog: false,
    shouldOpenConfirmationDialog: false,
    shouldOpenConfirmationDeleteAllDialog: false,
  };
  constructor(props) {
    super(props);
    this.handleTextSearchChange = this.handleTextSearchChange.bind(this);
  }

  handleTextSearchChange = event => {
    this.setState({ keyword: event.target.value }, function () {
    })
  };
  handleKeyDownEnterSearch = (e) => {
    if (e.key === 'Enter') {
      this.search()
    }
  }
  handleDeleteList = () => {
    let { t } = this.props;    
    let listId = this.data.map(element => element.id);

    this.deleteList(listId).then(success => {
      if(success !== 0){
        toast.info(`Xóa thành công ${success}/${listId.length} bản ghi`);
        this.updateData();
      } else {
        toast.error(t('toast.delete_error'))
      }

      this.handleDialogClose();
    })
  }

  deleteList = async(listId) => {
    let success = 0;
    let error = 0;

    for(let id of listId){
      await deleteItem(id).then(response => {
        success++;
      }).catch(() => {
        error++;
      });
    }

    return success;
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
    this.setState({ page: 1 }, function () {
      var searchObject = {};
      searchObject.text = this.state.keyword;
      searchObject.pageIndex = this.state.page;
      searchObject.pageSize = this.state.rowsPerPage;
      searchByPage(searchObject).then(({ data }) => {
        this.setState({ backgroundDiseaseList: [...data.content], totalElements: data.totalElements, totalPages: data.totalPages})
      });
    
    });
  }

  setRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value, page: 1 }, function () {
      this.search();
    })
  };

  handleChangePage = (event, newPage) => {
    this.updateData(newPage);
  };
  updateData(pageNumber){
    this.setState({ page: pageNumber }, function () {
      var searchObject = {};
      searchObject.text = this.state.keyword;
      searchObject.pageIndex = this.state.page;
      searchObject.pageSize = this.state.rowsPerPage;
      searchByPage(searchObject, this.state.page, this.state.rowsPerPage).then(({ data }) => {
        this.setState({ backgroundDiseaseList: [...data.content], totalElements: data.totalElements, totalPages: data.totalPages})
      });
    });
  }
  handleDialogClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationDeleteAllDialog: false,
    }, function(){
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
      toast.error(t('toast.delete_error'))
      this.handleDialogClose();
    });
  };
 
  componentDidMount() {
    this.updatePageData();
  }
  updatePageData = () => {
    var searchObject = {};
    searchObject.keyword = this.state.keyword;
    searchObject.pageIndex = this.state.page;
    searchObject.pageSize = this.state.rowsPerPage;
    searchByPage(searchObject).then(({ data }) => {
      this.setState({ backgroundDiseaseList: [...data.content], totalElements: data.totalElements, totalPages: data.totalPages })
    });
  }

  render() {
    const { t, i18n } = this.props;
    let {
      rowsPerPage,
      page,
      keyword,
      backgroundDiseaseList,
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
        title: t("Mã bệnh nền"), field: "code", width: "150",
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
        title: t('Tên bệnh nền'), field: "name", align: "left", width: "150",
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
        title: t('Mô tả'), field: "description", align: "left", width: "150",
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
            <title>{t("Bệnh nền")} | {t("web_site")}</title>
          </Helmet>
          <Breadcrumb routeSegments={[{ name: t("Danh mục"), path: "/directory/apartment" }, { name: t('Bệnh nền') }]} />
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
            <Button
                className="mb-16 mr-16 btn btn-warning d-inline-flex"
                variant="contained"
                startIcon={<DeleteIcon />}
                onClick={() =>  this.setState({ shouldOpenConfirmationDeleteAllDialog: true })}>
                {t('general.button.delete')}
            </Button>
          </Grid>
          <Grid item lg={5} md={5} sm={12} xs={12} >
            <FormControl fullWidth>
              <Input
                className='mt-10 search_box w-100 stylePlaceholder'
                type="text"
                name="keyword"
                value={keyword}
                onChange={this.handleTextSearchChange}
                onKeyDown={this.handleKeyDownEnterSearch}
                placeholder={t('Tìm kiếm')}
                id="search_box"
                startAdornment={
                  <InputAdornment >
                    <Link to="#"> <SearchIcon
                      onClick={() => this.search(keyword)}
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
              data={this.state.backgroundDiseaseList}
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
              totalPages={ this.state.totalPages }
              handleChangePage={ this.handleChangePage }
              setRowsPerPage={ this.setRowsPerPage }
              pageSize={ this.state.rowsPerPage }
              pageSizeOption={ [1, 2, 3, 5, 10, 25, 1000] }
              t={ t }
              totalElements={ this.state.totalElements }
              page={ this.state.page }
            />

            {shouldOpenEditorDialog && (
              <BackgroundDiseaseEditorDialog
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
                onYesClick={this.handleDeleteList}
                title={t("confirm_dialog.delete.title")}
                text={t('confirm_dialog.delete.list')}
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

export default BackgroundDiseaseTable;
