import { Grid, Collapse, Button, Radio, Dialog, DialogActions } from "@material-ui/core";
import React from "react";
import MaterialTable, { MTableToolbar } from 'material-table';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Draggable from 'react-draggable';
import Paper from '@material-ui/core/Paper';
import { searchByPage } from "./Service";
import { Link } from "react-router-dom";
import SearchIcon from '@material-ui/icons/Search';
import NicePagination from "../Component/Pagination/NicePagination";
import FilterListIcon from "@material-ui/icons/FilterList";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Filter from "./Filter";
import SearchInput from '../Component/SearchInput/SearchInput';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}
class SelectHealthOrganization extends React.Component{
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  state = {
    rowsPerPage: 5,
    page: 1,
    data: [],
    totalElements: 0,
    itemList: [],
    shouldOpenEditorDialog: false,
    shouldOpenConfirmationDialog: false,
    selectedItem: {},
    keyword: '',
    shouldOpenProductDialog: false,
    item: null,
  };

  setPage = page => {
    this.setState({ page }, function () {
      this.updatePageData();
    })
  };

  setRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value, page: 0 }, function () {
      this.search();
    })
  };

  handleChangePage = (event, newPage) => {
    this.setPage(newPage);
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

  componentDidMount() {
    this.updatePageData();

  }

  handleClick = (event, item) => {
    //alert(item);
    if (item.id != null) {
      this.setState({ selectedValue: item.id, selectedItem: item });
    } else {
      this.setState({ selectedValue: null, selectedItem: null });
    }
  }

  componentWillMount() {
    let { open, handleClose, selectedItem } = this.props;
    if(selectedItem != null && selectedItem.id != null){
        this.setState({ selectedValue: selectedItem.id });
    }
  }

  handleKeyDownEnterSearch = e => {
    if (e.key === 'Enter') {
      this.search();
    }
  };

  handleChange = (event, source) => {
    event.persist();
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleOpenProductDialog = () => {
    this.setState({
      shouldOpenProductDialog: true
    })
  }

  handleDialogProductClose = () => {
    this.setState({
      shouldOpenProductDialog: false
    })
  }

  handleOKEditClose = () => {
    this.setState({
      shouldOpenProductDialog: false
    });
    this.updatePageData();
  };

  onClickRow = (selectedRow) => {
    document.querySelector(`#radio${selectedRow.id}`).click();
  }

  handleCollapseFilter = () => {
    let { checkedFilter } = this.state;
    this.setState({ checkedFilter: !checkedFilter });
  };

  render() {
    const { t, i18n, handleClose, handleSelect, selectedItem, open, itemConvertList } = this.props;
    let {
      itemList,
      checkedFilter
    } = this.state;
    let columns = [
      {
        title: t("Ch???n"),
        field: "custom",
        align: "left",
        width: "250",
        render: rowData => <Radio id={`radio${rowData.id}`} name="radSelected" value={rowData.id} checked={this.state.selectedValue === rowData.id} onClick={(event) => this.handleClick(event, rowData)}
        />
      },
      {
          title: t('STT'),
          field: "custom",
          width: '150',
          render: (rowData) => {
              return rowData.tableData.id + 1
          }
      },
        {
          title: t('M??'),
          field: "code",
          width: '150'
        },
        {
          title: t('T??n'),
          field: "name",
          width: '100'
        },
        {
          title: t('????n v??? h??nh ch??nh'),
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
      ]
    return (
      <Dialog onClose={handleClose} open={open} PaperComponent={PaperComponent} maxWidth={'md'} fullWidth>
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          <span className="mb-20">{""}</span>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item lg={6} md={6} sm={12} sx={12}>

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
              onRowClick={((evt, selectedRow) => this.onClickRow(selectedRow))}
              parentChildData={(row, rows) => {
                var list = rows.find(a => a.id === row.parentId);
                return list;
              }}
              options={{
                toolbar: false,
                selection: false,
                actionsColumnIndex: -1,
                paging: false,
                search: false
              }}
              components={{
                Toolbar: props => (
                  <div style={{ width: "100%" }}>
                    <MTableToolbar {...props} />
                  </div>
                ),
              }}
              onSelectionChange={(rows) => {
                this.data = rows;
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
        </DialogContent>
        <DialogActions>
          <Button
            className="mb-16 mr-36 align-bottom"
            variant="contained"
            color="secondary"
            onClick={() => handleClose()}
          >
            {t('H???y')}</Button>
          <Button className="mb-16 mr-16 align-bottom"
            variant="contained"
            color="primary"
            onClick={() => handleSelect(this.state.selectedItem)}
          >
            {t('Ch???n')}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
export default SelectHealthOrganization;