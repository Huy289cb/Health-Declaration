import
{
  Button, Collapse, Grid, Icon, IconButton, TablePagination, Tooltip, withStyles
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import FilterListIcon from "@material-ui/icons/FilterList";
import localStorageService from "app/services/localStorageService";
import { Breadcrumb, ConfirmationDialog } from "egret";
import MaterialTable from 'material-table';
import React, { Component } from "react";
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConstantList from "../../appConfig";
import SearchInput from '../Component/SearchInput/SearchInput';
import ViewDialog from "../dashboard/ViewDialog";
import { getAllInfoByUserLogin } from "../User/UserService";
import Filter from "./Filter";
import { searchByPage } from "./PersonalHealthRecordService";
import "styles/globitsStyles.css";
import NicePagination from '../Component/Pagination/NicePagination';
toast.configure( {
  autoClose: 2000,
  draggable: false,
  limit: 3
} );

const LightTooltip = withStyles( ( theme ) => ( {
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
} ) )( Tooltip );

function MaterialButton ( props )
{
  const { t, i18n } = useTranslation();
  const { item } = props;
  return <div>
    <LightTooltip
      title="Xem chi tiết"
      placement="right-end"
      enterDelay={ 500 }
      leaveDelay={ 300 }
    >
      <IconButton size="small" onClick={ () => props.seachPersonalHealthRecordByDto( item ) }>
        <Icon fontSize="small" color="primary">visibility</Icon>
      </IconButton>
    </LightTooltip>
    <LightTooltip
      title="Thăm khám"
      placement="right-end"
      enterDelay={ 500 }
      leaveDelay={ 300 }
    >
      <IconButton size="small" onClick={ () => props.linkToEncounter( item ) }>
        <Icon fontSize="small" color="primary">assignment</Icon>
      </IconButton>
    </LightTooltip>
  </div>;
}

class PerrsonalHealthRecord extends Component
{
  state = {
    rowsPerPage: 25,
    page: 1,
    listData: [],
    item: {},
    text: '',
    medicalTeam: null,
    practitioner: null,
    shouldOpenEditorDialog: false,
    shouldOpenConfirmationDialog: false,
    shouldOpenConfirmationDeleteAllDialog: false,
    openViewDialog: false,
    shouldOpenConfirmationViewDialog: false,
  };
  constructor ( props )
  {
    super( props );
    this.handleTextSearchChange = this.handleTextSearchChange.bind( this );
  }

  handleTextSearchChange = event =>
  {
    this.setState( { text: event.target.value }, function ()
    {
    } )
  };
  handleKeyDownEnterSearch = ( e ) =>
  {
    if ( e.key === 'Enter' )
    {
      this.search()
    }
  }
  async handleDeleteList ( list )
  {
    let { t } = this.props;
    let deleteSuccess = 0, deleteError = 0, error = 0;
    if ( deleteSuccess != 0 )
    {
      toast.info( t( "administrativeUnit.notify.deleteSuccess" ) + " " + deleteSuccess );
    }
    if ( error != 0 )
    {
      toast.warning( t( 'administrativeUnit.notify.error' ) + " " + error );
    }
    this.updatePageData();
    this.handleDialogClose();
  }

  handleDeleteAll = ( event ) =>
  {
    let { t } = this.props;
    if ( this.data != null )
    {
      this.handleDeleteList( this.data );
    } else
    {
      toast.warning( t( 'general.select_data' ) );
      this.handleDialogClose();
    };
  };

  setRowsPerPage = event =>
  {
    this.setState( { rowsPerPage: event.target.value, page: 1 }, function ()
    {
      this.updatePageData();
    } )
  };

  handleChangePage = ( event, newPage ) =>
  {
    this.updateData( newPage );
  };

  updateData ( pageNumber )
  {
    this.setState( { page: pageNumber }, function ()
    {
      this.updatePageData();
    } );
  }

  handleDialogClose = () =>
  {
    this.setState( {
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationDeleteAllDialog: false,
    } );
    this.updatePageData();
  };

  handleDelete = id =>
  {
    this.setState( {
      id,
      shouldOpenConfirmationDialog: true
    } );
  };

  componentDidMount ()
  {
    this.updatePageData();
    this.setState( { role: localStorageService.getItem( "role" ) } );
  }

  componentWillMount ()
  {
    let { location } = this.props;
    //get practitioner nếu user đăng nhập là nhân viên y tế
    getAllInfoByUserLogin().then( ( resp ) =>
    {
      let data = resp ? resp.data : null;
      if ( data )
      {
        if ( data.healthCareStaff )
        {
          if ( data && data.practitioner && data.practitioner.id )
          {
            var type = ConstantList.GET_PERSONAL_HEALTH_RECORD_TYPE.practitioner;
            this.setState( { practitioner: { id: data.practitioner.id }, type: type }, () =>
            {
              console.log( this.state );
            } );
          }
        }
        else if ( data.medicalTeam )
        {
          if ( data && data.userUnit && data.userUnit.id )
          {
            var type = ConstantList.GET_PERSONAL_HEALTH_RECORD_TYPE.medical_team;
            this.setState( { medicalTeam: { id: data.userUnit.id }, type: type }, () =>
            {
              console.log( this.state );
            } );
          }
        }
      }
    } )
  }

  updatePageData = ( item ) =>
  {
    var searchObject = {};
    if ( item != null )
    {
      this.setState( {
        page: 1,
        text: item.text,
        healthCareGroupId: item.healthCareGroupId,
        administrativeUnitId: item.administrativeUnitId,
        resolveStatus: item.resolveStatus,
        type: item.type
      }, () =>
      {
        this.search( searchObject );
      } )
    } else
    {

      this.search( searchObject );
    }
  };

  search = ( searchObject ) =>
  {
    searchObject.text = this.state.text;
    searchObject.pageIndex = this.state.page;
    searchObject.pageSize = this.state.rowsPerPage;
    searchObject.healthCareGroupId = this.state.healthCareGroupId;
    searchObject.administrativeUnitId = this.state.administrativeUnitId;
    searchObject.resolveStatus = this.state.resolveStatus;
    searchObject.type = this.state.type;
    searchObject.lastRecord = true;
    searchByPage( searchObject ).then( ( { data } ) =>
    {
      this.setState( {
        listData: data.content,
        totalElements: data.totalElements,
        totalPages: data.totalPages
      } )
    }
    );
  }

  seachPersonalHealthRecordByDto = ( rowData ) =>
  {
    let searchObject = {
      pageIndex: 1, pageSize: 10,
      familyMemberId: rowData.familyMember ? rowData.familyMember.id : "",
      lastRecord: true
    }
    searchByPage( searchObject ).then( ( { data } ) =>
    {
      if ( data && data.content && data.content[0] )
      {
        var item = data.content[0];
        let { practitioner, medicalTeam, type } = this.state;
        if ( practitioner )
        {
          item.practitioner = practitioner;
          item.type = type;
        }

        if ( medicalTeam )
        {
          item.medicalTeam = medicalTeam;
          item.type = type;
        }
        this.setState( {
          item: item,
          openViewDialog: true
        } )
      } else
      {
        this.setState( {
          shouldOpenConfirmationViewDialog: true
        } )
      }
    } )
  }

  linkToEncounter = ( item ) =>
  {
    this.props.history.push( {
      pathname: '/encounter/create',
      state: { familyMember: item ? item.familyMember : null }
    } );
  }

  handleClose = () =>
  {
    this.setState( {
      openViewDialog: false,
      shouldOpenConfirmationViewDialog: false,
    }, () =>
    {
      this.updatePageData();
    } );
  };

  handleCollapseFilter = () =>
  {
    let { checkedFilter } = this.state;
    this.setState( { checkedFilter: !checkedFilter } );
  };

  render ()
  {
    const { t, i18n } = this.props;
    let {
      rowsPerPage,
      page,
      text,
      listData,
      shouldOpenConfirmationDialog,
      openViewDialog,
      shouldOpenConfirmationViewDialog,
      totalElements,
      role,
      checkedFilter,
    } = this.state;

    let columns = [
      {
        title: "STT", width: "10", render: rowData => ( this.state.page - 1 ) * this.state.rowsPerPage + rowData.tableData.id + 1
      },
      {
        title: t( "Chủ hộ" ), field: "code", width: "150",
        render: rowData => rowData.familyMember ? ( rowData.familyMember.family ? rowData.familyMember.family.name : '' ) : ''
      },
      {
        title: t( 'Họ tên thành viên' ), field: "name", align: "left", width: "150",
        render: rowData => rowData.familyMember ? ( rowData.familyMember.member ? rowData.familyMember.member.displayName : '' ) : ''
      },
      {
        title: t( 'SPO2' ), field: "spo2", align: "left", width: "150",
        render: ( rowData ) =>
        {
          const found = ConstantList.SPO2_CONST.find( element => element.value == rowData.spo2 );
          return found ? found.key : '';
        }
      },
      {
        title: t( 'Nhịp thở' ), field: "breathingRate", align: "left", width: "150",
        render: ( rowData ) =>
        {
          const found = ConstantList.BREATHINGRATE_CONST.find( element => element.value == rowData.breathingRate );
          return found ? found.key : '';
        }
      },
      {
        title: t( 'Mối quan hệ' ), field: "name", align: "left", width: "150",
        render: rowData => rowData.familyMember ? ( rowData.familyMember.relationship ) : ''
      },
      {
        title: t( 'Loại cập nhật' ), field: "type", align: "left", width: "150",
        render: ( rowData ) =>
        {
          const found = ConstantList.PERSONAL_HEALTH_RECORD_TYPE.find( element => element.key == rowData.type );
          return found ? found.value : '';
        }
      },
      {
        title: t( 'Số thẻ BHYT' ), field: "name", align: "left", width: "150",
        render: rowData => rowData.familyMember ? ( rowData.familyMember.member ? rowData.familyMember.member.healthInsuranceCardNumber : '' ) : ''
      },
      {
        title: t( 'Trạng thái' ), field: "resolveStatus", align: "left", width: "150",
        render: ( rowData ) =>
        {
          const found = ConstantList.RESOLVE_STATUS_CONST.find( element => element.value == rowData.resolveStatus );
          return found ? found.display : '';
        }
      },
      {
        title: "Thao tác",
        field: "custom",
        align: "left",
        width: "250",
        render: rowData =>
          <MaterialButton item={ rowData } seachPersonalHealthRecordByDto={ this.seachPersonalHealthRecordByDto } linkToEncounter={ this.linkToEncounter } />
      }

    ]
    return (
      <div className="m-sm-30">
        <div className="mb-sm-30">
          <Helmet>
            <title>Danh sách cập nhật kết quả</title>
          </Helmet>
          <Breadcrumb routeSegments={ [{ name: "Danh mục" }, { name: 'Danh sách cập nhật kết quả' }] } />
        </div>
        <Grid container spacing={ 3 }>
          <Grid item lg={ 6 } md={ 6 } sm={ 12 } xs={ 12 }>
            <Button
              className="mb-16 mr-16"
              variant="contained"
              color="primary"
              onClick={ () => this.setState( this.linkToEncounter() ) }
            >
              Thăm khám
            </Button>
          </Grid>
          <Grid item lg={ 6 } md={ 6 } sm={ 12 } xs={ 12 } >
            <Grid container spacing={ 2 } style={ { display: "flex", justifyContent: "flex-end" } }>
              <Grid item lg={ 8 } md={ 8 } sm={ 6 } xs={ 6 }>
                <SearchInput
                  search={ this.updatePageData }
                  t={ t }
                />
              </Grid>
              <Grid item lg={ 4 } md={ 4 } sm={ 6 } xs={ 6 }>
                <Button
                  className="btn_s_right d-inline-flex btn btn-primary-d"
                  variant="contained"
                  onClick={ this.handleCollapseFilter }
                  fullWidth
                >
                  <FilterListIcon />
                  <span>{ t( "general.button.filter" ) }</span>
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
          { checkedFilter && ( <Grid item lg={ 12 } md={ 12 } sm={ 12 } xs={ 12 }>
            <Collapse
              in={ checkedFilter }
              style={ {
                width: "100%",
              } }
            >
              <Filter
                search={ this.updatePageData }
                t={ t }
              />
            </Collapse>
          </Grid> ) }
          <Grid item xs={ 12 }>
            <MaterialTable
              data={ this.state.listData }
              columns={ columns }
              parentChildData={ ( row, rows ) =>
              {
                var list = rows.find( a => a.id === row.parentId );
                return list;
              } }
              options={ {
                selection: false,
                actionsColumnIndex: -1,
                paging: false,
                search: false,
                rowStyle: ( rowData, index ) =>
                {
                  const seriusStatus = rowData.seriusStatus;
                  let bgc = "#fff";
                  // let textcolor = "rgba(0, 0, 0, 0.87)";
                  if ( seriusStatus )
                  {
                    let e = ConstantList.SERIUS_STATUS_CONST.find( ( element ) => element.value === seriusStatus )
                    if ( e )
                    {
                      bgc = e.bgc;
                      // textcolor = "#fff";
                    }
                  } else
                  {
                    bgc = ConstantList.SERIUS_STATUS_CONST.find( ( element ) => element.value === -1 ).bgc;
                  }
                  return ( {
                    backgroundColor: bgc,
                    // color: textcolor
                  } )
                },
                headerStyle: {
                  backgroundColor: '#4FAA6D',
                  color: '#fff',
                },
                padding: 'dense',
                toolbar: false
              } }
              onSelectionChange={ ( rows ) =>
              {
                this.data = rows;
              } }
              localization={ {
                body: {
                  emptyDataSourceMessage: `${ t(
                    "general.emptyDataMessageTable"
                  ) }`,
                },
              } }

            />
            { this.state.totalElements > 0 &&
              <NicePagination
                totalPages={ this.state.totalPages }
                handleChangePage={ this.handleChangePage }
                setRowsPerPage={ this.setRowsPerPage }
                pageSize={ this.state.rowsPerPage }
                pageSizeOption={ [1, 2, 3, 5, 10, 25, 50] }
                t={ t }
                totalElements={ this.state.totalElements }
                page={ this.state.page }
                // isSimple={ true }
              />
            }
            

            { shouldOpenConfirmationDialog && (
              <ConfirmationDialog
                title={ t( "confirm" ) }
                open={ shouldOpenConfirmationDialog }
                onConfirmDialogClose={ this.handleDialogClose }
                onYesClick={ this.handleConfirmationResponse }
                text={ t( 'DeleteConfirm' ) }
                Yes={ t( 'general.Yes' ) }
                No={ t( 'general.No' ) }
              />
            ) }
            { openViewDialog && (
              <ViewDialog
                handleClose={ this.handleClose }
                open={ openViewDialog }
                updatePageData={ this.updatePageData }
                item={ this.state.item }
                t={ t }
              />
            ) }
            { shouldOpenConfirmationViewDialog && (
              <ConfirmationDialog
                open={ shouldOpenConfirmationViewDialog }
                onConfirmDialogClose={ this.handleClose }
                onYesClick={ this.handleDeleteListItem }
                title="Thông báo"
                text='Chưa có thông tin cập nhật sức khoẻ của người này!'
                cancel="Đóng"
              />
            ) }
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default PerrsonalHealthRecord;
