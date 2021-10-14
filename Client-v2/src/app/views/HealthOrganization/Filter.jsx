import React from 'react';
import {
    Grid,
    Button,
    TextField
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SearchIcon from '@material-ui/icons/Search';
import {
    getByPageByParentId as getAdministrativeUnitByPage,
} from "../AdministrativeUnit/AdministrativeUnitService";
// import { searchByPage as getHealthCareGroup } from "../HealthCareGroup/HealthCareGroupService";
import '../PersonalHealthRecord/Filter.css';

class Filter extends React.Component {
    state = {
        // provinceOfResidenceSearch: {
        //     pageIndex: 0,
        //     pageSize: 10000000,
        //     isGetAllCity: true,
        // },
        // provinceOfResidence: null,
        // districtOfResidence: null,
        // districtOfResidenceSearch: {},
        // wardOfResidenceSearch: {},
        // wardOfResidence: null,
        // administrativeUnit: null,
        // hamletOfResidenceSearch: {},
    }
    changeSelected = (value, source) => {
        let { t } = this.props;
        if (source === "healthCareGroup") {
            this.setState({ healthCareGroupId: value ? (value.id ? value.id : null) : null })
        }
        let obj = {
            pageIndex: 1,
            pageSize: 10000
        }
        // if (source === "rootUnit") {
        //     if (value != null && value.id != null) {
        //         if (value.isBackUnit != null) {
        //             this.setState({ rootUnit: value, address: value }, () => {
        //                 if (value.parent != null) {
        //                     this.setState({ rootUnit: null, address: null }, () => {
        //                         getAdministrativeUnitByPage({...obj, parentId: value.parent.id}).then(({ data }) => {
        //                             if (data && data.content) {
        //                                 data.content[0].isBackUnit = 1;
        //                                 data.content[0].name = "< " + t('general.button.back');
        //                                 this.setState({ adminitrativeOption: data.content });
        //                             }
        //                         });
        //                     })
        //                 }
        //                 else if (value.parent == null || value.parent.id == null) {
        //                     this.setState({ rootUnit: null, address: null }, () => {
        //                         getAdministrativeUnitByPage({...obj, isGetAllCity: true}).then(({ data }) => {
        //                             this.setState({ adminitrativeOption: data.content });
        //                         })
        //                     })
        //                 }
        //             })
        //         }
        //         else {
        //             this.setState({ rootUnit: value ? (value.id ? value.id : null) : null, address: value }, () => {
        //                 getAdministrativeUnitByPage({...obj, parentId: value.id}).then(({ data }) => {
        //                     if (data && data.content) {
        //                         data.content[0].isBackUnit = 1;
        //                         data.content[0].name = "< " + t('general.button.back');
        //                         this.setState({ adminitrativeOption: data.content });
        //                     }
        //                 })
        //             })
        //         }
        //     }

        // }
    }

    componentDidMount() {

        var searchObject = {};
        searchObject.pageIndex = 1;
        searchObject.pageSize = 10000;
        //no
        const role = JSON.parse(localStorage.getItem('role'));
        this.setState( {role} );

        // getHealthCareGroup(searchObject).then(({ data }) => {
        //     // console.log(data.content);
        //     if (data && data.content) {
        //         this.setState({ listHealthCareGroup : data.content});
        //     }
        // })

        getAdministrativeUnitByPage({...searchObject, isGetAllCity: true}).then(({ data }) => {
            if (data && data.content) {
                this.setState({listProvinceOfResidence: data.content})
                let province = data.content.find((element) => element.name == "Hồ Chí Minh");
                if (province) {
                    this.setState({provinceOfResidence: province});
                    getAdministrativeUnitByPage({...searchObject, parentId: province.id}).then(({ data }) => {
                        if (data && data.content) {
                            this.setState({listDistrictOfResidence: data.content});
                            let district7 = data.content.find((element) => element.name == "Quận 7");
                            if (district7) {
                                this.setState({districtOfResidence: district7})
                                getAdministrativeUnitByPage({...searchObject, parentId: district7.id}).then(({ data }) => {
                                    if (data && data.content) {
                                        this.setState({listWardOfResidence: data.content});
                                    }
                                })
                            }
                        }
                    })
                }
            }
        })
        
    }

    handleSelectdministrativeUnit = (value, source) => {
        if ("provinceOfResidence" == source) {
          this.setState({ provinceOfResidence: value });
    
          if (value != null) {
            getAdministrativeUnitByPage({
                pageIndex: 0,
                pageSize: 10000000,
                parentId: value.id,
            }).then(({ data }) => {
                if (data && data.content) {
                    this.setState({listDistrictOfResidence: data.content, districtOfResidence: null, wardOfResidence: null, residentialGroup: null});
                }
            })
          } else {
            this.setState({ districtOfResidence: null, wardOfResidence: null, administrativeUnit: null, residentialGroup: null });
          }
        }
        if ("districtOfResidence" == source) {
          this.setState({ districtOfResidence: value });
          if (value != null) {
            getAdministrativeUnitByPage({
                pageIndex: 0,
                pageSize: 10000000,
                parentId: value.id,
            }).then(({ data }) => {
                if (data && data.content) {
                    this.setState({listWardOfResidence: data.content, wardOfResidence: null, residentialGroup: null});
                }
            })
          } else {
            this.setState({ wardOfResidence: null, administrativeUnit: null, residentialGroup: null });
          }
        }
        if ("wardOfResidence" == source) {
          this.setState({ wardOfResidence: value });
          if (value != null) {
            getAdministrativeUnitByPage({
                pageIndex: 0,
                pageSize: 10000000,
                parentId: value.id,
            }).then(({ data }) => {
                if (data && data.content) {
                    this.setState({listResidentialGroup: data.content, residentialGroup: null});
                }
            })
          } else {
            this.setState({ wardOfResidence: null, administrativeUnit: null, residentialGroup: null });
          }
        }
        if ("residentialGroup" == source) {
          this.setState({ residentialGroup: value });
        }
    };

    render() {
        let { t, search } = this.props;
        let { 
            listHealthCareGroup,
            districtOfResidence,
            wardOfResidence,
            listWardOfResidence,
            administrativeUnit,
            listHamletOfResidence,
            provinceOfResidence,
            listProvinceOfResidence,
            listDistrictOfResidence,
            residentialGroup,
            listResidentialGroup,
         } = this.state;
        return (
            <Grid className="filter-container" container spacing={2}>
                <Grid item md={3} lg={3} sm={3} xs={6}>
                    <h6 className="text-primary-d2">{t('Tỉnh/TP')}</h6>
                    <Autocomplete
                        options={listProvinceOfResidence ? listProvinceOfResidence : []}
                        getOptionLabel={(option) => option.name}
                        id="provinceOfResidence"
                        value={provinceOfResidence ? provinceOfResidence : null}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                size="small"
                                label=""
                                className="input"
                            />
                        )}
                        onChange={(event, value) => { this.handleSelectdministrativeUnit(value, "provinceOfResidence") }}
                    />
                </Grid>
                <Grid item md={3} lg={3} sm={3} xs={6}>
                    <h6 className="text-primary-d2">{t('Quận/Huyện/Thị xã')}</h6>
                    <Autocomplete
                        options={listDistrictOfResidence ? listDistrictOfResidence : []}
                        getOptionLabel={(option) => option.name}
                        id="districtOfResidence"
                        value={districtOfResidence ? districtOfResidence : null}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                size="small"
                                label=""
                                className="input"
                            />
                        )}
                        onChange={(event, value) => { this.handleSelectdministrativeUnit(value, "districtOfResidence") }}
                    />
                </Grid>
                <Grid item md={3} lg={3} sm={3} xs={6}>
                    {/* <h6 className="text-primary-d2">{t('Xã/Phường/Thị trấn')}</h6> */}
                    <h6 className="text-primary-d2">{t('Phường')}</h6>
                    <Autocomplete
                        options={listWardOfResidence ? listWardOfResidence : []}
                        getOptionLabel={(option) => option.name}
                        id="wardOfResidence"
                        value={wardOfResidence ? wardOfResidence : null}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                size="small"
                                label=""
                                className="input"
                            />
                        )}
                        onChange={(event, value) => { this.handleSelectdministrativeUnit(value, "wardOfResidence") }}
                    />
                </Grid>
                {/* <Grid item md={3} lg={3} sm={3} xs={6}>
                    <h6 className="text-primary-d2">{t('Tổ dân phố')}</h6>
                    <Autocomplete
                        options={listResidentialGroup ? listResidentialGroup : []}
                        getOptionLabel={(option) => option.name}
                        id="residentialGroup"
                        value={residentialGroup ? residentialGroup : null}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                size="small"
                                label=""
                                className="input"
                            />
                        )}
                        onChange={(event, value) => { this.handleSelectdministrativeUnit(value, "residentialGroup") }}
                    />
                </Grid> 
                <Grid item md={3} lg={3} sm={3} xs={6}>
                    <h6 className="text-primary-d2">{t("Tổ y tế")}</h6>
                    <Autocomplete
                        options={listHealthCareGroup ? listHealthCareGroup : []}
                        getOptionLabel={(option) => option.name}
                        id="healthCareGroup"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                size="small"
                                label=""
                                className="input"
                            />
                        )}
                        // getOptionSelected={(option, value) => option.code === value.code}
                        onChange={(event, value) => { this.changeSelected(value, "healthCareGroup") }}
                    />
                </Grid>
                */}
                {/* <Grid item md={3} lg={3} sm={3} xs={6}>
                    <h6 className="text-primary-d2">{t('Tỉnh/TP')}</h6>
                    <Autocomplete
                        disableCloseOnSelect={true}
                        options={listProvinceOfResidence}
                        getOptionLabel={(option) => option.name}
                        id="provinceOfResidence"
                        value={provinceOfResidence ? provinceOfResidence : null}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                size="small"
                                label=""
                                className="input"
                            />
                        )}
                        onChange={(event, value) => { this.handleSelectdministrativeUnit(value, "provinceOfResidence") }}
                    />
                </Grid> */}
                {/* <Grid item md={3} lg={3} sm={3} xs={6}>
                    <h6 className="text-primary-d2">{t('hiv_case.address')}</h6>
                    <Autocomplete
                        disableCloseOnSelect={true}
                        options={this.state.adminitrativeOption}
                        getOptionLabel={(option) => option.name}
                        id="address"
                        value={this.state.address ? this.state.address : null}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                size="small"
                                label=""
                                className="input"
                            />
                        )}
                        // getOptionSelected={(option, value) => option.code === value.code}
                        onChange={(event, value) => { this.changeSelected(value, "rootUnit") }}
                    />
                </Grid> */}
                <Grid item md={3} lg={3} sm={3} xs={6}>
                    <h6 className="text-primary-d2">&nbsp;</h6>
                    <Button
                        variant="contained"
                        className="btn btn-primary-d d-inline-flex"
                        onClick={() => {
                            var searchObject = {};
                            // searchObject.healthCareGroupId = this.state.healthCareGroupId;
                            
                            // if (residentialGroup != null) {
                            //     searchObject.administrativeUnitId = residentialGroup.id;
                            // }
                            // else 
                            if (wardOfResidence != null) {
                                searchObject.administrativeUnitId = wardOfResidence.id;
                            }
                            else if (districtOfResidence != null) {
                                searchObject.administrativeUnitId = districtOfResidence.id;
                            }
                            else if (provinceOfResidence != null) {
                                searchObject.administrativeUnitId = provinceOfResidence.id;
                            }
                            search(searchObject)
                        }}
                    >
                        <SearchIcon />
                        {t("general.button.search")}
                    </Button>
                </Grid>
            </Grid>
        );
    }
}
export default Filter;