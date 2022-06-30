import React, { useCallback, useEffect, useState } from 'react';

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

//Redux
import { store } from 'app/redux/app.reducers';
import { SetViewLicence } from 'app/redux/controlViewLicence/controlViewLicence.action';
import '../../../../css/estilos.css';
export const UbicacionPersona: React.FC<ubicacion<any>> = (props) => {
  const { tipo, obj } = props;

  const [l_departamentos, setLDepartamentos] = useState<IDepartamento[]>([]);
  const [l_municipios, setLMunicipios] = useState<IMunicipio[]>([]);
  const [l_localidades, setLLocalidades] = useState<ILocalidad[]>([]);

  const [idBogotac, setIdBogota] = useState<string>('Bogotá D.C.');
  const idlocalidad = '0e2105fb-08f8-4faf-9a79-de5effa8d198';
  const idDepartamentoBogota = '31b870aa-6cd0-4128-96db-1f08afad7cdd';
  const idmunicipio = '0e2105fb-08f8-4faf-9a79-de5effa8d198';

  const getListas = useCallback(
    async () => {
      //const resp = await dominioService.get_type(ETipoDominio['Tipo Documento']);

      const departamentos = await dominioService.get_departamentos_colombia();
      const municipios = await dominioService.get_all_municipios_by_departamento(idDepartamentoBogota);
      const localidades = await dominioService.get_localidades_bogota();

      setLDepartamentos(departamentos);
      setLLocalidades(localidades);
      setLMunicipios(municipios);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeDepartamento = async (value: string) => {
    props.form.setFieldsValue({ municipio: undefined });
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
    <>
      <div className='col-lg-12 col-sm-12 col-md-12 '>
        <div className='info-tramite mt-2'>
          <p className='ml-2' style={{ fontSize: '18px', fontWeight: 'bold' }}>
            Información del lugar de revisión . <br /> <small style={{ color: ' #000' }}>* Campos Obligatorios</small>
          </p>
          <div className='row'>
            <div className='col-lg-9 col-sm-12 col-md-9' style={{ marginLeft: '5px' }}>
              <div className='form-group gov-co-form-group'>
                <label className='text ml-2'>Dirección de Domicilio</label>
                <Form.Item initialValue={obj?.direccion} name='direccion' rules={[{ required: true }]}>
                  <Input
                    maxLength={100}
                    type='text'
                    className='form-control gov-co-form-control ml-2'
                    onKeyPress={(event) => {
                      if (!/[a-zA-Z0-9-# ]/.test(event.key)) {
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
            <div className='col-lg-2 col-sm-12 col-md-12' style={{ marginTop: '32px', marginLeft: '-230px' }}>
              <button className='ml-4 mr-3 float-right button btn btn-default' style={{ backgroundColor: '#CBCBCB' }}>
                Buscar
              </button>
            </div>
          </div>
          <div className='row ml-2'>
            <div className='col-lg-5 col-sm-4 col-md-5 mt-2'>
              <div className='panel-search'>
                <div className='form-group gov-co-form-group'>
                  <label className='text'>Departamento*</label>
                  <Form.Item
                    name='departamento'
                    initialValue={obj?.departamento ? obj?.departamento : idDepartamentoBogota}
                    rules={[{ required: true }]}
                  >
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

            {tipo != null && (
              <>
                <div className='col-lg-6 col-sm-6 col-md-4 mt-2'>
                  <div className='panel-search'>
                    <div className='form-group gov-co-form-group'>
                      <label className='text'>Municipio*</label>
                      <Form.Item
                        name='municipio'
                        initialValue={obj?.municipio ? obj?.municipio : idBogotac}
                        rules={[{ required: true }]}
                      >
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
              </>
            )}
            {tipo == null && (
              <>
                <div className='col-lg-5 col-sm-4 col-md-5 mt-2'>
                  <div className='panel-search'>
                    <div className='form-group gov-co-form-group '>
                      <label className='text'>Localidad*</label>
                      <Form.Item
                        initialValue={obj?.localidad ? obj?.localidad : idlocalidad}
                        name='localidad'
                        rules={[{ required: true }]}
                      >
                        <SelectComponent options={l_localidades} optionPropkey='idLocalidad' optionPropLabel='descripcion' />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className='col-lg-5 col-sm-4 col-md-5 mt-2'>
              <div className='panel-search'>
                <div className='form-group gov-co-form-group'>
                  <label className='text'>Vereda*</label>
                  <Form.Item initialValue={obj?.vereda} name='vereda' rules={[{ required: true }]}>
                    <Input
                      maxLength={50}
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

            <div className='col-lg-5 col-sm-4 col-md-5 mt-2 '>
              <div className='panel-search'>
                <div className='form-group gov-co-form-group'>
                  <label className='text'>Sector*</label>
                  <Form.Item initialValue={obj?.vereda} name='sector' rules={[{ required: true }]}>
                    <Input
                      maxLength={50}
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
        </div>
        <div className='row ml-2'>
          <div className='col-lg-8 col-sm-12 col-md-8'>
            <div className='form-group gov-co-form-group'>
              <label className='text'>Observaciones Adicionales</label>
              <Form.Item
                initialValue={obj?.observacionUbicacion ? obj?.observacionUbicacion : ''}
                name='observations'
                rules={[{ required: false }]}
              >
                <Input.TextArea rows={5} maxLength={230} style={{ width: '360px' }} />
              </Form.Item>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
interface ubicacion<T> {
  form: FormInstance<T>;
  obj: any;
  tipo: any;
}
export const KeysForm = ['departamento', 'municipio', 'sector', 'vereda', 'localidad', 'direccion', 'observations'];
