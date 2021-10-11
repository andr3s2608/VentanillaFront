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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
// Antd
var form_1 = require("antd/es/form");
var input_1 = require("antd/es/input");
var alert_1 = require("antd/es/alert");
var steps_1 = require("antd/es/steps");
var radio_1 = require("antd/es/radio");
var button_1 = require("antd/es/button");
var divider_1 = require("antd/es/divider");
var moment_1 = require("moment");
// Componentes
var select_component_1 = require("app/shared/components/inputs/select.component");
var datepicker_component_1 = require("app/shared/components/inputs/datepicker.component");
// Hooks
var stepper_hook_1 = require("app/shared/hooks/stepper.hook");
// Utilidades
var form_layout_util_1 = require("app/shared/utils/form-layout.util");
// Secciones del formulario
var general_info_form_seccion_1 = require("./seccions/general-info.form-seccion");
var lugar_defuncion_form_seccion_1 = require("./seccions/lugar-defuncion.form-seccion");
var death_institute_form_seccion_1 = require("./seccions/death-institute.form-seccion");
var medical_signature_form_seccion_1 = require("./seccions/medical-signature.form-seccion");
var cementerio_info_form_seccion_1 = require("./seccions/cementerio-info.form-seccion");
var solicitud_info_form_seccion_1 = require("./seccions/solicitud-info.form-seccion");
var documentos_form_seccion_1 = require("./seccions/documentos.form-seccion");
// Servicios
var dominio_service_1 = require("app/services/dominio.service");
var autorizacionCremacion_1 = require("./seccions/autorizacionCremacion");
var authprovider_util_1 = require("app/shared/utils/authprovider.util");
var Apis_service_1 = require("app/services/Apis.service");
var TypeDocument_1 = require("./seccions/TypeDocument");
var react_router_1 = require("react-router");
var Inhumacion_1 = require("./edit/Inhumacion");
var Step = steps_1["default"].Step;
exports.IndividualForm = function (props) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14;
    var history = react_router_1.useHistory();
    var tipoLicencia = props.tipoLicencia, tramite = props.tramite;
    var form = form_1["default"].useForm()[0];
    var _15 = stepper_hook_1.useStepperForm(form), current = _15.current, setCurrent = _15.setCurrent, status = _15.status, setStatus = _15.setStatus, onNextStep = _15.onNextStep, onPrevStep = _15.onPrevStep;
    var accountIdentifier = authprovider_util_1.authProvider.getAccount().accountIdentifier;
    var api = new Apis_service_1.ApiService(accountIdentifier);
    var _16 = react_1.useState(), user = _16[0], setUser = _16[1];
    var _17 = react_1.useState([]), supports = _17[0], setSupports = _17[1];
    //create o edit
    var objJosn = Inhumacion_1.EditInhumacion();
    var edit = ((_a = objJosn) === null || _a === void 0 ? void 0 : _a.idTramite) ? true : false;
    //form.setFieldsValue(objJosn?);
    //#region Listados
    var _18 = react_1.useState([]), _19 = _18[0], l_paises = _19[0], l_tipos_documento = _19[1], l_estado_civil = _19[2], l_nivel_educativo = _19[3], l_etnia = _19[4], l_regimen = _19[5], l_tipo_muerte = _19[6], setListas = _18[1];
    var getListas = react_1.useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var resp, userres, support;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        dominio_service_1.dominioService.get_type(dominio_service_1.ETipoDominio.Pais),
                        dominio_service_1.dominioService.get_type(dominio_service_1.ETipoDominio['Tipo Documento']),
                        dominio_service_1.dominioService.get_type(dominio_service_1.ETipoDominio['Estado Civil']),
                        dominio_service_1.dominioService.get_type(dominio_service_1.ETipoDominio['Nivel Educativo']),
                        dominio_service_1.dominioService.get_type(dominio_service_1.ETipoDominio.Etnia),
                        dominio_service_1.dominioService.get_type(dominio_service_1.ETipoDominio.Regimen),
                        dominio_service_1.dominioService.get_type(dominio_service_1.ETipoDominio['Tipo de Muerte'])
                    ])];
                case 1:
                    resp = _b.sent();
                    return [4 /*yield*/, api.getCodeUser()];
                case 2:
                    userres = _b.sent();
                    setUser(userres);
                    setListas(resp);
                    if (!edit) return [3 /*break*/, 4];
                    return [4 /*yield*/, api.getSupportDocuments((_a = objJosn) === null || _a === void 0 ? void 0 : _a.idSolicitud)];
                case 3:
                    support = _b.sent();
                    setSupports(support);
                    _b.label = 4;
                case 4: return [2 /*return*/];
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
    var onSubmit = function (values) { return __awaiter(void 0, void 0, void 0, function () {
        var idPersonaVentanilla, formatDate, estadoSolicitud, json, container, formData_1, resp_1, _a, files, names_1, supportDocumentsEdit_1, resp_2, formData_2, container, supportDocuments_1, _b, files, names_2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setStatus(undefined);
                    idPersonaVentanilla = localStorage.getItem(accountIdentifier);
                    formatDate = 'MM-DD-YYYY';
                    estadoSolicitud = 'fdcea488-2ea7-4485-b706-a2b96a86ffdf';
                    json = {
                        solicitud: {
                            numeroCertificado: values.certificado,
                            fechaDefuncion: moment_1["default"](values.date).format(formatDate),
                            sinEstablecer: values.check,
                            hora: values.check === true ? null : moment_1["default"](values.time).format('LT'),
                            idSexo: values.sex,
                            estadoSolicitud: estadoSolicitud,
                            idPersonaVentanilla: Number(user),
                            idUsuarioSeguridad: accountIdentifier,
                            idTramite: tramite,
                            idTipoMuerte: values.deathType,
                            persona: [
                                //madre
                                {
                                    tipoIdentificacion: values.IDType,
                                    numeroIdentificacion: values.IDNumber,
                                    primerNombre: values.name,
                                    segundoNombre: values.secondName,
                                    primerApellido: values.surname,
                                    segundoApellido: values.secondSurname,
                                    fechaNacimiento: null,
                                    nacionalidad: values.nationalidad[0],
                                    otroParentesco: null,
                                    idEstadoCivil: values.civilStatus,
                                    idNivelEducativo: values.educationLevel,
                                    idEtnia: values.etnia,
                                    idRegimen: '00000000-0000-0000-0000-000000000000',
                                    idTipoPersona: '342d934b-c316-46cb-a4f3-3aac5845d246',
                                    idParentesco: '00000000-0000-0000-0000-000000000000',
                                    idLugarExpedicion: '00000000-0000-0000-0000-000000000000'
                                },
                                //authorizador cremacion
                                //certifica la defuncion
                                {
                                    tipoIdentificacion: values.medicalSignatureIDType,
                                    numeroIdentificacion: values.medicalSignatureIDNumber,
                                    primerNombre: values.medicalSignatureName,
                                    segundoNombre: values.medicalSignatureSecondName,
                                    primerApellido: values.medicalSignatureSurname,
                                    segundoApellido: values.medicalSignatureSecondSurname,
                                    fechaNacimiento: null,
                                    nacionalidad: '00000000-0000-0000-0000-000000000000',
                                    otroParentesco: null,
                                    idEstadoCivil: '00000000-0000-0000-0000-000000000000',
                                    idNivelEducativo: '00000000-0000-0000-0000-000000000000',
                                    idEtnia: '00000000-0000-0000-0000-000000000000',
                                    idRegimen: '00000000-0000-0000-0000-000000000000',
                                    idTipoPersona: 'cc4c8c4d-b557-4a5a-a2b3-520d757c5d06',
                                    idParentesco: '00000000-0000-0000-0000-000000000000',
                                    idLugarExpedicion: '1e05f64f-5e41-4252-862c-5505dbc3931c',
                                    idTipoProfesional: values.medicalSignatureProfesionalType
                                }
                            ],
                            lugarDefuncion: {
                                idPais: values.country,
                                idDepartamento: values.state,
                                idMunicipio: values.city,
                                idAreaDefuncion: values.areaDef,
                                idSitioDefuncion: values.sitDef
                            },
                            ubicacionPersona: {
                                idPaisResidencia: values.pais,
                                idDepartamentoResidencia: values.departamento,
                                idCiudadResidencia: values.ciudad,
                                idLocalidadResidencia: values.localidad,
                                idAreaResidencia: values.area,
                                idBarrioResidencia: values.barrio
                            },
                            datosCementerio: {
                                enBogota: values.cementerioLugar === 'Dentro de Bogotá',
                                fueraBogota: values.cementerioLugar === 'Fuera de Bogotá',
                                fueraPais: values.cementerioLugar === 'Fuera del País',
                                cementerio: values.cementerioBogota,
                                otroSitio: values.otro,
                                ciudad: values.cementerioCiudad,
                                idPais: values.cementerioPais,
                                idDepartamento: values.cementerioDepartamento,
                                idMunicipio: values.cementerioMunicipio
                            },
                            institucionCertificaFallecimiento: {
                                tipoIdentificacion: values.instTipoIdent,
                                numeroIdentificacion: values.instNumIdent,
                                razonSocial: values.instRazonSocial,
                                numeroProtocolo: values.instNumProtocolo,
                                numeroActaLevantamiento: values.instNumActaLevantamiento,
                                fechaActa: moment_1["default"](values.instFechaActa).format(formatDate),
                                seccionalFiscalia: values.instSeccionalFiscalia,
                                noFiscal: values.instNoFiscal,
                                idTipoInstitucion: values.instType
                            }
                            // documentosSoporte: generateFormFiel(values.instType)
                        }
                    };
                    if (!edit) return [3 /*break*/, 4];
                    localStorage.removeItem('');
                    container = tipoLicencia === 'Inhumación' ? 'inhumacionfetal' : 'cremacionfetal';
                    formData_1 = new FormData();
                    return [4 /*yield*/, api.putLicencia(json.solicitud)];
                case 1:
                    resp_1 = _c.sent();
                    localStorage.removeItem('register');
                    _a = generateListFiles(values), files = _a[0], names_1 = _a[1];
                    supportDocumentsEdit_1 = [];
                    files.forEach(function (item, i) {
                        var name = names_1[i];
                        formData_1.append('file', item);
                        formData_1.append('nameFile', name);
                        TypeDocument_1.TypeDocument.forEach(function (item) {
                            if (item.key === name.toString()) {
                                var support = supports.filter(function (p) { return p.path.includes(item.name); })[0];
                                supportDocumentsEdit_1.push({
                                    idDocumentoSoporte: support.idDocumentoSoporte,
                                    idSolicitud: resp_1,
                                    idTipoDocumentoSoporte: item.value,
                                    path: accountIdentifier + "/" + name,
                                    idUsuario: accountIdentifier,
                                    fechaModificacion: new Date()
                                });
                            }
                        });
                    });
                    formData_1.append('containerName', container);
                    formData_1.append('oid', accountIdentifier);
                    if (!supportDocumentsEdit_1.length) return [3 /*break*/, 4];
                    return [4 /*yield*/, api.uploadFiles(formData_1)];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, api.UpdateSupportDocuments(supportDocumentsEdit_1)];
                case 3:
                    _c.sent();
                    _c.label = 4;
                case 4:
                    if (!!edit) return [3 /*break*/, 8];
                    return [4 /*yield*/, api.postLicencia(json)];
                case 5:
                    resp_2 = _c.sent();
                    if (!resp_2) return [3 /*break*/, 8];
                    formData_2 = new FormData();
                    container = tipoLicencia === 'Inhumación' ? 'inhumacionindividual' : 'cremacionindividual';
                    supportDocuments_1 = [];
                    _b = generateListFiles(values), files = _b[0], names_2 = _b[1];
                    files.forEach(function (item, i) {
                        var name = names_2[i];
                        formData_2.append('file', item);
                        formData_2.append('nameFile', name);
                        TypeDocument_1.TypeDocument.forEach(function (item) {
                            if (item.key === name.toString()) {
                                supportDocuments_1.push({
                                    idSolicitud: resp_2,
                                    idTipoDocumentoSoporte: item.value,
                                    path: accountIdentifier + "/" + name,
                                    idUsuario: accountIdentifier
                                });
                            }
                        });
                    });
                    formData_2.append('containerName', container);
                    formData_2.append('oid', accountIdentifier);
                    return [4 /*yield*/, api.uploadFiles(formData_2)];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, api.AddSupportDocuments(supportDocuments_1)];
                case 7:
                    _c.sent();
                    _c.label = 8;
                case 8:
                    history.push('/tramites-servicios');
                    return [2 /*return*/];
            }
        });
    }); };
    var generateListFiles = function (values) {
        var Objs = [];
        var fileCertificadoDefuncion = values.fileCertificadoDefuncion, fileCCFallecido = values.fileCCFallecido, fileOtrosDocumentos = values.fileOtrosDocumentos, fileAuthCCFamiliar = values.fileAuthCCFamiliar, fileAuthCremacion = values.fileAuthCremacion, fileOficioIdentificacion = values.fileOficioIdentificacion, fileOrdenAuthFiscal = values.fileOrdenAuthFiscal, fileActaNotarialFiscal = values.fileActaNotarialFiscal;
        Objs.push({ file: fileCertificadoDefuncion, name: 'Certificado_Defuncion' });
        Objs.push({ file: fileCCFallecido, name: 'Documento_del_fallecido' });
        Objs.push({ file: fileOtrosDocumentos, name: 'Otros_Documentos' });
        Objs.push({ file: fileAuthCCFamiliar, name: 'Autorizacion_de_cremacion_del_familiar' });
        Objs.push({ file: fileAuthCremacion, name: 'Documento_del_familiar' });
        Objs.push({ file: fileOficioIdentificacion, name: 'Autorizacion_del_fiscal_para_cremar' });
        Objs.push({ file: fileOrdenAuthFiscal, name: 'Oficio_de_medicina_legal_al_fiscal_para_cremar' });
        Objs.push({ file: fileActaNotarialFiscal, name: 'Acta_Notarial_del_Fiscal' });
        var filesName = Objs.filter(function (item) { return item.file !== undefined; });
        var files = filesName.map(function (item) {
            var file = item.file[0];
            return file.originFileObj;
        });
        var names = filesName.map(function (item) { return item.name; });
        return [files, names];
    };
    var onSubmitFailed = function () { return setStatus('error'); };
    //#region Eventos formulario
    var _20 = react_1.useState(false), isCremacion = _20[0], setIsCremacion = _20[1];
    react_1.useEffect(function () {
        setIsCremacion(tipoLicencia === 'Cremación');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tipoLicencia]);
    var _21 = react_1.useState(true), hasCremacionAuth = _21[0], setHasCremacionAuth = _21[1];
    var onChangeCremacionAuth = function (value) {
        form.resetFields([
            'authIDType',
            'authName',
            'authSecondName',
            'authSurname',
            'authSecondSurname',
            'authParentesco',
            'authOtherParentesco'
        ]);
        setHasCremacionAuth(value);
    };
    var _22 = react_1.useState(false), isOtherParentesco = _22[0], setIsOtherParentesco = _22[1];
    var onChangeParentesco = function (e) {
        form.resetFields(['authOtherParentesco']);
        setIsOtherParentesco(e.target.value === 'Otro');
    };
    //edit
    var date = ((_b = objJosn) === null || _b === void 0 ? void 0 : _b.dateOfBirth) !== undefined ? moment_1["default"]((_c = objJosn) === null || _c === void 0 ? void 0 : _c.dateOfBirth) : null;
    //#endregion
    return (react_1["default"].createElement("div", { className: 'card card-body py-5 mb-4 fadeInTop' },
        react_1["default"].createElement("div", { className: 'd-lg-flex align-items-start' },
            react_1["default"].createElement(steps_1["default"], { className: 'mb-5 mr-5', current: current, status: status, onChange: setCurrent, direction: 'vertical', style: { maxWidth: 250 } },
                react_1["default"].createElement(Step, { title: 'Informaci\u00F3n General', description: 'Datos Certificaci\u00F3n del fallecimiento.' }),
                react_1["default"].createElement(Step, { title: 'Informaci\u00F3n del Fallecido', description: 'Datos personales e informaci\u00F3n del fallecido.' }),
                react_1["default"].createElement(Step, { title: 'Informaci\u00F3n Solicitante', description: 'Datos del fallecimiento, Solicitud y otros datos.' }),
                react_1["default"].createElement(Step, { title: 'Informaci\u00F3n Certificado', description: 'Datos de Quien Certifica la defunci\u00F3n - Medico.' }),
                react_1["default"].createElement(Step, { title: 'Documentos Requeridos', description: 'Documentos de soporte pdf.' })),
            react_1["default"].createElement(form_1["default"], __assign({ form: form, className: 'mb-4 w-100' }, form_layout_util_1.layoutItems, { style: { maxWidth: 800 }, layout: 'horizontal', onFinish: onSubmit, onFinishFailed: onSubmitFailed }),
                react_1["default"].createElement("div", { className: "d-none fadeInRight " + (current === 0 && 'd-block') },
                    react_1["default"].createElement(general_info_form_seccion_1.GeneralInfoFormSeccion, { obj: objJosn }),
                    react_1["default"].createElement(lugar_defuncion_form_seccion_1.LugarDefuncionFormSeccion, { form: form, obj: objJosn }),
                    react_1["default"].createElement(death_institute_form_seccion_1.DeathInstituteFormSeccion, { obj: objJosn, form: form, datofiscal: true, required: true, tipoLicencia: tipoLicencia }),
                    react_1["default"].createElement(form_1["default"].Item, __assign({}, form_layout_util_1.layoutWrapper, { className: 'mb-0 mt-4' }),
                        react_1["default"].createElement("div", { className: 'd-flex justify-content-end' },
                            react_1["default"].createElement(button_1["default"], { type: 'primary', htmlType: 'button', onClick: function () { return onNextStep(__spreadArrays(general_info_form_seccion_1.KeysForm, death_institute_form_seccion_1.KeysForm, lugar_defuncion_form_seccion_1.KeysForm)); } }, "Siguiente")))),
                react_1["default"].createElement("div", { className: "d-none fadeInRight " + (current === 1 && 'd-block') },
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Primer Nombre', name: 'name', rules: [{ required: true }], initialValue: (_d = objJosn) === null || _d === void 0 ? void 0 : _d.name },
                        react_1["default"].createElement(input_1["default"], { allowClear: true, placeholder: 'Primer Nombre', autoComplete: 'off' })),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Segundo Nombre', name: 'secondName', initialValue: (_e = objJosn) === null || _e === void 0 ? void 0 : _e.secondName },
                        react_1["default"].createElement(input_1["default"], { allowClear: true, placeholder: 'Segundo Nombre', autoComplete: 'off' })),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Primer Apellido', name: 'surname', rules: [{ required: true }], initialValue: (_f = objJosn) === null || _f === void 0 ? void 0 : _f.surname },
                        react_1["default"].createElement(input_1["default"], { allowClear: true, placeholder: 'Primer Apellido', autoComplete: 'off' })),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Segundo Apellido', name: 'secondSurname', initialValue: (_g = objJosn) === null || _g === void 0 ? void 0 : _g.secondSurname },
                        react_1["default"].createElement(input_1["default"], { allowClear: true, placeholder: 'Segundo Apellido', autoComplete: 'off' })),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Nacionalidad', name: 'nationalidad', initialValue: [((_h = objJosn) === null || _h === void 0 ? void 0 : _h.nacionalidad) ? (_j = objJosn) === null || _j === void 0 ? void 0 : _j.nacionalidad : '1e05f64f-5e41-4252-862c-5505dbc3931c'], rules: [{ required: true, type: 'array' }] },
                        react_1["default"].createElement(select_component_1.SelectComponent, { options: l_paises, mode: 'multiple', placeholder: '-- Elija una o varias --', optionPropkey: 'id', optionPropLabel: 'descripcion' })),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Fecha de Nacimiento', name: 'dateOfBirth', rules: [{ required: true }], initialValue: date },
                        react_1["default"].createElement(datepicker_component_1.DatepickerComponent, { picker: 'date', dateDisabledType: 'before', dateFormatType: 'default', value: date })),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Tipo Identificaci\u00F3n', name: 'IDType', initialValue: ((_k = objJosn) === null || _k === void 0 ? void 0 : _k.IDType) ? (_l = objJosn) === null || _l === void 0 ? void 0 : _l.IDType : '7c96a4d3-a0cb-484e-a01b-93bc39c2552e', rules: [{ required: true }] },
                        react_1["default"].createElement(select_component_1.SelectComponent, { options: l_tipos_documento, optionPropkey: 'id', optionPropLabel: 'descripcion' })),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'N\u00FAmero de Identificaci\u00F3n', name: 'IDNumber', initialValue: ((_m = objJosn) === null || _m === void 0 ? void 0 : _m.IDNumber) !== undefined ? (_o = objJosn) === null || _o === void 0 ? void 0 : _o.IDNumber : null, rules: [{ required: true, max: 25 }] },
                        react_1["default"].createElement(input_1["default"], { allowClear: true, placeholder: 'N\u00FAmero de Identificaci\u00F3n', autoComplete: 'off' })),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Estado Civil', name: 'civilStatus', initialValue: (_q = (_p = objJosn) === null || _p === void 0 ? void 0 : _p.civilStatus, (_q !== null && _q !== void 0 ? _q : '4c17996a-7113-4e17-a0fe-6fd7cd9bbcd1')) },
                        react_1["default"].createElement(select_component_1.SelectComponent, { options: l_estado_civil, optionPropkey: 'id', optionPropLabel: 'descripcion' })),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Nivel Educativo', name: 'educationLevel', initialValue: (_s = (_r = objJosn) === null || _r === void 0 ? void 0 : _r.educationLevel, (_s !== null && _s !== void 0 ? _s : '07ebd0bb-2b00-4a2b-8db5-4582eee1d285')) },
                        react_1["default"].createElement(select_component_1.SelectComponent, { options: l_nivel_educativo, optionPropkey: 'id', optionPropLabel: 'descripcion' })),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Etnia', name: 'etnia', initialValue: (_u = (_t = objJosn) === null || _t === void 0 ? void 0 : _t.etnia, (_u !== null && _u !== void 0 ? _u : '60875c52-9b2a-4836-8bc7-2f3648f41f57')) },
                        react_1["default"].createElement(select_component_1.SelectComponent, { options: l_etnia, optionPropkey: 'id', optionPropLabel: 'descripcion' })),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'R\u00E9gimen', name: 'regime', initialValue: (_w = (_v = objJosn) === null || _v === void 0 ? void 0 : _v.regime, (_w !== null && _w !== void 0 ? _w : '848c6d53-6bda-4596-a889-8fdb0292f9e4')) },
                        react_1["default"].createElement(select_component_1.SelectComponent, { options: l_regimen, optionPropkey: 'id', optionPropLabel: 'descripcion' })),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Tipo de Muerte', name: 'deathType', initialValue: (_y = (_x = objJosn) === null || _x === void 0 ? void 0 : _x.deathType, (_y !== null && _y !== void 0 ? _y : '475c280d-67af-47b0-a8bc-de420f6ac740')), rules: [{ required: true }] },
                        react_1["default"].createElement(select_component_1.SelectComponent, { options: l_tipo_muerte, optionPropkey: 'id', optionPropLabel: 'descripcion' })),
                    false && (react_1["default"].createElement(react_1["default"].Fragment, null,
                        react_1["default"].createElement(divider_1["default"], { orientation: 'right' }, "Reconocido como..."),
                        react_1["default"].createElement(form_1["default"].Item, { label: 'Tipo Identificaci\u00F3n', name: 'knownIDType' },
                            react_1["default"].createElement(select_component_1.SelectComponent, { options: l_tipos_documento, optionPropkey: 'id', optionPropLabel: 'descripcion' })),
                        react_1["default"].createElement(form_1["default"].Item, { label: 'N\u00FAmero de Identificaci\u00F3n', name: 'knownIDNumber' },
                            react_1["default"].createElement(input_1["default"], { allowClear: true, type: 'tel', placeholder: 'N\u00FAmero de Identificaci\u00F3n', autoComplete: 'off' })),
                        react_1["default"].createElement(form_1["default"].Item, { label: 'Nombre', name: 'knownName' },
                            react_1["default"].createElement(input_1["default"], { allowClear: true, placeholder: 'Nombres y Apellidos completos', autoComplete: 'off' })))),
                    react_1["default"].createElement(form_1["default"].Item, __assign({}, form_layout_util_1.layoutWrapper, { className: 'mb-0 mt-4' }),
                        react_1["default"].createElement("div", { className: 'd-flex justify-content-between' },
                            react_1["default"].createElement(button_1["default"], { type: 'dashed', htmlType: 'button', onClick: onPrevStep }, "Volver atr\u00E1s"),
                            react_1["default"].createElement(button_1["default"], { type: 'primary', htmlType: 'button', onClick: function () {
                                    return onNextStep([
                                        'name',
                                        'secondName',
                                        'surname',
                                        'secondSurname',
                                        'nationalidad',
                                        'dateOfBirth',
                                        'IDType',
                                        'IDNumber',
                                        'civilStatus',
                                        'educationLevel',
                                        'etnia',
                                        'age',
                                        'unitAge',
                                        'regime',
                                        'knownIDType',
                                        'knownIDNumber',
                                        'knownName',
                                        'deathType'
                                    ]);
                                } }, "Siguiente")))),
                react_1["default"].createElement("div", { className: "d-none fadeInRight " + (current === 2 && 'd-block') },
                    isCremacion && (react_1["default"].createElement(react_1["default"].Fragment, null,
                        react_1["default"].createElement(divider_1["default"], { orientation: 'right' }, "Datos Del Familiar Que Autoriza la Cremaci\u00F3n"),
                        hasCremacionAuth && (react_1["default"].createElement("div", { className: 'fadeInRight' },
                            react_1["default"].createElement(form_1["default"].Item, __assign({}, form_layout_util_1.layoutWrapper),
                                react_1["default"].createElement(alert_1["default"], { message: 'Diligencie la informaci\u00F3n del familiar o persona que autoriza la cremaci\u00F3n.', type: 'warning', showIcon: true })),
                            react_1["default"].createElement(form_1["default"].Item, { label: 'Tipo Documento', name: 'authIDType', initialValue: ((_z = objJosn) === null || _z === void 0 ? void 0 : _z.authIDType) ? (_0 = objJosn) === null || _0 === void 0 ? void 0 : _0.authIDType : '7c96a4d3-a0cb-484e-a01b-93bc39c2552e', rules: [{ required: true }] },
                                react_1["default"].createElement(select_component_1.SelectComponent, { options: l_tipos_documento, optionPropkey: 'id', optionPropLabel: 'descripcion' })),
                            react_1["default"].createElement(form_1["default"].Item, { label: 'N\u00FAmero de Identificaci\u00F3n', name: 'mauthIDNumber', rules: [{ required: true, max: 20 }], initialValue: ((_1 = objJosn) === null || _1 === void 0 ? void 0 : _1.mauthIDNumber) ? (_2 = objJosn) === null || _2 === void 0 ? void 0 : _2.mauthIDNumber : null },
                                react_1["default"].createElement(input_1["default"], { allowClear: true, type: 'tel', placeholder: 'N\u00FAmero de Identificaci\u00F3n', autoComplete: 'off' })),
                            react_1["default"].createElement(form_1["default"].Item, { label: 'Primer Nombre', name: 'authName', initialValue: ((_3 = objJosn) === null || _3 === void 0 ? void 0 : _3.authName) ? (_4 = objJosn) === null || _4 === void 0 ? void 0 : _4.authName : null, rules: [{ required: true }] },
                                react_1["default"].createElement(input_1["default"], { allowClear: true, placeholder: 'Primer Nombre', autoComplete: 'off' })),
                            react_1["default"].createElement(form_1["default"].Item, { label: 'Segundo Nombre', initialValue: ((_5 = objJosn) === null || _5 === void 0 ? void 0 : _5.authSecondName) ? (_6 = objJosn) === null || _6 === void 0 ? void 0 : _6.authSecondName : null, name: 'authSecondName' },
                                react_1["default"].createElement(input_1["default"], { allowClear: true, placeholder: 'Segundo Nombre', autoComplete: 'off' })),
                            react_1["default"].createElement(form_1["default"].Item, { label: 'Primer Apellido', initialValue: ((_7 = objJosn) === null || _7 === void 0 ? void 0 : _7.authSurname) ? (_8 = objJosn) === null || _8 === void 0 ? void 0 : _8.authSurname : null, name: 'authSurname', rules: [{ required: true }] },
                                react_1["default"].createElement(input_1["default"], { allowClear: true, placeholder: 'Primer Apellido', autoComplete: 'off' })),
                            react_1["default"].createElement(form_1["default"].Item, { label: 'Segundo Apellido', initialValue: ((_9 = objJosn) === null || _9 === void 0 ? void 0 : _9.authSecondSurname) ? (_10 = objJosn) === null || _10 === void 0 ? void 0 : _10.authSecondSurname : null, name: 'authSecondSurname' },
                                react_1["default"].createElement(input_1["default"], { allowClear: true, placeholder: 'Segundo Apellido', autoComplete: 'off' })),
                            react_1["default"].createElement(form_1["default"].Item, { label: 'Parentesco', initialValue: ((_11 = objJosn) === null || _11 === void 0 ? void 0 : _11.authParentesco) ? (_12 = objJosn) === null || _12 === void 0 ? void 0 : _12.authParentesco : 'Cónyuge (Compañero/a Permanente)', name: 'authParentesco', rules: [{ required: true }] },
                                react_1["default"].createElement(radio_1["default"].Group, { onChange: onChangeParentesco },
                                    react_1["default"].createElement(radio_1["default"], { value: 'Padre / Madre' }, "Padre / Madre"),
                                    react_1["default"].createElement("br", null),
                                    react_1["default"].createElement(radio_1["default"], { value: 'Hermano/a' }, "Hermano/a"),
                                    react_1["default"].createElement("br", null),
                                    react_1["default"].createElement(radio_1["default"], { value: 'Hijo/a' }, "Hijo/a"),
                                    react_1["default"].createElement("br", null),
                                    react_1["default"].createElement(radio_1["default"], { value: 'C\u00F3nyuge (Compa\u00F1ero/a Permanente)' }, "C\u00F3nyuge (Compa\u00F1ero/a Permanente)"),
                                    react_1["default"].createElement("br", null),
                                    react_1["default"].createElement(radio_1["default"], { value: 'T\u00EDo/a' }, "T\u00EDo/a"),
                                    react_1["default"].createElement("br", null),
                                    react_1["default"].createElement(radio_1["default"], { value: 'Sobrino/a' }, "Sobrino/a"),
                                    react_1["default"].createElement("br", null),
                                    react_1["default"].createElement(radio_1["default"], { value: 'Abuelo/a' }, "Abuelo/a"),
                                    react_1["default"].createElement("br", null),
                                    react_1["default"].createElement(radio_1["default"], { value: 'Nieto/a' }, "Nieto/a"),
                                    react_1["default"].createElement("br", null),
                                    react_1["default"].createElement(radio_1["default"], { value: 'Otro' }, "Otro"))),
                            isOtherParentesco && (react_1["default"].createElement(form_1["default"].Item, { className: 'fadeInRight', label: 'Otro... \u00BFC\u00FAal?', name: 'authOtherParentesco', initialValue: ((_13 = objJosn) === null || _13 === void 0 ? void 0 : _13.authOtherParentesco) ? (_14 = objJosn) === null || _14 === void 0 ? void 0 : _14.authOtherParentesco : true, rules: [{ required: true }] },
                                react_1["default"].createElement(input_1["default"], { allowClear: true, placeholder: 'Especifique el Parentesco', autoComplete: 'off' }))),
                            react_1["default"].createElement(autorizacionCremacion_1.AutorizacionCremacion, { tipoLicencia: tipoLicencia }))))),
                    react_1["default"].createElement(solicitud_info_form_seccion_1.SolicitudInfoFormSeccion, { form: form, obj: objJosn }),
                    react_1["default"].createElement(cementerio_info_form_seccion_1.CementerioInfoFormSeccion, { obj: objJosn, form: form, tipoLicencia: tipoLicencia }),
                    react_1["default"].createElement(form_1["default"].Item, __assign({}, form_layout_util_1.layoutWrapper, { className: 'mb-0 mt-4' }),
                        react_1["default"].createElement("div", { className: 'd-flex justify-content-between' },
                            react_1["default"].createElement(button_1["default"], { type: 'dashed', htmlType: 'button', onClick: onPrevStep }, "Volver atr\u00E1s"),
                            react_1["default"].createElement(button_1["default"], { type: 'primary', htmlType: 'button', onClick: function () {
                                    return onNextStep(__spreadArrays(solicitud_info_form_seccion_1.KeysForm, cementerio_info_form_seccion_1.KeysForm, [
                                        'authIDType',
                                        'mauthIDNumber',
                                        'authName',
                                        'authSecondName',
                                        'authSurname',
                                        'authSecondSurname',
                                        'authParentesco',
                                        'authOtherParentesco'
                                    ]));
                                } }, "Siguiente")))),
                react_1["default"].createElement("div", { className: "d-none fadeInRight " + (current === 3 && 'd-block') },
                    react_1["default"].createElement(medical_signature_form_seccion_1.MedicalSignatureFormSeccion, { obj: objJosn, form: form }),
                    react_1["default"].createElement(form_1["default"].Item, __assign({}, form_layout_util_1.layoutWrapper, { className: 'mb-0 mt-4' }),
                        react_1["default"].createElement("div", { className: 'd-flex justify-content-between' },
                            react_1["default"].createElement(button_1["default"], { type: 'dashed', htmlType: 'button', onClick: onPrevStep }, "Volver atr\u00E1s"),
                            react_1["default"].createElement(button_1["default"], { type: 'primary', htmlType: 'button', onClick: function () { return onNextStep(__spreadArrays(medical_signature_form_seccion_1.KeysForm)); } }, "Siguiente")))),
                react_1["default"].createElement("div", { className: "d-none fadeInRight " + (current === 4 && 'd-block') },
                    react_1["default"].createElement(documentos_form_seccion_1.DocumentosFormSeccion, { obj: objJosn, tipoLicencia: tipoLicencia, tipoIndividuo: 'Individual', form: form }),
                    react_1["default"].createElement(form_1["default"].Item, __assign({}, form_layout_util_1.layoutWrapper, { className: 'mb-0 mt-4' }),
                        react_1["default"].createElement("div", { className: 'd-flex justify-content-between' },
                            react_1["default"].createElement(button_1["default"], { type: 'dashed', htmlType: 'button', onClick: onPrevStep }, "Volver atr\u00E1s"),
                            react_1["default"].createElement(button_1["default"], { type: 'primary', htmlType: 'submit' }, "Guardar"))))))));
};

//# sourceMappingURL=individual.form.js.map
