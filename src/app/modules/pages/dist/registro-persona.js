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
// Utilidades
var constants_util_1 = require("app/shared/utils/constants.util");
var authprovider_util_1 = require("app/shared/utils/authprovider.util");
var form_1 = require("antd/es/form");
var form_layout_util_1 = require("app/shared/utils/form-layout.util");
var BasicaInformacion_1 = require("./components/form/BasicaInformacion");
var select_component_1 = require("app/shared/components/inputs/select.component");
var react_1 = require("react");
var tabs_1 = require("antd/es/tabs");
var alert_1 = require("antd/es/alert");
var input_1 = require("antd/es/input");
var button_1 = require("antd/es/button");
var react_router_1 = require("react-router");
var Apis_service_1 = require("app/services/Apis.service");
var constants_util_2 = require("app/shared/utils/constants.util");
var datepicker_component_1 = require("app/shared/components/inputs/datepicker.component");
var app_reducers_1 = require("app/redux/app.reducers");
var grid_actions_1 = require("app/redux/Grid/grid.actions");
var TabPane = tabs_1["default"].TabPane;
var RegistroPage = function (props) {
    var history = react_router_1.useHistory();
    var _a = authprovider_util_1.authProvider.getAccount(), name = _a.name, userName = _a.userName;
    var form = form_1["default"].useForm()[0];
    var _b = react_1.useState(true), isColombia = _b[0], setIsColombia = _b[1];
    var _c = react_1.useState([]), sex = _c[0], setSex = _c[1];
    var _d = react_1.useState([]), etniastate = _d[0], setEtnia = _d[1];
    var _e = react_1.useState([]), nivelEducativo = _e[0], setNivelEducativo = _e[1];
    var _f = react_1.useState([]), l_municipios = _f[0], setLMunicipios = _f[1];
    var _g = react_1.useState([[], []]), _h = _g[0], l_departamentos_colombia = _h[0], l_paises = _h[1], setListas = _g[1];
    var accountIdentifier = authprovider_util_1.authProvider.getAccount().accountIdentifier;
    var api = new Apis_service_1.ApiService(accountIdentifier);
    var idColombia = '170';
    var idDepartamentoBogota = '3';
    var getListas = react_1.useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, municipios, resp;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        api.getMunicipio(idDepartamentoBogota),
                        api.getDepartament(),
                        api.getPaises()
                    ])];
                case 1:
                    _a = _b.sent(), municipios = _a[0], resp = _a.slice(1);
                    setLMunicipios(municipios);
                    setListas(resp);
                    return [2 /*return*/];
            }
        });
    }); }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    var getListas2 = react_1.useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, etnia, sexo, educacion;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.all([api.GetEtnia(), api.GetSexo(), api.GetNivelEducativo()])];
                case 1:
                    _a = _b.sent(), etnia = _a[0], sexo = _a[1], educacion = _a[2];
                    setEtnia(etnia);
                    setSex(sexo);
                    setNivelEducativo(educacion);
                    return [2 /*return*/];
            }
        });
    }); }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    var onChangePais = function (value) {
        setIsColombia(value === idColombia);
        if (isColombia) {
            form.setFieldsValue({ state: 3, city: 179 });
        }
        form.setFieldsValue({ state: undefined, city: undefined, cityLive: undefined });
    };
    var onChangeDepartamento = function (value) { return __awaiter(void 0, void 0, void 0, function () {
        var resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    form.setFieldsValue({ city: undefined });
                    return [4 /*yield*/, api.getMunicipio(value)];
                case 1:
                    resp = _a.sent();
                    setLMunicipios(resp);
                    return [2 /*return*/];
            }
        });
    }); };
    react_1.useEffect(function () {
        getListas();
        getListas2();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    var goBack = function () {
        history.goBack();
    };
    var onSubmit = function (value) { return __awaiter(void 0, void 0, void 0, function () {
        var confirEmail, email, ppla, Num1, letra1, Bis, card1, Num2, letra2, placa, card2, direcion, data, resApi;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    confirEmail = value.confirEmail, email = value.email;
                    if (!(confirEmail === email)) return [3 /*break*/, 3];
                    ppla = value.ppla, Num1 = value.Num1, letra1 = value.letra1, Bis = value.Bis, card1 = value.card1, Num2 = value.Num2, letra2 = value.letra2, placa = value.placa, card2 = value.card2;
                    direcion = ppla + " " + Num1 + " " + letra1 + " " + Bis + " " + card1 + " " + Num2 + " " + letra2 + " " + placa + " " + card2;
                    data = {
                        primerNombre: value.name,
                        segundoNombre: (_a = value.secondName, (_a !== null && _a !== void 0 ? _a : '')),
                        primerApellido: value.surname,
                        segundoApellido: (_b = value.secondSurname, (_b !== null && _b !== void 0 ? _b : '')),
                        tipoDocumento: value.instTipoIdent,
                        numeroIdentificacion: Number(value.instNumIdent),
                        telefonoFijo: (_c = value.phone, (_c !== null && _c !== void 0 ? _c : '')),
                        telefonoCelular: value.phonecell,
                        email: value.email,
                        nacionalidad: value.country,
                        departamento: value.state,
                        ciudadNacimientoOtro: !isColombia ? value.cityLive : '',
                        ciudadNacimiento: isColombia ? value.cityLive : 0,
                        departamentoResidencia: value.state,
                        ciudadResidencia: value.city,
                        direccionResidencia: direcion,
                        fechaNacimiento: value.date,
                        sexo: value.sex,
                        genero: value.gender,
                        orientacionSexual: value.sexual_orientation,
                        etnia: value.ethnicity,
                        estadoCivil: value.estadoCivil,
                        nivelEducativo: value.levelEducation //listado nivel educativo
                    };
                    return [4 /*yield*/, api.personaNatural(data)];
                case 1:
                    resApi = _d.sent();
                    if (!(typeof resApi === 'number')) return [3 /*break*/, 3];
                    return [4 /*yield*/, api.PostRolesUser({
                            idUser: accountIdentifier,
                            idRole: '58EDA51F-7E19-47C4-947F-F359BD1FC732'
                        })];
                case 2:
                    _d.sent();
                    localStorage.setItem(accountIdentifier, resApi.toString());
                    app_reducers_1.store.dispatch(grid_actions_1.SetGrid({ key: 'relaodMenu' }));
                    history.push('/');
                    _d.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var onSubmitFailed = function () { };
    return (react_1["default"].createElement("div", { className: 'fadeInTop container-fluid' },
        react_1["default"].createElement(page_header_component_1.PageHeaderComponent, { title: "Registro Persona Natural.", subTitle: "Por favor registre los datos exactamente como aparecen en su documento de identidad, estos datos seran usados para la generaci\u00F2n de los Documentos asociados al tr\u00E1mite solicitado y su posterior reporte a entidades de vigilancia y control.", backIcon: null }),
        react_1["default"].createElement("div", { className: 'card card-body' },
            react_1["default"].createElement("h4", { className: 'app-subtitle mt-3' }, "Datos B\u00E1sicos."),
            react_1["default"].createElement(form_1["default"], __assign({ form: form, className: 'mb-4 w-100' }, form_layout_util_1.layoutItems, { style: { maxWidth: 800 }, layout: 'horizontal', onFinish: onSubmit, onFinishFailed: onSubmitFailed }),
                react_1["default"].createElement(BasicaInformacion_1.BasicaInformacion, { form: form }),
                react_1["default"].createElement("h4", { className: 'app-subtitle mt-3' }, "Datos Geogr\u00E1ficos."),
                isColombia ? (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Nacionalidad', name: 'country', initialValue: idColombia, rules: [{ required: true }] },
                        react_1["default"].createElement(select_component_1.SelectComponent, { options: l_paises, optionPropkey: 'idPais', optionPropLabel: 'nombre', onChange: onChangePais })),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Departamento de nacimiento', name: 'stateLive', initialValue: 3, rules: [{ required: isColombia }] },
                        react_1["default"].createElement(select_component_1.SelectComponent, { options: l_departamentos_colombia, optionPropkey: 'idDepartamento', optionPropLabel: 'descripcion', onChange: onChangeDepartamento, disabled: !isColombia })),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Ciudad de nacimiento', name: 'cityLive', initialValue: 149, rules: [{ required: isColombia }] },
                        react_1["default"].createElement(select_component_1.SelectComponent, { options: l_municipios, optionPropkey: 'idMunicipio', optionPropLabel: 'descripcion', disabled: !isColombia })),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Departamento de residencia', name: 'state', initialValue: 3, rules: [{ required: isColombia }] },
                        react_1["default"].createElement(select_component_1.SelectComponent, { options: l_departamentos_colombia, optionPropkey: 'idDepartamento', optionPropLabel: 'descripcion', onChange: onChangeDepartamento, disabled: !isColombia })),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Ciudad de residencia', name: 'city', initialValue: 149, rules: [{ required: isColombia }] },
                        react_1["default"].createElement(select_component_1.SelectComponent, { options: l_municipios, optionPropkey: 'idMunicipio', optionPropLabel: 'descripcion', disabled: !isColombia })))) : (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Nacionalidad', name: 'country', initialValue: idColombia, rules: [{ required: true }] },
                        react_1["default"].createElement(select_component_1.SelectComponent, { options: l_paises, optionPropkey: 'idPais', optionPropLabel: 'nombre', onChange: onChangePais })),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Ciudad de nacimiento', name: 'cityLive', initialValue: '', rules: [{ required: true }] },
                        react_1["default"].createElement(input_1["default"], { allowClear: true, placeholder: '', autoComplete: 'off' })),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Departamento de residencia', name: 'state', rules: [{ required: true }] },
                        react_1["default"].createElement(select_component_1.SelectComponent, { options: l_departamentos_colombia, optionPropkey: 'idDepartamento', optionPropLabel: 'descripcion', onChange: onChangeDepartamento })),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Ciudad de residencia', name: 'city', rules: [{ required: true }] },
                        react_1["default"].createElement(select_component_1.SelectComponent, { options: l_municipios, optionPropkey: 'idMunicipio', optionPropLabel: 'descripcion' })))),
                react_1["default"].createElement(alert_1["default"], { message: 'Informaci\u00F3n!', description: 'Por favor registre su direcci\u00F3n de residencia tal como aparece en el recibo p\u00FAblico,\r\n                                en las casillas indicadas para esto. Una vez completado los datos, favor dar clic sobre el bot\u00F3n verde Confirmar Direcci\u00F3n.\r\n                                Esta funcionalidad permitir\u00E1 autocompletar datos de UPZ, Localidad y Barrio para las direcciones de Bogot\u00E1 D.C. y\r\n                                estandarizar la direcci\u00F3n para el resto de ciudades.', type: 'info' }),
                react_1["default"].createElement(form_1["default"].Item, { label: 'Via Ppla', name: 'ppla', rules: [{ required: true }] },
                    react_1["default"].createElement(select_component_1.SelectComponent, { options: constants_util_1.nomesclatura, optionPropkey: 'key', optionPropLabel: 'key' })),
                react_1["default"].createElement(form_1["default"].Item, { label: 'Num', name: 'Num1', rules: [{ required: true }] },
                    react_1["default"].createElement(input_1["default"], { allowClear: true, placeholder: '', autoComplete: 'off' })),
                react_1["default"].createElement(form_1["default"].Item, { label: 'letra', name: 'letra1' },
                    react_1["default"].createElement(select_component_1.SelectComponent, { options: constants_util_1.letras, optionPropkey: 'key', optionPropLabel: 'key' })),
                react_1["default"].createElement(form_1["default"].Item, { label: 'Bis', name: 'Bis' },
                    react_1["default"].createElement(select_component_1.SelectComponent, { options: [{ key: 'Bis', value: 'Bis' }], optionPropkey: 'key', optionPropLabel: 'value' })),
                react_1["default"].createElement(form_1["default"].Item, { label: 'Card', name: 'card1' },
                    react_1["default"].createElement(select_component_1.SelectComponent, { options: constants_util_1.direcionOrienta, optionPropkey: 'key', optionPropLabel: 'key' })),
                react_1["default"].createElement(form_1["default"].Item, { label: 'Num', name: 'Num2', rules: [{ required: true }] },
                    react_1["default"].createElement(input_1["default"], { allowClear: true, placeholder: '', autoComplete: 'off' })),
                react_1["default"].createElement(form_1["default"].Item, { label: 'letra', name: 'letra2' },
                    react_1["default"].createElement(select_component_1.SelectComponent, { options: constants_util_1.letras, optionPropkey: 'key', optionPropLabel: 'key' })),
                react_1["default"].createElement(form_1["default"].Item, { label: 'Placa', name: 'placa', rules: [{ required: true }] },
                    react_1["default"].createElement(input_1["default"], { allowClear: true, placeholder: '', autoComplete: 'off' })),
                react_1["default"].createElement(form_1["default"].Item, { label: 'Card', name: 'card2' },
                    react_1["default"].createElement(select_component_1.SelectComponent, { options: constants_util_1.direcionOrienta, optionPropkey: 'key', optionPropLabel: 'key' })),
                react_1["default"].createElement("h4", { className: 'app-subtitle mt-3' }, "Datos Demogr\u00E1ficos."),
                react_1["default"].createElement(form_1["default"].Item, { label: 'Fecha Nacimiento', name: 'date', rules: [{ required: true }] },
                    react_1["default"].createElement(datepicker_component_1.DatepickerComponent, { picker: 'date', dateDisabledType: 'before', dateFormatType: 'default' })),
                react_1["default"].createElement(form_1["default"].Item, { label: 'Sexo', name: 'sex', rules: [{ required: true }] },
                    react_1["default"].createElement(select_component_1.SelectComponent, { options: sex, optionPropkey: 'idSexo', optionPropLabel: 'descripcionSexo' })),
                react_1["default"].createElement(form_1["default"].Item, { label: 'Genero', name: 'gender', rules: [{ required: true }] },
                    react_1["default"].createElement(select_component_1.SelectComponent, { options: sex, optionPropkey: 'idSexo', optionPropLabel: 'descripcionSexo' })),
                react_1["default"].createElement(form_1["default"].Item, { label: 'Orientacion sexual', name: 'sexual_orientation', rules: [{ required: true }] },
                    react_1["default"].createElement(select_component_1.SelectComponent, { options: sex, optionPropkey: 'idSexo', optionPropLabel: 'descripcionSexo' })),
                react_1["default"].createElement(form_1["default"].Item, { label: 'Etnia', name: 'ethnicity', rules: [{ required: true }] },
                    react_1["default"].createElement(select_component_1.SelectComponent, { options: etniastate, optionPropkey: 'idEtnia', optionPropLabel: 'nombre' })),
                react_1["default"].createElement(form_1["default"].Item, { label: 'Estado Civil', name: 'estadoCivil', rules: [{ required: true }] },
                    react_1["default"].createElement(select_component_1.SelectComponent, { options: constants_util_2.EstadoCivil, optionPropkey: 'key', optionPropLabel: 'name' })),
                react_1["default"].createElement(form_1["default"].Item, { label: 'Nivel Educativo', name: 'levelEducation', rules: [{ required: false }] },
                    react_1["default"].createElement(select_component_1.SelectComponent, { options: nivelEducativo, optionPropkey: 'idNivelEducativo', optionPropLabel: 'nombre' })),
                react_1["default"].createElement(form_1["default"].Item, __assign({}, form_layout_util_1.layoutWrapper, { className: 'mb-0 mt-4' }),
                    react_1["default"].createElement("div", { className: 'd-flex justify-content-between' },
                        react_1["default"].createElement(button_1["default"], { type: 'dashed', htmlType: 'button', onClick: goBack }, "Volver atr\u00E1s"),
                        react_1["default"].createElement(button_1["default"], { type: 'primary', htmlType: 'submit' }, "Guardar")))))));
};
exports["default"] = RegistroPage;

//# sourceMappingURL=registro-persona.js.map
