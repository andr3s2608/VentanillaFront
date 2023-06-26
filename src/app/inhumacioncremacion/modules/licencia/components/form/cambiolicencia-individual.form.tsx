import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form, { FormInstance } from 'antd/es/form';

// Componentes

import { ApiService } from 'app/services/Apis.service';

import { authProvider } from 'app/shared/utils/authprovider.util';
import { layoutItems, layoutWrapper } from 'app/shared/utils/form-layout.util';
import { useStepperForm } from 'app/shared/hooks/stepper.hook';
import Swal from 'sweetalert2';
import { DatepickerComponent } from 'app/shared/components/inputs/datepicker.component';
import Button from 'antd/es/button';
import { SetResetViewLicence } from 'app/redux/controlViewLicence/controlViewLicence.action';

//Redux
import { store } from 'app/redux/app.reducers';
import { Alert, Input, Radio, RadioChangeEvent, Switch, Upload } from 'antd';
import moment from 'moment';
import { GeneralInfoFormSeccion, KeysForm as KeyFormGeneralInfo } from './seccions/general-info.form-seccion';
import { EditInhumacion } from './edit/Inhumacion';
import { DeathInstituteFormSeccion, KeysForm as KeyFormDeathInstitute } from './seccions/death-institute.form-seccion';
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import { DatoSolicitanteAdd, KeysForm as KeyFormSolicitante } from './seccions/datoSolicitanteAdd';
import { CementerioInfoFormSeccion, KeysForm as KeyFormCementerio } from './seccions/cementerio-info.form-seccion';
import { InformacionDocumentosGestion } from './seccions/documentos-gestion.seccion';
import { IRegistroLicencia } from 'app/inhumacioncremacion/Models/IRegistroLicencia';
import { useHistory } from 'react-router';
import { type } from 'os';
import { InhumacionSeccion } from './seccions/inhumacion.form.seccion';

