import { SelectComponent } from 'app/shared/components/inputs/select.component';
import { authProvider } from 'app/shared/utils/authprovider.util';
import React, { useCallback, useEffect, useState } from 'react';
import { IDominio } from 'app/services/dominio.service';
import { ApiService } from 'app/services/Apis.service';
import { Form, FormInstance, Input } from 'antd';
import '../../../../css/estilos.css';
import Swal from 'sweetalert2';


export const DatosSolicitante: React.FC<DatosSolicitante<any>> = (props) => {
  /** Definición de Constantes  */
  const listTipoSolicitante = [
    { key: 'natural', value: 'Persona Natural' },
    { key: 'juridica', value: 'Persona Jurídica' }
  ]


  const { obj, form, tipo, habilitar } = props;
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [l_tipos_documento, setListaTipoDocumento] = useState<IDominio[]>([]);
  const [l_tipos_documentoRazon, setListaTipoDocumentoRazon] = useState<IDominio[]>([]);
  const [tipoSolicitante, settipoSolicitante] = useState<boolean>(true);
  const [l_tramites, setLtramites] = useState<any[]>([]);


  //validacion campos
  const [longitudmaxima, setLongitudmaxima] = useState<number>(10);
  const [longitudminima, setLongitudminima] = useState<number>(5);
  const [tipocampo, setTipocampo] = useState<string>('[0-9]{4,10}');
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

  //
  const [modificar, setmodificar] = useState<boolean>();

  const getListas = useCallback(
    async () => {
      if (tipo == 'revision') {
        setmodificar(true);
      } else {
        setmodificar(false);
      }

      const tramites = await api.getTipoTramites();
      setLtramites(tramites);

      const tipos: any = localStorage.getItem('tipoid');
      const tiposjson: any = JSON.parse(tipos);
      const tipoDocumentorazon = await api.getTipoDocumeto();
      const listDocument = tipoDocumentorazon.map((res: any) => {
        return { id: res.idTipoIdentificacion, descripcion: res.descripcion };
      });
      if (obj != null) {
        if (obj.idTipoPersona == 'natural') {
          settipoSolicitante(true);
        } else {
          settipoSolicitante(false);
        }
      }
      setListaTipoDocumentoRazon(listDocument);

      setListaTipoDocumento(tiposjson);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Onchangetipo = (value: any) => {
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
      setLongitudminimaRazon(4);
      setLongitudmaximaRazon(10);
      setTipocampoRazon('[0-9]{4,10}');
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
      setLongitudminima(0);
      setLongitudmaxima(15);
      setTipocampo('[a-zA-Z0-9]{0,15}');
      setTipocampovalidacion(/[a-zA-Z0-9]/);
      setTipodocumento('Sin Identificación');
      setCampo('AlfaNuméricos(Numéros y letras)');
      setsininformacion(true);
    } else {
      if (valorupper == '7C96A4D3-A0CB-484E-A01B-93BC39C7902E') {
        setLongitudminima(2);
        setLongitudmaxima(13);
        setTipocampo('[0-9]{2,13}');
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
              setLongitudminima(6);
              setLongitudmaxima(18);
              setTipocampo('[0-9]{6,18}');
              setTipocampovalidacion(/[0-9]/);
              setCampo('Numéricos');
              setTipodocumento('Permiso Especial de Permanencia');
            } else {
              if (valorupper === 'FFE88939-06D5-486C-887C-E52D50B7F35D' ||
                valorupper === '71F659BE-9D6B-4169-9EE2-E70BF0D65F92' ||
                valorupper === '97F5657D-D8EC-48EF-BBE3-1BABEFECB1A4') {
                setLongitudminima(10);
                setLongitudmaxima(15);
                setTipocampo('[a-zA-Z0-9]{10,15}');
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
                      setLongitudminima(6);
                      setLongitudmaxima(18);
                      setTipocampo('[a-zA-Z0-9]{6,18}');
                      setTipocampovalidacion(/[a-zA-Z0-9]/);
                      setCampo('AlfaNumérico(Numéros y letras)');
                      setTipodocumento('Salvoconducto');

                    }
                    else {
                      if (valorupper === '6AE7E477-2DE5-4149-8C93-12ACA6668FF0') {
                        setLongitudminima(5);
                        setLongitudmaxima(15);
                        setTipocampo('[a-zA-Z0-9]{5,15}');
                        setTipocampovalidacion(/[a-zA-Z0-9]/);
                        setCampo('AlfaNumérico(Numéros y letras)');
                        setTipodocumento('Adulto Sin Identificar');

                      }

                      else {
                        if (valorupper === '5FA5BF3F-B342-4596-933F-0956AE4B9109') {
                          setLongitudminima(5);
                          setLongitudmaxima(15);
                          setTipocampo('[a-zA-Z0-9]{5,15}');
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
                            setLongitudminima(4);
                            setLongitudmaxima(16);
                            setTipocampo('[a-zA-Z0-9]{4,16}');
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






  if (habilitar) {
    return (
      <>
        <section style={{ width: '100%' }}>
          <div className='container-fluid'>
            <div className='form-row' style={{ marginLeft: '-25px' }}>
              <div className='col-lg-6'>
                <p className='text'>
                  <span className='required'>*</span> Tipo de tramite
                </p>
                <Form.Item
                  name='tipotramite'
                  initialValue={'301d61c3-7685-4151-9dc5-1bdf5a88831a'}
                  rules={[{ required: true }]}
                >
                  <SelectComponent
                    options={l_tramites} disabled={modificar}
                    defaultValue={'301d61c3-7685-4151-9dc5-1bdf5a88831a'} optionPropkey='idTipoTramite'
                    optionPropLabel='descripcion' className='mr-5 option'
                  />
                </Form.Item>
              </div>
              <div className='col-lg-6'>
                <p className='text'>
                  <span className='required'>*</span> Tipo de Solicitante
                </p>
                <Form.Item name='persona' initialValue={obj?.idTipoPersona ?? 'natural'} rules={[{ required: true }]}>
                  <SelectComponent
                    options={listTipoSolicitante} onChange={Onchangetipo} defaultValue={obj?.idTipoPersona ?? 'natural'}
                    optionPropkey='key' optionPropLabel='value' className='mr-5 option' disabled={modificar}

                  />
                </Form.Item>
              </div>

              {tipoSolicitante && (<div className='col-lg-6'>
                <p className='text'>RUT</p>
                <Form.Item name='rut' >
                  <Input placeholder='NÚMERO DE RUT' type='text' className='form-control gov-co-form-control' maxLength={8} disabled={modificar}

                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
              </div>)}
            </div>

            {!tipoSolicitante && (<div className='form-row mt-4' style={{ marginLeft: '-18px' }}>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <p className='text'>
                  <span className='required'>*</span> Tipo de documento
                </p>
                <Form.Item initialValue={obj?.tipoDocumentoRazon ?? 5} rules={[{ required: true }]} name='IDTypeRazon'>
                  <SelectComponent
                    className='text'
                    options={l_tipos_documentoRazon}
                    onChange={cambiodocumentoRazon}
                    optionPropkey='id'
                    optionPropLabel='descripcion'
                    disabled={modificar}
                  />
                </Form.Item>
              </div>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <p className='text'>
                  <span className='required'>*</span> Número de documento
                </p>
                <Form.Item initialValue={obj?.nit} rules={[{ required: true }]} name='IDNumberRazon'>
                  <Input
                    allowClear
                    type='text'
                    placeholder='Número Identificación'
                    autoComplete='off'
                    pattern={tipocampoRazon}
                    maxLength={longitudmaximaRazon}
                    disabled={modificar}
                    onKeyPress={(event) => {
                      if (!tipocampovalidacionRazon.test(event.key)) {
                        event.preventDefault();
                      }
                    }}

                    onInvalid={() => {
                      Swal.fire({
                        icon: 'error',
                        title: 'Datos inválidos',
                        text:
                          'recuerde que para el tipo de documento: ' +
                          tipodocumentoRazon +
                          ' solo se admiten valores ' +
                          campoRazon +
                          ' de longitud entre ' +
                          longitudminimaRazon +
                          ' y ' +
                          longitudmaximaRazon
                      });
                    }}
                  />
                </Form.Item>
              </div>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <p className='text'>
                  <span className='required'>*</span> Nombre de la entidad
                </p>
                <Form.Item initialValue={obj?.razonSocial} rules={[{ required: true }]} name='nombreEntidad'>
                  <Input placeholder='Nombre De La Entidad' type='text' className='form-control gov-co-form-control'
                    maxLength={50} disabled={modificar}
                    onKeyPress={(event) => {
                      if (!/[a-zA-Z0-0- ]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
              </div>
            </div>)}

            <div className='form-row mt-4' style={{ marginLeft: '-18px' }}>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <p className='text'>
                  <span className='required'>*</span> Tipo de documento:
                </p>
                <Form.Item rules={[{ required: true }]} initialValue={obj?.tipoIdentificacion ?? '7c96a4d3-a0cb-484e-a01b-93bc39c2552e'}
                  name='IDType'
                >
                  <SelectComponent
                    options={l_tipos_documento}
                    onChange={cambiodocumento} optionPropkey='id'
                    optionPropLabel='descripcion' disabled={modificar}
                  />
                </Form.Item>
              </div>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <p className='text'>
                  <span className='required'>*</span> Número de documento
                </p>

                <Form.Item initialValue={obj?.numeroIdentificacion} rules={[{ required: true }]} name='IDNumber'>
                  <Input
                    className='form-control' allowClear type='text'
                    placeholder='Número Identificación' autoComplete='off'
                    pattern={tipocampo} maxLength={longitudmaxima}
                    disabled={modificar} onKeyPress={(event) => {
                      if (!tipocampovalidacion.test(event.key)) {
                        event.preventDefault();
                      }
                    }}

                    onInvalid={() => {
                      Swal.fire({
                        icon: 'error',
                        title: 'Datos inválidos',
                        text:
                          'Recuerde que para el tipo de documento: ' +
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
            <div className='form-row mt-4' style={{ marginLeft: '-20px' }}>
              <div className='col-lg-6 col-dm-6 col-sm-12'>
                <p className='text'>
                  <span className='required'>*</span> Primer Nombre
                </p>
                <Form.Item initialValue={obj?.primerNombre} name='name' rules={[{ required: true }]}>
                  <Input
                    placeholder='PRIMER NOMBRE' maxLength={50}
                    type='text' className='form-control gov-co-form-control'
                    disabled={modificar}
                    onKeyPress={(event) => {
                      if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ ]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
              </div>
              <div className='col-lg-6 col-dm-6 col-sm-12'>
                <p className='text'>
                  <span className='text'></span> Segundo Nombre
                </p>
                <Form.Item initialValue={obj?.segundoNombre} name='secondname' required={false}>
                  <Input
                    placeholder='SEGUNDO NOMBRE' type='text' disabled={modificar}
                    maxLength={50} className='form-control gov-co-form-control'
                    onKeyPress={(event) => {
                      if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ ]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
              </div>
            </div>

            <div className='form-row mt-4' style={{ marginLeft: '-20px' }}>
              <div className='col'>
                <p className='text'>
                  <span className='required'>* </span> Primer Apellido
                </p>
                <Form.Item initialValue={obj?.primerApellido} name='surname' rules={[{ required: true }]}>
                  <Input
                    placeholder='PRIMER APELLIDO' maxLength={50} disabled={modificar}
                    type='text' className='form-control gov-co-form-control'
                    onKeyPress={(event) => {
                      if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ ]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
              </div>
              <div className='col'>
                <p className='text'>
                  <span className='text'> </span> Segundo Apellido
                </p>
                <Form.Item initialValue={obj?.segundoApellido} name='secondsurname' required={false}>
                  <Input
                    placeholder='SEGUNDO APELLIDO' maxLength={50}
                    disabled={modificar} type='text'
                    className='form-control gov-co-form-control'
                    onKeyPress={(event) => {
                      if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ ]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
              </div>
            </div>
            <div className='form-row mt-4' style={{ marginLeft: '-20px' }}>
              <div className='col'>
                <p className='text'>
                  <span className='required'>* </span> Teléfono de Contacto
                </p>
                <Form.Item initialValue={obj?.telefonoContacto} name='telefono' rules={[{ required: true }]}>
                  <Input
                    placeholder='TELÉFONO DE CONTACTO' disabled={modificar} maxLength={12}
                    type='text' className='form-control gov-co-form-control'
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
              </div>
              <div className='col'>
                <p className='text'>
                  <span className='text'> </span>
                  Teléfono de Contacto 2
                </p>
                <Form.Item initialValue={obj?.celularContacto} name='telefono2' required={false}>
                  <Input
                    placeholder='TELÉFONO DE CONTACTO 2' maxLength={12}
                    disabled={modificar} type='text'
                    className='form-control gov-co-form-control'
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
              </div>
            </div>
            <div className='form-row mt-4' style={{ marginLeft: '-20px' }}>
              <div className='col'>
                <p className='text'>
                  <span className='required'>* </span>
                  Correo Electrónico
                </p>
                <Form.Item initialValue={obj?.correoElectronico} name='email' rules={[{ required: true }]}>
                  <Input
                    placeholder='CORREO ELECTRÓNICO'
                    maxLength={50} disabled={modificar} type='text'
                    className='form-control gov-co-form-control'
                    onKeyPress={(event) => {
                      if (!/[a-zA-Z0-9ZñÑ@._-]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  } else {
    return (
      <>
        <section style={{ width: '100%' }}>
          <div className='container-fluid'>
            <div className='form-row' style={{ marginLeft: '-20px' }}>
              <div className='col-lg-12'>
                <p className='text'>
                  <span className='required'>*</span> Tipo de Solicitante
                </p>
                <Form.Item name='persona' initialValue={obj?.idTipoPersona ?? 'natural'} rules={[{ required: true }]}>
                  <SelectComponent
                    options={listTipoSolicitante}
                    onChange={Onchangetipo}
                    defaultValue={obj?.idTipoPersona ?? 'natural'}
                    optionPropkey='key'
                    optionPropLabel='value'
                    className='mr-5 option'
                    disabled={true}
                  />
                </Form.Item>
              </div>
            </div>
            {!tipoSolicitante && (<div className='form-row mt-4' style={{ marginLeft: '-18px' }}>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <p className='text'>
                  <span className='required'>*</span> Tipo de documento
                </p>
                <Form.Item initialValue={obj?.tipoDocumentoRazon ?? 5} rules={[{ required: true }]} name='IDTypeRazon'>
                  <SelectComponent
                    className='text'
                    options={l_tipos_documentoRazon}
                    onChange={cambiodocumentoRazon}
                    optionPropkey='id'
                    optionPropLabel='descripcion'
                    disabled={true}
                  />
                </Form.Item>
              </div>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <p className='text'>
                  <span className='required'>*</span> Número de documento
                </p>
                <Form.Item initialValue={obj?.nit} rules={[{ required: true }]} name='IDNumberRazon'>
                  <Input
                    allowClear
                    type='text'
                    placeholder='Número Identificación'
                    autoComplete='off'
                    pattern={tipocampoRazon}
                    maxLength={longitudmaximaRazon}
                    disabled={true}
                    onKeyPress={(event) => {
                      if (!tipocampovalidacionRazon.test(event.key)) {
                        event.preventDefault();
                      }
                    }}

                    onInvalid={() => {
                      Swal.fire({
                        icon: 'error',
                        title: 'Datos inválidos',
                        text:
                          'recuerde que para el tipo de documento: ' +
                          tipodocumentoRazon +
                          ' solo se admiten valores ' +
                          campoRazon +
                          ' de longitud entre ' +
                          longitudminimaRazon +
                          ' y ' +
                          longitudmaximaRazon
                      });
                    }}
                  />
                </Form.Item>
              </div>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <p className='text'>
                  <span className='required'>*</span> Nombre de la entidad
                </p>
                <Form.Item initialValue={obj?.razonSocial} rules={[{ required: true }]} name='nombreEntidad'>
                  <Input placeholder='Nombre De La Entidad' type='text' className='form-control gov-co-form-control'
                    maxLength={50} disabled={true}
                    onKeyPress={(event) => {
                      if (!/[a-zA-Z0-0- ]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
              </div>
            </div>)}
            <div className='form-row mt-4' style={{ marginLeft: '-20px' }}>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <p className='text'>
                  {' '}
                  <span className='required'>*</span> Tipo de documento:
                </p>
                <Form.Item
                  rules={[{ required: true }]}
                  initialValue={obj?.tipoIdentificacion ?? '7c96a4d3-a0cb-484e-a01b-93bc39c2552e'}
                  name='IDType'
                >
                  <SelectComponent
                    style={{ width: '296px' }}
                    options={l_tipos_documento}
                    onChange={cambiodocumento}
                    optionPropkey='id'
                    optionPropLabel='descripcion'
                    disabled={true}
                  />
                </Form.Item>
              </div>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <p className='text'>
                  <span className='required'>*</span> Número de documento
                </p>

                <Form.Item initialValue={obj?.numeroIdentificacion} rules={[{ required: true }]} name='IDNumber'>
                  <Input
                    className='form-control'
                    allowClear
                    type='text'
                    placeholder='NÚMERO DE IDENTIFICACIÓN'
                    autoComplete='off'
                    pattern={tipocampo}
                    maxLength={longitudmaxima}
                    disabled={true}
                    onKeyPress={(event) => {
                      if (!tipocampovalidacion.test(event.key)) {
                        event.preventDefault();
                      }
                    }}

                    onInvalid={() => {
                      Swal.fire({
                        icon: 'error',
                        title: 'Datos inválidos',
                        text:
                          'Recuerde que para el tipo de documento: ' +
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
            <div className='form-row mt-4' style={{ marginLeft: '-20px' }}>
              <div className='col-lg-6 col-dm-6 col-sm-12'>
                <p className='text'>
                  <span className='required'>*</span> Primer Nombre
                </p>
                <Form.Item initialValue={obj?.primerNombre} name='name' rules={[{ required: true }]}>
                  <Input
                    placeholder='PRIMER NOMBRE'
                    maxLength={50}
                    type='text'
                    className='form-control gov-co-form-control'
                    disabled={true}
                    onKeyPress={(event) => {
                      if (!/[a-zA-Z ]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}

                  />
                </Form.Item>
              </div>
              <div className='col-lg-6 col-dm-6 col-sm-12'>
                <p className='text'>
                  <span className='text'></span> Segundo Nombre
                </p>
                <Form.Item initialValue={obj?.segundoNombre} name='secondname' required={false}>
                  <Input
                    placeholder='SEGUNDO NOMBRE'
                    type='text'
                    disabled={true}
                    maxLength={50}
                    className='form-control gov-co-form-control'
                    onKeyPress={(event) => {
                      if (!/[a-zA-Z ]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}

                  />
                </Form.Item>
              </div>
            </div>

            <div className='form-row mt-4' style={{ marginLeft: '-20px' }}>
              <div className='col'>
                <p className='text'>
                  <span className='required'>* </span> Primer Apellido
                </p>
                <Form.Item initialValue={obj?.primerApellido} name='surname' rules={[{ required: true }]}>
                  <Input
                    placeholder='PRIMER APELLIDO'
                    maxLength={50}
                    disabled={true}
                    type='text'
                    className='form-control gov-co-form-control'
                    onKeyPress={(event) => {
                      if (!/[a-zA-Z ]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}

                  />
                </Form.Item>
              </div>
              <div className='col'>
                <p className='text'>
                  {' '}
                  <span className='text'> </span> Segundo Apellido
                </p>
                <Form.Item initialValue={obj?.segundoApellido} name='secondsurname' required={false}>
                  <Input
                    placeholder='SEGUNDO APELLIDO'
                    maxLength={50}
                    disabled={true}
                    type='text'
                    className='form-control gov-co-form-control'
                    onKeyPress={(event) => {
                      if (!/[a-zA-Z ]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}

                  />
                </Form.Item>
              </div>
            </div>
            <div className='form-row mt-4' style={{ marginLeft: '-20px' }}>
              <div className='col'>
                <p className='text'>
                  {' '}
                  <span className='required'>* </span> Teléfono de Contacto
                </p>
                <Form.Item initialValue={obj?.telefonoContacto} name='telefono' rules={[{ required: true }]}>
                  <Input
                    placeholder='TELÉFONO DE CONTACTO'
                    disabled={true}
                    maxLength={12}
                    type='text'
                    className='form-control gov-co-form-control'
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}

                  />
                </Form.Item>
              </div>
              <div className='col'>
                <p className='text'>
                  <span className='text'> </span>
                  Teléfono de Contacto 2
                </p>
                <Form.Item initialValue={obj?.celularContacto} name='telefono2' required={false}>
                  <Input
                    placeholder='TELÉFONO DE CONTACTO 2'
                    maxLength={12}
                    disabled={true}
                    type='text'
                    className='form-control gov-co-form-control'
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}

                  />
                </Form.Item>
              </div>
            </div>
            <div className='form-row mt-4' style={{ marginLeft: '-20px' }}>
              <div className='col'>
                <p className='text'>
                  <span className='required'>* </span>
                  Correo Electrónico
                </p>
                <Form.Item initialValue={obj?.correoElectronico} name='email' required={true}>
                  <Input
                    placeholder='CORREO ELECTRÓNICO'

                    maxLength={50}
                    disabled={true}
                    type='text'
                    className='form-control gov-co-form-control'
                    onKeyPress={(event) => {
                      if (!/[a-zA-Z0-9ZñÑ@._-]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}

                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
};

interface DatosSolicitante<T> {
  form: FormInstance<T>;
  obj: any;
  tipo: any;
  habilitar: boolean;
}

export const KeysFormService = ['persona', 'IDTypeRazon', 'name', 'telefono', 'email',];

