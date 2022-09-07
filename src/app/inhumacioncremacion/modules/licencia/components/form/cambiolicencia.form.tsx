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
import { UploadOutlined } from '@ant-design/icons';
import { Alert, Input, Radio, RadioChangeEvent, Switch, Upload } from 'antd';
import moment from 'moment';
import { GeneralInfoFormSeccion } from './seccions/general-info.form-seccion';
import { EditInhumacion } from './edit/Inhumacion';
import { DeathInstituteFormSeccion } from './seccions/death-institute.form-seccion';
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import { SolicitudInfoFormSeccion } from './seccions/solicitud-info.form-seccion';
import { DatoSolicitanteAdd } from './seccions/datoSolicitanteAdd';
import { CementerioInfoFormSeccion } from './seccions/cementerio-info.form-seccion';
import { InformacionDocumentosGestion } from './seccions/documentos-gestion.seccion';

export const CambioLicencia = ({ props }: any) => {
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [form] = Form.useForm<any>();

  const [licencia, setLicencia] = useState<boolean>(true);
  const [nn, setnn] = useState<boolean>(false);
  const [valores, setvalores] = useState<string>('tramite');


  const obj: any = EditInhumacion('0');
  console.log(obj)

  const date = moment(obj.dateOfBirth);

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

  //validaciones tipos de documentos
  const [longitudmaxima, setLongitudmaxima] = useState<number>(10);
  const [longitudminima, setLongitudminima] = useState<number>(5);
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




  const [datecorrect, setdatecorrect] = useState<boolean>(true);
  const [posicion, setposicion] = useState<number>(0);


  const [l_paises, setpaises] = useState<any>([]);
  const [l_tipos_documento, settipos] = useState<any>([]);
  const [l_tipo_muerte, settipomuerte] = useState<any>([]);
  const [insttype, setinsttype] = useState<string>(obj?.instType);

  const { setStatus } = useStepperForm<any>(form);

  const getListas = useCallback(async () => {

    const paises: any = localStorage.getItem('paises');
    const paisesjson: any = JSON.parse(paises);


    const tipos: any = localStorage.getItem('tipoid');
    const tiposjson: any = JSON.parse(tipos);

    const tipomuerte: any = localStorage.getItem('tipomuerte');

    const nuevalista = tiposjson.filter((i: { id: string }) => i.id != '7c96a4d3-a0cb-484e-a01b-93bc39c7902e');

    settiposautoriza(nuevalista);

    settipomuerte(JSON.parse(tipomuerte));
    settipos(tiposjson);
    setpaises(paisesjson);

  }, []);

  useEffect(() => {
    getListas();
  }, []);





  const onSubmit = async (values: any) => {
    var bandera = false;
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
    if (bandera) {
      const formatDate = 'MM-DD-YYYY';
      obj.persona[posicion].primerNombre = values.name;
      obj.persona[posicion].segundoNombre = values.secondName;
      obj.persona[posicion].primerApellido = values.surname;
      obj.persona[posicion].segundoApellido = values.secondSurname;

      if (values.time._i == 'Fecha invalida') {
        obj.hora = 'Sin información';
      } else {
        obj.hora = values.check === true ? 'Sin información' : moment(values.time).format('LT');
      }
      obj.numeroCertificado = values.numerocert;
      obj.fechaDefuncion = moment(values.date).format(formatDate);
      obj.sinEstablecer = values.check;

      obj.idSexo = values.sex;

      await api.putLicencia(obj);

      if (nn) {
        let container = '';
        switch (obj.idTramite) {
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
      setLicencia(false);
      Swal.fire({
        icon: 'success',

        title: 'Solicitud Modificada',
        text: 'Se ha modificado la Solicitud exitosamente'
      });
    } else {
      Swal.fire({
        title: 'Usuario Registrado',
        text: 'El Número de Certificado ya se Encuentra Registrado',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        },
        icon: 'info'
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

  const getData = (longitud: number, procedencia: any) => {
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


  //validacion fecha de nacimiento
  const FechaNacimiento = (value: any) => {
    const valorfecha = form.getFieldValue('dateOfBirth');

    if (valorfecha != undefined) {
      const fecha = moment(valorfecha);
      const time = form.getFieldValue('timenac');
      let time2 = undefined;
      if (time != undefined) {
        time2 = moment(time).format('LT');
      }

      const timedef = form.getFieldValue('time');
      let timedef2 = undefined;
      if (timedef != undefined) {
        timedef2 = moment(timedef).format('LT');
      }

      let tiempo = '';
      if (timedef2 != undefined) {
        if (tipodocumentohoranacimiento == '71f659be-9d6b-4169-9ee2-e70bf0d65f92') {
          if (time2 != undefined) {
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

      let valor = form.getFieldValue('date');
      let fechadef = moment(valor);

      if (!fecha.isBefore(fechadef)) {
        if (tiempo == 'es valida') {
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
        }

        setdatecorrect(false);
      } else {
        setdatecorrect(true);
      }
    }
  };

  const getDataSolicitante = (solicitante: any) => { };

  const getDataDocumentos = (rowData: string, valor: string) => {
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

  const [isOtherParentesco, setIsOtherParentesco] = useState(false);
  const onChangeParentesco = (e: RadioChangeEvent) => {
    form.resetFields(['authOtherParentesco']);
    setIsOtherParentesco(e.target.value === 'Otro');
  };


  //validacion Tipo de documento//
  const cambiodocumento = (value: any) => {
    const valor: string = value;
    settipodocumentohoranacimiento(valor);

    const valorupper = valor.toUpperCase();
    setsininformacion(false);

    if (valorupper == 'C087D833-3CFB-460F-AA78-E5CF2FE83F25') {
      form.setFieldsValue({ IDNumber: undefined });
      setLongitudminima(5);
      setLongitudmaxima(15);
      setTipocampo('[a-zA-Z0-9]{5,15}');
      setTipocampovalidacion(/[a-zA-Z0-9]/);
      setTipodocumento('Sin Información');
      setCampo('AlfaNuméricos(Numéros y letras)');
      setsininformacion(true);
    } else {
      if (valorupper == '7C96A4D3-A0CB-484E-A01B-93BC39C7902E') {
        setLongitudminima(2);
        setLongitudmaxima(10);
        setTipocampo('[0-9]{2,10}');
        setTipocampovalidacion(/[0-9]/);
        setCampo('Numéricos');
        setTipodocumento('Tipo de Protocolo');
        form.setFieldsValue({ IDNumber: '8001508610' });
      } else {
        form.setFieldsValue({ IDNumber: undefined });
        if (valorupper == '7C96A4D3-A0CB-484E-A01B-93BC39C2552E') {
          setLongitudminima(4);
          setLongitudmaxima(10);
          setTipocampo('[0-9]{4,10}');
          setTipocampovalidacion(/[0-9]/);
          setCampo('Numéricos');
          setTipodocumento('Cédula de Ciudadanía');
        } else {
          if (valorupper == 'AC3629D8-5C87-46CE-A8E2-530B0495CBF6') {
            setLongitudminima(10);
            setLongitudmaxima(11);
            setTipocampo('[0-9]{10,11}');
            setTipocampovalidacion(/[0-9]/);
            setCampo('Numéricos');
            setTipodocumento('Tarjeta de Identidad ');
          } else {
            if (valorupper == '2491BC4B-8A60-408F-9FD1-136213F1E4FB') {
              setLongitudminima(15);
              setLongitudmaxima(15);
              setTipocampo('[0-9]{15,15}');
              setTipocampovalidacion(/[0-9]/);
              setCampo('Numéricos');
              setTipodocumento('Permiso Especial de Permanencia');
            } else {
              if (valorupper == 'FFE88939-06D5-486C-887C-E52D50B7F35D' || valorupper == '71F659BE-9D6B-4169-9EE2-E70BF0D65F92') {
                setLongitudminima(10);
                setLongitudmaxima(11);
                setTipocampo('[a-zA-Z0-9]{10,11}');
                setTipocampovalidacion(/[a-zA-Z0-9]/);
                setCampo('AlfaNuméricos(Numéros y letras)');
                setTipodocumento('Registro Civil de Nacimiento y Numero único de identificacíon personal');
              } else {
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
  };

  //validacion documento autorizacion
  const cambiodocumentoautoriza = (value: any) => {
    form.setFieldsValue({ mauthIDNumber: undefined });
    const valor: string = value;
    const valorupper = valor.toUpperCase();
    setsininformacionaut(false);

    if (valorupper == 'C087D833-3CFB-460F-AA78-E5CF2FE83F25') {
      setLongitudminimaautoriza(5);
      setLongitudmaximaautoriza(15);
      setTipodocumentoautoriza('Sin Información');
      setTipocampoautoriza('[a-zA-Z0-9]{5,15}');
      setTipocampovalidacionautoriza(/[a-zA-Z0-9]/);
      setCampoautoriza('AlfaNuméricos(Numéros y letras)');
      setsininformacionaut(true);
    } else {
      if (valorupper == '7C96A4D3-A0CB-484E-A01B-93BC39C2552E') {
        setLongitudminimaautoriza(4);
        setLongitudmaximaautoriza(10);
        setTipocampoautoriza('[0-9]{4,10}');
        setTipocampovalidacionautoriza(/[0-9]/);
        setCampoautoriza('Numéricos');
        setTipodocumentoautoriza('Cédula de Ciudadanía');
      } else {
        if (valorupper == 'AC3629D8-5C87-46CE-A8E2-530B0495CBF6') {
          setLongitudminimaautoriza(10);
          setLongitudmaximaautoriza(11);
          setTipocampoautoriza('[0-9]{10,11}');
          setTipocampovalidacionautoriza(/[0-9]/);
          setCampoautoriza('Numéricos');
          setTipodocumentoautoriza('Tarjeta de Identidad ');
        } else {
          if (valorupper == '2491BC4B-8A60-408F-9FD1-136213F1E4FB') {
            setLongitudminimaautoriza(15);
            setLongitudmaximaautoriza(15);
            setTipocampoautoriza('[0-9]{15,15}');
            setTipocampovalidacionautoriza(/[0-9]/);
            setCampoautoriza('Numéricos');
            setTipodocumentoautoriza('Permiso Especial de Permanencia');
          } else {
            if (valorupper == 'FFE88939-06D5-486C-887C-E52D50B7F35D' || valorupper == '71F659BE-9D6B-4169-9EE2-E70BF0D65F92') {
              setLongitudminimaautoriza(10);
              setLongitudmaximaautoriza(11);
              setTipocampoautoriza('[a-zA-Z0-9]{10,11}');
              setTipocampovalidacionautoriza(/[a-zA-Z0-9]/);
              setCampoautoriza('AlfaNuméricos(Numéros y letras)');
              setTipodocumentoautoriza('Registro Civil de Nacimiento y Numero único de identificacíon personal');
            } else {
              setLongitudminimaautoriza(6);
              setLongitudmaximaautoriza(10);
              setTipocampoautoriza('[a-zA-Z0-9]{6,10}');
              setTipocampovalidacionautoriza(/[a-zA-Z0-9]/);
              setCampoautoriza('AlfaNuméricos(Numéros y letras)');
              setTipodocumentoautoriza('Pasaporte , Cédula de Extranjería y  Tarjeta de Extranjería ');
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
              <div className='col-lg-12 col-sm-12 col-md-12 justify-content-center text-center'>
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
                      <div className='col-lg-12 col-sm-12 col-md-12 col-xl-14'>
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
                                  <GeneralInfoFormSeccion obj={obj} causaMuerte={''} tipoLicencia={'Cremación'} />

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
                                    tipoLicencia={obj.idTramite === 'a289c362-e576-4962-962b-1c208afa0273' ? 'Cremación' : 'Inhumación'}
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
                                <div className='fadeInRight d-block'>





                                  <Form.Item label='Primer Nombre' name='name' rules={[{ required: true, max: 50 }]} initialValue={obj.name}>
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
                                    initialValue={obj.secondName}
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
                                    initialValue={obj.surname}
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
                                    initialValue={obj.secondSurname}
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
                                    label='Nacionalidad'
                                    name='nationalidad'
                                    initialValue={obj.nationalidad}
                                    rules={[{ required: true }]}
                                  >
                                    <SelectComponent
                                      options={l_paises}
                                      placeholder='-- Elija una nacionalidad --'
                                      optionPropkey='id'
                                      optionPropLabel='descripcion'
                                    />
                                  </Form.Item>
                                  <div className='form-row ml-4'>
                                    {tipodocumentohoranacimiento == '71f659be-9d6b-4169-9ee2-e70bf0d65f92' && (
                                      <>
                                        <Form.Item label='Hora' name='timenac' style={{ width: 380 }}>
                                          <DatepickerComponent
                                            picker='time'
                                            dateDisabledType='default'
                                            onChange={FechaNacimiento}
                                            dateFormatType='time'
                                            placeholder='-- Elija una hora --'
                                            style={{ width: 100 }}
                                          />
                                        </Form.Item>
                                      </>
                                    )}

                                    <Form.Item
                                      label='Fecha de Nacimiento'
                                      style={{ width: tipodocumentohoranacimiento == '71f659be-9d6b-4169-9ee2-e70bf0d65f92' ? 400 : 750 }}
                                      name='dateOfBirth'
                                      rules={[{ required: true }]}
                                      initialValue={date}
                                    >
                                      <DatepickerComponent
                                        picker='date'
                                        onChange={FechaNacimiento}
                                        dateDisabledType='before'
                                        dateFormatType='default'
                                        style={{ width: tipodocumentohoranacimiento == '71f659be-9d6b-4169-9ee2-e70bf0d65f92' ? 200 : 530 }}
                                        value={date}
                                      />
                                    </Form.Item>
                                  </div>
                                  <Form.Item
                                    label='Tipo Identificación'
                                    name='IDType'
                                    initialValue={obj.IDType}
                                    rules={[{ required: true }]}
                                  >
                                    <SelectComponent
                                      options={l_tipos_documento}
                                      onChange={cambiodocumento}
                                      optionPropkey='id'
                                      optionPropLabel='descripcion'
                                    />
                                  </Form.Item>
                                  <Form.Item label='Número de Identificación' initialValue={obj.IDNumber} name='IDNumber' rules={[{ required: !sininformacion }]}>
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
                                    label='Tipo de Muerte'
                                    name='deathType'
                                    initialValue={obj.deathType}
                                    rules={[{ required: true }]}
                                  >
                                    <SelectComponent options={l_tipo_muerte} optionPropkey='id' optionPropLabel='descripcion' />
                                  </Form.Item>




                                </div>
                              </div>
                            </div>
                          </div>
                          {obj.idTramite === 'a289c362-e576-4962-962b-1c208afa0273' && (
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
                                    <div className='fadeInRight d-block'>
                                      <div className='fadeInRight'>
                                        <Form.Item {...layoutWrapper}>
                                          <Alert
                                            message='Diligencie la información del familiar o persona que autoriza la cremación.'
                                            type='warning'
                                            showIcon
                                          />
                                        </Form.Item>

                                        <Form.Item
                                          label='Tipo Documento'
                                          name='authIDType'
                                          initialValue={'7c96a4d3-a0cb-484e-a01b-93bc39c2552e'}
                                          rules={[{ required: true }]}
                                        >
                                          <SelectComponent
                                            options={l_tipos_documento_autoriza}
                                            onChange={cambiodocumentoautoriza}
                                            optionPropkey='id'
                                            optionPropLabel='descripcion'
                                          />
                                        </Form.Item>

                                        <Form.Item
                                          label='Número de Identificación'
                                          name='mauthIDNumber'
                                          rules={[{ required: !sininformacionaut }]}

                                        >
                                          <Input
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

                                          rules={[{ required: true, max: 50 }]}
                                        >
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

                                          rules={[{ max: 50 }]}
                                          name='authSecondName'
                                        >
                                          <Input
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

                                          name='authSurname'
                                          rules={[{ required: true, max: 50 }]}
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

                                          name='authSecondSurname'
                                          rules={[{ max: 50 }]}
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
                                          label='Parentesco'
                                          initialValue={'Cónyuge (Compañero/a Permanente)'}
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

                                  <SolicitudInfoFormSeccion prop={getDataSolicitante} form={form} obj={obj} />
                                  <DatoSolicitanteAdd prop={getData} form={form} obj={obj} />
                                  <CementerioInfoFormSeccion obj={obj} form={form}
                                    tipoLicencia={obj.idTramite === 'a289c362-e576-4962-962b-1c208afa0273' ? 'Cremación' : 'Inhumación'} />

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

                                  <InformacionDocumentosGestion prop={getDataDocumentos} obj={obj} id={obj.idTramite ===
                                    'a289c362-e576-4962-962b-1c208afa0273' ? 'Cremación' : 'Inhumación'} escambio={true}
                                    instType={insttype} />

                                </div>
                              </div>
                            </div>
                          </div>

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
