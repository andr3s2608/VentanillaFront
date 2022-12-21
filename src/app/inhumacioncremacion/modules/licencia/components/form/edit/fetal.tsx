import { IRegistroLicencia } from 'app/inhumacioncremacion/Models/IRegistroLicencia';

export const EditFetal = (): any => {
  const data = localStorage.getItem('register');

  if (data) {
    const json = JSON.parse(data);
    const [obj] = json;

    return formatObjJson(obj);
  } else {
    return undefined;
  }
};

const formatObjJson = (obj: any) => {
  const { institucionCertificaFallecimiento, lugarDefuncion, persona, ubicacionPersona, datosCementerio, datosFuneraria } = obj;
  const [madre] = esMadre(persona);
  const [certicador] = esMedico(persona);
  const [cremador] = esAutorizador(persona);
  const [reconocido] = esReconocido(persona);

  const autorizadorcremacion: any = [];
  if (cremador != undefined) {
    autorizadorcremacion.push({
      name: cremador.primerNombre,
      secondName: cremador.segundoNombre,
      surname: cremador.primerApellido,
      secondSurname: cremador.segundoApellido,
      tipoid: cremador.tipoIdentificacion,
      numeroid: cremador.numeroIdentificacion,
      tipopersona: cremador.idTipoPersona,
      parentesco: cremador.idParentesco,
      otroparentesco: cremador.otroParentesco
    });
  }

  const reconocidocomo: any = [];
  if (reconocido != undefined) {
    reconocidocomo.push({
      id: reconocido.idPersona,
      name: reconocido.primerNombre,
      secondName: reconocido.segundoNombre,
      surname: reconocido.primerApellido,
      secondSurname: reconocido.segundoApellido,
      tipoid: reconocido.tipoIdentificacion,
      numeroid: reconocido.numeroIdentificacion,
      tipopersona: reconocido.idTipoPersona,
      parentesco: reconocido.idParentesco,
      otroparentesco: reconocido.otroParentesco
    });
  }

  const jsonDt = {
    consecutivo: obj.consecutivo,
    idTramite: obj.idTramite,
    idControlTramite: obj.iD_Control_Tramite,
    certificado: obj.numeroCertificado,
    date: obj.fechaDefuncion,
    fechasol: obj.fechaSolicitud,
    time: obj.hora,
    check: obj.sinEstablecer,
    sex: obj.idSexo,
    idSolicitud: obj.idSolicitud,
    idpersonaventanilla: obj.idPersonaVentanilla,
    idusuarioseg: obj.idUsuarioSeguridad,



    tiposolicitantesolicitud: obj.tipoIdentificacionSolicitante,
    nrosolicitantesolicitud: obj.noIdentificacionSolicitante,
    razonsocialsolicitantesolicitud: obj.razonSocialSolicitante,
    tipopersonasolicitantesolicitud: obj.tipoPersona,

    country: lugarDefuncion.idPais,
    state: lugarDefuncion.idDepartamento,
    city: lugarDefuncion.idMunicipio,
    areaDef: lugarDefuncion.idAreaDefuncion,
    sitDef: lugarDefuncion.idSitioDefuncion,

    autorizadorcremacion,
    reconocidocomo,

    idDatosfuneraria: datosFuneraria.idDatosFuneraria,

    instType: institucionCertificaFallecimiento.idTipoInstitucion,
    instTipoIdent: institucionCertificaFallecimiento.tipoIdentificacion,
    instNumIdent: institucionCertificaFallecimiento.numeroIdentificacion,
    instRazonSocial: institucionCertificaFallecimiento.razonSocial,
    instNumProtocolo: institucionCertificaFallecimiento.numeroProtocolo,
    instNumActaLevantamiento: institucionCertificaFallecimiento.numeroActaLevantamiento,
    instFechaActa: institucionCertificaFallecimiento.fechaActa,
    instSeccionalFiscalia: institucionCertificaFallecimiento.seccionalFiscalia,
    instNoFiscal: institucionCertificaFallecimiento.noFiscal,
    //Prueba
    instNombreFiscal: institucionCertificaFallecimiento.nombreFiscal,
    instApellidoFiscal: institucionCertificaFallecimiento.apellidoFiscal,
    instNumeroOficio: institucionCertificaFallecimiento.numeroOficio,
    instFechaOficio: institucionCertificaFallecimiento.fechaOficio,
    instNoFiscalMedicinaLegal: institucionCertificaFallecimiento.noFiscalMedicinaLegal,

    idLugarDefuncion: lugarDefuncion.idLugarDefuncion,
    idUbicacionPersona: ubicacionPersona.idUbicacionPersona,
    idDatosCementerio: datosCementerio.idDatosCementerio,
    idInstitucionCertificaFallecimiento: institucionCertificaFallecimiento.idInstitucionCertificaFallecimiento,


    //instNoFiscal:institucionCertificaFallecimiento.
    idMadre: madre.idPersona,
    namemother: madre.primerNombre,
    secondNamemother: madre.segundoNombre,
    surnamemother: madre.primerApellido,
    secondSurnamemother: madre.segundoApellido,
    nationalidadmother: madre.nacionalidad,
    dateOfBirth: madre.fechaNacimiento,
    IDType: madre.tipoIdentificacion,
    IDNumber: madre.numeroIdentificacion,
    civilStatus: madre.idEstadoCivil,
    educationLevel: madre.idNivelEducativo,
    etnia: madre.idEtnia,
    regime: madre.idRegimen, //falta
    deathType: obj.idTipoMuerte,
    tipopersona: madre.idTipoPersona,

    residencia: ubicacionPersona.idPaisResidencia,
    idDepartamentoResidencia: ubicacionPersona.idDepartamentoResidencia,
    idCiudadResidencia: ubicacionPersona.idCiudadResidencia,
    idLocalidadResidencia: ubicacionPersona.idLocalidadResidencia,
    idAreaResidencia: ubicacionPersona.idAreaResidencia,
    idBarrioResidencia: ubicacionPersona.idBarrioResidencia,
    ciudadfuera: ubicacionPersona.ciudad,

    funeraria: datosFuneraria.funeraria,

    cementerioLugar: datosCementerio.cementerio,
    cementerioBogota: datosCementerio.cementerio,
    cementerioDepartamento: datosCementerio.idDepartamento,
    cementerioMunicipio: datosCementerio.idMunicipio,
    cementerioPais: datosCementerio.idPais,
    cementerioCiudad: datosCementerio.ciudad,
    otro: datosCementerio.otroSitio,


    numerolicencia: obj.resumenSolicitud.numeroLicencia,
    idresumensolicitud: obj.resumenSolicitud.idSolicitud,
    nombresolicitante: obj.resumenSolicitud.nombreSolicitante,
    apellidosolicitante: obj.resumenSolicitud.apellidoSolicitante,
    tipodocsolicitante: obj.resumenSolicitud.tipoDocumentoSolicitante,
    nrosolicitante: obj.resumenSolicitud.numeroDocumentoSolicitante,
    correocementerio: obj.resumenSolicitud.correoCementerio.toString().toLowerCase(),
    correofuneraria: obj.resumenSolicitud.correoFuneraria.toString().toLowerCase(),
    correosolicitante: obj.resumenSolicitud.correoSolicitante.toString().toLowerCase(),


    idmedico: certicador.idPersona,
    idpersonamedico: certicador.idPersona,
    medicalSignatureIDType: certicador.tipoIdentificacion,
    medicalSignatureIDNumber: certicador.numeroIdentificacion,
    medicalSignatureIDExpedition: certicador.idLugarExpedicion,
    medicalSignatureName: certicador.primerNombre,
    medicalSignatureSecondName: certicador.segundoNombre,
    medicalSignatureSurname: certicador.primerApellido,
    medicalSignatureSecondSurname: certicador.segundoApellido,
    medicalSignatureProfesionalType: certicador.idTipoProfesional,
    isLugar: () => {
      const { enBogota, fueraBogota, fueraPais } = datosCementerio;
      let value: string = '';
      if (enBogota) {
        value = 'Dentro de Bogotá';
      }
      if (fueraBogota) {
        value = 'Fuera de Bogotá';
      }
      if ((!enBogota && !fueraBogota) ?? fueraPais) {
        value = 'Fuera del País';
      }
      return value;
    }
  };

  return jsonDt;
};
const esMadre = (personas: any[]) => personas.filter((m) => m.idTipoPersona === '342d934b-c316-46cb-a4f3-3aac5845d246');
const esMedico = (personas: any[]) => personas.filter((m) => m.idTipoPersona === 'd8b0250b-2991-42a0-a672-8e3e45985500');
const esAutorizador = (personas: any[]) => personas.filter((m) => m.idTipoPersona === 'cc4c8c4d-b557-4a5a-a2b3-520d757c5d06'
  && m.estado === true);

const esReconocido = (personas: any[]) => personas.filter((m) => m.idTipoPersona === '87cf579b-b873-43c1-b4a7-004dba2cc68e'
  && m.estado === true);
