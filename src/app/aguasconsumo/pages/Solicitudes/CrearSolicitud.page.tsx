import { DatosFuente, KeysForm as KeyFormFuenteAbastecimiento } from '../../Components/seccions/Fuente_Abastecimiento.seccion';
import { RequestSolicitudDTO, ResponseSolicitudDTO } from '../../Models/RequestSolicitudDTO';
import { DatosAdicionales } from '../../Components/seccions/Informacion_Adicional.seccion';
import { DatosSolicitante } from '../../Components/seccions/DatosSolicitante.seccion';
import { layoutItems, layoutWrapper } from 'app/shared/utils/form-layout.util';
import { UbicacionPersona } from '../../Components/seccions/Ubicacion.seccion';
import { DatosDocumentos } from '../../Components/seccions/Documentos.seccion';
import { DatosAcueducto } from '../../Components/seccions/Acueductos.seccion';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { IConsesion } from '../../Models/IConsecion';
import { useStepperForm } from 'app/shared/hooks/stepper.hook';
import React, { useCallback, useEffect, useState } from 'react';
import { EditAguas } from '../../Components/edit/Aguas';
import { ApiService } from 'app/services/Apis.service';
import { Alert, Form, Input, Steps } from 'antd';
import { useHistory } from 'react-router';
import '../../../../css/estilos.css';
import Button from 'antd/es/button';
import Swal from 'sweetalert2';
import moment from 'moment';
import Tabs from 'antd/es/tabs';

