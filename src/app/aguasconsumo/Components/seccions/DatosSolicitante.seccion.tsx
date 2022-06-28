import { SelectComponent } from 'app/shared/components/inputs/select.component';
import { Form, FormInstance, Input } from 'antd';
import {
  dominioService,
  ETipoDominio,
  IBarrio,
  IDepartamento,
  IDominio,
  ILocalidad,
  IMunicipio,
  IUpz
} from 'app/services/dominio.service';
import React, { useCallback, useEffect, useState } from 'react';
import { ApiService } from 'app/services/Apis.service';
import { authProvider } from 'app/shared/utils/authprovider.util';
import Swal from 'sweetalert2';

export const DatosSolicitante: React.FC<DatosSolicitante<any>> = (props) => {
  const { obj, form } = props;
  /** la variable tipoSolicitante se termina de ajustar cuando se consumar el end-point */

  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [l_tipos_documento, setListaTipoDocumento] = useState<IDominio[]>([]);
  const [l_tipos_documentoRazon, setListaTipoDocumentoRazon] = useState<IDominio[]>([]);

  const [tipoSolicitante, settipoSolicitante] = useState<boolean>(true);

  //validacion campos
  const [longitudmaxima, setLongitudmaxima] = useState<number>(10);
  const [longitudminima, setLongitudminima] = useState<number>(5);
  const [tipocampo, setTipocampo] = useState<string>('[0-9]{5,10}');
  const [tipocampovalidacion, setTipocampovalidacion] = useState<any>(/[0-9]/);
  const [tipodocumento, setTipodocumento] = useState<string>('Cédula de Ciudadanía');
  const [campo, setCampo] = useState<string>('Numéricos');

  const [sininformacion, setsininformacion] = useState<boolean>(false);
  //

  //validacion campos Razon
  const [longitudmaximaRazon, setLongitudmaximaRazon] = useState<number>(10);
  const [longitudminimaRazon, setLongitudminimaRazon] = useState<number>(5);
  const [tipocampoRazon, setTipocampoRazon] = useState<string>('[0-9-]{10,10}');
  const [tipocampovalidacionRazon, setTipocampovalidacionRazon] = useState<any>(/[0-9-]/);
  const [tipodocumentoRazon, setTipodocumentoRazon] = useState<string>('Nit');
  const [campoRazon, setCampoRazon] = useState<string>('Numéricos');

  const [sininformacionRazon, setsininformacionRazon] = useState<boolean>(false);

  if (obj != null) {
    if (obj.idTipoPersona == 'Persona Natural') {
      settipoSolicitante(true);
    } else {
      settipoSolicitante(false);
    }
  }

  //

  const getListas = useCallback(
    async () => {
      //const resp = await dominioService.get_type(ETipoDominio['Tipo Documento']);
      const tipoDocumento = await dominioService.get_type(ETipoDominio['Tipo Documento']);
      const tipoDocumentorazon = await api.getTipoDocumeto();
      const listDocument = tipoDocumentorazon.map((res: any) => {
        return { id: res.idTipoIdentificacion, descripcion: res.descripcion };
      });
      setListaTipoDocumentoRazon(listDocument);

      setListaTipoDocumento(tipoDocumento);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Onchangetipo = (value: any) => {
    console.log('entro ', value);
    if (value == 'juridica') {
      settipoSolicitante(false);
    } else {
      settipoSolicitante(true);
    }
  };

  const cambiodocumentoRazon = (value: any) => {
    form.setFieldsValue({ IDNumberRazon: undefined });
    const valor: string = value;
    if (valor == '1') {
      setLongitudminimaRazon(5);
      setLongitudmaximaRazon(10);
      setTipocampoRazon('[0-9]{5,10}');
      setTipocampovalidacionRazon(/[0-9]/);
      setCampoRazon('Numéricos');
      setTipodocumentoRazon('Cédula de Ciudadanía');
    } else {
      setLongitudminimaRazon(10);
      setLongitudmaximaRazon(10);
      setTipocampoRazon('[0-9-]{10,10}');
      setTipocampovalidacionRazon(/[0-9-]/);
      setCampoRazon('Numéricos y guion');
      setTipodocumentoRazon('Nit');
    }
  };

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

  return (
    <>
      <div className='col-lg-12 col-sm-12 col-md-12'>
        <div className='info-tramite mt-2'>
          <p className='ml-2' style={{ fontSize: '18px', fontWeight: 'bold' }}>
            Datos del solicitante. <br /> <small style={{ color: '#000' }}>* Campos Obligatorios</small>
          </p>
        </div>

        <div className='col-lg-6 col-sm-4 col-md-6 mt-2'>
          <div className='panel-search'>
            <div className='form-group gov-co-form-group'>
              <div className='gov-co-dropdown'>
                <Form.Item label='Tipo de Solicitante' name='persona' rules={[{ required: true }]}>
                  <SelectComponent
                    options={[
                      { key: 'natural', value: 'Persona Natural' },
                      { key: 'juridica', value: 'Persona Jurídica' }
                    ]}
                    onChange={Onchangetipo}
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

      {!tipoSolicitante ? (
        <>
          <div className='col-lg-4 col-sm-4 col-md-4 mt-4 ml-2'>
            <div className='panel-search'>
              <div className='form-group gov-co-form-group'>
                <div className='gov-co-dropdown'>
                  <Form.Item
                    label='Tipo de documento:'
                    initialValue={obj?.tipoDocumentoRazon ?? 5}
                    required={true}
                    name='IDTypeRazon'
                  >
                    <SelectComponent
                      options={l_tipos_documentoRazon}
                      onChange={cambiodocumentoRazon}
                      optionPropkey='id'
                      optionPropLabel='descripcion'
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
          </div>

          <div className='col-lg-4 col-sm-4 col-md-4 mt-4 ml-2'>
            <div className='panel-search'>
              <div className='form-group gov-co-form-group'>
                <Form.Item label='Número de documento' initialValue={obj?.nit} required={true} name='IDNumberRazon'>
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

          <div className='col-lg-4 col-sm-4 col-md-4 mt-4 ml-2'>
            <div className='panel-search'>
              <div className='form-group gov-co-form-group'>
                <Form.Item label='Nombre de la entidad' initialValue={obj?.razonSocial} required={true} name='nombreEntidad'>
                  <Input
                    type='text'
                    className='form-control gov-co-form-control'
                    maxLength={100}
                    onKeyPress={(event) => {
                      if (!/[a-zA-Z0-0- ]/.test(event.key)) {
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
        </>
      ) : null}

      <div className='col-lg-4 col-sm-4 col-md-4 mt-4 ml-2'>
        <div className='panel-search'>
          <div className='form-group gov-co-form-group'>
            <div className='gov-co-dropdown'>
              <Form.Item
                label='Tipo de documento:'
                required={true}
                initialValue={obj?.tipoIdentificacion ?? '7c96a4d3-a0cb-484e-a01b-93bc39c2552e'}
                name='IDType'
              >
                <SelectComponent
                  options={l_tipos_documento}
                  onChange={cambiodocumento}
                  optionPropkey='id'
                  optionPropLabel='descripcion'
                />
              </Form.Item>
            </div>
          </div>
        </div>
      </div>

      <div className='col-lg-4 col-sm-4 col-md-4 mt-4 ml-2'>
        <div className='panel-search'>
          <div className='form-group gov-co-form-group'>
            <Form.Item label='Número de documento' initialValue={obj?.numeroIdentificacion} required={true} name='IDNumber'>
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
          <div className='form-group gov-co-form-group'>
            <Form.Item label='Primer Nombre' initialValue={obj?.primerNombre} name='name' required={true}>
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
          <div className='form-group gov-co-form-group'>
            <Form.Item label='Segundo Nombre' initialValue={obj?.segundoNombre} name='secondname' required={false}>
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
          <div className='form-group gov-co-form-group'>
            <Form.Item label='Primer Apellido' initialValue={obj?.primerApellido} name='surname' required={true}>
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
          <div className='form-group gov-co-form-group'>
            <Form.Item label='Segundo Apellido' initialValue={obj?.segundoApellido} name='secondsurname' required={false}>
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
          <div className='form-group gov-co-form-group'>
            <Form.Item label='Teléfono de Contacto' initialValue={obj?.telefono} name='telefono' required={true}>
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
          <div className='form-group gov-co-form-group'>
            <Form.Item label='Teléfono de Contacto 2' initialValue={obj?.celularContacto} name='telefono2' required={false}>
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
          <div className='form-group gov-co-form-group'>
            <Form.Item label='Correo Electrónico' initialValue={obj?.correoElectronico} name='email' required={false}>
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
    </>
  );
};

interface DatosSolicitante<T> {
  form: FormInstance<T>;
  obj: any;
}
