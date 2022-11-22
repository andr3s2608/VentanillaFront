import { EstadoCivil, direcionOrienta, letras, nomesclatura } from 'app/shared/utils/constants.util';
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import React, { useCallback, useEffect, useState } from 'react';
import Form, { FormInstance } from 'antd/es/form';
import { store } from 'app/redux/app.reducers';
import '../../../../css/estilos.css';
import { Alert, Button } from 'antd';
import Input from 'antd/es/input';
import { errorMessage } from 'app/services/settings/message.service';
import { SetDireccion } from 'app/redux/dirrecion/direccion.action';
import { ApiService } from 'app/services/Apis.service';
import { authProvider } from 'app/shared/utils/authprovider.util';

export const UbicacionPersona: React.FC<ubicacion<any>> = (props) => {
  const { tipo, obj, vista } = props;
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [direccionCompleta, setDireccionCompleta] = useState<string>('');
  const [stateDisplayBox, setStateDisplayBox] = useState<string>('none');
  const [stateDisplayButton, setStateDisplayButton] = useState<string>('inline');
  const [avenida, setAvenida] = useState<boolean>(true);
  const [listOfZona, setListOfZona] = useState<Array<Object>>([{ descripcion: 'id1', value: 'default' }]);
  const [listOfLocalidad, setListOfLocalidad] = useState<Array<Object>>([{ descripcion: 'id1', value: 'default' }]);
  const [listOfUPZ, setListOfUPZ] = useState<Array<Object>>([{ descripcion: 'id1', value: 'default' }]);
  const [listOfBarrio, setListOfBarrio] = useState<Array<Object>>([{ descripcion: 'id1', value: 'default' }]);
  const [initialValueZona, setInitialValueZona] = useState<any>('NORTE');
  const [initialValueLocalidad, setInitialValueLocalidad] = useState<any>('BOSA');
  const [initialValueUPZ, setInitialValueUPZ] = useState<any>('AMERICAS');
  const [initialValueBarrio, setInitialValueBarrio] = useState<any>('ACACIAS USAQUEN');


  const getListas = useCallback(
    async () => {

    }, []
  );

  useEffect(() => {
    getListas();
  }, []);



  const cambioavenida = (value: any) => {
    const valor: string = value;
    if (valor == 'AC- Avenida Calle') {
      setAvenida(false);
    } else {
      setAvenida(true);
    }
    build_direction(0, valor);
  };

  const build_direction = (posicion: number, valor: string) => {
    const { direccion } = store.getState();
    let direccion_completa: string[] = direccion;
    direccion_completa[posicion] = valor;

    store.dispatch(SetDireccion(direccion_completa));
    setDireccionCompleta(direccion_completa.join(' '));
  };

  const onGeocoding = async () => {
    const { direccion } = store.getState();
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

    // const algo = api.geocoding(XML);

    let idZona = 4;
    let idLocalidad = 10;
    let idUPZ = 74;
    let idBarrio = '10119BD';

    let list_zona: Array<any> = await api.getListSubRedes();
    const list_barrios: Array<any> = await api.getListBarrios();
    const list_upz: Array<any> = await api.getListUPZ();
    const list_localidades: Array<any> = await api.getListLocalidades();

    list_zona = [];

    if (list_zona !== [] && listOfBarrio !== [] && list_upz !== [] && list_localidades !== []) {
      setListOfZona(list_zona);
      setListOfLocalidad(list_localidades);
      setListOfUPZ(list_upz);
      setListOfBarrio(list_barrios);
      setStateDisplayBox('block');

      setInitialValueZona(idZona);
      setInitialValueLocalidad(idLocalidad);
      setInitialValueUPZ(idUPZ);
      setInitialValueBarrio(idBarrio);
    } else {
      errorMessage({ content: 'No se pudo obtener la lista de zona, localidades, barrios ni Upz' });
    }

  };


  return (
    <div className='col-lg-12 col-sm-12 col-md-12 contenedor_ubi'>
      <div className='info-tramite mt-2'>
        <p className='ml-2' style={{ fontSize: '18px', fontWeight: 'bold' }}>
          Información del lugar de la localización del sistema de abastecimiento . <br />{' '}
          <small style={{ color: ' #000' }}>
            <span className='required'>* </span> Campos Obligatorios
          </small>
        </p>
        <div className='row'>
          <Alert
            message='Información!'
            description='Por favor registre su dirección de residencia tal como aparece en el recibo público,
                                en las casillas indicadas para esto. Una vez completado los datos, favor dar clic sobre el botón azul Confirmar Dirección.
                                Esta funcionalidad permitirá autocompletar datos de UPZ, Localidad y Barrio para las direcciones de Bogotá D.C. y
                                estandarizar la dirección para el resto de ciudades.'
            type='info'
          />

          <div className='form-row mt-5 text-center'>
            <div className='form-group col-md-8 col-lg-8 text-center'>
              <label htmlFor=''>
                Via Principal
                <span className='ml-2' style={{ color: '#FF6341' }}>
                  (*)
                </span>
              </label>
              <Form.Item label='' name='' rules={[{ required: true }]}>
                <SelectComponent options={nomesclatura} onChange={cambioavenida} optionPropkey='key' optionPropLabel='key' />
              </Form.Item>
            </div>
            <div className='form-group col-md-2 col-lg-2'>
              <label htmlFor=''>Num</label>
              <span className='ml-2' style={{ color: '#FF6341' }}>
                (*)
              </span>
              <Form.Item className='' label='' name='Num1' rules={[{ required: avenida, max: 3 }]}>
                <Input
                  style={{ width: '127px' }}
                  id='23'
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
                    build_direction(1, event.target.value);
                  }}
                />
              </Form.Item>{' '}
            </div>
            <div className='form-group col-md-2 col-lg-2'>
              <label htmlFor=''>Letra</label>
              <Form.Item className='' label='' name='letra1' rules={[{ max: 1 }]}>
                <SelectComponent
                  style={{ width: '127px' }}
                  options={letras}
                  optionPropkey='key'
                  optionPropLabel='key'
                  onChange={(event) => {
                    build_direction(2, event);
                  }}
                />
              </Form.Item>
            </div>
          </div>
          <div className='form-row mt-2 text-center'>
            <div className='form-group col-md-2 col-lg-2'>
              <label htmlFor=''>BIS</label>
              <Form.Item label='' name='Bis' rules={[{ max: 3 }]}>
                <SelectComponent
                  style={{ width: '127px' }}
                  options={[
                    { key: 'Bis', value: 'Bis' },
                    { key: ' ', value: ' ' }
                  ]}
                  optionPropkey='key'
                  optionPropLabel='value'
                  onChange={(event) => {
                    build_direction(3, event);
                  }}
                />
              </Form.Item>
            </div>
            <div className='form-group col-md-2 col-lg-2'>
              <label htmlFor=''>Card</label>
              <Form.Item label='' name='card1' rules={[{ max: 4 }]}>
                <SelectComponent
                  style={{ width: '127px' }}
                  options={direcionOrienta}
                  optionPropkey='key'
                  optionPropLabel='key'
                  onChange={(event) => {
                    build_direction(4, event);
                  }}
                />
              </Form.Item>
            </div>
            <div className='form-group col-md-2 col-lg-2'>
              <label htmlFor=''>Num</label>
              <span className='ml-2' style={{ color: '#FF6341' }}>
                (*)
              </span>
              <Form.Item label='' name='Num2' rules={[{ required: true, max: 3 }]}>
                <Input
                  style={{ width: '127px' }}
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
                    build_direction(5, event.target.value);
                  }}
                />
              </Form.Item>
            </div>
            <div className='form-group col-md-2 col-lg-2'>
              <label htmlFor=''>Letra</label>
              <Form.Item label='' name='letra2' rules={[{ max: 1 }]}>
                <SelectComponent
                  style={{ width: '127px' }}
                  options={letras}
                  optionPropkey='key'
                  optionPropLabel='key'
                  onChange={(event) => {
                    build_direction(6, event);
                  }}
                />
              </Form.Item>
            </div>
            <div className='form-group col-md-2 col-lg-2'>
              <label htmlFor=''>Placa</label>
              <span className='ml-2' style={{ color: '#FF6341' }}>
                (*)
              </span>
              <Form.Item label='' name='placa' rules={[{ required: true, max: 2 }]}>
                <Input
                  style={{ width: '127px' }}
                  allowClear
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
                    build_direction(7, event.target.value);
                  }}
                />
              </Form.Item>
            </div>
            <div className='form-group col-md-2 col-lg-2'>
              <label htmlFor=''>Card</label>
              <Form.Item label='' name='card2'>
                <SelectComponent
                  style={{ width: '127px' }}
                  options={direcionOrienta}
                  optionPropkey='key'
                  optionPropLabel='key'
                  onChange={(event) => {
                    build_direction(8, event);
                  }}
                />
              </Form.Item>
            </div>
          </div>
          <div className='form-row text-center'>
            <div className='form-group col-md-6 col-lg-6 tex'>
              <div className='form-inline text-center'>
                <label htmlFor='' className='text-center'>
                  Dirección Completa
                </label>
                <span className='ml-2' style={{ color: '#FF6341' }}>
                  (*)
                </span>
                <input type='text' value={direccionCompleta} className='form-control' disabled style={{ width: '635px' }} />
                <Button
                  type='primary'
                  style={{ marginTop: '-10px', marginRight: '-400px', marginLeft: '20px', display: stateDisplayButton }}
                  onClick={onGeocoding}
                >
                  Confirmar Dirección
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>
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
