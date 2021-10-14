import React, { Component } from "react";
import { Breadcrumb } from "egret";
import { withStyles } from "@material-ui/styles";
import localStorageService from "../../services/localStorageService";
import { 
  Grid,
  Card,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import 'styles/globitsStyles.css';
import appConfig from "../../appConfig";

class SPO2Tutorial extends Component {
  state ={
    
  }
  componentDidMount() {
  }

  render() {
    const { t, i18n, theme } = this.props;

    return (
      <div className="analytics m-sm-30" style={{display: "flex", justifyContent: "center"}}>
        <Grid container spacing={3} style={{maxWidth: "1200px"}}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
                <Card elevation={3} className="bgc-green-l p-32 py-32 h-100 click">
                    <div className="text-primary-d2">
                        <div className="card-body">
                        <iframe className="w-100" height="290" 
                        src="https://www.youtube.com/embed/MeAdCoLms_E" 
                        title="Tiến sĩ, Bác sĩ Nguyễn Thu Anh hướng dẫn đo SpO2 tại nhà" frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>

                        </iframe>
                            {/* <video controls>
                                <source src="https://youtu.be/MeAdCoLms_E" type=""/>
                                
                                Your browser does not support the video tag.
                            </video> */}
                            <div className="mt-8">Tiến sĩ, Bác sĩ Nguyễn Thu Anh hướng dẫn đo SpO2 tại nhà. Nguồn: 
                            <a href="https://vnexpress.net/6-buoc-do-spo2-tai-nha-dung-cach-4338016.html"><i>vnexpress</i></a></div>
                        </div>
                    </div>
                </Card>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
                <Card elevation={3} className="bgc-green-l p-32 py-32 h-100 click">
                    <div className="text-primary-d2">
                    <Typography variant="h6" className="card-title text-primary-d2 uppercase" style={{fontWeight: "bold", textAlign: "center"}}>
                        6 bước đo SpO2 tại nhà đúng cách
                    </Typography>
                    <div className="card-body" style={{display: "flex", flexDirection: "column", alignItems: "left"}}>
                        <table className="family-details">
                        <tr>
                            <td colSpan={2}>
                            <hr/>
                            </td>
                        </tr>
                        <tr>
                            <td>Bước 1: Làm sạch móng tay, không để móng tay dài, móng giả, sơn móng tay</td>
                        </tr>
                        <tr>
                            <td>Bước 2: Nghỉ ngơi ít nhất 5 phút trước khi đo.</td>
                        </tr>
                        <tr>
                            <td>Bước 3: Xoa 2 bàn tay để làm ấm tay.</td>
                        </tr>
                        <tr>
                            <td>Bước 4: Bật máy, đưa ngón tay giữa hoặc ngón trỏ vào miệng của máy để ngón tay được kẹp chặt.</td>
                        </tr>
                        <tr>
                            <td>Bước 5: Nhấn nút nguồn để khởi động máy. Không cử động tay trong khi đo. Kết quả đo sẽ hiển thị trên màn hình sau vài giây.</td>
                        </tr>
                        <tr>
                            <td>Bước 6: Khi kết thúc đo, rút ngón tay ra, sau vài giây máy sẽ tự tắt, ghi lại kết quả đo.</td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                            <hr/>
                            </td>
                        </tr>
                        </table>
                    </div>
                    </div>
                </Card>
            </Grid>
          </Grid>
      </div>
    );
  }
}

export default SPO2Tutorial;