import React, { useCallback, useEffect, useState } from 'react';
import '../../../../css/estilos.css';
// Antd
import Form, { FormInstance } from 'antd/es/form';
import Input from 'antd/es/input';
import { Modal } from 'antd';
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
import { Button, Radio, Table, Upload } from 'antd';
import { CheckOutlined, FilePdfOutlined, UploadOutlined } from '@ant-design/icons';
import { arch } from 'os';

export const DatosDocumentos: React.FC<DatosDocumentos<any>> = (props) => {
  const { obj, prop, tipo } = props;

  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);

  const [urlPdfDocumento, setUrlPdfDocumento] = useState<string>('default');
  const [enableModalViewDocument, setEnableModalViewDocument] = useState<boolean>(false);

  const [acueducto, setacueductos] = useState<any[]>([]);

  const [archivos, setarchivos] = useState<any[]>(['0', '0', '0', '0', '0', '0', '0']);
  const [archivocargado, setarchivocargado] = useState<any>();
  const [guardararchivos, setguardararchivos] = useState<any[]>([]);
  const [consultararchivos, setconsultararchivos] = useState<any[]>([]);
  const [guardararchivostabla, setguardararchivostabla] = useState<any[]>([]);

  const [urlPdf, setUrlPdf] = useState<any>('');
  const [heightIframe, setHeightIframe] = useState<string>('');

  const Paginas: number = 10;
  const getListas = useCallback(
    async () => {
      const documentos = await api.getSupportDocumentsAguas(obj.idsolicitud);

      const filter = documentos.filter(function (f: { idTipoDocumentoAdjunto: string }) {
        return (
          f.idTipoDocumentoAdjunto != '3c9cf345-e37d-4ab0-baca-c803dbb5380b' &&
          f.idTipoDocumentoAdjunto != '9edce821-f1d9-4f9d-8764-a436bdfe5ff0' &&
          f.idTipoDocumentoAdjunto != '96d00032-4b60-4027-afea-0cc7115220b4' &&
          f.idTipoDocumentoAdjunto != '81c98a3C-730c-457a-bba1-877b737a9847'
        );
      });
      setconsultararchivos(filter);

      const array: any[] = [];

      for (let index = 0; index < filter.length; index++) {
        let posicion_ = 0;

        const posicioninicial = filter[index].path.indexOf('/');
        const path = filter[index].path;
        const idtipo = filter[index].idTipoDocumentoAdjunto;

        for (let index2 = 0; index2 < path.length; index2++) {
          if (path.substring(index2, index2 + 1) == '_') {
            posicion_ = index2;
          }
        }

        var cadena = path.substring(posicioninicial + 1, posicion_);

        array.push({
          posicion: index + 1,
          nombre: cadena,
          valor: cadena,
          id: idtipo,
          subida: 'nube',
          path: path
        });
      }
      setguardararchivos(array);
      if (prop != null) {
        prop(array);
      }
      setguardararchivostabla(array);

      cargardatos();
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
    //////1.	Agua cruda///////

    prueba.push({
      check: true,
      nombre: 'La caracterización del agua cruda',
      valor: 'La_caracterización_del_agua_cruda',
      tipo: 'Agua cruda',
      id: '79572C8A-FFFE-440B-BE57-049B42B655A1'
    });
    prueba.push({
      check: true,
      nombre: 'Resultados previos de agua cruda (no mayor a 12 meses)',
      valor: 'Resultados_previos_de_agua_cruda_(no mayor a 12 meses)',
      tipo: 'Agua cruda',
      id: 'C6D1F4B7-AFB9-4A1E-B9F9-0AEC2BA87346'
    });

    /////////2.	Descripción del sistema de tratamiento////
    prueba.push({
      check: true,
      nombre: 'Planos, memorias y cálculo de diseño de la planta de tratamiento de agua para consumo humano',
      valor: 'Planos,memorias_y_cálculo_de_diseño_de_la_planta_de_tratamiento_de_agua_para_consumo_humano',
      tipo: 'Descripción del sistema de tratamiento',
      id: '9EDCE704-F1D9-4F9D-8764-A436BDFE5FF0'
    });

    prueba.push({
      check: false,
      nombre: 'Plan de cumplimiento o el plan de acción',
      valor: 'Plan_de_cumplimiento_o_el_plan_de_acción',
      tipo: 'Descripción del sistema de tratamiento',
      id: '9EDCE704-F1D9-4F9D-8764-A980BDFE5FF0'
    });

    prueba.push({
      check: false,
      nombre: 'Manual de operación y mantenimiento',
      valor: 'Manual_de_operación_y_mantenimiento',
      tipo: 'Descripción del sistema de tratamiento',
      id: '3C9CF345-E37D-4AB0-BACA-C803DBB8850B'
    });

    /////////3.	Análisis de riesgos
    prueba.push({
      check: false,
      nombre: 'Plan de contingencia de los sistemas de suministro',
      valor: 'Plan_de_contingencia_de_los_sistemas_de_suministro',
      tipo: 'Análisis de riesgos',
      id: 'B54F609C-02A3-42A0-B43C-02E055447EF7'
    });
    prueba.push({
      check: false,
      nombre: 'Documento de la identificación del riesgos',
      valor: 'Documento_de_la_identificación_del_riesgos',
      tipo: 'Análisis de riesgos',
      id: 'E9057F6C-9DBB-458E-9F5E-15D8F1677C66'
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

    const array: any[] = [];
    const arraytabla: any[] = [];

    var posicion: number = 1;
    for (let index = 0; index < archivos.length; index++) {
      props.form.resetFields([`checkbox${index}`]);
      if (archivos[index] == '1') {
        if (guardararchivos[index] != undefined) {
          array.push(guardararchivos[index]);
          arraytabla.push(guardararchivos[index]);
        } else {
          array.push({
            posicion: posicion,
            nombre: acueducto[index].nombre,
            valor: acueducto[index].valor,
            id: acueducto[index].id,
            archivo: archivo,
            subida: 'local'
          });
          arraytabla.push({
            posicion: posicion,
            nombre: acueducto[index].nombre,
            valor: acueducto[index].valor,
            id: acueducto[index].id,
            archivo: archivo,
            subida: 'local'
          });
        }
      } else {
        if (guardararchivos[index] != undefined) {
          array.push(guardararchivos[index]);
          arraytabla.push(guardararchivos[index]);
        } else {
          array.push(guardararchivos[index]);
        }
      }

      posicion++;
    }

    setguardararchivos(array);
    setguardararchivostabla(arraytabla);
    if (prop != null) {
      prop(array);
    }
    setacueductos([]);
    setarchivos(['0', '0', '0', '0', '0', '0', '0']);
    cargardatos();
  };

  var posicionform = -1;
  const counterform = () => {
    posicionform = posicionform + 1;
    return posicionform;
  };

  const onClickValidarInformacion = (datos: any) => {
    const data = datos;

    const array: any[] = [];
    const arraytabla: any[] = [];

    for (let index = 0; index < guardararchivos.length; index++) {
      if (guardararchivos[index] != undefined) {
        if (guardararchivos[index].posicion != data.posicion) {
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
        const aux = guardararchivostabla[index];

        arraytabla.push(aux);
      }
    }

    setguardararchivos(array);
    setguardararchivostabla(arraytabla);
    prop(array);

    //history.push('/tramites-servicios-aguas/Revision/revisar-solicitud');
  };

  const viewPDF = async (DocumentsSupport: any) => {
    let pdfUrl: string = '';

    if (DocumentsSupport.subida === 'nube') {
      const pdfBlob = await api.GetBlobAzure(DocumentsSupport.path + '.pdf');
      pdfUrl = URL.createObjectURL(pdfBlob as Blob);
    } else if (DocumentsSupport.subida === 'local') {
      const pdfFile = DocumentsSupport.archivo.file;
      pdfUrl = URL.createObjectURL(pdfFile as File);
    }

    setUrlPdfDocumento(pdfUrl);
    setEnableModalViewDocument(true);
  };

  let posicion = 0;

  const calcularposicion = () => {
    posicion++;
    return posicion;
  };
  var stringData = consultararchivos.reduce((result, item) => {
    return `${result}${item.path}|`;
  }, '');
  const validar = () => {
    const posicioninicial = stringData.indexOf('/');
    var posicion_ = 0;
    for (let index = 0; index < stringData.indexOf('|'); index++) {
      if (stringData.substring(index, index + 1) == '_') {
        posicion_ = index;
      }
    }
    var cadena = stringData.substring(posicioninicial + 1, posicion_);
    const posicionfinal = stringData.indexOf('|');
    stringData = stringData.substring(posicionfinal + 1, stringData.length);

    return cadena;
  };

  const tabla1 = [
    {
      title: 'Tipo de Documento. ',
      dataIndex: 'tipo',
      key: 'tipo',
      render: (text: any, row: any, index: number) => {
        if (index === 2) {
          return {
            children: text,

            props: { rowSpan: 3 }
          };
        } else {
          if (index === 0 || index === 5) {
            return {
              children: text,

              props: { rowSpan: 2 }
            };
          } else {
            return {
              props: { rowSpan: 0 }
            };
          }
        }
      }
    },
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
      title: 'Nombre de Documento. ',
      dataIndex: 'nombre',
      key: 'nombre'
    }
  ];
  var tabla2: any[] = [];

  if (obj?.tipodeSolicitud != 'Primera vez') {
    tabla2 = [
      {
        title: 'No. ',
        dataIndex: 'posicion',
        key: 'posicion',
        render: (Text: string) => (
          <Form.Item label='' name=''>
            <text>{calcularposicion()}</text>
          </Form.Item>
        )
      },
      {
        title: 'Nombre del Archivo',
        dataIndex: 'nombre',
        key: 'nombre',
        render: (Text: string) => (
          <Form.Item label='' name=''>
            <text>{validar()}</text>
          </Form.Item>
        )
      },
      {
        title: 'Acciones',
        key: 'Acciones',
        align: 'center' as 'center',

        render: (_: any, row: any, index: any) => <FilePdfOutlined onClick={() => viewPDF(row)} style={{ fontSize: '30px' }} />
      }
    ];
  } else {
    tabla2 = [
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
            <>
              <FilePdfOutlined onClick={() => viewPDF(row)} style={{ fontSize: '30px' }} />
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
            </>
          );
        }
      }
    ];
  }
  return (
    <>
      <section style={{ width: '100%' }}>
        <div className='container-fluid'>
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
              {tipo != 'gestion' && (
                <>
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
                </>
              )}

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
            </div>
          </div>
          <div className='row mt-3'>
            {tipo != 'gestion' && (
              <>
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
              </>
            )}

            <div className='form-row'>
              <div className='col-lg-8  col-md-8  col-sm-12 mt-3'>
                <Table
                  id='tableGen2'
                  dataSource={guardararchivostabla}
                  columns={tabla2}
                  pagination={{ pageSize: Paginas }}
                  className='table_info'
                />{' '}
                <br />
              </div>
            </div>
            <small className='mt-1'>* Espacio del ciudadano para incluir documentación adicionar de ser requerido</small>

            {tipo == 'gestion' && (
              <>
                <div className='col-lg-12 col-md-12 col-sm-12'>
                  <div className='apro'>
                    <span></span>¿Aprobado?
                    <Form.Item label='' name={'radioaprobacion'}>
                      <Radio.Group name={'radiobut'} defaultValue={1}>
                        <Radio value={1}>Si</Radio>
                        <Radio value={2}>No</Radio>
                      </Radio.Group>
                    </Form.Item>
                    <Form.Item
                      initialValue={obj?.observacionUbicacion ? obj?.observacionUbicacion : ''}
                      name='observations'
                      rules={[{ required: false }]}
                    >
                      <Input.TextArea rows={5} maxLength={300} style={{ width: '300px' }} />
                    </Form.Item>
                  </div>
                </div>
              </>
            )}
          </div>

          <Modal
            title={<p className='text-center'> Visualización de Documento </p>}
            visible={enableModalViewDocument}
            width={1000}
            okButtonProps={{ hidden: true }}
            onCancel={() => setEnableModalViewDocument(false)}
            cancelText='Cerrar'
          >
            <iframe src={urlPdfDocumento} frameBorder='0' scrolling='auto' height='600vh' width='100%'></iframe>
          </Modal>
        </div>
      </section>
    </>
  );
};
interface DatosDocumentos<T> {
  form: FormInstance<T>;
  obj: any;
  prop: any;
  tipo: any;
}
export const KeysForm = ['statustramite', 'observations'];
