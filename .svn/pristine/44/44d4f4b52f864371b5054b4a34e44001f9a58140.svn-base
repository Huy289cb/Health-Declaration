import React, { useEffect } from 'react';
import {
    Button,
    TextField
} from "@material-ui/core";
import './InputPopup.scss';
import { useTranslation } from 'react-i18next';
import SelectFamilyPopup from './SelectFamilyPopup';
import { TextValidator } from 'react-material-ui-form-validator';
import "styles/globitsStyles.css";

export default function InputPopup(props) {
    const { t } = useTranslation();
    const {
        family,
        setFamily,
        size,
        required,
        variant,
        label,
        disabled,
        classes,
    } = props;

    const [openPopup, handleOpenPopup] = React.useState(false);
    // const [selectedItem, handleSelectItem] = React.useState(family);

    const handleSelect = (item) => {
        handleOpenPopup(false);
        setFamily(item);
    }

    // useEffect(() => {
    //     setFamily(selectedItem);
    // }, [selectedItem]);

    // useEffect(() => {
    //     handleSelectItem(family)
    // }, [family, selectedItem]);

    return (

        <div className="input-popup-container">
            <div className="input-popup-family">
            <TextValidator
                className="nice-input"
                disabled
                fullWidth
                classes={classes}
                id="family"
                size={size}
                name="family"
                label={label}
                value={
                    family ? (family.code ? family.code + " | " : "") + (family.name ? family.name + " | " : "") 
                    + (family.detailAddress ? family.detailAddress : "") : ""
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
                <div className="btn-select-family">{t("general.button.select")}</div>
            </Button>}
            {openPopup && (
                <SelectFamilyPopup
                    open={openPopup}
                    handleSelect={handleSelect}
                    selectedItem={
                        family ? family : {}
                    }
                    handleClose={() => handleOpenPopup(false)}
                    t={t}
                />
            )}
        </div>

    );
}
