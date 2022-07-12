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
import { Button, Table, Upload } from 'antd';
import { CheckOutlined, UploadOutlined } from '@ant-design/icons';
import { arch } from 'os';

export const DatosDocumentos: React.FC<DatosDocumentos<any>> = (props) => {
  const { obj, prop } = props;

  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);

  const [l_usofuente, setlusofuente] = useState<any[]>([]);

  const [l_departamentos, setLDepartamentos] = useState<IDepartamento[]>([]);
  const [l_municipios, setLMunicipios] = useState<IMunicipio[]>([]);
  const [l_localidades, setLLocalidades] = useState<ILocalidad[]>([]);

  const [acueducto, setacueductos] = useState<any[]>([]);

  const [archivos, setarchivos] = useState<any[]>(['0', '0', '0']);
  const [archivocargado, setarchivocargado] = useState<any>();
  const [guardararchivos, setguardararchivos] = useState<any[]>([]);

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
      const prueba: any = [];
      prueba.push({ check: false, nombre: 'Fotocopia documento de identificación PN' });
      prueba.push({ check: true, nombre: 'Plano de localización de la fuente hidrica y de uso del suelo' });
      prueba.push({ check: false, nombre: 'Plan del sistema de abastecimiento o acueducto(red de distribución)' });

      setacueductos(prueba);
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

  const subia = (value: any) => {
    console.log(value);
    setarchivocargado(value);
  };
  const onChange = (value: any) => {
    console.log(value.target.id);

    var nombre: string = value.target.id;
    console.log(props.form.getFieldValue(nombre));
    var posicion: number = parseInt(nombre.substring(8, 9));

    const array: any[] = [];
    for (let index = 0; index < archivos.length; index++) {
      if (index == posicion) {
        if (archivos[index] == '0') {
          array.push('1');
        } else {
          array.push('0');
        }
      } else {
        array.push(archivos[index]);
      }
    }
    console.log(array);
    setarchivos(array);
  };

  const insertarArchivo = async () => {
    const archivo = archivocargado;

    const array: any[] = [];

    console.log(guardararchivos);
    var posicion: number = 0;
    for (let index = 0; index < archivos.length; index++) {
      if (archivos[index] == '1') {
        array.push({
          posicion: posicion,
          nombre: acueducto[index].nombre,
          archivo: archivo
        });
      } else {
        if (guardararchivos[index] != undefined) {
          array.push(guardararchivos[index]);
        }
      }

      posicion++;
    }
    console.log(array);
    setguardararchivos(array);
    prop(array);
  };

  var posicionform = -1;
  const counterform = () => {
    posicionform = posicionform + 1;
    return posicionform;
  };

  const onClickValidarInformacion = async (datos: any) => {
    const data = datos;
    const array: any[] = [];
    const arraytabla: any[] = [];
    var pos: number = 0;
    for (let index = 0; index < guardararchivos.length; index++) {
      if (index != data.posicion) {
        const aux = guardararchivos[index];

        aux.posicion = pos;
        pos++;

        array.push(aux);
      }
    }
    setguardararchivos(array);
    prop(array);

    //history.push('/tramites-servicios-aguas/Revision/revisar-solicitud');
  };
  const tabla1 = [
    {
      dataIndex: 'check',
      key: 'check',
      render: (Text: string) => (
        <Form.Item label='' name={'checkbox' + counterform()}>
          <Input className='form-check-input' onChange={onChange} type='checkbox' />
        </Form.Item>
      )
    },
    {
      dataIndex: 'nombre',
      key: 'nombre'
    }
  ];
  const tabla2 = [
    {
      title: 'No. ',
      dataIndex: 'posicion',
      key: 'posicion'
    },
    {
      title: 'Nombre del Archivo',
      dataIndex: 'nombre',
      key: 'nombre'
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
      <div className='row'>
        <div className='col-lg-12 col-md-12 col-sm-12'>
          <div className='info-tramite mt-3'>
            <p>Adicionar documentación requisito.</p>
          </div>
        </div>
      </div>
      <div className='row mt-2'>
        <div className='col-lg-5 col-md-5 col-sm-12'>
          <div className='check_d'>
            <Table
              scroll={{ y: 240 }}
              id='tableGen'
              dataSource={acueducto}
              columns={tabla1}
              pagination={{ pageSize: Paginas }}
              className='table_info'
            />{' '}
            <br />
          </div>
        </div>
        <div className='col-md-4 col-sm-12 col-lg-4 ml-5  justify-content-center text-center'>
          <div id='accordion' className='mt-3'>
            <Button
              className=' button btn btn-default'
              type='primary'
              htmlType='button'
              style={{ backgroundColor: '#CBCBCB', border: '2px solid #CBCBCB', color: '#000' }}
              onClick={() => {
                insertarArchivo();
              }}
            >
              Adicionar
            </Button>
          </div>
          <div id='accordion' className='mt-3'>
            <Button
              className=' button btn btn-default'
              type='primary'
              htmlType='button'
              style={{ backgroundColor: '#CBCBCB', border: '2px solid #CBCBCB', color: '#000' }}
            >
              ver archivo
            </Button>
          </div>
          <div id='accordion' className='mt-3'>
            <Button
              className=' button btn btn-default'
              type='primary'
              htmlType='button'
              style={{ backgroundColor: '#CBCBCB', border: '2px solid #CBCBCB', color: '#000' }}
            >
              Borrar
            </Button>
          </div>
        </div>
      </div>
      <div className='row mt-3'>
        <div className='col-lg-8 col-sm-12 col-md-8'>
          <Upload
            name='cargarArchivo'
            onChange={subia}
            maxCount={1}
            beforeUpload={() => false}
            listType='text'
            accept='application/pdf'
          >
            <Button
              className='float-right button btn btn-default'
              icon={<UploadOutlined />}
              style={{ backgroundColor: '#CBCBCB', border: '2px solid #CBCBCB', color: '#000' }}
            >
              Cargar archivo
            </Button>
          </Upload>
        </div>
        <div className='col-lg-8 col-md-8 col-sm-12 mt-3'>
          <Table
            id='tableGen2'
            dataSource={guardararchivos}
            columns={tabla2}
            pagination={{ pageSize: Paginas }}
            className='table_info'
          />{' '}
          <br />
          <small className='mt-1'>* Espacio del ciudadano para incluir documentación adicionar de ser requerido</small>
        </div>
      </div>
    </>
  );
};
interface DatosDocumentos<T> {
  form: FormInstance<T>;
  obj: any;
  prop: any;
}
export const KeysForm = ['statustramite', 'observations'];
