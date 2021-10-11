"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var antd_1 = require("antd");
var table_1 = require("antd/es/table");
var Apis_service_1 = require("app/services/Apis.service");
var authprovider_util_1 = require("app/shared/utils/authprovider.util");
var react_1 = require("react");
var model_1 = require("./model");
var icons_1 = require("@ant-design/icons");
var react_router_1 = require("react-router");
exports.Gridview = function (props) {
    var history = react_router_1.useHistory();
    var data = props.data;
    var _a = react_1.useState(false), isModalVisible = _a[0], setIsModalVisible = _a[1];
    var _b = react_1.useState([]), roles = _b[0], setroles = _b[1];
    var accountIdentifier = authprovider_util_1.authProvider.getAccount().accountIdentifier;
    var api = new Apis_service_1.ApiService(accountIdentifier);
    var getListas = react_1.useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var mysRoles;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.GetRoles()];
                case 1:
                    mysRoles = _a.sent();
                    setroles(mysRoles);
                    return [2 /*return*/];
            }
        });
    }); }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    //const getMenu = UpdateMenu();
    react_1.useEffect(function () {
        getListas();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    var structureColumns = [
        {
            title: 'Tipo Trámite',
            dataIndex: 'tramite',
            key: 'tramite'
        },
        {
            title: 'Fecha Radicación',
            dataIndex: 'fechaSolicitud',
            key: 'fechaSolicitud'
        },
        {
            title: 'Numero Licencia',
            dataIndex: 'numeroCertificado',
            key: 'numeroCertificado'
        },
        {
            title: 'Estado',
            dataIndex: 'solicitud',
            key: 'solicitud'
        },
        {
            title: 'PDF',
            dataIndex: 'pdf',
            key: 'pdf',
            render: function () { return React.createElement(icons_1.FilePdfOutlined, { style: { fontSize: '30px' } }); }
        },
        {
            title: 'Acciones',
            key: 'Acciones',
            render: function (_, row, index) {
                var permiso = roles[0];
                return permiso.rol === 'Ciudadano' ? (React.createElement(antd_1.Button, { key: index, type: 'primary', onClick: showModal, icon: React.createElement(icons_1.EyeOutlined, null) }, "Ver")) : permiso.rol === 'Funcionario' ? (React.createElement(React.Fragment, null,
                    React.createElement(antd_1.Button, { type: 'primary', key: "ver-" + index, onClick: showModal, icon: React.createElement(icons_1.EyeOutlined, null) }, "Ver"),
                    React.createElement(antd_1.Button, { type: 'primary', key: "vali-" + index, onClick: function () { return onClickValidarInformacion(row); }, style: { marginLeft: '5px' }, icon: React.createElement(icons_1.CheckOutlined, null) }, "Validar Informacion"))) : null;
            }
        }
    ];
    var showModal = function () {
        setIsModalVisible(true);
    };
    var handleCancel = function () {
        setIsModalVisible(false);
    };
    var onClickValidarInformacion = function (_a) {
        var idSolicitud = _a.idSolicitud;
        return __awaiter(void 0, void 0, void 0, function () {
            var data, idTramite;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, api.getLicencia(idSolicitud)];
                    case 1:
                        data = _b.sent();
                        idTramite = data[0].idTramite;
                        localStorage.setItem('register', JSON.stringify(data));
                        switch (idTramite) {
                            case 'a289c362-e576-4962-962b-1c208afa0273':
                                //inhumacion indivual
                                history.push('/tramites-servicios/licencia/inhumacion-individual');
                                break;
                            case 'ad5ea0cb-1fa2-4933-a175-e93f2f8c0060':
                                //inhumacion fetal
                                history.push('/tramites-servicios/licencia/inhumacion-fetal');
                                break;
                            case 'e69bda86-2572-45db-90dc-b40be14fe020':
                                //cremacion individual
                                history.push('/tramites-servicios/licencia/cremacion-individual');
                                break;
                            case 'f4c4f874-1322-48ec-b8a8-3b0cac6fca8e':
                                //cremacionfetal
                                history.push('/tramites-servicios/licencia/cremacion-fetal');
                                break;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return (React.createElement("div", { className: 'card card-body py-5 mb-4 fadeInTop' },
        React.createElement("div", { className: 'd-lg-flex align-items-start' },
            React.createElement(table_1["default"], { dataSource: data, columns: structureColumns, pagination: { pageSize: 50 } })),
        React.createElement(antd_1.Modal, { title: React.createElement("h3", null, "Tabla de Seguimiento"), visible: isModalVisible, onCancel: handleCancel, width: 1000, okButtonProps: { hidden: true }, cancelText: 'Cerrar' },
            React.createElement(table_1["default"], { dataSource: model_1.dataFake, columns: model_1.columnFake, pagination: { hideOnSinglePage: true } }))));
};

//# sourceMappingURL=table.js.map
