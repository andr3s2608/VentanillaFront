import { useCallback, useEffect, useState } from 'react';

// Antd

import Form from 'antd/es/form';

import Swal from 'sweetalert2';
import Steps from 'antd/es/steps';
import Radio, { RadioChangeEvent } from 'antd/es/radio';

import { Button, Modal } from 'antd';
import Table from 'antd/es/table';
import Divider from 'antd/es/divider';
import moment from 'moment';
// Componentes
import { SelectComponent } from 'app/shared/components/inputs/select.component';

// Hooks
import { useStepperForm } from 'app/shared/hooks/stepper.hook';

// Utilidades
import { layoutItems, layoutWrapper } from 'app/shared/utils/form-layout.util';
import { ITipoLicencia } from 'app/shared/utils/types.util';

// Secciones del formulario
import { InformacionFallecidoSeccion, KeysForm as KeyFormInformacionDefuncion } from './seccions/Informacion-Fallecido.seccion';
import { InformacionInstitucionCertificaFallecimientoseccion } from './seccions/Informacion-InstitucionCertificaFallecimiento.seccion';
import { InformacionSolicitanteSeccion } from './seccions/Datos-solicitante.seccion';
import { InformacionMedicoCertificante } from './seccions/medico-certificante.seccion';
import { InformacionDocumentosGestion } from './seccions/documentos-gestion.seccion';
import { GestionTramite } from './seccions/gestion-tramite.seccion';

// Servicios

import '../../../../../../css/estilos.css';
//redux
import { store } from 'app/redux/app.reducers';
import { SetResetViewLicence } from 'app/redux/controlViewLicence/controlViewLicence.action';

import { IGestionTramite } from 'app/inhumacioncremacion/Models/IGestion';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { ApiService } from 'app/services/Apis.service';

import { useHistory } from 'react-router';
import { EditInhumacion } from './edit/Inhumacion';
import { EditFetal } from './edit/fetal';

