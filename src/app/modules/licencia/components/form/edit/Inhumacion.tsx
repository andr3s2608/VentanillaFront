export const EditInhumacion = () => {

    const data = localStorage.getItem('register');

    if (data) {
        const json = JSON.parse(data);
        const [obj] = json;
        return formatObjJson(obj);
    }
    return {};

};

const formatObjJson = (obj: any) => {

    const { institucionCertificaFallecimiento, lugarDefuncion, persona, ubicacionPersona, datosCementerio } = obj;
    const [fallecido, certicador] = persona;
    const jsonDt = {
        idTramite: obj.idTramite,
        certificado: obj.numeroCertificado,
        date: obj.fechaDefuncion,
        time: obj.hora,
        sex: obj.idSexo,
        country: obj.idPais,
        state: obj.idDepartamento,
        city: obj.idMunicipio,
        areaDef: obj.idAreaDefuncion,
        sitDef: obj.idSitioDefuncion,
        instType: obj.institucionCertificaFallecimiento.idTipoInstitucion,
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
        cementerioLugar: datosCementerio.cementerioLugar,
        cementerioBogota: datosCementerio.cementerio,
        medicalSignatureIDType: certicador.tipoIdentificacion,
        medicalSignatureIDNumber: certicador.numeroIdentificacion,
        medicalSignatureIDExpedition: certicador.idLugarExpedicion,
        medicalSignatureName: certicador.primerNombre,
        medicalSignatureSecondName: certicador.segundoNombre,
        medicalSignatureSurname: certicador.primerApellido,
        medicalSignatureSecondSurname: certicador.segundoApellido,
        medicalSignatureProfesionalType: certicador.idTipoProfesional

    };
    return jsonDt;

}