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
import BlockIcon from '@material-ui/icons/Block';
import { toast } from 'react-toastify';
import Draggable from 'react-draggable';
import Paper from '@material-ui/core/Paper';
import 'react-toastify/dist/ReactToastify.css';
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { assignmentById, updateListFamily } from './PractitionerAndFamilyService';
import SelectPractitionerPopup from '../Component/SelectPractitionerPopup/InputPopup'

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
class SendTreatmentPopup extends React.Component {
    state = {
        practitioner: null
    }
    componentDidMount() {
        const { itemSendCheck, listFamily, type } = this.props;
        this.setState({family: itemSendCheck, listFamily: listFamily, type: type})
    }

    handleFormSubmit = () => {
        let {
            family,
            practitioner,
            listFamily,
            type
        } = this.state;
       
        if(practitioner == null && practitioner.id == null){
            toast.warn("Chưa chọn nhân viên y tế");
        }else{
            if(listFamily != null && listFamily.length > 0){
                let dto = { listFamily: listFamily, practitionerId: practitioner.id, type: type}
                updateListFamily(dto).then(()=>{
                    toast.success("Thêm nhân viên y tế cho hộ gia đình")
                    this.props.handleClose();
                })
            }else{
                assignmentById(family.id, practitioner.id, type).then(({data})=>{
                    toast.success("Thêm nhân viên y tế cho hộ gia đình")
                    this.props.handleClose();
                })
            }
        }
    };

    render() {
        let { open, handleClose, t, itemSendCheck } = this.props;
        let {
            practitioner,
            type
        } = this.state;
        return (
            <Dialog
                className="dialog-container"
                open={open}
                PaperComponent={PaperComponent}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle
                    className="dialog-header bgc-primary-d1"
                    style={{ cursor: 'move' }}
                    id="draggable-dialog-title"
                >
                    <span className="mb-20 text-white" > {t("Phân công điều trị") + (type == 1 ? " từ xa" : " tại chỗ")}</span>
                    <IconButton style={{ position: "absolute", right: "10px", top: "10px" }} onClick={() => handleClose()}>
                        <Icon color="disabled" title={t('general.button.close')}>close</Icon>
                    </IconButton>
                </DialogTitle>


                <ValidatorForm ref="form" onSubmit={this.handleFormSubmit} >
                    <div className="dialog-body">
                        <DialogContent className="o-hidden">
                            <Grid container spacing={2}>
                                <Grid item sm={12} xs={12}>
                                    <SelectPractitionerPopup
                                        practitioner={practitioner}
                                        type = {type}
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
                                                {t("Phân công điều trị")}
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
                                    startIcon={<BlockIcon />}
                                    variant="contained"
                                    className="mr-12 btn btn-secondary d-inline-flex"
                                    color="secondary"
                                    onClick={() => handleClose()}
                                >
                                    {t("general.button.cancel")}
                                </Button>
                                <Button
                                    startIcon={<SaveIcon />}
                                    className="mr-0 btn btn-success d-inline-flex"
                                    variant="contained"
                                    color="primary"
                                    type="submit">
                                    {t("general.button.save")}
                                </Button>
                            </div>
                        </DialogActions>
                    </div>
                </ValidatorForm>
            </Dialog>
        )
    }

}
export default SendTreatmentPopup;