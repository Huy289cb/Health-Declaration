import {
  Button, Card, Collapse, Grid, Icon, IconButton, Table, TableCell, TableHead,
  TableRow, Tooltip, withStyles
} from "@material-ui/core";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import FilterListIcon from "@material-ui/icons/FilterList";
import MaterialTable from "material-table";
import React, { Component } from "react";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import 'styles/globitsStyles.css';
import ConstantList from "../../appConfig";
import localStorageService from "../../services/localStorageService";
import NicePagination from '../Component/Pagination/NicePagination';
import SearchInput from '../Component/SearchInput/SearchInput';
import FamilyEditorDialog from "../Family/EditorDialog";
import { getFamilyByUserLogin } from "../Family/Service";
import ConfirmationDialog from "../material-kit/dialog/ConfirmationDialog";
import Filter from "../PersonalHealthRecord/Filter";
import { searchByPage as seachPersonalHealthRecord } from "../PersonalHealthRecord/PersonalHealthRecordService";
import { getAllInfoByUserLogin } from "../User/UserService";
import { getListPatientByAdminUnit, reportByAdminUnit } from "./DashboardService";
import ViewDialog from "./ViewDialog";
import ViewListPatientDialog from "./ViewListPatientDialog";
import {getListHealthCareGroup} from "../HealthCareGroup/HealthCareGroupService";
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import ColumnChart from './charts/BasicColumn';

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 14,
    position: "absolute",
    top: "-10px",
    left: "-25px",
    width: "80px",
  },
}))(Tooltip);

function MaterialButton(props) {
  const { t, i18n } = useTranslation();
  const { item } = props;
  return <div>
    <LightTooltip
      title="Xem chi tiết"
      placement="right-end"
      enterDelay={500}
      leaveDelay={300}
      >
      <IconButton size="small" onClick={() => props.seachPersonalHealthRecordByDto(item)}>
        <Icon fontSize="small" color="primary">visibility</Icon>
      </IconButton>
    </LightTooltip>
    <LightTooltip
      title="Thăm khám"
      placement="right-end"
      enterDelay={500}
      leaveDelay={300}
      >
      <IconButton size="small" onClick={() => props.linkToEncounter(item)}>
        <Icon fontSize="small" color="primary">assignment</Icon>
      </IconButton>
    </LightTooltip>
  </div>;
}
class Analytics extends Component {
  state = {
    role: "",
    rowsPerPage: 10,
    page: 1,
    text: '',
    totalPages: 10,
    openViewDialog: false,
    shouldOpenConfirmationViewDialog: false,
    shouldOpenFamilyEditorDialog: false,
  }

  // lấy số điện thoại cấp cứu của phường và số zalo nóng của phường
  getEmegencyPhone = (administrativeUnit) => {
    if (administrativeUnit) {
      if (administrativeUnit.level != 3) {
        this.getEmegencyPhone(administrativeUnit.parent);
      } else {
        this.setState({
          emegencyPhone: administrativeUnit.emergencyPhone, 
          hotZalo: administrativeUnit.hotZalo,
        });
      }
    }
  }

  getUserAddress = (userData) => {
    let address = "";
    if (userData.detailAddress) {
      address += userData.detailAddress
    }
    if (userData.administrativeUnit && userData.administrativeUnit.name) {
      // address += this.getUserAddressByAdminUnit(userData.administrativeUnit);
      address += " - " + userData.administrativeUnit.name;
    }
    this.setState({userAddress: address});
  }

  // getUserAddressByAdminUnit = (administrativeUnit) => {
  //   let address = "";
  //   if (administrativeUnit.name) {
  //     address += ` - ${administrativeUnit.name}`;
  //   }
  //   if (administrativeUnit.parent) {
  //     address += this.getUserAddressByAdminUnit(administrativeUnit.parent);
  //   }
  //   return address;
  // }

