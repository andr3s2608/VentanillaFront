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

export const DatosFuente: React.FC<DatosFuente<any>> = (props) => {
  const { obj, tipo } = props;
  const [[l_fuentes, l_autoridad, l_subredes], setListas] = useState<[any[], any[], any[]]>([[], [], []]);

  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [seleccionar, setseleccionar] = useState<boolean>(true);
  const [l_subcategorias, setl_subcategorias] = useState<any[]>([]);

  const [idBogotac, setIdBogota] = useState<string>('Bogotá D.C.');
  const idDepartamentoBogota = '31b870aa-6cd0-4128-96db-1f08afad7cdd';
  const idmunicipio = '0e2105fb-08f8-4faf-9a79-de5effa8d198';

  const getListas = useCallback(
    async () => {
      const resp = await Promise.all([api.getTipoFuente(), api.getAutoridadAmbiental(), api.getSubredes()]);
      setListas(resp);

      const sub = await api.getSubcategoriasFuente('E0B6C517-2504-4050-8A05-B1083A9E8FE6');

      setl_subcategorias(sub);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Onchangetipo = async (value: any) => {
    props.form.setFieldsValue({ subcategoria: undefined });
    const sub = await api.getSubcategoriasFuente(value);

    setl_subcategorias(sub);
  };

  return (
    <>
      <div className='row'>
        <div className='col-lg-12 col-sm-12 col-md-12'>
          <div className='info-tramite mt-2'>
            <p className='ml-2' style={{ fontSize: '18px', fontWeight: 'bold' }}>
              Datos de la fuente de abastecimiento. <br /> <small style={{ color: '#000' }}>* Campos Obligatorios</small>
            </p>
          </div>
        </div>
        <div className='col-lg-4 col-sm-4 col-md-4 mt-2'>
          <div className='panel-search'>
            <span className='required'>*</span>Tipo de solicitud de consecion*
            <div className='form-group gov-co-form-group'>
              <div className='gov-co-dropdown'>
                <Form.Item name='tipo' initialValue={'primera'} rules={[{ required: true }]}>
                  <SelectComponent
                    options={[
                      { key: 'primera', value: 'Primera Vez' },
                      { key: 'renovacion', value: 'Renovacion' }
                    ]}
                    optionPropkey='key'
                    optionPropLabel='value'
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>
        <br></br>

        <div className='col-lg-4 col-sm-12 col-md-4'>
          <span className='required'>*</span>Tipo de fuente*
          <div className='form-group gov-co-form-group'>
            <div className='gov-co-dropdown'>
              <Form.Item name='tipofuente' initialValue={''} rules={[{ required: true }]}>
                <SelectComponent
                  options={l_fuentes}
                  onChange={Onchangetipo}
                  optionPropkey='idTipoFuente'
                  optionPropLabel='nombre'
                />
              </Form.Item>
            </div>
          </div>
        </div>
        <div className='col-lg-4 col-sm-12 col-md-4'>
          <span className='required'>*</span>Subcategoria de fuente*
          <div className='form-group gov-co-form-group ml-2'>
            <div className='gov-co-dropdown'>
              <Form.Item name='subcategoria' rules={[{ required: true }]}>
                <SelectComponent
                  options={l_subcategorias}
                  optionPropkey='idSubCategoriaFuente'
                  optionPropLabel='nombreSubCategoria'
                />
              </Form.Item>
            </div>
          </div>
        </div>

        <div className='col-lg-3 col-md-3 col-sm-12'>
          <div className='form-group gov-co-form-group'>
            <p>Descripción de otra fuente</p>
            <Form.Item name='descripcionotra' initialValue={''}>
              <input
                type='text'
                maxLength={500}
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
        <div className='col-lg-3 col-md-3 col-sm-12'>
          <br />

          <div className='form-group gov-co-form-group'>
            <span className='required'>*</span>Nombre de la fuente*
            <Form.Item name='nombrefuente' initialValue={''} rules={[{ required: true }]}>
              <input
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

        <div className='row mt-3'>
          <div className='col-lg-3 col-md-3 col-sm-12'>
            <p>Localización de la bocatoma*</p>
            <div className='form-group gov-co-form-group'>
              <span className='required'>*</span>Latitud
              <Form.Item name='latitud' initialValue={''} rules={[{ required: true }]}>
                <input
                  type='text'
                  className='form-control gov-co-form-control'
                  onKeyPress={(event) => {
                    if (!/[0-9'"° ]/.test(event.key)) {
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
          <div className='col-lg-3 col-md-3 col-sm-12 mt-3'>
            <br />
            <span className='required'>*</span>Longitud
            <div className='form-group gov-co-form-group'>
              <Form.Item name='longitud' initialValue={''} rules={[{ required: true }]}>
                <input
                  type='text'
                  className='form-control gov-co-form-control'
                  onKeyPress={(event) => {
                    if (!/[0-9'"° ]/.test(event.key)) {
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

          <div className='col-lg-8 col-md-8 col-sm-12 mt-3'>
            <span className='required'>*</span>Descripción de la fuente*
            <div className='form-group gov-co-form-group'>
              <Form.Item name='descripcionfuente' initialValue={''} rules={[{ required: true }]}>
                <Input.TextArea rows={5} maxLength={500} style={{ width: '300px' }} />
              </Form.Item>
            </div>
          </div>
          <div className='col-lg-6 col-sm-12 col-md-6 mt-3'>
            <span className='required'>*</span>Autoridad ambiental que otorga la concesión *
            <div className='form-group gov-co-form-group '>
              <div className='gov-co-dropdown'>
                <Form.Item name='autoridad' initialValue={''} rules={[{ required: true }]}>
                  <SelectComponent options={l_autoridad} optionPropkey='idAutoridadAmbiental' optionPropLabel='nombre' />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
interface DatosFuente<T> {
  form: FormInstance<T>;
  obj: any;
  tipo: string;
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