const CrearSolicitud: React.FC<any> = (props: any) => {
  const { TabPane } = Tabs;

  const history = useHistory();
  const [form] = Form.useForm<any>();
  const objJson: any = EditAguas();

  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const { current, setCurrent, status, setStatus, onNextStep, onPrevStep } = useStepperForm<any>(form);
  const [validaciondocumento, setvalidacion] = useState<boolean>(false);
  const [acueducto, setacueducto] = useState<any[]>([]);
  const [informacion, setinformacion] = useState<any[]>([]);
  const [documento, setdocumento] = useState<any[]>([]);

  const onSubmit = async (values: any) => {
    console.log(values);
    const idUsuario = api.getIdUsuario();
    console.log(idUsuario);
    const archivo = values.cargarresolucion;
    let validacion = false;
    let planta = false;
    let acueductojson: any[] = [];

    let sistemajson: any[] = [];

    const ac: any[] = [];
    const sis: any[] = [];

    for (let index = 0; index < acueducto.length; index++) {
      ac.push({
        idUsuarioFuente: '00000000-0000-0000-0000-000000000000',
        idMunicipio: acueducto[index].municipio,
        idVereda: acueducto[index].localidad,
        Coo_long_cx: acueducto[index].longitud ?? '',
        Coo_lat_cy: acueducto[index].latitud ?? '',
        idUsoFuente: acueducto[index].usofuente,
        sector: '',
        descripcionOtroUso: acueducto[index].descripcion ?? '',
        caudalTotal: acueducto[index].caudal ?? '',
        idFuenteAbastecimiento: '00000000-0000-0000-0000-000000000000',
        idDepartamento: acueducto[index].departamento,
        idLocalidad: acueducto[index].localidad
      });
    }
    if (values.formradio == '1' || values.formradio == undefined) {
      if (informacion.length < 1) {
        Swal.fire({
          icon: 'error',
          title: 'Datos Incompletos',
          text: 'Debe registrar almenos 1 sistema de tratamiento'
        });
      } else {
        planta = true;
        validacion = true;
      }
    } else {
      planta = false;
      validacion = true;
    }
    if (validacion) {
      if (!validaciondocumento) {
        Swal.fire({
          icon: 'error',
          title: 'Datos Incompletos',
          text: 'Debe registrar almenos 1 documento'
        });
      } else {
        let aguacruda = 0;
        let descripcionsistema = 0;
        let analisisriesgo = 0;
        for (let index = 0; index < documento.length; index++) {

          if (documento[index] != undefined) {
            if (
              documento[index].id.toUpperCase() === '79572C8A-FFFE-440B-BE57-049B42B655A1' ||
              documento[index].id.toUpperCase() === 'C6D1F4B7-AFB9-4A1E-B9F9-0AEC2BA87346'
            ) {

              aguacruda++;
            }
            if (
              documento[index].id.toUpperCase() === '9EDCE704-F1D9-4F9D-8764-A436BDFE5FF0' ||
              documento[index].id.toUpperCase() === '9EDCE704-F1D9-4F9D-8764-A980BDFE5FF0' ||
              documento[index].id.toUpperCase() === '3C9CF345-E37D-4AB0-BACA-C803DBB8850B'
            ) {

              descripcionsistema++;
            }
            if (
              documento[index].id.toUpperCase() === 'B54F609C-02A3-42A0-B43C-02E055447EF7' ||
              documento[index].id.toUpperCase() === 'E9057F6C-9DBB-458E-9F5E-15D8F1677C66'
            ) {

              analisisriesgo++;
            }
          }
        }
        if (aguacruda > 0 && descripcionsistema > 0 && analisisriesgo > 0) {
          for (let index = 0; index < informacion.length; index++) {
            sis.push({
              idSistemaTratamiento: '00000000-0000-0000-0000-000000000000',
              idFuente: '00000000-0000-0000-0000-000000000000',
              sedimentador: informacion[index].sed,
              mezclaRapido: informacion[index].mezr,
              mezclaLento: informacion[index].mezl,
              oxidacion: informacion[index].oxi,
              floculador: informacion[index].flocula,
              filtracion: informacion[index].filt,
              desinfeccion: informacion[index].desin,
              almacenamiento: informacion[index].alma,
              torreAireacion: informacion[index].torre,
              precloracion: informacion[index].preclo,
              desarenador: informacion[index].desarenador,
              otra: informacion[index].otra,
              descripcionOtro: informacion[index].descrip ?? '',
              numUsuarioUrbanos: informacion[index].num1 ?? '',
              numUsuariosRurales: informacion[index].num2 ?? '',
              poblacionUrbanos: informacion[index].pob1 ?? '',
              poblacionRurales: informacion[index].pob2 ?? '',
              caudalDiseno: informacion[index].caudaldesign ?? '',
              caudalTratado: informacion[index].caudaltratado ?? ''
            });
          }
          sistemajson = sis;
          acueductojson = ac;
          const formatDate = 'MM-DD-YYYY';

          /** Código nuevo */
          const dataSolicitud: RequestSolicitudDTO = {
            idTipoTramite: values.tipotramite,
            idTipoSolicitud: 'B1BA9304-C16B-43F0-9AFA-E92D7B7F3DF9',
            idUsuario: idUsuario,
            temporal: false,
            persona: {
              tipoIdentificacion: values.IDType,
              rut: values.rut,
              numeroIdentificacion: values.IDNumber,
              primerNombre: values.name,
              segundoNombre: values.secondname,
              primerApellido: values.surname,
              segundoApellido: values.secondsurname,
              telefonoContacto: values.telefono,
              celularContacto: values.telefono2,
              correoElectronico: values.email.toString().toLowerCase(),
              idTipoPersona: values.persona,
              tipoDocumentoRazon: values?.IDTypeRazon ?? '',
              nit: values?.IDNumberRazon ?? '',
              razonSocial: values?.nombreEntidad ?? ''
            },
            ubicacion: {
              direccion: '',
              departamento: '00000000-0000-0000-0000-000000000000',
              municipio: '00000000-0000-0000-0000-000000000000',
              localidad: '00000000-0000-0000-0000-000000000000',
              vereda: '',
              sector: '',
              upz: '00000000-0000-0000-0000-000000000000',
              barrio: '00000000-0000-0000-0000-000000000000',
              observacion: ''
            }
          };

          const responseSolicitudDTO: ResponseSolicitudDTO = await api.AddSolicitudPrimera(dataSolicitud) as ResponseSolicitudDTO;

          console.log("resultado de guardado");
          console.log(responseSolicitudDTO);

          const json: IConsesion<any> = {
            idSolicitud: responseSolicitudDTO.idSolicitud,
            idPersona: idUsuario,
            idTipodeSolicitud: 'B1BA9304-C16B-43F0-9AFA-E92D7B7F3DF9',
            tipodeSolicitud: 'B1BA9304-C16B-43F0-9AFA-E92D7B7F3DF9',
            numeroRadicado: responseSolicitudDTO.numeroRadicado,
            fechaSolicitud: moment(Date()).format(formatDate),
            idEstado: '96D00032-4B60-4027-AFEA-0CC7115220B4',
            estado: '96D00032-4B60-4027-AFEA-0CC7115220B4',
            idFuente: '00000000-0000-0000-0000-000000000000',
            idUbicacion: '00000000-0000-0000-0000-000000000000',
            idSubred: '00000000-0000-0000-0000-000000000000',
            idActividadActualSolicitud: '2CA42F7E-8D8B-4550-B3EB-974A302CB449',
            actividadActualSolicitud: '00000000-0000-0000-0000-000000000000',
            actividadSiguienteSolicitud: '00000000-0000-0000-0000-000000000000',
            idTipodeTramite: '00000000-0000-0000-0000-000000000000',
            tipodeTramite: values.tipotramite,
            idUsuario: '00000000-0000-0000-0000-000000000000',
            idUsuarioAsignado: '00000000-0000-0000-0000-000000000000',
            idCitacionRevision: '00000000-0000-0000-0000-000000000000',
            idFuenteAbastecimiento: '00000000-0000-0000-0000-000000000000',
            temporal: true,
            persona: {
              idPersona: '00000000-0000-0000-0000-000000000000',
              numeroResolucion: values.nroresolucion,
              fechaResolucion: moment(values.dateresolucion).format(formatDate),
              tipoIdentificacion: values.IDType,
              numeroIdentificacion: values.IDNumber,
              primerNombre: values.name,
              segundoNombre: values.secondname,
              primerApellido: values.surname,
              segundoApellido: values.secondsurname,
              telefonoContacto: values.telefono,
              celularContacto: values.telefono2,
              correoElectronico: values.email,
              idTipoPersona: values.persona,
              tipoDocumentoRazon: values.IDTypeRazon,
              nit: values.IDNumberRazon,
              razonSocial: values.nombreEntidad
            },
            FuenteAbastecimiento: {
              idFuente: '00000000-0000-0000-0000-000000000000',
              idTipoFuente: values.tipofuente,
              idSubCategoriaFuente: values.subcategoria,
              idAutoridadAmbiental: values.autoridad,
              bocatoma_long_cx: values.longitud,
              bocatoma_lat_cy: values.latitud,
              nombre: values.nombrefuente,
              descripcionFuente: values.descripcionfuente,
              descripcionOtraFuente: values.descripcionotra,
              tienePlanta: planta,
              acueductosFuente: acueductojson,
              sistemaTratamiento: sistemajson
            }
          };



          const supportDocumentsEdit: any[] = [];
          const formData = new FormData();

          const documentosiniciales: any = localStorage.getItem('documentosiniciales');
          const documentosjson = JSON.parse(documentosiniciales);



          const supportDocumentsRejected: any[] = [];
          for (let index = 0; index < documentosjson.length; index++) {
            if (documentosjson[index] != null) {
              let cargo = false;

              for (let index2 = 0; index2 < documento.length; index2++) {

                if (documento[index2] != undefined) {

                  if (documento[index2].iddocumento.toUpperCase() === documentosjson[index].iddocumento.toUpperCase()) {

                    cargo = true;
                    break;
                  }
                }

              }
              if (cargo == false) {

                supportDocumentsRejected.push({
                  idSolicitud: responseSolicitudDTO.idSolicitud,
                  idTipoDocumentoAdjunto: documentosjson[index].id,
                  path: `${idUsuario}/${documentosjson[index].valor}_${responseSolicitudDTO.idSolicitud}`,
                  idUsuario: idUsuario,
                  idDocumentoAdjunto: documentosjson[index].iddocumento,
                  esValido: false
                });
              }
            }


          }


          documento.forEach((item: any, i: number) => {

            if (documento[i] != undefined) {
              const archivo = documento[i];
              if (archivo.subida == 'local') {
                formData.append('file', archivo.archivo.file);
                formData.append('nameFile', archivo.valor + '_' + responseSolicitudDTO.idSolicitud);

                supportDocumentsEdit.push({
                  idSolicitud: responseSolicitudDTO.idSolicitud,
                  idTipoDocumentoAdjunto: archivo.id,
                  path: `${idUsuario}/${archivo.valor}_${responseSolicitudDTO.idSolicitud}`,
                  idUsuario: idUsuario,
                  idDocumentoAdjunto: archivo.iddocumento != null ? archivo.iddocumento : '00000000-0000-0000-0000-000000000000',
                  esValido: true
                });
              }
            }
          });
          if (values?.cargarresolucion) {
            formData.append('file', values.cargarresolucion.file);
            formData.append('nameFile', 'Resolucion_renovacion' + '_' + responseSolicitudDTO.idSolicitud);

            supportDocumentsEdit.push({
              idSolicitud: responseSolicitudDTO.idSolicitud,
              idTipoDocumentoAdjunto: '9EDCE821-F1D9-4F9D-8764-A436BDFE5FF0',
              path: `${idUsuario}/Resolucion_renovacion_${responseSolicitudDTO.idSolicitud}`,
              idUsuario: idUsuario,
              idDocumentoAdjunto: '00000000-0000-0000-0000-000000000000',
              esValido: true
            });
          }

          formData.append('containerName', 'aguahumanos');
          formData.append('oid', idUsuario);

          const nube = await api.uploadFiles(formData);
          const bd = await api.UpdateSupportDocumentsAguas(supportDocumentsEdit);


          if (supportDocumentsRejected.length > 0) {

            const bdrejec = await api.UpdateSupportDocumentsAguas(supportDocumentsRejected);
          }

          const valor = await api.AddSolicitudConsecion(json);

          Swal.fire({
            icon: 'success',
            title: 'Solicitud Creada',
            text: `Se ha creado la Solicitud exitosamente con número de radicado ${responseSolicitudDTO.numeroRadicado}`
          });

          history.push('/tramites-servicios-aguas');

          localStorage.removeItem('register');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Datos Incompletos',
            text: 'Debe registrar almenos 1 documento para "Agua Cruda","Descripción del sistema de tratamiento" y "Análisis de riesgos"'
          });
        }
      }
    }
  };

  const onSubmitFailed = () => setStatus('error');

  const addacueducto = (value: any) => {
    setacueducto(value);
  };

  const addinfo = (value: any) => {
    setinformacion(value);
  };

  const adddocumento = (value: any) => {

    let va = 0;
    setdocumento(value);
    for (let index = 0; index < value.length; index++) {
      if (value[index] != undefined) {
        setvalidacion(true);
        break;
      } else {
        setvalidacion(false);
      }
    }
  };

  const validacionacueducto = () => {
    if (acueducto.length > 0) {
      onNextStep([...KeyFormFuenteAbastecimiento]);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Datos Incompletos',
        text: 'Debe registrar almenos 1 acueducto'
      });
    }
  };

  const validarDatosSocilitante = async (form: any) => {
    try {
      await form.validateFields(['tipotramite', 'persona', 'name', 'IDType', 'IDNumber', 'surname', 'telefono', 'email']);
      onNextStep();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Datos Incompletos',
        text: 'Debe completar los campos obligatorios para continuar'
      });
    }
  }

  return (
    <div className='fadeInTop container-fluid'>
      <div className='container-fluid'>
        <div className='card'>
          <div className='card-body'>
            <Form form={form} {...layoutItems} layout='horizontal' onFinish={onSubmit} onFinishFailed={onSubmitFailed}>
              <section className='info-panel'>
                <div className='container'>
                  <div className='row mt-2'>
                    <div className='col-lg-6 col-sm-12 col-md-6'>
                      <div className='info-secion'>
                        <nav aria-label='breadcrumb' style={{ backgroundColor: '#fff' }}>
                          <ol className='breadcrumb'>
                            <li className='breadcrumb-item'>
                              <a href='#'>Inicio</a>
                            </li>
                            <li className='breadcrumb-item active' aria-current='page'>
                              Crear Solicitud
                            </li>
                          </ol>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className='panel-menu'>
                <div className='col-lg-12 col-md-12 ml-4 col-sm-12 '>
                  <div className='row mt-3'>
                    <div className='col-lg-12 col-md-12'>
                      <div className='info-tramite'>
                        <p>Trámite: Autorización Sanitaria Para La Concesión De Aguas Para El Consumo Humano</p>
                      </div>
                    </div>
                  </div>

                  {/** ==================================================================== */}
                  {/** Sección para pestaña de formulario de cargue de datos del soliciante */}
                  {/** ==================================================================== */}
                  <div className={` ${current != 0 && 'd-none'} fadeInRight ${current == 0 && 'd-block'}`}>
                    <div className='row mt-3'>
                      <div className='col-lg-12 col-sm-12 col-md-12'>
                        <div className='info-tramite mt-2'>
                          <p className='ml-2' style={{ fontSize: '18px', fontWeight: 'bold' }}>
                            Datos de la solicitud<br /> <small style={{ color: '#000' }}>* Campos Obligatorios</small>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className='row primeros_campos'>
                      <DatosSolicitante form={form} obj={null} tipo={'coordinador'} habilitar={true} />
                    </div>
                    <div className='row mt-5 ml-2 '>
                      <div className='col-lg-12 col-sm-12 col-md-12 contenedor_ubi'>
                        <UbicacionPersona form={form} obj={null} tipo={null} vista={'servicios'} />
                      </div>
                    </div>
                    <div className='row mt-5 justify-content-md-center'>
                      <div className='col-4'>
                        <Button className='button btn btn-default'
                          style={{ backgroundColor: '#BABABA', border: '2px solid #BABABA', color: '#000' }}
                          onClick={() => {
                            history.push('/tramites-servicios-aguas');
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                      <div className="col-4">
                        <Button className='button btn btn-default'
                          style={{ backgroundColor: '#CBCBCB', border: '2px solid #CBCBCB', color: '#000' }}
                          type='primary' htmlType='button'
                          onClick={() => validarDatosSocilitante(form)}
                        >
                          Siguiente
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/** ==================================================================== */}
                  {/**    Sección para pestaña de cargar informacion de fuentes estudiada   */}
                  {/** ==================================================================== */}
                  <div className={` ${current != 1 && 'd-none'} fadeInRight ${current == 1 && 'd-block'}`}>
                    <div className='row mt-5 ml-2'>
                      <p className='ml-2' style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        Datos de la fuente de abastecimiento. <br />{' '}
                        <small style={{ color: '#000' }}>* Campos Obligatorios</small>
                      </p>
                      <DatosFuente form={form} obj={objJson} tipo={'usuario'} habilitar={true} />
                    </div>
                    <div className='row mt-5 ml-2'>
                      <p className='ml-2' style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        Información de acueductos que captan la misma fuente. . <br />{' '}
                        <small style={{ color: '#000' }}>* Campos Obligatorios</small>
                      </p>
                      <DatosAcueducto form={form} tipoSolicitud="primera-vez" obj={objJson} prop={addacueducto} habilitar={true} />
                    </div>
                    <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
                      <div className='row mt-4'>
                        <div className='col-lg-8 col-md-8 col-sm-12 mt-2'>
                          <Button type='dashed' htmlType='button' onClick={onPrevStep}>
                            Volver atrás
                          </Button>
                          <Button
                            className='ml-3 float-right button btn btn-default'
                            style={{ backgroundColor: '#CBCBCB', border: '2px solid #CBCBCB', color: '#000' }}
                            type='primary'
                            htmlType='button'
                            onClick={() => validacionacueducto()}
                          >
                            Siguiente
                          </Button>
                          <Button
                            className='mr-5 float-right button btn btn-default'
                            style={{ backgroundColor: '#BABABA', border: '2px solid #BABABA', color: '#000' }}
                            onClick={() => {
                              history.push('/tramites-servicios-aguas');
                            }}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </Form.Item>
                  </div>

                  {/** ============================================================= */}
                  {/**            Sección para pestaña de cargue de archivos        **/}
                  {/** ============================================================= */}
                  <div className={` ${current != 2 && 'd-none'} fadeInRight ${current == 2 && 'd-block'}`}>
                    <div className='row mt-5 ml-2'>
                      <p className='ml-2' style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        Información adicional de la fuente de abastecimiento. <br />{' '}
                        <small style={{ color: '#000' }}>* Campos Obligatorios</small>
                      </p>
                      <DatosAdicionales form={form} tipoSolicitud='primera-vez' obj={objJson} tipo={'validador'} prop={addinfo} habilitar={true} />
                    </div>

                    <Alert
                      message='Información!'
                      description='Por favor registre los documentos pertienentes a la fuente de abastecimientos,entre ellos los relacionados
                    a: 1.Agua Cruda(La caracterización del agua cruda,Resultados previos de agua cruda (no mayor a 12 meses)) ,
                    2.Descripción del sistema de tratamiento(Planos, memorias y cálculo de diseño de la planta de tratamiento de agua para consumo humano,
                      Manual de operación y mantenimiento,Plan de de cumplimiento o el plan de acción) y 3.Análisis de riesgos
                      (Plan de contingencia de los sistemas de suministro,Documento de la identificación del riesgos).
                    '
                      type='info'
                    />
                    <div className='row mt-5 ml-2'>
                      <DatosDocumentos form={form} obj={objJson} prop={adddocumento} tipo={undefined} />
                    </div>
                    <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
                      <div className='row mt-4'>
                        <div className='col-lg-8 col-md-8 col-sm-12 mt-2'>
                          <Button type='dashed' htmlType='button' onClick={onPrevStep}>
                            Volver atrás
                          </Button>
                          <Button
                            className='ml-4 float-right button btn btn-default'
                            style={{ backgroundColor: '#BABABA', border: '2px solid #BABABA', color: '#000' }}
                            type='primary'
                            htmlType='submit'
                          >
                            Enviar
                          </Button>
                          <Button
                            className='mr-3 float-right button btn btn-default'
                            style={{ backgroundColor: '#BABABA', border: '2px solid #BABABA', color: '#000' }}
                            onClick={() => {
                              history.push('/tramites-servicios-aguas');
                            }}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </Form.Item>
                  </div>
                </div>
              </section>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearSolicitud;
