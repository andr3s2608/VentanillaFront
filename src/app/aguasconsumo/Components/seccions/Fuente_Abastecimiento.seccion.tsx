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
import { Button, Upload } from 'antd';
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
  const [l_subcategorias, setl_subcategorias] = useState<any[]>([]);

  const getListas = useCallback(
    async () => {
      const resp = await Promise.all([api.getTipoFuente(), api.getAutoridadAmbiental()]);
      setListas(resp);

      let sub;

      /*if (obj?.fuenteabastecimientojson[0]) {
        sub = await api.getSubcategoriasFuente(
          obj?.fuenteabastecimientojson[0].idtipofuente ?? 'E0B6C517-2504-4050-8A05-B1083A9E8FE6'
        );
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
      }*/
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

  if (habilitar) {
    return (
      <section style={{ width: '100%' }}>
        <div className='container-fluid'>
          <>
            {mostrar && (
              <>
                <div className='form-row' style={{ marginLeft: '-16px' }}>
                  <div className='col-lg-6 col-md-6 col-sm-12'>
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
                        style={{ width: '400px' }}
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
                      <input
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
                      <input
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
                    <span className='required'>*</span>Localización de la bocatoma
                    <Form.Item name='latitud' initialValue={latitud} rules={[{ required: true }]}>
                      <input
                        type='text'
                        className='form-control gov-co-form-control'
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
                      <input
                        type='text'
                        className='form-control gov-co-form-control'
                        onKeyPress={(event) => {
                          if (!/[0-9'"° -]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}

                      />
                    </Form.Item>
                  </div>
                </div>
                <div className='form-row mt-3' style={{ marginLeft: '-16px' }}>
                  <div className='col-lg-12 col-sm-12 col-m-12'>
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
      </section>
    );
  } else {
    return (
      <section style={{ width: '100%' }}>
        <div className='container-fluid'>
          <>
            {mostrar && (
              <>
                <div className='form-row' style={{ marginLeft: '-16px' }}>
                  <div className='col-lg-6 col-md-6 col-sm-12'>
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
                    <div className='form-row' style={{ marginLeft: '-16px' }}>
                      <div className='col-lg-6 col-md-6 col-sm-12'>
                        <Form.Item label='' name='cargarresolucion' rules={[{ required: true }]}>
                          <Upload
                            name='cargarresolucion'
                            maxCount={1}
                            beforeUpload={() => false}
                            listType='text'
                            accept='application/pdf'
                            disabled={true}
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
                      <input
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
                      <input
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
                      <input
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
                <div className='form-row mt-3' style={{ marginLeft: '-16px' }}>
                  <div className='col-lg-12 col-sm-12 col-m-12'>
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
      </section>
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
