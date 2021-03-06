import React, { Component } from "react";
import { Grid, IconButton, Icon, Button, Collapse, } from "@material-ui/core";
import MaterialTable from 'material-table';
import { searchByPageFamily as searchByPage, getById, deleteItem, getNewCode } from "./PractitionerAndFamilyService";
import PractitionerAndFamilyEditorDialog from "./PractitionerAndFamilyEditorDialog";
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
import SendTreatment from '../Component/ActionButton/SendTreatment';
import SendTreatmentPopup from './SendTreatmentPopup';
import FilterListIcon from "@material-ui/icons/FilterList";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Filter from "./Filter";
import appConfig from "app/appConfig";
import localStorageService from "app/services/localStorageService";

toast.configure( {
  autoClose: 2000,
  draggable: false,
  limit: 3
} );

function MaterialButton ( props )
{
  const { t, i18n } = useTranslation();
  const { item } = props;
  return <div>
    <SendTreatment t={ t } item={ item } onSelect={ props.onSelect } index={ 2 } />
    {/* <IconButton size="small" onClick={() => props.onSelect(item, 0)}>
      <Icon fontSize="small" color="primary">edit</Icon>
    </IconButton> */}
    {/* <IconButton size="small" onClick={() => props.onSelect(item, 1)}>
      <Icon fontSize="small" color="error">delete</Icon>
    </IconButton> */}
  </div>;
}
class PractitionerAndFamily extends Component
{
  state = {
    rowsPerPage: 10,
    page: 1,
    keyword: '',
    totalPages: 10,
    shouldOpenPractitionerAndFamilyEditorDialog: false,
    shouldOpenConfirmationDialog: false,
    shouldOpenConfirmationDeleteListDialog: false,
    filterItem: {}
  };

