import React, { useCallback, useEffect, useState } from 'react';
import '../../../../css/estilos.css';
// Antd
import Form, { FormInstance } from 'antd/es/form';
import Input from 'antd/es/input';
import Divider from 'antd/es/divider';
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

// Componentes
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import { ApiService } from 'app/services/Apis.service';
import { authProvider } from 'app/shared/utils/authprovider.util';

//Redux
import { store } from 'app/redux/app.reducers';
import { SetViewLicence } from 'app/redux/controlViewLicence/controlViewLicence.action';
import { DatepickerComponent } from 'app/shared/components/inputs/datepicker.component';
import { Button, Radio, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

export const DatosFuente: React.FC<DatosFuente<any>> = (props) => {
  const { obj, tipo, habilitar } = props;
  const [[l_fuentes, l_autoridad], setListas] = useState<[any[], any[]]>([[], []]);

  const [
    [tipofuente, subca, descripcionotra, nombre, latitud, longitud, descricion, autoridad, nroresolu, fecha, tiposol],
    setdatos
  ] = useState<[any, any, any, any, any, any, any, any, any, any, any]>([
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined
  ]);

  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [seleccionar, setseleccionar] = useState<boolean>(false);
  const [mostrar, setmostrar] = useState<boolean>(false);
  const [latituddec, setlatituddec] = useState<boolean>(true);
  const [longituddec, setlongituddec] = useState<boolean>(true);
  const [l_subcategorias, setl_subcategorias] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const getListas = useCallback(
    async () => {
      const resp = await Promise.all([api.getTipoFuente(), api.getAutoridadAmbiental()]);
      setListas(resp);

      let sub;

      if (obj?.fuenteabastecimientojson !== undefined) {

        if (obj?.fuenteabastecimientojson[0]) {

          sub = await api.getSubcategoriasFuente(
            obj?.fuenteabastecimientojson[0].idtipofuente ?? 'E0B6C517-2504-4050-8A05-B1083A9E8FE6'
          );
          setl_subcategorias(sub);
          if (obj?.renovafuentejson[0]) {
            const date = obj.renovafuentejson[0].fechaResolucion;
            setdatos([
              obj.fuenteabastecimientojson[0].idtipofuente,
              obj.fuenteabastecimientojson[0].idSubCategoriaFuente,
              obj.fuenteabastecimientojson[0].descripcionOtraFuente,
              obj.fuenteabastecimientojson[0].nombrefuenteabastecimiento,
              obj.fuenteabastecimientojson[0].bocatoma_lat,
              obj.fuenteabastecimientojson[0].bocatoma_long,
              obj.fuenteabastecimientojson[0].descripcionFuenteAbastecimiento,
              obj.fuenteabastecimientojson[0].idAutoridadAmbiental,
              obj.renovafuentejson[0].numeroResolucion,
              moment(date),
              'renovacion'
            ]);
            setseleccionar(true);
          } else {
            setdatos([
              obj.fuenteabastecimientojson[0].idtipofuente,
              obj.fuenteabastecimientojson[0].idSubCategoriaFuente,
              obj.fuenteabastecimientojson[0].descripcionOtraFuente,
              obj.fuenteabastecimientojson[0].nombrefuenteabastecimiento,
              obj?.fuenteabastecimientojson[0].bocatoma_lat,
              obj?.fuenteabastecimientojson[0].bocatoma_long,
              obj?.fuenteabastecimientojson[0].descripcionFuenteAbastecimiento,
              obj?.fuenteabastecimientojson[0].idAutoridadAmbiental,
              '',
              '',
              'primera'
            ]);
          }
        } else {
          sub = await api.getSubcategoriasFuente('E0B6C517-2504-4050-8A05-B1083A9E8FE6');
          setl_subcategorias(sub);
        }
      }

      setmostrar(true);
      //setl_subcategorias(sub);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Onchangesolicitud = async (value: any) => {
    if (value == 'renovacion') {
      setseleccionar(true);
    } else {
      setseleccionar(false);
    }
  };

  const Onchangetipo = async (value: any) => {
    props.form.setFieldsValue({ subcategoria: undefined });
    const sub = await api.getSubcategoriasFuente(value);

    setl_subcategorias(sub);
  };

  const onChangeTipoCoordenadaLatitud = (event: any) => {



    let valor = props.form.getFieldValue('latitud');

    let numerico1 = '';
    let numerico2 = '';
    if (event.target.value == 'decimal') {

      setlatituddec(true)

      if (valor != "" && valor != undefined && valor.length === 13) {
        let valornuevo = valor.substring(0, 2);
        const orientacion = valor.substring(valor.length - 1, valor.length) === 'N' ? '' : '-';
        for (let index = 2; index < 11; index++) {
          if (index < 6) {
            if (valor.substring(index, index + 1) != '°' &&
              valor.substring(index, index + 1) != '"' &&
              valor.substring(index, index + 1) != "'") {
              numerico1 = numerico1 + valor.substring(index, index + 1);

            }
          }
          else {
            if (valor.substring(index, index + 1) != '°' &&
              valor.substring(index, index + 1) != '"' &&
              valor.substring(index, index + 1) != "'") {
              numerico2 = numerico2 + valor.substring(index, index + 1);

            }
          }


        }


        const segundos = (Number.parseInt(numerico2) / 60);
        const minutos = (Number.parseInt(numerico1) + segundos)
        const horas = minutos / 60;


        valornuevo = Number.parseInt(valornuevo) + horas;
        while (valornuevo > 99) {
          valornuevo = valornuevo / 10;
        }
        valornuevo = orientacion + Number.parseFloat(valornuevo);


        props.form.setFieldsValue({ latitud: valornuevo })

      }

    } else if (event.target.value == 'sexagesimal') {

      setlatituddec(false)
      if (valor != "" && valor != undefined && valor.length > 3) {

        const orientacion = valor.substring(0, 1) === '-' ? 'S' : 'N';
        let inicial = orientacion === 'S' ? 1 : 0;
        let valornuevo = valor.substring(inicial, inicial + 2);
        let valordecimal = '';

        for (let index = inicial + 2; index < valor.length; index++) {

          if (valor.substring(index, index + 1) != '.') {
            valordecimal = valordecimal + valor.substring(index, index + 1)
          }
        }

        numerico1 = (Number.parseInt(valordecimal) * 60) + '';
        numerico2 = (Number.parseFloat(numerico1.substring(2, numerico1.length) != '' ? numerico1.substring(2, numerico1.length) : '0') * 60) + '';


        valornuevo = valornuevo + '°' + numerico1.substring(0, 2) + "'" + numerico2.substring(0, 2) + '.' + numerico2.substring(2, 4) + '"' + orientacion;

        props.form.setFieldsValue({ latitud: valornuevo })

      }


    }
  }

  const onChangeTipoCoordenadaLongitud = (event: any) => {


    let valor = props.form.getFieldValue('longitud');
    let numerico1 = '';
    let numerico2 = '';
    if (event.target.value == 'decimal') {

      setlongituddec(true)

      if (valor != "" && valor != undefined && valor.length === 13) {
        let valornuevo = valor.substring(0, 2);
        const orientacion = valor.substring(valor.length - 1, valor.length) === 'E' ? '' : '-';
        for (let index = 2; index < 11; index++) {
          if (index < 6) {
            if (valor.substring(index, index + 1) != '°' &&
              valor.substring(index, index + 1) != '"' &&
              valor.substring(index, index + 1) != "'") {
              numerico1 = numerico1 + valor.substring(index, index + 1);

            }
          }
          else {
            if (valor.substring(index, index + 1) != '°' &&
              valor.substring(index, index + 1) != '"' &&
              valor.substring(index, index + 1) != "'") {
              numerico2 = numerico2 + valor.substring(index, index + 1);

            }
          }


        }


        const segundos = (Number.parseInt(numerico2) / 60);
        const minutos = (Number.parseInt(numerico1) + segundos)
        const horas = minutos / 60;


        valornuevo = Number.parseInt(valornuevo) + horas;
        while (valornuevo > 180) {
          valornuevo = valornuevo / 10;
        }
        valornuevo = orientacion + Number.parseFloat(valornuevo);

        props.form.setFieldsValue({ longitud: valornuevo })

      }

    } else if (event.target.value == 'sexagesimal') {

      setlongituddec(false)
      if (valor != "" && valor != undefined && valor.length > 3) {

        const orientacion = valor.substring(0, 1) === '-' ? 'O' : 'E';
        let inicial = orientacion === 'O' ? 1 : 0;
        let valornuevo = valor.substring(inicial, inicial + 2);
        let valordecimal = '';

        for (let index = inicial + 2; index < valor.length; index++) {

          if (valor.substring(index, index + 1) != '.') {
            valordecimal = valordecimal + valor.substring(index, index + 1)
          }
        }

        numerico1 = (Number.parseInt(valordecimal) * 60) + '';
        numerico2 = (Number.parseFloat(numerico1.substring(2, numerico1.length) != '' ? numerico1.substring(2, numerico1.length) : '0') * 60) + '';


        valornuevo = valornuevo + '°' + numerico1.substring(0, 2) + "'" + numerico2.substring(0, 2) + '.' + numerico2.substring(2, 4) + '"' + orientacion;

        props.form.setFieldsValue({ longitud: valornuevo })

      }


    }
  }

  const onChangeFormat = (event: any) => {
    let valor: string = props.form.getFieldValue('latitud');


    if (event.target.value.length === 2) {
      valor = valor + "°"
      props.form.setFieldsValue({ latituduso: valor })
      setInput(event.target.value + "°");
    }

    if (event.target.value.length === 5) {
      valor = valor + "'"
      props.form.setFieldsValue({ latituduso: valor })
      setInput(event.target.value + "'");
    }

    if (event.target.value.length === 8) {
      valor = valor + '.'
      props.form.setFieldsValue({ latituduso: valor })
      setInput(event.target.value + '.');
    }

    if (event.target.value.length === 11) {
      valor = valor + '"'
      props.form.setFieldsValue({ latituduso: valor })
      setInput(event.target.value + '"');
    }

  };
  const onChangeFormatLongitud = (event: any) => {
    let valor: string = props.form.getFieldValue('longitud');

    if (event.target.value.length === 2) {
      valor = valor + "°"
      props.form.setFieldsValue({ latituduso: valor })
      setInput(event.target.value + "°");
    }

    if (event.target.value.length === 5) {
      valor = valor + "'"
      props.form.setFieldsValue({ latituduso: valor })
      setInput(event.target.value + "'");
    }

    if (event.target.value.length === 8) {
      valor = valor + '.'
      props.form.setFieldsValue({ latituduso: valor })
      setInput(event.target.value + '.');
    }

    if (event.target.value.length === 11) {
      valor = valor + '"'
      props.form.setFieldsValue({ latituduso: valor })
      setInput(event.target.value + '"');
    }
  };

  if (habilitar) {
    return (

      <div className='container-fluid'>
        <>
          {mostrar && (
            <>
              <div className='form-row' style={{ marginLeft: '-20px', marginRight: '-20px' }}>
                <div className='col-lg-6 col-sm-12 col-md-6'>
                  <span className='required'>*</span>Tipo de solicitud de consecion*
                  <Form.Item name='tipo' initialValue={tiposol ?? 'primera'} rules={[{ required: true }]}>
                    <SelectComponent
                      options={[
                        { key: 'primera', value: 'Primera Vez' },
                        { key: 'renovacion', value: 'Renovacion' }
                      ]}
                      onChange={Onchangesolicitud}
                      optionPropkey='key'
                      optionPropLabel='value'
                      className='personal'

                    />
                  </Form.Item>
                </div>
              </div>
              {seleccionar && (
                <>
                  <div className='form-row mt-3' style={{ marginLeft: '-16px' }}>
                    <div className='col-lg-6 col-sm-12 col-md-6'>
                      <span className='required'>*</span>Número de expediente de resolución
                      <Form.Item name='nroresolucion' initialValue={nroresolu} rules={[{ required: true }]}>
                        <Input
                          type='text'
                          className='form-control gov-co-form-control'
                          maxLength={15}
                          onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}

                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className='form-row mt-3' style={{ marginLeft: '-16px' }}>
                    <div className='col-lg-6 col-md-6 col-sm-12'>
                      <span className='required'>*</span>Fecha de resolución
                      <Form.Item name='dateresolucion' initialValue={fecha} rules={[{ required: true }]}>
                        <DatepickerComponent picker='date' dateDisabledType='before' dateFormatType='default' />
                      </Form.Item>
                    </div>
                  </div>
                  <div className='form-row' style={{ marginLeft: '-16px' }}>
                    <div className='col-lg-6 col-md-6 col-sm-12'>
                      <Form.Item label='' name='cargarresolucion' rules={[{ required: true }]}>
                        <Upload
                          name='cargarresolucion'
                          maxCount={1}
                          beforeUpload={() => false}
                          listType='text'
                          accept='application/pdf'
                        >
                          <Button icon={<UploadOutlined />}>Adjuntar archivo</Button>
                        </Upload>
                      </Form.Item>
                    </div>
                  </div>
                </>
              )}

              <div className='form-row mt-3' style={{ marginLeft: '-16px' }}>
                <div className='col-lg-6 col-sm-12 col-md-6'>
                  <span className='required'>*</span>Tipo de fuente*
                  <Form.Item name='tipofuente' initialValue={tipofuente} rules={[{ required: true }]}>
                    <SelectComponent
                      options={l_fuentes}
                      onChange={Onchangetipo}
                      optionPropkey='idTipoFuente'
                      optionPropLabel='nombre'
                    />
                  </Form.Item>
                </div>
                <div className='col-lg-6 col-sm-12 col-md-6'>
                  <span className='required'>*</span>Subcategoria de fuente*
                  <Form.Item name='subcategoria' initialValue={subca} rules={[{ required: true }]}>
                    <SelectComponent
                      options={l_subcategorias}
                      optionPropkey='idSubCategoriaFuente'
                      optionPropLabel='nombreSubCategoria'
                    />
                  </Form.Item>
                </div>
              </div>
              <div className='form-row mt-3' style={{ marginLeft: '-16px' }}>
                <div className='col-lg-6 col-md-6 col-sm-12'>
                  <span className='required'>*</span>Nombre de la fuente*
                  <Form.Item name='nombrefuente' initialValue={nombre} rules={[{ required: true }]}>
                    <Input
                      type='text'
                      className='form-control gov-co-form-control'
                      onKeyPress={(event) => {
                        if (!/[a-zA-Z0-9 ]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}

                    />
                  </Form.Item>
                </div>
                <div className='col-md-6 col-lg-6 col-sm-12'>
                  <span className='required'>*</span>Descripción de otra fuente
                  <Form.Item name='descripcionotra' initialValue={descripcionotra}>
                    <Input
                      type='text'
                      maxLength={500}
                      className='form-control gov-co-form-control'
                      onKeyPress={(event) => {
                        if (!/[a-zA-Z0-9 ]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}

                    />
                  </Form.Item>
                </div>
              </div>
              <div className='form-row mt-3' style={{ marginLeft: '-16px' }}>
                <div className='col-md-6 col-lg-6 col-sm-12'>
                  <span className='required'>*</span>Localización de la bocatoma latitud
                  <Form.Item label='' name='tipoCoordenadaLatitudfuente' >
                    <Radio.Group defaultValue={'decimal'} onChange={onChangeTipoCoordenadaLatitud}>
                      <Radio value='decimal'>Decimal</Radio>
                      <Radio value='sexagesimal'>Sexagesimal</Radio>
                    </Radio.Group>
                  </Form.Item>

                  {latituddec ?
                    (<Form.Item name='latitud' initialValue={latitud} rules={[{ required: true }]} >
                      <Input
                        name='latitud'
                        className='form-control gov-co-form-control'
                        maxLength={9}
                        onKeyPress={(event) => {
                          if (!/[0-9-.]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                      />
                    </Form.Item>) :
                    <Form.Item name='latitud' initialValue={latitud} rules={[{ required: true }]} >
                      <Input
                        name='latitud'
                        className='form-control gov-co-form-control'
                        maxLength={13}
                        onChange={onChangeFormat}
                        onKeyPress={(event) => {
                          if (!/[0-9'"°NS.]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                      />
                    </Form.Item>}

                </div>

                <div className='col-md-6 col-lg-6 col-sm-12'>
                  <span className='required'>*</span>Longitud de la bocatoma longitud

                  <Form.Item label='' name='tipoCoordenadaLongitudFuente' >
                    <Radio.Group defaultValue={'decimal'} onChange={onChangeTipoCoordenadaLongitud}>
                      <Radio value='decimal'>Decimal</Radio>
                      <Radio value='sexagesimal'>Sexagesimal</Radio>
                    </Radio.Group>
                  </Form.Item>
                  {longituddec ?
                    (<Form.Item name='longitud' initialValue={longitud} rules={[{ required: true }]}>
                      <Input

                        className='form-control gov-co-form-control'
                        maxLength={9}
                        onKeyPress={(event) => {
                          if (!/[0-9-.]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                      />
                    </Form.Item>) :
                    <Form.Item name='longitud' initialValue={longitud} rules={[{ required: true }]}>
                      <Input
                        className='form-control gov-co-form-control'
                        maxLength={13}
                        onChange={onChangeFormatLongitud}
                        onKeyPress={(event) => {
                          if (!/[0-9'"°EO.]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                      />
                    </Form.Item>}
                </div>
              </div>
              <div className='row mt-3' style={{ marginLeft: '-16px' }}>
                <div className='col-md-6 col-lg-6 col-sm-12'>
                  <span className='required'>*</span>Autoridad ambiental que otorga la concesión *
                  <Form.Item name='autoridad' initialValue={autoridad} rules={[{ required: true }]}>
                    <SelectComponent
                      options={l_autoridad}
                      optionPropkey='idAutoridadAmbiental'
                      optionPropLabel='nombre'
                      className='personal'
                    />
                  </Form.Item>
                </div>
              </div>
              <div className='form-row mt-3' style={{ marginLeft: '-16px' }}>
                <div className='col-lg-12 col-md-12 col-sm-12'>
                  <span className='required'>*</span>Descripción de la fuente*
                  <Form.Item name='descripcionfuente' initialValue={descricion} rules={[{ required: true }]}>
                    <Input.TextArea rows={5} maxLength={500} style={{ width: '300px' }} />
                  </Form.Item>
                </div>
              </div>
            </>
          )}
        </>
      </div>

    );
  } else {
    return (

      <div className='container-fluid'>
        <>
          {mostrar && (
            <>
              <div className='form-row mt-3' style={{ marginLeft: '-16px' }}>
                <div className='col-lg-6 col-sm-12 col-md-6'>
                  <span className='required'>*</span>Tipo de solicitud de consecion*
                  <Form.Item name='tipo' initialValue={tiposol ?? 'primera'} rules={[{ required: true }]}>
                    <SelectComponent
                      options={[
                        { key: 'primera', value: 'Primera Vez' },
                        { key: 'renovacion', value: 'Renovacion' }
                      ]}
                      onChange={Onchangesolicitud}
                      optionPropkey='key'
                      optionPropLabel='value'
                      disabled={true}
                      className='personal'

                    />
                  </Form.Item>
                </div>
              </div>
              {seleccionar && (
                <>
                  <div className='form-row' style={{ marginLeft: '-16px' }}>
                    <div className='col-lg-6 col-sm-12 col-md-6'>
                      <span className='required'>*</span>Número de expediente de resolución
                      <Form.Item name='nroresolucion' initialValue={nroresolu} rules={[{ required: true }]}>
                        <Input
                          type='text'
                          className='form-control gov-co-form-control'
                          disabled={true}
                          maxLength={15}
                          onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}

                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className='form-row mt-3' style={{ marginLeft: '-16px' }}>
                    <div className='col-lg-6 col-md-6 col-sm-12'>
                      <span className='required'>*</span>Fecha de resolución
                      <Form.Item name='dateresolucion' initialValue={fecha} rules={[{ required: true }]}>
                        <DatepickerComponent picker='date' dateDisabledType='before' dateFormatType='default' disabled={true} />
                      </Form.Item>
                    </div>
                  </div>
                </>
              )}

              <div className='form-row mt-3' style={{ marginLeft: '-16px' }}>
                <div className='col-lg-6 col-sm-12 col-md-6'>
                  <span className='required'>*</span>Tipo de fuente*
                  <Form.Item name='tipofuente' initialValue={tipofuente} rules={[{ required: true }]}>
                    <SelectComponent
                      options={l_fuentes}
                      onChange={Onchangetipo}
                      optionPropkey='idTipoFuente'
                      optionPropLabel='nombre'
                      disabled={true}
                    />
                  </Form.Item>
                </div>
                <div className='col-lg-6 col-sm-12 col-md-6'>
                  <span className='required'>*</span>Subcategoria de fuente*
                  <Form.Item name='subcategoria' initialValue={subca} rules={[{ required: true }]}>
                    <SelectComponent
                      options={l_subcategorias}
                      optionPropkey='idSubCategoriaFuente'
                      optionPropLabel='nombreSubCategoria'
                      disabled={true}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className='form-row mt-3' style={{ marginLeft: '-16px' }}>
                <div className='col-lg-6 col-md-6 col-sm-12'>
                  <span className='required'>*</span>Nombre de la fuente*
                  <Form.Item name='nombrefuente' initialValue={nombre} rules={[{ required: true }]}>
                    <input
                      type='text'
                      className='form-control gov-co-form-control'
                      disabled={true}
                      onKeyPress={(event) => {
                        if (!/[a-zA-Z0-9 ]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}

                    />
                  </Form.Item>
                </div>
                <div className='col-md-6 col-lg-6 col-sm-12'>
                  <span className='required'>*</span>Descripción de otra fuente
                  <Form.Item name='descripcionotra' initialValue={descripcionotra}>
                    <Input
                      type='text'
                      maxLength={500}
                      disabled={true}
                      className='form-control gov-co-form-control'
                      onKeyPress={(event) => {
                        if (!/[a-zA-Z0-9 ]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}

                    />
                  </Form.Item>
                </div>
              </div>
              <div className='form-row mt-3' style={{ marginLeft: '-16px' }}>
                <div className='col-md-6 col-lg-6 col-sm-12'>
                  <span className='required'>*</span>Localización de la bocatoma
                  <Form.Item name='latitud' initialValue={latitud} rules={[{ required: true }]}>
                    <Input
                      type='text'
                      className='form-control gov-co-form-control'
                      disabled={true}
                      onKeyPress={(event) => {
                        if (!/[0-9'"° -]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}

                    />
                  </Form.Item>
                </div>

                <div className='col-md-6 col-lg-6 col-sm-12'>
                  <span className='required'>*</span>Longitud de la bocatoma
                  <Form.Item name='longitud' initialValue={longitud} rules={[{ required: true }]}>
                    <Input
                      type='text'
                      className='form-control gov-co-form-control'
                      disabled={true}
                      onKeyPress={(event) => {
                        if (!/[0-9'"° -]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}

                    />
                  </Form.Item>
                </div>
              </div>
              <div className='row mt-5' style={{ marginLeft: '-16px' }}>
                <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
                  <span className='required'>*</span>Autoridad ambiental que otorga la concesión *
                  <Form.Item name='autoridad' initialValue={autoridad} rules={[{ required: true }]}>
                    <SelectComponent
                      options={l_autoridad}
                      optionPropkey='idAutoridadAmbiental'
                      optionPropLabel='nombre'
                      disabled={true}
                      className='personal'
                    />
                  </Form.Item>
                </div>
              </div>
              <div className='form-row mt-3' style={{ marginLeft: '-16px' }}>
                <div className='col-lg-12 col-md-12 col-sm-12'>
                  <span className='required'>*</span>Descripción de la fuente*
                  <Form.Item name='descripcionfuente' initialValue={descricion} rules={[{ required: true }]}>
                    <Input.TextArea rows={5} maxLength={500} style={{ width: '300px' }} disabled={true} />
                  </Form.Item>
                </div>
              </div>
            </>
          )}
        </>
      </div>

    );
  }
};
interface DatosFuente<T> {
  form: FormInstance<T>;
  obj: any;
  tipo: string;
  habilitar: boolean;
}
export const KeysForm = [
  'tipo',
  'tipofuente',
  'subcategoria',
  'descripcionotra',
  'nombrefuente',
  'latitud',
  'longitud',
  'descripcionfuente',
  'autoridad'
];
