"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
// Componentes
var page_header_component_1 = require("app/shared/components/page-header.component");
var authprovider_util_1 = require("app/shared/utils/authprovider.util");
var form_1 = require("antd/es/form");
var form_layout_util_1 = require("app/shared/utils/form-layout.util");
var BasicaInformacion_1 = require("./components/form/BasicaInformacion");
var select_component_1 = require("app/shared/components/inputs/select.component");
var react_1 = require("react");
var tabs_1 = require("antd/es/tabs");
var input_1 = require("antd/es/input");
var button_1 = require("antd/es/button");
var react_router_1 = require("react-router");
var Apis_service_1 = require("app/services/Apis.service");
var grid_actions_1 = require("app/redux/Grid/grid.actions");
var app_reducers_1 = require("app/redux/app.reducers");
var TabPane = tabs_1["default"].TabPane;
var RegistroPage = function (props) {
    var history = react_router_1.useHistory();
    var accountIdentifier = authprovider_util_1.authProvider.getAccount().accountIdentifier;
    var form = form_1["default"].useForm()[0];
    var _a = react_1.useState(true), isColombia = _a[0], setIsColombia = _a[1];
    var _b = react_1.useState([]), l_municipios = _b[0], setLMunicipios = _b[1];
    var _c = react_1.useState([[], []]), _d = _c[0], l_departamentos_colombia = _d[0], l_paises = _d[1], setListas = _c[1];
    var api = new Apis_service_1.ApiService(accountIdentifier);
    var _e = react_1.useState([]), l_tipos_documento = _e[0], setListaTipoDocumento = _e[1];
    var getListas = react_1.useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var tipoDocumento, listDocument;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.getTipoDocumeto()];
                case 1:
                    tipoDocumento = _a.sent();
                    listDocument = tipoDocumento.map(function (res) {
                        return { id: res.idTipoIdentificacion, descripcion: res.descripcion };
                    });
                    setListaTipoDocumento(listDocument);
                    return [2 /*return*/];
            }
        });
    }); }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    react_1.useEffect(function () {
        getListas();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    var goBack = function () {
        history.goBack();
    };
    var defaultValues = {
        identity: 1,
        identification: ''
    };
    var onSubmit = function (value) { return __awaiter(void 0, void 0, void 0, function () {
        var json, resApi;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    json = {
                        primerNombre: value.name,
                        segundoNombre: value.secondName,
                        primerApellido: value.surname,
                        segundoApellido: value.secondSurname,
                        tipoDocumento: value.TipoIdent,
                        numeroIdentificacion: Number(value.nit),
                        telefonoFijo: value.phone,
                        telefonoCelular: value.phonecell,
                        email: value.email,
                        tipoDocumentoRepresentanteLegal: value.instTipoIdent,
                        numeroDocumentoRepresentanteLegal: Number(value.instNumIdent),
                        nombreRazonSocial: value.razonsocial
                    };
                    return [4 /*yield*/, api.personaJuridica(json)];
                case 1:
                    resApi = _a.sent();
                    if (!(typeof resApi === 'number')) return [3 /*break*/, 4];
                    return [4 /*yield*/, api.putUser({
                            oid: accountIdentifier,
                            idPersonaVentanilla: resApi
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, api.PostRolesUser({
                            idUser: accountIdentifier,
                            idRole: '58EDA51F-7E19-47C4-947F-F359BD1FC732'
                        })];
                case 3:
                    _a.sent();
                    localStorage.setItem(accountIdentifier, resApi.toString());
                    app_reducers_1.store.dispatch(grid_actions_1.SetGrid({ key: 'relaodMenu' }));
                    history.push('/');
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var onSubmitFailed = function () { };
    return (react_1["default"].createElement("div", { className: 'fadeInTop container-fluid' },
        react_1["default"].createElement(page_header_component_1.PageHeaderComponent, { title: "Registro Persona Jur\u00EDdica. \n Datos B\u00E1sicos.", subTitle: "Por favor registre los datos exactamente como aparecen en la Registro de C\u00E1mara de Comercio, estos \n                datos ser\u00E1n usados para la generaci\u00F3n de los Documentos asociados al tr\u00E1mite solicitado y su posterior reporte a\n                entidades de vigilancia y control.", backIcon: null }),
        react_1["default"].createElement("div", { className: 'card card-body' },
            react_1["default"].createElement("h4", { className: 'app-subtitle mt-3' }, "Datos B\u00E1sicos."),
            react_1["default"].createElement(form_1["default"], __assign({ form: form, className: 'mb-4 w-100' }, form_layout_util_1.layoutItems, { style: { maxWidth: 800 }, layout: 'horizontal', onFinish: onSubmit, onFinishFailed: onSubmitFailed }),
                react_1["default"].createElement(form_1["default"].Item, { label: 'Raz\u00F3n Social', name: 'razonsocial', rules: [{ required: true, max: 25 }] },
                    react_1["default"].createElement(input_1["default"], { allowClear: true, placeholder: 'Raz\u00F3n Social', autoComplete: 'off' })),
                react_1["default"].createElement(form_1["default"].Item, { label: 'Tipo Identificaci\u00F3n', initialValue: 5, name: 'TipoIdent', rules: [{ required: true }] },
                    react_1["default"].createElement(select_component_1.SelectComponent, { options: l_tipos_documento, optionPropkey: 'id', optionPropLabel: 'descripcion' })),
                react_1["default"].createElement(form_1["default"].Item, { label: 'NIT', initialValue: defaultValues.identification, name: 'nit', rules: [{ required: true }] },
                    react_1["default"].createElement(input_1["default"], { allowClear: true, type: 'tel', placeholder: 'N\u00FAmero Identificaci\u00F3n', autoComplete: 'off' })),
                react_1["default"].createElement("h4", { className: 'app-subtitle mt-3' }, "Representante Legal."),
                react_1["default"].createElement(BasicaInformacion_1.BasicaInformacion, { form: form }),
                react_1["default"].createElement(form_1["default"].Item, __assign({}, form_layout_util_1.layoutWrapper, { className: 'mb-0 mt-4' }),
                    react_1["default"].createElement("div", { className: 'd-flex justify-content-between' },
                        react_1["default"].createElement(button_1["default"], { type: 'dashed', htmlType: 'button', onClick: goBack }, "Volver atr\u00E1s"),
                        react_1["default"].createElement(button_1["default"], { type: 'primary', htmlType: 'submit' }, "Guardar")))))));
};
exports["default"] = RegistroPage;

//# sourceMappingURL=registro-juridico.js.map
