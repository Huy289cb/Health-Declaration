const APPLICATION_PATH = "/";
module.exports = Object.freeze({
    ROOT_PATH: APPLICATION_PATH,
    ACTIVE_LAYOUT: "layout1", //layout1 = vertical, layout2=horizontal
    API_ENPOINT: "http://localhost:8992/health-declaration", //local
    LOGIN_PAGE: APPLICATION_PATH + "session/signin", //Nếu là Spring
    REGISTRY_PAGE: APPLICATION_PATH + "session/signup",
    FORGOT_PASSWORD_PAGE: APPLICATION_PATH + "session/forgot-password",
    HOME_PAGE: APPLICATION_PATH + "dashboard/analytics", //Nếu là Spring
    //HOME_PAGE:APPLICATION_PATH+"dashboard/learning-management"//Nếu là Keycloak
    //HOME_PAGE:APPLICATION_PATH+"landing3",//Link trang landing khi bắt đầu

    REGISTER_USER_TYPE:{

    },
    GET_PERSONAL_HEALTH_RECORD_TYPE: {
        family: 1, //{key:1, value:"Khai báo y tế"}, 
        medical_team: 2, //{key:2, value:"Tổ y tế"},
        practitioner: 3,  //{key:3, value:"Bác sĩ - nhân viên y tế làm tại chỗ"}
        remoteWork: 4 //{key:4, value:"Bác sĩ - nhân viên y tế làm từ xa"}
    },
    SUSPECTEDLEVEL: [
        { key:"normal", value: "Bình thường"},
        { key: "f0", value: "F0"},
        { key: "f1", value: "F1"}
    ],
    PERSONAL_HEALTH_RECORD_TYPE: [
        { key: 1, value: "Khai báo y tế" },
        { key: 2, value: "Tổ y tế" },
        { key: 3, value: "Khám trực tiếp" },
        { key: 4, value: "Khám từ xa"}
    ],
    RESULT_TEST: [{ key: 1, value: "Dương tính" }, { key: 2, value: "Âm tính" }],
    ENCOUNTER_TYPE: [
        { key: "type1", number: 1, description: "Khám trực tiếp" },
        { key: "type2", number: 2, description: "Khám qua điện thoại" }
    ],
    ENCOUNTER_MAKE_DECISION: [
        { key: "decision1", number: 1, description: "Chuyển đi cấp cứu" },
        { key: "decision2", number: 2, description: "Tiếp tục theo dõi ở nhà" }
    ],
    SPO2_CONST: [
        // { key: "<70", value: -2 },  //<70
        // { key: "70-87", value: -1 },  //70-87
        // {
        //     key: "87-89",
        //     value: 1    //87-89
        // },
        // {
        //     key: "90-91",
        //     value: 2    //90-91
        // },
        {
            key: "<92",
            value: 3    //<92
        },
        {
            key: "92-94",
            value: 4    //92-94
        },
        {
            key: "95-96",
            value: 5    //95-96
        },
        {
            key: ">96",
            value: 6    //>96
        },
    ],
    BREATHINGRATE_CONST:
        [
            {
                key: "<17",
                value: -1   //<17
            },
            {
                key: "17-20",
                value: 1    //17-20
            },
            {
                key: "21-23",
                value: 2    //21-23
            },
            {
                key: "24-26",
                value: 3    //24-26
            },
            {
                key: "27-30",
                value: 4    //27-30
            },
            {
                key: ">30",
                value: 5    //>30
            },
        ],
    TEMPERATURE_CONST:
        [
            {
                key: "<36",
                value: -1    //<36
            },
            {
                key: "36-37",
                value: 1    //36-37
            },
            {
                key: "37.1-37.5",
                value: 2    //37.1-37.5
            },
            {
                key: "37.6-38",
                value: 3    //37.6-38
            },
            {
                key: "38.1-38.4",
                value: 4    //38.1-38.4
            },
            {
                key: "38.5-39",
                value: 5    //38.5-39
            },
            {
                key: ">39",
                value: 6    //>39
            },
        ],
    RESOLVE_STATUS_CONST: [
        {
            key: "NoProcessingRequired",
            value: -1,
            display: "Không cần xử lý"
        },
        {
            key: "NoProcess",
            value: 1,
            display: "Chưa xử lý"
        }, {
            key: "Processing",
            value: 2,
            display: "Đang xử lý"
        },
        {
            key: "Processed",
            value: 3,
            display: "Đã xử lý"
        }
    ],
    SERIUS_STATUS_CONST: [
        {
            key: "Level0",
            value: -1,
            display: "Mức nguy cơ thấp"
        },
        {
            key: "Level1",
            value: 1,
            display: "Mức nguy cơ trung bình",
            bgc: "#ffd37a"
        }, {
            key: "Level2",
            value: 2,
            display: "Mức nguy cơ cao",
            bgc: "#ff9e43"
        },
        {
            key: "Level3",
            value: 3,
            display: "Mức nguy cơ rất cao",
            bgc: "rgb(255 114 90)"
        }
    ],
    PRACTITIONER_TYPE_CONST: [
        {
            value: 1,
            display: "Từ xa",
        },
        {
            value: 2,
            display: "Tại chỗ",
        },
    ],
    SYMPTOM_TYPE: [
        {
            value: 1,
            display: "Triệu chứng thường gặp",
        },
        {
            value: 2,
            display: "Triệu chứng nặng",
        },
    ]
});
