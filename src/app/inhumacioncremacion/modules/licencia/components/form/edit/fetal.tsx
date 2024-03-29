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
      parentesco: cremador.otroParentesco
    });
  }

  const jsonDt = {
    idTramite: obj.idTramite,
    idControlTramite: obj.iD_Control_Tramite,
    idSolicitud: obj.idSolicitud,
    certificado: obj.numeroCertificado,
    date: obj.fechaDefuncion,
    fechasol: obj.fechaSolicitud,
    time: obj.hora,
    check: obj.sinEstablecer,
    sex: obj.idSexo,
    idUsuario: obj.idUsuarioSeguridad,

    country: lugarDefuncion.idPais,
    state: lugarDefuncion.idDepartamento,
    city: lugarDefuncion.idMunicipio,
    areaDef: lugarDefuncion.idAreaDefuncion,
    sitDef: lugarDefuncion.idSitioDefuncion,

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
    autorizadorcremacion,

    //instNoFiscal:institucionCertificaFallecimiento.
    idMadre: madre.idPersona,
    namemother: madre.primerNombre,
    secondNamemother: madre.segundoNombre,
    surnamemother: madre.primerApellido,
    secondSurnamemother: madre.segundoApellido,
    nationalidadmother: [madre.nacionalidad],
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

    cementerioLugar: datosCementerio.cementerio,
    cementerioBogota: datosCementerio.cementerio,
    cementerioDepartamento: datosCementerio.idDepartamento,
    cementerioMunicipio: datosCementerio.idMunicipio,
    cementerioPais: datosCementerio.idPais,
    cementerioCiudad: datosCementerio.ciudad,
    otro: datosCementerio.otroSitio,

    idmedico: certicador.idPersona,
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
      if (fueraPais) {
        value = 'Fuera del País';
      }
      return value;
    }
  };

  return jsonDt;
};
const esMadre = (personas: any[]) => personas.filter((m) => m.idTipoPersona === '342d934b-c316-46cb-a4f3-3aac5845d246');
const esMedico = (personas: any[]) => personas.filter((m) => m.idTipoPersona === 'd8b0250b-2991-42a0-a672-8e3e45985500');
const esAutorizador = (personas: any[]) => personas.filter((m) => m.idTipoPersona === 'cc4c8c4d-b557-4a5a-a2b3-520d757c5d06');
