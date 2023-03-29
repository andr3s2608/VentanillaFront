import { direcionOrienta, letras, nomesclatura } from 'app/shared/utils/constants.util';
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import { errorMessage } from 'app/services/settings/message.service';
import { authProvider } from 'app/shared/utils/authprovider.util';
import React, { useCallback, useEffect, useState } from 'react';
import { ApiService } from 'app/services/Apis.service';
import Form, { FormInstance } from 'antd/es/form';
import '../../../../css/estilos.css';
import { Alert, Button } from 'antd';
import Input from 'antd/es/input';


export const UbicacionPersona: React.FC<ubicacion<any>> = (props) => {
  const { accountIdentifier } = authProvider.getAccount();
  const { form, obj, vista } = props;
  const api = new ApiService(accountIdentifier);
  const [stateDisplayBox, setStateDisplayBox] = useState<string>('none');
  const [stateDisplayButton, setStateDisplayButton] = useState<string>('inline');
  const [avenida, setAvenida] = useState<boolean>(true);

  /** Estados que contienen la lista de Zonas, Localidades, UPZ y Barrios */
  const [listZonas, setListZonas] = useState<Array<Object>>([])
  const [listBarrios, setListBarrios] = useState<Array<Object>>([]);
  const [listUPZs, setListUPZs] = useState<Array<Object>>([]);
  const [listLocalidades, setListLocalidades] = useState<Array<Object>>([]);

  const [enableField, setEnableField] = useState<boolean>(false);
  const [esadmin, setesadmin] = useState<boolean>(false);
  const [renderizar, setrenderizar] = useState<boolean>(false);

  const getListas = useCallback(
    async () => {
      /** Se hace la peticion HTTP para obtener zonas, barrios, upzs y localidades */
      setListZonas([{ idSubRed: 'SELECCIONAR', nombre: 'SELECCIONAR' }].concat(await api.getListSubRedes()));
      setListBarrios([{ id_barrio: 'SELECCIONAR', nombre_barrio: 'SELECCIONAR' }].concat(await api.getListBarrios()));
      setListUPZs([{ id_upz: 'SELECCIONAR', nom_upz: 'SELECCIONAR' }].concat(await api.getListUPZ()));
      setListLocalidades([{ idLocalidad: 'SELECCIONAR', nombre: 'SELECCIONAR' }].concat(await api.getListLocalidades()));

      /** Configuración para el estado inicial de la dirección */
      const initialDirection = ['', '', '', '', '', '', '', '', ''];
      sessionStorage.setItem('directionToSave', JSON.stringify(initialDirection));
      const rolesstorage: any = localStorage.getItem('roles');

      const [Tipo] = JSON.parse(rolesstorage);

      if (Tipo.rol === 'AdminTI') {

        setesadmin(true);
      }


      if (vista == 'revision') {
        setEnableField(true);
      }
      setrenderizar(true);
    }, []
  );

  useEffect(() => {
    getListas();
  }, []);

  useEffect(() => {
    /** efecto que se ejecuta despues de renderizarse el componente, no antes */
    if ((obj.length > 0) && (obj != undefined)) {

      form.setFieldsValue({
        zonaUbicacion: obj.sector,
        barrioUbicacion: obj.barrio,
        upzUbicacion: obj.upz,
        localidadUbicacion: obj.localidad,
        direccionCompletaUbicacion: obj.direccion

      });
    }
  });


  const cambioavenida = (value: any) => {
    const valor: string = value;
    if (valor == 'AC- Avenida Calle') {
      setAvenida(false);
    } else {
      setAvenida(true);
    }
    buildDirection(0, valor);
  };


  const buildDirection = (posicion: number, valor: string) => {
    let direccion_completa: string[] = JSON.parse((sessionStorage.getItem('directionToSave')) as string);
    direccion_completa[posicion] = valor;

    sessionStorage.setItem('directionToSave', JSON.stringify(direccion_completa));
    form.setFieldsValue({
      direccionCompletaUbicacion: direccion_completa.join(' ')
    });
  };

  const onGeocoding = async () => {

    let direccion: string[] = JSON.parse((sessionStorage.getItem('directionToSave')) as string);
    let [via_principal, numero, letra, bis, card, numero_b, letra_b, placa, card_b] = direccion;

    switch (via_principal) {
      case 'AK- Avenida Carrera':
        via_principal = 'AK';
        break;
      case 'AC- Avenida Calle':
        via_principal = 'AC';
        break;
      case 'CL- Calle':
        via_principal = 'CL';
        break;
      case 'DG- Diagonal':
        via_principal = 'DG';
        break;
      case 'KR- Carrera':
        via_principal = 'KR';
        break;
      case 'TV- Transversal':
        via_principal = 'TV';
        break;
    }


    let XML = `
      <?xml version="1.0" encoding="utf-8"?>
      <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
        <soap12:Body>
          <obtenerCodDireccion xmlns="http://200.75.49.126/WsDireccion">
           <Direccion>${via_principal} ${numero} ${letra} ${bis} ${card} ${numero_b} ${letra_b} ${placa} ${card_b}</Direccion>
          </obtenerCodDireccion>
        </soap12:Body>
      </soap12:Envelope>`;

    const algo = api.geocoding(XML);
    console.log(algo)
    let idZona = 4;
    let idLocalidad = 10;
    let idUPZ = 74;
    let idBarrio = '10119BD';

    if ((listZonas.length > 0) && (listBarrios.length > 0) && (listUPZs.length > 0) && (listLocalidades.length > 0)) {
      setStateDisplayBox('block');
      form.setFieldsValue({
        zonaUbicacion: 'SELECCIONAR',
        barrioUbicacion: 'SELECCIONAR',
        upzUbicacion: 'SELECCIONAR',
        localidadUbicacion: 'SELECCIONAR'
      });
    } else {
      errorMessage({ content: 'Hubo un problema al obtener la lista de Zona, Localidades, Barrios y Upz' });
    }
  };


  return (

    <div className="container-fluid">
      {renderizar && (<>

        {!enableField && (<>
          <div className="row info-tramite">
            <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
              <p style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '-20px' }}>
                Información del lugar de la localización del sistema de abastecimiento<br />
                <small style={{ color: ' #000' }}>
                  <span className='required'>* </span> Campos Obligatorios
                </small>
              </p>
            </div>
          </div>
          <div className='row' style={{ marginLeft: '-20px' }}>
            <div className="col-sm-12 col-md-10 col-lg-10 col-xl-10">
              <Alert
                message='Información!'
                description='Por favor registre su dirección de residencia tal como aparece en el recibo público,
                          en las casillas indicadas para esto. Una vez completado los datos, favor dar clic sobre el botón azul Confirmar Dirección.
                          Esta funcionalidad permitirá autocompletar datos de UPZ, Localidad y Barrio para las direcciones de Bogotá D.C. y
                          estandarizar la dirección para el resto de ciudades.'
                type='info' />
            </div>
          </div>
          <div className='row mt-2'>
            <div className='col-sm-12 col-md-4 col-lg-4 col-xl-4'>
              <label htmlFor='' className='mt-4 text'>
                Via Principal
              </label>
              <Form.Item label='' name=''>
                <SelectComponent options={nomesclatura} onChange={cambioavenida} optionPropkey='key' optionPropLabel='key' disabled={enableField} />
              </Form.Item>
            </div>
            <div className='col-sm-12 col-md-4 col-lg-4 col-xl-4'>
              <label htmlFor='' className='mt-4 text' >
                Num
              </label>
              <Form.Item className='' label='' name='Num1' rules={[{ max: 3 }]}>
                <Input
                  className='form-control'
                  disabled={enableField}
                  id='23' allowClear
                  type='text' placeholder='' autoComplete='off'
                  maxLength={3}
                  style={{ marginLeft: '-30px' }}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onPaste={(event) => {
                    event.preventDefault();
                  }}
                  onChange={(event) => {
                    buildDirection(1, event.target.value);
                  }}
                />
              </Form.Item>
            </div>
            <div className='col-sm-12 col-md-4 col-lg-4 col-xl-4' >
              <label htmlFor='' className='mt-4 text'>Letra</label>
              <Form.Item className='' label='' name='letra1' rules={[{ max: 1 }]}>
                <SelectComponent
                  disabled={enableField}
                  style={{ marginLeft: '-30px' }}
                  options={letras}
                  optionPropkey='key'
                  optionPropLabel='key'
                  onChange={(event) => {
                    buildDirection(2, event);
                  }}
                />
              </Form.Item>
            </div>
          </div>
          <div className='row mt-2'>
            <div className='col-sm-12 col-md-4 col-lg-4 col-xl-4'>
              <label htmlFor='' className='mt-4 text'>
                Bis
              </label>
              <Form.Item label='' name='Bis' rules={[{ max: 3 }]}>
                <SelectComponent
                  style={{ marginLeft: '-30px' }}
                  disabled={enableField}
                  className='form-control'
                  options={[
                    { key: 'Bis', value: 'Bis' },
                    { key: ' ', value: ' ' }
                  ]}
                  optionPropkey='key'
                  optionPropLabel='value'
                  onChange={(event) => {
                    buildDirection(3, event);
                  }}
                />
              </Form.Item>
            </div>
            <div className='col-sm-12 col-md-4 col-lg-4 col-xl-4'>
              <label htmlFor='' className='mt-4 text' >
                Card
              </label>
              <Form.Item label='' name='card1' rules={[{ max: 4 }]}>
                <SelectComponent
                  style={{ marginLeft: '-30px' }}
                  disabled={enableField}
                  className='form-control'
                  options={direcionOrienta}
                  optionPropkey='key'
                  optionPropLabel='key'
                  onChange={(event) => {
                    buildDirection(4, event);
                  }}
                />
              </Form.Item>
            </div>
            <div className='col-sm-12 col-md-4 col-lg-4 col-xl-4' >
              <label htmlFor='' className='mt-4 text'>Num</label>
              <Form.Item label='' name='Num2' rules={[{ max: 3 }]}>
                <Input
                  style={{ marginLeft: '-30px' }}
                  disabled={enableField}
                  className='form-control'
                  allowClear
                  type='text'
                  placeholder=''
                  autoComplete='off'
                  maxLength={3}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onPaste={(event) => {
                    event.preventDefault();
                  }}
                  onChange={(event) => {
                    buildDirection(5, event.target.value);
                  }}
                />
              </Form.Item>
            </div>
          </div>
          <div className='row mt-2'>
            <div className='col-sm-12 col-md-4 col-lg-4 col-xl-4'>
              <label htmlFor='' className='mt-4 text'>Letra</label>
              <Form.Item className='' label='' name='letra1' rules={[{ max: 1 }]}>
                <SelectComponent
                  disabled={enableField}
                  style={{ marginLeft: '-30px' }}
                  options={letras}
                  optionPropkey='key'
                  optionPropLabel='key'
                  onChange={(event) => {
                    buildDirection(2, event);
                  }}
                />
              </Form.Item>
            </div>
            <div className='col-sm-12 col-md-4 col-lg-4 col-xl-4'>
              <label htmlFor='' className='mt-4 text' >
                Placa
              </label>
              <Form.Item label='' name='placa' rules={[{ max: 2 }]}>
                <Input
                  disabled={enableField}
                  className='form-control'
                  allowClear
                  style={{ marginLeft: '-30px' }}
                  placeholder=''
                  autoComplete='off'
                  maxLength={2}
                  type='text'
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onPaste={(event) => {
                    event.preventDefault();
                  }}
                  onChange={(event) => {
                    buildDirection(7, event.target.value);
                  }}
                />
              </Form.Item>
            </div>
            <div className='col-sm-12 col-md-4 col-lg-4 col-xl-4' >
              <label htmlFor='' className='mt-4 text'>Card</label>
              <Form.Item label='' name='card2'>
                <SelectComponent
                  style={{ marginLeft: '-30px' }}
                  disabled={enableField}
                  options={direcionOrienta}
                  optionPropkey='key'
                  optionPropLabel='key'
                  onChange={(event) => {
                    buildDirection(8, event);
                  }}
                />
              </Form.Item>
            </div>
          </div>

        </>)}

        <div className="row mt-5">
          <div className="col-sm-12 col-md-8 col-lg-8 col-xl-8">
            <label className='text'> Dirección Completa </label>
            <Form.Item name='direccionCompletaUbicacion'>
              <Input type='text' disabled={true} style={{ marginLeft: '-30px' }} />
            </Form.Item>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <Button
              type='primary'
              hidden={!enableField}
              style={{
                display: stateDisplayButton, marginTop: '30px',
                marginLeft: '-20px'
              }}
              disabled={!esadmin}
              onClick={onGeocoding}
            >
              Confirmar Dirección
            </Button>
          </div>
        </div>

        <div className='form-row' style={{ display: stateDisplayBox }}>
          <Alert
            style={{ width: '800px' }}
            message='Información!'
            description='La dirección fue georreferenciada exitosamente.'
            type='info'
          />
        </div>

        <div className="row mt-5">
          <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <label className='text'> Zona   <span className='required'>(*)</span></label>
            <Form.Item label='' name='zonaUbicacion' initialValue={'SELECCIONAR'} rules={[{ required: true }]}>
              <SelectComponent

                disabled={enableField}
                style={{
                  marginLeft: '-30px'
                }}
                options={listZonas}
                optionPropkey='nombre'
                optionPropLabel='nombre'
              />
            </Form.Item>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <label className='text' style={{ marginLeft: '-20px' }}> Localidad   <span className='required'>(*)</span></label>
            <Form.Item label='' name='localidadUbicacion' initialValue={'SELECCIONAR'} rules={[{ required: true }]}>
              <SelectComponent
                className='form-control'
                disabled={enableField}
                style={{
                  marginLeft: '-30px'
                }}
                options={listLocalidades}
                optionPropkey='nombre'
                optionPropLabel='nombre'
              />
            </Form.Item>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <label className='text mt-3'> Upz   <span className='required'>(*)</span></label>
            <Form.Item label='' name='upzUbicacion' initialValue={'SELECCIONAR'} rules={[{ required: true }]}>
              <SelectComponent
                disabled={enableField}
                style={{
                  marginLeft: '-30px'
                }}
                options={listUPZs}
                optionPropkey='nom_upz'
                optionPropLabel='nom_upz'
              />
            </Form.Item>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <label className='text mt-3 ' style={{ marginLeft: '-20px' }}> Barrio   <span className='required'>(*)</span></label>
            <Form.Item label='' name='barrioUbicacion' initialValue={'SELECCIONAR'} rules={[{ required: true }]}>
              <SelectComponent
                disabled={enableField}
                style={{
                  marginLeft: '-30px'
                }}
                options={listBarrios}
                optionPropkey='nombre_barrio'
                optionPropLabel='nombre_barrio'
              />
            </Form.Item>
          </div>
        </div>
      </>)}
    </div>
  );

};

interface ubicacion<T> {
  form: FormInstance<T>;
  obj: any;
  tipo: any;
  vista: any;
}

export const KeysForm = ['departamento', 'municipio', 'localidad', 'direccion'];
