import React, { useEffect } from 'react';
import {
    Button,
    TextField
} from "@material-ui/core";
import './InputPopup.scss';
import { useTranslation } from 'react-i18next';
import SelectPractitionerPopup from './SelectPractitionerPopup';
import { TextValidator } from 'react-material-ui-form-validator';


export default function InputPopup(props) {
    const { t } = useTranslation();
    const {
        practitioner,
        setPractitioner,
        size,
        required,
        variant,
        label,
        disabled,
        classes,
        type
    } = props;

    const [openPopup, handleOpenPopup] = React.useState(false);
    // const [selectedItem, handleSelectItem] = React.useState(family);

    const handleSelect = (item) => {
        handleOpenPopup(false);
        setPractitioner(item);
    }

    // useEffect(() => {
    //     setFamily(selectedItem);
    // }, [selectedItem]);

    // useEffect(() => {
    //     handleSelectItem(family)
    // }, [family, selectedItem]);

    return (

        <div className="input-popup-container">
            <div className="input-popup-practitioner">
            <TextValidator
                disabled
                fullWidth
                classes={classes}
                id="practitioner"
                size={size}
                name="practitioner"
                label={label}
                value={
                    practitioner ? (practitioner.displayName ? practitioner.displayName + " | " : "") + (practitioner.age ? practitioner.age + " | " : "") 
                    + (practitioner.phoneNumber ? practitioner.phoneNumber : "") : ""
                }
                // onChange={}
                required
                variant={variant}
                validators={["required"]}
                errorMessages={[t("general.errorMessages_required")]}
            />
            </div>
            {!disabled && <Button
                size="small"
                className="btn btn-primary-d"
                style={{ float: "right" }}
                variant="contained"
                onClick={() => handleOpenPopup(true)}
            >
                <div className="btn-select-practitioner">{t("general.button.select")}</div>
            </Button>}
            {openPopup && (
                <SelectPractitionerPopup
                    open={openPopup}
                    handleSelect={handleSelect}
                    type = {type}
                    selectedItem={
                        practitioner ? practitioner : {}
                    }
                    handleClose={() => handleOpenPopup(false)}
                    t={t}
                />
            )}
        </div>

    );
}
