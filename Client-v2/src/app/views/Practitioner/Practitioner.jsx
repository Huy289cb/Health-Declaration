import React, { Component } from "react";
import {
  Grid,
  IconButton,
  Icon,
  TablePagination,
  Button,
  InputAdornment,
  FormControl,
  Input, TextField
} from "@material-ui/core";
import MaterialTable, { MTableToolbar, Chip, MTableBody, MTableHeader } from 'material-table';
import { deleteItem, searchByPage, getItemById, searchByDto, getById, getAllInfoByUserLogin } from "./PractitionerService";
import PractitionerEditorDialog from "./PractitionerEditorDialog";
import { searchByPage as getHealthCareGroup } from "../HealthCareGroup/HealthCareGroupService";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import { saveAs } from 'file-saver';
import { Link } from "react-router-dom";
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from "@material-ui/lab/Autocomplete";
import NicePagination from '../Component/Pagination/NicePagination';
import AddIcon from '@material-ui/icons/Add';
import appConfig from "app/appConfig";
import 'styles/globitsStyles.css';
import { toast } from "react-toastify";
function MaterialButton(props) {
  const { t, i18n } = useTranslation();
  const item = props.item;
  const id = props.id
  return <div>
    {id != null && (<IconButton size="small" onClick={() => props.onSelect(item, 0)}>
      <Icon fontSize="small" color="primary">edit</Icon>
    </IconButton>)}
    <IconButton size="small" onClick={() => props.onSelect(item, 1)}>
      <Icon fontSize="small" color="error">delete</Icon>
    </IconButton>
  </div>;
}

class Practitioner extends Component {
  state = {
    keyword: '',
    rowsPerPage: 10,
    page: 1,
    eQAHealthOrgType: [],
    item: {},
    shouldOpenEditorDialog: false,
    shouldOpenConfirmationDialog: false,
    selectAllItem: false,
    selectedList: [],
    totalElements: 0,
    shouldOpenConfirmationDeleteAllDialog: false
  };

  changeSelected = (value, source) => {
    if (source === "healthCareGroup") {
      this.setState({ healthCareGroupId: value ? (value.id ? value.id : null) : null }, () => {
        this.updatePageData();
      })
    }
  }
  handleTextChange = event => {
    this.setState({ keyword: event.target.value }, function () {
    })
  };

  handleKeyDownEnterSearch = e => {
    if (e.key === 'Enter') {
      this.search();
    }
  };

  setPage = page => {
    this.setState({ page }, function () {
      this.updatePageData();
    })
  };

  setRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value, page: 1 }, function () {
      this.updatePageData();
    });
  };

  handleChangePage = (event, newPage) => {
    this.setPage(newPage);
  };

  search() {
    this.setState({ page: 1 }, function () {
      var searchObject = {};
      searchObject.text = this.state.keyword;
      searchObject.pageIndex = this.state.page;
      searchObject.pageSize = this.state.rowsPerPage;
      searchObject.healthCareGroupId = this.state.healthCareGroupId;
      searchByDto(searchObject).then(({ data }) => {
        this.setState({ itemList: [...data.content], totalElements: data.totalElements, totalPages: data.totalPages })
      });
    });
  }

  updatePageData = () => {
    var searchObject = {};
    searchObject.text = this.state.keyword;
    searchObject.pageIndex = this.state.page;
    searchObject.pageSize = this.state.rowsPerPage;
    searchObject.healthCareGroupId = this.state.healthCareGroupId;
    searchByDto(searchObject).then(({ data }) => {
      this.setState({ itemList: [...data.content], totalElements: data.totalElements, totalPages: data.totalPages })
    });
  };

  handleDownload = () => {
    var blob = new Blob(["Hello, world!"], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "hello world.txt");
  }
  handleDialogClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationDeleteAllDialog: false
    });
  };

  handleOKEditClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false
    });
    this.updatePageData();
  };

  handleDeletePractitioner = id => {
    this.setState({
      id,
      shouldOpenConfirmationDialog: true
    });
  };

  handleEditPractitioner = item => {
    getById(item.id).then((result) => {
      this.setState({
        item: result.data,
        shouldOpenEditorDialog: true
      });
    });
  };

  handleConfirmationResponse = () => {
    deleteItem(this.state.id).then(() => {
      this.updatePageData();
      this.handleDialogClose();
      toast.success("???? xo?? b???n ghi");
    }).catch(() => {
      toast.warn("C?? l???i x???y ra, vui l??ng th??? l???i sau");
    });
  };

  componentDidMount() {
    let searchObject = { pageIndex: 0, pageSize: 10000 }
    getHealthCareGroup(searchObject).then(({ data }) => {
      // console.log(data.content);
      if (data && data.content) {
        this.setState({ listHealthCareGroup: data.content });
      }
    })
    this.updatePageData();
  }

  handleEditItem = item => {
    this.setState({
      item: item,
      shouldOpenEditorDialog: true
    });
  };

  handleDelete = id => {
    this.setState({
      id,
      shouldOpenConfirmationDialog: true
    });
  };

  async handleDeleteList(list) {
    for (var i = 0; i < list.length; i++) {
      await deleteItem(list[i].id);
    }
  }

  handleDeleteAll = (event) => {
    //alert(this.data.length);
    this.handleDeleteList(this.data).then(() => {
      this.updatePageData();
      this.handleDialogClose();
    }
    );
  };

  genType = (type) => {
    let name = "";
    appConfig.PRACTITIONER_TYPE_CONST.map((item) => {
      if (item.value === type) {
        name = item.display
      }
    })
    return name;
  }

  render() {
    const { t, i18n } = this.props;
    let {
      keyword,
      rowsPerPage,
      page,
      totalElements,
      itemList,
      item,
      listHealthCareGroup,
      shouldOpenConfirmationDialog,
      shouldOpenEditorDialog,
      shouldOpenConfirmationDeleteAllDialog
    } = this.state;

    let columns = [

      {
        title: "STT",
        headerStyle: {
          minWidth: "20px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "20px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        render: rowData => (this.state.page - 1) * this.state.rowsPerPage + rowData.tableData.id + 1
      },
      {
        title: t("user.username"), field: "user.username", width: "150",
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
        title: t("user.display_name"), field: "displayName", width: "150",
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
        title: t("user.email"), field: "email", align: "left", width: "150",
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
        title: "T??? y t???", field: "healthCareGroup.name", align: "left", width: "150",
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
        title: "Ph??n lo???i", align: "left", width: "150",
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
        render: rowData => this.genType(rowData.type)
      },
      {
        title: "Thao t??c",
        field: "custom",
        align: "left",
        width: "250",
        render: rowData => <MaterialButton item={rowData} id={rowData.id ? rowData.id : null}
          onSelect={(rowData, method) => {
            if (method === 0) {
              getById(rowData.id).then(({ data }) => {
                if (data.parent === null) {
                  data.parent = {};
                }
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
    ];

    return (
      <div className="m-sm-30">

        <div className="mb-sm-30">
          <Breadcrumb routeSegments={[{ name: t('practitioner.title') }]} />
        </div>

        <Grid container spacing={3}>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Button
              className="mb-16 mr-16 btn btn-success d-inline-flex"
              startIcon={<AddIcon />}
              variant="contained"
              onClick={() => {
                this.handleEditItem({ startDate: new Date(), endDate: new Date(), isAddNew: true });
              }
              }
            >
              Th??m m???i
            </Button>

          </Grid>
          <Grid item md={3} lg={3} sm={12} xs={12}>
            <Autocomplete
              options={listHealthCareGroup ? listHealthCareGroup : []}
              getOptionLabel={(option) => option.name}
              id="healthCareGroup"
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  size="small"
                  label="T??? y t???"
                  className="input"
                />
              )}
              onChange={(event, value) => { this.changeSelected(value, "healthCareGroup") }}
            />
          </Grid>
          <Grid item lg={3} md={3} sm={12} xs={12} >
            <FormControl fullWidth>
              <Input
                className='search_box w-100 stylePlaceholder'
                style={{marginTop: "13px"}}
                type="text"
                name="keyword"
                value={keyword}
                onChange={this.handleTextChange}
                onKeyDown={this.handleKeyDownEnterSearch}
                placeholder={t('T??m ki???m')}
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
            <div>
              {shouldOpenEditorDialog && (
                <PractitionerEditorDialog t={t} i18n={i18n}
                  handleClose={this.handleDialogClose}
                  open={shouldOpenEditorDialog}
                  handleOKEditClose={this.handleOKEditClose}
                  item={item}
                />
              )}

              {shouldOpenConfirmationDialog && (
                <ConfirmationDialog
                  title="X??c nh???n xo??"
                  open={shouldOpenConfirmationDialog}
                  onClose={this.handleDialogClose}
                  onYesClick={this.handleConfirmationResponse}
                  text="B???n c?? ch???c ch???n mu???n xo?? b???n ghi n??y?"
                  cancel="Hu???"
                  agree="Xo??"
                />
              )}
            </div>
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
                maxBodyHeight: "440px",
                headerStyle: {
                  backgroundColor: "#3366ff",
                  color: "#fff",
                },
                // tableLayout: 'fixed',
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
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Practitioner;
