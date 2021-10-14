import { Button, Grid, Icon, IconButton } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import { Breadcrumb, ConfirmationDialog } from "egret";
import MaterialTable from 'material-table';
import React, { Component } from "react";
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'styles/globitsStyles.css';
import NicePagination from '../Component/Pagination/NicePagination';
import SearchInput from '../Component/SearchInput/SearchInput';
import { getAllInfoByUserLogin } from "../User/UserService";
import FamilyMemberEditorDialog from "./FamilyMemberEditorDialog";
import { deleteItem, getById, searchByDto } from "./FamilyMemberService";
import localStorageService from "app/services/localStorageService";
toast.configure({
  autoClose: 2000,
  draggable: false,
  limit: 3
});

function MaterialButton(props) {
  const { t, i18n } = useTranslation();
  const { item, isEdit, isDelete, isView } = props;
  return <div>
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
class FamilyMember extends Component {
  state = {
    rowsPerPage: 10,
    page: 1,
    keyword: '',
    totalPages: 10,
    shouldOpenEditorDialog: false,
    shouldOpenConfirmationDialog: false,
    isEdit: false,
    isDelete: false,
    isView: false,
    readOnly: false,
  };

  updatePageData = (item) => {
    var searchObject = {};
    if (item != null) {
      this.setState({
        page: 1,
        text: item.text,
        orgType: item.orgType,
      }, () => {
        searchObject.text = this.state.text;
        searchObject.pageIndex = this.state.page;
        searchObject.pageSize = this.state.rowsPerPage;
        searchObject.orgType = this.state.orgType
        searchByDto(searchObject).then(({ data }) => {
          this.setState({
            itemList: [...data.content],
            totalElements: data.totalElements,
            totalPages: data.totalPages
          })
          var treeValues = [];

          let itemListClone = [...data.content];

          itemListClone.forEach(item => {
            var items = this.getListItemChild(item);
            treeValues.push(...items);
          })
        }
        );
      })
    } else {
      searchObject.text = this.state.text;
      searchObject.pageIndex = this.state.page;
      searchObject.pageSize = this.state.rowsPerPage;
      searchObject.orgType = this.state.orgType
      searchByDto(searchObject).then(({ data }) => {
        this.setState({
          itemList: [...data.content],
          totalElements: data.totalElements,
          totalPages: data.totalPages
        })
        var treeValues = [];

        let itemListClone = [...data.content];

        itemListClone.forEach(item => {
          var items = this.getListItemChild(item);
          treeValues.push(...items);
        })
      }
      );
    }
  };


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
      shouldOpenConfirmationDialog: false
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
  async handleDeleteList(list) {
    let listAlert = [];
    let { t } = this.props
    for (var i = 0; i < list.length; i++) {
      try {
        await deleteItem(list[i].id);
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
    deleteItem(this.state.id).then(({ data }) => {
      if (data) {
        this.updatePageData();
        this.handleClose();
        toast.success(t('toast.delete_success'));
      }
      else {
        toast.warn(t('Không thể xóa chủ hộ hoặc thành viên đã có dữ liệu cập nhật thông tin sức khỏe.'));
        this.updatePageData();
        this.handleClose();
      }
    });
  };
  handleDelete = id => {
    this.setState({
      id,
      shouldOpenConfirmationDialog: true
    });
  };
  //handle delete end

  getListItemChild(item) {
    var result = [];
    var root = {};
    root.name = item.name;
    root.code = item.code;
    root.id = item.id;
    root.description = item.description;
    root.displayOrder = item.displayOrder;
    root.foundedDate = item.foundedDate;
    root.parentId = item.parentId;
    result.push(root);
    if (item.children) {
      item.children.forEach(child => {
        var childs = this.getListItemChild(child);
        result.push(...childs);
      });
    }
    return result;
  }

  componentDidMount() {
    this.updatePageData();
    this.setState({ role: localStorageService.getItem("role") });
  }

  componentWillMount() {
    getAllInfoByUserLogin().then((resp) => {
      let data = resp ? resp.data : null;
      if (data) {
        if (data.admin) {
          this.setState({ isEdit: true, isDelete: true, isView: true }, () => {
        this.updatePageData();
          });
        }
        if (data.healthCareStaff) {
          this.setState({ isEdit: false, isDelete: false, isView: true }, () => {
        this.updatePageData();
          });
        }
        if (data.user || data.medicalTeam) {
          this.setState({ isEdit: true, isDelete: false, isView: true }, () => {
        this.updatePageData();
          });
        }
  
        this.updatePageData();
      }
    })
  }

  render() {
    const { t, i18n } = this.props;
    let {
      itemList, shouldOpenConfirmationDialog, isDelete, isView, isEdit,readOnly, shouldOpenEditorDialog, role
    } = this.state;

    let columns = [
      {
        title: "STT", width: "10",
        headerStyle: {
          minWidth: "50px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "50px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        }, render: rowData => (this.state.page - 1) * this.state.rowsPerPage + rowData.tableData.id + 1
      },
      {
        title: t('FamilyMember.headOfHousehold'), field: "", align: "left", width: "150",
        render: (rowData) =>
          rowData.family ? (
            <span>
              {rowData.family.name}
            </span>
          ) : (
            ""
          ),
      },
      {
        title: t('FamilyMember.fullName'), field: "", align: "left", width: "150",
        render: (rowData) =>
          rowData.member ? (
            <span>
              {rowData.member.displayName}
            </span>
          ) : (
            ""
          ),
      },
      { title: t('FamilyMember.relationship'), field: "relationship" },
      {
        title: t('FamilyMember.healthInsuranceCardNumber'), field: "",
        render: (rowData) =>
          rowData.member ? (
            <span>
              {rowData.member.healthInsuranceCardNumber}
            </span>
          ) : (
            ""
          ),
      },
      {
        title: t("general.action"),
        field: "custom",
        width: "250",
        headerStyle: {
          minWidth: "50px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "50px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        render: rowData => <MaterialButton item={rowData} isDelete={isDelete} isEdit={isEdit} isView={isView}
          onSelect={(rowData, method) => {
            if (method === 0) {
              getById(rowData.id).then(({ data }) => {
                this.setState({
                  item: data,
                  readOnly:false,
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
                  readOnly:true,
                  shouldOpenEditorDialog: true
                });
              })
            }
            else {
              alert('Call Selected Here:' + rowData.id);
            }
          }}
        />
      }

    ]
    return (
      <div className="m-sm-30">
        <div className="mb-sm-30">
          <Breadcrumb routeSegments={[{ name: t('FamilyMember.title') }]} />
        </div>
        <Grid container spacing={3}>

          <Grid item md={6} sm={12}>

            <>
            {role !== "ROLE_HEALTHCARE_STAFF" &&
              <Button
                className="mb-16 mr-16 btn btn-success d-inline-flex"
                startIcon={<AddIcon />}
                variant="contained"
                onClick={() => {
                  this.handleEditItem({ member: {}, startDate: new Date(), endDate: new Date() });
                }
                }
              >
                {t('general.button.add')}
              </Button>}
            </>
          </Grid>
          <Grid item md={6} sm={12} xs={12} >
            <SearchInput
              search={this.updatePageData}
              t={t}
            />
          </Grid>
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
                maxBodyHeight: "440px",
                headerStyle: {
                  backgroundColor: "#337ab7",
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

            {shouldOpenEditorDialog && (
              <FamilyMemberEditorDialog
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
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default FamilyMember;
