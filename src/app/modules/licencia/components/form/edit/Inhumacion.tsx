export const EditInhumacion = () => {

  const data = localStorage.getItem('register');

  if (data) {
    const json = JSON.parse(data);
    const [obj] = json;
    return formatObjJson(obj);
  }
  return {
    isLugar: () => {
      return 'Dentro de Bogotá';
    }
  };

};

const formatObjJson = (obj: any) => {

  const { institucionCertificaFallecimiento, lugarDefuncion, persona, ubicacionPersona, datosCementerio } = obj;
  const [fallecido] = isPerson(persona, '01f64f02-373b-49d4-8cb1-cb677f74292c');
  const [certicador] = isPerson(persona, 'd8b0250b-2991-42a0-a672-8e3e45985500');
  const jsonDt = {
    idTramite: obj.idTramite,
    certificado: obj.numeroCertificado,
    date: obj.fechaDefuncion,
    time: obj.hora,
    check: obj.sinEstablecer,
    sex: obj.idSexo,
    idSolicitud: obj.idSolicitud,

    country: lugarDefuncion.idPais,
    state: lugarDefuncion.idDepartamento,
    city: lugarDefuncion.idMunicipio,
    areaDef: lugarDefuncion.idAreaDefuncion,
    sitDef: lugarDefuncion.idSitioDefuncion,

    instType: institucionCertificaFallecimiento.idTipoInstitucion,
    instTipoIdent: institucionCertificaFallecimiento.tipoIdentificacion,
    instNumIdent: institucionCertificaFallecimiento.numeroIdentificacion,
    instRazonSocial: institucionCertificaFallecimiento.razonSocial,
    instNumProtocolo: institucionCertificaFallecimiento.numeroProtocolo,
    instNumActaLevantamiento: institucionCertificaFallecimiento.numeroActaLevantamiento,
    instFechaActa: institucionCertificaFallecimiento.fechaActa,
    instSeccionalFiscalia: institucionCertificaFallecimiento.seccionalFiscalia,
    instNoFiscal: institucionCertificaFallecimiento.noFiscal,

    idLugarDefuncion: lugarDefuncion.idLugarDefuncion,
    idUbicacionPersona: ubicacionPersona.idUbicacionPersona,
    idDatosCementerio: datosCementerio.idDatosCementerio,
    idInstitucionCertificaFallecimiento: institucionCertificaFallecimiento.idInstitucionCertificaFallecimiento,

    name: fallecido.primerNombre,
    secondName: fallecido.segundoNombre,
    surname: fallecido.primerApellido,
    secondSurname: fallecido.segundoApellido,
    nationalidad: [fallecido.nacionalidad],
    dateOfBirth: fallecido.fechaNacimiento,
    IDType: fallecido.tipoIdentificacion,
    IDNumber: fallecido.numeroIdentificacion,
    civilStatus: fallecido.idEstadoCivil,
    educationLevel: fallecido.idNivelEducativo,
    etnia: fallecido.idEtnia,
    regime: fallecido.idRegimen, //falta
    deathType: fallecido.idTipoMuerte,

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
        value = "Dentro de Bogotá";
      }
      if (fueraBogota) {
        value = "Fuera de Bogotá";
      }
      if (fueraPais) {
        value = "Fuera del País";
      }
      return value;
    }

  };
  return jsonDt;

}
const isPerson = (personas: any[], key: string) => personas.filter(m => m.idTipoPersona === key);
