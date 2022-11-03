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
import { CheckOutlined, UploadOutlined } from '@ant-design/icons';
import { Input, Radio, Switch, Table, Upload } from 'antd';
import moment from 'moment';
import { SelectComponent } from 'app/shared/components/inputs/select.component';

export const ModificarLicencia = ({ props }: any) => {
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [form] = Form.useForm<any>();

  const [licencia, setLicencia] = useState<boolean>(false);

  const [licenciaseleccionada, setLicenciaseleccionada] = useState<boolean>(false);
  const [nn, setnn] = useState<boolean>(false);
  const [valores, setvalores] = useState<string>('licencia');
  const [date, setDate] = useState<any>();

  const [fechafiltro, setfechafiltro] = useState<any>();

  const [datosUsuario, setdatosUsuario] = useState<any>([]);
  const [data, setdata] = useState<any>([]);

  //////////////7777
  const [longitudmaxima, setLongitudmaxima] = useState<number>(10);
  const [longitudminima, setLongitudminima] = useState<number>(5);
  const [tipocampo, setTipocampo] = useState<string>('[0-9]{4,10}');
  const [tipocampovalidacion, setTipocampovalidacion] = useState<any>(/[0-9]/);
  const [tipodocumento, setTipodocumento] = useState<string>('Cédula de Ciudadanía');
  const [sininformacion, setsininformacion] = useState<boolean>(false);

  const [campo, setCampo] = useState<string>('Numéricos');
  ///////////////
  const [l_tipos_documento, settipos] = useState<any>([]);
  const [l_tipo_muerte, settipomuerte] = useState<any>([]);

  const [obj, setobj] = useState<any>();


  const [[primerNombre, segundoNombre, primerApellido, segundoApellido], setnombres] = useState<[string, string, string, string]>(
    ['', '', '', '']
  );


  const [[tipoIdentificacion, numeroIdentificacion, cementerio, tipomuerte, codinstitucion, razoninstitucion, radicado],
    setcamposoracle] = useState<[string, string, string, string, string, string, string]>(
      ['', '', '', '', '', '', '']
    );
  const [certificado, setcertificado] = useState<any>();
  const [numerolicencia, setnumerolicencia] = useState<any>();


  const { setStatus } = useStepperForm<any>(form);

  const getListas = useCallback(async () => {

    const tipos: any = localStorage.getItem('tipoid');
    const tiposjson: any = JSON.parse(tipos);


    const tipomuerte: any = localStorage.getItem('tipomuerte');
    settipos(tiposjson);

    settipomuerte(JSON.parse(tipomuerte));

  }, []);

  useEffect(() => {
    getListas();
  }, []);

  const BuscarSolicitud = async () => {
    const numero: string = form.getFieldValue('numero');
    const solicitud = await api.getLicenciaOracle(numero, valores);

    if (solicitud == null) {
      Swal.fire({
        icon: 'error',

        title: 'Datos inválidos',
        text: 'No se encontró el número de ' + valores + ', por favor verifíquelo de nuevo'
      });
      setLicencia(false);
    } else {


      setdata(solicitud);
      setdatosUsuario(solicitud);
      form.resetFields(['name', 'secondName', 'surname', 'secondSurname', 'numerocert', 'IDType', 'deathType', 'IDNumber', 'cementerio'
        , 'razoninst', 'codinst', 'radicado', 'numerolic', 'date']);
      setLicenciaseleccionada(false);
      setLicencia(true)


    }
  };

  const onClickValidarInformacion = async (solicitud: any) => {
    setLicencia(false);

    setobj(solicitud);
    setcertificado(solicitud.NUM_CERTIFICADO_DEFUNCION);
    setnumerolicencia(solicitud.INH_NUM_LICENCIA);
    const fecha = solicitud.INH_FEC_LICENCIA;

    setDate(moment(fecha));

    setnombres([
      solicitud.PRIMER_NOMBRE ?? '',
      solicitud.SEGUNDO_NOMBRE ?? '',
      solicitud.PRIMER_APELLIDO ?? '',
      solicitud.SEGUNDO_APELLIDO ?? ''
    ])

    let tipoid = '';
    switch (solicitud.TIPO_IDENT) {
      case 'CD' || 'Carné Diplomático':
        tipoid = '97f5657d-d8ec-48ef-bbe3-1babefecb1a4'
        setLongitudminima(10);
        setLongitudmaxima(11);
        setTipocampo('[a-zA-Z0-9]{10,11}');
        setTipocampovalidacion(/[a-zA-Z0-9]/);
        setCampo('AlfaNuméricos(Numéros y letras)');
        setTipodocumento('Registro Civil de Nacimiento , Numero único de identificacíon personal y Carné Diplomatico');
        break;
      case 'CC' || 'Cédula de Ciudadanía':
        tipoid = '7c96a4d3-a0cb-484e-a01b-93bc39c2552e'
        setLongitudminima(4);
        setLongitudmaxima(10);
        setTipocampo('[0-9]{4,10}');
        setTipocampovalidacion(/[0-9]/);
        setCampo('Numéricos');
        setTipodocumento('Cédula de Ciudadanía');
        break;

      case 'CE' || 'Cédula de extranjería':
        setLongitudminima(6);
        setLongitudmaxima(10);
        setTipocampo('[a-zA-Z0-9]{6,10}');
        setTipocampovalidacion(/[a-zA-Z0-9]/);
        setCampo('AlfaNuméricos(Numéros y letras)');
        setTipodocumento('Pasaporte , Cédula de Extranjería y  Tarjeta de Extranjería ');
        break;
      case 'CN' || 'Certificado de Nacido Vivo':
        tipoid = '0d69523b-4676-4e3d-8a3d-c6800a3acf3e'
        setLongitudminima(6);
        setLongitudmaxima(16);
        setTipocampo('[0-9]{6,16}');
        setTipocampovalidacion(/[0-9]/);
        setCampo('Numéricos');
        setTipodocumento('Certificado de nacido vivo ');
        break;

      case 'DE' || 'Documento Extranjero':
        tipoid = '60518653-70b7-42ab-8622-caa27b496184'
        setLongitudminima(7);
        setLongitudmaxima(16);
        setTipocampo('[a-zA-Z0-9]{7,16}');
        setTipocampovalidacion(/[a-zA-Z0-9]/);
        setCampo('AlfaNumérico(Numéros y letras)');
        setTipodocumento('Documento Extranjero');
        break;

      case 'NP' || 'Número de Protocolo':
        tipoid = '7c96a4d3-a0cb-484e-a01b-93bc39c7902e'
        setLongitudminima(2);
        setLongitudmaxima(10);
        setTipocampo('[0-9]{2,10}');
        setTipocampovalidacion(/[0-9]/);
        setCampo('Numéricos');
        setTipodocumento('Número de Protocolo');
        form.setFieldsValue({ IDNumber: '8001508610' });
        break;
      case 'NUIP' || 'Numero único de identificacíon personal':
        tipoid = 'ffe88939-06d5-486c-887c-e52d50b7f35d'
        setLongitudminima(10);
        setLongitudmaxima(11);
        setTipocampo('[a-zA-Z0-9]{10,11}');
        setTipocampovalidacion(/[a-zA-Z0-9]/);
        setCampo('AlfaNuméricos(Numéros y letras)');
        setTipodocumento('Registro Civil de Nacimiento , Numero único de identificacíon personal y Carné Diplomatico');
        break;

      case 'PA' || 'Pasaporte':
        tipoid = 'f1b570ee-f628-4438-a47f-6d7bff1f06d7'
        setLongitudminima(6);
        setLongitudmaxima(10);
        setTipocampo('[a-zA-Z0-9]{6,10}');
        setTipocampovalidacion(/[a-zA-Z0-9]/);
        setCampo('AlfaNuméricos(Numéros y letras)');
        setTipodocumento('Pasaporte , Cédula de Extranjería y  Tarjeta de Extranjería ');
        break;

      case 'PEP' || 'Permiso Especial de Permanencia':
        tipoid = '2491bc4b-8a60-408f-9fd1-136213f1e4fb'
        setLongitudminima(15);
        setLongitudmaxima(15);
        setTipocampo('[0-9]{15,15}');
        setTipocampovalidacion(/[0-9]/);
        setCampo('Numéricos');
        setTipodocumento('Permiso Especial de Permanencia');
        break;

      case 'RC' || 'Registro Civil de Nacimiento':
        tipoid = '71f659be-9d6b-4169-9ee2-e70bf0d65f92'
        setLongitudminima(10);
        setLongitudmaxima(11);
        setTipocampo('[a-zA-Z0-9]{10,11}');
        setTipocampovalidacion(/[a-zA-Z0-9]/);
        setCampo('AlfaNuméricos(Numéros y letras)');
        setTipodocumento('Registro Civil de Nacimiento , Numero único de identificacíon personal y Carné Diplomatico');
        break;

      case 'SC' || 'Salvoconducto':
        tipoid = 'c532c358-56ae-4f93-8b9b-344ddf1256b7'
        setLongitudminima(9);
        setLongitudmaxima(9);
        setTipocampo('[a-zA-Z0-9]{9,9}');
        setTipocampovalidacion(/[a-zA-Z0-9]/);
        setCampo('AlfaNumérico(Numéros y letras)');
        setTipodocumento('Salvoconducto');

        break;

      case 'TE' || 'Tarjeta de Extranjería':
        tipoid = '0676c046-d93a-4551-a37e-72e3a653bd1b'
        setLongitudminima(6);
        setLongitudmaxima(10);
        setTipocampo('[a-zA-Z0-9]{6,10}');
        setTipocampovalidacion(/[a-zA-Z0-9]/);
        setCampo('AlfaNuméricos(Numéros y letras)');
        setTipodocumento('Pasaporte , Cédula de Extranjería y  Tarjeta de Extranjería ');
        break;


      case 'TI' || 'Tarjeta de Identidad':
        tipoid = 'ac3629d8-5c87-46ce-a8e2-530b0495cbf6'
        setLongitudminima(10);
        setLongitudmaxima(11);
        setTipocampo('[0-9]{10,11}');
        setTipocampovalidacion(/[0-9]/);
        setCampo('Numéricos');
        setTipodocumento('Tarjeta de Identidad ');

        break;

      case 'AS' || 'Adulto Sin Identificar':
        tipoid = '6ae7e477-2de5-4149-8c93-12aca6668ff0'
        setLongitudminima(5);
        setLongitudmaxima(11);
        setTipocampo('[a-zA-Z0-9]{5,11}');
        setTipocampovalidacion(/[a-zA-Z0-9]/);
        setCampo('AlfaNumérico(Numéros y letras)');
        setTipodocumento('Adulto Sin Identificar');
        setTipodocumento('Adulto Sin Identificar');
        break;

      case 'MS' || 'Menor Sin Identificar':
        tipoid = '5fa5bf3f-b342-4596-933f-0956ae4b9109'
        setLongitudminima(5);
        setLongitudmaxima(12);
        setTipocampo('[a-zA-Z0-9]{5,12}');
        setTipocampovalidacion(/[a-zA-Z0-9]/);
        setCampo('AlfaNumérico(Numéros y letras)');
        setTipodocumento('Menor Sin Identificar');

        break;

      case 'PEP' || 'Permiso de Protección Temporal':
        tipoid = 'e927b566-7b8e-4b4d-ae26-14454705cb5e'
        setLongitudminima(4);
        setLongitudmaxima(18);
        setTipocampo('[a-zA-Z0-9]{4,18}');
        setTipocampovalidacion(/[a-zA-Z0-9]/);
        setCampo('AlfaNumérico(Numéros y letras)');
        setTipodocumento('Permiso de Protección Temporal');
        break;

      case 'SI' || 'Sin identificación':
        tipoid = 'c087d833-3cfb-460f-aa78-e5cf2fe83f25'
        setLongitudminima(5);
        setLongitudmaxima(15);
        setTipocampo('[a-zA-Z0-9]{5,15}');
        setTipocampovalidacion(/[a-zA-Z0-9]/);
        setTipodocumento('Sin Identificación');
        setCampo('AlfaNuméricos(Numéros y letras)');
        break;

    }

    let tipom = '';
    switch (solicitud.TIPO_MUERTE) {
      case 'N' || 'Natural':
        tipom = '475c280d-67af-47b0-a8bc-de420f6ac740'
        break;

      case 'V' || 'Violenta':
        tipom = '253eaa61-81be-4bc0-9003-2eb1c9e37606'
        break;

      case 'EE' || 'En estudio':
        tipom = '3df924db-7307-4be1-9fe8-1cce8cfb9584'
        break;
      default:
        break;
    }

    setcamposoracle([
      tipoid,
      solicitud.NROIDENT,
      solicitud.CEMENTERIO,
      tipom,
      solicitud.COD_INST,
      solicitud.RAZON_INST,
      solicitud.RADICADO
    ])
    form.resetFields(['name', 'secondName', 'surname', 'secondSurname', 'numerocert', 'IDType', 'deathType', 'IDNumber', 'cementerio'
      , 'razoninst', 'codinst', 'radicado', 'numerolic', 'date']);
    setLicenciaseleccionada(true);
  };





  const changeRadioButton = (values: any) => {
    setvalores(values.target.value);
  };

  const onSubmit = async (values: any) => {
    let bandera = false;
    let continuar = false;

    if (values.numerocert == obj.NUM_CERTIFICADO_DEFUNCION) {
      bandera = true;
    } else {
      const busquedacertificado = await api.ComprobarCertificado(values.numerocert + '');
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
          continuar = true

        } else if (result.isDenied) {
        }
      });
    }
    else {
      continuar = true;
    }

    if (continuar) {

      obj.NUM_CERTIFICADO_DEFUNCION = values.numerocert;
      obj.PRIMER_NOMBRE = values.name;
      obj.SEGUNDO_NOMBRE = values.secondName;
      obj.PRIMER_APELLIDO = values.surname;
      obj.SEGUNDO_APELLIDO = values.secondSurname;



      let tipoid = '';
      switch (values.IDType) {
        case '97f5657d-d8ec-48ef-bbe3-1babefecb1a4' || 'Carné Diplomático':
          tipoid = 'CD'
          break;
        case '7c96a4d3-a0cb-484e-a01b-93bc39c2552e' || 'Cédula de Ciudadanía':
          tipoid = 'CC'
          break;

        case 'a4ee4462-f837-4dff-a800-5495c33ac3ce' || 'Cédula de extranjería':
          tipoid = 'CE'
          break;
        case '0d69523b-4676-4e3d-8a3d-c6800a3acf3e' || 'Certificado de Nacido Vivo':
          tipoid = 'CN'
          break;

        case '60518653-70b7-42ab-8622-caa27b496184' || 'Documento Extranjero':
          tipoid = 'DE'
          break;

        case '7c96a4d3-a0cb-484e-a01b-93bc39c7902e' || 'Número de Protocolo':
          tipoid = 'NP'
          break;
        case 'ffe88939-06d5-486c-887c-e52d50b7f35d' || 'Numero único de identificacíon personal':
          tipoid = 'NUIP'
          break;

        case 'f1b570ee-f628-4438-a47f-6d7bff1f06d7' || 'Pasaporte':
          tipoid = 'PA'
          break;

        case '2491bc4b-8a60-408f-9fd1-136213f1e4fb' || 'Permiso Especial de Permanencia':
          tipoid = 'PEP'
          break;

        case '71f659be-9d6b-4169-9ee2-e70bf0d65f92' || 'Registro Civil de Nacimiento':
          tipoid = 'RC'
          break;

        case 'c532c358-56ae-4f93-8b9b-344ddf1256b7' || 'Salvoconducto':
          tipoid = 'SC'
          break;

        case '0676c046-d93a-4551-a37e-72e3a653bd1b' || 'Tarjeta de Extranjería':
          tipoid = 'TE'
          break;


        case 'ac3629d8-5c87-46ce-a8e2-530b0495cbf6' || 'Tarjeta de Identidad':
          tipoid = 'TI'
          break;

        case '6ae7e477-2de5-4149-8c93-12aca6668ff0' || 'Adulto Sin Identificar':
          tipoid = 'AS'
          break;

        case '5fa5bf3f-b342-4596-933f-0956ae4b9109' || 'Menor Sin Identificar':
          tipoid = 'MS'
          break;

        case 'e927b566-7b8e-4b4d-ae26-14454705cb5e' || 'Permiso de Protección Temporal':
          tipoid = 'PEP'
          break;

        case 'c087d833-3cfb-460f-aa78-e5cf2fe83f25' || 'Sin identificación':
          tipoid = 'SI'
          break;

      }

      let tipom = '';
      switch (values.deathType) {
        case '475c280d-67af-47b0-a8bc-de420f6ac740' || 'Natural':
          tipom = 'N'
          break;

        case '253eaa61-81be-4bc0-9003-2eb1c9e37606' || 'Violenta':
          tipom = 'V'
          break;

        case '3df924db-7307-4be1-9fe8-1cce8cfb9584' || 'En estudio':
          tipom = 'EE'
          break;
        default:
          break;
      }

      obj.TIPO_MUERTE = tipom;
      obj.TIPO_IDENT = tipoid;
      obj.NROIDENT = values.IDNumber;
      obj.CEMENTERIO = values.cementerio;
      obj.COD_INST = values.codinst;
      obj.RAZON_INST = values.razoninst;
      obj.RADICADO = values.radicado;



      await api.putLicenciaOracle(obj)

      //    await api.putLicencia();

      if (nn) {
        let container = '';
        switch (obj.FETAL_Y_NO_FETAL) {
          case 'a289c362-e576-4962-962b-1c208afa0273':
            container = 'inhumacionindividual';

            break;
          case 'ad5ea0cb-1fa2-4933-a175-e93f2f8c0060':
            //inhumacion fetal
            container = 'inhumacionfetal';

            break;
          case 'e69bda86-2572-45db-90dc-b40be14fe020':
            //cremacion individual
            container = 'cremacionindividual';

            break;
          case 'f4c4f874-1322-48ec-b8a8-3b0cac6fca8e':
            //cremacionfetal
            container = 'cremacionfetal';

            break;
        }
        const support = await api.getSupportDocuments(obj.idSolicitud);

        const [doc] = support.filter((p: any) => p.path.includes('Otros_Documentos'));

        const supportDocumentsEdit: any[] = [];
        const formData = new FormData();

        const archivo = values.fileOtrosDocumentos.file;

        formData.append('file', archivo);
        formData.append('nameFile', 'Otros_Documentos' + '_' + obj.idSolicitud);

        supportDocumentsEdit.push({
          idDocumentoSoporte: doc.idDocumentoSoporte,
          idSolicitud: obj.idSolicitud,
          idTipoDocumentoSoporte: 'abe33c1d-9370-4189-9e81-597e5b643481',
          path: `${obj.idUsuarioSeguridad}/Otros_Documentos_${obj.idSolicitud}`,
          idUsuario: obj.idUsuarioSeguridad,
          fechaModificacion: new Date()
        });

        formData.append('containerName', container);
        formData.append('oid', obj.idUsuarioSeguridad);

        if (supportDocumentsEdit.length) {
          await api.uploadFiles(formData);
          await api.UpdateSupportDocuments(supportDocumentsEdit);
        }
      }
      setLicenciaseleccionada(false);
      Swal.fire({
        icon: 'success',

        title: 'Solicitud Modificada',
        text: 'Se ha modificado la Solicitud exitosamente'
      });
    }
  };

  const onSubmitFailed = () => {
    setStatus('error');
    store.dispatch(SetResetViewLicence());
  };



  const Actions = () => (
    <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
      <div className='d-flex justify-content-between'>
        <Button type='primary' htmlType='submit'>
          Guardar o Modificar
        </Button>
      </div>
    </Form.Item>
  );

  const cambiodocumento = (value: any) => {
    const valor: string = value;


    const valorupper = valor.toUpperCase();
    setsininformacion(false);

    if (valorupper == 'C087D833-3CFB-460F-AA78-E5CF2FE83F25') {
      form.setFieldsValue({ IDNumber: undefined });
      setLongitudminima(5);
      setLongitudmaxima(15);
      setTipocampo('[a-zA-Z0-9]{0,15}');
      setTipocampovalidacion(/[a-zA-Z0-9]/);
      setTipodocumento('Sin Identificación');
      setCampo('AlfaNuméricos(Numéros y letras)');
      setsininformacion(true);
    } else {
      if (valorupper == '7C96A4D3-A0CB-484E-A01B-93BC39C7902E') {
        setLongitudminima(2);
        setLongitudmaxima(10);
        setTipocampo('[0-9]{2,10}');
        setTipocampovalidacion(/[0-9]/);
        setCampo('Numéricos');
        setTipodocumento('Número de Protocolo');
        form.setFieldsValue({ IDNumber: '8001508610' });
      } else {
        form.setFieldsValue({ IDNumber: undefined });
        if (valorupper === '7C96A4D3-A0CB-484E-A01B-93BC39C2552E') {
          setLongitudminima(4);
          setLongitudmaxima(10);
          setTipocampo('[0-9]{4,10}');
          setTipocampovalidacion(/[0-9]/);
          setCampo('Numéricos');
          setTipodocumento('Cédula de Ciudadanía');
        } else {
          if (valorupper === 'AC3629D8-5C87-46CE-A8E2-530B0495CBF6') {
            setLongitudminima(10);
            setLongitudmaxima(11);
            setTipocampo('[0-9]{10,11}');
            setTipocampovalidacion(/[0-9]/);
            setCampo('Numéricos');
            setTipodocumento('Tarjeta de Identidad ');
          } else {
            if (valorupper === '2491BC4B-8A60-408F-9FD1-136213F1E4FB') {
              setLongitudminima(15);
              setLongitudmaxima(15);
              setTipocampo('[0-9]{15,15}');
              setTipocampovalidacion(/[0-9]/);
              setCampo('Numéricos');
              setTipodocumento('Permiso Especial de Permanencia');
            } else {
              if (valorupper === 'FFE88939-06D5-486C-887C-E52D50B7F35D' ||
                valorupper === '71F659BE-9D6B-4169-9EE2-E70BF0D65F92' ||
                valorupper === '97F5657D-D8EC-48EF-BBE3-1BABEFECB1A4') {
                setLongitudminima(10);
                setLongitudmaxima(11);
                setTipocampo('[a-zA-Z0-9]{10,11}');
                setTipocampovalidacion(/[a-zA-Z0-9]/);
                setCampo('AlfaNuméricos(Numéros y letras)');
                setTipodocumento('Registro Civil de Nacimiento , Numero único de identificacíon personal y Carné Diplomatico');
              } else {
                if (valorupper === '0D69523B-4676-4E3D-8A3D-C6800A3ACF3E') {
                  setLongitudminima(6);
                  setLongitudmaxima(16);
                  setTipocampo('[0-9]{6,16}');
                  setTipocampovalidacion(/[0-9]/);
                  setCampo('Numéricos');
                  setTipodocumento('Certificado de nacido vivo ');

                }
                else {
                  if (valorupper === '60518653-70B7-42AB-8622-CAA27B496184') {
                    setLongitudminima(7);
                    setLongitudmaxima(16);
                    setTipocampo('[a-zA-Z0-9]{7,16}');
                    setTipocampovalidacion(/[a-zA-Z0-9]/);
                    setCampo('AlfaNumérico(Numéros y letras)');
                    setTipodocumento('Documento Extranjero');

                  }
                  else {
                    if (valorupper === 'C532C358-56AE-4F93-8B9B-344DDF1256B7') {
                      setLongitudminima(9);
                      setLongitudmaxima(9);
                      setTipocampo('[a-zA-Z0-9]{9,9}');
                      setTipocampovalidacion(/[a-zA-Z0-9]/);
                      setCampo('AlfaNumérico(Numéros y letras)');
                      setTipodocumento('Salvoconducto');

                    }
                    else {
                      if (valorupper === '6AE7E477-2DE5-4149-8C93-12ACA6668FF0') {
                        setLongitudminima(5);
                        setLongitudmaxima(11);
                        setTipocampo('[a-zA-Z0-9]{5,11}');
                        setTipocampovalidacion(/[a-zA-Z0-9]/);
                        setCampo('AlfaNumérico(Numéros y letras)');
                        setTipodocumento('Adulto Sin Identificar');

                      }

                      else {
                        if (valorupper === '5FA5BF3F-B342-4596-933F-0956AE4B9109') {
                          setLongitudminima(5);
                          setLongitudmaxima(12);
                          setTipocampo('[a-zA-Z0-9]{5,12}');
                          setTipocampovalidacion(/[a-zA-Z0-9]/);
                          setCampo('AlfaNumérico(Numéros y letras)');
                          setTipodocumento('Menor Sin Identificar');

                        }
                        else {
                          if (valorupper === 'E927B566-7B8E-4B4D-AE26-14454705CB5E') {
                            setLongitudminima(4);
                            setLongitudmaxima(18);
                            setTipocampo('[a-zA-Z0-9]{4,18}');
                            setTipocampovalidacion(/[a-zA-Z0-9]/);
                            setCampo('AlfaNumérico(Numéros y letras)');
                            setTipodocumento('Permiso de Protección Temporal');

                          }
                          else {
                            setLongitudminima(6);
                            setLongitudmaxima(10);
                            setTipocampo('[a-zA-Z0-9]{6,10}');
                            setTipocampovalidacion(/[a-zA-Z0-9]/);
                            setCampo('AlfaNuméricos(Numéros y letras)');
                            setTipodocumento('Pasaporte , Cédula de Extranjería y  Tarjeta de Extranjería ');
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

  const FilterByNameInputfecha = () => {

    return (
      <Form.Item style={{ width: 300, marginTop: 4, marginRight: 4 }} initialValue={fechafiltro}>
        <DatepickerComponent
          id='datePicker1'
          picker='date'
          placeholder='Fecha de Licencia'
          dateDisabledType='default'
          dateFormatType='default'
          className='form-control'
          onChange={(e) => {

            setfechafiltro(e);
            if (e != null) {
              let fecha: any = '';
              fecha = moment(e).format('YYYY-MM-DD');
              setfechafiltro(fecha);

              const filteredDataUsuario: any = data.filter((datos: any) => {

                return (
                  datos.INH_FEC_LICENCIA.toString().includes(fecha)
                );
              });
              setdatosUsuario(filteredDataUsuario);

            }
            else {
              setdatosUsuario(data);
            }
          }}
        />
      </Form.Item>
    );

  }

  let structureColumns = [
    {
      title: 'Numero de Licencia',
      dataIndex: 'INH_NUM_LICENCIA',
      key: 'INH_NUM_LICENCIA',
      width: 300,

    },
    {
      title: FilterByNameInputfecha(),
      dataIndex: 'INH_FEC_LICENCIA',
      with: 100,
      key: 'INH_FEC_LICENCIA',
      render: (Text: string) => (
        <Form.Item label='' name=''>
          <text>{Text.toString().substring(0, Text.toString().indexOf('T'))}</text>
        </Form.Item>
      )
    },
    {
      title: 'Nombres',
      dataIndex: '',
      with: 300,
      key: 'nombre',
      render: (_: any, row: any, index: any) => {
        return (<Form.Item label='' name=''>
          <text>{row.PRIMER_NOMBRE + ' ' + row.PRIMER_APELLIDO}</text>
        </Form.Item>)

      }
    },

    {
      title: 'Actualizar',
      key: 'Acciones',
      render: (_: any, row: any, index: any) => {
        return (
          <Button
            type='primary'
            style={{ marginLeft: '5px' }}
            icon={<CheckOutlined />}
            onClick={() => onClickValidarInformacion(row)}
          >
            Seleccionar
          </Button>
        );

      }
    }
  ];


  /*
    <div className='row mt-3 justify-content-center text-center'>
      <div className='col-lg-12 col-sm-12 col-md-12'>
        <p style={{ fontSize: '16px', color: '#000', fontFamily: ' Roboto' }}>Buscar por:</p>
        <Radio.Group onChange={changeRadioButton} defaultValue={'licencia'}>
          <Radio value='licencia'>Número de Licencia</Radio>
        </Radio.Group>
      </div>
    </div>

  */
  return (
    <div className='container-fluid'>
      <div className='card'>
        <div className='card-body'>
          <Form form={form} {...layoutItems} layout='horizontal' onFinish={onSubmit} onFinishFailed={onSubmitFailed}>
            <div className='row justify-content-center'>
              <div className='col-lg-12 col-sm-12 col-md-12 justify-content-center text-center'>
                <p
                  style={{ fontSize: '16px', color: '#3366cc', fontFamily: ' Roboto' }}
                  className='text-uppercase font-weight-bold'
                >
                  Modificar Licencia Oracle
                </p>
              </div>
            </div>


            <div className='row mt-5 mr-5 justify-content-center'>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <Form.Item label='Número de Licencia' name='numero'>
                  <Input
                    allowClear
                    placeholder='Número'
                    autoComplete='off'
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                    }}
                  />
                </Form.Item>
              </div>
            </div>

            <div className='row ml-5'>
              <div className='col-lg-12 col-sm-12 col-md-12 text-center'>
                <Button type='primary' onClick={BuscarSolicitud}>
                  Buscar Solicitud
                </Button>
              </div>
            </div>

            {licencia && (
              <>
                <div className='row'>
                  <div className='col-lg-8 col-sm-8 col-md-8'>
                    <Table
                      id='tableGen'
                      dataSource={datosUsuario}
                      size='middle'
                      columns={structureColumns}
                      scroll={{ x: 900 }}
                      pagination={{ pageSize: 10 }}
                    />
                  </div>
                </div>
              </>
            )}


            {licenciaseleccionada && (
              <>
                <Form.Item label='Fecha de la Licencia' name='date' rules={[{ required: false }]} initialValue={date}>
                  <DatepickerComponent picker='date' dateDisabledType='before' dateFormatType='default' value={date} disabled />
                </Form.Item>

                <Form.Item
                  label='Número de Licencia'
                  name='numerolic'
                  rules={[{ required: true }]}
                  initialValue={numerolicencia}
                >
                  <Input
                    allowClear
                    placeholder='Número de Licencia'
                    autoComplete='off'
                    disabled
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label='Número de Certificado'
                  name='numerocert'
                  rules={[{ required: true }]}
                  initialValue={certificado}
                >
                  <Input
                    allowClear
                    placeholder='Número de Certificado'
                    autoComplete='off'
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                    }}
                  />
                </Form.Item>

                <Form.Item label='Primer Nombre' name='name' rules={[{ required: true, max: 50 }]} initialValue={primerNombre}>
                  <Input
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
                  name='secondName'
                  rules={[{ required: false, max: 50 }]}
                  initialValue={segundoNombre}
                >
                  <Input
                    allowClear
                    placeholder='Segundo Nombre'
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
                  label='Primer Apellido'
                  name='surname'
                  rules={[{ required: true, max: 50 }]}
                  initialValue={primerApellido}
                >
                  <Input
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
                  name='secondSurname'
                  rules={[{ required: false, max: 50 }]}
                  initialValue={segundoApellido}
                >
                  <Input
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
                  label='Tipo Identificación'
                  name='IDType'
                  initialValue={tipoIdentificacion}
                  rules={[{ required: true }]}
                >
                  <SelectComponent
                    options={l_tipos_documento}
                    onChange={cambiodocumento}
                    optionPropkey='id'
                    optionPropLabel='descripcion'
                  />
                </Form.Item>

                <Form.Item label='Número de Identificación' name='IDNumber'
                  initialValue={numeroIdentificacion}
                  rules={[{ required: !sininformacion }]}>
                  <Input
                    allowClear
                    type='text'
                    placeholder='Número Identificación'
                    autoComplete='off'
                    pattern={tipocampo}
                    maxLength={longitudmaxima}
                    onKeyPress={(event) => {
                      if (!tipocampovalidacion.test(event.key)) {
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
                          'Sección:INFORMACIÓN DEL FALLECIDO \n recuerde que para el tipo de documento: ' +
                          tipodocumento +
                          ' solo se admiten valores ' +
                          campo +
                          ' de longitud entre ' +
                          longitudminima +
                          ' y ' +
                          longitudmaxima
                      });
                    }}
                  />
                </Form.Item>


                <Form.Item
                  label='Cementerio'
                  name='cementerio'
                  rules={[{ required: false, max: 50 }]}
                  initialValue={cementerio}
                >
                  <Input
                    allowClear
                    placeholder='Cementerio'
                    autoComplete='off'
                    disabled
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
                  label='Tipo de Muerte'
                  name='deathType'
                  initialValue={tipomuerte}
                  rules={[{ required: true }]}
                >
                  <SelectComponent options={l_tipo_muerte} optionPropkey='id' optionPropLabel='descripcion' />
                </Form.Item>

                <Form.Item
                  label='Codigo Institución'
                  name='codinst'
                  rules={[{ required: false, max: 50 }]}
                  initialValue={codinstitucion}
                >
                  <Input
                    allowClear
                    placeholder='Codigo Institución'
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
                  label='Razón Institución'
                  name='razoninst'
                  rules={[{ required: false, max: 50 }]}
                  initialValue={razoninstitucion}
                >
                  <Input
                    allowClear
                    placeholder='Razón Institución'
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
                  label='Radicado'
                  name='radicado'
                  rules={[{ required: false, max: 50 }]}
                  initialValue={radicado}
                >
                  <Input
                    allowClear
                    placeholder='Radicado'
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


                {nn && (
                  <>
                    <Form.Item label='Observaciones.' name='observations' rules={[{ required: true }]}>
                      <Input.TextArea style={{ width: 500 }} />
                    </Form.Item>
                    <Form.Item label='Otros' name='fileOtrosDocumentos' rules={[{ required: true }]}>
                      <Upload
                        name='fileOtrosDocumentos'
                        maxCount={1}
                        beforeUpload={() => false}
                        listType='text'
                        accept='application/pdf'
                      >
                        <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
                      </Upload>
                    </Form.Item>
                  </>
                )}
                <div>
                  <Actions />
                </div>
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
