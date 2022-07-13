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
import { useStepperForm } from 'app/shared/hooks/stepper.hook';

export const DatosAcueducto: React.FC<DatosAcueducto<any>> = (props) => {
  const { obj, prop } = props;

  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);

  const { current, setCurrent, status, setStatus, onNextStep, onPrevStep } = useStepperForm<any>(props.form);
  const [l_usofuente, setlusofuente] = useState<any[]>([]);

  const [l_departamentos, setLDepartamentos] = useState<IDepartamento[]>([]);
  const [l_municipios, setLMunicipios] = useState<IMunicipio[]>([]);
  const [l_localidades, setLLocalidades] = useState<ILocalidad[]>([]);

  const [acueducto, setacueductos] = useState<any[]>([]);
  const [acueductotabla, setacueductostabla] = useState<any[]>([]);

  const [idBogotac, setIdBogota] = useState<string>('Bogotá D.C.');
  const idlocalidad = '0e2105fb-08f8-4faf-9a79-de5effa8d198';
  const idDepartamentoBogota = '31b870aa-6cd0-4128-96db-1f08afad7cdd';
  const idmunicipio = '0e2105fb-08f8-4faf-9a79-de5effa8d198';

  const Paginas: number = 5;
  const getListas = useCallback(
    async () => {
      const departamentos = await dominioService.get_departamentos_colombia();
      const municipios = await dominioService.get_all_municipios_by_departamento(idDepartamentoBogota);
      /*
      if (obj?.departamento) {
        setIdBogota('');
      }
      */
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

  const insertarAcueducto = async () => {
    const validar = props.form.validateFields(KeysForm);
    console.log(validar);
    const dep = props.form.getFieldValue('departamento');
    const loc = props.form.getFieldValue('localidad');
    var mun = props.form.getFieldValue('municipio');
    const sec = props.form.getFieldValue('sector');
    const lat = props.form.getFieldValue('latituduso');
    const long = props.form.getFieldValue('longituduso');
    const uso = props.form.getFieldValue('usofuente');
    const desc = props.form.getFieldValue('descripcionotrouso');
    const caudal = props.form.getFieldValue('caudal');
    if (dep == '31b870aa-6cd0-4128-96db-1f08afad7cdd') {
      mun = '31211657-3386-420a-8620-f9c07a8ca491';
    }

    const array: any[] = [];
    const arraytabla: any[] = [];
    var posicion: number = 0;
    for (let index = 0; index < acueducto.length; index++) {
      array.push(acueducto[index]);
      arraytabla.push(acueductotabla[index]);
      posicion++;
    }

    //push al array que se guardara en la bd
    array.push({
      posicion: posicion,
      departamento: dep,
      mun: mun,
      localidad: loc,
      municipio: mun,
      sector: sec,
      latitud: lat,
      longitud: long,
      usofuente: uso,
      descripcion: desc,
      caudal: caudal
    });
    //push al array que se mostrara en la tabla
    //municipio

    const municipios = (await l_municipios).filter((i) => i.idMunicipio == mun);

    const { descripcion } = municipios[0];
    //localidad
    const localidad = l_localidades.filter((i) => i.idLocalidad == loc);
    const usofuente = l_usofuente.filter((i) => i.idUsoFuente == uso);

    arraytabla.push({
      posicion: posicion,
      munver: descripcion + ' / ' + localidad[0].descripcion,
      usofuente: usofuente[0].nombre
    });

    ////

    setacueductos(array);
    prop(array);
    setacueductostabla(arraytabla);
  };

  const onClickValidarInformacion = async (datos: any) => {
    const data = datos;
    const array: any[] = [];
    const arraytabla: any[] = [];
    var pos: number = 0;
    for (let index = 0; index < acueducto.length; index++) {
      if (index != data.posicion) {
        const aux = acueducto[index];
        const auxtabla = acueductotabla[index];
        aux.posicion = pos;
        auxtabla.posicion = pos;
        pos++;
        arraytabla.push(auxtabla);
        array.push(aux);
      }
    }
    setacueductos(array);
    prop(array);
    setacueductostabla(arraytabla);

    //history.push('/tramites-servicios-aguas/Revision/revisar-solicitud');
  };
  const structureColumns = [
    {
      title: 'No. de Expediente',
      dataIndex: 'posicion',
      key: 'posicion'
    },
    {
      title: 'Municipio/Vereda',
      dataIndex: 'munver',
      key: 'munver'
    },
    {
      title: 'Uso de la Fuente',
      dataIndex: 'usofuente',
      key: 'usofuente'
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
          <Button
            className='fa-solid fa-circle-plus'
            style={{ color: '#0FD7E0', fontSize: '30px', float: 'right' }}
            type='primary'
            htmlType='button'
            onClick={() => {
              insertarAcueducto();
            }}
          >
            Enviar
          </Button>
        </div>
        <div className='row'>
          <div className='col-lg-12 col-md-12 col-sm-12 ml-2'>
            <Table
              id='tableGen'
              dataSource={acueductotabla}
              columns={structureColumns}
              pagination={{ pageSize: Paginas }}
              className='table_info'
            />{' '}
            <br />
          </div>
        </div>
      </div>
    </>
  );
};
interface DatosAcueducto<T> {
  form: FormInstance<T>;
  obj: any;
  prop: any;
}
export const KeysForm = ['localidad', 'sector', 'caudal', 'descripcionotrouso', 'usofuente', 'longituduso', 'latituduso'];
