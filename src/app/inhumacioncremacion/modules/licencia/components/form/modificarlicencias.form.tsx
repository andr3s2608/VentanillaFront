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
import { Alert, Divider, Input, Radio, RadioChangeEvent, Switch, Table, Upload } from 'antd';
import moment from 'moment';
import { GeneralInfoFormSeccion, KeysForm as KeyFormGeneralInfo } from './seccions/general-info.form-seccion';
import { DeathInstituteFormSeccion, KeysForm as KeyFormDeathInstitute } from './seccions/death-institute.form-seccion';
import { InhumacionSeccion, KeysForm as KeyFormInhumacion } from './seccions/inhumacion.form.seccion';
import { EditInhumacion } from './edit/Inhumacion';
import { EditFetal } from './edit/fetal';
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import { DatoSolicitanteAdd, KeysForm as KeyFormSolicitante } from './seccions/datoSolicitanteAdd';
import { CementerioInfoFormSeccion, KeysForm as KeyFormCementerio } from './seccions/cementerio-info.form-seccion';
import { InformacionDocumentosGestion, KeysForm as KeyFormDocumentos } from './seccions/documentos-gestion.seccion';
import { MedicalSignatureFormSeccion, KeysForm as KeyFormMedicalSignature } from './seccions/medical-signature.form-seccion';
import { LugarDefuncionFormSeccion, KeysForm as KeyFormLugarDefuncion } from './seccions/lugar-defuncion.form-seccion';
import { IRegistroLicencia } from 'app/inhumacioncremacion/Models/IRegistroLicencia';
import { FamilarFetalCremacion, KeysForm as KeyFormcremacion } from './familarCremacion';

