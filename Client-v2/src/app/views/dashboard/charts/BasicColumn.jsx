import React from "react";
import { render } from "react-dom";
// Import Highcharts
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import highcharts3d from 'highcharts/highcharts-3d';
highcharts3d(Highcharts);

class ColumnChart extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        listAdministrativeUnit : [],
        list0: [],
        list1: [],
        list2: [],
        list3: []
    }
    componentDidMount() {
        let details = this.props.reportData?.details
        this.updateData(details)
    }
    componentDidUpdate(prevProps) {
        if (this.props.reportData?.code !== prevProps.reportData?.code) {
            let details = this.props.reportData?.details
            this.updateData(details)
        }
    }
    updateData = (details) => {
        if (details) {
            let listAdministrativeUnit = [];
            let list0 = [];
            let list1 = [];
            let list2 = [];
            let list3 = [];
            details.forEach((item) => {
                listAdministrativeUnit.push(item.adminUnit)
                list0.push(item.noSymtom)
                list1.push(item.normal)
                list2.push(item.medium)
                list3.push(item.serious)
            })
            this.setState({listAdministrativeUnit, list0, list1, list2, list3})
        }
    }

    render() {

        const options = {
            chart: {
                type: 'column',

            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:1f} ca</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            xAxis: {
                categories: this.state.listAdministrativeUnit,
                labels: {
                    style: {"fontFamily": "sans-serif", "fontWeight": "bold"}
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: "Số lượng"
                }
            },
            title: {
                text: "",
                style: {"fontFamily": "sans-serif", "fontWeight": "bold"}
            },
            series: [
                {
                    name: "Mức nguy cơ thấp",
                    data: this.state.list0,
                    color: "#08ad6c80"
                },
                {
                    name: "Mức nguy cơ trung bình",
                    data: this.state.list1,
                    color: "#ffd37a"
                },
                {
                    name: "Mức nguy cơ cao",
                    data: this.state.list2,
                    color: "#ff9e43"
                },
                {
                    name: "Mức nguy cơ rất cao",
                    data: this.state.list3,
                    color: "#ff4a4a"
                }
            ]
        };
        return (
            <div>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                />
            </div>
        );
    }
}
export default (ColumnChart);