import 'app/shared/components/table/estilos.css';
import { EyeOutlined } from '@ant-design/icons';
import '../../../../../.././scss/antd/index.css';
import '../../../../../../css/estilos.css';
import { AutorizadorCremacion } from './seccions/AutorizadorCremacion';
export const ValidationForm: React.FC<ITipoLicencia> = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisiblePdf, setIsModalVisiblePdf] = useState(false);
  const [isModalValidarCertificado, setIsModalValidarCertificado] = useState<boolean>(false);
  const [isvalidcertificado, setisvalidcertificado] = useState<boolean>(false);
  const [isDisabledElement, setIsDisabledElement] = useState<boolean>(false);

  const [urlPdfLicence, setUrlPdfLicence] = useState<any>('');
  const [viewLicenceState, setViewLicenceState] = useState<any>();
  const { Step } = Steps;
  const [dataTable, setDataTable] = useState<[]>();
  const [solicitante, setsolicitante] = useState<[]>();
  const history = useHistory();
  const [valor, setvalor] = useState<string>('');
  const [cambiar, setcambio] = useState<string>('');
  const [idcontrol, setidcontrol] = useState<string>('');
  const [isnull, setisnull] = useState<boolean>(false);
  const [gestionada, setgestionada] = useState<boolean>(false);
  const [gestionada2, setgestionada2] = useState<boolean>(false);
  const [apellido, setapellido] = useState<string | undefined>();
  const [fecha, setfecha] = useState<string | undefined>();
  const [estado, setestado] = useState<string>('');
  const { tipoLicencia, tramite } = props;
  const [form] = Form.useForm<any>();
  const { setStatus } = useStepperForm<any>(form);
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [objJosn, setobjJosn] = useState<any>(EditInhumacion('1'));
  const [DatosDocumento, setDatosDocumento] = useState<[String, String, String, String, String, String, String, String]>([
    '1',
    '1',
    '1',
    '1',
    '1',
    '1',
    '1',
    '1'
  ]);

  const [supports, setSupports] = useState<any[]>([]);
  const [type, setType] = useState<any[]>([]);
  //create o edit
  const valid: any = EditInhumacion('1');

  const idUsuario = api.getIdUsuario();

  //form.setFieldsValue(objJosn?);
  //#region Listados

  const formatDate = 'MM-DD-YYYY';

  store.subscribe(() => {
    const { viewLicence } = store.getState();
    setViewLicenceState(viewLicence);
  });

  const getListas = useCallback(
    async () => {

      if (valid != undefined) {
        if (
          valid.idTramite == 'ad5ea0cb-1fa2-4933-a175-e93f2f8c0060' ||
          valid.idTramite == 'f4c4f874-1322-48ec-b8a8-3b0cac6fca8e'
        ) {
          setobjJosn(EditFetal());
        }
      } else {
        setisnull(true);
      }
      if (objJosn != undefined) {
        const support = await api.getSupportDocuments(objJosn?.idSolicitud);
        const typeList = await api.GetAllTypeValidation();
        setSupports(support);

        if (isvalidcertificado) {
          const filtrado = type.filter(function (f: { id: string }) {
            return f.id != '3cd0ed61-f26b-4cc0-9015-5b497673d275';
          });
          setType(filtrado);
        } else {
          setType(typeList);
        }

        const all = await api.getCertificado(objJosn?.certificado);

        if (!all) {

          setIsModalValidarCertificado(true);
          setisvalidcertificado(true);
        }

        const data = await api.getLicencia(objJosn?.idSolicitud);


        if (data[0].estadoSolicitud === 'fdcea488-2ea7-4485-b706-a2b96a86ffdf' || data[0].estadoSolicitud === '31a45854-bf40-44b6-2645-08da64f23b8e') {

          setgestionada2(true);

        } else {
          setgestionada(true);
        }

        var idcontrolinterno = '';
        var valorinterno = '';
        idcontrolinterno = objJosn.idControlTramite;
        const tipotramite: string = objJosn.idTramite;
        switch (tipotramite) {
          case 'a289c362-e576-4962-962b-1c208afa0273':
            valorinterno = 'Inhumación Individual';
            setcambio('Cambiar tipo de licencia a Cremación Individual');

            break;
          case 'ad5ea0cb-1fa2-4933-a175-e93f2f8c0060':
            //inhumacion fetal
            valorinterno = 'Inhumación Fetal';

            break;
          case 'e69bda86-2572-45db-90dc-b40be14fe020':
            //cremacion individual
            valorinterno = 'Cremación Individual';
            setcambio('Cambiar tipo de licencia a Inhumación Individual');

            break;
          case 'f4c4f874-1322-48ec-b8a8-3b0cac6fca8e':
            //cremacionfetal
            valorinterno = 'Cremación Fetal ';

            break;
        }
        setvalor(valorinterno);
        setidcontrol(idcontrolinterno);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    store.dispatch(SetResetViewLicence());
  }, []);

  //#endregion

  const arrayinhind: any = [
    '19A11490-261C-4114-9152-23C2B991CB36',
    '9C4E62A4-EE76-4BA1-8DBE-8BE172E23788',
    '79320AF6-943C-43BF-87D1-847B625F6203',
    'ABE33C1D-9370-4189-9E81-597E5B643481'
  ];
  const arrayinhfet: any = [
    '19A11490-261C-4114-9152-23C2B991CB36',
    'D2D3ABA7-3B92-446A-AA8C-80A75DE246A7',
    '79320AF6-943C-43BF-87D1-847B625F6203',
    'ABE33C1D-9370-4189-9E81-597E5B643481'
  ];
  const arraycremind: any = [
    '19A11490-261C-4114-9152-23C2B991CB36',
    '9C4E62A4-EE76-4BA1-8DBE-8BE172E23788',
    '79320AF6-943C-43BF-87D1-847B625F6203',
    'F67F1C4E-A6A5-4257-A995-17A926801F7C',
    'D6524742-E32D-4548-AB21-7A9CBB367926',
    'C659A063-E8A3-4F23-9A61-575AFB1E1C2B',
    '1266F06C-0BC1-4CF8-BA51-5E889D5E8178',
    'ABE33C1D-9370-4189-9E81-597E5B643481'
  ];
  const arraycremfet: any = [
    '19A11490-261C-4114-9152-23C2B991CB36',
    'D2D3ABA7-3B92-446A-AA8C-80A75DE246A7',
    '79320AF6-943C-43BF-87D1-847B625F6203',
    'F67F1C4E-A6A5-4257-A995-17A926801F7C',
    'D6524742-E32D-4548-AB21-7A9CBB367926',
    'C659A063-E8A3-4F23-9A61-575AFB1E1C2B',
    '1266F06C-0BC1-4CF8-BA51-5E889D5E8178',
    'ABE33C1D-9370-4189-9E81-597E5B643481'
  ];

  const getArray = async (values: any) => {
    const resp = values;

    switch (objJosn.idTramite) {
      case 'a289c362-e576-4962-962b-1c208afa0273':
        /*El contenedor es de inhumacion indivual */

        var array: any = [];

        for (let index = 0; index < arrayinhind.length; index++) {
          const documento: string = arrayinhind[index];

          for (let indexinterno = 0; indexinterno < resp.length; indexinterno++) {
            const bd: string = await resp[indexinterno].idTipoDocumentoSoporte;
            if (bd.toUpperCase() == documento) {
              array.push(resp[indexinterno]);
              break;
            }
          }
        }

        return array;

      case 'ad5ea0cb-1fa2-4933-a175-e93f2f8c0060':
        /*El contenedor es de inhumacion fetal */

        var array: any = [];

        for (let index = 0; index < arrayinhfet.length; index++) {
          const documento: string = arrayinhfet[index];

          for (let indexinterno = 0; indexinterno < resp.length; indexinterno++) {
            const bd: string = await resp[indexinterno].idTipoDocumentoSoporte;
            if (bd.toUpperCase() == documento) {
              array.push(resp[indexinterno]);
              break;
            }
          }
        }

        return array;

      case 'e69bda86-2572-45db-90dc-b40be14fe020':
        /*El contenedor es de cremacion individual */

        var array: any = [];

        for (let index = 0; index < arraycremind.length; index++) {
          const documento: string = arraycremind[index];

          for (let indexinterno = 0; indexinterno < resp.length; indexinterno++) {
            const bd: string = await resp[indexinterno].idTipoDocumentoSoporte;
            if (bd.toUpperCase() == documento) {
              array.push(resp[indexinterno]);
              break;
            }
          }
        }
        return array;

      case 'f4c4f874-1322-48ec-b8a8-3b0cac6fca8e':
        /*El contenedor es de cremacionfetal */

        var array: any = [];

        for (let index = 0; index < arraycremfet.length; index++) {
          const documento: string = arraycremfet[index];

          for (let indexinterno = 0; indexinterno < resp.length; indexinterno++) {
            const bd: string = await resp[indexinterno].idTipoDocumentoSoporte;
            if (bd.toUpperCase() == documento) {
              array.push(resp[indexinterno]);
              break;
            }
          }
        }

        return array;
    }
  };

  function getDescripcionTramite(idTramite: string): string {
    let idInhumacionIndividual = 'A289C362-E576-4962-962B-1C208AFA0273';
    let idInhumacionFetal = 'AD5EA0CB-1FA2-4933-A175-E93F2F8C0060';
    let idCremacionIndividual = 'E69BDA86-2572-45DB-90DC-B40BE14FE020';
    let idCremacionFetal = 'F4C4F874-1322-48EC-B8A8-3B0CAC6FCA8E';
    switch (idTramite) {
      case idInhumacionIndividual:
        return 'Inhumación Individual';
      case idInhumacionFetal:
        return 'Inhumación fetal';
      case idCremacionIndividual:
        return 'Cremación Individual';
      case idCremacionFetal:
        return 'Cremación fetal';
      default:
        return '';
    }
  }

  const onSubmit = async (values: any) => {
    let bandera = await api.validarFirmaFuncionario(idUsuario);

    if (bandera) {
      setStatus(undefined);
      const idPersonaVentanilla = localStorage.getItem(accountIdentifier);
      const formatDate = 'MM-DD-YYYY';
      const estadoSolicitud = 'fdcea488-2ea7-4485-b706-a2b96a86ffdf'; //estado?.estadoSolicitud;

      let resp = await api.getSupportDocuments(objJosn?.idSolicitud);
      var documentos: any = [];
      switch (objJosn.idTramite) {
        case 'a289c362-e576-4962-962b-1c208afa0273':
          /*El contenedor es de inhumacion indivual */

          for (let index = 0; index < arrayinhind.length; index++) {
            const documento: string = arrayinhind[index];

            for (let indexinterno = 0; indexinterno < resp.length; indexinterno++) {
              const bd: string = await resp[indexinterno].idTipoDocumentoSoporte;
              if (bd.toUpperCase() == documento) {
                documentos.push(resp[indexinterno]);
                break;
              }
            }
          }

          break;

        case 'ad5ea0cb-1fa2-4933-a175-e93f2f8c0060':
          /*El contenedor es de inhumacion fetal */

          for (let index = 0; index < arrayinhfet.length; index++) {
            const documento: string = arrayinhfet[index];

            for (let indexinterno = 0; indexinterno < resp.length; indexinterno++) {
              const bd: string = await resp[indexinterno].idTipoDocumentoSoporte;
              if (bd.toUpperCase() == documento) {
                documentos.push(resp[indexinterno]);
                break;
              }
            }
          }

          break;

        case 'e69bda86-2572-45db-90dc-b40be14fe020':
          /*El contenedor es de cremacion individual */

          for (let index = 0; index < arraycremind.length; index++) {
            const documento: string = arraycremind[index];

            for (let indexinterno = 0; indexinterno < resp.length; indexinterno++) {
              const bd: string = await resp[indexinterno].idTipoDocumentoSoporte;
              if (bd.toUpperCase() == documento) {
                documentos.push(resp[indexinterno]);
                break;
              }
            }
          }
          break;

        case 'f4c4f874-1322-48ec-b8a8-3b0cac6fca8e':
          /*El contenedor es de cremacionfetal */

          for (let index = 0; index < arraycremfet.length; index++) {
            const documento: string = arraycremfet[index];

            for (let indexinterno = 0; indexinterno < resp.length; indexinterno++) {
              const bd: string = await resp[indexinterno].idTipoDocumentoSoporte;
              if (bd.toUpperCase() == documento) {
                documentos.push(resp[indexinterno]);
                break;
              }
            }
          }

          break;
      }

      // let documentos = await api.getSupportDocuments(objJosn?.idSolicitud);

      var iddocumento: string = documentos.reduce((result: any, item: any) => {
        return `${result}${item.idDocumentoSoporte}|`;
      }, '');
      var pathdocumento: string = documentos.reduce((result: any, item: any) => {
        return `${result}${item.path}|`;
      }, '');

      var not = 1;

      const segui = values.validFunctionaltype;

      if (segui == '3cd0ed61-f26b-4cc0-9015-5b497673d275') {
        if (
          DatosDocumento.at(0) == '1' &&
          DatosDocumento.at(1) == '1' &&
          DatosDocumento.at(2) == '1' &&
          DatosDocumento.at(3) == '1' &&
          DatosDocumento.at(4) == '1' &&
          DatosDocumento.at(5) == '1' &&
          DatosDocumento.at(6) == '1' &&
          DatosDocumento.at(7) == '1'
        ) {
          not = 2;
        } else {
          alert('Todos los documentos deben de cumplir en caso de aprobacion');
          not = 0;
        }
      }
      if (segui == 'fe691637-be8a-425f-a309-e2032221553f') {
        if (
          DatosDocumento.at(0) == '2' ||
          DatosDocumento.at(1) == '2' ||
          DatosDocumento.at(2) == '2' ||
          DatosDocumento.at(3) == '2' ||
          DatosDocumento.at(4) == '2' ||
          DatosDocumento.at(5) == '2' ||
          DatosDocumento.at(6) == '2' ||
          DatosDocumento.at(7) == '2'
        ) {
        } else {
          alert('Debe indicar almenos un Documento que no Cumpla');
          not = 0;
        }
      }

      if (not >= 1) {
        /////////////////////////Guardar status//////////////////////////
        let aux = 0;
        for (let index = 0; index < documentos.length; index++) {
          //se saca la informacion de cada uno de los documentos para insertarlos por separado en la bd
          var posicioninicialid = 0;
          var posicionfinalid = iddocumento.indexOf('|');
          var id = iddocumento.substring(posicioninicialid, posicionfinalid);
          var iddocumento = iddocumento.substring(posicionfinalid + 1, iddocumento.length);

          var posicioninicialpath = 0;
          var posicionfinalpath = pathdocumento.indexOf('/');
          var nuevopath = pathdocumento.indexOf('|');
          var documento = pathdocumento.substring(posicioninicialpath, posicionfinalpath);
          var pathdocumento = pathdocumento.substring(nuevopath + 1, pathdocumento.length);

          var datos = DatosDocumento.at(index);

          if (datos == '1') {
            datos = 'Cumple';
          } else {
            datos = 'No Cumple';
          }

          const json: IGestionTramite<any> = {
            estado: {
              idSolicitud: objJosn?.idSolicitud,
              idDocumentoSoporte: id,
              Path: documento,
              Estado_Documento: datos,
              tipoSeguimiento: values.validFunctionaltype,
              Observaciones: values.observations
            }
          };

          const resp = await api.AddGestion(json, aux + '');
          aux = 1;
        }
        if (not == 2) {
          if (objJosn.numerolicencia == null) {
            const update = await api.updatelicencia(objJosn?.idSolicitud);
          }

        }
        /////////////////////////Enviar Notificacion//////////////////////////
        let tipoSeguimiento: string = values.validFunctionaltype;
        let solicitud = await api.GetSolicitud(objJosn?.idSolicitud);
        let resumenSolicitud = await api.GetResumenSolicitud(objJosn?.idSolicitud);
        let funeraria = await api.GetFunerariasAzure(objJosn?.idSolicitud);

        let fechaSolicitud: string = solicitud[0]['fechaSolicitud'];
        let idTramite = objJosn?.idTramite;
        let cementerio = solicitud[0]['datosCementerio']['cementerio'];
        let date = new Date();
        let emailSolicitante = resumenSolicitud[0]['correoSolicitante'];

        if (tipoSeguimiento.toLocaleUpperCase() == '3CD0ED61-F26B-4CC0-9015-5B497673D275') {
          //alert('aprobacion');

          const infouser: any = localStorage.getItem('infouser');
          const info: any = JSON.parse(infouser);

          const codigo = await api.ObtenerCodigoVerificacion(objJosn.idControlTramite + '');

          const licencia = await api.generarPDF(objJosn?.idSolicitud, idUsuario, info.fullName, codigo, true);

          let datosDinamicosAprobacion = [
            solicitud[0]['razonSocialSolicitante'],
            getDescripcionTramite(idTramite.toLocaleUpperCase()),
            objJosn.idControlTramite,
            fechaSolicitud.substring(0, 10),
            getDescripcionTramite(idTramite.toLocaleUpperCase())
          ];

          let emailCementerio = resumenSolicitud[0]['correoCementerio'];
          let datosDinamicosCementerio = [
            cementerio,
            resumenSolicitud[0]['numeroLicencia'],
            date.toLocaleDateString(),
            getDescripcionTramite(idTramite.toLocaleUpperCase()),
            getDescripcionTramite(idTramite.toLocaleUpperCase())
          ];

          let emailFuneraria = resumenSolicitud[0]['correoFuneraria'];
          let datosDinamicosFuneraria = [
            funeraria[0]['funeraria'],
            resumenSolicitud[0]['numeroLicencia'],
            date.toLocaleDateString(),
            getDescripcionTramite(idTramite.toLocaleUpperCase()),
            getDescripcionTramite(idTramite.toLocaleUpperCase())
          ];

          notificar(
            values.validFunctionaltype,
            datosDinamicosAprobacion,
            emailSolicitante,
            licencia,
            resumenSolicitud[0]['numeroLicencia']
          );
          notificarCementerio(datosDinamicosCementerio, emailCementerio, licencia, resumenSolicitud[0]['numeroLicencia']);
          notificarFuneraria(datosDinamicosFuneraria, emailFuneraria, licencia, resumenSolicitud[0]['numeroLicencia']);

          const urlToFile = async (url: string, filename: string, mimeType: any) => {
            const res = await fetch(url);
            const buf = await res.arrayBuffer();
            return new File([buf], filename, { type: mimeType });
          };

          (async () => {
            const file = await urlToFile('data:application/pdf;base64,' + licencia, 'licencia', 'application/pdf');

            const formData = new FormData();
            formData.append('file', file);
            formData.append(
              'nameFile',
              'LICENCIA_' + valor.replace(' ', '_').toLocaleUpperCase() + '_' + 'N°' + resumenSolicitud[0]['numeroLicencia']
            );

            let contenedor: string = 'contenedor';

            switch (valor) {
              case 'Inhumación Individual':
                contenedor = 'inhumacionindividual';
                break;
              case 'Inhumación Fetal':
                contenedor = 'inhumacionfetal';
                break;
              case 'Cremación Individual':
                contenedor = 'cremacionindividual';
                break;
              case 'Cremación Fetal ':
                contenedor = 'cremacionfetal';
                break;
            }

            formData.append('containerName', contenedor);
            formData.append('oid', solicitud[0]['idUsuarioSeguridad']);
            await api.uploadFiles(formData);
            //console.log(file);
          })();
        } else {
          let datosDinamicosGenericos = [
            solicitud[0]['razonSocialSolicitante'],
            getDescripcionTramite(idTramite.toLocaleUpperCase()),
            objJosn.idControlTramite,
            fechaSolicitud.substring(0, 10),
            values.observations
          ];

          notificar(values.validFunctionaltype, datosDinamicosGenericos, emailSolicitante, null, null);
        }
        Swal.fire({
          icon: 'success',
          title: 'Solicitud gestionada',
          text: 'La Solicitud ha sido gestionada exitosamente'
        });
        history.push('/tramites-servicios');
        store.dispatch(SetResetViewLicence());
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'FIRMA NO REGISTRADA',
        text:
          'Su firma no se encuentra registrada ' +
          'por favor comuníquese con la administración para el proceso de registro y vuelva a intentarlo mas tarde.'
      });
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  //Metodo que captura que documento marco el usuario como cumple o no cumple
  const getData = (rowData: string, valor: string) => {
    const array: any = [];

    for (let index = 0; index < DatosDocumento.length; index++) {
      if (index == parseInt(rowData)) {
        array.push(valor);
      } else {
        array.push(DatosDocumento.at(index));
      }
    }
    setDatosDocumento(array);
  };


  const onSubmitFailed = () => {
    setStatus('error');
    store.dispatch(SetResetViewLicence());
  };
  //#region Eventos formulario
  const getStatus = (estado: string) => {
    var opciones = '';
    switch (estado.toUpperCase()) {
      case '3CD0ED61-F26B-4CC0-9015-5B497673D275':
        opciones = 'Aprobado validador de documentos';
        //inhumacion indivual
        //history.push('/tramites-servicios/licencia/inhumacion-individual');
        break;
      case 'FDCEA488-2EA7-4485-B706-A2B96A86FFDF':
        opciones = 'Registro de Tramite Usuario Externo';
        //inhumacion fetal
        return 'Registro de Tramite Usuario Externo';
        //history.push('/tramites-servicios/licencia/inhumacion-fetal');
        break;
      case 'FA183116-BE8A-425F-A309-E2032221553F':
        //cremacion individual
        opciones = 'Negado validador de documentos';
        // history.push('/tramites-servicios/licencia/cremacion-individual');
        break;
      case 'FE691637-BE8A-425F-A309-E2032221553F':
        //cremacionfetal
        opciones = 'Documentos Inconsistentes';
        //history.push('/tramites-servicios/licencia/cremacion-fetal');
        break;
    }

    return opciones;
  };

  const onClickView = async (idSolicitud: string) => {
    const solicitante = await api.GetResumenSolicitud(idSolicitud);

    setsolicitante(solicitante[0]['nombreSolicitante']);
    setapellido(solicitante[0]['apellidoSolicitante']);
    setestado('En trámite');
    setfecha(objJosn.fechasol);

    setDataTable(solicitante);
    showModal();
  };

  const validar = async (idSolicitud: string) => {
    const all = await api.getLicencia(idSolicitud);

    const alldata = all.map((item: any) => {
      item.fechaRegistro = moment(item.fechaRegistro).format(formatDate);
      return item;
    });

    const stringInfo: string = alldata.reduce((result: any, item: any) => {
      return `${result}${item.persona[0].primerNombre}|${result}${item.persona[0].segundoNombre}`;
    }, '');
    return stringInfo;
  };

  const [isCremacion, setIsCremacion] = useState(false);
  useEffect(() => {
    setIsCremacion(tipoLicencia === 'Cremación');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipoLicencia]);

  const [hasCremacionAuth, setHasCremacionAuth] = useState(true);
  const onChangeCremacionAuth = (value: boolean) => {
    form.resetFields([
      'authIDType',
      'authName',
      'authSecondName',
      'authSurname',
      'authSecondSurname',
      'authParentesco',
      'authOtherParentesco'
    ]);
    setHasCremacionAuth(value);
  };

  const [isOtherParentesco, setIsOtherParentesco] = useState(false);

  const onChangeParentesco = (e: RadioChangeEvent) => {
    form.resetFields(['authOtherParentesco']);
    setIsOtherParentesco(e.target.value === 'Otro');
  };

  //edit
  const Actions = () => (
    <div className='container-fluid'>
      <div className='row'>
        <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
          <div className='d-flex justify-content-between'>
            <Button type='primary' htmlType='submit' disabled={isDisabledElement} className='align-self-start'>
              Guardar
            </Button>

            <Button
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
    </div >
  );

  //#endregion

  const Lista = [
    {
      title: 'Seleccione Licencia',
      describe: <SelectComponent options={type} optionPropkey='license' optionPropLabel='Licencia' />
    },
    {
      title: '',
      describe: <Button type='primary'>Consultar</Button>
    }
  ];

  const colorEstado = (estado: string) => {
    switch (estado) {
      case 'En Trámite':
        return (
          <p className={'estado'} style={{ color: 'green' }}>
            {estado}
          </p>
        );
      case 'Aprobado validador de documentos':
        return (
          <p className={'estado'} style={{ color: 'green' }}>
            {estado}
          </p>
        );
      case 'Registro de Tramite Usuario Externo':
        return (
          <p className={'estado'} style={{ color: 'green' }}>
            {estado}
          </p>
        );
        break;
      case 'Negado validador de documentos':
        return (
          <p className={'estado'} style={{ color: 'red' }}>
            {estado}
          </p>
        );
        break;
      case 'Documentos Inconsistentes':
        return (
          <p className={'estado'} style={{ color: 'red' }}>
            {estado}
          </p>
        );
        break;
    }
  };
  const columnFake = [
    {
      title: 'Nombres',
      dataIndex: 'nombreSolicitante',
      key: 'nombreSolicitante'
    },

    {
      title: 'Apellidos',
      dataIndex: 'apellidoSolicitante',
      key: 'apellidoSolicitante'
    },
    {
      title: 'Fecha de Solicitud',
      dataIndex: '',
      key: 'apellidoSolicitante',
      render: (Text: string) => (
        <Form.Item label='' name=''>
          <text>{fecha}</text>
        </Form.Item>
      )
    },
    {
      title: 'Estado',
      dataIndex: '',
      key: 'estadoNuevo',
      render: (estadon: string) => (
        <>
          <Form.Item label='' name=''>
            <text>{estado}</text>
          </Form.Item>{' '}
        </>
      )
    },

    {
      title: 'Observación',
      dataIndex: '',
      key: ''
    }
  ];

  function htmlInhumacionIndividual() {

    const fechaActual = new Date();

    function padTo2Digits(num: number) {
      return num.toString().padStart(2, '0');
    }

    function formatDate(fechaActual: Date) {
      return [
        padTo2Digits(fechaActual.getDate()),
        padTo2Digits(fechaActual.getMonth() + 1),
        fechaActual.getFullYear(),
      ].join('/');
    }

    function formatDateHours(fechaActual: Date) {
      return [
        padTo2Digits(fechaActual.getHours()),
        padTo2Digits(fechaActual.getMinutes()),
        padTo2Digits(fechaActual.getSeconds()),
      ].join(':');
    }



    const keys = [
      "~:~fecha_actual~:~", "~:~hora_actual~:~", "~:~numero_licencia~:~",
      "~:~numero_certificado_defuncion~:~", "~:~funeraria~:~", "~:~nombre_completo_solicitante~:~",
      "~:~nombre_completo_fallecido~:~", "~:~nacionalidad~:~", "~:~fecha_fallecido~:~",
      "~:~hora_fallecido~:~", "~:~sexo_fallecido~:~", "~:~tipo_identificacion_fallecido~:~",
      "~:~numero_identificacion_fallecido~:~", "~:~tipo_muerte~:~", "~:~edad_fallecido~:~",
      "~:~nombre_completo_medico1~:~", "~:~nombre_completo_medico2~:~", "~:~cementerio~:~", "~:~causa~:~", "~:~observacion_causa~:~",
      "~:~firma_aprobador~:~", "~:~nombre_completo_validador~:~", "~:~firma_validador~:~", "~:~codigo_verificacion~:~"];

    console.log(formatDate(fechaActual));
    console.log(formatDateHours(fechaActual));
    /*
    const values = [formatDate(fechaActual), formatDateHours(fechaActual), numeroLicencia,
    datoSolitud.NumeroCertificado, funeraria.Data[0].Funeraria.ToUpper(), datoSolitud.RazonSocialSolicitante.ToUpper(),
    nombreFallecido.ToUpper(), nacionalidad.Data.Descripcion.ToUpper(), datoSolitud.FechaDefuncion.ToString("dd--MM-yyyy"),
    datoSolitud.Hora, genero.Data.Descripcion.ToUpper(), tipoIdentificacion.Data.Descripcion.ToUpper(),
    datosPersonaFallecida.NumeroIdentificacion, tipoMuerte.Data.Descripcion.ToUpper(), Utilities.ConvertTypes.GetdifFechas(DateTime.Parse(datosPersonaFallecida.FechaNacimiento), datoSolitud.FechaDefuncion),
    nombreMedico1.ToUpper(), nombreMedico2.ToUpper(), nombreCementeio.ToUpper(), label, resumen.Data[0].ObservacionCausa,
      firmaAprobador, nombreValidador.ToUpper(), firmaValidador, codigo];

      */
  }

  const onPrevPDF = async () => {

    const tipotramite: string = objJosn.idTramite;

    //-----------------------------------------

    switch (tipotramite) {
      case 'a289c362-e576-4962-962b-1c208afa0273':
        //Inhumación Individual;
        htmlInhumacionIndividual();
        break;
      case 'ad5ea0cb-1fa2-4933-a175-e93f2f8c0060':
        //Inhumacion fetal
        break;
      case 'e69bda86-2572-45db-90dc-b40be14fe020':
        //Cremacion individual

        break;
      case 'f4c4f874-1322-48ec-b8a8-3b0cac6fca8e':
        //Cremacionfetal

        break;
      default:
        break;
    }

    //-----------------------------------------


    /*

    let bandera = await api.validarFirmaFuncionario(idUsuario);

    if (bandera) {
      const infouser: any = localStorage.getItem('infouser');
      const info: any = JSON.parse(infouser);
      const idSolicitud = objJosn?.idSolicitud;
      const all = await api.GetSolicitud(idSolicitud);
      let linkPdf = await api.generarPDF(idSolicitud, idUsuario, info.fullName, " ", false);
      const solicitante = await api.GetResumenSolicitud(idSolicitud);
      setsolicitante(solicitante[0]['nombreSolicitante']);
      setUrlPdfLicence("data:application/pdf;base64," + linkPdf);

      setIsModalVisiblePdf(true);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'FIRMA NO REGISTRADA',
        text:
          'Su firma no se encuentra registrada ' +
          'por favor comuníquese con la administración para el proceso de registro y vuelva a intentarlo mas tarde.'
      });
    }

    */
  };
  const onModalNofificacion = async () => {
    setIsModalValidarCertificado(false);
    setisvalidcertificado(true);
    const typeList = await api.GetAllTypeValidation();

    setType(typeList);

    //history.push('/tramites-servicios');
  };

  const separacion = '                      ';

  const onnull = () => {
    Swal.fire({
      icon: 'error',
      title: 'Esta intentando ingresar de una manera no valida',
      text: 'Esta intentando acceder a la pagina de una manera que no es permitida,porfavor intentelo correctamente'
    }).then((value) => {
      history.push('/tramites-servicios');
    });
  };
  const onvalidacion = () => {
    Swal.fire({
      icon: 'info',
      title: 'Esta intentando ingresar de una manera no valida',
      text: 'la solicitud a la cual desea acceder ya ha sido gestionada, por favor selecccione una nueva de la bandeja'
    }).then((value) => {
      history.push('/tramites-servicios');
    });
  };

  const ModificarLicencia = async () => {


    Swal.fire({
      title: `Cambio de tipo de Solicitud `,
      text: `Se realizara un cambio de tipo de Solicitud de ${valor} a ${valor == 'Inhumación Individual' ? 'Cremación Individual'
        : 'Inhumación Individual'} ,esta seguro de continuar?`,
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
        await api.ModificarEstadoSolicitudInh('5E98C640-D9FB-4177-8F0C-E44DDC72EBAB', objJosn.idSolicitud);
        Swal.fire({
          icon: 'success',
          title: 'Cambio de Licencia Exitoso',
          text: 'Se ha cambiado el tipo de licencia y le ha sido devuelta al usuario para que complete la informacion faltante'
        })
        history.push('/tramites-servicios');


        let inicial = "";
        let final = "";

        const keys = [
          "~:~tipo_inicial~:~",
          "~:~tipo_final~:~",
          "~:~numero_de_solicitud~:~"
        ];

        switch (valor) {
          case "Inhumación Individual":
            inicial = "Inhumación individual";
            final = "Cremación individual";
            break;

          case "Cremación Individual":
            inicial = "Cremación individual";
            final = "Inhumación individual";
            break;
        }

        const values = [
          inicial,
          final,
          idcontrol
        ];

        let plantilla = await api.getFormato("985D236C-25B5-4A08-BB7B-98D22761BF11");
        let body = agregarValoresDinamicos(plantilla.valor, keys, values);

        api.sendEmail({
          to: objJosn.correosolicitante,
          subject: plantilla.asuntoNotificacion,
          body: body
        });

      } else if (result.isDenied) {
      }
    });

  };

  /*

                          {cambiar != '' && (<>
                            <div className='contenedor' style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>

                              <Form.Item  >
                                <Button type='primary' className='ml-3 mt-1' onClick={ModificarLicencia} >
                                  {cambiar}
                                </Button>
                              </Form.Item>
                            </div>
                          </>)}
  */
  return (
    <>
      {isnull && onnull()}
      {!isnull && (
        <>
          <div className='container-fluid'>
            {gestionada == true && onvalidacion()}

            {gestionada2 && (
              <>
                <div className='card'>
                  <div className='card-body puente'>
                    <div className='row'>
                      <Form form={form} {...layoutItems} layout='horizontal' onFinish={onSubmit} onFinishFailed={onSubmitFailed}>
                        <div className='col-lg-12 col-sm-12 col-md-12 text-center'>
                          <Divider style={{ borderColor: '#7cb305', color: '#7cb305' }} dashed className='tipo'>
                            ID TRAMITE:{idcontrol}
                          </Divider>
                          <Divider style={{ borderColor: '#7cb305', color: '#7cb305' }} dashed className='tipo'>
                            TIPO DE SOLICITUD:{valor}
                          </Divider>

                        </div>
                        <div className='fadeInLeft'>
                          <InformacionFallecidoSeccion obj={objJosn} licencia={false} props={form}
                          />
                          {valor == 'Cremación Fetal ' || valor == 'Cremación Individual' ? (
                            <AutorizadorCremacion obj={objJosn} />
                          ) : null}
                          <hr />
                          {objJosn.instRazonSocial != 'Otros' ? (
                            <>
                              <InformacionInstitucionCertificaFallecimientoseccion obj={objJosn} />
                              <hr />
                            </>
                          ) : null}
                          <InformacionMedicoCertificante obj={objJosn} disabledField={isDisabledElement} />
                          <hr />
                          <InformacionSolicitanteSeccion obj={objJosn} />
                          <hr />
                          <GestionTramite
                            idSolicitud={objJosn?.idSolicitud}
                            idTramite={objJosn?.idTramite}
                            type={type}
                            valor={valor}
                            registrado={isvalidcertificado}
                          />
                          <hr />
                          <InformacionDocumentosGestion prop={getData} obj={objJosn} id={'No Aplica'} escambio={false} instType={'80d7f664-5bdd-48eb-8b2c-93c1bd648cc8'} />

                          <div className='fadeInLeft'>
                            <div className='container-fluid'>
                              <div className='col-lg-12'>
                                <Form.Item>
                                  <Button
                                    className='button_seguimiento'
                                    style={{ width: '50%' }}
                                    type='primary'
                                    onClick={() => onClickView(objJosn?.idSolicitud)}
                                    icon={<EyeOutlined width={100} />}
                                    size={'large'}
                                  >
                                    Seguimiento
                                  </Button>
                                </Form.Item>
                                <Form.Item>
                                  <Button
                                    className='button_previa'
                                    style={{ width: '50%', float: 'right', marginTop: '-63px', marginRight: '-100px' }}
                                    type='primary'
                                    onClick={() => onPrevPDF()}
                                    icon={<EyeOutlined width={100} />}
                                    size={'large'}
                                    disabled={viewLicenceState}
                                  >
                                    Vista previa licencia
                                  </Button>
                                </Form.Item>
                              </div>
                            </div>

                            <Modal
                              title={
                                <p className='text-center text-dark text-uppercase mb-0 titulo'>
                                  Ventana de seguimiento y auditoria
                                </p>
                              }
                              visible={isModalVisible}
                              onCancel={handleCancel}
                              width={1000}
                              okButtonProps={{ hidden: true }}
                              cancelText='Cerrar'
                            >
                              <Table
                                className='text-center table'
                                dataSource={dataTable}
                                columns={columnFake}
                                pagination={{ hideOnSinglePage: true }}
                              />
                            </Modal>

                            <Modal
                              title={
                                <p className='text-center text-dark text-uppercase mb-0 titulo modal-dialog-scrollable'>
                                  Visualización de la licencia
                                </p>
                              }
                              visible={isModalVisiblePdf}
                              onCancel={() => setIsModalVisiblePdf(false)}
                              width={1000}
                              okButtonProps={{ hidden: true }}
                              cancelText='Cerrar'
                            >
                              <div className='col-lg-12 text-center'>
                                <p>Nombre del Solicitante : {solicitante} </p>
                              </div>
                              <iframe src={urlPdfLicence} frameBorder='0' scrolling='auto' height='600vh' width='100%'></iframe>
                            </Modal>

                            <Modal
                              title={<p className='text-center'>Notificación</p>}
                              visible={isModalValidarCertificado}
                              width={500}
                              onCancel={onModalNofificacion}
                              onOk={onModalNofificacion}
                            >
                              <div className='conteiner-fluid'>
                                <div className='row'>
                                  <p className='text-center mt-4' style={{ color: 'red', fontSize: 15, margin: 25 }}>
                                    El Número de certificado no ha sido registrado en salud publica
                                  </p>
                                </div>
                                <div className='row justify-content-md-center'>
                                  <Button type='primary' style={{ width: 60 }} onClick={onModalNofificacion}>
                                    OK
                                  </Button>
                                </div>
                              </div>
                            </Modal>
                          </div>
                          <div>
                            <Actions />
                          </div>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );

  function agregarValoresDinamicos(HTML: string, llavesAReemplazar: string[], valoresDinamicos: string[]): string {
    let nuevoHTML = HTML;

    for (let index = 0; index < llavesAReemplazar.length; index++) {
      nuevoHTML = nuevoHTML.replace(llavesAReemplazar[index], valoresDinamicos[index]);
    }

    return nuevoHTML;
  }

  async function notificarCementerio(datosDinamicosCementerio: any, emailCementerio: string, licencia: any, numeroLicencia: any) {
    const { accountIdentifier } = authProvider.getAccount();
    const api = new ApiService(accountIdentifier);

    const llavesAReemplazarCementerio = [
      '~:~nombre~:~',
      '~:~número_de_licencia~:~',
      '~:~fecha_de_expedición~:~',
      '~:~tipo_de_trámite~:~',
      '~:~tipo_de_licencia~:~'
    ];

    const idPlantillaCementerio = '7ECC05F8-E5C0-4F8D-997B-2AE5A7E0059C';

    let plantillaCementerio = await api.getFormato(idPlantillaCementerio);
    let bodyCementerio = agregarValoresDinamicos(
      plantillaCementerio.valor,
      llavesAReemplazarCementerio,
      datosDinamicosCementerio
    );

    api.sendEmailAttachment({
      to: emailCementerio,
      subject: 'Notificación cementerio',
      body: bodyCementerio,
      attachment: licencia,
      AttachmentTitle: 'LICENCIA_' + valor.replace(' ', '_').toLocaleUpperCase() + '_' + 'N°' + numeroLicencia + '.pdf'
    });
  }

  async function notificarFuneraria(datosDinamicosFuneraria: any, emailFuneraria: string, licencia: any, numeroLicencia: any) {
    const { accountIdentifier } = authProvider.getAccount();
    const api = new ApiService(accountIdentifier);

    const llavesAReemplazarFuneraria = [
      '~:~nombre~:~',
      '~:~número_de_licencia~:~',
      '~:~fecha_de_expedición~:~',
      '~:~tipo_de_trámite~:~',
      '~:~tipo_de_licencia~:~'
    ];

    const idPlantillaFuneraria = '7ECC05F8-E5C0-4F8D-997B-2AE5A7E0059C';

    let plantillaFuneraria = await api.getFormato(idPlantillaFuneraria);
    let bodyFuneraria = agregarValoresDinamicos(plantillaFuneraria.valor, llavesAReemplazarFuneraria, datosDinamicosFuneraria);

    api.sendEmailAttachment({
      to: emailFuneraria,
      subject: 'Notificación funeraria',
      body: bodyFuneraria,
      attachment: licencia,
      AttachmentTitle: 'LICENCIA_' + valor.replace(' ', '_').toLocaleUpperCase() + '_' + 'N°' + numeroLicencia + '.pdf'
    });
  }

  async function notificar(
    tipoSeguimiento: string,
    datosDinamicos: any,
    emailSolicitante: string,
    licencia: any,
    numeroLicencia: any
  ) {
    const { accountIdentifier } = authProvider.getAccount();
    const api = new ApiService(accountIdentifier);

    const llavesAReemplazarGenericas = [
      '~:~ciudadano~:~',
      '~:~tipo_de_solicitud~:~',
      '~:~numero_de_tramite~:~',
      '~:~fecha_de_solicitud~:~',
      '~:~observación~:~'
    ];

    const llavesAReemplazarAprobacion = [
      '~:~ciudadano~:~',
      '~:~tipo_de_solicitud~:~',
      '~:~numero_de_tramite~:~',
      '~:~fecha_de_solicitud~:~',
      '~:~tipo_de_licencia~:~'
    ];

    const idPlantillaAnulacion = '903C641E-C65B-494B-AF79-B091C55217FC';
    const idPlantillaNegacion = 'C5D07C62-E2C3-46DE-9444-E3397DAAA357';
    const idPlantillaDocumentosInconsistentes = '77CA26E9-50E6-4823-8BB3-EB1EB29726EF';
    const idPlantillaAprobacion = '985D236C-25B5-4A08-BB7B-98D22761BF63';

    switch (tipoSeguimiento.toLocaleUpperCase()) {
      case 'C21F9037-8ADB-4353-BEAD-BDBBE0ADC2C9': //'Anulado validador de documentos'
        let plantillaAnulacion = await api.getFormato(idPlantillaAnulacion);
        let bodyAnulacion = agregarValoresDinamicos(plantillaAnulacion.valor, llavesAReemplazarGenericas, datosDinamicos);

        api.sendEmail({
          to: emailSolicitante,
          subject: plantillaAnulacion.asuntoNotificacion,
          body: bodyAnulacion
        });
        break;
      case 'FA183116-BE8A-425F-A309-E2032221553F': //'Negado validador de documentos'
        let plantillaNegacion = await api.getFormato(idPlantillaNegacion);
        let bodyNegacion = agregarValoresDinamicos(plantillaNegacion.valor, llavesAReemplazarGenericas, datosDinamicos);

        api.sendEmail({
          to: emailSolicitante,
          subject: plantillaNegacion.asuntoNotificacion,
          body: bodyNegacion
        });
        break;
      case 'FE691637-BE8A-425F-A309-E2032221553F': //'Documentos Inconsistentes'
        let plantillaDocumentosInconsistentes = await api.getFormato(idPlantillaDocumentosInconsistentes);
        let bodyDocumentosInconsistentes = agregarValoresDinamicos(
          plantillaDocumentosInconsistentes.valor,
          llavesAReemplazarGenericas,
          datosDinamicos
        );

        api.sendEmail({
          to: emailSolicitante,
          subject: plantillaDocumentosInconsistentes.asuntoNotificacion,
          body: bodyDocumentosInconsistentes
        });
        break;
      case '3CD0ED61-F26B-4CC0-9015-5B497673D275': //'Aprobado validador de documentos'
        let plantillaAprobacion = await api.getFormato(idPlantillaAprobacion);
        let bodyAprobacion = agregarValoresDinamicos(plantillaAprobacion.valor, llavesAReemplazarAprobacion, datosDinamicos);

        api.sendEmailAttachment({
          to: emailSolicitante,
          subject: plantillaAprobacion.asuntoNotificacion,
          body: bodyAprobacion,
          attachment: licencia,
          AttachmentTitle: 'LICENCIA_' + valor.replace(' ', '_').toLocaleUpperCase() + '_' + 'N°' + numeroLicencia + '.pdf'
        });
        break;
      default:
        break;
    }
  }
};
