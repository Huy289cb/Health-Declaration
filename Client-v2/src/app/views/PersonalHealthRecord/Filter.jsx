import React from 'react';
import {
    Grid,
    Button,
    TextField,
    FormControl,
    Select,
    InputLabel,
    MenuItem
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SearchIcon from '@material-ui/icons/Search';
import {
    getByPageByParentId as getAdministrativeUnitByPage,
} from "../AdministrativeUnit/AdministrativeUnitService";
import { searchByPage as getHealthCareGroup } from "../HealthCareGroup/HealthCareGroupService";
import './Filter.css';
import { RESOLVE_STATUS_CONST } from 'app/appConfig';
import localStorageService from "app/services/localStorageService";

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
        
    }

    componentDidMount() {

        var searchObject = {};
        searchObject.pageIndex = 1;
        searchObject.pageSize = 10000;
        //no
        this.setState({role: localStorageService.getItem("role")});

        getHealthCareGroup(searchObject).then(({ data }) => {
            // console.log(data.content);
            if (data && data.content) {
                this.setState({ listHealthCareGroup : data.content});
            }
        })

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
                    this.setState({listDistrictOfResidence: data.content, districtOfResidence: null, 
                        residentialArea: null, wardOfResidence: null, residentialGroup: null});
                }
            })
          } else {
            this.setState({ districtOfResidence: null, wardOfResidence: null, residentialArea: null,
                 residentialGroup: null });
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
                    this.setState({listWardOfResidence: data.content, wardOfResidence: null,
                         residentialArea: null, residentialGroup: null});
                }
            })
          } else {
            this.setState({ wardOfResidence: null, residentialArea: null, residentialGroup: null });
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
                    this.setState({listResidentialArea: data.content, residentialArea: null, residentialGroup: null});
                }
            })
          } else {
            this.setState({ wardOfResidence: null, residentialArea: null, residentialGroup: null });
          }
        }
        if ("residentialArea" == source) {
            this.setState({ residentialArea: value });
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
              this.setState({ residentialArea: null, residentialGroup: null });
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
            listHamletOfResidence,
            provinceOfResidence,
            listProvinceOfResidence,
            listDistrictOfResidence,
            residentialGroup,
            listResidentialGroup,
            residentialArea,
            listResidentialArea,
            resolveStatus,
            role,
         } = this.state;
         console.log(role);
        return (
            <Grid className="filter-container" container spacing={2}>
            {(role == "ROLE_ADMIN" || role == "ROLE_SUPER_ADMIN") &&
            <>
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
                    <h6 className="text-primary-d2">{t('Quận/Huyện')}</h6>
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
                <Grid item md={3} lg={3} sm={3} xs={6}>
                    <h6 className="text-primary-d2">{t('Khu phố')}</h6>
                    <Autocomplete
                        options={listResidentialArea ? listResidentialArea : []}
                        getOptionLabel={(option) => option.name}
                        id="residentialArea"
                        value={residentialArea ? residentialArea : null}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                size="small"
                                label=""
                                className="input"
                            />
                        )}
                        onChange={(event, value) => { this.handleSelectdministrativeUnit(value, "residentialArea") }}
                    />
                </Grid>
                <Grid item md={3} lg={3} sm={3} xs={6}>
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
            </>}
                <Grid item md={3} lg={3} sm={3} xs={6}>
                    <h6 className="text-primary-d2">{t("Trạng thái xử lý")}</h6>
                    <Autocomplete
                        options={RESOLVE_STATUS_CONST ? RESOLVE_STATUS_CONST : []}
                        getOptionLabel={(option) => option.display}
                        id="resolveStatus"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                size="small"
                                label=""
                                className="input"
                            />
                        )}
                        onChange={(event, value) => { 
                            this.setState({ resolveStatus: value })
                         }}
                    />
                    {/* <FormControl fullWidth={true} variant="outlined" size="small">
                        <InputLabel htmlFor="temperature-simple">
                            {
                            <span>{t("Trạng thái xử lý")}</span>
                            }
                        </InputLabel>
                        <Select
                            label={
                            <span>{t("Trạng thái xử lý")}</span>
                            }
                            value={resolveStatus ? resolveStatus : ""}
                            onChange={(event) => {
                            this.setState({ resolveStatus: event.target.value })
                            }}
                            inputProps={{
                            name: "resolveStatus",
                            id: "resolveStatus-simple",
                            }}
                            validators={["required"]}
                            errorMessages={[t("general.required")]}
                        >
                            {RESOLVE_STATUS_CONST.map((item) => {
                                console.log(item);
                            return (
                                <MenuItem key={item.key} value={item.value}>
                                    {item.display ? item.display : ""}
                                </MenuItem>
                            );
                            })}
                        </Select>
                    </FormControl> */}
                </Grid>
                <Grid item md={3} lg={3} sm={3} xs={6}>
                    <h6 className="text-primary-d2">&nbsp;</h6>
                    <Button
                        variant="contained"
                        className="btn btn-primary-d d-inline-flex"
                        onClick={() => {
                            var searchObject = {};
                            searchObject.healthCareGroupId = this.state.healthCareGroupId;
                            if (resolveStatus != null) {
                                searchObject.resolveStatus = resolveStatus.value;
                            }
                            
                            if (residentialGroup != null) {
                                searchObject.administrativeUnitId = residentialGroup.id;
                            }
                            else if (residentialArea != null) {
                                searchObject.administrativeUnitId = residentialArea.id;
                            }
                            else if (wardOfResidence != null) {
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