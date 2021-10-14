import React from 'react';
import { green } from '@material-ui/core/colors';
import {
    IconButton,
    Icon,
    withStyles,
    Tooltip
} from "@material-ui/core";

const LightTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 14,
      position: "absolute",
      top: "-10px",
      left: "-25px",
      width: "80px",
    },
}))(Tooltip);

export default function SendChecking(props) {
    const {item, t} = props;
    return (
        <LightTooltip
            title="Phân công điều trị"
            placement="right-end"
            enterDelay={500}
            leaveDelay={300}
            >
            <IconButton size="small" onClick={() => props.onSelect(item, props.index)}>
                <Icon fontSize="small" style={{ color: green[500] }}>assignmentInd</Icon>
            </IconButton>
        </LightTooltip>
    )
}
