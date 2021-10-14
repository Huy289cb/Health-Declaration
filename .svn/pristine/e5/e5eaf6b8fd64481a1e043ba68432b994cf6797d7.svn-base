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
import { searchByPage as getHealthCareGroup } from "../HealthCareGroup/HealthCareGroupService";
import './Filter.css';

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
        const filterItem = this.props.filterItem;
        this.setState({filterItem: filterItem});

        var searchObject = {};
        searchObject.pageIndex = 1;
        searchObject.pageSize = 10000;
        //no
        const role = JSON.parse(localStorage.getItem('role'));
        this.setState( {role} );

        getHealthCareGroup(searchObject).then(({ data }) => {
            // console.log(data.content);
            if (data && data.content) {
                this.setState({ listHealthCareGroup : data.content});
            }
        })

        getAdministrativeUnitByPage({...searchObject, isGetAllCity: true}).then(({ data }) => {
            if (data && data.content) {
                this.setState({listProvinceOfResidence: data.content});
                
                if (filterItem.provinceOfResidence) {

                    getAdministrativeUnitByPage({...searchObject, parentId: filterItem.provinceOfResidence.id}).then(({ data }) => {
                        if (data && data.content) {
                            this.setState({listDistrictOfResidence: data.content});
                        }
                    })
                };

                if (filterItem.districtOfResidence) {
                    getAdministrativeUnitByPage({...searchObject, parentId: filterItem.districtOfResidence.id}).then(({ data }) => {
                        if (data && data.content) {
                            this.setState({listWardOfResidence: data.content});
                        }
                    })
                };

                if(filterItem.wardOfResidence){
                    getAdministrativeUnitByPage({...searchObject, parentId: filterItem.wardOfResidence.id}).then(({ data }) => {
                        if (data && data.content) {
                            this.setState({listResidentialArea: data.content});
                        }
                    })
                }

                if(filterItem.residentialArea){
                    getAdministrativeUnitByPage({...searchObject, parentId: filterItem.residentialArea.id}).then(({ data }) => {
                        if (data && data.content) {
                            this.setState({listResidentialGroup: data.content});
                        }
                    })
                }
            }
        })
        
    }

    handleSelectdministrativeUnit = (value, source) => {
        let {filterItem} = this.state;

        if ("provinceOfResidence" == source) {
          filterItem ={
            ...filterItem,
            [source]: value,
            districtOfResidence: null, 
            residentialArea: null, 
            wardOfResidence: null, 
            residentialGroup: null
          }
    
          if (value != null) {
            getAdministrativeUnitByPage({
                pageIndex: 0,
                pageSize: 10000000,
                parentId: value.id,
            }).then(({ data }) => {
                if (data && data.content) {
                    this.setState({listDistrictOfResidence: data.content, filterItem: filterItem});
                }
            })
          } else {
            this.setState({ filterItem: filterItem});
          }
        }
        if ("districtOfResidence" == source) {
            filterItem = {
                ...filterItem,
                [source]: value,
                wardOfResidence: null,
                residentialArea: null, 
                residentialGroup: null
            }

          if (value != null) {
            getAdministrativeUnitByPage({
                pageIndex: 0,
                pageSize: 10000000,
                parentId: value.id,
            }).then(({ data }) => {
                if (data && data.content) {
                    this.setState({listWardOfResidence: data.content, filterItem: filterItem});
                }
            })
          } else {
            this.setState({ filterItem: filterItem });
          }
        }
        if ("wardOfResidence" == source) {
            filterItem = {
                ...filterItem,
                [source]: value,
                residentialArea: null, 
                residentialGroup: null
            }

          if (value != null) {
            getAdministrativeUnitByPage({
                pageIndex: 0,
                pageSize: 10000000,
                parentId: value.id,
            }).then(({ data }) => {
                if (data && data.content) {
                    this.setState({listResidentialArea: data.content, filterItem: filterItem});
                }
            })
          } else {
            this.setState({ filterItem: filterItem});
          }
        }
        if ("residentialArea" == source) {
            filterItem = {
                ...filterItem,
                [source]: value,
                residentialGroup: null
            }

            if (value != null) {
              getAdministrativeUnitByPage({
                  pageIndex: 0,
                  pageSize: 10000000,
                  parentId: value.id,
              }).then(({ data }) => {
                  if (data && data.content) {
                      this.setState({listResidentialGroup: data.content, filterItem: filterItem});
                  }
              })
            } else {
              this.setState({ filterItem: filterItem });
            }
          }
        if ("residentialGroup" == source) {
            filterItem = {
                ...filterItem,
                [source]: value,
            }

            this.setState({ filterItem: filterItem });
        };

        this.props.handleChangeFilter(filterItem);
    };

    onChangeSelect = (value, source) => {
        let {filterItem} = this.state;

        this.setState({filterItem: {...filterItem, [source]: value}}, () => this.props.handleChangeFilter(this.state.filterItem));
    }

    render() {
        let { t, search } = this.props;
        let { 
            listHealthCareGroup,
            listWardOfResidence,
            administrativeUnit,
            listHamletOfResidence,
            listProvinceOfResidence,
            listDistrictOfResidence,
            listResidentialGroup,
            listResidentialArea,
         } = this.state;
         const {healthCareGroup, provinceOfResidence, districtOfResidence, wardOfResidence, residentialArea, residentialGroup} = this.props.filterItem;

        return (
            <Grid className="filter-container" container spacing={2}>
                <Grid item md={3} lg={3} sm={3} xs={6}>
                    <h6 className="text-primary-d2">{t("Tổ y tế")}</h6>
                    <Autocomplete
                        options={listHealthCareGroup ? listHealthCareGroup : []}
                        getOptionLabel={(option) => option.name}
                        id="healthCareGroup"
                        defaultValue={healthCareGroup}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                size="small"
                                label=""
                                className="input"
                            />
                        )}
                        onChange={(event, value) => this.onChangeSelect(value, "healthCareGroup")}
                    />
                </Grid>
                <Grid item md={3} lg={3} sm={3} xs={6}>
                    <h6 className="text-primary-d2">{t('Tỉnh/TP')}</h6>
                    <Autocomplete
                        options={listProvinceOfResidence ? listProvinceOfResidence : []}
                        getOptionLabel={(option) => option.name}
                        id="provinceOfResidence"
                        defaultValue={provinceOfResidence}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                size="small"
                                label=""
                                className="input"
                            />
                        )}
                        onChange={(event, value) => this.handleSelectdministrativeUnit(value, "provinceOfResidence")}
                    />
                </Grid>
                <Grid item md={3} lg={3} sm={3} xs={6}>
                    <h6 className="text-primary-d2">{t('Quận/Huyện/Thị xã')}</h6>
                    <Autocomplete
                        options={listDistrictOfResidence ? listDistrictOfResidence : []}
                        getOptionLabel={(option) => option.name}
                        id="districtOfResidence"
                        defaultValue={districtOfResidence}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                size="small"
                                label=""
                                className="input"
                            />
                        )}
                        onChange={(event, value) => this.handleSelectdministrativeUnit(value, "districtOfResidence")}
                    />
                </Grid>
                <Grid item md={3} lg={3} sm={3} xs={6}>
                    {/* <h6 className="text-primary-d2">{t('Xã/Phường/Thị trấn')}</h6> */}
                    <h6 className="text-primary-d2">{t('Phường')}</h6>
                    <Autocomplete
                        options={listWardOfResidence ? listWardOfResidence : []}
                        getOptionLabel={(option) => option.name}
                        id="wardOfResidence"
                        defaultValue={wardOfResidence}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                size="small"
                                label=""
                                className="input"
                            />
                        )}
                        onChange={(event, value) => this.handleSelectdministrativeUnit(value, "wardOfResidence")}
                    />
                </Grid>
                <Grid item md={3} lg={3} sm={3} xs={6}>
                    <h6 className="text-primary-d2">{t('Khu phố')}</h6>
                    <Autocomplete
                        options={listResidentialArea ? listResidentialArea : []}
                        getOptionLabel={(option) => option.name}
                        id="residentialArea"
                        defaultValue={residentialArea}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                size="small"
                                label=""
                                className="input"
                            />
                        )}
                        onChange={(event, value) => this.handleSelectdministrativeUnit(value, "residentialArea")}
                    />
                </Grid>
                <Grid item md={3} lg={3} sm={3} xs={6}>
                    <h6 className="text-primary-d2">{t('Tổ dân phố')}</h6>
                    <Autocomplete
                        options={listResidentialGroup ? listResidentialGroup : []}
                        getOptionLabel={(option) => option.name}
                        id="residentialGroup"
                        defaultValue={residentialGroup}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                size="small"
                                label=""
                                className="input"
                            />
                        )}
                        onChange={(event, value) => this.handleSelectdministrativeUnit(value, "residentialGroup")}
                    />
                </Grid>
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
                            const {healthCareGroup, residentialGroup, residentialArea, wardOfResidence, districtOfResidence, provinceOfResidence} = this.state.filterItem;

                            if(healthCareGroup){
                                searchObject.healthCareGroupId = healthCareGroup.id;
                            }
                            
                            if (residentialGroup) {
                                searchObject.administrativeUnitId = residentialGroup.id;
                            }
                            else if (residentialArea) {
                                searchObject.administrativeUnitId = residentialArea.id;
                            }
                            else if (wardOfResidence) {
                                searchObject.administrativeUnitId = wardOfResidence.id;
                            }
                            else if (districtOfResidence) {
                                searchObject.administrativeUnitId = districtOfResidence.id;
                            } else if (provinceOfResidence) {
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