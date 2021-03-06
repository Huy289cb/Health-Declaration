import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  Card,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Icon,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell
} from "@material-ui/core";
import Draggable from 'react-draggable';
import Paper from '@material-ui/core/Paper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MaterialTable from 'material-table';
import BlockIcon from '@material-ui/icons/Block';
import moment from "moment";
import appConfig from "../../appConfig";
import { ValidatorForm } from "react-material-ui-form-validator";
import SaveIcon from '@material-ui/icons/Save';
import { update } from "../PersonalHealthRecord/PersonalHealthRecordService";
import { Link } from "react-router-dom";
import ConstantList from "../../appConfig";
import NicePagination from "../Component/Pagination/NicePagination";

toast.configure({
  autoClose: 1000,
  draggable: false,
  limit: 3
});

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

class ViewListPatientDialog extends Component {
  state = {
    rowsPerPage: 10,
    totalPages: 5,
    page: 1,
    itemData: []
  };

  componentWillMount() {
    let { item } = this.props;
    this.setState({ ...item });
    this.updatePageData();
  }

  renderNamePhone = (name, phone) => {
    let text = [];
    if (name != null) {
      text.push(<div>{name}</div>)
    }
    if (phone != null) {
      text.push(<div>{phone}</div>)
    }

    return text
  }

  renderSpo2 = (value) => {
    let spo2 = "";
    ConstantList.SPO2_CONST.map((item) => {
      if (item.value == value) {
        spo2 = item.key
      }
    })

    return spo2;
  }

  renderHealthRecordType = (value) =>{
    let type = "";
    ConstantList.PERSONAL_HEALTH_RECORD_TYPE.map((item)=>{
      if(item.key == value){
        type = item.value;
      }
    })
    return type;
  }

  renderBreathingrate = (value) => {
    let Breathingrate = "";
    ConstantList.BREATHINGRATE_CONST.map((item) => {
      if (item.value == value) {
        Breathingrate = item.key
      }
    })

    return Breathingrate;
  }

  renderTemperature = (value) => {
    let Temperature = "";
    ConstantList.TEMPERATURE_CONST.map((item) => {
      if (item.value == value) {
        Temperature = item.key
      }
    })

    return Temperature;
  }

  updatePageData = (item) => {
    let { listCase } = this.props; 
    let {page, rowsPerPage, totalPages, totalElements, itemData} = this.state;
    itemData = [];
    if(listCase != null & listCase.length > 0){
      for (let index = 0; index < listCase.length; index++) {
          if(index >= (page - 1) * rowsPerPage && index < page * rowsPerPage){
            itemData.push(listCase[index])
          }
      }
      if(listCase.length%rowsPerPage == 0){
        totalPages = (listCase.length - listCase.length%rowsPerPage)/rowsPerPage
      }else{
        totalPages = (listCase.length - listCase.length%rowsPerPage)/rowsPerPage   + 1
      }
      
      this.setState({itemData: itemData, totalElements: listCase.length, totalPages: totalPages})
    }
   
  };

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

