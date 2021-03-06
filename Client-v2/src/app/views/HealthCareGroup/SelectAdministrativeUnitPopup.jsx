import { Button, Dialog, DialogActions, Grid, Input, InputAdornment, Radio } from "@material-ui/core";
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';
import MaterialTable, { MTableToolbar } from 'material-table';
import React from "react";
import Draggable from 'react-draggable';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { searchByPage } from "../AdministrativeUnit/AdministrativeUnitService";
import NicePagination from "../Component/Pagination/NicePagination";
toast.configure( {
  autoClose: 1000,
  draggable: false,
  limit: 3
} );
function PaperComponent ( props )
{
  return (
    <Draggable handle="#draggable-dialog-title" cancel={ '[class*="MuiDialogContent-root"]' }>
      <Paper { ...props } />
    </Draggable>
  );
}
class SelectAdministrativeUnitPopup extends React.Component
{
  constructor ( props )
  {
    super( props );
    this.handleChange = this.handleChange.bind( this );
  }
  state = {
    rowsPerPage: 5,
    page: 1,
    data: [],
    totalElements: 0,
    totalPages: 10,
    itemList: [],
    shouldOpenEditorDialog: false,
    shouldOpenConfirmationDialog: false,
    selectedItem: {},
    keyword: '',
    shouldOpenProductDialog: false,
    item: null,
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
      this.search();
    } )
  };

  handleChangePage = ( event, newPage ) =>
  {
    this.setPage( newPage );
  };

  updatePageData = ( item ) =>
  {
    var searchObject = {};
    if ( item != null )
    {
      this.setState( {
        page: 1,
        text: item.text,
        orgType: item.orgType,
      }, () =>
      {
        var searchObject = {};
        searchObject.text = this.state.keyword;
        searchObject.pageIndex = this.state.page;
        searchObject.pageSize = this.state.rowsPerPage;
        searchByPage( searchObject, this.state.page, this.state.rowsPerPage ).then( ( { data } ) =>
        {
          this.setState( { itemList: [...data.content], totalElements: data.totalElements, totalPages: data.totalPages } )
        } );
      } )
    } else
    {
      var searchObject = {};
      searchObject.text = this.state.keyword;
      searchObject.pageIndex = this.state.page;
      searchObject.pageSize = this.state.rowsPerPage;
      searchByPage( searchObject, this.state.page, this.state.rowsPerPage ).then( ( { data } ) =>
      {
        this.setState( { itemList: [...data.content], totalElements: data.totalElements, totalPages: data.totalPages } )
      } );
    }
  };

  componentDidMount ()
  {
    this.updatePageData();

  }
  getName = ( item ) =>
  {
    var address = item.name;
    if ( item.parent != null )
    {
      address = item.name + ' - ' + item.parent.name;
      if ( item.parent.parent != null )
      {
        address += ' - ' + item.parent.parent.name;
        if ( item.parent.parent.parent != null )
        {
          address += ' - ' + item.parent.parent.parent.name;
        }
      }
    }
    return address;
  }

  getLevel = ( level ) =>
  {
    var levelName;
    if ( level === 1 )
    {
      levelName = "Th??nh ph???";
    }
    if ( level === 2 )
    {
      levelName = "Qu???n/huy???n";
    }
    if ( level === 3 )
    {
      levelName = "X??/Ph?????ng";
    }
    return levelName;
  }

  handleClick = ( event, item ) =>
  {
    //alert(item);
    if ( item.id != null )
    {
      this.setState( { selectedValue: item.id, selectedItem: item } );
    } else
    {
      this.setState( { selectedValue: null, selectedItem: null } );
    }
  }

  componentWillMount ()
  {
    let { open, handleClose, selectedItem } = this.props;
    //this.setState(item);
    this.setState( { selectedValue: selectedItem.id } );
  }

  handleKeyDownEnterSearch = e =>
  {
    if ( e.key === 'Enter' )
    {
      this.search();
    }
  };

  search ()
  {
    this.setState( { page: 0 }, function ()
    {
      var searchObject = {};
      searchObject.text = this.state.keyword;
      searchObject.pageIndex = this.state.page + 1;
      searchObject.pageSize = this.state.rowsPerPage;
      searchByPage( searchObject, this.state.page, this.state.rowsPerPage ).then( ( { data } ) =>
      {
        this.setState( { itemList: [...data.content], totalElements: data.totalElements, totalPages: data.totalPages } )
      } );
      //this.updatePageData();
    } );
  }

  handleChange = ( event, source ) =>
  {
    event.persist();
    this.setState( {
      [event.target.name]: event.target.value
    } );
  };

  handleOpenProductDialog = () =>
  {
    this.setState( {
      shouldOpenProductDialog: true
    } )
  }

  handleDialogProductClose = () =>
  {
    this.setState( {
      shouldOpenProductDialog: false
    } )
  }

  handleOKEditClose = () =>
  {
    this.setState( {
      shouldOpenProductDialog: false
    } );
    this.updatePageData();
  };

  onClickRow = ( selectedRow ) =>
  {
    document.querySelector( `#radio${ selectedRow.id }` ).click();
  }

  render ()
  {
    const { t, i18n, handleClose, handleSelect, selectedItem, open, itemConvertList } = this.props;
    let { keyword, shouldOpenProductDialog, itemList } = this.state;
    let columns = [
      {
        title: t( "Ch???n" ),
        field: "custom",
        align: "left",
        width: "250",
        render: rowData => <Radio id={ `radio${ rowData?.id }` } name="radSelected" value={ rowData?.id } checked={ this.state.selectedValue === rowData.id } onClick={ ( event ) => this.handleClick( event, rowData ) } />
      },
      {
        title: t( "M?? ????n v???" ),
        field: "code",
        align: "left",
        width: "150",
      },
      {
        title: t( "T??n ????n v???" ),
        field: "name",
        width: "150",
        render: ( item ) => this.getName( item )
      },
      {
        title: t( "C???p ????n v???" ),
        field: "name",
        width: "150",
        render: ( item ) => this.getLevel( item.level )
      }
    ];
    return (
      <Dialog onClose={ handleClose } open={ open } PaperComponent={ PaperComponent } maxWidth={ 'md' } fullWidth>
        <DialogTitle style={ { cursor: 'move' } } id="draggable-dialog-title">
          <span className="mb-20">{ "" }</span>
        </DialogTitle>
        <DialogContent>
          <Grid item container xs={ 12 }>
            <Grid item lg={ 7 } md={ 7 } sm={ 12 } sx={ 12 }>

            </Grid>
            <Grid item lg={ 5 } md={ 5 } sm={ 12 } sx={ 12 }>
              <Input
                label={ t( 'T??m ki???m' ) }
                type="text"
                name="keyword"
                value={ keyword }
                onChange={ this.handleChange }
                onKeyDown={ this.handleKeyDownEnterSearch }
                onKeyUp={ this.handleKeyUp }
                // style={{ width: '50%'}}
                className="w-100 mb-16 mr-12"
                id="search_box"
                placeholder={ t( 'T??m ki???m' ) }
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
            </Grid>

          </Grid>
          <Grid item xs={ 12 }>

            <MaterialTable
              data={ itemList }
              columns={ columns }
              onRowClick={ ( ( evt, selectedRow ) => this.onClickRow( selectedRow ) ) }
              parentChildData={ ( row, rows ) =>
              {
                var list = rows.find( a => a.id === row.parentId );
                return list;
              } }
              options={ {
                toolbar: false,
                selection: false,
                actionsColumnIndex: -1,
                paging: false,
                search: false
              } }
              components={ {
                Toolbar: props => (
                  <div style={ { width: "100%" } }>
                    <MTableToolbar { ...props } />
                  </div>
                ),
              } }
              onSelectionChange={ ( rows ) =>
              {
                this.data = rows;
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
        </DialogContent>
        <DialogActions>
          <Button
            className="mb-16 mr-16 align-bottom"
            variant="contained"
            color="secondary"
            onClick={ () => handleClose() }
          >
            H???y
          </Button>
          <Button className="mb-16 mr-16 align-bottom"
            variant="contained"
            color="primary"
            onClick={ () => handleSelect( this.state.selectedItem ) }
          >
            Ch???n
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
export default SelectAdministrativeUnitPopup;
