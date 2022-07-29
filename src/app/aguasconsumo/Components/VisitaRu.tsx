import { SelectComponent } from 'app/shared/components/inputs/select.component';
import { DatosSolicitante } from './seccions/DatosSolicitante.seccion';
import profile from '../../../../src/assets/images/aguas/profile.png';
import logo from '../../../../src/assets/images/aguas/alcadia.png';
import '../../../css/estilos.css';
import { useHistory } from 'react-router';
import { UbicacionPersona } from './seccions/Ubicacion.seccion';
import { useStepperForm } from 'app/shared/hooks/stepper.hook';
import Button from 'antd/es/button';
import { Form, FormInstance, Input } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { ApiService } from 'app/services/Apis.service';
import { CitacionRevision } from './seccions/Citacion_Revision.seccion';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { layoutItems, layoutWrapper } from 'app/shared/utils/form-layout.util';
import { EditAguas } from './edit/Aguas';

export const VisitaRu = () => {
  const history = useHistory();
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const objJson: any = EditAguas();

  const [form] = Form.useForm<any>();
  const [rol, setrol] = useState<any>();
  const { current, setCurrent, status, setStatus, onNextStep, onPrevStep } = useStepperForm<any>(form);
  const [[l_tramites, l_estados, l_subredes], setListas] = useState<[any[], any[], any[]]>([[], [], []]);

  const getListas = useCallback(
    async () => {
      const mysRoles = await api.GetRoles();
      const [permiso] = mysRoles;

      setrol(permiso.rol);

      const resp = await Promise.all([api.getTipoTramites(), api.getEstadosSolicitudAguas(), api.getSubredes()]);
      setListas(resp);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (values: any) => {};

  const onSubmitFailed = () => setStatus('error');

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
                      <p>Número de radicado</p>
                      <div className='form-group gov-co-form-group'>
                        <Form.Item initialValue={objJson?.numeroradicado} name='numeroRadicado'>
                          <Input
                            type='text'
                            className='form-control gov-co-form-control'
                            onKeyPress={(event) => {
                              if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                              }
                            }}
                            onPaste={(event) => {
                              event.preventDefault();
                            }}
                            disabled
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                  <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
                    <div className='panel-search'>
                      <p>Tipo de tramite</p>
                      <div className='form-group gov-co-form-group'>
                        <Form.Item initialValue={objJson?.idtipodeTramite} name='tipotramite' rules={[{ required: true }]}>
                          <SelectComponent
                            options={l_tramites}
                            defaultValue={objJson?.idtipodeTramite}
                            optionPropkey='idTipoTramite'
                            optionPropLabel='descripcion'
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>

                  <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
                    <div className='panel-search'>
                      <p>Subred de jurisdicción </p>
                      <div className='form-group gov-co-form-group '>
                        <div className='gov-co-dropdown'>
                          <Form.Item name='subred' rules={[{ required: false }]}>
                            <SelectComponent
                              options={l_subredes}
                              defaultValue={objJson?.idSubred}
                              optionPropkey='idSubRed'
                              optionPropLabel='zona'
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row mt-5 ml-2'>
                  <DatosSolicitante obj={objJson} form={form} tipo={'revision'} />
                </div>
                <div className='row mt-5 ml-2'>
                  <UbicacionPersona form={form} obj={objJson} tipo={objJson.tipodeSolicitud} vista={'revision'} />
                </div>
                <div className='row mt-5 ml-2'>
                  <CitacionRevision form={form} obj={objJson} tipo={'Usuario'} />
                </div>
                <div className='row mt-3 '>
                  <div className='col-lg-8 col-md-8 col-sm-12 mt-4'>
                    <div className='accion ml-4'>
                      <Button
                        className='ml-3 float-right button btn btn-default'
                        style={{ backgroundColor: '#CBCBCB', border: '2px solid #CBCBCB', color: '#000' }}
                        type='primary'
                        htmlType='submit'
                        onClick={() => {
                          history.push('/tramites-servicios-aguas');
                        }}
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
interface DatosVisita<T> {
  form: FormInstance<T>;
  obj: any;
}