  getFamilyData = () => {
    getFamilyByUserLogin().then(({ data }) => {
      this.getUserAddress(data);
      this.setState({ userData: data });
      if (data.administrativeUnit && data.administrativeUnit.parent) {
        this.getEmegencyPhone(data.administrativeUnit);
      }
      if (data && data.listPractitioner) {
        let userPractitionerType1 = data.listPractitioner.find((e) => e.type == 1);
        console.log(userPractitionerType1);
        if (userPractitionerType1) {
          this.setState({userPractitionerType1});
        }
        let userPractitionerType2 = data.listPractitioner.find((e) => e.type == 2);
        if (userPractitionerType2) {
          this.setState({userPractitionerType2});
        }
      }

      if(data && data.listUnit){
        getListHealthCareGroup({listUnit: data.listUnit}).then(({data}) => this.setState({hotZalo: data[0].zalo, emegencyPhone: data[0].phoneNumber1}));
      }
    })
  }

  componentDidMount() {
    this.setState({ role: localStorageService.getItem("role") });
    if (localStorageService.getItem("role") === "ROLE_USER") {
      this.getFamilyData();
    }
    else{
      reportByAdminUnit(0, 0, '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', "commune").then(
        ({ data }) => {
          // debugger;
          // alert(data);
          this.setState({ reportData: data });
        
        }
      )
    }
    
    if (localStorageService.getItem("role") === "ROLE_HEALTHCARE_STAFF") {
      getAllInfoByUserLogin().then((resp) => {
        let data = resp ? resp.data : null;
        if (data) {
          this.setState({ data }, () => {
            this.updatePageData();
          });
        }
      })
    }
  }

  reportByComuneId = (id) => {
    reportByAdminUnit(0, 0, id,'00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', "quarter").then(
      ({ data }) => {        
        this.setState({ reportData: data });
      }
    )
  }
  reportByQuarterId = (id) => {
    reportByAdminUnit(0, 0,'00000000-0000-0000-0000-000000000000', id, '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', "town").then(
      ({ data }) => {        
        this.setState({ reportData: data });
      }
    )
  }
  reportByDistrict = () =>{
    reportByAdminUnit(0, 0, '00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', "commune").then(
      ({ data }) => {
        this.setState({ reportData: data });
      }
    )
  }
  getListPatientByAdminUnit = (level,comuneId, quarterId, townId) =>{
    getListPatientByAdminUnit(0, 0,level,comuneId, quarterId, townId, '00000000-0000-0000-0000-000000000000').then(
      ({ data }) => {
        let titleDialog="";
        if(level<1){
          titleDialog="Danh sách mức nguy cơ thấp";
        }else if(level==1){
          titleDialog="Danh sách mức nguy cơ trung bình";
        }else if(level==2){
          titleDialog="Danh sách mức nguy cơ cao";
        }else if(level==3){
          titleDialog="Danh sách mức nguy cơ rất cao";
        }
        this.setState({ listCasetData: data,openViewListPatientDialog:true,title:titleDialog });
    });
  }
  
  componentWillMount() {
  }

  //practitionnal table
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
  updatePageData = (item) => {
    var searchObject = { lastRecord: true };
    if (item != null) {
      this.setState({
        page: 1,
        text: item.text,
        resolveStatus: item.resolveStatus,
        type: item.type,
      }, () => {
        searchObject.text = this.state.text;
        searchObject.pageIndex = this.state.page;
        searchObject.pageSize = this.state.rowsPerPage;
        searchObject.resolveStatus = this.state.resolveStatus;
        searchObject.type = this.state.type;
        seachPersonalHealthRecord(searchObject).then(({ data }) => {
          this.setState({
            itemList: [...data.content],
            totalElements: data.totalElements,
            totalPages: data.totalPages
          })
        }
        );
      })
    } else {
      searchObject.text = this.state.text;
      searchObject.pageIndex = this.state.page;
      searchObject.pageSize = this.state.rowsPerPage;
      searchObject.resolveStatus = this.state.resolveStatus;
      searchObject.type = this.state.type;
      seachPersonalHealthRecord(searchObject).then(({ data }) => {
        this.setState({
          itemList: [...data.content],
          totalElements: data.totalElements,
          totalPages: data.totalPages,
        })
      });
    }
  };

