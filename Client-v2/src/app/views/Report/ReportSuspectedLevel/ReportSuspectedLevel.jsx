import {
    Button, Card, Collapse, Grid, Icon, IconButton, Table, TableCell, TableHead,
    TableRow, Tooltip, withStyles
} from "@material-ui/core";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import FilterListIcon from "@material-ui/icons/FilterList";
import React, { Component } from "react";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import 'styles/globitsStyles.css';
import { getListPatientByAdminUnit, reportByAdminUnit } from "./ReportSuspectedLevelService";
import ViewListPatientDialog from "./ViewListPatientDialog";

class ReportSuspectedLevel extends Component {
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

    componentDidMount() {
        reportByAdminUnit('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', "commune").then(
            ({ data }) => {
                this.setState({ reportData: data });
            }
        )
    }

    reportByComuneId = (id) => {
        reportByAdminUnit(id, '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', "quarter").then(
            ({ data }) => {
                this.setState({ reportData: data });
            }
        )
    }
    reportByQuarterId = (id) => {
        reportByAdminUnit('00000000-0000-0000-0000-000000000000', id, '00000000-0000-0000-0000-000000000000', "town").then(
            ({ data }) => {
                this.setState({ reportData: data });
            }
        )
    }
    reportByDistrict = () => {
        reportByAdminUnit('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', "commune").then(
            ({ data }) => {
                this.setState({ reportData: data });
            }
        )
    }
    getListPatientByAdminUnit = (level, comuneId, quarterId, townId) => {
        getListPatientByAdminUnit(level, comuneId, quarterId, townId).then(
            ({ data }) => {
                let titleDialog = "";
                if (level === 'f0') {
                    titleDialog = "Danh sách bệnh nhân F0";
                } else if (level === 'f1') {
                    titleDialog = "Danh sách bệnh nhân F1";
                }
                this.setState({ listCasetData: data, openViewListPatientDialog: true, title: titleDialog });
            });
    }

    componentWillMount() {

    }

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
    updatePageData = () => {

    }

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

    render() {
        const { t, i18n, theme } = this.props;
        const {
            reportData,
            role,
            openViewListPatientDialog
        } = this.state;
        return (
            <div className="analytics m-sm-30">
                <Grid container spacing={3}>
                    {reportData && <Grid item lg={12} md={12} sm={12} xs={12}>
                        <div className="text-primary-d2 margin-auto">
                            <div className="card-title text-primary-d2 uppercase m-0">{t("Báo cáo mức độ nghi nhiễm")}</div>
                            {reportData.code == "town" && <ArrowBackIcon onClick={() => this.reportByComuneId(reportData?.details[0]?.parentAdminUnitid)} />}
                            {reportData.code == "quarter" && <ArrowBackIcon onClick={() => this.reportByDistrict()} />}
                            <div className="card-body">
                                <Table className="product-table" border={1}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className="px-24 ">
                                                Đơn vị hành chính
                                            </TableCell>
                                            <TableCell className="px-24" align="center">F0</TableCell>
                                            <TableCell className="px-24" align="center">F1</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {
                                        (reportData.details).map((element, index) => {
                                            return (
                                                <TableRow>
                                                    <TableCell className="px-24 ">
                                                        {reportData.code == "commune" && <a onClick={() => this.reportByComuneId(element.adminUnitId)} href="#">{element.adminUnit}</a>}
                                                        {reportData.code == "quarter" && <a onClick={() => this.reportByQuarterId(element.adminUnitId)} href="#">{element.adminUnit}</a>}
                                                        {reportData.code == "town" &&
                                                            <a href="#">{element.adminUnit}</a>
                                                        }
                                                    </TableCell>
                                                    <TableCell className="px-24 text-white bgc-danger-tp1" align="center">
                                                        {reportData.code == "commune" &&
                                                            <Link onClick={() => this.getListPatientByAdminUnit('f0', element.adminUnitId, '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000')}>
                                                                {element.f0}
                                                            </Link>
                                                        }
                                                        {reportData.code == "quarter" &&
                                                            <Link onClick={() => this.getListPatientByAdminUnit('f0', '00000000-0000-0000-0000-000000000000', element.adminUnitId, '00000000-0000-0000-0000-000000000000')}>
                                                                {element.f0}
                                                            </Link>
                                                        }
                                                        {reportData.code == "town" &&
                                                            <Link onClick={() => this.getListPatientByAdminUnit('f0', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', element.adminUnitId)}>
                                                                {element.f0}
                                                            </Link>
                                                        }
                                                    </TableCell>
                                                    <TableCell className="px-24 text-white bg-secondary" align="center">
                                                        {reportData.code == "commune" &&
                                                            <Link onClick={() => this.getListPatientByAdminUnit('f1', element.adminUnitId, '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000')}>
                                                                {element.f1}
                                                            </Link>
                                                        }
                                                        {reportData.code == "quarter" &&
                                                            <Link onClick={() => this.getListPatientByAdminUnit('f1', '00000000-0000-0000-0000-000000000000', element.adminUnitId, '00000000-0000-0000-0000-000000000000')}>
                                                                {element.f1}
                                                            </Link>
                                                        }
                                                        {reportData.code == "town" &&
                                                            <Link onClick={() => this.getListPatientByAdminUnit('f1', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', element.adminUnitId)}>
                                                                {element.f1}
                                                            </Link>
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                </Table>
                            </div>
                        </div>
                    </Grid>}
                    {openViewListPatientDialog && (
                        <ViewListPatientDialog
                            handleClose={this.handleCloseListPatientDialog}
                            open={openViewListPatientDialog}
                            title={this.state.title}
                            listCase={this.state.listCasetData}
                            t={t}
                        />
                    )}
                </Grid>
            </div>
        );
    }
}

export default withStyles({}, { withTheme: true })(ReportSuspectedLevel);
