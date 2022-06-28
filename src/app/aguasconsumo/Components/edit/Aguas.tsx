export const EditAguas = () => {
  const data = localStorage.getItem('register');

  if (data) {
    const json = JSON.parse(data);
    const obj = json;

    return formatObjJson(obj);
  } else {
    return {
      isLugar: () => {
        return 'Dentro de Bogotá';
      }
    };
  }
};

const formatObjJson = (obj: any) => {
  const { citacion_Revision, persona, ubicacion, fuenteAbastecimiento, subredes } = obj;

  let jsonDt;
  ///metodo que se habia hecho por inconsistencias en la bd(no existia medico ligado a cada solicitud)
  let fuenteabastecimientojson: any[] = [];
  if (fuenteAbastecimiento != null) {
    fuenteabastecimientojson = [
      //madre
      {
        idfuenteAbastecimiento: fuenteAbastecimiento.idFuente,
        idAutoridadAmbiental: fuenteAbastecimiento.idAutoridadAmbiental,
        idSubCategoriaFuente: fuenteAbastecimiento.idSubCategoriaFuente,
        idTipoFuente: fuenteAbastecimiento.idTipoFuente,
        bocatoma_lat: fuenteAbastecimiento.idBocatoma_lat_cy,
        bocatoma_long: fuenteAbastecimiento.Bocatoma_long_cx,
        nombrefuenteBbastecimiento: fuenteAbastecimiento.Nombre,
        descripcionFuenteAbastecimiento: fuenteAbastecimiento.DescripcionFuente,
        descripcionOtraFuente: fuenteAbastecimiento.DescripcionOtraFuente,
        tienePlanta: fuenteAbastecimiento.TienePlanta
      }
    ];
  }

  jsonDt = {
    numeroradicado: obj.numeroRadicado,
    fechaSolicitud: obj.fechaSolicitud,
    idtipodeSolicitud: obj.idTipodeSolicitud,
    tipodeSolicitud: obj.tipodeSolicitud,
    idtipodeTramite: obj.idTipodeTramite,
    tipodeTramite: obj.tipodeTramite,
    idSubred: obj.idSubred,
    idestado: obj.idEstado,
    estado: obj.estado,
    idactividadActualSolicitud: obj.idActividadActualSolicitud,
    actividadActualSolicitud: obj.actividadActualSolicitud,
    actividadSiguienteSolicitud: obj.actividadSiguienteSolicitud,

    fechaCitacion: citacion_Revision.fechaCitacion,
    fechaRegistro: citacion_Revision.fechaRegistro,
    observacionCitacion: citacion_Revision.observacion,

    idPersona: persona.idPersona,
    tipoIdentificacion: persona.tipoIdentificacion,
    numeroIdentificacion: persona.numeroIdentificacion,
    primerNombre: persona.primerNombre,
    segundoNombre: persona.segundoNombre,
    primerApellido: persona.primerApellido,
    segundoApellido: persona.segundoApellido,
    idTipoPersona: persona.idTipoPersona,
    nit: persona.nit,
    tipoDocumentoRazon: persona.tipoDocumentoRazon,
    celularContacto: persona.celularContacto,
    correoElectronico: persona.correoElectronico,
    telefonoContacto: persona.telefonoContacto,
    razonSocial: persona.razonSocial,

    fuenteabastecimientojson,

    idUsuarioSubred: subredes.idUsuario,
    zonaSubred: subredes.zona,

    barrio: ubicacion.barrio,
    departamento: ubicacion.departamento,
    municipio: ubicacion.municipio,
    direccion: ubicacion.direccion,
    localidad: ubicacion.localidad,
    observacionUbicacion: ubicacion.observacion,
    sector: ubicacion.sector,
    upz: ubicacion.upz,
    vereda: ubicacion.vereda
  };

  return jsonDt;
};
