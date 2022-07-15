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
import { Button } from 'antd';
import { ApiService } from 'app/services/Apis.service';
import { authProvider } from 'app/shared/utils/authprovider.util';
export const UbicacionPersona: React.FC<ubicacion<any>> = (props) => {
  const { tipo, obj } = props;

  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [l_departamentos, setLDepartamentos] = useState<IDepartamento[]>([]);
  const [l_municipios, setLMunicipios] = useState<IMunicipio[]>([]);
  const [l_localidades, setLLocalidades] = useState<ILocalidad[]>([]);

  const [idBogotac, setIdBogota] = useState<string>('Bogotá D.C.');
  const idlocalidad = '0e2105fb-08f8-4faf-9a79-de5effa8d198';
  const idDepartamentoBogota = '31b870aa-6cd0-4128-96db-1f08afad7cdd';

  const idmunicipio = '0e2105fb-08f8-4faf-9a79-de5effa8d198';

  const [modificar, setmodificar] = useState<boolean>();
  const [mostrar, setmostrar] = useState<boolean>(false);

  const getListas = useCallback(
    async () => {
      const mysRoles = await api.GetRoles();

      const [permiso] = mysRoles;
      if (permiso.rol == 'Ciudadano') {
        setmodificar(true);
      } else {
        setmodificar(false);
      }

      const departamentos = await dominioService.get_departamentos_colombia();
      const municipios = await dominioService.get_all_municipios_by_departamento(obj?.departamento ?? idDepartamentoBogota);
      if (obj?.departamento) {
        setIdBogota('');
      }

      const localidades = await dominioService.get_localidades_bogota();

      setLDepartamentos(departamentos);
      setLLocalidades(localidades);
      setLMunicipios(municipios);
      setmostrar(true);
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
            Información del lugar de revisión . <br />{' '}
            <small style={{ color: ' #000' }}>
              <span className='required'>* </span> Campos Obligatorios
            </small>
          </p>
          <div className='row'>
            <div className='col-lg-9 col-sm-12 col-md-9' style={{ marginLeft: '5px' }}>
              <div className='form-group gov-co-form-group'>
                <label className='text ml-2'>Dirección de Domicilio</label>
                <Form.Item initialValue={obj?.direccion} name='direccion' rules={[{ required: true }]}>
                  <Input
                    maxLength={100}
                    type='text'
                    disabled={modificar}
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
              <Button
                className='ml-4 mr-3 float-right button btn btn-default'
                type='primary'
                style={{ backgroundColor: '#CBCBCB', border: '0px' }}
              >
                Buscar
              </Button>
            </div>
          </div>
          <div className='row ml-2'>
            <div className='col-lg-5 col-sm-4 col-md-5 mt-2'>
              <div className='panel-search'>
                <div className='form-group gov-co-form-group'>
                  <label className='text'>
                    <span className='required'>* </span> Departamento
                  </label>
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
                      disabled={modificar}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>

            {tipo != null && (
              <>
                {mostrar && (
                  <>
                    <div className='col-lg-5 col-sm-6 col-md-5 mt-2'>
                      <div className='panel-search'>
                        <div className='form-group gov-co-form-group'>
                          <label className='text'>
                            <span className='required'>* </span> Municipio
                          </label>
                          <Form.Item
                            name='municipio'
                            initialValue={obj?.municipio ? obj?.municipio : idBogotac}
                            rules={[{ required: true }]}
                          >
                            <SelectComponent
                              options={l_municipios}
                              optionPropkey='idMunicipio'
                              optionPropLabel='descripcion'
                              disabled={modificar}
                              value={idBogotac}
                              searchValue={idBogotac}
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
            {tipo == null && (
              <>
                <div className='col-lg-5 col-sm-4 col-md-5 mt-2'>
                  <div className='panel-search'>
                    <div className='form-group gov-co-form-group '>
                      <label className='text'>
                        <span className='required'>* </span> Localidad
                      </label>
                      <Form.Item
                        initialValue={obj?.localidad ? obj?.localidad : idlocalidad}
                        name='localidad'
                        rules={[{ required: true }]}
                      >
                        <SelectComponent
                          options={l_localidades}
                          disabled={modificar}
                          optionPropkey='idLocalidad'
                          optionPropLabel='descripcion'
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className='col-lg-5 col-sm-4 col-md-5 mt-2'>
              <div className='panel-search'>
                <div className='form-group gov-co-form-group'>
                  <label className='text'>
                    <span></span> Vereda
                  </label>
                  <Form.Item initialValue={obj?.vereda} name='vereda' rules={[{ required: false }]}>
                    <Input
                      maxLength={50}
                      type='text'
                      disabled={modificar}
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
                  <label className='text'>
                    <span></span> Sector
                  </label>
                  <Form.Item initialValue={obj?.vereda} name='sector' rules={[{ required: false }]}>
                    <Input
                      maxLength={50}
                      disabled={modificar}
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
              <label className='text'>
                <span></span> Observaciones Adicionales
              </label>
              <Form.Item
                initialValue={obj?.observacionUbicacion ? obj?.observacionUbicacion : ''}
                name='observations'
                rules={[{ required: false }]}
              >
                <Input.TextArea rows={5} maxLength={230} disabled={modificar} style={{ width: '300px' }} />
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
