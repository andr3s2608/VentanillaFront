import { authProvider } from 'app/shared/utils/authprovider.util';
import React, { useCallback, useEffect, useState } from 'react';
import { ApiService } from 'app/services/Apis.service';
import Form, { FormInstance } from 'antd/es/form';
import { CheckOutlined } from '@ant-design/icons';
import { Button, Radio, Table } from 'antd';
import '../../../../css/estilos.css';
import Input from 'antd/es/input';
import Swal from 'sweetalert2';

export const DatosAdicionales: React.FC<DatosAdicionales<any>> = (props) => {
  const { obj, tipo, prop, habilitar, tipoSolicitud } = props;
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [campos, setcampos] = useState<any[]>(['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0']);
  const [sistema, setsistema] = useState<any[]>([]);
  const Paginas: number = 10;
  const [tienefuente, settienefuente] = useState<number>(0);
  const [otra, setisotra] = useState<boolean>(false);
  const [lista, setlista] = useState<boolean[]>(
    [false, false, false, false, false, false, false, false, false, false, false, false]
  );


  const getListas = useCallback(async () => {
    const array: any[] = [];
    console.log(obj)
    if (obj?.sistematratamientojson !== undefined) {

      for (let index = 0; index < obj?.sistematratamientojson.length; index++) {

        if (obj.fuenteabastecimientojson[0].tienePlanta === true) {

          settienefuente(1)
        }
        else {

          settienefuente(2)
        }
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


      console.log('aca ' + array)

      props.form.setFieldsValue({
        caudaldesign: array[0].caudaldesign + '',
        caudaltratado: array[0].caudaltratado + '',
        descripcion: array[0].descrip + '',
        numero1: array[0].num1 + '',
        numero2: array[0].num2 + '',
        poblacion1: array[0].pob1 + '',
        poblacion2: array[0].pob2 + ''
      });

      setcampos([
        array[0].sed == true ? '1' : '0',
        array[0].mezr == true ? '1' : '0',
        array[0].mezl == true ? '1' : '0',
        array[0].oxi == true ? '1' : '0',
        array[0].flocula == true ? '1' : '0',
        array[0].filt == true ? '1' : '0',
        array[0].desin == true ? '1' : '0',
        array[0].alma == true ? '1' : '0',
        array[0].torre == true ? '1' : '0',
        array[0].preclo == true ? '1' : '0',
        array[0].desarenador == true ? '1' : '0',
        array[0].otra == true ? '1' : '0'
      ]);
      setlista([
        array[0].sed,
        array[0].mezr,
        array[0].mezl,
        array[0].oxi,
        array[0].flocula,
        array[0].filt,
        array[0].desin,
        array[0].alma,
        array[0].torre,
        array[0].preclo,
        array[0].desarenador,
        array[0].otra
      ]);


    }

    setsistema(array);
    if (prop != null) {
      prop(array);
    }
  }, []);

  useEffect(() => {
    getListas();
  }, []);

  const validacionCaudal = () => {
    const caudalde = props.form.getFieldValue('caudaldesign');
    const caudaltra = props.form.getFieldValue('caudaltratado');

    if (caudalde != undefined && caudaltra != undefined && caudalde != '' && caudaltra != '') {
      if (parseInt(caudaltra) > parseInt(caudalde)) {
        Swal.fire({
          icon: 'info',

          title: 'Caudal incorrecto',
          text: `El caudal tratado no puede ser menor al caudal diseño`
        });
      }
      else {
        insertarsistema();
      }
    }
  };

  const onChange = (value: any) => {
    var nombre: string = value.target.id;

    var posicion: number = parseInt(nombre.substring(8, nombre.length));

    const array: any[] = [];
    const arraylista: any[] = [];
    for (let index = 0; index < campos.length; index++) {
      if (index == posicion) {
        if (campos[index] == '0') {
          if (posicion === 11) {
            setisotra(true)
          }
          array.push('1');
          arraylista.push(true);
        } else {
          if (posicion === 11) {
            setisotra(false)
          }
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
        if (tipoSolicitud !== 'primera-vez') {
          return (
            <Button
              type='primary'
              className='fa-solid fa-circle-xmark'
              key={`vali-${index}`}
              onClick={() => onClickLlenarInformacion(row)}
              style={{ fontSize: '30xp' }}
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
              key={`validar`}
              onClick={() => onClickValidarInformacion(row)}
              style={{ fontSize: '30xp', color: 'white' }}
              icon={<CheckOutlined />}
            >
              Eliminar
            </Button>
          );
        }
      }
    }
  ];

  if (habilitar) {
    return (
      <>
        {' '}
        <section style={{ width: '100%' }}>
          <div className='container-fluid'>
            <div className='form-row' style={{ marginLeft: '-16px' }}>
              <div className='col-lg-6 col-sm-12 col-md-6'>
                <p>¿Tiene planta de tratamiento de agua para el consumo humano?</p>
              </div>
              <div className='col-lg-6 col-sm-12 col-md-6'>
                <Form.Item label='' name={'formradio'} initialValue={tienefuente}>
                  <Radio.Group name={'radiobut'} defaultValue={tienefuente}>
                    <Radio value={1}>Si</Radio>
                    <Radio value={2}>No</Radio>
                  </Radio.Group>
                </Form.Item>
              </div>
            </div>

            <div className='form-row mt-3' style={{ marginLeft: '-16px' }}>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <span className='required'>*</span> Caudal diseño (L/s)
                <Form.Item name='caudaldesign' rules={[{ required: false }]}>
                  <Input
                    type='text'
                    className='form-control gov-co-form-control'
                    maxLength={100}
                    onKeyPress={(event) => {
                      if (!/[0-9,.]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                    }}
                  />
                </Form.Item>
              </div>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <span className='required'>*</span> Caudal tratado (L/s)
                <Form.Item name='caudaltratado' rules={[{ required: false }]}>
                  <Input
                    type='text'
                    className='form-control gov-co-form-control'
                    maxLength={100}
                    onKeyPress={(event) => {
                      if (!/[0-9,.]/.test(event.key)) {
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
            <div className='form-row mt-3' style={{ marginLeft: '-16px' }}>
              <div className='col-md-4 col-lg-4 col-sm-12'>
                {tipoSolicitud === 'primera-vez' && (
                  <>


                    <Button
                      className='fa-solid fa-circle-plus'
                      style={{ color: '#fff', letterSpacing: '2px', float: 'right', textTransform: 'lowercase' }}
                      type='primary'
                      htmlType='button'
                      onClick={() => {
                        validacionCaudal();

                      }}
                    >
                      Adicionar Caudal <span><i className="fa-solid fa-plus ml-3"></i></span>

                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className='row' style={{ marginLeft: '-16px' }}>
              <div className='col-lg-12 col-md-12 col-sm-12 ml-2'>
                <Table
                  scroll={{ x: 500 }}
                  id='tableGen'
                  dataSource={sistema}
                  columns={structureColumns}
                  pagination={{ pageSize: Paginas }}
                  className='table_info'
                />
                <br />
              </div>
            </div>
            <div className='form-row mt-5' style={{ marginLeft: '-16px' }}>
              <div className='col-md-4 col-lg-4 col-sm-12'>
                <p>
                  Unidades principales que <br />
                  componen el sistema de <br />
                  mantenimientosaaaa.*
                </p>
              </div>
              <div className='col-md-3 col-lg-3 col-sm-12' style={{ marginLeft: '166px' }} id="column">
                <div className='form-check form-check-inline'>
                  <Form.Item name='checkbox0' rules={[{ required: false }]}>
                    <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[0]} />
                  </Form.Item>
                  <label>Sedimentador</label>
                </div>
                <div className='form-check form-check-inline'>
                  <Form.Item name='checkbox1 ' rules={[{ required: false }]}>
                    <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[1]} />
                  </Form.Item>
                  <label>Mezcla Rapida</label>
                </div>
                <div className='form-check form-check-inline'>
                  <Form.Item name='checkbox2' rules={[{ required: false }]}>
                    <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[2]} />
                  </Form.Item>
                  <label>Almacenamiento</label>
                </div>
                <div className='form-check form-check-inline'>
                  <Form.Item name='checkbox3' rules={[{ required: false }]}>
                    <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[3]} />
                  </Form.Item>
                  <label>Torre de aireación</label>
                </div>
                <div className='form-check form-check-inline'>
                  <Form.Item name='checkbox4' rules={[{ required: false }]}>
                    <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[4]} />
                  </Form.Item>
                  <label>Desinfección</label>
                </div>
                <br />
                <div className='form-check form-check-inline'>
                  <Form.Item name='checkbox5' rules={[{ required: false }]}>
                    <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[5]} />
                  </Form.Item>
                  <label>Precloración</label>
                </div>
              </div>
              <div className='col-md-3 col-lg-3 col-sm-12' style={{ marginLeft: '-60px' }} id="column_right">
                <div className='form-check form-check-inline'>
                  <Form.Item name='checkbox6' rules={[{ required: false }]}>
                    <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[6]} />
                  </Form.Item>
                  <label>Filtración</label>
                </div>

                <div className='form-check form-check-inline' style={{ marginLeft: '16px' }}>
                  <Form.Item name='checkbox7' rules={[{ required: false }]}>
                    <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[7]} />
                  </Form.Item>
                  <label>Mezcla lenta</label>
                </div>
                <div className='form-check form-check-inline'>
                  <Form.Item name='checkbox8' rules={[{ required: false }]}>
                    <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[8]} />
                  </Form.Item>
                  <label>Oxidación</label>
                </div>
                <div className='form-check form-check-inline' style={{ marginLeft: '16px' }}>
                  <Form.Item name='checkbox9' rules={[{ required: false }]}>
                    <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[9]} />
                  </Form.Item>
                  <label>Floculador</label>
                </div>
                <div className='form-check form-check-inline'>
                  <Form.Item name='checkbox10' rules={[{ required: false }]}>
                    <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[10]} />
                  </Form.Item>
                  <label>Desarenador</label>
                </div>
                <div className='form-check form-check-inline' style={{ marginLeft: '3px' }}>
                  <Form.Item name='checkbox11' rules={[{ required: false }]}>
                    <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[11]} />
                  </Form.Item>
                  <label>Otra</label>
                </div>
              </div>
            </div>
            {otra && (<>
              <div className='form-row mt-3' style={{ marginLeft: '-30px' }}>
                <div className='col-lg-6 col-sm-12 col-md-6 mt-3'>
                  <span></span>Descripción de otro componente del sistema de tratamiento
                  <div className='form-group gov-co-form-group'>
                    <Form.Item name='descripcion' rules={[{ required: false }]}>
                      <Input
                        type='text'
                        className='form-control gov-co-form-control personal'
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
            </>)}

            <div className='form-row mt-3'>
              <div className='col-lg-3 col-md-9 col-sm-12 mt-2'>
                Número de usuarios
              </div>

              <div className='col-lg-9 col-md-9 col-sm-12'>
                <div className='form-row mt-3'>
                  <div className='col-lg-6 col-md-6 col-sm-12'>
                    <Form.Item label='Urbano' name='numero2' rules={[{ required: false }]}>
                      <Input
                        style={{ width: '200px' }}
                        type='text'
                        className='form-control gov-co-form-control inputtext'
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
                  <div className='col-lg-6 col-md-6 col-sm-12'>
                    <Form.Item label='Rural' name='numero1' rules={[{ required: false }]}>
                      <Input
                        style={{ width: '200px' }}
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

            <div className='form-row'>
              <div className='col-lg-3 col-md-3 col-sm-12'>
                Población beneficiada
              </div>

              <div className='col-lg-9 col-md-9 col-sm-12'>
                <div className='form-row'>
                  <div className='col-lg-6 col-md-6 col-sm-12'>
                    <Form.Item label='Urbano' name='poblacion2' rules={[{ required: false }]}>
                      <Input
                        style={{ width: '200px' }}
                        type='text'
                        className='form-control gov-co-form-control otherinput'
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
                  <div className='col-lg-6 col-md-6 col-sm-12'>
                    <Form.Item label='Rural' name='poblacion1' rules={[{ required: false }]}>
                      <Input
                        style={{ width: '200px' }}
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
        </section>
      </>
    );
  } else {
    return (
      <>
        <section style={{ width: '100%' }}>
          <div className='container-fluid'>
            <div className='form-row' style={{ marginLeft: '-16px' }}>
              <div className='col-lg-6 col-sm-12 col-md-6'>
                <p>
                  ¿Tiene planta de tratamiento de agua <br /> para el consumo humano?
                </p>
              </div>
              {tienefuente != 0 && (<>
                <div className='col-lg-6 col-sm-12 col-md-6'>
                  <Form.Item label='' name={'formradio'} >
                    <Radio.Group name={'radiobut'} defaultValue={tienefuente} disabled={true}>
                      <Radio value={1}>Si</Radio>
                      <Radio value={2}>No</Radio>
                    </Radio.Group>
                  </Form.Item>
                </div></>)}

            </div>
            <div className='form-row mt-3' style={{ marginLeft: '-16px' }}>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <span className='required'>*</span> Caudal diseño (L/s)
                <Form.Item name='caudaldesign' rules={[{ required: false }]}>
                  <Input
                    type='text'
                    className='form-control gov-co-form-control'
                    disabled={true}
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
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <span className='required'>*</span> Caudal tratado (L/s)
                <Form.Item name='caudaltratado' rules={[{ required: false }]}>
                  <Input
                    type='text'
                    className='form-control gov-co-form-control'
                    disabled={true}
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
            <div className='form-row mt-3' style={{ marginLeft: '-16px' }}>
              {tipoSolicitud === 'primera-vez' && (
                <>
                  <div className='col-lg-12 col-md-12 col-sm-12'>
                    <a href='' style={{ textDecoration: 'none' }}>
                      <i className='fa-solid fa-circle-plus' style={{ color: '#0FD7E0', fontSize: '30px', float: 'right' }}></i>
                    </a>
                  </div>

                  <Button
                    className='fa-solid fa-circle-plus'
                    style={{ color: '#0FD7E0', fontSize: '30px', float: 'right' }}
                    type='primary'
                    disabled={true}
                    htmlType='button'
                    onClick={() => {
                      insertarsistema();
                    }}
                  >
                    Enviar
                  </Button>
                </>
              )}
            </div>
            <div className='row' style={{ marginLeft: '-16px' }}>
              <div className='col-lg-12 col-md-12 col-sm-12 ml-2'>
                <Table
                  scroll={{ x: 500 }}
                  id='tableGen'
                  dataSource={sistema}
                  columns={structureColumns}
                  pagination={{ pageSize: Paginas }}
                  className='table_infod'
                />
                <br />
              </div>
            </div>
            <div className='form-row mt-5' style={{ marginLeft: '-16px' }}>
              <div className='col-md-4 col-lg-4 col-sm-12'>
                <p>
                  Unidades principales que <br />
                  componen el sistema de <br />
                  mantenimiento.*
                </p>
              </div>
              <div className='col-md-3 col-lg-3 col-sm-12' style={{ marginLeft: '166px' }} id="column">
                <div className='form-check form-check-inline'>
                  <Form.Item name='checkbox0' rules={[{ required: false }]}>
                    <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[0]} disabled={true} />
                  </Form.Item>
                  <label>Sedimentador</label>
                </div>
                <div className='form-check form-check-inline'>
                  <Form.Item name='checkbox1 ' rules={[{ required: false }]}>
                    <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[1]} disabled={true} />
                  </Form.Item>
                  <label>Mezcla Rapida</label>
                </div>
                <div className='form-check form-check-inline'>
                  <Form.Item name='checkbox2' rules={[{ required: false }]}>
                    <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[2]} disabled={true} />
                  </Form.Item>
                  <label>Almacenamiento</label>
                </div>
                <div className='form-check form-check-inline'>
                  <Form.Item name='checkbox3' rules={[{ required: false }]}>
                    <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[3]} disabled={true} />
                  </Form.Item>
                  <label>Torre de aireación</label>
                </div>
                <div className='form-check form-check-inline'>
                  <Form.Item name='checkbox4' rules={[{ required: false }]}>
                    <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[4]} disabled={true} />
                  </Form.Item>
                  <label>Desinfección</label>
                </div>
                <br />
                <div className='form-check form-check-inline'>
                  <Form.Item name='checkbox5' rules={[{ required: false }]}>
                    <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[5]} disabled={true} />
                  </Form.Item>
                  <label>Precloración</label>
                </div>
              </div>
              <div className='col-md-3 col-lg-3 col-sm-12' style={{ marginLeft: '-60px' }} id="column_right">
                <div className='form-check form-check-inline'>
                  <Form.Item name='checkbox6' rules={[{ required: false }]}>
                    <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[6]} disabled={true} />
                  </Form.Item>
                  <label>Filtración</label>
                </div>

                <div className='form-check form-check-inline' style={{ marginLeft: '16px' }}>
                  <Form.Item name='checkbox7' rules={[{ required: false }]}>
                    <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[7]} disabled={true} />
                  </Form.Item>
                  <label>Mezcla lenta</label>
                </div>
                <div className='form-check form-check-inline'>
                  <Form.Item name='checkbox8' rules={[{ required: false }]}>
                    <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[8]} disabled={true} />
                  </Form.Item>
                  <label>Oxidación</label>
                </div>
                <div className='form-check form-check-inline' style={{ marginLeft: '16px' }}>
                  <Form.Item name='checkbox9' rules={[{ required: false }]}>
                    <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[9]} disabled={true} />
                  </Form.Item>
                  <label>Floculador</label>
                </div>
                <div className='form-check form-check-inline'>
                  <Form.Item name='checkbox10' rules={[{ required: false }]}>
                    <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[10]} disabled={true} />
                  </Form.Item>
                  <label>Desarenador</label>
                </div>
                <div className='form-check form-check-inline' style={{ marginLeft: '3px' }}>
                  <Form.Item name='checkbox11' rules={[{ required: false }]}>
                    <Input className='form-check-input' onChange={onChange} type='checkbox' checked={lista[11]} disabled={true} />
                  </Form.Item>
                  <label>Otra</label>
                </div>
              </div>
            </div>
            {otra && (<>
              <div className='form-row mt-3' style={{ marginLeft: '-30px' }}>
                <div className='col-lg-6 col-sm-12 col-md-6 mt-3'>
                  <span></span>Descripción de otro componente del sistema de tratamiento
                  <div className='form-group gov-co-form-group'>
                    <Form.Item name='descripcion' rules={[{ required: false }]}>
                      <Input
                        type='text'
                        className='form-control gov-co-form-control personal'
                        disabled={true}
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
            </>)}

            <div className='form-row mt-3' style={{ marginLeft: '-30px' }}>
              <div className='col-lg-3 col-md-3 col-sm-12 mt-2'>
                <span></span>Número de usuarios
              </div>

              <div className='col-lg-4 col-md-4 col-sm-12'>
                <Form.Item name='numero2' rules={[{ required: false }]}>
                  <Input
                    style={{ width: '350px', marginLeft: '-46px' }}
                    type='text'
                    className='form-control gov-co-form-control inputtext'
                    disabled={true}
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
              <div className='col-lg-4 col-md-4 col-sm-12'>
                <Form.Item name='numero2' rules={[{ required: false }]}>
                  <Input
                    style={{ width: '350px', marginLeft: '28px' }}
                    type='text'
                    className='form-control gov-co-form-control'
                    disabled={true}
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

            <div className='form-row mt-3' style={{ marginLeft: '-30px' }}>
              <div className='col-lg-3 col-md-3 col-sm-12 mt-2'>
                <span></span>Población beneficiada
              </div>

              <div className='col-lg-4 col-md-4 col-sm-12'>
                <Form.Item name='poblacion1' rules={[{ required: false }]}>
                  <Input
                    style={{ width: '350px', marginLeft: '-46px' }}
                    type='text'
                    className='form-control gov-co-form-control otherinput'
                    disabled={true}
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
              <div className='col-lg-4 col-md-4 col-sm-12'>
                <Form.Item name='poblacion2' rules={[{ required: false }]}>
                  <Input
                    style={{ width: '350px', marginLeft: '28px' }}
                    type='text'
                    className='form-control gov-co-form-control'
                    disabled={true}
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
        </section>
      </>
    );
  }
};
interface DatosAdicionales<T> {
  form: FormInstance<T>;
  obj: any;
  tipoSolicitud: string;
  tipo: string;
  prop: any;
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