export const CambioLicencia = ({ props }: any) => {
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [form] = Form.useForm<any>();

  const [licencia, setLicencia] = useState<boolean>(true);



  const obj: any = EditInhumacion('0');





  //validaciones tipos de documentos
  const [longitudreconocido, setLongitudreconocido] = useState<number>(-1);

  const [longitudmaxima, setLongitudmaxima] = useState<number>(10);
  const [longitudminima, setLongitudminima] = useState<number>(4);
  const [tipocampo, setTipocampo] = useState<string>('[0-9]{4,10}');
  const [tipocampovalidacion, setTipocampovalidacion] = useState<any>(/[0-9]/);
  const [tipodocumento, setTipodocumento] = useState<string>('Cédula de Ciudadanía');
  const [sininformacion, setsininformacion] = useState<boolean>(false);
  const [tipodocumentohoranacimiento, settipodocumentohoranacimiento] = useState<string>('7c96a4d3-a0cb-484e-a01b-93bc39c2552e');
  const [campo, setCampo] = useState<string>('Numéricos');
  //validaciones tipos de documentos autorizador
  const [longitudmaximaautoriza, setLongitudmaximaautoriza] = useState<number>(10);
  const [longitudminimaautoriza, setLongitudminimaautoriza] = useState<number>(5);
  const [tipocampoautoriza, setTipocampoautoriza] = useState<string>('[0-9]{4,10}');
  const [sininformacionaut, setsininformacionaut] = useState<boolean>(false);
  const [tipocampovalidacionautoriza, setTipocampovalidacionautoriza] = useState<any>(/[0-9]/);
  const [tipodocumentoautoriza, setTipodocumentoautoriza] = useState<string>('Cédula de Ciudadanía');
  const [campoautoriza, setCampoautoriza] = useState<string>('Numéricos');
  const [l_tipos_documento_autoriza, settiposautoriza] = useState<any>();


  const history = useHistory();

  const [datecorrect, setdatecorrect] = useState<boolean>(true);

  const [causaMuerte, setCausaMuerte] = useState<string>('');
  const [parentescocremacion, setparentescocremacion] = useState<any>();


  const [l_paises, setpaises] = useState<any>([]);
  const [l_tipos_documento, settipos] = useState<any>([]);
  const [l_tipo_muerte, settipomuerte] = useState<any>([]);
  const [insttype, setinsttype] = useState<string>(obj?.instType);

  const { setStatus } = useStepperForm<any>(form);



  const [cambioainhumacion, setcambioainhumacion] = useState<boolean>(false);
  const [cambioacremacion, setcambioacremacion] = useState<boolean>(false);
  const [actualizacioninhumacion, setactualizacioninhumacion] = useState<boolean>(false);
  const [actualizacioncremacion, setactualizacioncremacion] = useState<boolean>(false);

  const getListas = useCallback(async () => {

    const paises: any = localStorage.getItem('paises');
    const paisesjson: any = JSON.parse(paises);


    const tipos: any = localStorage.getItem('tipoid');
    const tiposjson: any = JSON.parse(tipos);

    const tipomuerte: any = localStorage.getItem('tipomuerte');

    const nuevalista = tiposjson.filter((i: { id: string }) => i.id != '7c96a4d3-a0cb-484e-a01b-93bc39c7902e');


    const causa = await api.getCostante('9124A97B-C2BD-46A0-A8B3-1AC7A0A06C82');
    setCausaMuerte(causa['valor']);

    settiposautoriza(nuevalista);

    settipomuerte(JSON.parse(tipomuerte));
    settipos(tiposjson);
    setpaises(paisesjson);


    if (props === 0) {
      if (obj.idTramite === 'a289c362-e576-4962-962b-1c208afa0273') {
        setactualizacioninhumacion(true);
      }
      else {
        const par = obj?.autorizadorcremacion[0].parentesco;
        switch (par) {
          case 'ed389a26-68cb-4b43-acc7-3eb23e997bf9':
            setparentescocremacion('Padre / Madre');
            break;
          case '313e2b1d-33f0-455b-9178-f23579f01414':
            setparentescocremacion('Hermano/a');
            break;
          case 'f8841271-f6b7-4d11-b55f-41da3faccdfe':
            setparentescocremacion('Hijo/a');
            break;
          case '4c00cd98-9a25-400a-9c31-1f6fca7de562':
            setparentescocremacion('Cónyuge (Compañero/a Permanente)');
            break;
          case '6880824b-39c2-4105-8195-c190885796d8':
            setparentescocremacion('Tío/a');
            break;
          case '5fa418af-62d9-498f-94e4-370c195e8fc8':
            setparentescocremacion('Sobrino/a');
            break;
          case 'ad65eb1c-10bd-4882-8645-d12001cd57b2':
            setparentescocremacion('Abuelo/a');
            break;
          case '84286cb9-2499-4348-aeb8-285fc9dcf60f':

            setparentescocremacion('Nieto/a');
            break;
          case 'e819b729-799c-4644-b62c-74bff07bf622':

            setparentescocremacion('Otro');
            break;
        }

        setactualizacioncremacion(true);
      }
    }
    else {
      if (obj.idTramite === 'a289c362-e576-4962-962b-1c208afa0273') {
        setcambioacremacion(true);
      }
      else {
        setcambioainhumacion(true);
      }
    }



  }, []);

  useEffect(() => {
    getListas();
  }, []);





  const onSubmit = async (values: any) => {


    var bandera = false;
    if (values.certificado == obj.numeroCertificado) {
      bandera = true;
    } else {
      const busquedacertificado = await api.ComprobarCertificado(values.certificado + '');
      if (busquedacertificado == null) {
        bandera = true;
      } else {
        bandera = false;
      }
    }
    if (!bandera) {
      Swal.fire({
        title: 'Usuario Registrado',
        text: 'El Número de Certificado ya se Encuentra Registrado, desea continuar?',
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonText: 'Modificar',
        denyButtonText: `Cancelar`,
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        },
        icon: 'info'
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Modificar(values);

        } else if (result.isDenied) {
        }
      });
    }
    else {
      Modificar(values);
    }

  };


  const Modificar = (values: any) => {

    console.log("---------------------- Valores -------------------------------- ");
    console.log(values);

    if (datecorrect) {

      let cambiodatos = false;

      if (longitudreconocido != -1 && values.name.toString().toUpperCase() != 'N' && values.surname.toString().toUpperCase() != 'N') {
        cambiodatos = true;
      }
      if (longitudreconocido === -1) {
        cambiodatos = true;
      }

      if (cambiodatos) {
        Swal.fire({
          title: cambioacremacion || cambioainhumacion ? 'Cambio de Licencia' : 'Actualización de Datos',
          text: cambioacremacion || cambioainhumacion ?

            `Esta a punto de solicitar cambio de
          ${obj.idTramite === 'a289c362-e576-4962-962b-1c208afa0273' ? 'inhumación' : 'cremación'}
           a
            ${obj.idTramite === 'a289c362-e576-4962-962b-1c208afa0273' ? 'cremación' : 'inhumación'}
           , ¿Está seguro de continuar?` : 'Esta a punto de realizar una actualización de datos, ¿Está seguro de continuar?',
          showConfirmButton: true,
          showDenyButton: true,
          confirmButtonText: 'Modificar',
          denyButtonText: `Cancelar`,
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          },
          icon: 'info'
        }).then(async (result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {


            let causa = values.causaMuerte;
            let banderaCausa = true;
            let observacionCausaMuerte = causaMuerte;

            if (causa === 'No' || causa === undefined) {
              banderaCausa = false;
              observacionCausaMuerte = '';
            }


            const estadoSolicitud = 'fdcea488-2ea7-4485-b706-a2b96a86ffdf';
            const formatDate = 'MM-DD-YYYY';
            let idnum = values.IDNumber;
            let idnumaut = values.mauthIDNumber;

            if (sininformacion && idnum == undefined) {
              idnum = ' ';
            }
            if (sininformacionaut && idnumaut == undefined) {
              idnumaut = ' ';
            }


            const tipoinst = values.instTipoIdent;
            var tipoidinst = values.instTipoIdent;
            var numeroins = values.instNumIdent;
            var razonSocialins = values.instRazonSocial;
            var numeroProtocoloins = values.instNumProtocolo;
            if (tipoinst == undefined) {
              tipoidinst = 'A7A1B90B-8F29-4509-8220-A95F567E6FCB';
              numeroins = '0';
              razonSocialins = 'Otros';
              numeroProtocoloins = '452022';
            } else {
              tipoidinst = 'A7A1B90B-8F29-4509-8220-A95F567E6FCB';
            }
            const par = values.authParentesco;
            var parentesco = '';
            switch (par) {
              case 'Padre / Madre':
                parentesco = 'ed389a26-68cb-4b43-acc7-3eb23e997bf9';
                break;
              case 'Hermano/a':
                parentesco = '313e2b1d-33f0-455b-9178-f23579f01414';
                break;
              case 'Hijo/a':
                parentesco = 'f8841271-f6b7-4d11-b55f-41da3faccdfe';
                break;
              case 'Cónyuge (Compañero/a Permanente)':
                parentesco = '4c00cd98-9a25-400a-9c31-1f6fca7de562';
                break;
              case 'Tío/a':
                parentesco = '6880824b-39c2-4105-8195-c190885796d8';
                break;
              case 'Sobrino/a':
                parentesco = '5fa418af-62d9-498f-94e4-370c195e8fc8';
                break;
              case 'Abuelo/a':
                parentesco = 'ad65eb1c-10bd-4882-8645-d12001cd57b2';
                break;
              case 'Nieto/a':
                parentesco = '84286cb9-2499-4348-aeb8-285fc9dcf60f';
                break;
              case 'Otro':
                parentesco = 'e819b729-799c-4644-b62c-74bff07bf622';
                break;
              case undefined:
                parentesco = 'e819b729-799c-4644-b62c-74bff07bf622';
                break;
            }

            let persona: any[] = [];



            let nacionalidad = '';
            if (values.nationalidad === '1') {
              nacionalidad = '1e05f64f-5e41-4252-862c-5505dbc3931c'
            }
            else {
              nacionalidad = values.nationalidad;
            }


            if (cambioacremacion || cambioainhumacion) {
              if (obj.idTramite === 'a289c362-e576-4962-962b-1c208afa0273') {

                if (obj?.autorizadorcremacion.length > 0) {

                  persona = [
                    //fallecido
                    {
                      idPersona: obj.idpersona,
                      tipoIdentificacion: values.IDType,
                      numeroIdentificacion: idnum,
                      primerNombre: values.name,
                      segundoNombre: values.secondName ?? '',
                      primerApellido: values.surname,
                      segundoApellido: values.secondSurname ?? '',
                      fechaNacimiento: values.dateOfBirth ?? '00-00-0000',
                      hora: values?.timenac ? moment(values.timenac).format('LT') : 'Sin información',
                      nacionalidad: nacionalidad,
                      estado: true,
                      segundanacionalidad: '00000000-0000-0000-0000-000000000000',
                      otroParentesco: null,
                      idEstadoCivil: obj.civilStatus,
                      idNivelEducativo: obj.educationLevel,
                      idEtnia: obj.etnia,
                      idRegimen: obj.regime,
                      idTipoPersona: '01f64f02-373b-49d4-8cb1-cb677f74292c',
                      idParentesco: parentesco,
                      idLugarExpedicion: '00000000-0000-0000-0000-000000000000'
                    },
                    //authorizador cremacion
                    {
                      idPersona: obj.autorizadorcremacion[0].id,
                      tipoIdentificacion: values.authIDType,
                      numeroIdentificacion: idnumaut,
                      primerNombre: values.authName,
                      segundoNombre: values.authSecondName ?? '',
                      primerApellido: values.authSurname,
                      segundoApellido: values.authSecondSurname ?? '',
                      fechaNacimiento: null,
                      estado: true,
                      hora: '',
                      nacionalidad: '00000000-0000-0000-0000-000000000000',
                      segundanacionalidad: '00000000-0000-0000-0000-000000000000',
                      otroParentesco: values?.authOtherParentesco, //lista parentesco
                      idEstadoCivil: '00000000-0000-0000-0000-000000000000',
                      idNivelEducativo: '00000000-0000-0000-0000-000000000000',
                      idEtnia: '00000000-0000-0000-0000-000000000000',
                      idRegimen: '00000000-0000-0000-0000-000000000000',
                      idTipoPersona: 'cc4c8c4d-b557-4a5a-a2b3-520d757c5d06',
                      idParentesco: parentesco,
                      idLugarExpedicion: '00000000-0000-0000-0000-000000000000'
                    }
                  ];

                }
                else {
                  persona = [
                    //fallecido
                    {
                      idPersona: obj.idpersona,
                      tipoIdentificacion: values.IDType,
                      numeroIdentificacion: idnum,
                      primerNombre: values.name,
                      segundoNombre: values.secondName ?? '',
                      primerApellido: values.surname,
                      segundoApellido: values.secondSurname ?? '',
                      fechaNacimiento: values.dateOfBirth ?? '00-00-0000',
                      hora: values?.timenac ? moment(values.timenac).format('LT') : 'Sin información',
                      nacionalidad: nacionalidad,
                      estado: true,
                      segundanacionalidad: '00000000-0000-0000-0000-000000000000',
                      otroParentesco: null,
                      idEstadoCivil: obj.civilStatus,
                      idNivelEducativo: obj.educationLevel,
                      idEtnia: obj.etnia,
                      idRegimen: obj.regime,
                      idTipoPersona: '01f64f02-373b-49d4-8cb1-cb677f74292c',
                      idParentesco: parentesco,
                      idLugarExpedicion: '00000000-0000-0000-0000-000000000000'
                    },
                    //authorizador cremacion
                    {
                      //idPersona: '',
                      tipoIdentificacion: values.authIDType,
                      numeroIdentificacion: idnumaut,
                      primerNombre: values.authName,
                      segundoNombre: values.authSecondName ?? '',
                      primerApellido: values.authSurname,
                      segundoApellido: values.authSecondSurname ?? '',
                      fechaNacimiento: null,
                      estado: true,
                      hora: '',
                      nacionalidad: '00000000-0000-0000-0000-000000000000',
                      segundanacionalidad: '00000000-0000-0000-0000-000000000000',
                      otroParentesco: values?.authOtherParentesco, //lista parentesco
                      idEstadoCivil: '00000000-0000-0000-0000-000000000000',
                      idNivelEducativo: '00000000-0000-0000-0000-000000000000',
                      idEtnia: '00000000-0000-0000-0000-000000000000',
                      idRegimen: '00000000-0000-0000-0000-000000000000',
                      idTipoPersona: 'cc4c8c4d-b557-4a5a-a2b3-520d757c5d06',
                      idParentesco: parentesco,
                      idLugarExpedicion: '00000000-0000-0000-0000-000000000000'
                    }
                  ];

                }
              }
              else {
                persona = [
                  //fallecido
                  {
                    idPersona: obj.idpersona,
                    tipoIdentificacion: values.IDType,
                    numeroIdentificacion: idnum,
                    primerNombre: values.name,
                    segundoNombre: values.secondName ?? '',
                    primerApellido: values.surname,
                    segundoApellido: values.secondSurname ?? '',
                    fechaNacimiento: values.dateOfBirth ?? '00-00-0000',
                    hora: values?.timenac ? moment(values.timenac).format('LT') : 'Sin información',
                    nacionalidad: nacionalidad,
                    segundanacionalidad: '00000000-0000-0000-0000-000000000000',
                    otroParentesco: null,
                    estado: true,
                    idEstadoCivil: obj.civilStatus,
                    idNivelEducativo: obj.educationLevel,
                    idEtnia: obj.etnia,
                    idRegimen: obj.regime,
                    idTipoPersona: '01f64f02-373b-49d4-8cb1-cb677f74292c',
                    idParentesco: parentesco,
                    idLugarExpedicion: '00000000-0000-0000-0000-000000000000'
                  },
                  {
                    //authorizador cremacion
                    idPersona: obj.autorizadorcremacion[0].id,
                    tipoIdentificacion: obj.autorizadorcremacion[0].tipoid,
                    numeroIdentificacion: obj.autorizadorcremacion[0].numeroid,
                    primerNombre: obj.autorizadorcremacion[0].name,
                    segundoNombre: obj.autorizadorcremacion[0].secondName,
                    primerApellido: obj.autorizadorcremacion[0].surname,
                    segundoApellido: obj.autorizadorcremacion[0].secondSurname,
                    fechaNacimiento: null,
                    estado: actualizacioncremacion || actualizacioninhumacion ? true : false,
                    hora: '',
                    nacionalidad: '00000000-0000-0000-0000-000000000000',
                    segundanacionalidad: '00000000-0000-0000-0000-000000000000',
                    otroParentesco: obj.autorizadorcremacion[0].otroparentesco, //lista parentesco
                    idEstadoCivil: '00000000-0000-0000-0000-000000000000',
                    idNivelEducativo: '00000000-0000-0000-0000-000000000000',
                    idEtnia: '00000000-0000-0000-0000-000000000000',
                    idRegimen: '00000000-0000-0000-0000-000000000000',
                    idTipoPersona: 'cc4c8c4d-b557-4a5a-a2b3-520d757c5d06',
                    idParentesco: obj.autorizadorcremacion[0].parentesco,
                    idLugarExpedicion: '00000000-0000-0000-0000-000000000000'
                  }
                ];

              }
            }
            else {
              if (obj.idTramite === 'a289c362-e576-4962-962b-1c208afa0273') {
                persona = [
                  //fallecido
                  {
                    idPersona: obj.idpersona,
                    tipoIdentificacion: values.IDType,
                    numeroIdentificacion: idnum,
                    primerNombre: values.name,
                    segundoNombre: values.secondName ?? '',
                    primerApellido: values.surname,
                    segundoApellido: values.secondSurname ?? '',
                    fechaNacimiento: values.dateOfBirth ?? '00-00-0000',
                    hora: values?.timenac ? moment(values.timenac).format('LT') : 'Sin información',
                    nacionalidad: nacionalidad,
                    estado: true,
                    segundanacionalidad: '00000000-0000-0000-0000-000000000000',
                    otroParentesco: null,
                    idEstadoCivil: obj.civilStatus,
                    idNivelEducativo: obj.educationLevel,
                    idEtnia: obj.etnia,
                    idRegimen: obj.regime,
                    idTipoPersona: '01f64f02-373b-49d4-8cb1-cb677f74292c',
                    idParentesco: parentesco,
                    idLugarExpedicion: '00000000-0000-0000-0000-000000000000'
                  }
                ];
              }
              else {
                persona = [
                  //fallecido
                  {
                    idPersona: obj.idpersona,
                    tipoIdentificacion: values.IDType,
                    numeroIdentificacion: idnum,
                    primerNombre: values.name,
                    segundoNombre: values.secondName ?? '',
                    primerApellido: values.surname,
                    segundoApellido: values.secondSurname ?? '',
                    fechaNacimiento: values.dateOfBirth ?? '00-00-0000',
                    hora: values?.timenac ? moment(values.timenac).format('LT') : 'Sin información',
                    nacionalidad: nacionalidad,
                    estado: true,
                    segundanacionalidad: '00000000-0000-0000-0000-000000000000',
                    otroParentesco: null,
                    idEstadoCivil: obj.civilStatus,
                    idNivelEducativo: obj.educationLevel,
                    idEtnia: obj.etnia,
                    idRegimen: obj.regime,
                    idTipoPersona: '01f64f02-373b-49d4-8cb1-cb677f74292c',
                    idParentesco: parentesco,
                    idLugarExpedicion: '00000000-0000-0000-0000-000000000000'
                  },
                  //authorizador cremacion
                  {
                    idPersona: obj.autorizadorcremacion[0].id,
                    tipoIdentificacion: values.authIDType,
                    numeroIdentificacion: idnumaut,
                    primerNombre: values.authName,
                    segundoNombre: values.authSecondName ?? '',
                    primerApellido: values.authSurname,
                    segundoApellido: values.authSecondSurname ?? '',
                    fechaNacimiento: null,
                    estado: true,
                    hora: '',
                    nacionalidad: '00000000-0000-0000-0000-000000000000',
                    segundanacionalidad: '00000000-0000-0000-0000-000000000000',
                    otroParentesco: values?.authOtherParentesco, //lista parentesco
                    idEstadoCivil: '00000000-0000-0000-0000-000000000000',
                    idNivelEducativo: '00000000-0000-0000-0000-000000000000',
                    idEtnia: '00000000-0000-0000-0000-000000000000',
                    idRegimen: '00000000-0000-0000-0000-000000000000',
                    idTipoPersona: 'cc4c8c4d-b557-4a5a-a2b3-520d757c5d06',
                    idParentesco: parentesco,
                    idLugarExpedicion: '00000000-0000-0000-0000-000000000000'
                  }
                ];
              }

            }

            let personareconocida: any = {};
            if (longitudreconocido !== -1) {
              personareconocida =
              {
                tipoIdentificacion: values.knownIDType,
                numeroIdentificacion: values.knownIDNumber,
                primerNombre: values.knownName,
                segundoNombre: values.knownsecondName ?? '',
                primerApellido: values.knownsurName,
                segundoApellido: values.knownsecondsurName ?? '',
                fechaNacimiento: null,
                estado: true,
                hora: '',
                nacionalidad: '00000000-0000-0000-0000-000000000000',
                segundanacionalidad: '00000000-0000-0000-0000-000000000000',
                otroParentesco: null, //lista parentesco
                idEstadoCivil: '00000000-0000-0000-0000-000000000000',
                idNivelEducativo: '00000000-0000-0000-0000-000000000000',
                idEtnia: '00000000-0000-0000-0000-000000000000',
                idRegimen: '00000000-0000-0000-0000-000000000000',
                idTipoPersona: '87cf579b-b873-43c1-b4a7-004dba2cc68e',
                idParentesco: '00000000-0000-0000-0000-000000000000',
                idLugarExpedicion: '00000000-0000-0000-0000-000000000000'
              }
              persona.push(personareconocida);

            }




            let checkhora = values?.check ?? obj.check;


            const json: IRegistroLicencia<any> = {
              solicitud: {
                idSolicitud: obj.idSolicitud,
                consecutivo: obj.consecutivo,
                numeroCertificado: values.certificado,
                fechaDefuncion: moment(values.date).format(formatDate),
                sinEstablecer: checkhora,
                hora: checkhora === true ? 'Sin información' : moment(values.time).format('LT'),
                idSexo: values.sex,
                estadoSolicitud: (cambioainhumacion || cambioacremacion) ? '31A45854-BF40-44B6-2645-08DA64F23B8E' : '40A8AC96-6513-42AE-9E44-A5C0E47AC6D8',
                idPersonaVentanilla: obj.idpersonaventanilla, //numero de usuario registrado
                idUsuarioSeguridad: obj.idusuarioseg,
                idTramite: (cambioainhumacion || actualizacioninhumacion) ?
                  'a289c362-e576-4962-962b-1c208afa0273' :
                  'e69bda86-2572-45db-90dc-b40be14fe020',
                idTipoMuerte: values.deathType,
                tipoPersona: obj.tipopersonasolicitantesolicitud,
                tipoIdentificacionSolicitante: obj.tiposolicitantesolicitud,
                noIdentificacionSolicitante: obj.nrosolicitantesolicitud,
                razonSocialSolicitante: obj.razonsocialsolicitantesolicitud,
                persona,
                lugarDefuncion: {
                  idPais: obj.country,
                  idDepartamento: obj.state,
                  idMunicipio: obj.city,
                  idAreaDefuncion: obj.areaDef,
                  idSitioDefuncion: obj.sitDef
                },
                ubicacionPersona: {
                  idPaisResidencia: obj.residencia,
                  idDepartamentoResidencia: obj.idDepartamentoResidencia,
                  idCiudadResidencia: obj.idCiudadResidencia,
                  idLocalidadResidencia: obj.idLocalidadResidencia,
                  idAreaResidencia: obj.idAreaResidencia,
                  idBarrioResidencia: obj.idBarrioResidencia,
                  ciudad: obj.ciudadfuera
                },
                datosCementerio: {
                  idDatosCementerio: obj?.idDatosCementerio,
                  enBogota: values.cementerioLugar === 'Dentro de Bogotá',
                  fueraBogota: values.cementerioLugar === 'Fuera de Bogotá',
                  fueraPais: values.cementerioLugar === 'Fuera del País',
                  cementerio: values.cementerioBogota ?? values.cementerioLugar,
                  otroSitio: values.otrositio,
                  ciudad: values.cementerioCiudad,
                  idPais: values.cementerioPais,
                  idDepartamento: values.cementerioDepartamento,
                  idMunicipio: values.cementerioMunicipio
                },

                datosFuneraria: {
                  idDatosFuneraria: obj?.idDatosfuneraria,
                  enBogota: true,
                  fueraBogota: false,
                  fueraPais: false,
                  funeraria: values.funerariaBogota,
                  otroSitio: values.otrofuneraria,
                  ciudad: values.funerariaCiudad,
                  idPais: values.funerariaPais,
                  idDepartamento: values.funerariaDepartamento,
                  idMunicipio: values.funerariaMunicipio
                },

                resumenSolicitud: {
                  idSolicitud: obj.idresumensolicitud,
                  correoCementerio: obj.correocementerio.toString().toLowerCase(),
                  correoFuneraria: obj.correofuneraria.toString().toLowerCase(),
                  tipoDocumentoSolicitante: obj.tipodocsolicitante,
                  numeroDocumentoSolicitante: obj.nrosolicitante,
                  nombreSolicitante: obj.nombresolicitante,
                  apellidoSolicitante: obj.apellidosolicitante,
                  correoSolicitante: obj.correosolicitante.toString().toLowerCase(),
                  correoMedico: '',
                  cumpleCausa: banderaCausa,
                  observacionCausa: observacionCausaMuerte
                },

                institucionCertificaFallecimiento: {
                  idInstitucionCertificaFallecimiento: obj?.idInstitucionCertificaFallecimiento,
                  tipoIdentificacion: tipoidinst,
                  numeroIdentificacion: numeroins,
                  razonSocial: razonSocialins,
                  numeroProtocolo: numeroProtocoloins,
                  numeroActaLevantamiento: razonSocialins !== 'Otros' ? values?.numeroActLeva : '',
                  fechaActa: razonSocialins !== 'Otros' ? (values?.DateAct ? moment(values?.DateAct).format(formatDate) : null) : null,
                  seccionalFiscalia: razonSocialins !== 'Otros' ? values?.SecFiscalAct : '',
                  noFiscal: razonSocialins !== 'Otros' ? values?.NoFiscAct : '',
                  idTipoInstitucion: values?.instType,
                  NombreFiscal: razonSocialins !== 'Otros' ? (values?.fiscalianombreDC ?? '') : '',
                  ApellidoFiscal: razonSocialins !== 'Otros' ? (values?.fiscaliaapellidoDC ?? '') : '',
                  NumeroOficio: razonSocialins !== 'Otros' ? (values?.fiscalianumeroDC ?? '') : '',
                  NoFiscalMedicinaLegal: razonSocialins !== 'Otros' ? (values?.NoFiscalDC ?? '') : '',
                  FechaOficio: razonSocialins !== 'Otros' ? (values?.fiscaliafechaDC ? moment(values?.fiscaliafechaDC).format(formatDate) : null) : null
                }
                // documentosSoporte: generateFormFiel(values.instType)
              }
            };




            await api.putLicencia(json, '1');
            let observacion = '';

            if (cambioacremacion || cambioainhumacion) {
              observacion = 'cambio de licencia';
            }
            else {
              observacion = 'modificación datos';
            }
            const idUsuario = await api.getIdUsuario();
            const seguimiento = {
              fechaRegistro: obj.fechasol,
              usuario: idUsuario,
              estado: observacion,
              idSolicitud: obj.idSolicitud,
              observacion: values.observations

            }
            await api.addSeguimiento(seguimiento);


            const madre = form.getFieldValue('fileDocumentoMadre');



            const supportDocumentsEdit: any[] = [];
            const formData = new FormData();


            if (cambioacremacion || cambioainhumacion) {
              //general
              const acta = form.getFieldValue('fileActaNotarialFiscal');
              //de inhumacion a cremacion
              const autcrem = form.getFieldValue('fileAuthCCFamiliar');
              const docfam = form.getFieldValue('fileDocCremacion');
              const fiscautcrem = form.getFieldValue('fileAuthFiscalCremacion');
              const ofmedleg = form.getFieldValue('fileOrdenAuthFiscal');
              const justificcrem = form.getFieldValue('filejustcambio');
              //de cremacion a inhumacion
              const justificinh = form.getFieldValue('filejustFamiliar');
              const docauth = form.getFieldValue('fileDocaut');






              const resp = await api.getSupportDocuments(obj.idSolicitud);


              const filter = resp.filter(function (f: { esValido: boolean }) {
                return (
                  f.esValido != false
                );
              });

              formData.append('containerName', obj.idTramite === 'a289c362-e576-4962-962b-1c208afa0273' ?
                'cremacionindividual' : 'inhumacionindividual'
              );
              formData.append('oid', accountIdentifier);
              const blobcertificado: any = await api.GetBlobInhumacionCremacion(obj.idTramite === 'a289c362-e576-4962-962b-1c208afa0273' ?
                'inhumacionindividual' : 'cremacionindividual', obj.idusuarioseg + '/Certificado_Defuncion_' + obj.idSolicitud + '.pdf')

              const blobdocumento: any = await api.GetBlobInhumacionCremacion(obj.idTramite === 'a289c362-e576-4962-962b-1c208afa0273' ?
                'inhumacionindividual' : 'cremacionindividual', obj.idusuarioseg + '/Documento_del_fallecido_' + obj.idSolicitud + '.pdf')



              /*
              var reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = function () {
                var base64data = reader.result;

              }
              */
              const type: any = { type: 'application/pdf' };
              const uid: any = { uid: 'rc-upload-1665609235853-5' }
              var filecertificado = new File([blobcertificado as Blob], "Certificado_defuncion.pdf", type);
              var filedocumento = new File([blobdocumento as Blob], "Documento_del_fallecido.pdf", type);



              formData.append('file', filecertificado);
              formData.append('nameFile', 'Certificado_Defuncion' + '_' + obj.idSolicitud);


              formData.append('file', filedocumento);
              formData.append('nameFile', 'Documento_del_fallecido' + '_' + obj.idSolicitud);




              let actavalida = 0;

              if (acta != undefined) {
                formData.append('file', values.fileActaNotarialFiscal.file);
                formData.append('nameFile', 'Acta_Notarial_del_Fiscal' + '_' + obj.idSolicitud);

                supportDocumentsEdit.push({
                  idSolicitud: obj.idSolicitud,
                  idTipoDocumentoSoporte: '79320af6-943c-43bf-87d1-847b625f6203',
                  path: `${obj.idusuarioseg}/Acta_Notarial_del_Fiscal_${obj.idSolicitud}`,
                  idUsuario: obj.idusuarioseg,
                  esValido: true
                });
                actavalida = 1;

              }
              else {
                if (obj?.instRazonSocial !== 'Otros' && insttype === '80d7f664-5bdd-48eb-8b2c-93c1bd648cc8') {
                  actavalida = 0;
                }
                else {
                  if (tipoinst != undefined && insttype != '80d7f664-5bdd-48eb-8b2c-93c1bd648cc8') {
                    actavalida = 1;
                  }
                }
              }

              for (let index = 0; index < filter.length; index++) {
                if (filter[index].idTipoDocumentoSoporte === '19a11490-261c-4114-9152-23c2b991cb36' || //Certificado de defuncion
                  filter[index].idTipoDocumentoSoporte === '9c4e62a4-ee76-4ba1-8dbe-8be172e23788') { //Documento del fallecido

                }
                else {
                  if (actavalida == 1 &&
                    filter[index].idTipoDocumentoSoporte === '79320af6-943c-43bf-87d1-847b625f6203') {

                  }
                  else {
                    filter[index].esValido = false;
                  }

                }
              }
              await api.UpdateSupportDocuments(filter);

              //de inhumacion a cremacion
              if (obj.idTramite === 'a289c362-e576-4962-962b-1c208afa0273') {
                if (autcrem != undefined) {
                  formData.append('file', values.fileAuthCCFamiliar.file);
                  formData.append('nameFile', 'Autorizacion_de_cremacion_del_familiar' + '_' + obj.idSolicitud);

                  supportDocumentsEdit.push({
                    idSolicitud: obj.idSolicitud,
                    idTipoDocumentoSoporte: 'f67f1c4e-a6a5-4257-a995-17a926801f7c',
                    path: `${obj.idusuarioseg}/Autorizacion_de_cremacion_del_familiar_${obj.idSolicitud}`,
                    idUsuario: obj.idusuarioseg,
                    esValido: true
                  });
                }
                if (docfam != undefined) {
                  formData.append('file', values.fileDocCremacion.file);
                  formData.append('nameFile', 'Documento_del_familiar' + '_' + obj.idSolicitud);

                  supportDocumentsEdit.push({
                    idSolicitud: obj.idSolicitud,
                    idTipoDocumentoSoporte: 'd6524742-e32d-4548-ab21-7a9cbb367926',
                    path: `${obj.idusuarioseg}/Documento_del_familiar_${obj.idSolicitud}`,
                    idUsuario: obj.idusuarioseg,
                    esValido: true
                  });
                }
                if (fiscautcrem != undefined) {
                  formData.append('file', values.fileAuthFiscalCremacion.file);
                  formData.append('nameFile', 'Autorizacion_del_fiscal_para_cremar' + '_' + obj.idSolicitud);

                  supportDocumentsEdit.push({
                    idSolicitud: obj.idSolicitud,
                    idTipoDocumentoSoporte: 'C659A063-E8A3-4F23-9A61-575AFB1E1C2B',
                    path: `${obj.idusuarioseg}/Autorizacion_del_fiscal_para_cremar_${obj.idSolicitud}`,
                    idUsuario: obj.idusuarioseg,
                    esValido: true
                  });
                }
                if (ofmedleg != undefined) {
                  formData.append('file', values.fileOrdenAuthFiscal.file);
                  formData.append('nameFile', 'Oficio_de_medicina_legal_al_fiscal_para_cremar' + '_' + obj.idSolicitud);

                  supportDocumentsEdit.push({
                    idSolicitud: obj.idSolicitud,
                    idTipoDocumentoSoporte: '1266f06c-0bc1-4cf8-ba51-5e889d5e8178',
                    path: `${obj.idusuarioseg}/Oficio_de_medicina_legal_al_fiscal_para_cremar_${obj.idSolicitud}`,
                    idUsuario: obj.idusuarioseg,
                    esValido: true
                  });
                }

                if (justificcrem != undefined) {
                  formData.append('file', values.filejustcambio.file);
                  formData.append('nameFile', 'Justificación_del_cambio_de_licencia' + '_' + obj.idSolicitud);

                  supportDocumentsEdit.push({
                    idSolicitud: obj.idSolicitud,
                    idTipoDocumentoSoporte: '242A2E58-46B5-4C45-97BA-881A383F2CBB',
                    path: `${obj.idusuarioseg}/Justificación_del_cambio_de_licencia_${obj.idSolicitud}`,
                    idUsuario: obj.idusuarioseg,
                    esValido: true
                  });
                }





              }
              else {
                if (justificinh != undefined) {
                  formData.append('file', values.filejustFamiliar.file);
                  formData.append('nameFile', 'Justificación_de_inhumación' + '_' + obj.idSolicitud);

                  supportDocumentsEdit.push({
                    idSolicitud: obj.idSolicitud,
                    idTipoDocumentoSoporte: 'FA808621-D345-43C7-88B0-E0B9FF56A24D',
                    path: `${obj.idusuarioseg}/Justificación_de_inhumación_${obj.idSolicitud}`,
                    idUsuario: obj.idusuarioseg,
                    esValido: true
                  });
                }
                if (docauth != undefined) {
                  formData.append('file', values.fileDocaut.file);
                  formData.append('nameFile', 'Documento_de_quien_autoriza' + '_' + obj.idSolicitud);

                  supportDocumentsEdit.push({
                    idSolicitud: obj.idSolicitud,
                    idTipoDocumentoSoporte: '6E57212B-2266-4854-9C13-F805BB4BBCF8',
                    path: `${obj.idusuarioseg}/Documento_de_quien_autoriza_${obj.idSolicitud}`,
                    idUsuario: obj.idusuarioseg,
                    esValido: true
                  });
                }

              }

              if (longitudreconocido !== -1) {
                formData.append('file', values.fileCertificadoDefuncion.file);
                formData.append('nameFile', 'Certificado_Defuncion' + '_' + obj.idSolicitud);


                formData.append('file', values.fileDocumentoFallecido.file);
                formData.append('nameFile', 'Documento_del_fallecido' + '_' + obj.idSolicitud);
              }
              formData.append('containerName', obj.idTramite === 'a289c362-e576-4962-962b-1c208afa0273' ?
                'cremacionindividual' : 'inhumacionindividual'
              );
              formData.append('oid', accountIdentifier);
              await api.uploadFiles(formData);
              await api.UpdateSupportDocuments(supportDocumentsEdit);



            }
            else {

              const acta = form.getFieldValue('fileActaNotarialFiscal');

              //en caso de ser cremacion y se cambie a medicina legal
              const fiscautcrem = form.getFieldValue('fileAuthFiscalCremacion');
              const ofmedleg = form.getFieldValue('fileOrdenAuthFiscal');

              const resp = await api.getSupportDocuments(obj.idSolicitud);


              const filter = resp.filter(function (f: { esValido: boolean }) {
                return (
                  f.esValido != false
                );
              });

              let actavalida = 0;




              if (acta != undefined) {
                formData.append('file', values.fileActaNotarialFiscal.file);
                formData.append('nameFile', 'Acta_Notarial_del_Fiscal' + '_' + obj.idSolicitud);

                supportDocumentsEdit.push({
                  idSolicitud: obj.idSolicitud,
                  idTipoDocumentoSoporte: '79320af6-943c-43bf-87d1-847b625f6203',
                  path: `${obj.idusuarioseg}/Acta_Notarial_del_Fiscal_${obj.idSolicitud}`,
                  idUsuario: obj.idusuarioseg,
                  esValido: true
                });
                actavalida = 1;

              }
              else {
                if (tipoinst != undefined && insttype != '80d7f664-5bdd-48eb-8b2c-93c1bd648cc8') {
                  actavalida = 1;
                }
              }


              for (let index = 0; index < filter.length; index++) {
                if (filter[index].idTipoDocumentoSoporte !== 'fa808621-d345-43c7-88b0-e0b9ff56a24d' || //Autorizacion del fiscal
                  filter[index].idTipoDocumentoSoporte !== '1266f06c-0bc1-4cf8-ba51-5e889d5e8178') { //oficio medicina legal
                  if (actavalida == 0 &&
                    filter[index].idTipoDocumentoSoporte === '79320af6-943c-43bf-87d1-847b625f6203') {
                    filter[index].esValido = false;

                  }
                }
                else {
                  if (fiscautcrem === undefined && filter[index].idTipoDocumentoSoporte !== 'fa808621-d345-43c7-88b0-e0b9ff56a24d') {

                  }
                  else {
                    if (fiscautcrem === undefined && filter[index].idTipoDocumentoSoporte !== '1266f06c-0bc1-4cf8-ba51-5e889d5e8178') {

                    }
                    else {

                      filter[index].esValido = false;
                    }
                  }



                }
              }

              await api.UpdateSupportDocuments(filter);




              if (fiscautcrem != undefined) {
                formData.append('file', values.fileAuthFiscalCremacion.file);
                formData.append('nameFile', 'Autorizacion_del_fiscal_para_cremar' + '_' + obj.idSolicitud);

                supportDocumentsEdit.push({
                  idSolicitud: obj.idSolicitud,
                  idTipoDocumentoSoporte: 'FA808621-D345-43C7-88B0-E0B9FF56A24D',
                  path: `${obj.idusuarioseg}/Autorizacion_del_fiscal_para_cremar_${obj.idSolicitud}`,
                  idUsuario: obj.idusuarioseg,
                  esValido: true
                });
              }
              if (ofmedleg != undefined) {
                formData.append('file', values.fileOrdenAuthFiscal.file);
                formData.append('nameFile', 'Oficio_de_medicina_legal_al_fiscal_para_cremar' + '_' + obj.idSolicitud);

                supportDocumentsEdit.push({
                  idSolicitud: obj.idSolicitud,
                  idTipoDocumentoSoporte: '1266f06c-0bc1-4cf8-ba51-5e889d5e8178',
                  path: `${obj.idusuarioseg}/Oficio_de_medicina_legal_al_fiscal_para_cremar_${obj.idSolicitud}`,
                  idUsuario: obj.idusuarioseg,
                  esValido: true
                });
              }

              if (longitudreconocido !== -1) {
                formData.append('file', values.fileCertificadoDefuncion.file);
                formData.append('nameFile', 'Certificado_Defuncion' + '_' + obj.idSolicitud);


                formData.append('file', values.fileDocumentoFallecido.file);
                formData.append('nameFile', 'Documento_del_fallecido' + '_' + obj.idSolicitud);
              }
              formData.append('containerName', obj.idTramite === 'a289c362-e576-4962-962b-1c208afa0273' ?
                'inhumacionindividual' : 'cremacionindividual'
              );
              formData.append('oid', accountIdentifier);
              await api.uploadFiles(formData);
              await api.UpdateSupportDocuments(supportDocumentsEdit);


            }


            Swal.fire({
              icon: 'success',
              title: 'Solicitud Modificada',
              text: 'Se ha modificado la Solicitud exitosamente'
            });

            history.push('/tramites-servicios');

          } else if (result.isDenied) {

          }
        });

      }

      else {
        Swal.fire({
          icon: 'error',
          title: 'Datos Invalidos',
          text: `Debe de actualizar los nombres de la Madre`
        });
      }

    }
  }
  const onSubmitFailed = () => {
    setStatus('error');
    store.dispatch(SetResetViewLicence());
  };


  const Actions = () => (
    <section>
      <div className='container-fluid'>
        <div className='row'>
          <div className="col-lg-12 col-sm-12 col-md-12 col-xl-12">
            <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
              <div className='d-flex' style={{ margin: '0 auto' }}>
                <Button type='primary' htmlType='submit' style={{ marginLeft: '-40px' }}>
                  Guardar
                </Button>

                <Button
                  style={{ marginLeft: '300px' }}
                  type='dashed'
                  htmlType='button'
                  onClick={() => {
                    history.push('/tramites-servicios');
                  }}
                >
                  Volver atrás
                </Button>
              </div>

            </Form.Item>

          </div>

        </div>
      </div>
    </section>
  );

  const getData = (longitud: number, procedencia: any) => {
    if (procedencia === 'datosfallecido') {
      setLongitudminima(longitud);
    }
    if (procedencia === 'reconocido') {
      setLongitudreconocido(longitud);
    }
    /*
    if (procedencia === 'solicitante') {
      setlongitudsolicitante(longitud);
    }
    if (procedencia === 'deathinst') {
      setlongituddeathinst(longitud);
    }
    if (procedencia === 'medico') {
      setlongitudmedico(longitud);
    }
    */
  };

  const getDataCambioInstituto = () => {

    setinsttype(form.getFieldValue('instType'));
  };


  const settipo = (tipo: string) => {
    settipodocumentohoranacimiento(tipo);
  };
  //validacion fecha de nacimiento
  const FechaNacimiento = () => {
    const valorfecha = obj?.dateOfBirth;
    if (valorfecha != undefined) {
      const fecha = moment(valorfecha);
      const time = obj.hourOfBirth;
      let time2 = undefined;
      if (time != 'Sin información') {
        time2 = moment(time).format('LT');
      }

      const timedef = form.getFieldValue('time');
      let timedef2 = undefined;
      if (timedef != undefined) {
        timedef2 = moment(timedef).format('LT');
      }

      let tiempo = '';

      let valor = form.getFieldValue('date');
      let fechadef = moment(valor);

      if (timedef2 != undefined) {

        if (tipodocumentohoranacimiento == '0d69523b-4676-4e3d-8a3d-c6800a3acf3e') {
          if (time2 != undefined) {
            if (fecha.day() === fechadef.day()) {


              const posicion1 = time2.indexOf(':');
              const posicion2 = timedef2.indexOf(':');

              const horanac1 = time2.substring(0, posicion1);
              const horanac2 = time2.substring(posicion1 + 1, time2.length);

              const horadef1 = timedef2.substring(0, posicion2);
              const horadef2 = timedef2.substring(posicion2 + 1, timedef2.length);

              if (parseInt(horanac1) < parseInt(horadef1)) {

                tiempo = 'es valida';
              } else {
                if (parseInt(horanac1) == parseInt(horadef1)) {
                  if (parseInt(horanac2) <= parseInt(horadef2)) {

                    tiempo = 'es valida';
                  } else {

                    tiempo = 'es invalida';
                  }
                } else {

                  tiempo = 'es invalida';
                }
              }
            }

          }
        }
      }

      if (!fecha.isBefore(fechadef)) {
        if (tiempo == 'es valida') {
          setdatecorrect(true);
        } else {
          if (tiempo == 'es invalida') {
            Swal.fire({
              icon: 'error',
              title: 'Datos inválidos',
              text: `La Hora de fallecimiento debe ser mayor a: ${time2}`
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Datos inválidos',
              text: `La fecha de fallecimiento debe ser mayor a: ${fecha.calendar()}`
            });
          }
          setdatecorrect(false);
        }


      } else {
        setdatecorrect(true);
      }
    }
    else {
      setdatecorrect(true);
    }
  };

  const getDataSolicitante = (solicitante: any) => { };

  const getDataDocumentos = (rowData: string, valor: string) => {

  };

  const [isOtherParentesco, setIsOtherParentesco] = useState(false);
  const onChangeParentesco = (e: RadioChangeEvent) => {
    form.resetFields(['authOtherParentesco']);
    setIsOtherParentesco(e.target.value === 'Otro');
  };


  //validacion Tipo de documento//


  //validacion documento autorizacion
  const cambiodocumentoautoriza = (value: any) => {
    form.setFieldsValue({ mauthIDNumber: undefined });
    const valor: string = value;
    const valorupper = valor.toUpperCase();
    setsininformacionaut(false);

    if (valorupper == 'C087D833-3CFB-460F-AA78-E5CF2FE83F25') {
      form.setFieldsValue({ IDNumber: undefined });
      setLongitudminimaautoriza(0);
      setLongitudmaximaautoriza(15);
      setTipocampoautoriza('[a-zA-Z0-9]{0,15}');
      setTipocampovalidacionautoriza(/[a-zA-Z0-9]/);
      setTipodocumentoautoriza('Sin Identificación');
      setCampoautoriza('AlfaNuméricos(Numéros y letras)');
      setsininformacionaut(true);
    } else {
      if (valorupper == '7C96A4D3-A0CB-484E-A01B-93BC39C7902E') {
        setLongitudminimaautoriza(2);
        setLongitudmaximaautoriza(13);
        setTipocampoautoriza('[0-9]{2,13}');
        setTipocampovalidacionautoriza(/[0-9]/);
        setCampoautoriza('Numéricos');
        setTipodocumentoautoriza('Número de Protocolo');
        form.setFieldsValue({ IDNumber: '8001508610' });
      } else {
        form.setFieldsValue({ IDNumber: undefined });
        if (valorupper === '7C96A4D3-A0CB-484E-A01B-93BC39C2552E') {
          setLongitudminimaautoriza(4);
          setLongitudmaximaautoriza(10);
          setTipocampoautoriza('[0-9]{4,10}');
          setTipocampovalidacionautoriza(/[0-9]/);
          setCampoautoriza('Numéricos');
          setTipodocumentoautoriza('Cédula de Ciudadanía');
        } else {
          if (valorupper === 'AC3629D8-5C87-46CE-A8E2-530B0495CBF6') {
            setLongitudminimaautoriza(10);
            setLongitudmaximaautoriza(11);
            setTipocampoautoriza('[0-9]{10,11}');
            setTipocampovalidacionautoriza(/[0-9]/);
            setCampoautoriza('Numéricos');
            setTipodocumentoautoriza('Tarjeta de Identidad ');
          } else {
            if (valorupper === '2491BC4B-8A60-408F-9FD1-136213F1E4FB') {
              setLongitudminimaautoriza(6);
              setLongitudmaximaautoriza(18);
              setTipocampoautoriza('[0-9]{6,18}');
              setTipocampovalidacionautoriza(/[0-9]/);
              setCampoautoriza('Numéricos');
              setTipodocumentoautoriza('Permiso Especial de Permanencia');
            } else {
              if (valorupper === 'FFE88939-06D5-486C-887C-E52D50B7F35D' ||
                valorupper === '71F659BE-9D6B-4169-9EE2-E70BF0D65F92' ||
                valorupper === '97F5657D-D8EC-48EF-BBE3-1BABEFECB1A4') {
                setLongitudminimaautoriza(10);
                setLongitudmaximaautoriza(15);
                setTipocampoautoriza('[a-zA-Z0-9]{10,15}');
                setTipocampovalidacionautoriza(/[a-zA-Z0-9]/);
                setCampoautoriza('AlfaNuméricos(Numéros y letras)');
                setTipodocumentoautoriza('Registro Civil de Nacimiento , Numero único de identificacíon personal y Carné Diplomatico');
              } else {
                if (valorupper === '0D69523B-4676-4E3D-8A3D-C6800A3ACF3E') {
                  setLongitudminimaautoriza(6);
                  setLongitudmaximaautoriza(16);
                  setTipocampoautoriza('[0-9]{6,16}');
                  setTipocampovalidacionautoriza(/[0-9]/);
                  setCampoautoriza('Numéricos');
                  setTipodocumentoautoriza('Certificado de nacido vivo ');

                }
                else {
                  if (valorupper === '60518653-70B7-42AB-8622-CAA27B496184') {
                    setLongitudminimaautoriza(7);
                    setLongitudmaximaautoriza(16);
                    setTipocampoautoriza('[a-zA-Z0-9]{7,16}');
                    setTipocampovalidacionautoriza(/[a-zA-Z0-9]/);
                    setCampoautoriza('AlfaNumérico(Numéros y letras)');
                    setTipodocumentoautoriza('Documento Extranjero');

                  }
                  else {
                    if (valorupper === 'C532C358-56AE-4F93-8B9B-344DDF1256B7') {
                      setLongitudminimaautoriza(6);
                      setLongitudmaximaautoriza(18);
                      setTipocampoautoriza('[a-zA-Z0-9]{6,18}');
                      setTipocampovalidacionautoriza(/[a-zA-Z0-9]/);
                      setCampoautoriza('AlfaNumérico(Numéros y letras)');
                      setTipodocumentoautoriza('Salvoconducto');

                    }
                    else {
                      if (valorupper === '6AE7E477-2DE5-4149-8C93-12ACA6668FF0') {
                        setLongitudminimaautoriza(5);
                        setLongitudmaximaautoriza(15);
                        setTipocampoautoriza('[a-zA-Z0-9]{5,15}');
                        setTipocampovalidacionautoriza(/[a-zA-Z0-9]/);
                        setCampoautoriza('AlfaNumérico(Numéros y letras)');
                        setTipodocumentoautoriza('Adulto Sin Identificar');

                      }

                      else {
                        if (valorupper === '5FA5BF3F-B342-4596-933F-0956AE4B9109') {
                          setLongitudminimaautoriza(5);
                          setLongitudmaximaautoriza(15);
                          setTipocampoautoriza('[a-zA-Z0-9]{5,15}');
                          setTipocampovalidacionautoriza(/[a-zA-Z0-9]/);
                          setCampoautoriza('AlfaNumérico(Numéros y letras)');
                          setTipodocumentoautoriza('Menor Sin Identificar');

                        }
                        else {
                          if (valorupper === 'E927B566-7B8E-4B4D-AE26-14454705CB5E') {
                            setLongitudminimaautoriza(4);
                            setLongitudmaximaautoriza(18);
                            setTipocampoautoriza('[a-zA-Z0-9]{4,18}');
                            setTipocampovalidacionautoriza(/[a-zA-Z0-9]/);
                            setCampoautoriza('AlfaNumérico(Numéros y letras)');
                            setTipodocumentoautoriza('Permiso de Protección Temporal');

                          }
                          else {
                            setLongitudminimaautoriza(4);
                            setLongitudmaximaautoriza(16);
                            setTipocampoautoriza('[a-zA-Z0-9]{4,16}');
                            setTipocampovalidacionautoriza(/[a-zA-Z0-9]/);
                            setCampoautoriza('AlfaNuméricos(Numéros y letras)');
                            setTipodocumentoautoriza('Pasaporte , Cédula de Extranjería y  Tarjeta de Extranjería ');
                          }

                        }

                      }


                    }

                  }


                }

              }
            }
          }
        }
      }
    }
  };




  return (
    <div className='container-fluid'>
      <div className='card'>
        <div className='card-body'>
          <Form form={form} {...layoutItems} layout='horizontal' onFinish={onSubmit} onFinishFailed={onSubmitFailed}>
            <div className='row justify-content-center'>
              <div className='col-lg-12 col-sm-12 col-md-12 col-xl-12 justify-content-center text-center'>
                <p
                  style={{ fontSize: '16px', color: '#3366cc', fontFamily: ' Roboto' }}
                  className='text-uppercase font-weight-bold'
                >
                  Actualizar tipo de Solicitud
                </p>
              </div>
            </div>
            {licencia && (
              <>
                <section className='panel-solicitud mt-8 mb-5 datos_validadors'>
                  <div className='container'>
                    <div className='row'>
                      <div className='col-lg-12 col-sm-12 col-md-12 col-xl-12'>
                        <div className='collapse-info'>
                          <div id='accordion' className='mt-3'>
                            <div className='card'>
                              <div className='card-header' id='heading-2'>
                                <h5 className='mb-0'>
                                  <a
                                    className='collapsed'
                                    role='button'
                                    data-toggle='collapse'
                                    href='#collapse-1'
                                    aria-expanded='false'
                                    aria-controls='collapse-2'
                                  >
                                    Información General
                                  </a>
                                </h5>
                              </div>
                              <div id='collapse-1' className='collapse' data-parent='#accordion' aria-labelledby='heading-2'>
                                <div className='fadeInRight d-block'>
                                  <GeneralInfoFormSeccion obj={obj} form={form} causaMuerte={''} tipoLicencia={'Cremación'} prop={FechaNacimiento} />

                                </div>
                              </div>
                            </div>
                          </div>

                          <div id='accordion' className='mt-3'>
                            <div className='card'>
                              <div className='card-header' id='heading-2'>
                                <h5 className='mb-0'>
                                  <a
                                    className='collapsed'
                                    role='button'
                                    data-toggle='collapse'
                                    href='#collapse-2'
                                    aria-expanded='false'
                                    aria-controls='collapse-2'
                                  >
                                    Institución que Certifica el Fallecimiento
                                  </a>
                                </h5>
                              </div>
                              <div id='collapse-2' className='collapse' data-parent='#accordion' aria-labelledby='heading-2'>
                                <div className='fadeInRight d-block'>
                                  <DeathInstituteFormSeccion
                                    prop={getData}
                                    obj={obj}
                                    form={form}
                                    datofiscal={true}

                                    required={true}
                                    cambio={getDataCambioInstituto}
                                    tipoLicencia={(cambioainhumacion || actualizacioninhumacion) ? 'Inhumación' : 'Cremación'}
                                  />

                                </div>
                              </div>
                            </div>
                          </div>

                          <div id='accordion' className='mt-3'>
                            <div className='card'>
                              <div className='card-header' id='heading-2'>
                                <h5 className='mb-0'>
                                  <a
                                    className='collapsed'
                                    role='button'
                                    data-toggle='collapse'
                                    href='#collapse-3'
                                    aria-expanded='false'
                                    aria-controls='collapse-2'
                                  >
                                    Datos del Fallecido
                                  </a>
                                </h5>
                              </div>
                              <div id='collapse-3' className='collapse' data-parent='#accordion' aria-labelledby='heading-2'>
                                <div className='fadeInRight d-block mt-3'>
                                  <InhumacionSeccion

                                    form={form}
                                    obj={obj}
                                    tipo={'individual'}
                                    prop={getData}
                                    fechanacimiento={FechaNacimiento}
                                    tipodocumentoseleccionado={settipo}
                                    origen={'modificacion'}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          {(actualizacioncremacion || cambioacremacion) && (
                            <>
                              <div id='accordion' className='mt-3'>
                                <div className='card'>
                                  <div className='card-header' id='heading-2'>
                                    <h5 className='mb-0'>
                                      <a
                                        className='collapsed'
                                        role='button'
                                        data-toggle='collapse'
                                        href='#collapse-4'
                                        aria-expanded='false'
                                        aria-controls='collapse-2'
                                      >
                                        Datos Del Familiar Que Autoriza Cremación
                                      </a>
                                    </h5>
                                  </div>
                                  <div id='collapse-4' className='collapse' data-parent='#accordion' aria-labelledby='heading-2'>
                                    <div className='fadeInRight d-block mt-3'>
                                      <div className='fadeInRight'>
                                        <Form.Item {...layoutWrapper}>
                                          <Alert
                                            style={{ width: '90%' }}
                                            message='Diligencie la información del familiar o persona que autoriza la cremación.'
                                            type='warning'
                                            showIcon
                                          />
                                        </Form.Item>

                                        <Form.Item
                                          className='mt-4'
                                          label='Tipo Documento'
                                          name='authIDType'
                                          initialValue={obj?.autorizadorcremacion.length > 0 ?
                                            obj?.autorizadorcremacion[0].tipoid
                                            : '7c96a4d3-a0cb-484e-a01b-93bc39c2552e'}
                                          rules={[{ required: true }]}
                                        >
                                          <SelectComponent
                                            style={{ width: '90%' }}
                                            options={l_tipos_documento_autoriza}
                                            onChange={cambiodocumentoautoriza}
                                            optionPropkey='id'
                                            optionPropLabel='descripcion'
                                          />
                                        </Form.Item>

                                        <Form.Item
                                          label='Número de Identificación'
                                          name='mauthIDNumber'
                                          initialValue={obj?.autorizadorcremacion.length > 0 ?
                                            obj?.autorizadorcremacion[0].numeroid : null}
                                          rules={[{ required: !sininformacionaut }]}

                                        >
                                          <Input
                                            style={{ width: '90%' }}
                                            allowClear
                                            type='text'
                                            placeholder='Número Identificación'
                                            autoComplete='off'
                                            pattern={tipocampoautoriza}
                                            maxLength={longitudmaximaautoriza}
                                            onKeyPress={(event) => {
                                              if (!tipocampovalidacionautoriza.test(event.key)) {
                                                event.preventDefault();
                                              }
                                            }}
                                            onPaste={(event) => {
                                              event.preventDefault();
                                            }}
                                            onInvalid={() => {
                                              Swal.fire({
                                                icon: 'error',
                                                title: 'Datos inválidos',
                                                text:
                                                  'Sección:Datos Del Familiar Que Autoriza Cremación \n recuerde que para el tipo de documento: ' +
                                                  tipodocumentoautoriza +
                                                  ' solo se admiten valores ' +
                                                  campoautoriza +
                                                  ' de longitud entre ' +
                                                  longitudminimaautoriza +
                                                  ' y ' +
                                                  longitudmaximaautoriza
                                              });
                                            }}
                                          />
                                        </Form.Item>

                                        <Form.Item
                                          label='Primer Nombre'
                                          name='authName'
                                          initialValue={obj?.autorizadorcremacion.length > 0 ?
                                            obj?.autorizadorcremacion[0].name : null}
                                          rules={[{ required: true, max: 50 }]}
                                        >
                                          <Input
                                            style={{ width: '90%' }}
                                            allowClear
                                            placeholder='Primer Nombre'
                                            autoComplete='off'
                                            type='text'
                                            onKeyPress={(event) => {
                                              if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ ]/.test(event.key)) {
                                                event.preventDefault();
                                              }
                                            }}
                                            onPaste={(event) => {
                                              event.preventDefault();
                                            }}
                                          />
                                        </Form.Item>
                                        <Form.Item
                                          label='Segundo Nombre'
                                          initialValue={obj?.autorizadorcremacion.length > 0 ?
                                            obj?.autorizadorcremacion[0].secondName : null}
                                          rules={[{ max: 50 }]}
                                          name='authSecondName'
                                        >
                                          <Input
                                            style={{ width: '90%' }}
                                            allowClear
                                            placeholder='Segundo Nombre'
                                            autoComplete='off'
                                            type='text'
                                            onKeyPress={(event) => {
                                              if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ  ]/.test(event.key)) {
                                                event.preventDefault();
                                              }
                                            }}
                                            onPaste={(event) => {
                                              event.preventDefault();
                                            }}
                                          />
                                        </Form.Item>
                                        <Form.Item
                                          label='Primer Apellido'
                                          initialValue={obj?.autorizadorcremacion.length > 0 ?
                                            obj?.autorizadorcremacion[0].surname : null}
                                          name='authSurname'
                                          rules={[{ required: true, max: 50 }]}
                                        >
                                          <Input
                                            style={{ width: '90%' }}
                                            allowClear
                                            placeholder='Primer Apellido'
                                            autoComplete='off'
                                            type='text'
                                            onKeyPress={(event) => {
                                              if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ ]/.test(event.key)) {
                                                event.preventDefault();
                                              }
                                            }}
                                            onPaste={(event) => {
                                              event.preventDefault();
                                            }}
                                          />
                                        </Form.Item>
                                        <Form.Item
                                          label='Segundo Apellido'
                                          initialValue={obj?.autorizadorcremacion.length > 0 ?
                                            obj?.autorizadorcremacion[0].secondSurname : null}
                                          name='authSecondSurname'
                                          rules={[{ max: 50 }]}
                                        >
                                          <Input
                                            style={{ width: '90%' }}
                                            allowClear
                                            placeholder='Segundo Apellido'
                                            autoComplete='off'
                                            type='text'
                                            onKeyPress={(event) => {
                                              if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ ]/.test(event.key)) {
                                                event.preventDefault();
                                              }
                                            }}
                                            onPaste={(event) => {
                                              event.preventDefault();
                                            }}
                                          />
                                        </Form.Item>


                                        <Form.Item
                                          label='Parentesco'
                                          initialValue={parentescocremacion ?? 'Cónyuge (Compañero/a Permanente)'}
                                          name='authParentesco'
                                          rules={[{ required: true }]}
                                        >
                                          <Radio.Group onChange={onChangeParentesco}>
                                            <Radio value='Padre / Madre'>Padre / Madre</Radio>
                                            <br />
                                            <Radio value='Hermano/a'>Hermano/a</Radio>
                                            <br />
                                            <Radio value='Hijo/a'>Hijo/a</Radio>
                                            <br />
                                            <Radio value='Cónyuge (Compañero/a Permanente)'>Cónyuge (Compañero/a Permanente)</Radio>
                                            <br />
                                            <Radio value='Tío/a'>Tío/a</Radio>
                                            <br />
                                            <Radio value='Sobrino/a'>Sobrino/a</Radio>
                                            <br />
                                            <Radio value='Abuelo/a'>Abuelo/a</Radio>
                                            <br />
                                            <Radio value='Nieto/a'>Nieto/a</Radio>
                                            <br />
                                            <Radio value='Otro'>Otro</Radio>
                                          </Radio.Group>
                                        </Form.Item>

                                        {isOtherParentesco && (
                                          <Form.Item
                                            className='fadeInRight'
                                            label='Otro... ¿Cúal?'
                                            name='authOtherParentesco'
                                            rules={[{ required: true }]}
                                          >
                                            <Input allowClear placeholder='Especifique el Parentesco' autoComplete='off' />
                                          </Form.Item>
                                        )}
                                      </div>

                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                          <div id='accordion' className='mt-3'>
                            <div className='card'>
                              <div className='card-header' id='heading-2'>
                                <h5 className='mb-0'>
                                  <a
                                    className='collapsed'
                                    role='button'
                                    data-toggle='collapse'
                                    href='#collapse-5'
                                    aria-expanded='false'
                                    aria-controls='collapse-2'
                                  >
                                    Datos Del Solicitante y/o Funeraria
                                  </a>
                                </h5>
                              </div>
                              <div id='collapse-5' className='collapse' data-parent='#accordion' aria-labelledby='heading-2'>
                                <div className='fadeInRight d-block'>
                                  <DatoSolicitanteAdd prop={getData} form={form} obj={obj} modificacion={false} />
                                  <CementerioInfoFormSeccion obj={obj} form={form}
                                    tipoLicencia={(cambioacremacion || actualizacioncremacion) ? 'Cremación' : 'Inhumación'}
                                    modificacion={false} />

                                </div>
                              </div>
                            </div>
                          </div>

                          <div id='accordion' className='mt-3'>
                            <div className='card'>
                              <div className='card-header' id='heading-2'>
                                <h5 className='mb-0'>
                                  <a
                                    className='collapsed'
                                    role='button'
                                    data-toggle='collapse'
                                    href='#collapse-6'
                                    aria-expanded='false'
                                    aria-controls='collapse-2'
                                  >
                                    Documentos Soporte
                                  </a>
                                </h5>
                              </div>
                              <div id='collapse-6' className='collapse' data-parent='#accordion' aria-labelledby='heading-2'>
                                <div className='fadeInRight d-block'>

                                  <InformacionDocumentosGestion prop={getDataDocumentos} obj={obj} id={cambioacremacion ? 'Cremación'
                                    : (cambioainhumacion ? 'Inhumación' : 'No Aplica')} escambio={(cambioacremacion || cambioainhumacion) ? 'cambio' : 'actualizacion'}
                                    instType={insttype} reconocido={longitudreconocido !== -1} tramite={'individual'} />

                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='row mt-2 prueba'>
                            <div className='col-lg-12 col-sm-12 col-md-12' style={{ marginLeft: '-10px' }}>
                              <label htmlFor=''>Observaciones</label>
                              <Form.Item label='' name='observations' rules={[{ required: true }]}>
                                <Input.TextArea rows={5} maxLength={500} style={{ width: '360px' }} className='textarea' />
                              </Form.Item>
                            </div>
                          </div>


                          <Actions />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
};
interface modificarcementerios {
  prop: any;
}
export const KeysForm = ['statustramite', 'observations'];
//comentario para actualizar
//comentario etra
//comentario extra extra
