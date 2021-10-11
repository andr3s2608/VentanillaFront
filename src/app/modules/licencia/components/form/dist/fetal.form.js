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
var steps_1 = require("antd/es/steps");
var button_1 = require("antd/es/button");
// Componentes
var select_component_1 = require("app/shared/components/inputs/select.component");
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
var divider_1 = require("antd/es/divider");
var familarCremacion_1 = require("./familarCremacion");
var moment_1 = require("moment");
var authprovider_util_1 = require("app/shared/utils/authprovider.util");
var Apis_service_1 = require("app/services/Apis.service");
var TypeDocument_1 = require("./seccions/TypeDocument");
var react_router_1 = require("react-router");
var fetal_1 = require("./edit/fetal");
var Step = steps_1["default"].Step;
exports.FetalForm = function (props) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4;
    var history = react_router_1.useHistory();
    var tipoLicencia = props.tipoLicencia, tramite = props.tramite;
    var form = form_1["default"].useForm()[0];
    var _5 = stepper_hook_1.useStepperForm(form), current = _5.current, setCurrent = _5.setCurrent, status = _5.status, setStatus = _5.setStatus, onNextStep = _5.onNextStep, onPrevStep = _5.onPrevStep;
    //#region Listados
    var _6 = react_1.useState([]), l_departamentos = _6[0], setLDepartamentos = _6[1];
    var _7 = react_1.useState([]), l_localidades = _7[0], setLLocalidades = _7[1];
    var _8 = react_1.useState([]), _9 = _8[0], l_tipos_documento = _9[0], l_nivel_educativo = _9[1], l_paises = _9[2], l_tipo_muerte = _9[3], l_estado_civil = _9[4], l_etnia = _9[5], setListas = _8[1];
    var _10 = react_1.useState(), estado = _10[0], setEstado = _10[1];
    var _11 = react_1.useState([]), supports = _11[0], setSupports = _11[1];
    var _12 = react_1.useState(), user = _12[0], setUser = _12[1];
    var idBogota = '31211657-3386-420a-8620-f9c07a8ca491';
    var idlocalidad = '0e2105fb-08f8-4faf-9a79-de5effa8d198';
    var idupz = 'd869bc18-4fca-422a-9a09-a88d3911dc8c';
    var idbarrio = '4674c6b9-1e5f-4446-8b2a-1a986a10ca2e';
    var accountIdentifier = authprovider_util_1.authProvider.getAccount().accountIdentifier;
    var api = new Apis_service_1.ApiService(accountIdentifier);
    var obj = fetal_1.EditFetal();
    var isEdit = ((_a = obj) === null || _a === void 0 ? void 0 : _a.idTramite) !== undefined;
    var getListas = react_1.useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, userRes, departamentos, localidades, listMunicipio, upzLocalidad, resp, support;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        api.getCodeUser(),
                        dominio_service_1.dominioService.get_departamentos_colombia(),
                        dominio_service_1.dominioService.get_localidades_bogota(),
                        dominio_service_1.dominioService.get_municipios_by_departamento(idDepartamentoBogota),
                        dominio_service_1.dominioService.get_upz_by_localidad(idlocalidad),
                        dominio_service_1.dominioService.get_type(dominio_service_1.ETipoDominio['Tipo Documento']),
                        dominio_service_1.dominioService.get_type(dominio_service_1.ETipoDominio['Nivel Educativo']),
                        dominio_service_1.dominioService.get_type(dominio_service_1.ETipoDominio.Pais),
                        dominio_service_1.dominioService.get_type(dominio_service_1.ETipoDominio['Tipo de Muerte']),
                        dominio_service_1.dominioService.get_type(dominio_service_1.ETipoDominio['Estado Civil']),
                        dominio_service_1.dominioService.get_type(dominio_service_1.ETipoDominio.Etnia)
                    ])];
                case 1:
                    _a = _c.sent(), userRes = _a[0], departamentos = _a[1], localidades = _a[2], listMunicipio = _a[3], upzLocalidad = _a[4], resp = _a.slice(5);
                    setUser(userRes);
                    setLDepartamentos(departamentos);
                    setLLocalidades(localidades);
                    setListas(resp);
                    setLMunicipios(listMunicipio);
                    setLAreas(upzLocalidad);
                    onChangeArea(idupz);
                    if (!isEdit) return [3 /*break*/, 3];
                    return [4 /*yield*/, api.getSupportDocuments((_b = obj) === null || _b === void 0 ? void 0 : _b.idSolicitud)];
                case 2:
                    support = _c.sent();
                    setSupports(support);
                    _c.label = 3;
                case 3: return [2 /*return*/];
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
        var idPersonaVentanilla, formatDate, estadoSolicitud, persona, json, container, formData, supportDocuments, resp_1, _a, files, names_1, supportDocumentsEdit_1, resp_2, _b, files, names_2;
        var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    idPersonaVentanilla = localStorage.getItem(accountIdentifier);
                    setStatus(undefined);
                    formatDate = 'MM-DD-YYYY';
                    estadoSolicitud = 'fdcea488-2ea7-4485-b706-a2b96a86ffdf';
                    persona = [];
                    if (tipoLicencia === 'Inhumación') {
                        persona = [
                            //madre
                            {
                                idPersona: (_c = obj) === null || _c === void 0 ? void 0 : _c.idMadre,
                                tipoIdentificacion: values.IDType,
                                numeroIdentificacion: values.IDNumber,
                                primerNombre: values.namemother,
                                segundoNombre: values.secondNamemother,
                                primerApellido: values.surnamemother,
                                segundoApellido: values.secondSurnamemother,
                                fechaNacimiento: null,
                                nacionalidad: values.nationalidadmother[0],
                                otroParentesco: null,
                                idEstadoCivil: values.civilStatusmother,
                                idNivelEducativo: values.educationLevelmother,
                                idEtnia: values.etniamother,
                                idRegimen: '00000000-0000-0000-0000-000000000000',
                                idTipoPersona: '342d934b-c316-46cb-a4f3-3aac5845d246',
                                idParentesco: '00000000-0000-0000-0000-000000000000',
                                idLugarExpedicion: '00000000-0000-0000-0000-000000000000'
                            },
                            //certifica la defuncion
                            {
                                idPersona: (_d = obj) === null || _d === void 0 ? void 0 : _d.idmedico,
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
                                idTipoPersona: 'd8b0250b-2991-42a0-a672-8e3e45985500',
                                idParentesco: '00000000-0000-0000-0000-000000000000',
                                idLugarExpedicion: '1e05f64f-5e41-4252-862c-5505dbc3931c',
                                idTipoProfesional: values.medicalSignatureProfesionalType
                            }
                        ];
                    }
                    if (tipoLicencia === 'Cremación') {
                        persona = [
                            //madre
                            {
                                idPersona: (_e = obj) === null || _e === void 0 ? void 0 : _e.idMadre,
                                tipoIdentificacion: values.IDType,
                                numeroIdentificacion: values.IDNumber,
                                primerNombre: values.namemother,
                                segundoNombre: values.secondNamemother,
                                primerApellido: values.surnamemother,
                                segundoApellido: values.secondSurnamemother,
                                fechaNacimiento: null,
                                nacionalidad: values.nationalidadmother[0],
                                otroParentesco: null,
                                idEstadoCivil: values.civilStatusmother,
                                idNivelEducativo: values.educationLevelmother,
                                idEtnia: values.etniamother,
                                idRegimen: '00000000-0000-0000-0000-000000000000',
                                idTipoPersona: '342d934b-c316-46cb-a4f3-3aac5845d246',
                                idParentesco: '00000000-0000-0000-0000-000000000000',
                                idLugarExpedicion: '00000000-0000-0000-0000-000000000000'
                            },
                            //authorizador cremacion
                            {
                                //idPersona: '',
                                tipoIdentificacion: values.authIDType,
                                numeroIdentificacion: values.mauthIDNumber,
                                primerNombre: values.authName,
                                segundoNombre: values.authSecondName,
                                primerApellido: values.authSurname,
                                segundoApellido: values.authSecondSurname,
                                fechaNacimiento: null,
                                nacionalidad: '00000000-0000-0000-0000-000000000000',
                                otroParentesco: null,
                                idEstadoCivil: '00000000-0000-0000-0000-000000000000',
                                idNivelEducativo: '00000000-0000-0000-0000-000000000000',
                                idEtnia: '00000000-0000-0000-0000-000000000000',
                                idRegimen: '00000000-0000-0000-0000-000000000000',
                                idTipoPersona: 'cc4c8c4d-b557-4a5a-a2b3-520d757c5d06',
                                idParentesco: '00000000-0000-0000-0000-000000000000',
                                idLugarExpedicion: '00000000-0000-0000-0000-000000000000'
                            },
                            //certifica la defuncion
                            {
                                idPersona: (_f = obj) === null || _f === void 0 ? void 0 : _f.idmedico,
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
                                idTipoPersona: 'd8b0250b-2991-42a0-a672-8e3e45985500',
                                idParentesco: '00000000-0000-0000-0000-000000000000',
                                idLugarExpedicion: '1e05f64f-5e41-4252-862c-5505dbc3931c',
                                idTipoProfesional: values.medicalSignatureProfesionalType
                            }
                        ];
                    }
                    json = {
                        solicitud: {
                            idSolicitud: (_g = obj) === null || _g === void 0 ? void 0 : _g.idSolicitud,
                            numeroCertificado: values.certificado,
                            fechaDefuncion: moment_1["default"](values.date).format(formatDate),
                            sinEstablecer: values.check,
                            hora: values.check === true ? null : moment_1["default"](values.time).format('LT'),
                            idSexo: values.sex,
                            estadoSolicitud: estadoSolicitud,
                            idPersonaVentanilla: Number(user),
                            idUsuarioSeguridad: accountIdentifier,
                            idTramite: (_h = tramite) === null || _h === void 0 ? void 0 : _h.toString(),
                            idTipoMuerte: values.deathType,
                            persona: persona,
                            lugarDefuncion: {
                                idLugarDefuncion: (_j = obj) === null || _j === void 0 ? void 0 : _j.idLugarDefuncion,
                                idPais: values.country,
                                idDepartamento: values.state,
                                idMunicipio: values.city,
                                idAreaDefuncion: values.areaDef,
                                idSitioDefuncion: values.sitDef
                            },
                            ubicacionPersona: {
                                idUbicacionPersona: (_k = obj) === null || _k === void 0 ? void 0 : _k.idUbicacionPersona,
                                idPaisResidencia: values.pais,
                                idDepartamentoResidencia: values.departamento,
                                idCiudadResidencia: values.ciudad,
                                idLocalidadResidencia: values.localidad,
                                idAreaResidencia: values.area,
                                idBarrioResidencia: values.barrio
                            },
                            datosCementerio: {
                                idDatosCementerio: (_l = obj) === null || _l === void 0 ? void 0 : _l.idDatosCementerio,
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
                                idInstitucionCertificaFallecimiento: (_m = obj) === null || _m === void 0 ? void 0 : _m.idInstitucionCertificaFallecimiento,
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
                    container = tipoLicencia === 'Inhumación' ? 'inhumacionfetal' : 'cremacionfetal';
                    formData = new FormData();
                    supportDocuments = [];
                    if (!isEdit) return [3 /*break*/, 4];
                    return [4 /*yield*/, api.putLicencia(json.solicitud)];
                case 1:
                    resp_1 = _o.sent();
                    localStorage.removeItem('register');
                    _a = generateListFiles(values), files = _a[0], names_1 = _a[1];
                    supportDocumentsEdit_1 = [];
                    files.forEach(function (item, i) {
                        var name = names_1[i];
                        formData.append('file', item);
                        formData.append('nameFile', name);
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
                    formData.append('containerName', container);
                    formData.append('oid', accountIdentifier);
                    if (!supportDocumentsEdit_1.length) return [3 /*break*/, 4];
                    return [4 /*yield*/, api.uploadFiles(formData)];
                case 2:
                    _o.sent();
                    return [4 /*yield*/, api.UpdateSupportDocuments(supportDocumentsEdit_1)];
                case 3:
                    _o.sent();
                    _o.label = 4;
                case 4:
                    if (!!isEdit) return [3 /*break*/, 8];
                    return [4 /*yield*/, api.postLicencia(json)];
                case 5:
                    resp_2 = _o.sent();
                    if (!resp_2) return [3 /*break*/, 8];
                    _b = generateListFiles(values), files = _b[0], names_2 = _b[1];
                    files.forEach(function (item, i) {
                        var name = names_2[i];
                        formData.append('file', item);
                        formData.append('nameFile', name);
                        TypeDocument_1.TypeDocument.forEach(function (item) {
                            if (item.key === name.toString()) {
                                supportDocuments.push({
                                    idSolicitud: resp_2,
                                    idTipoDocumentoSoporte: item.value,
                                    path: accountIdentifier + "/" + name,
                                    idUsuario: accountIdentifier
                                });
                            }
                        });
                    });
                    formData.append('containerName', container);
                    formData.append('oid', accountIdentifier);
                    return [4 /*yield*/, api.uploadFiles(formData)];
                case 6:
                    _o.sent();
                    return [4 /*yield*/, api.AddSupportDocuments(supportDocuments)];
                case 7:
                    _o.sent();
                    form.resetFields();
                    _o.label = 8;
                case 8:
                    history.push('/tramites-servicios');
                    return [2 /*return*/];
            }
        });
    }); };
    var onSubmitFailed = function () { return setStatus('error'); };
    var generateListFiles = function (values) {
        var Objs = [];
        var fileCertificadoDefuncion = values.fileCertificadoDefuncion, fileCCFallecido = values.fileCCFallecido, fileOtrosDocumentos = values.fileOtrosDocumentos, fileAuthCCFamiliar = values.fileAuthCCFamiliar, fileAuthCremacion = values.fileAuthCremacion, fileOficioIdentificacion = values.fileOficioIdentificacion, fileOrdenAuthFiscal = values.fileOrdenAuthFiscal, fileActaNotarialFiscal = values.fileActaNotarialFiscal;
        Objs.push({ file: fileCertificadoDefuncion, name: 'Certificado_Defunción' });
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
    var generateFormFiel = function (tipoInstitucion) {
        var data = [];
        if (tipoInstitucion) {
            data = [
                {
                    idTipoDocumentoSoporte: 'Certificado Defunción',
                    fechaRegistro: moment_1["default"](new Date()).format('L'),
                    idUsuario: accountIdentifier
                },
                {
                    idTipoDocumentoSoporte: 'Documento de la Madre',
                    fechaRegistro: moment_1["default"](new Date()).format('L'),
                    idUsuario: accountIdentifier
                },
                {
                    idTipoDocumentoSoporte: 'Otros Documentos',
                    fechaRegistro: moment_1["default"](new Date()).format('L'),
                    idUsuario: accountIdentifier
                },
                {
                    idTipoDocumentoSoporte: 'Autorizacion de cremacion del familiar',
                    fechaRegistro: moment_1["default"](new Date()).format('L'),
                    idUsuario: accountIdentifier
                },
                {
                    idTipoDocumentoSoporte: 'Documento del familiar',
                    fechaRegistro: moment_1["default"](new Date()).format('L'),
                    idUsuario: accountIdentifier
                }
            ];
        }
        if (tipoInstitucion) {
            data = [
                {
                    idTipoDocumentoSoporte: 'Certificado Defunción',
                    fechaRegistro: moment_1["default"](new Date()).format('L'),
                    idUsuario: accountIdentifier
                },
                {
                    idTipoDocumentoSoporte: 'Documento de la Madre',
                    fechaRegistro: moment_1["default"](new Date()).format('L'),
                    idUsuario: accountIdentifier
                },
                {
                    idTipoDocumentoSoporte: 'Otros Documentos',
                    fechaRegistro: moment_1["default"](new Date()).format('L'),
                    idUsuario: accountIdentifier
                },
                {
                    idTipoDocumentoSoporte: 'Autorizacion de cremacion del familiar',
                    fechaRegistro: moment_1["default"](new Date()).format('L'),
                    idUsuario: accountIdentifier
                },
                {
                    idTipoDocumentoSoporte: 'Documento del familiar',
                    fechaRegistro: moment_1["default"](new Date()).format('L'),
                    idUsuario: accountIdentifier
                },
                {
                    idTipoDocumentoSoporte: 'Autorizacion del fiscal para cremar',
                    fechaRegistro: moment_1["default"](new Date()).format('L'),
                    idUsuario: accountIdentifier
                },
                {
                    idTipoDocumentoSoporte: 'Oficio de medicina legal al fiscal para cremar',
                    fechaRegistro: moment_1["default"](new Date()).format('L'),
                    idUsuario: accountIdentifier
                },
                {
                    idTipoDocumentoSoporte: 'Acta Notarial del Fiscal',
                    fechaRegistro: moment_1["default"](new Date()).format('L'),
                    idUsuario: accountIdentifier
                }
            ];
        }
        return data;
    };
    //#region Eventos formulario
    var _13 = react_1.useState([]), l_municipios = _13[0], setLMunicipios = _13[1];
    var _14 = react_1.useState([]), l_areas = _14[0], setLAreas = _14[1];
    var _15 = react_1.useState([]), l_barrios = _15[0], setLBarrios = _15[1];
    var _16 = react_1.useState(true), isColombia = _16[0], setIsColombia = _16[1];
    var _17 = react_1.useState(true), isBogota = _17[0], setIsBogota = _17[1];
    var idColombia = '1e05f64f-5e41-4252-862c-5505dbc3931c';
    var idDepartamentoBogota = '31b870aa-6cd0-4128-96db-1f08afad7cdd';
    var onChangePais = function (value) {
        form.resetFields(['departamento', 'ciudad', 'localidad', 'area', 'barrio']);
        setIsColombia(value === idColombia);
        setLMunicipios([]);
        setIsBogota(false);
        setLAreas([]);
        setLBarrios([]);
    };
    var onChangeDepartamento = function (value) { return __awaiter(void 0, void 0, void 0, function () {
        var resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    form.resetFields(['ciudad', 'localidad', 'area', 'barrio']);
                    return [4 /*yield*/, dominio_service_1.dominioService.get_municipios_by_departamento(value)];
                case 1:
                    resp = _a.sent();
                    setLMunicipios(resp);
                    setIsBogota(false);
                    setLAreas([]);
                    setLBarrios([]);
                    return [2 /*return*/];
            }
        });
    }); };
    var onChangeMunicipio = function (value) {
        form.resetFields(['localidad', 'area', 'barrio']);
        setIsBogota(value === idBogota);
        setLAreas([]);
        setLBarrios([]);
    };
    var onChangeLocalidad = function (value) { return __awaiter(void 0, void 0, void 0, function () {
        var resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    form.resetFields(['area', 'barrio']);
                    return [4 /*yield*/, dominio_service_1.dominioService.get_upz_by_localidad(value)];
                case 1:
                    resp = _a.sent();
                    setLAreas(resp);
                    setLBarrios([]);
                    return [2 /*return*/];
            }
        });
    }); };
    var onChangeArea = function (value) { return __awaiter(void 0, void 0, void 0, function () {
        var resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    form.resetFields(['barrio']);
                    return [4 /*yield*/, dominio_service_1.dominioService.get_barrio_by_upz(value)];
                case 1:
                    resp = _a.sent();
                    setLBarrios(resp);
                    return [2 /*return*/];
            }
        });
    }); };
    var onChangeParentesco = function (e) {
        form.resetFields(['authOtherParentesco']);
        //setIsOtherParentesco(e.target.value === 'Otro');
    };
    //#endregion
    return (react_1["default"].createElement("div", { className: 'card card-body py-5 mb-4 fadeInTop' },
        react_1["default"].createElement("div", { className: 'd-lg-flex align-items-start' },
            react_1["default"].createElement(steps_1["default"], { className: 'mb-5 mr-5', current: current, status: status, onChange: setCurrent, direction: 'vertical', style: { maxWidth: 250 } },
                react_1["default"].createElement(Step, { title: 'Informaci\u00F3n General', description: 'Datos Certificaci\u00F3n del fallecimiento.' }),
                react_1["default"].createElement(Step, { title: 'Informaci\u00F3n de la Madre', description: 'Informaci\u00F3n general de la Madre.' }),
                react_1["default"].createElement(Step, { title: 'Informaci\u00F3n del Solicitante', description: 'Datos o informaci\u00F3n de la funeraria o solicitante, datos del fallecimiento, solicitud y otros datos.' }),
                react_1["default"].createElement(Step, { title: 'Informaci\u00F3n Certificado', description: 'Datos de Quien Certifica la defunci\u00F3n - Medico' }),
                react_1["default"].createElement(Step, { title: 'Documentos Requeridos', description: 'Documentos de soporte pdf.' })),
            react_1["default"].createElement(form_1["default"], __assign({ form: form, className: 'mb-4 w-100' }, form_layout_util_1.layoutItems, { style: { maxWidth: 800 }, layout: 'horizontal', onFinish: onSubmit, onFinishFailed: onSubmitFailed }),
                react_1["default"].createElement("div", { className: "d-none fadeInRight " + (current === 0 && 'd-block') },
                    react_1["default"].createElement(general_info_form_seccion_1.GeneralInfoFormSeccion, { obj: obj }),
                    react_1["default"].createElement(lugar_defuncion_form_seccion_1.LugarDefuncionFormSeccion, { form: form, obj: obj }),
                    react_1["default"].createElement(death_institute_form_seccion_1.DeathInstituteFormSeccion, { obj: obj, form: form, datofiscal: true, required: false, tipoLicencia: tipoLicencia }),
                    react_1["default"].createElement(divider_1["default"], { orientation: 'right' }, " Tipo de Muerte "),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Tipo de Muerte', name: 'deathType', initialValue: '475c280d-67af-47b0-a8bc-de420f6ac740', rules: [{ required: true }] },
                        react_1["default"].createElement(select_component_1.SelectComponent, { options: l_tipo_muerte, optionPropkey: 'id', optionPropLabel: 'descripcion' })),
                    react_1["default"].createElement(form_1["default"].Item, __assign({}, form_layout_util_1.layoutWrapper, { className: 'mb-0 mt-4' }),
                        react_1["default"].createElement("div", { className: 'd-flex justify-content-end' },
                            react_1["default"].createElement(button_1["default"], { type: 'primary', htmlType: 'button', onClick: function () { return onNextStep(__spreadArrays(general_info_form_seccion_1.KeysForm, lugar_defuncion_form_seccion_1.KeysForm)); } }, "Siguiente")))),
                react_1["default"].createElement("div", { className: "d-none fadeInRight " + (current === 1 && 'd-block') },
                    react_1["default"].createElement(divider_1["default"], { orientation: 'right' }, " INFORMACION DE LA MADRE"),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Tipo Identificaci\u00F3n', name: 'IDType', rules: [{ required: true }], initialValue: (_c = (_b = obj) === null || _b === void 0 ? void 0 : _b.IDType, (_c !== null && _c !== void 0 ? _c : '7c96a4d3-a0cb-484e-a01b-93bc39c2552e')) },
                        react_1["default"].createElement(select_component_1.SelectComponent, { options: l_tipos_documento, optionPropkey: 'id', optionPropLabel: 'descripcion' })),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'N\u00FAmero de Identificaci\u00F3n', initialValue: (_d = obj) === null || _d === void 0 ? void 0 : _d.IDNumber, name: 'IDNumber', rules: [{ required: true, max: 25 }] },
                        react_1["default"].createElement(input_1["default"], { allowClear: true, placeholder: 'N\u00FAmero de Identificaci\u00F3n', autoComplete: 'off' })),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Primer Nombre', name: 'namemother', initialValue: (_e = obj) === null || _e === void 0 ? void 0 : _e.namemother, rules: [{ required: true }] },
                        react_1["default"].createElement(input_1["default"], { allowClear: true, placeholder: 'Primer Nombre', autoComplete: 'off' })),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Segundo Nombre', name: 'secondNamemother', initialValue: (_f = obj) === null || _f === void 0 ? void 0 : _f.secondNamemother },
                        react_1["default"].createElement(input_1["default"], { allowClear: true, placeholder: 'Segundo Nombre', autoComplete: 'off' })),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Primer Apellido', name: 'surnamemother', initialValue: (_g = obj) === null || _g === void 0 ? void 0 : _g.surnamemother, rules: [{ required: true }] },
                        react_1["default"].createElement(input_1["default"], { allowClear: true, placeholder: 'Primer Apellido', autoComplete: 'off' })),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Segundo Apellido', name: 'secondSurnamemother', initialValue: (_h = obj) === null || _h === void 0 ? void 0 : _h.surnamemother },
                        react_1["default"].createElement(input_1["default"], { allowClear: true, placeholder: 'Segundo Apellido', autoComplete: 'off' })),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Nacionalidad de la Madre', name: 'nationalidadmother', initialValue: (_k = (_j = obj) === null || _j === void 0 ? void 0 : _j.nationalidadmother, (_k !== null && _k !== void 0 ? _k : [idColombia])), rules: [{ required: true, type: 'array' }] },
                        react_1["default"].createElement(select_component_1.SelectComponent, { options: l_paises, mode: 'multiple', placeholder: '-- Elija una o varias --', optionPropkey: 'id', optionPropLabel: 'descripcion' })),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Estado Civil', name: 'civilStatusmother', initialValue: (_m = (_l = obj) === null || _l === void 0 ? void 0 : _l.civilStatus, (_m !== null && _m !== void 0 ? _m : '4c17996a-7113-4e17-a0fe-6fd7cd9bbcd1')) },
                        react_1["default"].createElement(select_component_1.SelectComponent, { options: l_estado_civil, optionPropkey: 'id', optionPropLabel: 'descripcion' })),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Nivel Educativo', name: 'educationLevelmother', initialValue: (_p = (_o = obj) === null || _o === void 0 ? void 0 : _o.educationLevel, (_p !== null && _p !== void 0 ? _p : '07ebd0bb-2b00-4a2b-8db5-4582eee1d285')) },
                        react_1["default"].createElement(select_component_1.SelectComponent, { options: l_nivel_educativo, optionPropkey: 'id', optionPropLabel: 'descripcion' })),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Etnia', name: 'etniamother', initialValue: (_r = (_q = obj) === null || _q === void 0 ? void 0 : _q.etnia, (_r !== null && _r !== void 0 ? _r : '60875c52-9b2a-4836-8bc7-2f3648f41f57')) },
                        react_1["default"].createElement(select_component_1.SelectComponent, { options: l_etnia, optionPropkey: 'id', optionPropLabel: 'descripcion' })),
                    react_1["default"].createElement(divider_1["default"], { orientation: 'right' }, " RESIDENCIA HABITUAL DE LA MADRE"),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Pa\u00EDs de Residencia', name: 'pais', initialValue: (_t = (_s = obj) === null || _s === void 0 ? void 0 : _s.residencia, (_t !== null && _t !== void 0 ? _t : idColombia)), rules: [{ required: true }] },
                        react_1["default"].createElement(select_component_1.SelectComponent, { options: l_paises, optionPropkey: 'id', optionPropLabel: 'descripcion', onChange: onChangePais })),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Departamento de Residencia', initialValue: (_v = (_u = obj) === null || _u === void 0 ? void 0 : _u.idDepartamentoResidencia, (_v !== null && _v !== void 0 ? _v : idDepartamentoBogota)), name: 'departamento', rules: [{ required: isColombia }] },
                        react_1["default"].createElement(select_component_1.SelectComponent, { options: l_departamentos, optionPropkey: 'idDepartamento', optionPropLabel: 'descripcion', disabled: !isColombia, onChange: onChangeDepartamento })),
                    isColombia ? (react_1["default"].createElement(form_1["default"].Item, { label: 'Ciudad de Residencia', initialValue: (_x = (_w = obj) === null || _w === void 0 ? void 0 : _w.idCiudadResidencia, (_x !== null && _x !== void 0 ? _x : idBogota)), name: 'ciudad', rules: [{ required: true }] },
                        react_1["default"].createElement(select_component_1.SelectComponent, { options: l_municipios, optionPropkey: 'idMunicipio', optionPropLabel: 'descripcion', onChange: onChangeMunicipio }))) : (react_1["default"].createElement(form_1["default"].Item, { label: 'Ciudad de Residencia', name: 'ciudad', initialValue: (_y = obj) === null || _y === void 0 ? void 0 : _y.idCiudadResidencia, rules: [{ required: true }] },
                        react_1["default"].createElement(input_1["default"], { allowClear: true, placeholder: 'Ciudad', autoComplete: 'off' }))),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Localidad de Residencia', initialValue: (_0 = (_z = obj) === null || _z === void 0 ? void 0 : _z.idLocalidadResidencia, (_0 !== null && _0 !== void 0 ? _0 : idlocalidad)), name: 'localidad', rules: [{ required: isBogota }] },
                        react_1["default"].createElement(select_component_1.SelectComponent, { options: l_localidades, optionPropkey: 'idLocalidad', optionPropLabel: 'descripcion', disabled: !isBogota, onChange: onChangeLocalidad })),
                    react_1["default"].createElement(form_1["default"].Item, { label: '\u00C1rea de Residencia', initialValue: (_2 = (_1 = obj) === null || _1 === void 0 ? void 0 : _1.idAreaResidencia, (_2 !== null && _2 !== void 0 ? _2 : idupz)), name: 'area', rules: [{ required: isBogota }] },
                        react_1["default"].createElement(select_component_1.SelectComponent, { options: l_areas, optionPropkey: 'idUpz', optionPropLabel: 'descripcion', disabled: !isBogota, onChange: onChangeArea })),
                    react_1["default"].createElement(form_1["default"].Item, { label: 'Barrio de Residencia', initialValue: (_4 = (_3 = obj) === null || _3 === void 0 ? void 0 : _3.idBarrioResidencia, (_4 !== null && _4 !== void 0 ? _4 : idbarrio)), name: 'barrio', rules: [{ required: isBogota }] },
                        react_1["default"].createElement(select_component_1.SelectComponent, { options: l_barrios, optionPropkey: 'idBarrio', optionPropLabel: 'descripcion', disabled: !isBogota })),
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
                                        'IDType',
                                        'IDNumber',
                                        'pais',
                                        'departamento',
                                        'ciudad',
                                        'localidad',
                                        'area',
                                        'barrio',
                                        'civilStatus',
                                        'educationLevel',
                                        'etnia'
                                    ]);
                                } }, "Siguiente")))),
                react_1["default"].createElement("div", { className: "d-none fadeInRight " + (current === 2 && 'd-block') },
                    tipoLicencia === 'Cremación' && react_1["default"].createElement(familarCremacion_1.FamilarFetalCremacion, { tipoLicencia: tipoLicencia }),
                    react_1["default"].createElement(solicitud_info_form_seccion_1.SolicitudInfoFormSeccion, { obj: obj, form: form }),
                    react_1["default"].createElement(cementerio_info_form_seccion_1.CementerioInfoFormSeccion, { obj: obj, form: form, tipoLicencia: tipoLicencia }),
                    react_1["default"].createElement(form_1["default"].Item, __assign({}, form_layout_util_1.layoutWrapper, { className: 'mb-0 mt-4' }),
                        react_1["default"].createElement("div", { className: 'd-flex justify-content-between' },
                            react_1["default"].createElement(button_1["default"], { type: 'dashed', htmlType: 'button', onClick: onPrevStep }, "Volver atr\u00E1s"),
                            react_1["default"].createElement(button_1["default"], { type: 'primary', htmlType: 'button', onClick: function () {
                                    return onNextStep(__spreadArrays(death_institute_form_seccion_1.KeysForm, solicitud_info_form_seccion_1.KeysForm, cementerio_info_form_seccion_1.KeysForm, [
                                        'deathType',
                                        'authIDType',
                                        'authName',
                                        'authSecondName',
                                        'authSurname',
                                        'authSecondSurname',
                                        'authParentesco',
                                        'authOtherParentesco'
                                    ]));
                                } }, "Siguiente")))),
                react_1["default"].createElement("div", { className: "d-none fadeInRight " + (current === 3 && 'd-block') },
                    react_1["default"].createElement(medical_signature_form_seccion_1.MedicalSignatureFormSeccion, { obj: obj, form: form }),
                    react_1["default"].createElement(form_1["default"].Item, __assign({}, form_layout_util_1.layoutWrapper, { className: 'mb-0 mt-4' }),
                        react_1["default"].createElement("div", { className: 'd-flex justify-content-between' },
                            react_1["default"].createElement(button_1["default"], { type: 'dashed', htmlType: 'button', onClick: onPrevStep }, "Volver atr\u00E1s"),
                            react_1["default"].createElement(button_1["default"], { type: 'primary', htmlType: 'button', onClick: function () { return onNextStep(__spreadArrays(medical_signature_form_seccion_1.KeysForm)); } }, "Siguiente")))),
                react_1["default"].createElement("div", { className: "d-none fadeInRight " + (current === 4 && 'd-block') },
                    react_1["default"].createElement(documentos_form_seccion_1.DocumentosFormSeccion, { obj: obj, files: supports, tipoLicencia: tipoLicencia, tipoIndividuo: 'Fetal', form: form }),
                    react_1["default"].createElement(form_1["default"].Item, __assign({}, form_layout_util_1.layoutWrapper, { className: 'mb-0 mt-4' }),
                        react_1["default"].createElement("div", { className: 'd-flex justify-content-between' },
                            react_1["default"].createElement(button_1["default"], { type: 'dashed', htmlType: 'button', onClick: onPrevStep }, "Volver atr\u00E1s"),
                            react_1["default"].createElement(button_1["default"], { type: 'primary', htmlType: 'submit' }, "Guardar"))))))));
};

//# sourceMappingURL=fetal.form.js.map
