import
  {
    Button, FormControl, Grid, Icon, IconButton, Input, InputAdornment
  } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import { Breadcrumb, ConfirmationDialog } from "egret";
import { saveAs } from 'file-saver';
import MaterialTable from 'material-table';
import React, { Component } from "react";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import 'styles/globitsStyles.css';
import NicePagination from '../Component/Pagination/NicePagination';
import UserEditorDialog from "./UserEditorDialog";
import { deleteItem, getItemById, searchByDto } from "./UserService";

function MaterialButton ( props )
{
  const { t, i18n } = useTranslation();
  const item = props.item;
  const id = props.id
  return <div>
    { id != null && ( <IconButton size="small" onClick={ () => props.onSelect( item, 0 ) }>
      <Icon fontSize="small" color="primary">edit</Icon>
    </IconButton> ) }
    {/* <IconButton onClick={() => props.onSelect(item, 1)}>
      <Icon color="error">delete</Icon>
    </IconButton> */}
  </div>;
}

class User extends Component
{
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
  numSelected = 0;
  rowCount = 0;

  handleTextChange = event =>
  {
    this.setState( { keyword: event.target.value }, function ()
    {
    } )
  };

  handleKeyDownEnterSearch = e =>
  {
    if ( e.key === 'Enter' )
    {
      this.search();
    }
  };

  setPage = page =>
  {
    this.setState( { page }, function ()
    {
      this.updatePageData();
    } )
  };

  setRowsPerPage = event =>
  {
    this.setState( { rowsPerPage: event.target.value, page: 0 }, function ()
    {
      this.updatePageData();
    } );
  };

  handleChangePage = ( event, newPage ) =>
  {
    this.setPage( newPage );
  };

  search ()
  {
    this.setState( { page: 0 }, function ()
    {
      var searchObject = {};
      searchObject.text = this.state.keyword;
      searchObject.pageIndex = this.state.page;
      searchObject.pageSize = this.state.rowsPerPage;
      searchByDto( searchObject ).then( ( { data } ) =>
      {
        this.setState( { itemList: [...data.content], totalElements: data.totalElements, totalPages: data.totalPages } )
      } );
    } );
  }

  updatePageData = () =>
  {
    var searchObject = {};
    searchObject.text = this.state.keyword;
    searchObject.pageIndex = this.state.page;
    searchObject.pageSize = this.state.rowsPerPage;
    searchByDto( searchObject ).then( ( { data } ) =>
    {
      this.setState( { itemList: [...data.content], totalElements: data.totalElements, totalPages: data.totalPages } )
    } );
  };

  handleDownload = () =>
  {
    var blob = new Blob( ["Hello, world!"], { type: "text/plain;charset=utf-8" } );
    saveAs( blob, "hello world.txt" );
  }
  handleDialogClose = () =>
  {
    this.setState( {
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationDeleteAllDialog: false
    } );
  };

  handleOKEditClose = () =>
  {
    this.setState( {
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false
    } );
    this.updatePageData();
  };

  handleDeleteUser = id =>
  {
    this.setState( {
      id,
      shouldOpenConfirmationDialog: true
    } );
  };

  handleConfirmationResponse = () =>
  {
    deleteItem( this.state.id ).then( () =>
    {
      this.updatePageData();
      this.handleDialogClose();
    } );
  };

  componentDidMount ()
  {
    // if (!UserRoles.isAdmin()) {
    //   getAllInfoByUserLogin().then(({ data }) => {
    //     let idHealthOrg = data?.userOrganization?.org?.id
    //     this.setState({ idHealthOrg: idHealthOrg }, () => {
    //       this.updatePageData();
    //     })
    //   })
    // } else {
    //   this.updatePageData();
    // }
    this.updatePageData();
  }

  handleEditItem = item =>
  {
    this.setState( {
      item: item,
      shouldOpenEditorDialog: true
    } );
  };

  handleDelete = id =>
  {
    this.setState( {
      id,
      shouldOpenConfirmationDialog: true
    } );
  };

  async handleDeleteList ( list )
  {
    for ( var i = 0; i < list.length; i++ )
    {
      await deleteItem( list[i].id );
    }
  }

  handleDeleteAll = ( event ) =>
  {
    //alert(this.data.length);
    this.handleDeleteList( this.data ).then( () =>
    {
      this.updatePageData();
      this.handleDialogClose();
    }
    );
  };

