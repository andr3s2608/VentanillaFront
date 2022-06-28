import React, { useCallback, useEffect, useState } from 'react';
import logo from '../../../../src/assets/images/aguas/alcadia.png';
import '../../../../src/scss/antd/App.css';
import profile from '../../../../src/assets/images/aguas/profile.png';
import Button from 'antd/es/button';
import { useHistory } from 'react-router';
import { Form, Input } from 'antd';
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import { dominioService, ETipoDominio, IDepartamento, IDominio, IMunicipio } from 'app/services/dominio.service';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { ApiService } from 'app/services/Apis.service';
import { useStepperForm } from 'app/shared/hooks/stepper.hook';
import Swal from 'sweetalert2';
import { DatepickerComponent } from 'app/shared/components/inputs/datepicker.component';

export const RevisarSv = () => {
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

  const getListas = useCallback(
    async () => {
      //const resp = await dominioService.get_type(ETipoDominio['Tipo Documento']);
      const tipoDocumento = await dominioService.get_type(ETipoDominio['Tipo Documento']);
      const departamentos = await dominioService.get_departamentos_colombia();
      const municipios = await dominioService.get_all_municipios_by_departamento(idDepartamentoBogota);

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
    <div>
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
                  <p>Validador</p>
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
                <p>Número de radicado</p>
                <div className='form-group gov-co-form-group'>
                  <Form.Item label='Número de radicado' name='numeroradicado' required={false}>
                    <Input type='text' className='form-control gov-co-form-control' disabled={true} defaultValue={''} />
                  </Form.Item>
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Tipo de tramite</p>
                <div className='form-group gov-co-form-group'>
                  <Form.Item label='Tipo de Tramite' name='tipotramite' required={true}>
                    <SelectComponent options={[]} optionPropkey='' />
                  </Form.Item>
                </div>
              </div>
            </div>

            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Estado</p>
                <div className='form-group gov-co-form-group '>
                  <div className='gov-co-dropdown'>
                    <Form.Item label='Estado' name='estado' required={true}>
                      <SelectComponent options={[]} optionPropkey={''} />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Actividad actual</p>
                <div className='form-group gov-co-form-group'>
                  <div className='gov-co-dropdown'>
                    <Form.Item label='Actividad Actual' name='actactual' required={true}>
                      <SelectComponent options={[]} optionPropkey={''} />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Actividad siguiente </p>
                <div className='form-group gov-co-form-group'>
                  <Form.Item label='Actividad Siguiente' name='actsiguiente' required={true}>
                    <Input
                      type='text'
                      className='form-control gov-co-form-control'
                      onKeyPress={(event) => {
                        if (!/[a-zA-Z ]/.test(event.key)) {
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
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Usuario asignado</p>
                <div className='form-group gov-co-form-group'>
                  <div className='gov-co-dropdown'>
                    <Form.Item label='Usuario Asignado' name='usuarioasignado' required={true}>
                      <SelectComponent options={[]} optionPropkey={''} />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Subred de jurisdicción </p>
                <div className='form-group gov-co-form-group'>
                  <div className='gov-co-dropdown'>
                    <Form.Item label='Subred de Jurisdicción' name='subred' required={true}>
                      <SelectComponent options={[]} optionPropkey={''} />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='row mt-5'>
            <div className='col-lg-12 col-sm-12 col-md-12'>
              <div className='info-tramite mt-2'>
                <p className='ml-2' style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  Datos del solicitante. <br /> <small style={{ color: '#000' }}>* Campos Obligatorios</small>
                </p>
              </div>

              <div className='col-lg-6col-sm-4 col-md-6 mt-2 ml-1'>
                <div className='panel-search'>
                  <p>Tipo de solicitante*</p>
                  <div className='form-group gov-co-form-group'>
                    <div className='gov-co-dropdown'>
                      <Form.Item label='Tipo de Solicitante' name='persona' rules={[{ required: true }]}>
                        <SelectComponent
                          options={[
                            { key: 'natural', value: 'Persona Natural' },
                            { key: 'juridica', value: 'Persona Jurídica' }
                          ]}
                          defaultValue={'PERSONA NATURAL'}
                          optionPropkey='key'
                          optionPropLabel='value'
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='col-lg-4 col-sm-4 col-md-4 mt-4 ml-2'>
              <div className='panel-search'>
                <p>Tipo de documento</p>
                <div className='form-group gov-co-form-group'>
                  <div className='gov-co-dropdown'>
                    <Form.Item
                      label='Tipo de Identificación'
                      name='IDType'
                      initialValue={'7c96a4d3-a0cb-484e-a01b-93bc39c2552e'}
                      rules={[{ required: true }]}
                    >
                      <SelectComponent
                        options={l_tipos_documento}
                        onChange={cambiodocumento}
                        optionPropkey='id'
                        optionPropLabel='descripcion'
                        defaultValue={'7c96a4d3-a0cb-484e-a01b-93bc39c2552e'}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-sm-4 col-md-4 mt-4 ml-2'>
              <div className='panel-search'>
                <p>Número de documento</p>

                <div className='form-group gov-co-form-group'>
                  <Form.Item label='Número de Identificación' name='IDNumber' rules={[{ required: !sininformacion }]}>
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
                </div>
              </div>
            </div>

            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Primer nombre</p>
                <div className='form-group gov-co-form-group'>
                  <Form.Item label='Primer Nombre' name='name' required={true}>
                    <Input
                      type='text'
                      className='form-control gov-co-form-control'
                      onKeyPress={(event) => {
                        if (!/[a-zA-Z ]/.test(event.key)) {
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
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Segundo nombre</p>
                <div className='form-group gov-co-form-group'>
                  <Form.Item label='Segundo Nombre' name='secondname' required={false}>
                    <Input
                      type='text'
                      className='form-control gov-co-form-control'
                      onKeyPress={(event) => {
                        if (!/[a-zA-Z ]/.test(event.key)) {
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
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Primer apellido </p>
                <div className='form-group gov-co-form-group'>
                  <Form.Item label='Primer Apellido' name='surname' required={true}>
                    <Input
                      type='text'
                      className='form-control gov-co-form-control'
                      onKeyPress={(event) => {
                        if (!/[a-zA-Z ]/.test(event.key)) {
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
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Segundo apellido</p>
                <div className='form-group gov-co-form-group'>
                  <Form.Item label='Segundo Apellido' name='secondsurname' required={false}>
                    <Input
                      type='text'
                      className='form-control gov-co-form-control'
                      onKeyPress={(event) => {
                        if (!/[a-zA-Z ]/.test(event.key)) {
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
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Teléfono de contacto 1 </p>
                <div className='form-group gov-co-form-group'>
                  <Form.Item label='Teléfono de Contacto' name='telefono' required={true}>
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
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Teléfono de contacto 2</p>
                <div className='form-group gov-co-form-group'>
                  <Form.Item label='Teléfono de Contacto 2' name='telefono2' required={false}>
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
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Correo electrónico </p>
                <div className='form-group gov-co-form-group'>
                  <Form.Item label='Correo Electrónico' name='email' required={false}>
                    <input
                      type='text'
                      className='form-control gov-co-form-control'
                      onKeyPress={(event) => {
                        if (!/[a-zA-Z0-9ZñÑ@._-]/.test(event.key)) {
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
          <div className='row mt-5'>
            <div className='col-lg-12 col-sm-12 col-md-12'>
              <div className='info-tramite mt-2'>
                <p className='ml-2' style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  Información del lugar de revisión . <br /> <small style={{ color: '#000' }}>* Campos Obligatorios</small>
                </p>
              </div>
              <div className='row'>
                <div className='col-lg-6 col-sm-12 col-md-6' style={{ marginLeft: '5px' }}>
                  <p>Dirección de domicilio</p>
                  <div className='form-group gov-co-form-group'>
                    <Form.Item label='Dirección de Domicilio' name='direccion' required={true}>
                      <Input
                        type='text'
                        className='form-control gov-co-form-control'
                        onKeyPress={(event) => {
                          if (!/[a-zA-Z0-9-#]/.test(event.key)) {
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
                <div className='col-lg-2 col-sm-12 col-md-12' style={{ marginTop: '32px', marginLeft: '12px' }}>
                  <button className='ml-4 mr-3 float-right button btn btn-round btn-high' style={{ backgroundColor: '#BABABA' }}>
                    Buscar
                  </button>
                </div>
              </div>
            </div>

            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Departamento</p>
                <div className='form-group gov-co-form-group'>
                  <Form.Item label='Departamento' name='departamento' initialValue={idDepartamentoBogota} required={true}>
                    <SelectComponent
                      options={l_departamentos}
                      optionPropkey='idDepartamento'
                      optionPropLabel='descripcion'
                      onChange={onChangeDepartamento}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Municipio</p>
                <div className='form-group gov-co-form-group'>
                  <Form.Item label='Municipio' name='municipio' initialValue={idBogotac} rules={[{ required: true }]}>
                    <SelectComponent
                      options={l_municipios}
                      optionPropkey='idMunicipio'
                      optionPropLabel='descripcion'
                      value={idBogotac}
                      searchValue={idBogotac}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Vereda </p>
                <div className='form-group gov-co-form-group'>
                  <Form.Item label='Vereda' name='vereda' required={true}>
                    <Input
                      type='text'
                      className='form-control gov-co-form-control'
                      onKeyPress={(event) => {
                        if (!/[a-zA-Z0-9 ]/.test(event.key)) {
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
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Sector</p>
                <div className='form-group gov-co-form-group'>
                  <Form.Item label='Sector' name='sector' required={true}>
                    <Input
                      type='text'
                      className='form-control gov-co-form-control'
                      onKeyPress={(event) => {
                        if (!/[a-zA-Z0-9 ]/.test(event.key)) {
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
          <div className='row mt-3 '>
            <div className='col-lg-8 col-sm-12 col-md-8'>
              <p className='ml-2'>Observaciones adicionales</p>
              <div className='form-group gov-co-form-group'>
                <Form.Item label='Observaciones Adicionales' name='observations' rules={[{ required: false }]}>
                  <Input.TextArea rows={5} maxLength={230} value={'Hola'} style={{ width: '360px' }} />
                </Form.Item>
              </div>
            </div>

            <div className='col-lg-12 col-sm-12 col-md-12 mt-4'>
              <div className='info-tramite mt-2'>
                <p className='ml-2' style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  Citación de revisión . <br /> <small style={{ color: '#000' }}>* Campos Obligatorios</small>
                </p>
              </div>
            </div>

            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Fecha de citación</p>
                <Form.Item label='fecha de citación' name='date' rules={[{ required: true }]}>
                  <DatepickerComponent picker='date' dateDisabledType='default' dateFormatType='default' />
                </Form.Item>
              </div>
            </div>
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2'>
              <div className='panel-search'>
                <p>Formulario</p>
                <div className='form-group gov-co-form-group ml-2'>
                  <div className='gov-co-dropdown'>
                    <Form.Item>
                      <SelectComponent placeholder='-- Persona Natural --' options={[]} optionPropkey={''} />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-8 col-sm-12 col-md-8 mt-3'>
              <p className='ml-2'>Observaciones adicionales</p>

              <div className='form-group gov-co-form-group'>
                <Form.Item label='Observaciones Adicionales Citacion' name='observationsCitacion' rules={[{ required: false }]}>
                  <Input.TextArea rows={5} maxLength={230} value={'Hola'} style={{ width: '360px' }} />
                </Form.Item>
              </div>
            </div>
            <div className='col-lg-8 col-md-8 col-sm-12 mt-4'>
              <Button
                className='ml-3 float-right button btn btn-default'
                style={{ backgroundColor: '#CBCBCB', border: '2px solid #CBCBCB', color: '#000' }}
                type='primary'
                htmlType='button'
                onClick={() => {
                  history.push('/tramites-servicios/Revision/vista-revision');
                }}
              >
                Enviar
              </Button>
              <button className='float-right button btn btn-default' style={{ backgroundColor: '#CBCBCB' }}>
                Guardar
              </button>
              <button className='mr-3 float-right button btn btn-default' style={{ backgroundColor: '#CBCBCB' }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
