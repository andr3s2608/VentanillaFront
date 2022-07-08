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
import { SetResetViewLicence, SetViewLicence } from 'app/redux/controlViewLicence/controlViewLicence.action';
import { Button, Table } from 'antd';
import { CheckOutlined } from '@ant-design/icons';

export const DatosAcueducto: React.FC<DatosAcueducto<any>> = (props) => {
  const { obj } = props;

  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [seleccionar, setseleccionar] = useState<boolean>(true);
  const [l_usofuente, setlusofuente] = useState<any[]>([]);

  const [l_departamentos, setLDepartamentos] = useState<IDepartamento[]>([]);
  const [l_municipios, setLMunicipios] = useState<IMunicipio[]>([]);
  const [l_localidades, setLLocalidades] = useState<ILocalidad[]>([]);

  const [idBogotac, setIdBogota] = useState<string>('Bogotá D.C.');
  const idlocalidad = '0e2105fb-08f8-4faf-9a79-de5effa8d198';
  const idDepartamentoBogota = '31b870aa-6cd0-4128-96db-1f08afad7cdd';
  const idmunicipio = '0e2105fb-08f8-4faf-9a79-de5effa8d198';

  const Paginas: number = 5;
  const getListas = useCallback(
    async () => {
      const departamentos = await dominioService.get_departamentos_colombia();
      const municipios = await dominioService.get_all_municipios_by_departamento(obj?.departamento ?? idDepartamentoBogota);
      if (obj?.departamento) {
        setIdBogota('');
      }

      const localidades = await dominioService.get_localidades_bogota();

      const uso = await api.getUsoFuente();
      setlusofuente(uso);

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

  const onClickValidarInformacion = async (datos: any) => {
    const data = datos;

    localStorage.setItem('register', JSON.stringify(data));
    store.dispatch(SetResetViewLicence());
    //history.push('/tramites-servicios-aguas/Revision/revisar-solicitud');
  };
  const structureColumns = [
    {
      title: 'No. de Expediente',
      dataIndex: 'numeroRadicado',
      key: 'nroradicado'
    },
    {
      title: 'Municipio/Vereda',
      dataIndex: 'tipodeTramite',
      key: 'idTramite'
    },
    {
      title: 'Uso de la Fuente',
      dataIndex: 'fechaSolicitud',
      key: 'fechaSolicitud'
    },
    {
      title: 'Acciones',
      key: 'Acciones',
      align: 'center' as 'center',

      render: (_: any, row: any, index: any) => {
        return (
          <Button
            type='primary'
            className='fa-solid fa-circle-xmark'
            key={`vali-${index}`}
            onClick={() => onClickValidarInformacion(row)}
            style={{ fontSize: '30xp', color: 'red' }}
            icon={<CheckOutlined />}
          >
            Validar Información
          </Button>
        );
      }
    }
  ];
  return (
    <>
      <div className='row mt-3'>
        <div className='col-lg-12 col-sm-12 col-md-12'>
          <div className='info-tramite mt-2'>
            <p className='ml-2' style={{ fontSize: '18px', fontWeight: 'bold' }}>
              Información de acueductos que captan la misma fuente. . <br />{' '}
              <small style={{ color: '#000' }}>* Campos Obligatorios</small>
            </p>
          </div>
        </div>
      </div>

      <div className='col-lg-4 col-sm-12 col-md-4'>
        <div className='form-group gov-co-form-group '>
          <label className='text'>
            <span className='required'>* </span> Departamento
          </label>
          <div className='gov-co-dropdown'>
            <Form.Item name='departamento' initialValue={idDepartamentoBogota} rules={[{ required: true }]}>
              <SelectComponent
                options={l_departamentos}
                optionPropkey='idDepartamento'
                optionPropLabel='descripcion'
                onChange={onChangeDepartamento}
              />
            </Form.Item>
          </div>
        </div>
        <div className='form-group gov-co-form-group'>
          <label className='text'>
            <span className='required'>* </span> Localidad o vereda
          </label>
          <div className='gov-co-dropdown'>
            <Form.Item initialValue={''} name='localidad' rules={[{ required: true }]}>
              <SelectComponent options={l_localidades} optionPropkey='idLocalidad' optionPropLabel='descripcion' />
            </Form.Item>
          </div>
        </div>
      </div>
      <div className='col-lg-4 col-sm-12 col-md-4'>
        <div className='form-group gov-co-form-group'>
          <label className='text'>
            <span className='required'>* </span> Municipio
          </label>
          <div className='gov-co-dropdown'>
            <Form.Item name='municipio' initialValue={idBogotac} rules={[{ required: true }]}>
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
        <div className='form-group gov-co-form-group '>
          <label className='text'>
            <span className='required'>* </span> Sector
          </label>
          <div className='gov-co-dropdown'>
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

      <div className='col-lg-4 col-md-4 col-sm-12'>
        <br />
        <p>Coordenadas de capacitación</p>
        <div className='form-group gov-co-form-group'>
          <span className='required'>*</span>Latitud
          <Form.Item name='latituduso' initialValue={''} rules={[{ required: true }]}>
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
      <div className='col-lg-4 col-md-4 col-sm-12' style={{ marginTop: '33px' }}>
        <br />
        <span className='required'>*</span>Longitud
        <div className='form-group gov-co-form-group'>
          <Form.Item name='longituduso' initialValue={''} rules={[{ required: true }]}>
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

      <div className='row mt-2'>
        <div className='col-lg-4 col-md-4 col-sm-12'>
          <br />
          <span className='required'>*</span>Uso de la fuente
          <div className='form-group gov-co-form-group'>
            <Form.Item name='usofuente' initialValue={''} rules={[{ required: true }]}>
              <SelectComponent options={l_usofuente} optionPropkey='idUsoFuente' optionPropLabel='nombre' />
            </Form.Item>
          </div>
        </div>
        <div className='col-lg-4 col-md-4 col-sm-12'>
          <br />
          <div className='form-group gov-co-form-group'>
            <span></span>Descripción de otro uso
            <Form.Item name='descripcionotrouso' initialValue={''} rules={[{ required: true }]}>
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
      </div>
      <div className='row mt-3'>
        <div className='col-lg-4 col-md-4 col-sm-12'>
          <div className='form-group gov-co-form-group'>
            <span></span>Caudal total
            <Form.Item name='caudal' initialValue={''} rules={[{ required: true }]}>
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
      </div>
      <div className='row '>
        <div className='col-lg-8 col-md-8 col-sm-12'>
          <a href='' style={{ textDecoration: 'none' }}>
            <i className='fa-solid fa-circle-plus' style={{ color: '#0FD7E0', fontSize: '30px', float: 'right' }}></i>
          </a>
        </div>
        <div className='col-lg-12 col-md-12 col-sm-12 ml-2'>
          <Table
            id='tableGen'
            dataSource={[]}
            columns={structureColumns}
            pagination={{ pageSize: Paginas }}
            className='table_info'
          />
        </div>
      </div>
    </>
  );
};
interface DatosAcueducto<T> {
  form: FormInstance<T>;
  obj: any;
}
export const KeysForm = ['statustramite', 'observations'];
