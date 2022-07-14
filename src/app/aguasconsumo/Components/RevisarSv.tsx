import React, { useCallback, useEffect, useState } from 'react';
import logo from '../../../../src/assets/images/aguas/alcadia.png';

import profile from '../../../../src/assets/images/aguas/profile.png';
import Button from 'antd/es/button';
import { useHistory } from 'react-router';
import { Form, Input, Upload } from 'antd';
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import { dominioService, ETipoDominio, IDepartamento, IDominio, IMunicipio } from 'app/services/dominio.service';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { ApiService } from 'app/services/Apis.service';
import { useStepperForm } from 'app/shared/hooks/stepper.hook';
import { layoutItems, layoutWrapper } from 'app/shared/utils/form-layout.util';
import Swal from 'sweetalert2';
import { DatepickerComponent } from 'app/shared/components/inputs/datepicker.component';
import { UploadOutlined } from '@ant-design/icons';
import { DatosSolicitud } from './seccions/Datos_Solicitud.seccion';
import { DatosSolicitante } from './seccions/DatosSolicitante.seccion';
import { CitacionRevision } from './seccions/Citacion_Revision.seccion';
import { IRegistroSolicitudCitacion } from 'app/aguasconsumo/Components/Models/IRegistroSolicitudCitacion';
import { UbicacionPersona } from './seccions/Ubicacion.seccion';
import { EditAguas } from './edit/Aguas';
import moment from 'moment';
import '../../../css/estilos.css';

