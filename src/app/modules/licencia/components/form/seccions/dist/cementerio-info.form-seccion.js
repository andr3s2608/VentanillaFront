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
var react_1 = require("react");
// Antd
var form_1 = require("antd/es/form");
var radio_1 = require("antd/es/radio");
var input_1 = require("antd/es/input");
var divider_1 = require("antd/es/divider");
// Componentes
var select_component_1 = require("app/shared/components/inputs/select.component");
// Servicios
var dominio_service_1 = require("app/services/dominio.service");
exports.CementerioInfoFormSeccion = function (props) {
    var _a, _b, _c;
    var form = props.form, tipoLicencia = props.tipoLicencia;
    var obj = props.obj;
    //#region Listados
    var _d = react_1.useState({
        municipio: '',
        departament: ''
    }), isMunicipio = _d[0], setMunicipio = _d[1];
    var _e = react_1.useState([]), l_municipios = _e[0], setLMunicipios = _e[1];
    var _f = react_1.useState([[], [], []]), _g = _f[0], l_departamentos_colombia = _g[0], l_cementerios = _g[1], l_paises = _g[2], setListas = _f[1];
    var getListas = react_1.useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        dominio_service_1.dominioService.get_departamentos_colombia(),
                        dominio_service_1.dominioService.get_cementerios_bogota(),
                        dominio_service_1.dominioService.get_type(dominio_service_1.ETipoDominio.Pais)
                    ])];
                case 1:
                    resp = _a.sent();
                    setListas(resp);
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
    //#endregion
    //#region Acciones del formulario
    var cota = 'b5c40416-db96-4d1d-a5bd-da0ce61930e7';
    var cundinamarca = '1029c7b3-e8c7-46e6-8275-3e568e06e03c';
    var lugarCementerio = (_a = obj) === null || _a === void 0 ? void 0 : _a.isLugar();
    var _h = react_1.useState(lugarCementerio), lugar = _h[0], setLugar = _h[1];
    var onChangeLugarCementerio = function (e) {
        form.resetFields(['cementerioBogota', 'cementerioDepartamento', 'cementerioMunicipio', 'cementerioPais', 'cementerioCiudad']);
        setLMunicipios([]);
        setLugar(e.target.value);
    };
    var onChangeDepartamento = function (value) { return __awaiter(void 0, void 0, void 0, function () {
        var resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    form.resetFields(['cementerioMunicipio']);
                    return [4 /*yield*/, dominio_service_1.dominioService.get_municipios_by_departamento(value)];
                case 1:
                    resp = _a.sent();
                    setLMunicipios(resp);
                    return [2 /*return*/];
            }
        });
    }); };
    var onChangeMunicipio = function (value) { return __awaiter(void 0, void 0, void 0, function () {
        var departament;
        return __generator(this, function (_a) {
            departament = form.getFieldValue('cementerioDepartamento');
            setMunicipio({
                departament: departament,
                municipio: value
            });
            return [2 /*return*/];
        });
    }); };
    //#endregion
    var renderForm = function (_lugar) {
        var _a, _b, _c, _d, _e, _f;
        switch (_lugar) {
            case 'Fuera de Bogotá':
                return (react_1["default"].createElement("div", { className: 'fadeInRight' },
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Departamento de Colombia', name: 'cementerioDepartamento', rules: [{ required: true }], initialValue: (_a = obj) === null || _a === void 0 ? void 0 : _a.cementerioDepartamento },
                        react_1["default"].createElement(select_component_1.SelectComponent, { options: l_departamentos_colombia.filter(function (i) { return i.descripcion !== 'BOGOTÁ D.C.'; }), optionPropkey: 'descripcion', optionPropLabel: 'descripcion', onChange: onChangeDepartamento })),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Municipio', name: 'cementerioMunicipio', initialValue: (_b = obj) === null || _b === void 0 ? void 0 : _b.cementerioMunicipio, rules: [{ required: true }] },
                        react_1["default"].createElement(select_component_1.SelectComponent, { options: l_municipios, optionPropkey: 'descripcion', onChange: onChangeMunicipio, optionPropLabel: 'descripcion' })),
                    isMunicipio.departament === cundinamarca && isMunicipio.municipio === cota && (react_1["default"].createElement(form_1["default"].Item, { label: 'Otro sitio', name: 'otro', rules: [{ required: true }], initialValue: (_c = obj) === null || _c === void 0 ? void 0 : _c.otro },
                        react_1["default"].createElement(input_1["default"], { allowClear: true, placeholder: 'Otro Sitio', autoComplete: 'off' })))));
            case 'Fuera del País':
                return (react_1["default"].createElement("div", { className: 'fadeInRight' },
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Pa\u00EDs', name: 'cementerioPais', rules: [{ required: true }], initialValue: (_d = obj) === null || _d === void 0 ? void 0 : _d.cementerioPais },
                        react_1["default"].createElement(select_component_1.SelectComponent, { options: l_paises.filter(function (i) { return i.descripcion !== 'Colombia'; }), optionPropkey: 'descripcion  ', optionPropLabel: 'descripcion' })),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Ciudad', name: 'cementerioCiudad', initialValue: (_e = obj) === null || _e === void 0 ? void 0 : _e.cementerioCiudad, rules: [{ required: true }] },
                        react_1["default"].createElement(input_1["default"], { allowClear: true, placeholder: 'Ciudad', autoComplete: 'off' }))));
            default:
                return (react_1["default"].createElement(form_1["default"].Item, { className: 'fadeInRight', label: 'Cementerio de Bogot\u00E1 D.C.', name: 'cementerioBogota', initialValue: (_f = obj) === null || _f === void 0 ? void 0 : _f.cementerioBogota, rules: [{ required: true }] },
                    react_1["default"].createElement(select_component_1.SelectComponent, { options: l_cementerios, optionPropkey: 'RAZON_S', optionPropLabel: 'RAZON_S' })));
        }
    };
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(divider_1["default"], { orientation: 'right' },
            "Datos del Cementerio a realizar la ",
            tipoLicencia),
        react_1["default"].createElement(form_1["default"].Item, { className: 'mb-4', label: 'Lugar del cementerio', name: 'cementerioLugar', initialValue: (_c = (_b = obj) === null || _b === void 0 ? void 0 : _b.isLugar(), (_c !== null && _c !== void 0 ? _c : 'Dentro de Bogotá')), rules: [{ required: true }] },
            react_1["default"].createElement(radio_1["default"].Group, { onChange: onChangeLugarCementerio },
                react_1["default"].createElement(radio_1["default"], { value: 'Dentro de Bogot\u00E1' }, "DENTRO DE BOGOT\u00C1"),
                react_1["default"].createElement("br", null),
                react_1["default"].createElement(radio_1["default"], { value: 'Fuera de Bogot\u00E1' }, "FUERA DE BOGOT\u00C1"),
                react_1["default"].createElement("br", null),
                react_1["default"].createElement(radio_1["default"], { value: 'Fuera del Pa\u00EDs' }, "FUERA DEL PA\u00CDS"))),
        renderForm(lugar)));
};
exports.KeysForm = [
    'cementerioLugar',
    'cementerioBogota',
    'cementerioDepartamento',
    'cementerioMunicipio',
    'cementerioPais',
    'cementerioCiudad'
];

//# sourceMappingURL=cementerio-info.form-seccion.js.map