  render() {
    //   debugger
    let { open, handleClose, title, listCase, t } = this.props;
    let {
      declarationTime,
      familyMember,
      spo2,
      breathingRate,
      temperature,
      contactPersonName,
      contactPersonPhone,
      contactPersonRelation,
      nomalSystoms,
      severeSymptoms,
      resolveStatus,
      seriusStatus,
      itemData
    } = this.state;
    let columns = [
      {
        title: "H??? t??n ca b???nh",
        field: "code",
        width: '100',
        render: rowData => this.renderNamePhone(rowData.familyMember.member.displayName, rowData.familyMember.member.phoneNumber)
      },
      {
        title: 'H??? gia ????nh',
        field: "name",
        width: '150',
        render: rowData => this.renderNamePhone(rowData.familyMember.family.displayName, rowData.familyMember.family.phoneNumber)
      },
      {
        title: '?????a ch???',
        field: "age",
        width: '100',
        render: rowData => this.renderNamePhone(rowData.familyMember.family.detailAddress, rowData.familyMember.family.administrativeUnit.name)
      },
      {
        title: 'SpO2',
        field: "phoneNumber",
        width: '100',
        render: rowData => this.renderSpo2(rowData.spo2)
      },
      {
        title: 'Nh???p th???',
        field: "breathingRate",
        width: '100',
        render: rowData => this.renderBreathingrate(rowData.breathingRate)
      },
      {
        title: 'Nhi???t ?????',
        field: "temperature",
        width: '100',
        render: rowData => this.renderTemperature(rowData.temperature)
      },
      {
        title: 'Lo???i khai b??o',
        field: "type",
        width: '100',
        render: rowData => this.renderHealthRecordType(rowData.type)
      },
    ]
    return (
      <Dialog
        className="dialog-container"
        open={open}
        fullWidth
        maxWidth="xl"
      >
        <DialogTitle
          className="dialog-header bgc-primary-d1"
          style={{ cursor: 'move' }}
          id="draggable-dialog-title"
        >
          <span className="mb-20 text-white" > {title} </span>
          <IconButton style={{ position: "absolute", right: "10px", top: "10px" }} onClick={() => handleClose()}>
            <Icon color="disabled">close</Icon>
          </IconButton>
        </DialogTitle>
          <DialogContent>
            <Card elevation={12} className="">
              {listCase &&
                <>
                  {/* <Table className="product-table" style={{tableLayout:'unset'}} >
                            <TableHead>
                                <TableRow>
                                     <TableCell className="px-24 ">                          
                                    T??n ng?????i li??n h???                          
                                    </TableCell> 
                                    <TableCell className="px-24 ">                          
                                    ??i???n tho???i ng?????i li??n h???                          
                                    </TableCell>
                                    <TableCell className="px-24" align="center">H??? t??n ca b???nh</TableCell>
                                    <TableCell className="px-24" align="center">H??? gia ????nh</TableCell>
                                    <TableCell className="px-24" align="center">?????a ch???</TableCell>
                                    <TableCell className="px-24" align="center">SpO2</TableCell>
                                    <TableCell className="px-24" align="center">Nh???p th???</TableCell>
                                    <TableCell className="px-24" align="center">Nhi???t ?????</TableCell>
                                </TableRow>
                            </TableHead>
                            {(listCase).map((element, index) => {
                                return (
                                    <TableRow>
                                       
                                      
                                        <TableCell className="px-24" align="left">
                                            {element.familyMember.member.displayName}  <br/> 
                                            {element.familyMember.member.phoneNumber}   
                                        </TableCell>
                                        <TableCell className="px-24" align="left">
                                            {element.familyMember.family.name} <br/> 
                                            {element.familyMember.family.phoneNumber}                            
                                        </TableCell>
                                        <TableCell className="px-24" align="left">
                                            {element.familyMember.family.detailAddress} <br/>
                                            {element.familyMember.family.administrativeUnit.name}                                                                      
                                        </TableCell>
                                        <TableCell className="px-24" align="center">
                                            {element.spo2<1 && <span>{'<87'}</span>}
                                            {element.spo2==1 && <span>{'87-89'}</span>}
                                            {element.spo2==2 && <span>{'90-91'}</span>}
                                            {element.spo2==4 && <span>{'94'}</span>}
                                            {element.spo2==4 && <span>{'94'}</span>}
                                            {element.spo2==5 && <span>{'95-96'}</span>}
                                            {element.spo2==6 && <span>{'>96'}</span>}                            
                                        </TableCell>
                                        <TableCell className="px-24" align="center">
                                            {element.breathingRate}
                                        </TableCell>
                                        <TableCell className="px-24" align="center">
                                            {element.temperature}
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                            }
                        
                        </Table>
                        */}
                  <MaterialTable
                    data={itemData}
                    columns={columns}
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
                </>
              }
            </Card>
          </DialogContent>
        {/* <div className="dialog-footer">
          <DialogActions className="p-0">

          </DialogActions>
        </div> */}

      </Dialog>
    );
  }
}

export default ViewListPatientDialog;