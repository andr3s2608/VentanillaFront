import React, { useCallback, useEffect, useState } from 'react';
import logo from '../../../../src/assets/images/aguas/alcadia.png';
import '../../../css/estilos.css';
import profile from '../../../../src/assets/images/aguas/profile.png';
import Button from 'antd/es/button';
import { DatosFuente, KeysForm as KeyFormFuenteAbastecimiento } from './seccions/Fuente_Abastecimiento.seccion';

import { DatosAcueducto } from './seccions/Acueductos.seccion';
import { DatosAdicionales } from './seccions/Informacion_Adicional.seccion';
import { DatosDocumentos } from './seccions/Documentos.seccion';
import { useHistory } from 'react-router';
import { Alert, Form, Input, Steps } from 'antd';
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import form from 'antd/es/form';
import { layoutItems, layoutWrapper } from 'app/shared/utils/form-layout.util';
import { EditAguas } from './edit/Aguas';
import { useStepperForm } from 'app/shared/hooks/stepper.hook';
import { ApiService } from 'app/services/Apis.service';
import { authProvider } from 'app/shared/utils/authprovider.util';
import Swal from 'sweetalert2';
import { IConsesion } from './Models/IConsecion';
import moment from 'moment';

export const PrimeraU = () => {
  const history = useHistory();
  const [form] = Form.useForm<any>();
  const objJson: any = EditAguas();
  //const objJson: any = undefined;
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const { current, setCurrent, status, setStatus, onNextStep, onPrevStep } = useStepperForm<any>(form);
  const [l_tramites, setl_tramites] = useState<any[]>([]);
  const [validaciondocumento, setvalidacion] = useState<boolean>(false);
  const [acueducto, setacueducto] = useState<any[]>([]);
  const [informacion, setinformacion] = useState<any[]>([]);
  const [documento, setdocumento] = useState<any[]>([]);

  const getListas = useCallback(
    async () => {
      const tipos = await api.getTipoTramites();
      setl_tramites(tipos);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (values: any) => {
    console.log('El formulario es:');
    console.log(values);
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
              documento[index].id === '79572C8A-FFFE-440B-BE57-049B42B655A1' ||
              documento[index].id === 'C6D1F4B7-AFB9-4A1E-B9F9-0AEC2BA87346'
            ) {
              aguacruda++;
            }
            if (
              documento[index].id === '9EDCE704-F1D9-4F9D-8764-A436BDFE5FF0' ||
              documento[index].id === '9EDCE704-F1D9-4F9D-8764-A980BDFE5FF0' ||
              documento[index].id === '3C9CF345-E37D-4AB0-BACA-C803DBB8850B'
            ) {
              descripcionsistema++;
            }
            if (
              documento[index].id === 'B54F609C-02A3-42A0-B43C-02E055447EF7' ||
              documento[index].id === 'E9057F6C-9DBB-458E-9F5E-15D8F1677C66'
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
              caudalDiseño: informacion[index].caudaldesign ?? '',
              caudalTratado: informacion[index].caudaltratado ?? ''
            });
          }
          sistemajson = sis;
          acueductojson = ac;
          const formatDate = 'MM-DD-YYYY';

          const json: IConsesion<any> = {
            idSolicitud: objJson.idsolicitud,
            idPersona: objJson.idPersona,
            idTipodeSolicitud: objJson.idtipodeSolicitud,
            tipodeSolicitud: objJson.tipodeSolicitud,
            numeroRadicado: objJson.numeroradicado,
            fechaSolicitud: objJson.fechaSolicitud,
            idEstado: objJson.idestado,
            estado: objJson.estado,
            idFuente: '00000000-0000-0000-0000-000000000000',
            idUbicacion: '00000000-0000-0000-0000-000000000000',
            idSubred: '00000000-0000-0000-0000-000000000000',

            idActividadActualSolicitud: objJson.idactividadActualSolicitud,
            actividadActualSolicitud: objJson.actividadActualSolicitud,

            actividadSiguienteSolicitud: objJson.actividadSiguienteSolicitud,

            idTipodeTramite: '00000000-0000-0000-0000-000000000000',
            tipodeTramite: objJson.tipodeTramite,

            idUsuario: '00000000-0000-0000-0000-000000000000',
            idUsuarioAsignado: '00000000-0000-0000-0000-000000000000',

            idCitacionRevision: '00000000-0000-0000-0000-000000000000',

            idFuenteAbastecimiento: objJson?.idFuente ?? '00000000-0000-0000-0000-000000000000',
            temporal: true,

            persona: {
              idPersona: objJson.idPersona,
              numeroResolucion: values.nroresolucion,
              fechaResolucion: moment(values.dateresolucion).format(formatDate),
              tipoIdentificacion: objJson.tipoIdentificacion,
              numeroIdentificacion: objJson.numeroIdentificacion,
              primerNombre: objJson.primerNombre,
              segundoNombre: objJson.segundoNombre,
              primerApellido: objJson.primerApellido,
              segundoApellido: objJson.segundoApellido,
              telefonoContacto: objJson.telefonoContacto,
              celularContacto: objJson.celularContacto,
              correoElectronico: objJson.correoElectronico,
              idTipoPersona: objJson.idTipoPersona,
              tipoDocumentoRazon: objJson.tipoDocumentoRazon,
              nit: objJson.nit,
              razonSocial: objJson.razonSocial
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

          const valor = await api.AddSolicitudConsecion(json);

          const supportDocumentsEdit: any[] = [];
          const formData = new FormData();

          documento.forEach((item: any, i: number) => {
            if (documento[i] != undefined) {
              const archivo = documento[i];
              if (archivo.subida == 'local') {
                formData.append('file', archivo.archivo.file);
                formData.append('nameFile', archivo.valor + '_' + objJson.idsolicitud);

                supportDocumentsEdit.push({
                  idSolicitud: objJson.idsolicitud,
                  idTipoDocumentoAdjunto: archivo.id,
                  path: `${objJson.idusuario}/${archivo.valor}_${objJson.idsolicitud}`,
                  idUsuario: objJson.idusuario
                });
              }
            }
          });
          if (values?.cargarresolucion) {
            formData.append('file', values.cargarresolucion.file);
            formData.append('nameFile', 'Resolucion_renovacion' + '_' + objJson.idsolicitud);

            supportDocumentsEdit.push({
              idSolicitud: objJson.idsolicitud,
              idTipoDocumentoAdjunto: '9EDCE821-F1D9-4F9D-8764-A436BDFE5FF0',
              path: `${objJson.idusuario}/Resolucion_renovacion_${objJson.idsolicitud}`,
              idUsuario: objJson.idusuario
            });
          }

          formData.append('containerName', 'aguahumanos');
          formData.append('oid', objJson.idusuario);

          const nube = await api.uploadFiles(formData);
          const bd = await api.AddSupportDocumentsAguas(supportDocumentsEdit);

          Swal.fire({
            icon: 'success',

            title: 'Solicitud Actualizada',
            text: `Se ha actualizado la Solicitud exitosamente `
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

  return (
    <div className='container-fluid'>
      <div className='card'>
        <div className='card-body'>
          <Form form={form} {...layoutItems} layout='horizontal' onFinish={onSubmit} onFinishFailed={onSubmitFailed}>
            <section className='info-panel'>
              <div className='container'>
                <div className='row mt-5'>
                  <div className='col-lg-6 col-md-6 col-sm-6'>
                    <div className='img-bogota'>
                      <img src={logo} alt='logo' className='img-fluid float-end ml-2' />
                    </div>
                  </div>
                  <div className='col-lg-6 col-md-6 col-sm-6'>
                    <div className='img-profile'>
                      <img src={profile} alt='logo' className='img-fluid float-end mr-2' />
                      <div className='info-usuario'>
                        <p>Subdirector</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row mt-2'>
                  <div className='col-lg-6 col-sm-12 col-md-6'>
                    <div className='info-secion'>
                      <nav aria-label='breadcrumb' style={{ backgroundColor: '#fff' }}>
                        <ol className='breadcrumb'>
                          <li className='breadcrumb-item'>
                            <a href='#'>Inicio</a>
                          </li>
                          <li className='breadcrumb-item'>
                            <a href='#'>Bandeja de entrada</a>
                          </li>
                          <li className='breadcrumb-item active' aria-current='page'>
                            Revisar solicitud
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
                <div className='row'>
                  <div className='col-lg-12 col-md-12 ml-4 col-sm-12 '>
                    <div className='ubi-menu' style={{ marginLeft: '-12px' }}>
                      <nav className='nav panel'>
                        <a className='nav-link active' href='#'>
                          1. Solicitar revisión
                        </a>
                        <a className='nav-link' href='#'>
                          2. Crear Solicitud
                        </a>
                        <a className='nav-link' href='#'>
                          3. En gestión
                        </a>
                        <a className='nav-link disabled' href='#'>
                          4. Respuesta
                        </a>
                      </nav>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-lg-12 col-md-12'>
                    <div className='info-tramite mt-3 ml-2'>
                      <p>Trámite: Autorización sanitaria para la concesión de aguas para el consumo humano.</p>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-lg-12 col-sm-12 col-md-12'>
                    <div className='info-tramite mt-2'>
                      <p className='ml-2' style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        Datos de la solicitud. <br /> <small style={{ color: '#000' }}>* Campos Obligatorios</small>
                      </p>
                    </div>
                  </div>
                  <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
                    <div className='panel-search'>
                      <p className='text'>Número de radicado</p>
                      <div className='form-group gov-co-form-group'>
                        <Form.Item name='nroradicado' initialValue={objJson?.numeroradicado} rules={[{ required: false }]}>
                          <input
                            type='text'
                            className='form-control gov-co-form-control'
                            disabled={true}
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
                  </div>
                  <div className='col-lg-4 col-sm-4 col-md-4 mt-2'>
                    <div className='panel-search'>
                      <p>Tipo trámite</p>
                      <div className='form-group gov-co-form-group'>
                        <Form.Item name='tipotramite' initialValue={objJson?.idtipodeTramite} rules={[{ required: false }]}>
                          <SelectComponent
                            options={l_tramites}
                            defaultValue={objJson?.idtipodeTramite}
                            optionPropkey='idTipoTramite'
                            optionPropLabel='descripcion'
                            disabled={true}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                </div>
                <>
                  <div className={` ${current != 0 && 'd-none'} fadeInRight ${current == 0 && 'd-block'}`}>
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
                      <DatosAcueducto form={form} obj={objJson} prop={addacueducto} habilitar={true} />
                    </div>
                    <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
                      <div className='row mt-4'>
                        <div className='col-lg-8 col-md-8 col-sm-12 mt-2'>
                          <Button
                            className='mr-3 float-right button btn btn-default'
                            style={{ backgroundColor: '#BABABA', border: '2px solid #BABABA', color: '#000' }}
                            onClick={() => {
                              history.push('/tramites-servicios-aguas');
                            }}
                          >
                            Cancelar
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
                        </div>
                      </div>
                    </Form.Item>
                  </div>
                </>
                <>
                  <div className={` ${current != 1 && 'd-none'} fadeInRight ${current == 1 && 'd-block'}`}>
                    <div className='row mt-5 ml-2'>
                      <p className='ml-2' style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        Información adicional de la fuente de abastecimiento. <br />{' '}
                        <small style={{ color: '#000' }}>* Campos Obligatorios</small>
                      </p>
                      <DatosAdicionales form={form} obj={objJson} tipo={'validador'} prop={addinfo} habilitar={true} />
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
                      <DatosDocumentos form={form} obj={objJson} prop={adddocumento} tipo={null} />
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
                </>
              </div>
            </section>
          </Form>
        </div>
      </div>
    </div>
  );
};
