import React from 'react';
import logo from '../../../../src/assets/images/aguas/alcadia.png';
import '../../../css/estilos.css';
import profile from '../../../../src/assets/images/aguas/profile.png';
import Button from 'antd/es/button';
import { DatosFuente, KeysForm as KeyFormFuenteAbastecimiento } from './seccions/Fuente_Abastecimiento.seccion';

import { DatosAcueducto } from './seccions/Acueductos.seccion';
import { useHistory } from 'react-router';
import { Form, Input } from 'antd';
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import form from 'antd/es/form';
import { layoutItems } from 'app/shared/utils/form-layout.util';
import { EditAguas } from './edit/Aguas';
import { useStepperForm } from 'app/shared/hooks/stepper.hook';

export const PrimeraU = () => {
  const history = useHistory();
  const [form] = Form.useForm<any>();
  //const objJson: any = EditAguas();
  const objJson: any = undefined;
  const { current, setCurrent, status, setStatus, onNextStep, onPrevStep } = useStepperForm<any>(form);

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
              <div className={` ${current != 0 && 'd-none'} fadeInRight ${current == 0 && 'd-block'}`}>
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
                        <Form.Item>
                          <input
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
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                  <div className='col-lg-4 col-sm-4 col-md-4 mt-2'>
                    <div className='panel-search'>
                      <p>Tipo trámite</p>
                      <div className='form-group gov-co-form-group'>
                        <Form.Item>
                          <input
                            type='text'
                            className='form-control gov-co-form-control'
                            onKeyPress={(event) => {
                              if (!/[a-zA-Z]/.test(event.key)) {
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
                </div>

                <div className='row mt-5 ml-2'>
                  <DatosFuente form={form} obj={objJson} tipo={'validador'} />
                </div>
                <div className='row mt-5 ml-2'>
                  <DatosAcueducto form={form} obj={objJson} />
                </div>

                <div className='row mt-4'>
                  <div className='col-lg-8 col-md-8 col-sm-12 mt-2'>
                    <Button
                      className='ml-3 float-right button btn btn-default'
                      style={{ backgroundColor: '#CBCBCB', border: '2px solid #CBCBCB', color: '#000' }}
                      type='primary'
                      htmlType='button'
                      onClick={() => onNextStep([...KeyFormFuenteAbastecimiento])}
                    >
                      Siguiente
                    </Button>

                    <Button
                      className='mr-3 float-right button btn btn-default'
                      type='dashed'
                      onClick={onPrevStep}
                      style={{ backgroundColor: '#CBCBCB', border: '2px solid #CBCBCB', color: '#000' }}
                    >
                      Cancelar
                    </Button>
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