  updatePageData = ( item ) =>
  {
    var searchObject = {};
    if ( item != null )
    {
      this.setState( {
        page: 1,
        text: item.text,
        healthCareGroupId: item.healthCareGroupId,
        administrativeUnitId: item.administrativeUnitId
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
    searchByPage( searchObject ).then( ( { data } ) =>
    {
      this.setState( {
        itemList: [...data.content],
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        listFamily: []
      } )
    }
    );
  }

  updatePractitioner = ( type ) =>
  {
    if ( this.state.listFamily && this.state.listFamily.length > 0 )
    {
      this.handleSendListTreatment( this.state.listFamily, type );
    } else
    {
      toast.warn( "Ch??a ch???n d??? li???u" );
    }
  }

  handleSendListTreatment = ( listData, type ) =>
  {
    this.setState( {
      listFamily: listData,
      type: type,
      shouldOpenSelectTreatmentDialog: true,
    } )
  }


  //Paging handle start
  setPage = ( page ) =>
  {
    this.setState( { page }, function ()
    {
      this.updatePageData()
    } )
  }
  setRowsPerPage = ( event ) =>
  {
    this.setState( { rowsPerPage: event.target.value, page: 1 }, function ()
    {
      this.updatePageData()
    } )
  }
  handleChangePage = ( event, newPage ) =>
  {
    this.setPage( newPage )
  }
  //Paging handle end

  handleClose = () =>
  {
    this.setState( {
      shouldOpenPractitionerAndFamilyEditorDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationDeleteListDialog: false,
      shouldOpenSelectTreatmentDialog: false,
    }, () =>
    {
      this.updatePageData();
    } );
  };
  genPractitioner ( listPrac, type )
  {
    let practitioner = "";
    if ( listPrac != null && listPrac.length > 0 )
    {
      practitioner = listPrac.map( value =>
      {
        let type = "";
        if ( value && value.type )
        {
          if ( value.type == 1 )
          {
            type = "(T??? xa)";
          } else
          {
            type = "(T???i ch???)";
          }
        }
        return (
          <div>{ `${ value.practitioner.displayName } ${ type }` }</div>
        )
      } )
    }
    return practitioner;
  }

  //handle delete start
  async handleDeleteList ( list )
  {
    let listAlert = [];
    let { t } = this.props
    for ( var i = 0; i < list.length; i++ )
    {
      try
      {
        await deleteItem( list[i].id );
      } catch ( error )
      {
        listAlert.push( list[i].name );
      }
    }
    this.handleClose()
    toast.success( t( 'toast.delete_success' ) );
  };
  handleDeleteListItem = ( event ) =>
  {
    let { t } = this.props
    if ( this.data != null )
    {
      this.handleDeleteList( this.data ).then( () =>
      {
        this.updatePageData();
      } )
    } else
    {
      toast.warning( t( 'toast.please_select' ) );
    };
  }
  handleConfirmDeleteItem = () =>
  {
    let { t } = this.props
    deleteItem( this.state.id ).then( () =>
    {
      this.updatePageData();
      this.handleClose();
      toast.success( t( 'toast.delete_success' ) );
    } );
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

  handleSendTreatment = ( itemSendTreatment ) =>
  {
    this.setState( {
      itemSendTreatment,
      shouldOpenSelectTreatmentDialog: true,
    } )
  }

  handleCollapseFilter = () =>
  {
    let { checkedFilter } = this.state;
    this.setState( { checkedFilter: !checkedFilter } );
  };

  handleChangeFilter = ( filterItem ) =>
  {
    this.setState( { filterItem: filterItem }, () => console.log( this.state ) );
  }
  render ()
  {
    const { t, i18n } = this.props;
    let {
      itemList,
      shouldOpenConfirmationDialog,
      shouldOpenConfirmationDeleteListDialog,
      shouldOpenPractitionerAndFamilyEditorDialog,
      shouldOpenSelectTreatmentDialog,
      checkedFilter,
      role
    } = this.state;

    let columns = [
      // {
      //   title: t("M??"),
      //   field: "code",
      //   width: '100'
      // },
      {
        title: 'H??? v?? t??n ch??? h???',
        field: "name",
        width: '150'
      },
      // {
      //   title: t('Tu???i'),
      //   field: "age",
      //   width: '100'
      // },
      {
        title: 'S??T',
        field: "phoneNumber",
        width: '100'
      },
      {
        title: '?????a ch???',
        field: "address",
        width: '150',
        cellStyle: {
          minWidth: "350px"
        }
      },
      // {
      //   title: t('?????a ch??? chi ti???t'),
      //   field: "detailAddress"
      // },
      {
        title: 'Nh??n vi??n y t??? t???i ch???',
        field: "custom",
        render: rowData =>
        {
          if ( rowData.listPractitioner && rowData.listPractitioner.length > 0 )
          {
            let item = rowData.listPractitioner.find( ( e ) => e.type == 2 );
            if ( item )
            {
              return <div>{ `${ item.practitioner.displayName }` }</div>
            }
          }
        }
      },
      {
        title: 'Nh??n vi??n y t??? t??? xa',
        field: "custom",
        render: rowData =>
        {
          if ( rowData.listPractitioner && rowData.listPractitioner.length > 0 )
          {
            let item = rowData.listPractitioner.find( ( e ) => e.type == 1 );
            if ( item )
            {
              return <div>{ `${ item.practitioner.displayName }` }</div>
            }
          }
        }
      },
      // {
      //   title: t("general.action"),
      //   field: "custom",
      //   width: '100',
      //   type: 'numeric',
      //   render: rowData => <MaterialButton item={rowData}
      //     onSelect={(rowData, method) => {
      //       if (method === 0) {
      //         console.log(rowData)
      //         getById(rowData.id).then(({ data }) => {
      //           console.log(data)
      //           this.setState({
      //             item: data,
      //             shouldOpenPractitionerAndFamilyEditorDialog: true
      //           });
      //         })
      //       } else if (method === 1) {
      //         console.log(rowData)
      //         this.handleDelete(rowData.id);
      //       } else if (method === 2) {
      //         this.handleSendTreatment(rowData);
      //       }
      //       else {
      //         alert('Call Selected Here:' + rowData.id);
      //       }
      //     }}
      //   />
      // },
    ]
    return (
      <div className="m-sm-30">
        <div className="mb-sm-30">
          <Breadcrumb routeSegments={ [{ name: 'Ph??n c??ng ch??m s??c h??? gia ????nh'}] } />
        </div>
        <Grid container spacing={ 1 }>
          <Grid item lg={ 6 } md={ 6 } sm={ 12 } xs={ 12 }>
            <Button
              variant="contained"
              className="mr-12 btn btn-primary d-inline-flex"
              color="primary"
              onClick={ () => this.updatePractitioner( 2 ) }
            >
              Ph??n c??ng NVYT t???i ch???
            </Button>
            <Button
              variant="contained"
              className="mr-12 btn btn-secondary d-inline-flex"
              color="primary"
              onClick={ () => this.updatePractitioner( 1 ) }
            >
              Ph??n c??ng NVYT t??? xa
            </Button>
          </Grid>
          <Grid item md={ 6 } sm={ 12 } xs={ 12 }>
            <Grid container spacing={ 2 } style={ { display: "flex", justifyContent: "flex-end" } }>
              <Grid item lg={ 7 } md={ 7 } sm={ 6 } xs={ 6 }>
                <SearchInput
                  search={ this.updatePageData }
                  t={ t }
                />
              </Grid>
              { ( role == "ROLE_ADMIN" || role == "ROLE_SUPER_ADMIN" ) &&
                <Grid item lg={ 5 } md={ 5 } sm={ 6 } xs={ 6 }>
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
                </Grid> }
            </Grid>
          </Grid>
          { checkedFilter && ( <Grid item lg={ 12 } md={ 12 } sm={ 12 } xs={ 12 }>
            <Collapse
              in={ checkedFilter }
              style={ {
                width: "99%",
              } }
            >
              <Filter
                search={ this.updatePageData }
                filterItem={ this.state.filterItem }
                handleChangeFilter={ this.handleChangeFilter }
                t={ t }
              />
            </Collapse>
          </Grid> ) }
          <Grid item lg={ 12 } md={ 12 } sm={ 12 } xs={ 12 }>
            <MaterialTable
              data={ itemList }
              columns={ columns }
              // parentChildData={(row, rows) => {
              //   var list = rows.find((a) => a.id === row.parentId)
              //   return list
              // }}
              options={ {
                selection: true,
                // actionsColumnIndex: -1,
                paging: false,
                search: false,
                toolbar: false,
                maxBodyHeight: "440px",
                headerStyle: {
                  backgroundColor: '#3366ff',
                  color: '#fff',
                  textTransform: "uppercase",
                  whiteSpace: 'nowrap',
                  borderTop: "1px solid #ccc",
                  borderBottom: "1px solid #ccc",
                },
                // tableLayout: 'fixed',
                rowStyle: ( rowData, index ) =>
                {
                  const seriusStatus = rowData.seriusStatus;
                  let bgc = "#fff";
                  // let textcolor = "rgba(0, 0, 0, 0.87)";
                  if ( seriusStatus )
                  {
                    let e = appConfig.SERIUS_STATUS_CONST.find( ( element ) => element.value === seriusStatus )
                    if ( e )
                    {
                      bgc = e.bgc;
                      // textcolor = "#fff";
                    }
                  } else
                  {
                    bgc = appConfig.SERIUS_STATUS_CONST.find( ( element ) => element.value === -1 ).bgc;
                  }
                  return ( {
                    backgroundColor: bgc,
                    // color: textcolor
                  } )
                }
              } }
              onSelectionChange={ ( rows ) =>
              {
                console.log( rows );
                this.data = rows;
                this.setState( { listFamily: rows } );
                // this.setState({selectedItems:rows});
              } }
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

            { shouldOpenPractitionerAndFamilyEditorDialog && (
              <PractitionerAndFamilyEditorDialog
                handleClose={ this.handleClose }
                open={ shouldOpenPractitionerAndFamilyEditorDialog }
                updatePageData={ this.updatePageData }
                item={ this.state.item }
                t={ t } i18n={ i18n }
              />
            ) }

            { shouldOpenSelectTreatmentDialog && (
              <SendTreatmentPopup
                t={ t } i18n={ i18n }
                open={ shouldOpenSelectTreatmentDialog }
                handleClose={ this.handleClose }
                itemSendCheck={ this.state.itemSendTreatment }
                listFamily={ this.state.listFamily }
                type={ this.state.type }
                checkAgain={ true }
              />
            ) }
            { shouldOpenConfirmationDialog && (
              <ConfirmationDialog
                open={ shouldOpenConfirmationDialog }
                onClose={ this.handleClose }
                onYesClick={ this.handleConfirmDeleteItem }
                title={ t( "confirm_dialog.delete.title" ) }
                text={ t( 'confirm_dialog.delete.text' ) }
                agree={ t( "confirm_dialog.delete.agree" ) }
                cancel={ t( "confirm_dialog.delete.cancel" ) }
              />
            ) }

            { shouldOpenConfirmationDeleteListDialog && (
              <ConfirmationDialog
                open={ shouldOpenConfirmationDeleteListDialog }
                onClose={ this.handleClose }
                onYesClick={ this.handleDeleteList }
                title={ t( "confirm_dialog.delete_list.title" ) }
                text={ t( 'confirm_dialog.delete_list.text' ) }
                agree={ t( "confirm_dialog.delete_list.agree" ) }
                cancel={ t( "confirm_dialog.delete_list.cancel" ) }
              />
            ) }
          </Grid>
          <Grid item lg={ 12 } md={ 12 } sm={ 12 } xs={ 12 } style={ { backgroundColor: "#fff" } }>
            <fieldset>
              <legend>Ch?? th??ch</legend>
              <Grid container spacing={ 1 }>
                <Grid item lg={ 3 } md={ 3 } sm={ 6 } xs={ 12 } style={ { display: "flex", alignItems: "center" } }>
                  <div style={ {
                    width: "20px", height: "20px",
                    backgroundColor: appConfig.SERIUS_STATUS_CONST.find( ( element ) => element.value === -1 ).bgc
                  } }></div>
                  <span style={ { marginLeft: "12px" } }>M???c nguy c?? th???p</span>
                </Grid>
                <Grid item lg={ 3 } md={ 3 } sm={ 6 } xs={ 12 } style={ { display: "flex", alignItems: "center" } }>
                  <div style={ {
                    width: "20px", height: "20px",
                    backgroundColor: appConfig.SERIUS_STATUS_CONST.find( ( element ) => element.value === 1 ).bgc
                  } }></div>
                  <span style={ { marginLeft: "12px" } }>M???c nguy c?? trung b??nh</span>
                </Grid>
                <Grid item lg={ 3 } md={ 3 } sm={ 6 } xs={ 12 } style={ { display: "flex", alignItems: "center" } }>
                  <div style={ {
                    width: "20px", height: "20px",
                    backgroundColor: appConfig.SERIUS_STATUS_CONST.find( ( element ) => element.value === 2 ).bgc
                  } }></div>
                  <span style={ { marginLeft: "12px" } }>M???c nguy c?? cao</span>
                </Grid>
                <Grid item lg={ 3 } md={ 3 } sm={ 6 } xs={ 12 } style={ { display: "flex", alignItems: "center" } }>
                  <div style={ {
                    width: "20px", height: "20px",
                    backgroundColor: appConfig.SERIUS_STATUS_CONST.find( ( element ) => element.value === 3 ).bgc
                  } }></div>
                  <span style={ { marginLeft: "12px" } }>M???c nguy c?? r???t cao</span>
                </Grid>
              </Grid>
            </fieldset>

          </Grid>
        </Grid>
      </div>
    );
  }
}

export default PractitionerAndFamily;
