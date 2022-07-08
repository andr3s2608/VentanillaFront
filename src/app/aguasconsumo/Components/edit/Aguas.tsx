export const EditAguas = () => {
  const data = localStorage.getItem('register');
  console.log(data, ' Dataaaa');
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

  let fuenteabastecimientojson: any[] = [];
  if (fuenteAbastecimiento != null) {
    fuenteabastecimientojson = [
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

  let citacion: any[] = [];
  if (citacion_Revision != null) {
    citacion = [
      {
        fechaCitacion: citacion_Revision.fechaCitacion,
        fechaRegistro: citacion_Revision.fechaRegistro,
        observacionCitacion: citacion_Revision.observacion,
        idUsuarioCitacion: citacion_Revision.idUsuario
      }
    ];
  }

  let subred: any[] = [];
  if (subredes != null) {
    subred = [
      {
        idUsuarioSubred: subredes.idUsuario,
        zonaSubred: subredes.zona
      }
    ];
  }

  jsonDt = {
    idsolicitud: obj.idSolicitud,
    numeroradicado: obj.numeroRadicado,
    fechaSolicitud: obj.fechaSolicitud,
    idtipodeSolicitud: obj.idTipodeSolicitud,
    tipodeSolicitud: obj.tipodeSolicitud,
    idtipodeTramite: obj.idTipodeTramite,
    tipodeTramite: obj.tipodeTramite,
    idSubred: obj.idSubred,
    idestado: obj.idEstado,
    idusuario: obj.idUsuario,
    idusuarioAsignado: obj.idUsuarioAsignado,
    idUbicacion: obj.idUbicacion,
    estado: obj.estado,
    idactividadActualSolicitud: obj.idActividadActualSolicitud,
    actividadActualSolicitud: obj.actividadActualSolicitud,
    actividadSiguienteSolicitud: obj.actividadSiguienteSolicitud,

    citacion,

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

    subred,

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
