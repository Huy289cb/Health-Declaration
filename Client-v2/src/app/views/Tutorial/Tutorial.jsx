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

class Tutorial extends Component {
  state ={
    
  }
  componentDidMount() {
  }

  render() {
    const { t, i18n, theme } = this.props;

    return (
      <div className="analytics m-sm-30" style={{backgroundColor: "#fff"}}>
        <Grid container spacing={3}>
          <Grid item lg={12} md={12} sm={12} xs={12} style={{display: "flex", justifyContent: "center"}}>
                <div style={{maxWidth: "1200px"}}>
                    <Typography variant="h5" style={{fontWeight: "bold", textAlign: "center"}}>
                        HƯỚNG DẪN TỰ CHĂM SÓC TẠI NHÀ 
                    </Typography>
                    <Typography variant="h6" style={{textAlign: "center"}}>
                        (Dành cho ca F0 và người dân sống trong khu vực phong tỏa)
                    </Typography>
                    <ol style={{paddingInlineStart: "14px"}}>
                        <li>Luôn đeo khẩu trang. Riêng các ca F0 <b>tự cách ly</b> trong phòng riêng, mở cửa sổ để tăng thông gió.</li>
                        <li>Ghi lại <b>ngày đầu tiên</b> xuất hiện triệu chứng.</li>
                        <li>Tập thể dục nhẹ nhàng. Xem các chương trình giải trí, thư giãn.</li>
                        <li>Sử dụng thuốc chữa triệu chứng</li>
                        <ul>
                            <li>Uống nhiều nước, uống oresol để bù nước.</li>
                            <li>Nhỏ mũi, súc họng bằng nước muối sinh lý.</li>
                            <li>Uống Vitamin C.</li>
                            <li>Nếu ho: dùng thuốc giảm ho.</li>
                            <li>Uống Paracetamol nếu sốt ≥ 38,5 độ C</li>
                            <ul>
                                <li><i>{"Người lớn ≤ 70 kg: 1-1,5 viên 500 mg/lần; >= 70 kg: 2 viên 500 mg/lần. 3-4 lần/ngày, cách tối thiểu 4-6h/lần, không quá 4 lần/ngày."}</i></li>
                                <li><i>Trẻ em: 10-15 mg/kg/lần, cách 4-6 h/lần, không quá 4 lần/ngày. Liều tối đa tính theo cân nặng không được vượt quá 500 mg.</i></li>
                                <li><i>Không uống THÊM các thuốc cảm cúm khác có chứa paracetamol hoặc acetaminophen.</i></li>
                                <li><i>Người có tiền sử dị ứng với Paracetamol hoặc đang bị viêm gan không nên dùng.</i></li>
                            </ul>
                        </ul>
                        <li>Nằm nghiêng hoặc nằm sấp nếu tư thế này làm cho bạn thấy dễ chịu.</li>
                        <li>Đo nhịp thở bằng cách đặt bàn tay lên ngực, thư giãn, thở đều và đếm số lần lồng ngực nhô lên trong 1 phút.</li>
                        <li>Kiểm tra <b>độ bão hòa oxy</b> ít nhất 3-4 lần/ngày. 6 bước đo SpO2 (độ bão hòa oxy trong máu)</li>
                        <Grid container spacing={1}>
                            <Grid item lg={8} md={8} xs={12} sm={12}>
                                <ul>
                                    <li>Bỏ móng tay giả, sơn móng tay.</li>
                                    <li>Nghỉ ngơi ít nhất 5 phút trước khi đo.</li>
                                    <li>Xoa 2 bàn tay để làm ấm tay.</li>
                                    <li>Bật máy, đưa ngón giữa hoặc ngón trỏ vào miệng của máy để ngón tay được kẹp chặt.</li>
                                    <li>Giữ yên máy đo và ngón tay trong 1 phút cho đến khi số đo ổn định hơn 5 giây.</li>
                                    <li>Xem kết quả: là số có ghi chữ SpO2 hoặc %.</li>
                                </ul>
                            </Grid>
                            <Grid item lg={4} md={4} xs={12} sm={12}>
                                <img src={appConfig.ROOT_PATH + "assets/images/hd1.jpg"} width="235" height="129" alt="hd1"/>
                            </Grid>
                        </Grid>
                        
                    </ol>
                    <Typography variant="h6">
                        Liên hệ với Tổ Y tế dân phố khi có triệu chứng nghi mắc COVID-19 hoặc biểu hiện cần cấp cứu 
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item lg={4} md={4} xs={12} sm={12}>
                            <img src={appConfig.ROOT_PATH + "assets/images/hd2.png"} width="100%" alt="hd2" style={{border: "1px solid"}}/>
                        </Grid>
                        <Grid item lg={8} md={8} xs={12} sm={12}>
                            <img src={appConfig.ROOT_PATH + "assets/images/hd3.png"} alt="hd3" style={{border: "1px solid"}}/>
                        </Grid>
                    </Grid>
                </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Tutorial;
