import React from "react";
import {
    Dialog,
    Icon,
    IconButton,
    DialogTitle,
    DialogContent,
    Grid,
    DialogActions,
    Button
} from "@material-ui/core";
import SaveIcon from '@material-ui/icons/Save';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { toast } from 'react-toastify';
import Draggable from 'react-draggable';
import Paper from '@material-ui/core/Paper';
import 'react-toastify/dist/ReactToastify.css';
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
// import { assignmentById, updateListFamily } from './PractitionerAndFamilyService';
import SelectPractitionerPopup from '../Component/SelectPractitionerPopup/InputPopup';

toast.configure({
    autoClose: 2000,
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

//gửi rà soát
class PractitionerDialog extends React.Component {
    state = {
        practitioner: null
    }
    componentDidMount() {
        const { item } = this.props;

        this.setState({});
    }

    render() {
        let { open, handleClose, } = this.props;
        let {
            practitioner
        } = this.state;
        return (
            <Dialog
                className="dialog-container"
                open={open}
                PaperComponent={PaperComponent}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle
                    className="dialog-header bgc-primary-d1"
                    style={{ cursor: 'move' }}
                    id="draggable-dialog-title"
                >
                    <span className="mb-20 text-white" > Phân công nhân viên y tế </span>
                    <IconButton style={{ position: "absolute", right: "10px", top: "10px" }} onClick={() => handleClose()}>
                        <Icon color="disabled" title="Đóng">close</Icon>
                    </IconButton>
                </DialogTitle>
                <ValidatorForm ref="form" >
                    <div className="dialog-body">
                        <DialogContent className="o-hidden">
                            <Grid container spacing={2}>
                                <Grid item sm={12} xs={12}>
                                    <SelectPractitionerPopup
                                        practitioner={practitioner}
                                        type = {0}
                                        setPractitioner={(item) => {
                                            this.setState({ practitioner: item }, () => {
                                                console.log(this.state)
                                            });
                                        }}
                                        size="small"
                                        variant="outlined"
                                        label={
                                            <span className="font">
                                                <span style={{ color: "red" }}> *</span>
                                                "Phân công điều trị"
                                            </span>
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>
                    </div>

                    <div className="dialog-footer">
                        <DialogActions className="p-0">
                            <div className="flex flex-space-between flex-middle">
                                <Button
                                    startIcon={<HighlightOffIcon />}
                                    variant="contained"
                                    className="mr-12 btn btn-secondary d-inline-flex"
                                    color="secondary"
                                    onClick={() => handleClose()}
                                >
                                    Đóng
                                </Button>
                            </div>
                        </DialogActions>
                    </div>
                </ValidatorForm>
            </Dialog>
        )
    }

}
export default PractitionerDialog;