  render ()
  {
    const { t, i18n } = this.props;
    let {
      keyword,
      rowsPerPage,
      page,
      totalElements,
      itemList,
      item,
      shouldOpenConfirmationDialog,
      shouldOpenEditorDialog,
      shouldOpenConfirmationDeleteAllDialog
    } = this.state;

    let columns = [
      { title: t( "user.username" ), field: "username", width: "150" },
      { title: t( "user.display_name" ), field: "person.displayName", width: "150" },
      { title: t( "user.email" ), field: "email", align: "left", width: "150" },
      // { title: t("Tổ y tế"), field: "healthCareGroup.name", align: "left", width: "150" },
      {
        title: t( "Action" ),
        field: "custom",
        align: "left",
        width: "250",
        render: rowData => <MaterialButton item={ rowData } id={ rowData.id ? rowData.id : null }
          onSelect={ ( rowData, method ) =>
          {
            if ( method === 0 )
            {
              getItemById( rowData.id ).then( ( { data } ) =>
              {
                if ( data.parent === null )
                {
                  data.parent = {};
                }
                this.setState( {
                  item: data,
                  shouldOpenEditorDialog: true
                } );
              } )
            } else if ( method === 1 )
            {
              this.handleDelete( rowData.id );
            } else
            {
              alert( 'Call Selected Here:' + rowData.id );
            }
          } }
        />
      },
    ];

    return (
      <div className="m-sm-30">

        <div className="mb-sm-30">
          <Breadcrumb routeSegments={ [{ name: t( 'user.title' ) }] } />
        </div>

        <Grid container spacing={ 3 }>
          <Grid item lg={ 7 } md={ 7 } sm={ 12 } xs={ 12 }>
            <Button
              className="mb-16 mr-16 btn btn-success d-inline-flex"
              startIcon={ <AddIcon /> }
              variant="contained"
              onClick={ () =>
              {
                this.handleEditItem( { startDate: new Date(), endDate: new Date(), isAddNew: true } );
              }
              }
            >
              { t( 'general.button.add' ) }
            </Button>

          </Grid>
          <Grid item lg={ 5 } md={ 5 } sm={ 12 } xs={ 12 } >
            <FormControl fullWidth>
              <Input
                className='mt-10 search_box w-100 stylePlaceholder'
                type="text"
                name="keyword"
                value={ keyword }
                onChange={ this.handleTextChange }
                onKeyDown={ this.handleKeyDownEnterSearch }
                placeholder={ t( 'Tìm kiếm' ) }
                id="search_box"
                startAdornment={
                  <InputAdornment >
                    <Link to="#"> <SearchIcon
                      onClick={ () => this.search( keyword ) }
                      style={ {
                        position: "absolute",
                        top: "0",
                        right: "0"
                      } } /></Link>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>

          <Grid item xs={ 12 }>
            <div>
              { shouldOpenEditorDialog && (
                <UserEditorDialog t={ t } i18n={ i18n }
                  handleClose={ this.handleDialogClose }
                  open={ shouldOpenEditorDialog }
                  handleOKEditClose={ this.handleOKEditClose }
                  item={ item }
                />
              ) }

              { shouldOpenConfirmationDialog && (
                <ConfirmationDialog
                  title={ t( "confirm" ) }
                  open={ shouldOpenConfirmationDialog }
                  onConfirmDialogClose={ this.handleDialogClose }
                  onYesClick={ this.handleConfirmationResponse }
                  text={ t( 'DeleteConfirm' ) }
                />
              ) }
            </div>
            <MaterialTable
              data={ itemList }
              columns={ columns }
              // parentChildData={(row, rows) => {
              //   var list = rows.find((a) => a.id === row.parentId)
              //   return list
              // }}
              options={ {
                selection: false,
                actionsColumnIndex: -1,
                paging: false,
                search: false,
                toolbar: false,
                rowStyle: ( rowData, index ) => ( {
                  backgroundColor: ( index % 2 === 1 ) ? '#EEE' : '#FFF',
                } ),
                maxBodyHeight: "440px",
                headerStyle: {
                  backgroundColor: "#337ab7",
                  color: "#fff",
                },
                tableLayout: 'fixed',
              } }
              onSelectionChange={ ( rows ) =>
              {
                this.data = rows;
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
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default User;
