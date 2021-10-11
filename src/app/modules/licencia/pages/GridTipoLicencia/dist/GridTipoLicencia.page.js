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
var tabs_1 = require("antd/es/tabs");
var Apis_service_1 = require("app/services/Apis.service");
var page_header_component_1 = require("app/shared/components/page-header.component");
var table_1 = require("app/shared/components/table");
var authprovider_util_1 = require("app/shared/utils/authprovider.util");
var react_1 = require("react");
var TabPane = tabs_1["default"].TabPane;
var GridTipoLicencia = function (props) {
    var _a = react_1.useState([]), grid = _a[0], setGrid = _a[1];
    var _b = react_1.useState([]), roles = _b[0], setroles = _b[1];
    var accountIdentifier = authprovider_util_1.authProvider.getAccount().accountIdentifier;
    var api = new Apis_service_1.ApiService(accountIdentifier);
    var getListas = react_1.useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.GetRoles().then(function (res) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    setroles(res);
                                    return [4 /*yield*/, GetValidateRol(res)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
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
    var GetValidateRol = function (toRoles) { return __awaiter(void 0, void 0, void 0, function () {
        var permiso, resp, resp;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    permiso = (roles.length > 0 ? roles : toRoles)[0];
                    if (!(((_a = permiso) === null || _a === void 0 ? void 0 : _a.rol) === 'Ciudadano')) return [3 /*break*/, 2];
                    return [4 /*yield*/, api.GetEstadoSolicitud()];
                case 1:
                    resp = _c.sent();
                    setGrid(resp);
                    _c.label = 2;
                case 2:
                    if (!(((_b = permiso) === null || _b === void 0 ? void 0 : _b.rol) === 'Funcionario')) return [3 /*break*/, 4];
                    return [4 /*yield*/, api.GetAllLicencias()];
                case 3:
                    resp = _c.sent();
                    setGrid(resp);
                    _c.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (react_1["default"].createElement("div", { className: 'fadeInTop container-fluid' },
        react_1["default"].createElement(page_header_component_1.PageHeaderComponent, { title: 'Maestro detalle', subTitle: 'Consulte el tr\u00E1mite de los certificados.' }),
        react_1["default"].createElement(tabs_1["default"], null,
            react_1["default"].createElement(TabPane, { tab: '', key: '1' },
                react_1["default"].createElement("div", { className: 'card card-body py-5 mb-4 fadeInTop' }, "Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee. Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic, assumenda labore aesthetic magna delectus mollit. Keytar helvetica VHS salvia yr, vero magna velit sapiente labore stumptown. Vegan fanny pack odio cillum wes anderson 8-bit, sustainable jean shorts beard ut DIY ethical culpa terry richardson biodiesel. Art party scenester stumptown, tumblr butcher vero sint qui sapiente accusamus tattooed echo park."),
                react_1["default"].createElement(table_1.Gridview, { data: grid })))));
};
exports["default"] = GridTipoLicencia;

//# sourceMappingURL=GridTipoLicencia.page.js.map