export const RevisarSv = () => {
  const objJson: any = EditAguas();
  const [l_tipos_documento, setListaTipoDocumento] = useState<IDominio[]>([]);
  const history = useHistory();
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [form] = Form.useForm<any>();
  const [l_departamentos, setLDepartamentos] = useState<IDepartamento[]>([]);
  const [l_municipios, setLMunicipios] = useState<IMunicipio[]>([]);
  const { current, setCurrent, status, setStatus, onNextStep, onPrevStep } = useStepperForm<any>(form);

  const idDepartamentoBogota = '31b870aa-6cd0-4128-96db-1f08afad7cdd';
  const idmunicipio = '0e2105fb-08f8-4faf-9a79-de5effa8d198';

  //validacion campos
  const [longitudmaxima, setLongitudmaxima] = useState<number>(10);
  const [longitudminima, setLongitudminima] = useState<number>(5);
  const [tipocampo, setTipocampo] = useState<string>('[0-9]{5,10}');
  const [tipocampovalidacion, setTipocampovalidacion] = useState<any>(/[0-9]/);
  const [tipodocumento, setTipodocumento] = useState<string>('Cédula de Ciudadanía');
  const [campo, setCampo] = useState<string>('Numéricos');
  const [idBogotac, setIdBogota] = useState<string>('Bogotá D.C.');
  const [sininformacion, setsininformacion] = useState<boolean>(false);

  //

  const [l_usuarios, setLl_usuarios] = useState<any[]>([]);
  const [rol, setrol] = useState<any>();

  const getListas = useCallback(
    async () => {
      const mysRoles = await api.GetRoles();

      const [permiso] = mysRoles;

      setrol(permiso.rol);

      const tipoDocumento = await dominioService.get_type(ETipoDominio['Tipo Documento']);
      const departamentos = await dominioService.get_departamentos_colombia();
      const municipios = await dominioService.get_all_municipios_by_departamento(idDepartamentoBogota);

      const lusuarios = await api.getFuncionarios();
      const usuarios: any[] = [];
      usuarios.push({ idPersona: 'vacio', fullName: 'No Asignar', oid: 'vacio' });

      for (let index = 0; index < lusuarios.length; index++) {
        usuarios.push(lusuarios.at(index));
      }

      setLl_usuarios(usuarios);

      setLDepartamentos(departamentos);
      setListaTipoDocumento(tipoDocumento);
      setLMunicipios(municipios);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cambiodocumento = (value: any) => {
    const valor: string = value;
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
          setLongitudminima(5);
          setLongitudmaxima(10);
          setTipocampo('[0-9]{5,10}');
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

  const onSubmit = async (values: any) => {
    setStatus(undefined);
    const formatDate = 'MM-DD-YYYY';
    const dep = values.departamento;
    var mun = values.municipio;
    switch (dep) {
      case '31b870aa-6cd0-4128-96db-1f08afad7cdd':
        mun = '31211657-3386-420a-8620-f9C07a8ca491';
        break;
    }

    const json: IRegistroSolicitudCitacion<any> = {
      solicitud: {
        idSolicitud: objJson.idsolicitud + '',
        idPersona: objJson.idPersona + '',
        idTipodeSolicitud: '492E1C24-B2A4-45FD-8845-D9AC1E569928',
        tipodeSolicitud: '492E1C24-B2A4-45FD-8845-D9AC1E569928',
        numeroRadicado: objJson.numeroradicado,
        fechaSolicitud: objJson.fechaSolicitud,
        idEstado: values.estado,
        estado: '',
        idFuente: '00000000-0000-0000-0000-000000000000',
        idUbicacion: objJson.idUbicacion,
        idSubred: objJson.idSubred,
        idActividadActualSolicitud: '771FA7F5-4C75-4AC3-95A1-7F78C29D2F50',
        actividadActualSolicitud: '',
        actividadSiguienteSolicitud: objJson?.idactividadActualSolicitud,

        idTipodeTramite: values.tipotramite,
        tipodeTramite: '',
        idUsuario: objJson.idusuario,
        idUsuarioAsignado: values.usuarioasignado,
        idCitacionRevision: '00000000-0000-0000-0000-000000000000',

        idFuenteAbastecimiento: '00000000-0000-0000-0000-000000000000',
        temporal: false,

        persona: {
          idPersona: objJson.idPersona,
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
          tipoDocumentoRazon: values?.IDTypeRazon ?? '',
          nit: values?.IDNumberRazon ?? '',
          razonSocial: values?.nombreEntidad ?? ''
        },

        ubicacion: {
          idUbicacion: objJson.idUbicacion,
          direccion: values.direccion,
          departamento: values.departamento,
          municipio: mun,
          localidad: values?.localidad ?? '00000000-0000-0000-0000-000000000000',
          vereda: values.vereda,
          sector: values.sector,
          upz: objJson.upz,
          barrio: objJson.barrio,
          observacion: values.observations
        },

        citacion_Revision: {
          idCitacion: '00000000-0000-0000-0000-000000000000',
          fechaCitacion: moment(values.date).format(formatDate),
          observacion: values.observationsCitacion,
          fechaRegistro: '',
          idSolicitud: '00000000-0000-0000-0000-000000000000',
          idUsuario: values.funcionario
        }
      }
    };

    await api.AddSolicitudCitacion(json);

    const supportDocumentsEdit: any[] = [];
    const formData = new FormData();

    const archivo = values.cargarArchivo.file;

    formData.append('file', archivo);
    formData.append('nameFile', 'Documento_revision' + '_' + objJson.idsolicitud);

    supportDocumentsEdit.push({
      idSolicitud: objJson.idsolicitud,
      idTipoDocumentoAdjunto: '3C9CF345-E37D-4AB0-BACA-C803DBB5380B',
      path: `${objJson.idusuario}/Documento_revision_${objJson.idsolicitud}`,
      idUsuario: objJson.idusuario
    });

    formData.append('containerName', 'aguahumanos');
    formData.append('oid', objJson.idusuario);

    await api.uploadFiles(formData);
    await api.AddSupportDocumentsAguas(supportDocumentsEdit);

    history.push('/tramites-servicios-aguas');
  };

  const onSubmitFailed = () => setStatus('error');

  const onChangeDepartamento = async (value: string) => {
    form.setFieldsValue({ municipio: undefined });
    const depart = await dominioService.get_departamentos_colombia();
    let departamento = (await depart).filter((i) => i.idDepartamento == value);
    const { idDepartamento } = departamento[0];

    if (value == '31b870aa-6cd0-4128-96db-1f08afad7cdd') {
      setIdBogota('Bogotá D.C.');
    } else {
      setIdBogota('');
    }
    const resp = await dominioService.get_all_municipios_by_departamento(idDepartamento);
    setLMunicipios(resp);
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
                    <div className='img-bogota '>
                      <img src={logo} alt='logo' className='img-fluid float-end mr-2' />
                    </div>
                  </div>
                  <div className='col-lg-6 col-md-6 col-sm-6'>
                    <div className='img-profile'>
                      <img src={profile} alt='logo' className='img-fluid float-end mr-2' />
                      <div className='info-usuario'>
                        <Form.Item>
                          <span className='ant-form-text mr-2 text'>{rol}</span>
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='row mt-2'>
                  <div className='col-lg-6 col-sm-12 col-md-6'>
                    <div className='info-secion'>
                      <nav aria-label='breadcrumb'>
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
                <section className='panel-menu'>
                  <div className='container'>
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
                  </div>
                </section>
                <div className='row mt-5'>
                  <div className='col-lg-12 col-md-12'>
                    <div className='info-tramite mt-3 ml-3'>
                      <p>Trámite: Autorización sanitaria para la concesión de aguas para el consumo humano.</p>
                    </div>
                  </div>
                </div>
                <div className='row mt-5 ml-2'>
                  <DatosSolicitud form={form} obj={objJson} tipo={'validador'} />
                </div>
                <div className='row mt-5 ml-2'>
                  <DatosSolicitante form={form} obj={objJson} tipo={'coordinador'} />
                </div>
                <div className='row mt-5 ml-2'>
                  <UbicacionPersona form={form} obj={objJson} tipo={objJson.tipodeSolicitud} />
                </div>
                <div className='row mt-5 ml-2'>
                  <CitacionRevision form={form} obj={objJson} tipo={'Funcionario'} />
                </div>
                <div className='row mt-3 '>
                  <div className='col-lg-8 col-md-8 col-sm-12 mt-4'>
                    <div className='accion ml-4'>
                      <Button
                        className='ml-3 float-right button btn btn-default'
                        style={{ backgroundColor: '#CBCBCB', border: '2px solid #CBCBCB', color: '#000' }}
                        type='primary'
                        htmlType='submit'
                      >
                        Enviar
                      </Button>
                      <Button
                        type='primary'
                        className='float-right button btn btn-default'
                        style={{ backgroundColor: '#CBCBCB', border: '2px solid #CBCBCB', color: '#000' }}
                        disabled
                      >
                        Guardar
                      </Button>
                      <Button
                        className='mr-3 float-right button btn btn-default'
                        type='primary'
                        style={{ backgroundColor: '#CBCBCB', border: '2px solid #CBCBCB', color: '#000' }}
                        onClick={() => {
                          history.push('/tramites-servicios-aguas');
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </Form>
        </div>
      </div>
    </div>
  );
};
