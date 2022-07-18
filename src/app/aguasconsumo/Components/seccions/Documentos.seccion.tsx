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
  const [guardararchivostabla, setguardararchivostabla] = useState<any[]>([]);

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

      cargardatos();
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

  const cargardatos = () => {
    const prueba: any = [];
    prueba.push({
      check: false,
      nombre: 'Fotocopia documento de identificación PN',
      valor: 'Fotocopia_documento_de_identificación_PN',
      id: '3C9CF345-E37D-4AB0-BACA-C803DBB8850B'
    });
    prueba.push({
      check: true,
      nombre: 'Plano de localización de la fuente hídrica y de uso del suelo',
      valor: 'Plano_de_localización_de_la_fuente_hídrica_y_de_uso_del_suelo',
      id: '9EDCE704-F1D9-4F9D-8764-A436BDFE5FF0'
    });
    prueba.push({
      check: false,
      nombre: 'Plan del sistema de abastecimiento o acueducto(red de distribución)',
      valor: 'Plan_del_sistema_de_abastecimiento_o_acueducto',
      id: '9EDCE704-F1D9-4F9D-8764-A980BDFE5FF0'
    });

    setacueductos(prueba);
  };

  const subia = (value: any) => {
    setarchivocargado(value);
  };
  const onChange = (value: any) => {
    var nombre: string = value.target.id;

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

    setarchivos(array);
  };

  const insertarArchivo = async () => {
    const archivo = archivocargado;
    console.log(guardararchivos, ' Archivos Guardados');
    const array: any[] = [];
    const arraytabla: any[] = [];

    var posicion: number = 1;
    for (let index = 0; index < archivos.length; index++) {
      props.form.resetFields([`checkbox${index}`]);
      if (archivos[index] == '1') {
        if (guardararchivos[index] != undefined) {
          console.log('entro validacion habia archivo ', index);
          array.push(guardararchivos[index]);
          arraytabla.push(guardararchivos[index]);
        } else {
          console.log('entro validacion solo selecciono ', index);
          array.push({
            posicion: posicion,
            nombre: acueducto[index].nombre,
            valor: acueducto[index].valor,
            id: acueducto[index].id,
            archivo: archivo
          });
          arraytabla.push({
            posicion: posicion,
            nombre: acueducto[index].nombre,
            valor: acueducto[index].valor,
            id: acueducto[index].id,
            archivo: archivo
          });
        }
      } else {
        console.log('entro valdiacion no selecciono ', index);
        if (guardararchivos[index] != undefined) {
          array.push(guardararchivos[index]);
          arraytabla.push(guardararchivos[index]);
        } else {
          array.push(guardararchivos[index]);
        }
      }

      posicion++;
    }

    console.log('.--------');
    console.log(array);
    console.log(arraytabla);
    setguardararchivos(array);
    setguardararchivostabla(arraytabla);
    prop(array);
    setacueductos([]);
    setarchivos(['0', '0', '0']);
    cargardatos();
  };

  var posicionform = -1;
  const counterform = () => {
    posicionform = posicionform + 1;
    return posicionform;
  };

  const onClickValidarInformacion = async (datos: any) => {
    const data = datos;
    console.log(guardararchivostabla);
    console.log(data);
    const array: any[] = [];
    const arraytabla: any[] = [];

    for (let index = 0; index < guardararchivos.length; index++) {
      if (guardararchivos[index] != undefined) {
        if (guardararchivos[index].posicion != data.posicion) {
          console.log('index :' + index);
          const aux = guardararchivos[index];

          array.push(aux);
        } else {
          array.push(undefined);
        }
      } else {
        array.push(guardararchivos[index]);
      }
    }
    for (let index = 0; index < guardararchivostabla.length; index++) {
      if (guardararchivostabla[index].posicion != data.posicion) {
        console.log('index :' + index);
        const aux = guardararchivostabla[index];

        arraytabla.push(aux);
      }
    }

    console.log(array);
    setguardararchivos(array);
    setguardararchivostabla(arraytabla);
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
            dataSource={guardararchivostabla}
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
