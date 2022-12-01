import React, { useCallback, useEffect, useState } from 'react';
import '../../../../css/estilos.css';
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

import { Button, InputNumber, Radio, Table } from 'antd';
import { CheckOutlined } from '@ant-design/icons';

import Swal from 'sweetalert2';
import { SetDireccion } from 'app/redux/dirrecion/direccion.action';
import Icon from '@ant-design/icons/lib/components/AntdIcon';

export const DatosAcueducto: React.FC<DatosAcueducto<any>> = (props) => {
  const { obj, prop, habilitar, tipoSolicitud } = props;

  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);


  const [latituddec, setlatituddec] = useState<boolean>(true);
  const [l_usofuente, setlusofuente] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [Longitud_input, setLongitud_input] = useState('');
  const [l_departamentos, setLDepartamentos] = useState<IDepartamento[]>([]);
  const [l_municipios, setLMunicipios] = useState<IMunicipio[]>([]);
  const [l_localidades, setLLocalidades] = useState<ILocalidad[]>([]);

  const [acueducto, setacueductos] = useState<any[]>([]);
  const [acueductotabla, setacueductostabla] = useState<any[]>([]);

  const [idBogotac, setIdBogota] = useState<string>('Bogotá D.C.');
  const idlocalidad = '0e2105fb-08f8-4faf-9a79-de5effa8d198';
  const idDepartamentoBogota = '31b870aa-6cd0-4128-96db-1f08afad7cdd';

  const Paginas: number = 10;
  const getListas = useCallback(
    async () => {
      const departamento: any = localStorage.getItem('departamentos');
      const municipiosbogota: any = localStorage.getItem('municipiosbogota');
      const localidadstorage: any = localStorage.getItem('localidades');
      const localidades = JSON.parse(localidadstorage);
      const uso = await api.getUsoFuente();

      const array: any[] = [];
      const arraytabla: any[] = [];

      /*
      for (let index = 0; index < obj?.acueductosfuentejson.length; index++) {
        array.push({
          posicion: index + 1,
          departamento: obj.acueductosfuentejson[index].idDepartamento,
          localidad: obj.acueductosfuentejson[index].idLocalidad,
          municipio: obj.acueductosfuentejson[index].idMunicipio,
          latitud: obj.acueductosfuentejson[index].coo_lat_cy,
          longitud: obj.acueductosfuentejson[index].coo_long_cx,
          usofuente: obj.acueductosfuentejson[index].idUsoFuente,
          descripcion: obj.acueductosfuentejson[index].descripcionOtroUso,
          caudal: obj.acueductosfuentejson[index].caudalTotal
        });

        const localidad = localidades.filter(
          (i: { idLocalidad: any }) => i.idLocalidad == obj.acueductosfuentejson[index].idLocalidad
        );
        const usofuente = uso.filter((i: { idUsoFuente: any }) => i.idUsoFuente == obj.acueductosfuentejson[index].idUsoFuente);
        arraytabla.push({
          posicion: index + 1,
          munver: 'Bogotá D.C. / ' + localidad[0].descripcion,
          usofuente: usofuente[0].nombre
        });
      }*/

      setacueductos(array);
      if (prop != null) {
        prop(array);
      }
      setacueductostabla(arraytabla);

      setlusofuente(uso);

      setLDepartamentos(JSON.parse(departamento));
      setLLocalidades(localidades);
      setLMunicipios(JSON.parse(municipiosbogota));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const insertarAcueducto = async () => {
    const dep = props.form.getFieldValue('departamento');
    const loc = props.form.getFieldValue('localidad');
    var mun = props.form.getFieldValue('municipio');

    const lat = props.form.getFieldValue('latituduso');
    const long = props.form.getFieldValue('longituduso');
    const uso = props.form.getFieldValue('usofuente');
    const desc = props.form.getFieldValue('descripcionotrouso');
    const caudal = props.form.getFieldValue('caudal');

    if (dep == '31b870aa-6cd0-4128-96db-1f08afad7cdd') {
      mun = '31211657-3386-420a-8620-f9c07a8ca491';
    }


    if (loc == undefined || uso == undefined || lat == undefined || long == undefined) {
      Swal.fire({
        icon: 'error',
        title: 'Datos Incompletos',
        text: 'Debe llenar todos los campos obligatorios de la seccion:  Información de acueductos que captan la misma fuente '
      });
    } else {
      if (lat.length > 5) {
        if (long.length > 5) {
          if (Number.parseFloat(caudal) >= 100) {
            Swal.fire({
              icon: 'error',
              title: 'Datos Invalidos',
              text: 'El caudal debe ser manor a los 100 L/S'
            });
          }
          else {



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
              localidad: loc,
              municipio: mun,
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

            props.form.resetFields(['localidad', 'latituduso', 'longituduso', 'descripcionotrouso', 'caudal', 'usofuente']);





          }
        }
        else {
          Swal.fire({
            icon: 'error',

            title: 'Datos invalidos',
            text: 'La longitud minima para el campo longitud es de 6 caracteres'
          });

        }
      }
      else {
        Swal.fire({
          icon: 'error',

          title: 'Datos invalidos',
          text: 'La longitud minima para el campo Coordenadas de capacitación es de 6 caracteres'
        });
      }

    }
  };
  const onClickLlenarInformacion = async (datos: any) => {
    props.form.setFieldsValue({
      localidad: acueducto[datos.posicion - 1].localidad,
      latituduso: acueducto[datos.posicion - 1].latitud + '',
      longituduso: acueducto[datos.posicion - 1].longitud + '',
      descripcionotrouso: acueducto[datos.posicion - 1].descripcion + '',
      caudal: acueducto[datos.posicion - 1].caudal + '',
      usofuente: acueducto[datos.posicion - 1].usofuente
    });

    //history.push('/tramites-servicios-aguas/Revision/revisar-solicitud');
  };

  const ValorCaudal = (letra: string) => {
    const caudal = props.form.getFieldValue('caudal');
    if (/[0-9,]/.test(letra)) {


      return caudal + letra;
    }
    else {
      return caudal;
    }
    //history.push('/tramites-servicios-aguas/Revision/revisar-solicitud');
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
        if (tipoSolicitud !== 'primera-vez') {
          return (
            <Button
              type='primary'
              className='fa-solid fa-circle-xmark'
              key={`validar`}
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

  const onChangeTipoCoordenadaLatitud = (event: any) => {

    console.log("Valor depues del onchange: ", event.target.value);

    let valor = props.form.getFieldValue('latituduso');
    let numerico1 = '';
    let numerico2 = '';
    if (event.target.value == 'decimal') {

      setlatituddec(true)

      if (valor != "" && valor != undefined && valor.length === 13) {
        let valornuevo = valor.substring(0, 2);
        const orientacion = valor.substring(valor.length - 1, valor.length) === 'N' ? '' : '-';
        for (let index = 2; index < 11; index++) {
          if (index < 6) {
            if (valor.substring(index, index + 1) != '°' &&
              valor.substring(index, index + 1) != '"' &&
              valor.substring(index, index + 1) != "'") {
              numerico1 = numerico1 + valor.substring(index, index + 1);

            }
          }
          else {
            if (valor.substring(index, index + 1) != '°' &&
              valor.substring(index, index + 1) != '"' &&
              valor.substring(index, index + 1) != "'") {
              numerico2 = numerico2 + valor.substring(index, index + 1);

            }
          }


        }


        const segundos = (Number.parseInt(numerico2) / 60);
        const minutos = (Number.parseInt(numerico1) + segundos)
        const horas = minutos / 60;


        valornuevo = Number.parseInt(valornuevo) + horas;
        while (valornuevo > 99) {
          valornuevo = valornuevo / 10;
        }
        valornuevo = orientacion + Number.parseFloat(valornuevo);

        props.form.setFieldsValue({ latituduso: valornuevo })

      }

    } else if (event.target.value == 'sexagesimal') {

      setlatituddec(false)
      if (valor != "" && valor != undefined && valor.length > 3) {

        const orientacion = valor.substring(0, 1) === '-' ? 'S' : 'N';
        let inicial = orientacion === 'S' ? 1 : 0;
        let valornuevo = valor.substring(inicial, inicial + 2);
        let valordecimal = '';

        for (let index = inicial + 2; index < valor.length; index++) {

          if (valor.substring(index, index + 1) != '.') {
            valordecimal = valordecimal + valor.substring(index, index + 1)
          }
        }

        numerico1 = (Number.parseInt(valordecimal) * 60) + '';
        numerico2 = (Number.parseFloat(numerico1.substring(2, numerico1.length) != '' ? numerico1.substring(2, numerico1.length) : '0') * 60) + '';


        valornuevo = valornuevo + '°' + numerico1.substring(0, 2) + "'" + numerico2.substring(0, 2) + '.' + numerico2.substring(2, 4) + '"' + orientacion;

        props.form.setFieldsValue({ latituduso: valornuevo })

      }


    }
  }

  const onChangeTipoCoordenadaLongitud = (event: any) => {
    console.log("Valor depues del onchange: ", event.target.value);

    let valor = props.form.getFieldValue('longituduso');
    let numerico1 = '';
    let numerico2 = '';
    if (event.target.value == 'decimal') {

      setlatituddec(true)

      if (valor != "" && valor != undefined && valor.length === 13) {
        let valornuevo = valor.substring(0, 2);
        const orientacion = valor.substring(valor.length - 1, valor.length) === 'E' ? '' : '-';
        for (let index = 2; index < 11; index++) {
          if (index < 6) {
            if (valor.substring(index, index + 1) != '°' &&
              valor.substring(index, index + 1) != '"' &&
              valor.substring(index, index + 1) != "'") {
              numerico1 = numerico1 + valor.substring(index, index + 1);

            }
          }
          else {
            if (valor.substring(index, index + 1) != '°' &&
              valor.substring(index, index + 1) != '"' &&
              valor.substring(index, index + 1) != "'") {
              numerico2 = numerico2 + valor.substring(index, index + 1);

            }
          }


        }


        const segundos = (Number.parseInt(numerico2) / 60);
        const minutos = (Number.parseInt(numerico1) + segundos)
        const horas = minutos / 60;


        valornuevo = Number.parseInt(valornuevo) + horas;
        while (valornuevo > 180) {
          valornuevo = valornuevo / 10;
        }
        valornuevo = orientacion + Number.parseFloat(valornuevo);

        props.form.setFieldsValue({ latituduso: valornuevo })

      }

    } else if (event.target.value == 'sexagesimal') {

      setlatituddec(false)
      if (valor != "" && valor != undefined && valor.length > 3) {

        const orientacion = valor.substring(0, 1) === '-' ? 'O' : 'E';
        let inicial = orientacion === 'O' ? 1 : 0;
        let valornuevo = valor.substring(inicial, inicial + 2);
        let valordecimal = '';

        for (let index = inicial + 2; index < valor.length; index++) {

          if (valor.substring(index, index + 1) != '.') {
            valordecimal = valordecimal + valor.substring(index, index + 1)
          }
        }

        numerico1 = (Number.parseInt(valordecimal) * 60) + '';
        numerico2 = (Number.parseFloat(numerico1.substring(2, numerico1.length) != '' ? numerico1.substring(2, numerico1.length) : '0') * 60) + '';


        valornuevo = valornuevo + '°' + numerico1.substring(0, 2) + "'" + numerico2.substring(0, 2) + '.' + numerico2.substring(2, 4) + '"' + orientacion;

        props.form.setFieldsValue({ latituduso: valornuevo })

      }


    }
  }


  if (habilitar) {
    return (
      <>
        <section style={{ width: '100%' }}>
          <div className='container-fluid'>
            <div className='form-row' style={{ marginLeft: '-16px' }}>
              <div className='col-lg-6 col-md-6 col-md-6'>
                <label className='text'>
                  <span className='required'>* </span> Departamento
                </label>
                <Form.Item name='departamento' initialValue={idDepartamentoBogota} rules={[{ required: false }]}>
                  <SelectComponent options={l_departamentos} optionPropkey='idDepartamento' optionPropLabel='descripcion' />
                </Form.Item>
              </div>
              <div className='col-lg-6'>
                <label className='text'>
                  <span className='required'>* </span> Localidad o vereda
                </label>
                <Form.Item name='localidad' rules={[{ required: false }]}>
                  <SelectComponent options={l_localidades} optionPropkey='idLocalidad' optionPropLabel='descripcion' />
                </Form.Item>
              </div>
            </div>
            <div className='form-row mt-3' style={{ marginLeft: '-16px' }}>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <label className='text'>
                  <span className='required'>* </span> Municipio
                </label>
                <Form.Item name='municipio' initialValue={idBogotac} rules={[{ required: false }]}>
                  <SelectComponent
                    options={l_municipios}
                    optionPropkey='idMunicipio'
                    optionPropLabel='descripcion'
                    value={idBogotac}
                    searchValue={idBogotac}
                  />
                </Form.Item>
              </div>
              <div className='col-lg-6 col-md-6 col-sm-12'>

                <label className='text'>
                  <span className='required'>* </span> Coordenadas de captación Latitud
                </label>
                <Form.Item label='' name='tipoCoordenadaLatitud' rules={[{ required: true }]}>
                  <Radio.Group defaultValue={'decimal'} onChange={onChangeTipoCoordenadaLatitud}>
                    <Radio value='decimal'>Decimal</Radio>
                    <Radio value='sexagesimal'>Sexagesimal</Radio>
                  </Radio.Group>
                </Form.Item>

                {latituddec ?
                  (<Form.Item name='latituduso'>
                    <Input
                      pattern='[0-9]{8,}[N-S]{1,}'
                      title='El formato no es el adecuado'
                      className='form-control gov-co-form-control'
                      maxLength={13}
                      value={input}
                      onKeyPress={(event) => {
                        if (!/[0-9-.]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                    />
                  </Form.Item>) :
                  <Form.Item name='latituduso'>
                    <Input
                      pattern='[0-9]{8,}[N-S]{1,}'
                      title='El formato no es el adecuado'
                      className='form-control gov-co-form-control'
                      maxLength={13}
                      value={input}
                      onChange={(event) => {
                        setInput(event.target.value);
                        if (
                          event.target.value.length === 2 &&
                          event.target.value.includes("°")
                        ) {
                          setInput(event.target.value.replace("°", ""));
                        }
                        if (event.target.value.length === 2) {
                          setInput(event.target.value + "°");
                        }

                        if (
                          event.target.value.length === 5 &&
                          event.target.value.includes("'")
                        ) {
                          setInput(event.target.value.replace("'", ""));
                        }
                        if (event.target.value.length === 5) {
                          setInput(event.target.value + "'");
                        }

                        if (
                          event.target.value.length === 8 &&
                          event.target.value.includes('.')
                        ) {
                          setInput(event.target.value.replace('.', ""));
                        }
                        if (event.target.value.length === 8) {
                          setInput(event.target.value + '.');
                        }

                        if (
                          event.target.value.length === 11 &&
                          event.target.value.includes('"')
                        ) {
                          setInput(event.target.value.replace('"', ""));
                        }
                        if (event.target.value.length === 11) {
                          setInput(event.target.value + '"');
                        }

                      }}
                    />
                  </Form.Item>}



              </div>
            </div>
            <div className='form-row mt-3' style={{ marginLeft: '-16px' }}>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <label className='text'>
                  <span className='required'>* </span> Coordenadas de captación  Longitud
                </label>
                <Form.Item label='' name='tipoCoordenadaLongitud' rules={[{ required: true }]}>
                  <Radio.Group defaultValue={'decimal'} onChange={onChangeTipoCoordenadaLongitud}>
                    <Radio value='decimal'>Decimal</Radio>
                    <Radio value='sexagesimal'>Sexagesimal</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item name='longituduso' rules={[{ required: true }]}>
                  <Input
                    title='El formato no es valido, ingrese 8 digitos y una letra'
                    pattern='[0-9]{8,}[N-S]{1,}'
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
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <label className='text'>
                  <span className='required'>* </span> Uso de la fuente
                </label>
                <Form.Item name='usofuente' rules={[{ required: false }]}>
                  <SelectComponent options={l_usofuente} optionPropkey='idUsoFuente' optionPropLabel='nombre' />
                </Form.Item>
              </div>
            </div>
            <div className='form-row mt-3' style={{ marginLeft: '-16px' }}>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <label className='text'>
                  <span className='required'>* </span> Descripción de otro uso
                </label>
                <Form.Item name='descripcionotrouso' initialValue={''} rules={[{ required: false }]}>
                  <Input
                    type='text'
                    className='form-control gov-co-form-control'
                  />
                </Form.Item>
              </div>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <label className='text'>
                  <span className='required'>* </span> Caudal total(L/S)
                </label>
                <Form.Item name='caudal' initialValue={''} rules={[{ required: false }]}>
                  <Input
                    type='text'
                    className='form-control gov-co-form-control'
                    maxLength={4}
                    onKeyPress={(event) => {

                      const caudalprueba = props.form.getFieldValue('caudal');

                      let caudal: string = ValorCaudal(event.key);
                      let count = 0;
                      let posicion = -1;
                      for (let index = 0; index < caudal.length; index++) {
                        if (caudal.substring(index, index + 1) == ',') {
                          if (posicion == -1) {
                            posicion = index;
                          }
                          count++;
                        }

                      }

                      if (count == 2 && event.key == ',') {

                        event.preventDefault();
                      }
                      caudal = caudal.substring(0, caudal.length - 1)

                      if (posicion != -1 &&
                        caudal.substring(posicion, caudal.length).length > 2) {
                        event.preventDefault();
                      }


                      if (!/[0-9,]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}

                  />
                </Form.Item>
              </div>
            </div>
            <div className='form-row mt-3 ' style={{ marginLeft: '-16px' }}>
              {tipoSolicitud === 'primera-vez' && (
                <>
                  <div className='col-lg-10 col-md-10 col-sm-12'>

                    <Button
                      className='fa-solid fa-circle-plus'
                      style={{ color: '#fff', letterSpacing: '2px', float: 'right', textTransform: 'lowercase' }}
                      type='primary'
                      htmlType='button'
                      onClick={() => {
                        insertarAcueducto();
                      }}
                    >

                      Adicionar  <span className='ml-3' ><i className="fa-solid fa-plus font-weight-bold"></i></span>
                    </Button>
                  </div>
                </>
              )}
            </div>
            <div className='form-row mt-3 ' style={{ marginLeft: '-16px' }}>
              <div className='col-lg-12 col-md-12 col-sm-12'>
                <Table
                  id='tableGen'
                  dataSource={acueductotabla}
                  columns={structureColumns}
                  pagination={{ pageSize: Paginas }}
                  className='table_info'
                />
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
              <div className='col-lg-6 col-md-6 col-md-6'>
                <label className='text'>vereda
                  <span className='required'>* </span> Departamento
                </label>
                <Form.Item name='departamento' initialValue={idDepartamentoBogota} rules={[{ required: false }]}>
                  <SelectComponent
                    options={l_departamentos}
                    optionPropkey='idDepartamento'
                    optionPropLabel='descripcion'
                    disabled={true}
                  />
                </Form.Item>
              </div>
              <div className='col-lg-6'>
                <label className='text'>
                  <span className='required'>* </span> Localidad o vereda
                </label>
                <Form.Item name='localidad' rules={[{ required: false }]}>
                  <SelectComponent
                    options={l_localidades}
                    optionPropkey='idLocalidad'
                    optionPropLabel='descripcion'
                    disabled={true}
                  />
                </Form.Item>
              </div>
            </div>
            <div className='form-row mt-3' style={{ marginLeft: '-16px' }}>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <label className='text'>
                  <span className='required'>* </span> Municipio
                </label>
                <Form.Item name='municipio' initialValue={idBogotac} rules={[{ required: false }]}>
                  <SelectComponent
                    options={l_municipios}
                    optionPropkey='idMunicipio'
                    optionPropLabel='descripcion'
                    value={idBogotac}
                    disabled={true}
                    searchValue={idBogotac}
                  />
                </Form.Item>
              </div>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <label className='text'>
                  <span className='required'>* </span> Coordenadas de captación Latitud
                </label>
                <Form.Item label='' name='tipoCoordenadaLatitud' rules={[{ required: true }]}>
                  <Radio.Group defaultValue={'decimal'} onChange={onChangeTipoCoordenadaLatitud}>
                    <Radio value='decimal'>Decimal</Radio>
                    <Radio value='sexagesimal'>Sexagesimal</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item name='latituduso' rules={[{ required: false }]}>
                  <Input
                    title='El formato no es el adecuado'
                    className='form-control'
                    maxLength={13}
                    disabled={true}
                    value={input}
                    onChange={(event) => {
                      setInput(event.target.value);
                      if (
                        event.target.value.length === 2 &&
                        event.target.value.includes("°")
                      ) {
                        setInput(event.target.value.replace("°", ""));
                      }
                      if (event.target.value.length === 2) {
                        setInput(event.target.value + "°");
                      }

                      if (
                        event.target.value.length === 5 &&
                        event.target.value.includes("'")
                      ) {
                        setInput(event.target.value.replace("'", ""));
                      }
                      if (event.target.value.length === 5) {
                        setInput(event.target.value + "'");
                      }

                      if (
                        event.target.value.length === 8 &&
                        event.target.value.includes('.')
                      ) {
                        setInput(event.target.value.replace('.', ""));
                      }
                      if (event.target.value.length === 8) {
                        setInput(event.target.value + '.');
                      }

                      if (
                        event.target.value.length === 11 &&
                        event.target.value.includes('"')
                      ) {
                        setInput(event.target.value.replace('"', ""));
                      }
                      if (event.target.value.length === 11) {
                        setInput(event.target.value + '"');
                      }

                    }}
                  />
                </Form.Item>
              </div>
            </div>
            <div className='form-row mt-3' style={{ marginLeft: '-16px' }}>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <label className='text'>
                  <span className='required'>* </span> Coordenadas de captación Longitud
                </label>

                <Form.Item label='' name='tipoCoordenadaLatitud' rules={[{ required: true }]}>
                  <Radio.Group defaultValue={'decimal'} onChange={onChangeTipoCoordenadaLatitud}>
                    <Radio value='decimal'>Decimal</Radio>
                    <Radio value='sexagesimal'>Sexagesimal</Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item name='longituduso' rules={[{ required: false }]}>
                  <Input
                    type='text'
                    className='form-control gov-co-form-control'
                    disabled={true}
                    maxLength={9}
                    onKeyPress={(event) => {
                      if (!/[0-9'"° -]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}

                  />
                </Form.Item>
              </div>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <label className='text'>
                  <span className='required'>* </span> Uso de la fuente
                </label>
                <Form.Item name='usofuente' rules={[{ required: false }]}>
                  <SelectComponent options={l_usofuente} optionPropkey='idUsoFuente' optionPropLabel='nombre' disabled={true} />
                </Form.Item>
              </div>
            </div>
            <div className='form-row mt-3' style={{ marginLeft: '-16px' }}>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <label className='text'>
                  <span className='required'>* </span> Descripción de otro uso
                </label>
                <Form.Item name='descripcionotrouso' initialValue={''} rules={[{ required: false }]}>
                  <Input
                    type='text'
                    className='form-control gov-co-form-control'
                    disabled={true}
                  />
                </Form.Item>
              </div>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <label className='text'>
                  <span className='required'>* </span> Caudal total(L/S)
                </label>
                <Form.Item name='caudal' initialValue={''} rules={[{ required: false }]}>
                  <Input
                    type='text'
                    className='form-control gov-co-form-control'
                    disabled={true}
                    onKeyPress={(event) => {
                      if (!/[0-9.]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}

                  />
                </Form.Item>
              </div>
            </div>
            <div className='form-row mt-3 ' style={{ marginLeft: '-16px' }}>
              {tipoSolicitud === 'primera-vez' && (
                <>
                  <div className='col-lg-8 col-md-8 col-sm-12'>
                    <a href='' style={{ textDecoration: 'none' }}>
                      <i className='fa-solid fa-circle-plus' style={{ color: '#0FD7E0', fontSize: '30px', float: 'right' }}></i>
                    </a>
                    <Button
                      className='fa-solid fa-circle-plus'
                      disabled={true}
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
                </>
              )}
            </div>
            <div className='form-row mt-3 ' style={{ marginLeft: '-16px' }}>
              <div className='col-lg-12 col-md-12 col-sm-12'>
                <Table
                  id='tableGen'
                  dataSource={acueductotabla}
                  columns={structureColumns}
                  pagination={{ pageSize: Paginas }}
                  className='table_info'
                />
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
};
interface DatosAcueducto<T> {
  form: FormInstance<T>;
  obj: any;
  tipoSolicitud: string;
  prop: any;
  habilitar: boolean;
}
export const KeysForm = ['localidad', 'caudal', 'descripcionotrouso', 'usofuente', 'longituduso', 'latituduso'];
