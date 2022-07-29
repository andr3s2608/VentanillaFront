export const EditInhumacion = (id: String) => {
  const data = localStorage.getItem('register');

  if (data) {
    const json = JSON.parse(data);
    const [obj] = json;

    return formatObjJson(obj, id);
  } else {
    return undefined;
  }
};

const formatObjJson = (obj: any, id: String) => {
  const {
    institucionCertificaFallecimiento,
    lugarDefuncion,
    persona,
    ubicacionPersona,
    datosCementerio,
    resumenSolicitud,
    datosFuneraria
  } = obj;

  var [fallecido] = isPerson(persona, '01f64f02-373b-49d4-8cb1-cb677f74292c');
  const [certificador] = isPerson(persona, 'd8b0250b-2991-42a0-a672-8e3e45985500');
  const [autorizadorCremacion] = isPerson(persona, 'cc4c8c4d-b557-4a5a-a2b3-520d757c5d06');

  //en caso de que no exista un fallecido, se tomara el de la madre
  if (id == '1') {
    if (fallecido == undefined) {
      fallecido = isPerson(persona, '342d934b-c316-46cb-a4f3-3aac5845d246');
    }
  }

  let jsonDt;
  ///metodo que se habia hecho por inconsistencias en la bd(no existia medico ligado a cada solicitud)
  if (certificador == undefined) {
    jsonDt = {
      idTramite: obj.idTramite,
      idControlTramite: obj.iD_Control_Tramite,
      certificado: obj.numeroCertificado,
      date: obj.fechaDefuncion,
      time: obj.hora,
      check: obj.sinEstablecer,
      sex: obj.idSexo,
      idSolicitud: obj.idSolicitud,

      idDatosfuneraria: datosFuneraria.idDatosFuneraria,

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
      deathType: obj.idTipoMuerte,
      tipopersona: fallecido.idTipoPersona,

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
  } else {
    jsonDt = {
      idTramite: obj.idTramite,
      idControlTramite: obj.iD_Control_Tramite,
      certificado: obj.numeroCertificado,
      date: obj.fechaDefuncion,
      fechasol: obj.fechaSolicitud,
      time: obj.hora,
      check: obj.sinEstablecer,
      sex: obj.idSexo,
      idSolicitud: obj.idSolicitud,

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
      deathType: obj.idTipoMuerte,
      tipopersona: fallecido.idTipoPersona,

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

      idmedico: certificador.idTipoPersona,
      medicalSignatureIDType: certificador.tipoIdentificacion,
      medicalSignatureIDNumber: certificador.numeroIdentificacion,
      medicalSignatureIDExpedition: certificador.idLugarExpedicion,
      medicalSignatureName: certificador.primerNombre,
      medicalSignatureSecondName: certificador.segundoNombre,
      medicalSignatureSurname: certificador.primerApellido,
      medicalSignatureSecondSurname: certificador.segundoApellido,
      medicalSignatureProfesionalType: certificador.idTipoProfesional,

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
      },
      autorizadorCremacion
    };
  }

  return jsonDt;
};
const isPerson = (personas: any[], key: string) => personas.filter((m) => m.idTipoPersona === key);
