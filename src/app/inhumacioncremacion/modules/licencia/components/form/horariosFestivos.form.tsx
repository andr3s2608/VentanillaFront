import { Button, Form, Input, Select } from 'antd';
import form from 'antd/es/form';
import { RangePickerProps } from 'antd/lib/date-picker';
import { DatepickerComponent } from 'app/shared/components/inputs/datepicker.component';
import { layoutItems, layoutWrapper } from 'app/shared/utils/form-layout.util';
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import moment from 'moment';
import React, { useState } from 'react'
import Swal from 'sweetalert2';
import fechaNoAgregada from '../../../../../../assets/images/inhumacioncremacion/fechaNoAgregada.png';
import fechaGuardada from '../../../../../../assets/images/inhumacioncremacion/fechaGuardada.png';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { ApiService } from 'app/services/Apis.service';


export const HorariosFestivos = ({ props }: any) => {

  const [form] = Form.useForm<any>();
  const [festivos, setFestivos] = useState<string>('');
  const [festivosConsultados, setfestivosConsultados] = useState<string>('');
  const [actualizar, setAcualizar] = useState<boolean>(false);
  const [actualizarText, setActualizarText] = useState<boolean>(false);
  const format = "DD-MM-YYYY";
  const [value, setValue] = useState<any>(null);
  const [cantidadConsultas, setCantidadConsultas] = useState<number>(0);
  const [fechas, setfechas] = useState<any>([]);
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);

  const guardarfecha = (values: any) => {
    const fecha: any[] = [];
    for (let index = 0; index < values.length; index++) {
      const setearfecha = new Date(values[index]);
      fecha.push(moment(setearfecha).format('DD-MM-YYYY'))
    }
    setfechas(fecha);
  };

  const validarFestivosRegistrados = (festivosBD: string[], festivosRegistrarBD: string[]): string[] => {
    let festivosRepetidos: string[] = [];

    for (let a = 0; a < festivosBD.length; a++) {
      for (let b = 0; b < festivosRegistrarBD.length; b++) {

        if (festivosRegistrarBD[b] != '') {
          if (festivosRegistrarBD[b] == festivosBD[a]) {
            festivosRepetidos.push(festivosRegistrarBD[b]);
          }
        }
      }
    }
    return festivosRepetidos;
  };

  const obtenerFestivosString = (cadena: string): string[] => {
    let festivos: string[] = [];
    festivos = cadena.split(';');
    return festivos;
  };

  const Actualizar = (bandera: boolean) => {
    switch (bandera) {
      case true:
        return (
          <Button style={{ marginLeft: '10px', marginRight: '10px' }} type='primary' htmlType='button' className='add' onClick={async () => {
            //console.log(obtenerFestivosString(festivosConsultados.replaceAll('/', ';')));
            //console.log(cantidadConsultas);
            if (obtenerFestivosString(festivosConsultados.replaceAll('/', ';')).length < cantidadConsultas || (obtenerFestivosString(festivosConsultados.replaceAll('/', ';')).length == cantidadConsultas && festivosConsultados[festivosConsultados.length - 1] === ' ')) {
              await api.ModificarConstante('4AF03735-503B-4D22-8169-E4FCDD19DB28', festivosConsultados.replaceAll('/', ';').trim(), '1');
              Swal.fire({
                imageUrl: fechaGuardada,
                background: '#fcfcfc',
                imageHeight: 150,
                title: 'ACTUALIZACION EXITOSA',
                confirmButtonColor: '#ec0b0a ',
                text:
                  'Se han actualizado los dias festivos'
              });
              setAcualizar(false);
              setActualizarText(false);
              // await api.ModificarConstante('4AF03735-503B-4D22-8169-E4FCDD19DB28', e.replace('/', ';'), '1');
            } else {
              Swal.fire({
                imageUrl: fechaNoAgregada,
                background: '#fcfcfc',
                imageHeight: 150,
                title: 'ACTUALIZACION DENEGADA',
                confirmButtonColor: '#ec0b0a ',
                text:
                  'Para registrar una fecha vaya al apartado superior: '
              });
            }
          }
          }>
            Actualizar
          </Button >
        );
        break;
      default:
        return <></>;
        break;
    }
  };

  const actualizarFestivos = (e: string) => {
    setAcualizar(true);
    setfestivosConsultados(e);

  };

  const FestivosConsultados = (bandera: boolean) => {
    switch (bandera) {
      case true:
        return (
          <div className='col-lg-6 col-md-6 col-sm-12 '>
            <Form.Item
              label='Festivos consultados'
              name='festivosConsultados'
            >
              <Input.TextArea
                allowClear
                maxLength={250}
                placeholder='No hay festivos consultados...'
                autoSize={{ minRows: 4, maxRows: 8 }}
                onChange={(e) => actualizarFestivos(e.target.value)}
              //value={festivos}
              />
            </Form.Item>
          </div>
        );
        break;
      default:
        return (
          <div className='col-lg-6 col-md-6 col-sm-12 '>
            <Form.Item
              label='Festivos consultados'
              name='festivosConsultados'
            >
              <Input.TextArea
                allowClear
                maxLength={250}
                placeholder='No hay festivos consultados...'
                autoSize={{ minRows: 4, maxRows: 8 }}
                disabled
              //value={festivos}
              />
            </Form.Item>
          </div>
        );
        break;
    }
  };



  const onSubmit = async (values: any) => {

    if (festivos != '') {

      const festivosDB = await api.getCostante('4AF03735-503B-4D22-8169-E4FCDD19DB28');

      const festivosBD: string[] = obtenerFestivosString(festivosDB.valor);

      const festivosRegistrarBD: string[] = obtenerFestivosString(festivos);

      const festivosRegistrados: string[] = validarFestivosRegistrados(festivosBD, festivosRegistrarBD);

      //console.log(festivosRegistrados);
      //console.log(festivosBD);
      //console.log(festivosRegistrarBD);
      if (festivosRegistrados.length == 0) {

        await api.ModificarConstante('4AF03735-503B-4D22-8169-E4FCDD19DB28', festivosDB.valor + festivos, '1');
        Swal.fire({
          imageUrl: fechaGuardada,
          background: '#fcfcfc',
          imageHeight: 150,
          title: 'REGISTRO EXITOSO',
          confirmButtonColor: '#ec0b0a ',
          text:
            'Los festivos se han registrado con exito'
        });
        form.setFieldsValue({ festivosAgregados: '' });
        form.setFieldsValue({ festivosAgregadosBD: festivosDB.valor + festivos });
        setFestivos('');

      } else {

        Swal.fire({
          imageUrl: fechaNoAgregada,
          background: '#fcfcfc',
          imageHeight: 150,
          title: 'FECHA REPETIDAS',
          confirmButtonColor: '#ec0b0a ',
          text:
            'Las siguientes fechas ya se encuentran registradas: ' + festivosRegistrados.toString()
        });
      }

    } else {
      Swal.fire({
        imageUrl: fechaNoAgregada,
        background: '#fcfcfc',
        imageHeight: 150,
        title: 'FECHA NO AGREGADA',
        confirmButtonColor: '#ec0b0a ',
        text:
          'No ha agregado ninguna fecha.'
      });
    }
  };


  const onSubmitFailed = () => {

  };


  const Actions = () => (
    <Form.Item {...layoutWrapper}>
      <div className='container-fluid'>
        <div className='row justify-content-center text-center'>
          <div className='col-lg-12 col-sm-12 col-md-12 text-center mr-5'>
            <Button type='primary' htmlType='submit' className='add' onClick={() => { }}>
              Agregar
            </Button>
          </div>
        </div>
        <div className='row justify-content-center text-center'>
          <div className='col-lg-12 col-sm-12 col-md-12 text-center mr-5'>
            <Button type='primary' htmlType='submit' className='save'>
              Guardar
            </Button>
          </div>
        </div>
      </div>
    </Form.Item>
  );

  return (
    <>
      <div className='container-fluid' style={{ height: '400px' }}>
        <div className='card'>
          <div className='card-body'>
            <Form form={form} {...layoutItems} layout='horizontal' onFinish={onSubmit} onFinishFailed={onSubmitFailed}>
              <div className='row justify-content-center'>
                <div className='col-lg-12 col-sm-12 col-md-12 justify-content-center text-center mb-4'>
                  <p
                    style={{ fontSize: '16px', color: '#3366cc', fontFamily: ' Roboto' }}
                    className='text-uppercase font-weight-bold'
                  >
                    Registrar Festivos
                  </p>
                </div>

                <div className='col-lg-6 col-md-6 col-sm-12 '>
                  <Form.Item
                    label='Festivos: '
                    name='festivos'
                    rules={[{ required: true }]}
                  >
                    <DatePicker mapDays={({ date }) => {
                      //console.log(date.day);
                      const aux: any = date;
                      const fechacalendario = new Date(aux)

                      console.log('calendario: ' + fechacalendario);
                      console.log('actual' + moment(new Date()));
                      let esantes = (moment((moment(fechacalendario)).format('MM DD YYYY'))).isBefore(moment(moment(new Date()).format('MM DD YYYY')));

                      console.log('validacion ' + esantes);


                      if (esantes) return {
                        disabled: true,
                        style: { color: "#ccc" },
                      }
                    }} multiple value={value} onChange={guardarfecha} format="MM DD YYYY" plugins={[
                      <DatePanel />
                    ]} />
                  </Form.Item>

                  <Form.Item
                    label='Festivos agregados'
                    name='festivosAgregados'
                  >
                    <Input.TextArea
                      allowClear
                      maxLength={250}
                      placeholder='No hay festivos agregados...'
                      autoSize={{ minRows: 4, maxRows: 8 }}
                      disabled
                    //value={festivos}
                    />
                  </Form.Item>
                </div>

                <div style={{ display: 'inline-block', width: '50%', paddingLeft: '60px' }}>
                  <Button style={{ marginLeft: '10px', marginRight: '10px' }} type='primary' htmlType='button' className='add' onClick={() => {
                    let textarea = "";
                    for (let index = 0; index < fechas.length; index++) {
                      textarea = textarea + fechas[index] + ";";
                    }
                    form.setFieldsValue({ festivosAgregados: textarea.replaceAll(";", "     ") });
                    setFestivos(textarea);
                  }}>
                    Agregar
                  </Button>
                  <Button style={{ marginLeft: '10px', marginRight: '10px' }} type='primary' htmlType='submit' className='save'>
                    Guardar
                  </Button>
                </div>
              </div>
            </Form>
          </div>
          <div className='card.-body'>
          </div>
        </div>
      </div>
      <div className='container-fluid' style={{ height: '400px' }}>
        <div className='card'>
          <div className='card-body'>
            <Form form={form} {...layoutItems} layout='horizontal' onFinish={onSubmit} onFinishFailed={onSubmitFailed}>
              <div className='row justify-content-center'>
                <div className='col-lg-12 col-sm-12 col-md-12 justify-content-center text-center mb-4'>
                  <p
                    style={{ fontSize: '16px', color: '#3366cc', fontFamily: ' Roboto' }}
                    className='text-uppercase font-weight-bold'
                  >
                    Festivos Registrados
                  </p>
                </div>

                {FestivosConsultados(actualizarText)}

                <div style={{ display: 'inline-block', width: '50%', paddingLeft: '60px' }}>
                  <Button style={{ marginLeft: '10px', marginRight: '10px' }} type='primary' htmlType='button' className='add' onClick={async () => {
                    const festivosDB = await api.getCostante('4AF03735-503B-4D22-8169-E4FCDD19DB28');
                    const cantidadConsultas: string[] = obtenerFestivosString(festivosDB.valor);
                    setCantidadConsultas(cantidadConsultas.length);
                    form.setFieldsValue({ festivosConsultados: festivosDB.valor.replaceAll(";", "/") });
                    Swal.fire({
                      imageUrl: fechaGuardada,
                      background: '#fcfcfc',
                      imageHeight: 150,
                      title: 'RESULTADO DE LA CONSULTA',
                      confirmButtonColor: '#ec0b0a ',
                      text:
                        'Se han encontrado ' + ((cantidadConsultas.length) - 1) + ' festivos'
                    });
                    setActualizarText(true);
                  }}>
                    Consultar
                  </Button>
                  {Actualizar(actualizar)}
                </div>
              </div>
            </Form>
          </div>
          <div className='card.-body'>
          </div>
        </div>
      </div>
    </>
  )
}