  handleClose = () => {
    this.setState({
      openViewDialog: false,
      shouldOpenConfirmationViewDialog: false,
    }, () => {
      this.updatePageData();
    });
  };
  handleCloseListPatientDialog = () => {
    this.setState({
      openViewListPatientDialog: false
    });
  };

  seachPersonalHealthRecordByDto = (item) => {
    let searchObject = {
      pageIndex: 0, pageSize: 10,
      familyMemberId: item.familyMember ? item.familyMember.id : "",
      lastRecord: true
    }
    seachPersonalHealthRecord(searchObject).then(({ data }) => {
      if (data && data.content && data.content[0]) {
        this.setState({
          item: item,
          openViewDialog: true
        })
      } else {
        this.setState({
          shouldOpenConfirmationViewDialog: true
        })
      }
    })
  }

  linkToEncounter = (item) => {
    this.props.history.push({
      pathname: '/encounter/create',
      //search: '?query=abc',
      state: { familyMember: item ? item.familyMember : null }
    });
  }

  handleCollapseFilter = () => {
    let { checkedFilter } = this.state;
    this.setState({ checkedFilter: !checkedFilter });
  };

  render() {
    const { t, i18n, theme } = this.props;
    const { 
      data, 
      reportData,
      listCasetData, 
      title, 
      role, 
      openViewDialog, 
      shouldOpenConfirmationViewDialog,
      openViewListPatientDialog,
      userData,
      emegencyPhone,
      hotZalo,
      shouldOpenFamilyEditorDialog,
      checkedFilter,
      userPractitionerType1,
      userPractitionerType2,
    } = this.state;
    return (
      <div className="analytics m-sm-30">
        {role == "ROLE_USER" &&
          <Grid container spacing={3} style={{dipslay: "flex", justifyContent: "center"}}>
            <Grid item lg={3} md={3} sm={12} xs={12}>
              <Link to={"/create-health-record"}>
                <Card elevation={3} className="p-32 py-32 text-center h-100 click icon">
                  <div className="text-white margin-auto">
                    <div className="card-title text-white uppercase m-0">Khai báo y tế</div>
                    <div className="text-white uppercase m-0">Cập nhật thông tin sức khoẻ</div>
                  </div>
                </Card>
              </Link>
            </Grid>
            <Grid item lg={3} md={3} sm={12} xs={12}>
              <Link to={"/familyMember"}>
                <Card elevation={3} className=" p-32 py-32 text-center h-100 click icon-2">
                  <div className="text-white margin-auto">
                    <div className="card-title text-white uppercase m-0">Thành viên</div>
                    <div className="text-white uppercase m-0">Quản lý thông tin thành viên gia đình</div>
                  </div>
                </Card>
              </Link>
            </Grid>
            {emegencyPhone &&
              <Grid item lg={3} md={3} sm={12} xs={12}>
                <a href={"tel:" + emegencyPhone}>
                  <Card elevation={3} className=" p-32 py-32 text-center h-100 click icon-1">
                    <div className="text-white margin-auto">
                      <div className="card-title text-white uppercase m-0">{emegencyPhone}</div>
                      <div className="text-white uppercase m-0">Số điện thoại cấp cứu</div>
                    </div> 
                  </Card>
                </a>
              </Grid>
            }
            {hotZalo &&
              <Grid item lg={3} md={3} sm={12} xs={12}>
                <a href={"https://zalo.me/" + hotZalo}>
                  <Card elevation={3} className=" p-32 py-32 text-center h-100 click icon-3">
                    <div className="text-white margin-auto">
                      <div className="card-title text-white uppercase m-0">{hotZalo}</div>
                      <div className="uppercase m-0">Số zalo tổ y tế</div>
                    </div>
                  </Card>
                </a>
              </Grid>
            }
            {userData && <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2} style={{display: "flex", justifyContent: "center"}}>
                {(userPractitionerType1 || userPractitionerType2) &&
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <Card elevation={3} className="bgc-green-l p-32 py-32 h-100 click">
                    <div className="text-primary-d2">
                      <div className="card-title text-primary-d2 uppercase text-center">{t("Thông tin nhân viên y tế phụ trách")}</div>
                      <div className="text-center mb-16">(Giờ hỗ trợ từ 8h đến 22h. Ngoài giờ, trong trường hợp khẩn cấp hãy gọi số cấp cứu)</div>
                      <div className="card-body" style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <table className="family-details text-color">
                        {userPractitionerType2 && userPractitionerType2.practitioner &&
                          <>
                          <tr className="text-color">
                            <td>NVYT Tại chỗ:</td>
                            <td>{userPractitionerType2.practitioner.displayName}</td>
                          </tr>
                          <tr className="text-color">
                            <td><b>Điện thoại:</b></td>
                            <a href={"tel:" + userPractitionerType2.practitioner.phoneNumber}>
                              <td>
                                <Button
                                  startIcon={<Icon>call</Icon>} 
                                  variant="contained"
                                  className="btn-primary-d d-inline-flex"
                                >
                                  <b>{userPractitionerType2.practitioner.phoneNumber}</b>
                                </Button>
                              </td>
                            </a>
                          </tr>  
                          </>}
                          <tr>
                            <td colSpan={2}>
                              <hr/>
                            </td>
                          </tr>
                          {userPractitionerType1 && userPractitionerType1.practitioner &&
                          <>
                          <tr className="text-color">
                            <td>NVYT Từ xa:</td>
                            <td>{userPractitionerType1.practitioner.displayName}</td>
                          </tr>
                          <tr className="text-color">
                            <td><b>Điện thoại:</b></td>
                            <a href={"tel:" + userPractitionerType1.practitioner.phoneNumber}>
                              <td>
                                <Button
                                  startIcon={<Icon>call</Icon>}
                                  variant="contained"
                                  className="btn-primary-d d-inline-flex"
                                >
                                  <b>{userPractitionerType1.practitioner.phoneNumber}</b>
                                </Button>
                              </td>
                            </a>
                          </tr>
                          </>}
                        </table>
                      </div>
                    </div>
                  </Card>
                </Grid>}
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <Card elevation={3} className="bgc-green-l p-32 py-32 h-100 click">
                    <div className="text-primary-d2">
                      <div className="card-title text-primary-d2 uppercase text-center">Thông tin hộ gia đình</div>
                      <div className="card-body" style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <Button
                          size="small"
                          className="btn-primary d-inline-flex mb-16"
                          startIcon={<Icon>edit</Icon>}
                          variant="contained"
                          onClick={() => {
                            this.setState({
                              item: userData,
                              shouldOpenFamilyEditorDialog: true
                            });
                          }}
                        >
                          Cập nhật
                        </Button>
                        {shouldOpenFamilyEditorDialog && (
                          <FamilyEditorDialog
                            handleClose={() => {
                              this.setState({shouldOpenFamilyEditorDialog: false}, () => {
                                this.getFamilyData();
                              })
                            }}
                            open={shouldOpenFamilyEditorDialog}
                            isUser={true}
                            readOnly={false}
                            item={this.state.item}
                            t={t} i18n={i18n}
                          />
                        )}
                        <table className="family-details text-color ">
                          {/* <tr>
                            <td>Mã gia đình</td>
                            <td>{userData.code}</td>
                          </tr> */}
                          <tr style={{fontSize: "15px"}}>
                            <td> <b>Chủ hộ:</b></td>
                            <td>{userData.name}</td>
                          </tr>
                          {/* <tr>
                            <td>Tuổi:</td>
                            <td>{userData.age}</td>
                          </tr> */}
                          <tr>
                            <td><b>Số điện thoại:</b></td>
                            <td>{userData.phoneNumber}</td>
                          </tr>
                          <tr>
                            <td><b>Địa Chỉ:</b></td>
                            <td style={{maxWidth: "250px", lineBreak: "auto"}}>{userData.address}</td>
                          </tr>
                          <tr>
                            <td><b>Các thành viên:</b></td>
                            {/* <td>
                              
                              <ul>
                                {(userData.familyMembers).map((element, index) => {
                                  if (element.member.displayName != userData.name) {
                                    return (
                                      <li>{element.member.displayName}</li>
                                    )
                                  }

                                })}
                              </ul>
                            </td> */}
                          </tr>
                        </table>
                        <table className="member_table text-color" border={1}>
                          <tr>
                            <th>STT</th>
                            <th>Họ tên</th>
                            <th>Tuổi</th>
                            <th>Điện thoại</th>
                          </tr>
                          {(userData.familyMembers).map((element, index) => {
                            if (element.member) {
                              return (
                                <tr>
                                  <td>{index + 1}</td>
                                  <td>{element.member.displayName}</td>
                                  <td>{element.member.age}</td>
                                  <td>{element.member.phoneNumber}</td>
                                </tr>
                              )
                            }
                          })}
                        </table>
                        
                      </div>
                    </div>
                  </Card>
                </Grid>
              </Grid>
            </Grid>}
          </Grid>}
        {((role == "ROLE_ADMIN") || (role == "ROLE_SUPER_ADMIN") || (role == "ROLE_MEDICAL_TEAM")) &&
          <Grid container spacing={3}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Link to={"/family"}>
                <Card elevation={3} className=" p-32 py-32 text-center h-100 click icon " >
                {/* bgc-green-d1 */}
                  <div className="text-white margin-auto">
                    <div className="card-title text-white uppercase m-0 ">Quản lý hộ gia đình</div>
                    <div className="text-white m-0 ">Quản lý thông tin các hộ gia đình tham gia hệ thống</div>
                  </div>
                </Card>
              </Link>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Link to={"/health-record"}>
                <Card elevation={3} className=" p-32 py-32 text-center h-100 click icon-1 ">
                  <div className="text-white margin-auto">
                    <div className="card-title text-white uppercase m-0">Danh sách cập nhật kết quả</div>
                    <div className="text-white m-0 ">Danh sách đánh giá nguy cơ theo khai báo y tế và thăm khám</div>

                  </div>
                </Card>
              </Link> 
            </Grid>
            {reportData && <Grid item lg={12} md={12} sm={12} xs={12}>
              <div className="text-primary-d2 margin-auto margin-padding">
                <div className="card-title text-primary-d2 uppercase m-0 text-center">Thống kê theo đơn vị hành chính và mức nguy cơ</div>
                {reportData.code=="town" &&  <ArrowBackIcon onClick={()=>this.reportByComuneId(reportData?.details[0]?.parentAdminUnitid)}/>}
                {reportData.code=="quarter" &&  <ArrowBackIcon onClick={()=>this.reportByDistrict()}/>}
                <div className="card-body">
                  <Table className="product-table margin-padding" border={1}>
                    <TableHead>
                      <TableRow>
                        <TableCell className="px-24">Đơn vị hành chính</TableCell>
                        {/* <TableCell className="px-24" align="center">SPO2 thấp và nhịp thở không bình thường</TableCell>
                        <TableCell className="px-24" align="center">Triệu chứng cần cấp cứu</TableCell>
                        <TableCell className="px-24" align="center">Có triệu chứng khác</TableCell>
                        <TableCell className="px-24" align="center">Không triệu chứng</TableCell> */}
                        <TableCell className="px-24" align="center">Mức nguy cơ rất cao</TableCell>
                        <TableCell className="px-24" align="center">Mức nguy cơ cao</TableCell>
                        <TableCell className="px-24" align="center">Mức nguy cơ trung bình</TableCell>
                        <TableCell className="px-24" align="center">Mức nguy cơ thấp</TableCell>
                      </TableRow> 
                    </TableHead>
                    {
                      (reportData.details).map((element, index) => {
                        
                        return (
                          <TableRow>
                            <TableCell className="px-24 ">
                              {reportData.code=="commune" && <a onClick={()=>this.reportByComuneId(element.adminUnitId)} href="#">{element.adminUnit}</a>}
                              {reportData.code=="quarter" && <a onClick={()=>this.reportByQuarterId(element.adminUnitId)} href="#">{element.adminUnit}</a>}
                              {reportData.code=="town" &&  
                                <a href="#">{element.adminUnit}</a>
                              }
                            </TableCell>
                            <TableCell className="px-24 text-color bgc-danger-tp1 " align="center">
                              {reportData.code=="commune" && 
                                <Link onClick={()=>this.getListPatientByAdminUnit(3,element.adminUnitId,'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000')}>
                                  {element.serious}
                                </Link>
                              }
                              {reportData.code=="quarter" && 
                                <Link onClick={()=>this.getListPatientByAdminUnit(3,'00000000-0000-0000-0000-000000000000',element.adminUnitId,'00000000-0000-0000-0000-000000000000')}>
                                  {element.serious}
                                </Link>
                              }
                              {reportData.code=="town" &&  
                                <Link onClick={()=>this.getListPatientByAdminUnit(3,'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000',element.adminUnitId)}>
                                  {element.serious}
                                </Link>
                              }
                            </TableCell>
                            <TableCell className="px-24 text-color bg-secondary" align="center">
                              {reportData.code=="commune" && 
                                <Link onClick={()=>this.getListPatientByAdminUnit(2,element.adminUnitId,'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000')}>
                                  {element.medium}
                                </Link>
                              }
                               {reportData.code=="quarter" && 
                                <Link onClick={()=>this.getListPatientByAdminUnit(2,'00000000-0000-0000-0000-000000000000',element.adminUnitId,'00000000-0000-0000-0000-000000000000')}>
                                  {element.medium}
                                </Link>
                              }
                              {reportData.code=="town" &&  
                                <Link onClick={()=>this.getListPatientByAdminUnit(2,'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000',element.adminUnitId)}>
                                  {element.medium}
                                </Link>
                              }
                            </TableCell>
                            <TableCell className="px-24 text-color bgc-secondary-l2" align="center">                              
                              {reportData.code=="commune" && 
                                <Link onClick={()=>this.getListPatientByAdminUnit(1,element.adminUnitId,'00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000')}>
                                  {element.normal}
                                </Link>
                              }
                              {reportData.code=="quarter" && 
                                <Link onClick={()=>this.getListPatientByAdminUnit(1,'00000000-0000-0000-0000-000000000000',element.adminUnitId,'00000000-0000-0000-0000-000000000000')}>
                                  {element.normal}
                                </Link>
                              }
                              {reportData.code=="town" &&  
                                <Link onClick={()=>this.getListPatientByAdminUnit(1,'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000',element.adminUnitId)}>
                                  {element.normal}
                                </Link>
                              }
                            </TableCell>
                            <TableCell className="px-24 text-color bg-light-green" align="center">
                              {/* {element.noSymtom} */}
                              {reportData.code=="commune" && 
                                <Link onClick={()=>this.getListPatientByAdminUnit(-1,element.adminUnitId,'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000')}>
                                  {element.noSymtom}
                                </Link>
                              }
                               {reportData.code=="quarter" && 
                                <Link onClick={()=>this.getListPatientByAdminUnit(-1,'00000000-0000-0000-0000-000000000000',element.adminUnitId,'00000000-0000-0000-0000-000000000000')}>
                                  {element.noSymtom}
                                </Link>
                              }
                              {reportData.code=="town" &&  
                                <Link onClick={()=>this.getListPatientByAdminUnit(-1,'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000',element.adminUnitId)}>
                                  {element.noSymtom}
                                </Link>
                              }
                            </TableCell>
                          </TableRow>
                        )
                      })
                    }
                  </Table>
                  {openViewListPatientDialog && (
                    <ViewListPatientDialog
                      handleClose={this.handleCloseListPatientDialog}
                      open={openViewListPatientDialog}       
                      title={this.state.title}
                      listCase={this.state.listCasetData}            
                      t={t}
                    />
                  )}
                </div>
              </div>
              <div className="text-primary-d2 margin-auto margin-padding">
                <ColumnChart reportData={reportData} />
              </div>
            </Grid>}
          </Grid>
        }
        {(role == "ROLE_HEALTHCARE_STAFF") && data &&
          <Grid container spacing={3}>
            <Grid item lg={12} md={12} sm={12} xs={12} style={{ 'fontSize': '15px' }}>
              <div><b>Nhân viên y tế: </b>{data.practitioner ? data.practitioner.displayName : ''}</div>
              <div><b>Tổ y tế: </b>{data.practitioner ? (data.practitioner.healthCareGroup ? data.practitioner.healthCareGroup.name : '') : ''}</div>
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
            <Grid container spacing={3}>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Button
              startIcon={<AccountBoxIcon />}
              className="btn btn-primary-d d-inline-flex"
              variant="contained"
              color="primary"
              onClick={() => this.setState( this.linkToEncounter() )}
            >
              Thăm khám
            </Button>
            {/* <Button
              className="mb-16 mr-16"
              variant="contained"
              color="primary"
              onClick={() =>
                this.setState({ shouldOpenConfirmationDeleteAllDialog: true })
              }
            >
              {t("Delete")}
            </Button> */}
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12} >
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
              <div className="card-title text-primary-d2 uppercase m-0 text-center ">{t("Danh sách các bệnh nhân phụ trách")}</div>
              <MaterialTable
                data={this.state.itemList ? this.state.itemList : []}
                columns=
                {
                  [
                    {
                      title: t('STT'), field: "custom", align: "left", width: "150",
                      render: (rowData) => {
                        return rowData.tableData.id + 1;
                      }
                    },
                    {
                      title: t('Họ tên'),
                      field: "name",
                      width: '150',
                      render: (rowData) => {
                        return rowData.familyMember ? (rowData.familyMember.member ? rowData.familyMember.member.displayName : '') : '';
                      }
                    },
                    {
                      title: t('Hộ gia đình'),
                      field: "age",
                      width: '100',
                      render: (rowData) => {
                        return rowData.familyMember ? (rowData.familyMember.family ? rowData.familyMember.family.name : '') : '';
                      }
                    },
                    {
                      title: t('Loại cập nhật'), field: "type", align: "left", width: "150",
                      render: (rowData) => {
                        const found = ConstantList.PERSONAL_HEALTH_RECORD_TYPE.find(element => element.key == rowData.type);
                        return found ? found.value : '';
                      }
                    },
                    {
                      title: t('Tình trạng'),
                      field: "age",
                      width: '100',
                      render: (rowData) => {
                        console.log(rowData.seriusStatus);
                        const found = ConstantList.SERIUS_STATUS_CONST.find(element => element.value == rowData.seriusStatus);
                        return found ? found.display : '';
                      }
                    },
                    {
                      title: t('Trạng thái xử lý'),
                      field: "age",
                      width: '100',
                      render: (rowData) => {
                        const found = ConstantList.RESOLVE_STATUS_CONST.find(element => element.value == rowData.resolveStatus);
                        return found ? found.display : '';
                      }
                    },
                    // {
                    //   title: t('Phường'),
                    //   field: "phoneNumber",
                    //   width: '100',
                    //   render: (rowData) => {
                    //     return rowData.familyMember ? (rowData.familyMember.family ? 
                    //       (rowData.familyMember.family.administrativeUnit ? 
                    //         (rowData.familyMember.family.administrativeUnit.parent ? 
                    //           rowData.familyMember.family.administrativeUnit.parent.name : '') : '') : ''): '';
                    //   }
                    // },
                    // {
                    //   title: t('Khu phố'),
                    //   field: "custom",
                    //   width: '100',
                    //   render: (rowData) => {
                    //     return rowData.familyMember ? (rowData.familyMember.family ? 
                    //       (rowData.familyMember.family.administrativeUnit ? 
                    //         (rowData.familyMember.family.administrativeUnit.parent ? 
                    //           rowData.familyMember.family.administrativeUnit.parent.name : '') : '') : ''): '';
                    //   }
                    // },
                    {
                      title: t('Tổ'),
                      field: "custom",
                      width: '100',
                      render: (rowData) => {
                        return rowData.familyMember
                          ?
                          (rowData.familyMember.family ? (rowData.familyMember.family.administrativeUnit ? rowData.familyMember.family.administrativeUnit.name : '') : '')
                          : '';
                      }
                    },
                    {
                      title: t('Chi tiết'), field: "custom", width: "150",
                      align: "center",
                      render: rowData =>
                        <MaterialButton item={rowData} seachPersonalHealthRecordByDto={this.seachPersonalHealthRecordByDto} linkToEncounter={this.linkToEncounter} />
                    },
                  ]
                }
                options={{
                  selection: false,
                  actionsColumnIndex: -1,
                  paging: false,
                  search: false,
                  rowStyle: (rowData, index) => {
                    const seriusStatus = rowData.seriusStatus;
                    let bgc = "#fff";
                    // let textcolor = "rgba(0, 0, 0, 0.87)";
                    if (seriusStatus) {
                      let e = ConstantList.SERIUS_STATUS_CONST.find((element) => element.value === seriusStatus)
                      if (e) {
                        bgc = e.bgc;
                        // textcolor = "#fff";
                      }
                    } else {
                      bgc = ConstantList.SERIUS_STATUS_CONST.find((element) => element.value === -1).bgc;
                    }
                    return ({
                      backgroundColor: bgc,
                      // color: textcolor
                    })
                  },
                  maxBodyHeight: '450px',
                  minBodyHeight: '200px',
                  headerStyle: {
                    backgroundColor: '#3366ff',
                    color: '#fff',
                    whiteSpace: 'nowrap'
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
              {this.state.itemList && this.state.itemList.length > 0 &&
                <NicePagination
                  totalPages={this.state.totalPages}
                  handleChangePage={this.handleChangePage}
                  setRowsPerPage={this.setRowsPerPage}
                  pageSize={this.state.rowsPerPage}
                  pageSizeOption={[1, 2, 3, 5, 10, 25, 50]}
                  t={t}
                  totalElements={this.state.totalElements}
                  page={this.state.page}
                  isSimple={true}
                />
              }
            </Grid>
              {openViewDialog && (
                <ViewDialog
                  handleClose={this.handleClose}
                  open={openViewDialog}
                  updatePageData={this.updatePageData}
                  item={this.state.item}
                  t={t}
                />
              )}
              {shouldOpenConfirmationViewDialog && (
                <ConfirmationDialog
                  open={shouldOpenConfirmationViewDialog}
                  onClose={this.handleClose}
                  onYesClick={this.handleDeleteListItem}
                  title={t("Thông báo")}
                  text={t('Chưa có thông tin cập nhật sức khoẻ của người này!')}
                  // agree={t("confirm_dialog.delete_list.agree")}
                  cancel={t("Đóng")}
                />
              )}
            </Grid>
            </Grid>
          </Grid>}
      </div>
    );
  }
}

export default withStyles({}, { withTheme: true })(Analytics);
