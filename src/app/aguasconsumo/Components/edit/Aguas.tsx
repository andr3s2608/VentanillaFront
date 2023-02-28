export const EditAguas = () => {
  const data = localStorage.getItem('register');

  if (data) {
    const json = JSON.parse(data);
    const obj = json;

    return formatObjJson(obj);
  } else {
    return [];

  }
};

const formatObjJson = (obj: any) => {
  const { citacion_Revision, persona, ubicacion, fuenteAbastecimiento, subredes } = obj;

  let jsonDt;

  let fuenteabastecimientojson: any[] = [];
  let sistematratamientojson: any[] = [];
  let renovafuentejson: any[] = [];
  let acueductosfuentejson: any[] = [];

  if (fuenteAbastecimiento != null) {
    fuenteabastecimientojson = [
      {
        idfuenteAbastecimiento: fuenteAbastecimiento.idFuente,
        idtipofuente: fuenteAbastecimiento.idTipoFuente,
        idSubCategoriaFuente: fuenteAbastecimiento.idSubCategoriaFuente,
        idAutoridadAmbiental: fuenteAbastecimiento.idAutoridadAmbiental,
        bocatoma_lat: fuenteAbastecimiento.bocatoma_lat_cy,
        bocatoma_long: fuenteAbastecimiento.bocatoma_long_cx,
        nombrefuenteabastecimiento: fuenteAbastecimiento.nombre,
        descripcionFuenteAbastecimiento: fuenteAbastecimiento.descripcionFuente,
        descripcionOtraFuente: fuenteAbastecimiento.descripcionOtraFuente,
        tienePlanta: fuenteAbastecimiento.tienePlanta,
        idautoridad: fuenteAbastecimiento.autoridadAmbiental.idAutoridadAmbiental,
        nombreautoridad: fuenteAbastecimiento.autoridadAmbiental.nombre
      }
    ];
    for (let index = 0; index < fuenteAbastecimiento.sistemaTratamiento.length; index++) {
      sistematratamientojson.push({
        idSistemaTratamiento: fuenteAbastecimiento.sistemaTratamiento[index].idSistemaTratamiento,
        idFuente: fuenteAbastecimiento.sistemaTratamiento[index].idFuente,
        sedimentador: fuenteAbastecimiento.sistemaTratamiento[index].sedimentador,
        mezclaRapido: fuenteAbastecimiento.sistemaTratamiento[index].mezclaRapido,
        mezclaLento: fuenteAbastecimiento.sistemaTratamiento[index].mezclaLento,
        oxidacion: fuenteAbastecimiento.sistemaTratamiento[index].oxidacion,
        floculador: fuenteAbastecimiento.sistemaTratamiento[index].floculador,
        filtracion: fuenteAbastecimiento.sistemaTratamiento[index].filtracion,
        desinfeccion: fuenteAbastecimiento.sistemaTratamiento[index].desinfeccion,
        precloracion: fuenteAbastecimiento.sistemaTratamiento[index].precloracion,
        almacenamiento: fuenteAbastecimiento.sistemaTratamiento[index].almacenamiento,
        torreAireacion: fuenteAbastecimiento.sistemaTratamiento[index].torreAireacion,
        otra: fuenteAbastecimiento.sistemaTratamiento[index].otra,
        desarenador: fuenteAbastecimiento.sistemaTratamiento[index].desarenador,
        descripcionOtro: fuenteAbastecimiento.sistemaTratamiento[index].descripcionOtro,
        numUsuarioUrbanos: fuenteAbastecimiento.sistemaTratamiento[index].numUsuarioUrbanos,
        numUsuariosRurales: fuenteAbastecimiento.sistemaTratamiento[index].numUsuariosRurales,
        poblacionUrbanos: fuenteAbastecimiento.sistemaTratamiento[index].poblacionUrbanos,
        poblacionRurales: fuenteAbastecimiento.sistemaTratamiento[index].poblacionRurales,
        caudalDiseno: fuenteAbastecimiento.sistemaTratamiento[index].caudalDiseno,
        caudalTratado: fuenteAbastecimiento.sistemaTratamiento[index].caudalTratado
      });
    }
    for (let index = 0; index < fuenteAbastecimiento.acueductosFuente.length; index++) {
      acueductosfuentejson.push({
        idUsuarioFuente: fuenteAbastecimiento.acueductosFuente[index].idUsuarioFuente,
        idMunicipio: fuenteAbastecimiento.acueductosFuente[index].idMunicipio,
        idVereda: fuenteAbastecimiento.acueductosFuente[index].idVereda,
        sector: fuenteAbastecimiento.acueductosFuente[index].sector,
        coo_long_cx: fuenteAbastecimiento.acueductosFuente[index].coo_long_cx,
        coo_lat_cy: fuenteAbastecimiento.acueductosFuente[index].coo_lat_cy,
        idUsoFuente: fuenteAbastecimiento.acueductosFuente[index].idUsoFuente,
        descripcionOtroUso: fuenteAbastecimiento.acueductosFuente[index].descripcionOtroUso,
        caudalTotal: fuenteAbastecimiento.acueductosFuente[index].caudalTotal,
        idFuenteAbastecimiento: fuenteAbastecimiento.acueductosFuente[index].idFuenteAbastecimiento,
        idDepartamento: fuenteAbastecimiento.acueductosFuente[index].idDepartamento,
        idLocalidad: fuenteAbastecimiento.acueductosFuente[index].idLocalidad
      });
    }

    if (fuenteAbastecimiento.renovaFuenteAbastecimientos[0] != null) {
      renovafuentejson = [
        {
          idRenovacion: fuenteAbastecimiento.renovaFuenteAbastecimientos[0].idRenovacion,
          numeroResolucion: fuenteAbastecimiento.renovaFuenteAbastecimientos[0].numeroResolucion,
          fechaResolucion: fuenteAbastecimiento.renovaFuenteAbastecimientos[0].fechaResolucion,
          idFuente: fuenteAbastecimiento.renovaFuenteAbastecimientos[0].idFuente
        }
      ];
    }
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
    consecutivo: obj.consecutivo,
    idsolicitud: obj.idSolicitud,
    numeroradicado: obj.numeroRadicado,
    fechaSolicitud: obj.fechaSolicitud,
    fechaModificacion: obj.fechaModificacion,
    idtipodeSolicitud: obj.idTipodeSolicitud,
    tipodeSolicitud: obj.tipodeSolicitud,
    idtipodeTramite: obj.idTipodeTramite,
    tipodeTramite: obj.tipodeTramite,
    idFuente: obj.idFuenteAbastecimiento,
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
    correoElectronico: persona.correoElectronico.toString().toLowerCase(),
    telefonoContacto: persona.telefonoContacto,
    razonSocial: persona.razonSocial,

    fuenteabastecimientojson,
    acueductosfuentejson,
    sistematratamientojson,
    renovafuentejson,

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
