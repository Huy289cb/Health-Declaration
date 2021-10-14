import React from 'react';
import {
    Grid,
    Button,
    TextField
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SearchIcon from '@material-ui/icons/Search';
import { searchByPage as getHealthCareGroup } from "../../HealthCareGroup/HealthCareGroupService";
import '../../PersonalHealthRecord/Filter.css';

class Filter extends React.Component {
    state = {
        
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

        const role = JSON.parse(localStorage.getItem('role'));
        this.setState( {role} );

        getHealthCareGroup(searchObject).then(({ data }) => {
            if (data && data.content) {
                this.setState({ listHealthCareGroup : data.content});
            }
        })

    }

    render() {
        let { t, search } = this.props;
        let { 
            listHealthCareGroup,
            // districtOfResidence,
            // wardOfResidence,
            // listWardOfResidence,
            // administrativeUnit,
            // listHamletOfResidence,
            // provinceOfResidence,
            // listProvinceOfResidence,
            // listDistrictOfResidence,
            // residentialGroup,
            // listResidentialGroup,
         } = this.state;
        return (
            <Grid className="filter-container" container spacing={2}>
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
               
                <Grid item md={3} lg={3} sm={3} xs={6}>
                    <h6 className="text-primary-d2">&nbsp;</h6>
                    <Button
                        variant="contained"
                        className="btn btn-primary-d d-inline-flex"
                        onClick={() => {
                            var searchObject = {};
                            searchObject.healthCareGroupId = this.state.healthCareGroupId;
                            
                            // if (residentialGroup != null) {
                            //     searchObject.administrativeUnitId = residentialGroup.id;
                            // }
                            // else 
                            // if (wardOfResidence != null) {
                            //     searchObject.administrativeUnitId = wardOfResidence.id;
                            // }
                            // else if (districtOfResidence != null) {
                            //     searchObject.administrativeUnitId = districtOfResidence.id;
                            // }
                            // else if (provinceOfResidence != null) {
                            //     searchObject.administrativeUnitId = provinceOfResidence.id;
                            // }
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