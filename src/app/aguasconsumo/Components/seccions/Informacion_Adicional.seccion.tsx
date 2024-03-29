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
import { Button, Radio, Table } from 'antd';
import { CheckOutlined } from '@ant-design/icons';

export const DatosAdicionales: React.FC<DatosAdicionales<any>> = (props) => {
  const { obj, tipo, prop } = props;

  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);

  const [campos, setcampos] = useState<any[]>(['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0']);
  const [lista, setlista] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false
  ]);
  const [sistema, setsistema] = useState<any[]>([]);

  const Paginas: number = 5;
  const getListas = useCallback(async () => {
    const array: any[] = [];

    for (let index = 0; index < obj?.sistematratamientojson.length; index++) {
      array.push({
        posicion: index + 1,
        caudaldesign: obj.sistematratamientojson[index].caudalDiseno,
        caudaltratado: obj.sistematratamientojson[index].caudalTratado,
        sed: obj.sistematratamientojson[index].sedimentador,
        mezr: obj.sistematratamientojson[index].mezclaRapido,
        alma: obj.sistematratamientojson[index].almacenamiento,
        torre: obj.sistematratamientojson[index].torreAireacion,
        desin: obj.sistematratamientojson[index].desinfeccion,
        preclo: obj.sistematratamientojson[index].precloracion,
        filt: obj.sistematratamientojson[index].filtracion,
        mezl: obj.sistematratamientojson[index].mezclaLento,
        oxi: obj.sistematratamientojson[index].oxidacion,
        flocula: obj.sistematratamientojson[index].floculador,
        desarenador: obj.sistematratamientojson[index].desarenador,
        otra: obj.sistematratamientojson[index].otra,
        descrip: obj.sistematratamientojson[index].descripcionOtro,
        num1: obj.sistematratamientojson[index].numUsuarioUrbanos,
        num2: obj.sistematratamientojson[index].numUsuariosRurales,
        pob1: obj.sistematratamientojson[index].poblacionUrbanos,
        pob2: obj.sistematratamientojson[index].poblacionRurales
      });
    }
    setsistema(array);
    if (prop != null) {
      prop(array);
    }
  }, []);

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (value: any) => {
    var nombre: string = value.target.id;

    var posicion: number = parseInt(nombre.substring(8, nombre.length));

    const array: any[] = [];
    const arraylista: any[] = [];
    for (let index = 0; index < campos.length; index++) {
      if (index == posicion) {
        if (campos[index] == '0') {
          array.push('1');
          arraylista.push(true);
        } else {
          array.push('0');
          arraylista.push(false);
        }
      } else {
        array.push(campos[index]);
        arraylista.push(lista[index]);
      }
    }

    setlista(arraylista);
    setcampos(array);
  };

  const insertarsistema = async () => {
    const caudalde = props.form.getFieldValue('caudaldesign');
    const caudaltra = props.form.getFieldValue('caudaltratado');

    const descrip = props.form.getFieldValue('descripcion');
    const num1 = props.form.getFieldValue('numero1');
    const num2 = props.form.getFieldValue('numero2');
    const pob1 = props.form.getFieldValue('poblacion1');
    const pob2 = props.form.getFieldValue('poblacion2');

    const array: any[] = [];
    const arraytabla: any[] = [];
    var posicion: number = 0;
    for (let index = 0; index < sistema.length; index++) {
      array.push(sistema[index]);
      posicion++;
    }

    //push al array que se guardara en la bd
    array.push({
      posicion: posicion,
      caudaldesign: caudalde,
      caudaltratado: caudaltra,
      sed: campos[0] == '1' ? true : false,
      mezr: campos[1] == '1' ? true : false,
      alma: campos[2] == '1' ? true : false,
      torre: campos[3] == '1' ? true : false,
      desin: campos[4] == '1' ? true : false,
      preclo: campos[5] == '1' ? true : false,
      filt: campos[6] == '1' ? true : false,
      mezl: campos[7] == '1' ? true : false,
      oxi: campos[8] == '1' ? true : false,
      flocula: campos[9] == '1' ? true : false,
      desarenador: campos[10] == '1' ? true : false,
      otra: campos[11] == '1' ? true : false,
      descrip: descrip,
      num1: num1,
      num2: num2,
      pob1: pob1,
      pob2: pob2
    });

    setcampos(['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0']);
    setlista([false, false, false, false, false, false, false, false, false, false, false, false]);
    props.form.resetFields([
      'checkbox0',
      'checkbox1',
      'checkbox2',
      'checkbox3',
      'checkbox4',
      'checkbox5',
      'checkbox6',
      'checkbox7',
      'checkbox8',
      'checkbox9',
      'checkbox10',
      'checkbox11',
      'descripcion',
      'numero1',
      'numero2',
      'poblacion1',
      'poblacion2',
      'caudaldesign',
      'caudaltratado'
    ]);

    setsistema(array);
    prop(array);
  };

  const onClickLlenarInformacion = async (datos: any) => {
    props.form.setFieldsValue({
      caudaldesign: sistema[datos.posicion - 1].caudaldesign + '',
      caudaltratado: sistema[datos.posicion - 1].caudaltratado + '',
      descripcion: sistema[datos.posicion - 1].descrip + '',
      numero1: sistema[datos.posicion - 1].num1 + '',
      numero2: sistema[datos.posicion - 1].num2 + '',
      poblacion1: sistema[datos.posicion - 1].pob1 + '',
      poblacion2: sistema[datos.posicion - 1].pob2 + ''
    });

    setcampos([
      sistema[datos.posicion - 1].sed == true ? '1' : '0',
      sistema[datos.posicion - 1].mezr == true ? '1' : '0',
      sistema[datos.posicion - 1].mezl == true ? '1' : '0',
      sistema[datos.posicion - 1].oxi == true ? '1' : '0',
      sistema[datos.posicion - 1].flocula == true ? '1' : '0',
      sistema[datos.posicion - 1].filt == true ? '1' : '0',
      sistema[datos.posicion - 1].desin == true ? '1' : '0',
      sistema[datos.posicion - 1].alma == true ? '1' : '0',
      sistema[datos.posicion - 1].torre == true ? '1' : '0',
      sistema[datos.posicion - 1].preclo == true ? '1' : '0',
      sistema[datos.posicion - 1].desarenador == true ? '1' : '0',
      sistema[datos.posicion - 1].otra == true ? '1' : '0'
    ]);
    setlista([
      sistema[datos.posicion - 1].sed,
      sistema[datos.posicion - 1].mezr,
      sistema[datos.posicion - 1].mezl,
      sistema[datos.posicion - 1].oxi,
      sistema[datos.posicion - 1].flocula,
      sistema[datos.posicion - 1].filt,
      sistema[datos.posicion - 1].desin,
      sistema[datos.posicion - 1].alma,
      sistema[datos.posicion - 1].torre,
      sistema[datos.posicion - 1].preclo,
      sistema[datos.posicion - 1].desarenador,
      sistema[datos.posicion - 1].otra
    ]);

    props.form.getFieldValue('descripcion');
    props.form.getFieldValue('numero1');
    props.form.getFieldValue('numero2');
    props.form.getFieldValue('poblacion1');
    props.form.getFieldValue('poblacion2');
  };

  const onClickValidarInformacion = async (datos: any) => {
    const data = datos;
    const array: any[] = [];
    const arraytabla: any[] = [];
    var pos: number = 0;
    for (let index = 0; index < sistema.length; index++) {
      if (index != data.posicion) {
        const aux = sistema[index];
        aux.posicion = pos;

        pos++;
        array.push(aux);
      }
    }
    setsistema(array);
    prop(array);

    //history.push('/tramites-servicios-aguas/Revision/revisar-solicitud');
  };
  const structureColumns = [
    {
      title: 'No. ',
      dataIndex: 'posicion',
      key: 'posicion'
    },
    {
      title: 'Caudal Diseño',
      dataIndex: 'caudaldesign',
      key: 'caudaldesign'
    },
    {
      title: 'Caudal Tratado',
      dataIndex: 'caudaltratado',
      key: 'caudaltratado'
    },
    {
      title: 'Acciones',
      key: 'Acciones',
      align: 'center' as 'center',

      render: (_: any, row: any, index: any) => {
        if (obj?.tipodeSolicitud != 'Primera vez') {
          return (
            <Button
              type='primary'
              className='fa-solid fa-circle-xmark'
              key={`vali-${index}`}
              onClick={() => onClickLlenarInformacion(row)}
              style={{ fontSize: '30xp', color: 'red' }}
              icon={<CheckOutlined />}
            >
              Rellenar
            </Button>
          );
        } else {
          return (
            <Button
              type='primary'
              className='fa-solid fa-circle-xmark'
              key={`vali-${index}`}
              onClick={() => onClickValidarInformacion(row)}
              style={{ fontSize: '30xp', color: 'red' }}
              icon={<CheckOutlined />}
            >
              Eliminar
            </Button>
          );
        }
      }
    }
  ];

  return (
    <>
      <div className='row mt-3'>
        <div className='col-lg-12 col-sm-12 col-md-12'>
          <div className='info-tramite mt-2'>
            <p className='ml-2' style={{ fontSize: '18px', fontWeight: 'bold' }}>
              Información adicional de la fuente de abastecimiento. <br />{' '}
              <small style={{ color: '#000' }}>* Campos Obligatorios</small>
            </p>
          </div>
        </div>
      </div>
      <div className='row mt-3'>
        <div className='col-lg-4 col-sm-12 col-md-3'>
          <p>
            ¿Tiene planta de tratamiento de agua <br /> para el consumo humano?
          </p>
        </div>
        <div className='col-lg-3 col-sm-12 col-md-3'>
          <Form.Item label='' name={'formradio'}>
            <Radio.Group name={'radiobut'} defaultValue={1}>
              <Radio value={1}>Si</Radio>
              <Radio value={2}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </div>
      </div>
      <div className='row'>
        <div className='col-lg-4 col-md-4 col-sm-12'>
          <span></span> Caudal de diseño (L/s)
          <div className='form-group gov-co-form-group'>
            <Form.Item name='caudaldesign' rules={[{ required: false }]}>
              <Input
                type='text'
                className='form-control gov-co-form-control'
                maxLength={100}
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
        <div className='col-lg-4 col-md-4 col-sm-12'>
          <span></span> Caudal de tratado (L/s)
          <div className='form-group gov-co-form-group'>
            <Form.Item name='caudaltratado' rules={[{ required: false }]}>
              <Input
                type='text'
                className='form-control gov-co-form-control'
                maxLength={100}
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

      <div className='row mt-4'>
        {obj?.tipodeSolicitud == 'Primera vez' && (
          <>
            <div className='col-lg-8 col-md-8 col-sm-12'>
              <a href='' style={{ textDecoration: 'none' }}>
                <i className='fa-solid fa-circle-plus' style={{ color: '#0FD7E0', fontSize: '30px', float: 'right' }}></i>
              </a>
            </div>

            <Button
              className='fa-solid fa-circle-plus'
              style={{ color: '#0FD7E0', fontSize: '30px', float: 'right' }}
              type='primary'
              htmlType='button'
              onClick={() => {
                insertarsistema();
              }}
            >
              Enviar
            </Button>
          </>
        )}

        <div className='col-lg-8 col-sm-12 col-md-8'>
          <Table
            id='tableGen'
            dataSource={sistema}
            columns={structureColumns}
            pagination={{ pageSize: Paginas }}
            className='table_info'
          />{' '}
          <br />
        </div>
      </div>
      <div className='row mt-5'>
        <div className='col-md-4 col-lg-4 col-sm-12'>
          <p>
            Unidades principales que <br />
            componen el sistema de <br />
            mantenimiento.*
          </p>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-12'>
          <div className='form-check'>
            <Form.Item name='checkbox0' rules={[{ required: false }]}>
              <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[0]} />
            </Form.Item>
            <span></span>Sedimentador
          </div>
          <div className='form-check'>
            <Form.Item name='checkbox1' rules={[{ required: false }]}>
              <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[1]} />
            </Form.Item>
            <span></span>Mezcla Rapida
          </div>
          <div className='form-check'>
            <Form.Item name='checkbox2' rules={[{ required: false }]}>
              <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[2]} />
            </Form.Item>
            <span></span>Almacenamiento
          </div>
          <div className='form-check'>
            <Form.Item name='checkbox3' rules={[{ required: false }]}>
              <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[3]} />
            </Form.Item>
            <span></span>Torre de aireación
          </div>
          <div className='form-check'>
            <Form.Item name='checkbox4' rules={[{ required: false }]}>
              <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[4]} />
            </Form.Item>
            <span></span>Desinfección
          </div>
          <div className='form-check'>
            <Form.Item name='checkbox5' rules={[{ required: false }]}>
              <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[5]} />
            </Form.Item>
            <span></span>Precloración
          </div>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-12' style={{ marginLeft: '-60px' }}>
          <div className='form-check'>
            <Form.Item name='checkbox6' rules={[{ required: false }]}>
              <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[6]} />
            </Form.Item>
            <span></span>Filtración
          </div>
          <div className='form-check'>
            <Form.Item name='checkbox7' rules={[{ required: false }]}>
              <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[7]} />
            </Form.Item>
            <span></span>Mezcla lenta
          </div>
          <div className='form-check'>
            <Form.Item name='checkbox8' rules={[{ required: false }]}>
              <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[8]} />
            </Form.Item>
            <span></span>Oxidación
          </div>
          <div className='form-check'>
            <Form.Item name='checkbox9' rules={[{ required: false }]}>
              <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[9]} />
            </Form.Item>
            <span></span>Floculador
          </div>
          <div className='form-check'>
            <Form.Item name='checkbox10' rules={[{ required: false }]}>
              <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[10]} />
            </Form.Item>
            <span></span>Desarenador
          </div>
          <div className='form-check'>
            <Form.Item name='checkbox11' rules={[{ required: false }]}>
              <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[11]} />
            </Form.Item>
            <span></span>Otra
          </div>
        </div>
        <div className='col-lg-8 col-sm-12 col-md-8 mt-3'>
          <span></span>Descripción de otro componente del sistema de tratamiento
          <div className='form-group gov-co-form-group'>
            <Form.Item name='descripcion' rules={[{ required: false }]}>
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
      <div className='row mt-3'>
        <div className='col-lg-4 col-sm-12 col-md-4'>
          <span></span>Número de usuarios
        </div>
        <div className='col-lg-2 col-md-2 col-sm-12'>
          <div className='form-group gov-co-form-group'>
            <Form.Item name='numero1' rules={[{ required: false }]}>
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
        <div className='col-lg-2 col-md-2 col-sm-12'>
          <div className='form-group gov-co-form-group'>
            <Form.Item name='numero2' rules={[{ required: false }]}>
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
      <div className='row mt-2'>
        <div className='col-lg-4 col-sm-12 col-md-4'>
          <span></span>Población beneficiada
        </div>
        <div className='col-lg-2 col-md-2 col-sm-12'>
          <div className='form-group gov-co-form-group'>
            <Form.Item name='poblacion1' rules={[{ required: false }]}>
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
        <div className='col-lg-2 col-md-2 col-sm-12'>
          <div className='form-group gov-co-form-group'>
            <Form.Item name='poblacion2' rules={[{ required: false }]}>
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
    </>
  );
};
interface DatosAdicionales<T> {
  form: FormInstance<T>;
  obj: any;
  tipo: string;
  prop: any;
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