export const ModificarLicencia = ({ props }: any) => {
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [form] = Form.useForm<any>();

  const [mostrartabla, setmostrartabla] = useState<boolean>(false);
  const [licenciaseleccionada, setlicenciaseleccionada] = useState<boolean>(false);

  const [insttype, setinsttype] = useState<string>('');

  const [contenedor, setcontenedor] = useState<string>('');

  const [causaMuerte, setCausaMuerte] = useState<string>('');

  const [estadoaguardar, setestadoaguardar] = useState<string>('');
  const [generales, setgenerales] = useState<boolean>(false);
  const [estado, setestado] = useState<boolean>(false);
  const [lugar, setlugar] = useState<boolean>(false);
  const [institucion, setinstitucion] = useState<boolean>(false);
  const [fallecido, setfallecido] = useState<boolean>(false);
  const [cremador, setcremador] = useState<boolean>(false);
  const [solicitante, setsolicitante] = useState<boolean>(false);
  const [medico, setmedico] = useState<boolean>(false);




  const [longitudreconocido, setlongitudreconocido] = useState<number>(-1);
  const [longitudsolicitante, setlongitudsolicitante] = useState<number>(4);
  const [longituddeathinst, setlongituddeathinst] = useState<number>(6);
  const [longitudmedico, setlongitudmedico] = useState<number>(4);

  const [longitudminima, setlongitudminima] = useState<number>(4);
  const [tipodocumentohoranacimiento, settipodocumentohoranacimiento] = useState<string>('7c96a4d3-a0cb-484e-a01b-93bc39c2552e');
  const [datecorrect, setdatecorrect] = useState<boolean>(true);

  const [inhumacion, setinhumacion] = useState<boolean>(false);
  const [individual, setindividual] = useState<boolean>(false);

  const [valores, setvalores] = useState<string>('consecutivo');

  const [estadoactual, setestadoactual] = useState<string>('');
  const [consecutivo, setconsecutivo] = useState<string>('');

  const [obj, setobj] = useState<any>();

  const [fechafiltro, setfechafiltro] = useState<any>();

  const [datosUsuario, setdatosUsuario] = useState<any>([]);
  const [data, setdata] = useState<any>([]);

  const [type, settype] = useState<any>([]);


  const [longitudmaximaautoriza, setLongitudmaximaautoriza] = useState<number>(10);
  const [longitudminimaautoriza, setLongitudminimaautoriza] = useState<number>(5);
  const [tipocampoautoriza, setTipocampoautoriza] = useState<string>('[0-9]{4,10}');
  const [sininformacionaut, setsininformacionaut] = useState<boolean>(false);
  const [tipocampovalidacionautoriza, setTipocampovalidacionautoriza] = useState<any>(/[0-9]/);
  const [tipodocumentoautoriza, setTipodocumentoautoriza] = useState<string>('Cédula de Ciudadanía');
  const [campoautoriza, setCampoautoriza] = useState<string>('Numéricos');
  const [l_tipos_documento_autoriza, settiposautoriza] = useState<any>();

  const [parentescocremacion, setparentescocremacion] = useState<any>();

  const { current, setCurrent, status, setStatus, onNextStep, onPrevStep } = useStepperForm<any>(form);


  const getListas = useCallback(async () => {
    const tipos: any = localStorage.getItem('tipoid');
    const tiposjson: any = JSON.parse(tipos);
    const nuevalista = tiposjson.filter((i: { id: string }) => i.id != '7c96a4d3-a0cb-484e-a01b-93bc39c7902e');
    settiposautoriza(nuevalista);

    const causa = await api.getCostante('9124A97B-C2BD-46A0-A8B3-1AC7A0A06C82');
    setCausaMuerte(causa['valor']);

    const typeList = await api.GetAllTypeValidation();

    const filter: any = typeList.filter(function (f: { id: string }) {
      return (
        f.id != '3cd0ed61-f26b-4cc0-9015-5b497673d275' &&
        f.id != 'fe691637-be8a-425f-a309-e2032221553f'
      );
    });


    const estados: any[] = [];
    for (let index = 0; index < filter.length; index++) {
      const id = filter[index].id;
      const descripcion = filter[index].descripcion;

      estados.push({ id: id, descripcion: descripcion })

    }
    estados.push({ id: 'fdcea488-2ea7-4485-b706-a2b96a86ffdf', descripcion: 'Devolver a la Bandeja(En Tramite)' })

    settype(estados)
  }, []);

  useEffect(() => {
    getListas();
  }, []);

  const BuscarSolicitud = async () => {
    const numero: string = form.getFieldValue('numero');
    const listasolicitudes: any = await api.ConsultarLicenciasAdministrador(numero, valores);

    setdata(listasolicitudes);
    setdatosUsuario(listasolicitudes);
    setmostrartabla(true);
    setlicenciaseleccionada(false);

  }

  const onClickModificar = async (solicitud: any) => {
    //const solicitante = await api.GetResumenSolicitud(idSolicitud);

    const solicitudamodificar: any = await api.getLicencia(solicitud.idSolicitud)

    localStorage.setItem('register', JSON.stringify(solicitudamodificar));

    let objlocal: any;
    let par: any;
    setestadoactual(solicitud.estado === 'Registro Usuario Externo' ? 'En Tramite ' : solicitud.estado);
    setconsecutivo(solicitud.consecutivo);
    //setobj(solicitudamodificar);


    switch (solicitudamodificar[0].idTramite) {
      case 'a289c362-e576-4962-962b-1c208afa0273':
        /*El contenedor es de inhumacion indivual */
        setinhumacion(true);
        setindividual(true);

        setobj(EditInhumacion('0'))
        objlocal = EditInhumacion('0');
        setinsttype(objlocal.instType)
        setcontenedor('inhumacionindividual')
        break;
      case 'ad5ea0cb-1fa2-4933-a175-e93f2f8c0060':
        /*El contenedor es de inhumacion fetal */
        setinhumacion(true);
        setindividual(false);
        setobj(EditFetal())
        objlocal = EditFetal();
        setinsttype(objlocal.instType)
        setcontenedor('inhumacionfetal')
        break;
      case 'e69bda86-2572-45db-90dc-b40be14fe020':
        /*El contenedor es de cremacion individual */
        setinhumacion(false);
        setindividual(true);

        setobj(EditInhumacion('0'))
        objlocal = EditInhumacion('0')
        setcontenedor('cremacionindividual')

        par = objlocal?.autorizadorcremacion[0].parentesco;
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
        setinsttype(objlocal.instType)
        cambiodocumentoautoriza(objlocal?.autorizadorcremacion[0].tipoid);
        break;
      case 'f4c4f874-1322-48ec-b8a8-3b0cac6fca8e':
        /*El contenedor es de cremacionfetal */
        setinhumacion(false);
        setindividual(false);
        setobj(EditFetal())
        objlocal = EditFetal();
        setcontenedor('cremacionfetal')
        par = objlocal?.autorizadorcremacion[0].parentesco;
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
        setinsttype(objlocal.instType)
        cambiodocumentoautoriza(objlocal?.autorizadorcremacion[0].tipoid);
        break;
    }


    setlicenciaseleccionada(true);
    setmostrartabla(false)


  };


  const changeRadioButton = (values: any) => {
    setvalores(values.target.value);
    form.resetFields(['numero']);
  };

  const FilterByNameInputfecha = () => {

    return (
      <Form.Item style={{ width: 300, marginTop: 4, marginRight: 4 }} initialValue={fechafiltro}>
        <DatepickerComponent
          id='datePicker1'
          picker='date'
          placeholder='Fecha de Solicitud'
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
                  datos.fechaSolicitud.toString().includes(fecha)
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


  let structureColumns: any = [];
  structureColumns = [

    {
      title: 'Modificación',
      key: 'modificacion',
      render: (_: any, row: any, index: any) => {
        return (
          <Button
            type='primary'
            style={{ marginLeft: '5px' }}
            icon={<CheckOutlined />}
            onClick={() => onClickModificar(row)}
          >
            Modificar Solicitud
          </Button>
        );

      }
    },

    {
      title: 'Consecutivo de Tramite',
      dataIndex: 'consecutivo',
      key: 'consecutivo',
      width: 300,

    },
    {
      title: FilterByNameInputfecha(),
      dataIndex: 'fechaSolicitud',
      width: 200,
      key: 'fechaSolicitud',
      render: (Text: any) => (
        <Form.Item label='' name=''>
          <text>{moment(Text.toString().substring(0, Text.toString().indexOf(' '))).format('DD-MM-YYYY')}</text>
        </Form.Item>
      )
    },
    {
      title: 'Tipo Solicitud',
      dataIndex: 'idTramite',
      key: 'tipoSolicitud',
      width: 300,
      filters: [
        {
          text: 'Inhumación Individual',
          value: 'a289c362-e576-4962-962b-1c208afa0273'
        },
        {
          text: 'Inhumación Fetal',
          value: 'ad5ea0cb-1fa2-4933-a175-e93f2f8c0060'
        },
        {
          text: 'Cremación Individual',
          value: 'e69bda86-2572-45db-90dc-b40be14fe020'
        },
        {
          text: 'Cremación Fetal ',
          value: 'f4c4f874-1322-48ec-b8a8-3b0cac6fca8e'
        }
      ],
      filterSearch: true,

      onFilter: (value: string, record: { idTramite: string }) => record.idTramite.toString().includes(value),
      render: (Text: string) => {

        switch (Text) {
          case 'a289c362-e576-4962-962b-1c208afa0273':
            return (<Form.Item label='' name=''>
              <text>{'Inhumación Individual'}</text>
            </Form.Item>)
            break;
          case 'ad5ea0cb-1fa2-4933-a175-e93f2f8c0060':
            return (<Form.Item label='' name=''>
              <text>{'Inhumación Fetal'}</text>
            </Form.Item>)
            break;
          case 'e69bda86-2572-45db-90dc-b40be14fe020':
            return (<Form.Item label='' name=''>
              <text>{'Cremación Individual'}</text>
            </Form.Item>)
            break;
          case 'f4c4f874-1322-48ec-b8a8-3b0cac6fca8e':
            return (<Form.Item label='' name=''>
              <text>{'Cremación Fetal'}</text>
            </Form.Item>)
            break;
        }

      }

    },
    {
      title: 'Estado Tramite',
      dataIndex: 'estado',
      key: 'estado',
      width: 230,
      filters: [
        {
          text: 'Anulado ',
          value: 'Anulado validador de documentos'
        },
        {
          text: 'Aprobado ',
          value: 'Aprobado validador de documentos'
        },
        {
          text: 'Negado ',
          value: 'Negado validador de documentos'
        },
        {
          text: 'En tramite ',
          value: 'Registro Usuario Externo'
        },
        {
          text: 'Documentos Inconsistentes',
          value: 'Documentos Inconsistentes'
        },
        {
          text: 'Cambio de Licencia',
          value: 'Cambio de Licencia'
        },

        {
          text: 'Actualización de Documentos',
          value: 'Actualización Documentos'
        },
        {
          text: 'Actualización de Datos',
          value: 'Actualización Solicitud'
        }
      ],
      filterSearch: true,
      onFilter: (value: string, record: { estadoString: string }) => record.estadoString.toString().includes(value),


      render: (Text: string) => {

        if (Text === 'Cambio de Licencia') {
          return (<Form.Item label='' name=''>
            <text>{'Cambio tipo de licencia'}</text>
          </Form.Item>)
        }
        else {
          if (Text === 'Registro Usuario Externo') {
            return (<Form.Item label='' name=''>
              <text>{'En Tramite'}</text>
            </Form.Item>)
          }
          else {
            return (<Form.Item label='' name=''>
              <text>{Text}</text>
            </Form.Item>)
          }

        }

      }
    }
  ];
  const settipo = (tipo: string) => {
    settipodocumentohoranacimiento(tipo);
  };



  const getData = (longitud: number, procedencia: any) => {

    if (procedencia === 'familiarautoriza') {
      setLongitudminimaautoriza(longitud);
    }
    if (procedencia === 'datosfallecido') {
      setlongitudminima(longitud);
    }
    if (procedencia === 'reconocido') {
      setlongitudreconocido(longitud);
    }
    if (procedencia === 'solicitante') {
      setlongitudsolicitante(longitud);
    }
    if (procedencia === 'deathinst') {
      setlongituddeathinst(longitud);
    }
    if (procedencia === 'medico') {
      setlongitudmedico(longitud);
    }

  };

  const FechaNacimiento = (value: any) => {

    const valorfecha = form.getFieldValue('dateOfBirth');

    if (valorfecha != undefined) {
      const fecha = moment(valorfecha);
      const time = form.getFieldValue('timenac');

      let time2 = undefined;
      if (time != undefined) {
        time2 = moment(time).format('LT');
      }


      let valor = form.getFieldValue('date');
      let fechadef = moment(valor);

      const timedef = form.getFieldValue('time');
      let timedef2 = undefined;


      if (timedef != undefined) {
        timedef2 = moment(timedef).format('LT');
      }



      let tiempo = '';



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

        if (tiempo == 'es valida' && fecha.date() === fechadef.date()) {
          setdatecorrect(true);
        } else {
          if (tiempo == 'es invalida') {
            Swal.fire({
              icon: 'error',
              title: 'Datos inválidos',
              text: `La Hora de nacimiento  debe ser menor a: ${timedef2}`
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Datos inválidos',
              text: `La fecha de nacimiento debe ser menor a: ${fechadef.calendar()}`
            });
          }
          setdatecorrect(false);
        }


      } else {
        setdatecorrect(true);
      }
    }
  };










  const onSubmit = async (values: any) => {


  };


  const cambiodocumentoautoriza = (value: any) => {
    form.setFieldsValue({ mauthIDNumber: undefined });
    const valor: string = value;
    const valorupper = valor.toUpperCase();
    setsininformacionaut(false);

    if (valorupper == 'C087D833-3CFB-460F-AA78-E5CF2FE83F25') {
      form.setFieldsValue({ IDNumber: undefined });
      setLongitudminimaautoriza(5);
      setLongitudmaximaautoriza(15);
      setTipocampoautoriza('[a-zA-Z0-9]{0,15}');
      setTipocampovalidacionautoriza(/[a-zA-Z0-9]/);
      setTipodocumentoautoriza('Sin Identificación');
      setCampoautoriza('AlfaNuméricos(Numéros y letras)');
      setsininformacionaut(true);
    } else {
      if (valorupper == '7C96A4D3-A0CB-484E-A01B-93BC39C7902E') {
        setLongitudminimaautoriza(2);
        setLongitudmaximaautoriza(10);
        setTipocampoautoriza('[0-9]{2,10}');
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
              setLongitudminimaautoriza(15);
              setLongitudmaximaautoriza(15);
              setTipocampoautoriza('[0-9]{15,15}');
              setTipocampovalidacionautoriza(/[0-9]/);
              setCampoautoriza('Numéricos');
              setTipodocumentoautoriza('Permiso Especial de Permanencia');
            } else {
              if (valorupper === 'FFE88939-06D5-486C-887C-E52D50B7F35D' ||
                valorupper === '71F659BE-9D6B-4169-9EE2-E70BF0D65F92' ||
                valorupper === '97F5657D-D8EC-48EF-BBE3-1BABEFECB1A4') {
                setLongitudminimaautoriza(10);
                setLongitudmaximaautoriza(11);
                setTipocampoautoriza('[a-zA-Z0-9]{10,11}');
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
                      setLongitudminimaautoriza(9);
                      setLongitudmaximaautoriza(9);
                      setTipocampoautoriza('[a-zA-Z0-9]{9,9}');
                      setTipocampovalidacionautoriza(/[a-zA-Z0-9]/);
                      setCampoautoriza('AlfaNumérico(Numéros y letras)');
                      setTipodocumentoautoriza('Salvoconducto');

                    }
                    else {
                      if (valorupper === '6AE7E477-2DE5-4149-8C93-12ACA6668FF0') {
                        setLongitudminimaautoriza(5);
                        setLongitudmaximaautoriza(11);
                        setTipocampoautoriza('[a-zA-Z0-9]{5,11}');
                        setTipocampovalidacionautoriza(/[a-zA-Z0-9]/);
                        setCampoautoriza('AlfaNumérico(Numéros y letras)');
                        setTipodocumentoautoriza('Adulto Sin Identificar');

                      }

                      else {
                        if (valorupper === '5FA5BF3F-B342-4596-933F-0956AE4B9109') {
                          setLongitudminimaautoriza(5);
                          setLongitudmaximaautoriza(12);
                          setTipocampoautoriza('[a-zA-Z0-9]{5,12}');
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

  const getDataCambioInstituto = () => {

    setinsttype(form.getFieldValue('instType'));
  };
  const [isOtherParentesco, setIsOtherParentesco] = useState(false);
  const onChangeParentesco = (e: RadioChangeEvent) => {
    form.resetFields(['authOtherParentesco']);
    setIsOtherParentesco(e.target.value === 'Otro');
  };

  const onSubmitFailed = () => {
    setStatus('error');
    store.dispatch(SetResetViewLicence());
  };
  const getDataDocumentos = (rowData: string, valor: string) => {

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


  const Modificar = async (values: any) => {

    Swal.fire({
      title: 'Modificacion de Solicitud',
      text: 'Esta a punto de realizar un cambio a la solicitud, ¿Está seguro de continuar?',
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

        if (idnum == undefined) {
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
        }

        let persona: any[] = [];


        if (contenedor === 'inhumacionindividual') {
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
              fechaNacimiento: values.dateOfBirth,
              hora: values?.timenac ? moment(values.timenac).format('LT') : 'Sin información',
              nacionalidad: values.nationalidad,
              estado: true,
              segundanacionalidad: '00000000-0000-0000-0000-000000000000',
              otroParentesco: null,
              idEstadoCivil: values.civilStatus,
              idNivelEducativo: values.educationLevel,
              idEtnia: values.etnia,
              idRegimen: values.regime,
              idTipoPersona: '01f64f02-373b-49d4-8cb1-cb677f74292c',
              idParentesco: parentesco,
              idLugarExpedicion: '00000000-0000-0000-0000-000000000000'
            },
            //certifica la defuncion
            {
              idPersona: obj.idpersonamedico,
              tipoIdentificacion: values.medicalSignatureIDType,
              numeroIdentificacion: values.medicalSignatureIDNumber,
              primerNombre: values.medicalSignatureName,
              segundoNombre: values.medicalSignatureSecondName ?? '',
              primerApellido: values.medicalSignatureSurname,
              segundoApellido: values.medicalSignatureSecondSurname ?? '',
              fechaNacimiento: null,
              hora: '',
              nacionalidad: '00000000-0000-0000-0000-000000000000',
              segundanacionalidad: '00000000-0000-0000-0000-000000000000',
              otroParentesco: null,
              idEstadoCivil: '00000000-0000-0000-0000-000000000000',
              idNivelEducativo: '00000000-0000-0000-0000-000000000000',
              idEtnia: '00000000-0000-0000-0000-000000000000',
              idRegimen: '00000000-0000-0000-0000-000000000000',
              idTipoPersona: 'D8B0250B-2991-42A0-A672-8E3E45985500',
              idParentesco: '00000000-0000-0000-0000-000000000000',
              idLugarExpedicion: values?.medicalSignatureIDExpedition ?? '1e05f64f-5e41-4252-862c-5505dbc3931c', //values.medicalSignatureIDExpedition,
              idTipoProfesional: values.medicalSignatureProfesionalType
            }
          ];
        }
        if (contenedor === 'cremacionindividual') {
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
              fechaNacimiento: values.dateOfBirth,
              hora: values?.timenac ? moment(values.timenac).format('LT') : 'Sin información',
              nacionalidad: values.nationalidad,
              estado: true,
              segundanacionalidad: '00000000-0000-0000-0000-000000000000',
              otroParentesco: null,
              idEstadoCivil: values.civilStatus,
              idNivelEducativo: values.educationLevel,
              idEtnia: values.etnia,
              idRegimen: values.regime,
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
            },
            //certifica la defuncion
            {
              idPersona: obj.idpersonamedico,
              tipoIdentificacion: values.medicalSignatureIDType,
              numeroIdentificacion: values.medicalSignatureIDNumber,
              primerNombre: values.medicalSignatureName,
              segundoNombre: values.medicalSignatureSecondName ?? '',
              primerApellido: values.medicalSignatureSurname,
              segundoApellido: values.medicalSignatureSecondSurname ?? '',
              fechaNacimiento: null,
              hora: '',
              nacionalidad: '00000000-0000-0000-0000-000000000000',
              segundanacionalidad: '00000000-0000-0000-0000-000000000000',
              otroParentesco: null,
              idEstadoCivil: '00000000-0000-0000-0000-000000000000',
              idNivelEducativo: '00000000-0000-0000-0000-000000000000',
              idEtnia: '00000000-0000-0000-0000-000000000000',
              idRegimen: '00000000-0000-0000-0000-000000000000',
              idTipoPersona: 'D8B0250B-2991-42A0-A672-8E3E45985500',
              idParentesco: '00000000-0000-0000-0000-000000000000',
              idLugarExpedicion: values?.medicalSignatureIDExpedition ?? '1e05f64f-5e41-4252-862c-5505dbc3931c', //values.medicalSignatureIDExpedition,
              idTipoProfesional: values.medicalSignatureProfesionalType
            }
          ];
        }
        if (contenedor === 'inhumacionfetal') {
          persona = [
            //fallecido
            {
              idPersona: obj.idMadre,
              tipoIdentificacion: values.IDType,
              numeroIdentificacion: 'FT_' + idnum,
              primerNombre: values.namemother,
              segundoNombre: values.secondNamemother ?? '',
              primerApellido: values.surnamemother,
              segundoApellido: values.secondSurnamemother ?? '',
              fechaNacimiento: obj.dateOfBirth,
              hora: values?.timenac ? moment(values.timenac).format('LT') : 'Sin información',
              nacionalidad: values.nationalidadmother,
              segundanacionalidad: '00000000-0000-0000-0000-000000000000',
              otroParentesco: null,
              estado: true,
              idEstadoCivil: values.civilStatusmother,
              idNivelEducativo: values.educationLevelmother,
              idEtnia: values.etnia,
              idRegimen: obj.regime,
              idTipoPersona: '342d934b-c316-46cb-a4f3-3aac5845d246',
              idParentesco: parentesco,
              idLugarExpedicion: '00000000-0000-0000-0000-000000000000'
            },
            //certifica la defuncion
            {

              idPersona: obj.idpersonamedico,
              tipoIdentificacion: values.medicalSignatureIDType,
              numeroIdentificacion: values.medicalSignatureIDNumber,
              primerNombre: values.medicalSignatureName,
              segundoNombre: values.medicalSignatureSecondName ?? '',
              primerApellido: values.medicalSignatureSurname,
              segundoApellido: values.medicalSignatureSecondSurname ?? '',
              fechaNacimiento: null,
              hora: '',
              nacionalidad: '00000000-0000-0000-0000-000000000000',
              segundanacionalidad: '00000000-0000-0000-0000-000000000000',
              otroParentesco: null,
              idEstadoCivil: '00000000-0000-0000-0000-000000000000',
              idNivelEducativo: '00000000-0000-0000-0000-000000000000',
              idEtnia: '00000000-0000-0000-0000-000000000000',
              idRegimen: '00000000-0000-0000-0000-000000000000',
              idTipoPersona: 'D8B0250B-2991-42A0-A672-8E3E45985500',
              idParentesco: '00000000-0000-0000-0000-000000000000',
              idLugarExpedicion: values?.medicalSignatureIDExpedition ?? '1e05f64f-5e41-4252-862c-5505dbc3931c', //values.medicalSignatureIDExpedition,
              idTipoProfesional: values.medicalSignatureProfesionalType
            }
          ];
        }
        if (contenedor === 'cremacionfetal') {
          persona = [
            //madre
            {
              idPersona: obj.idMadre,
              tipoIdentificacion: values.IDType,
              numeroIdentificacion: 'FT_' + idnum,
              primerNombre: values.namemother,
              segundoNombre: values.secondNamemother ?? '',
              primerApellido: values.surnamemother,
              segundoApellido: values.secondSurnamemother ?? '',
              fechaNacimiento: obj.dateOfBirth,
              hora: values?.timenac ? moment(values.timenac).format('LT') : 'Sin información',
              nacionalidad: values.nationalidadmother,
              estado: true,
              segundanacionalidad: '00000000-0000-0000-0000-000000000000',
              otroParentesco: null,
              idEstadoCivil: values.civilStatusmother,
              idNivelEducativo: values.educationLevelmother,
              idEtnia: values.etnia,
              idRegimen: obj.regime,
              idTipoPersona: '342d934b-c316-46cb-a4f3-3aac5845d246',
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
            },
            //certifica la defuncion
            {
              idPersona: obj.idpersonamedico,
              tipoIdentificacion: values.medicalSignatureIDType,
              numeroIdentificacion: values.medicalSignatureIDNumber,
              primerNombre: values.medicalSignatureName,
              segundoNombre: values.medicalSignatureSecondName ?? '',
              primerApellido: values.medicalSignatureSurname,
              segundoApellido: values.medicalSignatureSecondSurname ?? '',
              fechaNacimiento: null,
              hora: '',
              nacionalidad: '00000000-0000-0000-0000-000000000000',
              segundanacionalidad: '00000000-0000-0000-0000-000000000000',
              otroParentesco: null,
              idEstadoCivil: '00000000-0000-0000-0000-000000000000',
              idNivelEducativo: '00000000-0000-0000-0000-000000000000',
              idEtnia: '00000000-0000-0000-0000-000000000000',
              idRegimen: '00000000-0000-0000-0000-000000000000',
              idTipoPersona: 'D8B0250B-2991-42A0-A672-8E3E45985500',
              idParentesco: '00000000-0000-0000-0000-000000000000',
              idLugarExpedicion: values?.medicalSignatureIDExpedition ?? '1e05f64f-5e41-4252-862c-5505dbc3931c', //values.medicalSignatureIDExpedition,
              idTipoProfesional: values.medicalSignatureProfesionalType
            }
          ];
        }


        let personareconocida: any = {};
        if (longitudreconocido !== -1) {
          personareconocida =
          {
            idPersona: obj.reconocidocomo[0].id,
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

        const dep = values.state;

        var mun = values.ciudad;
        switch (dep) {
          case '31b870aa-6cd0-4128-96db-1f08afad7cdd':
            mun = '31211657-3386-420a-8620-f9C07a8ca491';
            break;
        }


        const depres = values.departamento;
        var munres = values.ciudad;
        switch (depres) {
          case '31b870aa-6cd0-4128-96db-1f08afad7cdd':
            munres = '31211657-3386-420a-8620-f9C07a8ca491';
            break;
        }

        let checkhora = values?.check ?? obj.check;
        const json: IRegistroLicencia<any> = {
          solicitud: {
            idSolicitud: obj.idSolicitud,
            consecutivo: estadoaguardar,
            numeroCertificado: values.certificado,
            fechaDefuncion: moment(values.date).format(formatDate),
            sinEstablecer: checkhora,
            hora: checkhora === true ? 'Sin información' : moment(values.time).format('LT'),
            idSexo: values.sex,
            estadoSolicitud: values.validFunctionaltype,
            // estadoSolicitud: (cambioainhumacion || cambioacremacion) ? '31A45854-BF40-44B6-2645-08DA64F23B8E' : '40A8AC96-6513-42AE-9E44-A5C0E47AC6D8',
            idPersonaVentanilla: obj.idpersonaventanilla, //numero de usuario registrado
            idUsuarioSeguridad: obj.idusuarioseg,
            idTramite: obj.idTramite,
            idTipoMuerte: values.deathType,
            tipoPersona: obj.tipopersonasolicitantesolicitud,
            tipoIdentificacionSolicitante: obj.tiposolicitantesolicitud,
            noIdentificacionSolicitante: obj.nrosolicitantesolicitud,
            razonSocialSolicitante: obj.razonsocialsolicitantesolicitud,
            persona,
            lugarDefuncion: {
              idLugarDefuncion: obj?.idLugarDefuncion,
              idPais: values.country,
              idDepartamento: values.state,
              idMunicipio: mun,
              idAreaDefuncion: values.areaDef,
              idSitioDefuncion: values.sitDef
            },
            ubicacionPersona: {
              idUbicacionPersona: obj?.idUbicacionPersona,
              idPaisResidencia: values.pais,
              idDepartamentoResidencia: values.departamento,
              idCiudadResidencia: munres,
              idLocalidadResidencia: values.localidad,
              idAreaResidencia: values.area,
              idBarrioResidencia: values.barrio,
              ciudad: values.ciudadfuera
            },
            datosCementerio: {
              idDatosCementerio: obj?.idDatosCementerio,
              enBogota: values.cementerioLugar === 'Dentro de Bogotá',
              fueraBogota: values.cementerioLugar === 'Fuera de Bogotá',
              fueraPais: values.cementerioLugar === 'Fuera del País',
              cementerio: values.cementerioBogota ?? 'Fuera de Bogotá',
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
              correoCementerio: values.emailcementerio ? values.emailcementerio.toString().toLowerCase() : values.emailcementerio,
              correoFuneraria: values.emailfuneraria.toString().toLowerCase(),
              tipoDocumentoSolicitante: values.fiscalia,
              numeroDocumentoSolicitante: values.ndoc,
              nombreSolicitante: values.namesolicitudadd,
              apellidoSolicitante: values.lastnamesolicitudadd,
              correoSolicitante: values.emailsolicitudadd.toString().toLowerCase(),
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
              NombreFiscal: razonSocialins !== 'Otros' ? values?.fiscalianombreDC : '',
              ApellidoFiscal: razonSocialins !== 'Otros' ? values?.fiscaliaapellidoDC : '',
              NumeroOficio: razonSocialins !== 'Otros' ? values?.fiscalianumeroDC : '',
              NoFiscalMedicinaLegal: razonSocialins !== 'Otros' ? values?.NoFiscalDC : '',
              FechaOficio: razonSocialins !== 'Otros' ? (values?.fiscaliafechaDC ? moment(values?.fiscaliafechaDC).format(formatDate) : null) : null
            }

          }
        }


        const insercion: any = await api.UpdateLicenciaAdmin(json, '1');



        if (institucion) {
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

          const supportDocumentsEdit: any[] = [];
          const formData = new FormData();



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


          if (supportDocumentsEdit.length > 0) {
            formData.append('containerName', contenedor);
            formData.append('oid', accountIdentifier);
            await api.uploadFiles(formData);
            await api.UpdateSupportDocuments(supportDocumentsEdit);

          }


        }


        Swal.fire({
          icon: 'success',

          title: 'Solicitud Modificada',
          text: 'Se ha modificado la Solicitud exitosamente'
        });

      }

    });

    setCurrent(0);
  };


  const Guardar = async (values: any) => {
    if (generales) {

      let bandera = false;


      if (values.numerocert == obj.numeroCertificado) {
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

            Modificar(values);
          }
        });
      }
      else {

        Modificar(values);
      }
    }
    if (estado || lugar || institucion) {
      Modificar(values);
    }
    if (fallecido || cremador || solicitante || medico) {
      let numero: string = '';
      let longitud: number = 0;
      switch (estadoaguardar) {
        case 'fallecido':
          numero = values.IDNumber;
          longitud = longitudminima;
          break;
        case 'cremador':
          numero = values.mauthIDNumber;
          longitud = longitudminimaautoriza;
          break;
        case 'solicitante':
          numero = values.ndoc;
          longitud = longitudsolicitante;
          break;
        case 'medico':
          numero = values.medicalSignatureIDNumber;
          longitud = longitudmedico;
          break;
      }

      if (numero.length >= longitud) {
        Modificar(values);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Datos inválidos',
          text: `El Número de Identificación debe tener mínimo ${longitud} Dígitos o Caracteres`
        });
      }


    }

  }
  if (current === 1) {

    const values = form.getFieldsValue();
    Guardar(values);

  }


  const GuardarDatosGenerales = () => {
    setgenerales(true);
    setestado(false);
    setlugar(false);
    setinstitucion(false);
    setfallecido(false);
    setcremador(false);
    setsolicitante(false);
    setmedico(false);
    setestadoaguardar('general');


    onNextStep([
      ...KeyFormGeneralInfo
    ]);



  };
  const GuardarEstado = () => {
    setgenerales(false);
    setestado(true);
    setlugar(false);
    setinstitucion(false);
    setfallecido(false);
    setcremador(false);
    setsolicitante(false);
    setmedico(false);
    setestadoaguardar('estado');
    onNextStep([
      'validFunctionaltype'
    ]);



  };
  const GuardarLugar = () => {
    setgenerales(false);
    setestado(false);
    setlugar(true);
    setinstitucion(false);
    setfallecido(false);
    setcremador(false);
    setsolicitante(false);
    setmedico(false);
    setestadoaguardar('lugar');

    onNextStep([
      ...KeyFormLugarDefuncion
    ]);

  };
  const GuardarInstitucion = () => {
    setgenerales(false);
    setestado(false);
    setlugar(false);
    setinstitucion(true);
    setfallecido(false);
    setcremador(false);
    setsolicitante(false);
    setmedico(false);
    setestadoaguardar('institucion');

    onNextStep([
      ...KeyFormDocumentos,
      ...KeyFormDeathInstitute
    ]);

  };
  const GuardarFallecido = () => {
    setgenerales(false);
    setestado(false);
    setlugar(false);
    setinstitucion(false);
    setfallecido(true);
    setcremador(false);
    setsolicitante(false);
    setmedico(false);
    setestadoaguardar('fallecido');

    onNextStep([
      ...KeyFormInhumacion
    ]);

  };
  const GuardarCremador = () => {
    setgenerales(false);
    setestado(false);
    setlugar(false);
    setinstitucion(false);
    setfallecido(false);
    setcremador(true);
    setsolicitante(false);
    setmedico(false);
    setestadoaguardar('cremador');

    onNextStep([
      ...KeyFormcremacion
    ]);

  };
  const GuardarSolicitante = () => {
    setgenerales(false);
    setestado(false);
    setlugar(false);
    setinstitucion(false);
    setfallecido(false);
    setcremador(false);
    setsolicitante(true);
    setmedico(false);
    setestadoaguardar('solicitante');
    onNextStep([
      ...KeyFormSolicitante,
      ...KeyFormCementerio
    ]);
  };
  const GuardarMedico = () => {
    setgenerales(false);
    setestado(false);
    setlugar(false);
    setinstitucion(false);
    setfallecido(false);
    setcremador(false);
    setsolicitante(false);
    setmedico(true);
    setestadoaguardar('medico');
    onNextStep([
      ...KeyFormMedicalSignature
    ]);
  };


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
                  Modificar Licencia Azure
                </p>
              </div>
            </div>
            <div className='row mt-3 justify-content-center text-center'>
              <div className='col-lg-12 col-sm-12 col-md-12'>
                <p style={{ fontSize: '16px', color: '#000', fontFamily: ' Roboto' }}>Buscar por:</p>
                <Radio.Group onChange={changeRadioButton} defaultValue={'consecutivo'}>
                  <Radio value='consecutivo'>Consecutivo de tramite</Radio>
                  <Radio value='certificado'>Número de Certificado</Radio>
                  <Radio value='id'>Número de Identificación</Radio>
                </Radio.Group>
              </div>
            </div>

            <div className='row mt-5 mr-5 justify-content-center'>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <Form.Item label='Número' name='numero'>
                  <Input
                    allowClear
                    placeholder='Número'
                    autoComplete='off'
                    onKeyPress={(event) => {
                      if (valores === 'consecutivo') {
                        if (!/[0-9A-Za-z]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }
                      else {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }

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
            {mostrartabla && (
              <>
                <div className='row'>
                  <div className='col-lg-12 col-sm-12 col-md-12'>
                    <Table
                      id='tableGen'
                      dataSource={datosUsuario}
                      size='middle'
                      columns={structureColumns}
                      scroll={{ x: 1200 }}
                      pagination={{ pageSize: 10 }}
                    />
                  </div>
                </div>
              </>
            )}
            {licenciaseleccionada && (
              <>

                <section className='panel-solicitud mt-8 mb-5 datos_validadors'>
                  <div className='container'>
                    <div className='row'>
                      <div className='col-lg-12 col-sm-12 col-md-12 col-xl-12'>
                        <Divider style={{ borderColor: '#7cb305', color: '#7cb305' }} dashed className='tipo'>
                          CONSECUTIVO TRAMITE:{consecutivo}
                        </Divider>
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
                                <div className='row ml-5'>
                                  <div className='col-lg-12 col-sm-12 col-md-12 text-center'>
                                    <Button type='primary' htmlType='button' onClick={() => GuardarDatosGenerales()}>
                                      Guardar o Modificar
                                    </Button>
                                  </div>
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
                                    Modificar Seguimiento
                                  </a>
                                </h5>
                              </div>
                              <div id='collapse-2' className='collapse' data-parent='#accordion' aria-labelledby='heading-2'>
                                <div className='fadeInRight d-block'>
                                  <Divider orientation='right'>Modificar Seguimiento de la Solicitud</Divider>
                                  <div className='row ml-5'>
                                    <div className='col-lg-12 col-sm-12 col-md-12 text-center'>

                                      <label htmlFor="">El estado Actual de la Solicitud es : {estadoactual}</label>
                                    </div>
                                  </div>
                                  <Form.Item label='Estado de la Solicitud' name='validFunctionaltype' rules={[{ required: true }]}>
                                    <SelectComponent
                                      options={type}
                                      optionPropkey='id'
                                      optionPropLabel='descripcion'
                                      style={{ width: '360px' }}
                                      className='tipo_s'
                                    />
                                  </Form.Item>


                                </div>
                                <div className='row ml-5'>
                                  <div className='col-lg-12 col-sm-12 col-md-12 text-center'>
                                    <Button type='primary' htmlType='button' onClick={() => GuardarEstado()}>
                                      Guardar o Modificar
                                    </Button>
                                  </div>
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
                                    Lugar de Defunción
                                  </a>
                                </h5>
                              </div>
                              <div id='collapse-3' className='collapse' data-parent='#accordion' aria-labelledby='heading-2'>
                                <div className='fadeInRight d-block'>
                                  <LugarDefuncionFormSeccion form={form} obj={obj} />
                                </div>
                                <div className='row ml-5'>
                                  <div className='col-lg-12 col-sm-12 col-md-12 text-center'>
                                    <Button type='primary' htmlType='button' onClick={() => GuardarLugar()}>
                                      Guardar o Modificar
                                    </Button>
                                  </div>
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
                                    href='#collapse-4'
                                    aria-expanded='false'
                                    aria-controls='collapse-2'
                                  >
                                    Institución que Certifica el Fallecimiento
                                  </a>
                                </h5>
                              </div>
                              <div id='collapse-4' className='collapse' data-parent='#accordion' aria-labelledby='heading-2'>
                                <div className='fadeInRight d-block'>
                                  <DeathInstituteFormSeccion
                                    prop={getData}
                                    obj={obj}
                                    form={form}
                                    datofiscal={true}

                                    required={true}
                                    cambio={getDataCambioInstituto}
                                    tipoLicencia={inhumacion ? 'Inhumación' : 'Cremación'}
                                  />
                                </div>
                                <div className='row ml-5'>
                                  <div className='col-lg-12 col-sm-12 col-md-12 text-center'>
                                    <Button type='primary' htmlType='button' onClick={() => GuardarInstitucion()}>
                                      Guardar o Modificar
                                    </Button>
                                  </div>
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
                                    href='#collapse-5'
                                    aria-expanded='false'
                                    aria-controls='collapse-2'
                                  >
                                    {individual ? ' Datos del Fallecido' : 'Datos de la Madre'}
                                  </a>
                                </h5>
                              </div>
                              <div id='collapse-5' className='collapse' data-parent='#accordion' aria-labelledby='heading-2'>
                                <div className='fadeInRight d-block mt-3'>
                                  <InhumacionSeccion

                                    form={form}
                                    obj={obj}
                                    tipo={individual ? 'individual' : 'fetal'}
                                    prop={getData}
                                    fechanacimiento={FechaNacimiento}
                                    tipodocumentoseleccionado={settipo}
                                    origen={'administracion'}
                                  />
                                </div>
                                <div className='row ml-5'>
                                  <div className='col-lg-12 col-sm-12 col-md-12 text-center'>
                                    <Button type='primary' htmlType='button' onClick={() => GuardarFallecido()}>
                                      Guardar o Modificar
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>



                          {!inhumacion && (
                            <>
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
                                        Datos Del Familiar Que Autoriza Cremación
                                      </a>
                                    </h5>
                                  </div>
                                  <div id='collapse-6' className='collapse' data-parent='#accordion' aria-labelledby='heading-2'>
                                    <FamilarFetalCremacion prop={getData} tipoLicencia={''} obj={obj} parentesco={parentescocremacion} />
                                    <div className='row ml-5'>
                                      <div className='col-lg-12 col-sm-12 col-md-12 text-center'>
                                        <Button type='primary' htmlType='button' onClick={() => GuardarCremador()}>
                                          Guardar o Modificar
                                        </Button>
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
                                    href='#collapse-7'
                                    aria-expanded='false'
                                    aria-controls='collapse-2'
                                  >
                                    Datos Del Solicitante y/o Funeraria
                                  </a>
                                </h5>
                              </div>
                              <div id='collapse-7' className='collapse' data-parent='#accordion' aria-labelledby='heading-2'>
                                <div className='fadeInRight d-block'>
                                  <DatoSolicitanteAdd prop={getData} form={form} obj={obj} modificacion={true} />
                                  <CementerioInfoFormSeccion obj={obj} form={form}
                                    tipoLicencia={inhumacion === false ? 'Cremación' : 'Inhumación'}
                                    modificacion={true}
                                  />

                                </div>
                                <div className='row ml-5'>
                                  <div className='col-lg-12 col-sm-12 col-md-12 text-center'>
                                    <Button type='primary' htmlType='button' onClick={() => GuardarSolicitante()}>
                                      Guardar o Modificar
                                    </Button>
                                  </div>
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
                                    href='#collapse-8'
                                    aria-expanded='false'
                                    aria-controls='collapse-2'
                                  >
                                    Datos de Quien Certifica la defunción - Medico
                                  </a>
                                </h5>
                              </div>
                              <div id='collapse-8' className='collapse' data-parent='#accordion' aria-labelledby='heading-2'>
                                <div className='fadeInRight d-block'>
                                  <MedicalSignatureFormSeccion prop={getData} obj={obj} form={form}
                                    tipoLicencia={inhumacion === false ? 'Cremación' : 'Inhumación'} />

                                </div>
                                <div className='row ml-5'>
                                  <div className='col-lg-12 col-sm-12 col-md-12 text-center'>
                                    <Button type='primary' htmlType='button' onClick={() => GuardarMedico()}>
                                      Guardar o Modificar
                                    </Button>
                                  </div>
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
                                    href='#collapse-9'
                                    aria-expanded='false'
                                    aria-controls='collapse-2'
                                  >
                                    Documentos Soporte
                                  </a>
                                </h5>
                              </div>
                              <div id='collapse-9' className='collapse' data-parent='#accordion' aria-labelledby='heading-2'>
                                <div className='fadeInRight d-block'>
                                  <InformacionDocumentosGestion prop={getDataDocumentos} obj={obj} id={inhumacion ? 'inhumacion' : 'Cremación'} escambio={'actualizacion'}
                                    instType={insttype} reconocido={false} tramite={'No Aplica'} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </>)

            }
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
