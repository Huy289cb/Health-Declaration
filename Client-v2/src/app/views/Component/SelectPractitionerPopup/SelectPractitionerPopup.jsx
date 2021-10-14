import { Grid, Button, Radio, Dialog, DialogActions, Collapse } from "@material-ui/core";
import React from "react";
import MaterialTable, { } from 'material-table';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Draggable from 'react-draggable';
import Paper from '@material-ui/core/Paper';
import { searchByPage } from '../../Practitioner/PractitionerService'
import SearchInput from '../SearchInput/SearchInput';
import NicePagination from '../Pagination/NicePagination';
import FilterListIcon from "@material-ui/icons/FilterList";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Filter from "./Filter";
import { toast } from "react-toastify";
toast.configure({
  autoClose: 2000,
  draggable: false,
  limit: 3,
});
function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}
class SelectPractitionerPopup extends React.Component {
  state = {
    rowsPerPage: 5,
    page: 1,
    totalElements: 0,
    totalPages: 0,
    selectedItem: {},
    keyword: '',
    item: null,
  };

  setPage = page => {
    this.setState({ page }, function () {
      this.updatePageData();
    })
  };

  setRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value, page: 1 }, function () {
      this.updatePageData();
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
        healthCareGroupId: item.healthCareGroupId,
      }, () => {

        searchObject.text = this.state.text;
        searchObject.pageIndex = this.state.page;
        searchObject.pageSize = this.state.rowsPerPage;
        searchObject.type = this.state.type;
        searchObject.healthCareGroupId = this.state.healthCareGroupId;
        if (this.props.tree) {
          searchByPage(searchObject).then(({ data }) => {
            this.setState({
              itemList: [...data.content],
              totalElements: data.totalElements,
              totalPages: data.totalPages
            })
          });
        } else {
          searchByPage(searchObject).then(({ data }) => {
            this.setState({
              itemList: [...data.content],
              totalElements: data.totalElements,
              totalPages: data.totalPages
            })
          });
        }

      });
    } else {
      searchObject.text = this.state.text;
      searchObject.pageIndex = this.state.page;
      searchObject.pageSize = this.state.rowsPerPage;
      searchObject.type = this.state.type;
      searchObject.healthCareGroupId = this.state.healthCareGroupId;
      if (this.props.tree) {
        searchByPage(searchObject).then(({ data }) => {
          this.setState({
            itemList: [...data.content],
            totalElements: data.totalElements,
            totalPages: data.totalPages
          })
        });
      } else {
        searchByPage(searchObject).then(({ data }) => {
          // console.log(searchObject)
          this.setState({
            itemList: [...data.content],
            totalElements: data.totalElements,
            totalPages: data.totalPages
          })
        });
      }
    }

  }

  componentDidMount() {
    this.updatePageData();
  }

  handleClick = (event, item) => {
    console.log(item);

    let { selectedValue } = this.state;
    if (selectedValue === item.id) {
      this.setState({ selectedValue: null, selectedItem: null })
    } else {
      this.setState({ selectedValue: item.id, selectedItem: item })
    }
  }

  componentWillMount() {
    let { practitioner, type } = this.props;
    console.log(this.props);
    if(practitioner != null && practitioner.id != null){
      this.setState({ selectedValue: practitioner.id, selectedItem: practitioner });
    }
    this.setState({type: type})
  }

  onClickRow = (selectedRow) => {
    document.querySelector(`#radio${selectedRow.id}`).click();
  }

  handleCollapseFilter = () => {
    let { checkedFilter } = this.state;
    this.setState({ checkedFilter: !checkedFilter });
  };

  render() {
    const { t, handleClose, handleSelect, open } = this.props;
    let { itemList, checkedFilter } = this.state;
    let columns = [
      {
        title: t("general.popup.select"),
        field: "custom",
        align: "left",
        width: "250",
        render: rowData =>
          <Radio
            id={`radio${rowData.id}`}
            name="radSelected"
            value={rowData.id}
            checked={this.state.selectedValue === rowData.id}
            onClick={(event) => this.handleClick(event, rowData)}
          />
      },
      // { title: t("general.popup.code"), field: "code", align: "left", width: "150" },
      { title: t("Họ tên"), field: "displayName", width: "150" },
      { title: t("Tuổi"), field: "age", width: "150" },
      { title: t("Tên tổ y tế"), field: "healthCareGroup.name", width: "150" },
      { title: t("Số điện thoại"), field: "phoneNumber", width: "150" },
    ];
    return (
      <Dialog onClose={handleClose} open={open} PaperComponent={PaperComponent} maxWidth={'md'} fullWidth>
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          <span className="mb-20">{t("Chọn nhân viên y tế")}</span>
        </DialogTitle>
        <DialogContent>
          <Grid container className="mb-16">
            <Grid item md={6}></Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
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
                selection: false,
                actionsColumnIndex: -1,
                paging: false,
                search: false,
                toolbar: false,
                maxBodyHeight: "440px",
                headerStyle: {
                  backgroundColor: "#2a80c8",
                  color: "#fff",
                },
                rowStyle: (rowData, index) => ({
                  backgroundColor: index % 2 === 1 ? 'rgb(237, 245, 251)' : '#FFF',
                }),
                // tableLayout: 'fixed'
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
              pageSizeOption={[1, 2, 3, 5, 10, 25]}
              t={t}
              totalElements={this.state.totalElements}
              page={this.state.page}
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            className="mb-16 mr-36 btn btn-secondary"
            variant="contained"
            onClick={() => handleClose()}>{t('general.button.cancel')}</Button>
          <Button
            className="mb-16 mr-16 btn btn-success"
            variant="contained"
            onClick={() => {
              let {selectedItem} = this.state;
              if (selectedItem && Object.keys(selectedItem).length > 0) {
                handleSelect(selectedItem)
              } else {
                toast.warning("Hãy chọn 1 nhân viên y tế!");
              }}}
            >
            {t('general.button.select')}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
export default SelectPractitionerPopup;