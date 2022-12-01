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
  const { form } = props;
  const api = new ApiService(accountIdentifier);
  const [stateDisplayBox, setStateDisplayBox] = useState<string>('none');
  const [stateDisplayButton, setStateDisplayButton] = useState<string>('inline');
  const [avenida, setAvenida] = useState<boolean>(true);

  /** Estados que contienen la lista de Zonas, Localidades, UPZ y Barrios */
  const [listZonas, setListZonas] = useState<Array<Object>>([])
  const [listBarrios, setListBarrios] = useState<Array<Object>>([]);
  const [listUPZs, setListUPZs] = useState<Array<Object>>([]);
  const [listLocalidades, setListLocalidades] = useState<Array<Object>>([]);

  const getListas = useCallback(
    async () => {
      /** Se hace la peticion HTTP para obtener zonas, barrios, upzs y localidades */
      setListZonas([{ idSubRed: -1, nombre: 'SELECCIONAR' }].concat(await api.getListSubRedes()));
      setListBarrios([{ id_barrio: '0000', nombre_barrio: 'SELECCIONAR' }].concat(await api.getListBarrios()));
      setListUPZs([{ id_upz: -1, nom_upz: 'SELECCIONAR' }].concat(await api.getListUPZ()));
      setListLocalidades([{ idLocalidad: -1, nombre: 'SELECCIONAR' }].concat(await api.getListLocalidades()));

      /** Configuración para el estado inicial de la dirección */
      const initialDirection = ['', '', '', '', '', '', '', '', ''];
      sessionStorage.setItem('directionToSave', JSON.stringify(initialDirection));
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

    //const algo = api.geocoding(XML);

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
    <div className='row info-tramite mt-5'>
      <div className='form-row text'>
        <div className='form-group col-md-8 col-lg-9'>
          <p className='ml-2' style={{ fontSize: '18px', fontWeight: 'bold' }}>
            Información del lugar de la localización del sistema de abastecimiento<br />
            <small style={{ color: ' #000' }}>
              <span className='required'>* </span> Campos Obligatorios
            </small>
          </p>
        </div>
      </div>
      <div className='form-row'>
        <div className='form-group col-md-8 col-lg-9'>
          <Alert
            message='Información!'
            description='Por favor registre su dirección de residencia tal como aparece en el recibo público,
                          en las casillas indicadas para esto. Una vez completado los datos, favor dar clic sobre el botón azul Confirmar Dirección.
                          Esta funcionalidad permitirá autocompletar datos de UPZ, Localidad y Barrio para las direcciones de Bogotá D.C. y
                          estandarizar la dirección para el resto de ciudades.'
            type='info'
          />
        </div>
      </div>
      <div className='form-row'>
        <div className='form-group col-md-8 col-lg-8 text-center'>
          <label htmlFor=''>
            Via Principal

          </label>
          <Form.Item label='' name=''>
            <SelectComponent options={nomesclatura} onChange={cambioavenida} optionPropkey='key' optionPropLabel='key' />
          </Form.Item>
        </div>
        <div className='form-group col-md-2 col-lg-2 text-center'>
          <label htmlFor=''>Num</label>

          <Form.Item className='' label='' name='Num1' rules={[{ max: 3 }]}>
            <Input
              style={{ width: '100px' }} id='23' allowClear
              type='text' placeholder='' autoComplete='off'
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
                buildDirection(1, event.target.value);
              }}
            />
          </Form.Item>
        </div>
        <div className='form-group col-md-2 col-lg-2'>
          <label htmlFor='' style={{ marginLeft: '50px' }}>Letra</label>
          <Form.Item className='' label='' name='letra1' rules={[{ max: 1 }]}>
            <SelectComponent
              style={{ width: '127px', marginLeft: '50px' }}
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
                buildDirection(3, event);
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
                buildDirection(4, event);
              }}
            />
          </Form.Item>
        </div>
        <div className='form-group col-md-2 col-lg-2'>
          <label htmlFor=''>Num</label>
          <Form.Item label='' name='Num2' rules={[{ max: 3 }]}>
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
                buildDirection(5, event.target.value);
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
                buildDirection(6, event);
              }}
            />
          </Form.Item>
        </div>
        <div className='form-group col-md-2 col-lg-2'>
          <label htmlFor=''>Placa</label>
          <Form.Item label='' name='placa' rules={[{ max: 2 }]}>
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
                buildDirection(7, event.target.value);
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
                buildDirection(8, event);
              }}
            />
          </Form.Item>
        </div>
      </div>
      <div className='form-row mt-4 text-center align-items-end'>
        <div className='form-group col-md-6'>
          <div>
            <label> Dirección Completa </label>
            <Form.Item className='my-0 py-0' name='direccionCompletaUbicacion'>
              <Input style={{ width: '395px' }} type='text' disabled={true} />
            </Form.Item>
          </div>
        </div>
        <div className='form-group col-md-6'>
          <Button
            className='my-0 py-0'
            type='primary'
            style={{ width: '395px', display: stateDisplayButton }}
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



      <div className='form-row mt-4 text-center'>
        <div className='form-group col-md-6'>
          <label htmlFor=''>Zona</label>
          <span className='ml-2' style={{ color: '#FF6341' }}>(*)</span>
          <Form.Item label='' name='zonaUbicacion' initialValue={'SELECCIONAR'} rules={[{ required: true }]}>
            <SelectComponent
              style={{ width: '395px' }}
              options={listZonas}
              optionPropkey='idSubRed'
              optionPropLabel='nombre'
            />
          </Form.Item>
        </div>
        <div className='form-group col-md-6'>
          <label htmlFor=''>Localidad</label>
          <span className='ml-2' style={{ color: '#FF6341' }}>(*)</span>
          <Form.Item label='' name='localidadUbicacion' initialValue={'SELECCIONAR'} rules={[{ required: true }]}>
            <SelectComponent
              style={{ width: '395px' }}
              options={listLocalidades}
              optionPropkey='idLocalidad'
              optionPropLabel='nombre'
            />
          </Form.Item>
        </div>
      </div>
      <div className='form-row mt-4 text-center'>
        <div className='form-group col-md-6'>
          <label htmlFor=''>Upz</label>
          <span className='ml-2' style={{ color: '#FF6341' }}>(*)</span>
          <Form.Item label='' name='upzUbicacion' initialValue={'SELECCIONAR'} rules={[{ required: true }]}>
            <SelectComponent
              style={{ width: '395px' }}
              options={listUPZs}
              optionPropkey='id_upz'
              optionPropLabel='nom_upz'
            />
          </Form.Item>
        </div>
        <div className='form-group col-md-6'>
          <label htmlFor=''>Barrio</label>
          <span className='ml-2' style={{ color: '#FF6341' }}>(*)</span>
          <Form.Item label='' name='barrioUbicacion' initialValue={'SELECCIONAR'} rules={[{ required: true }]}>
            <SelectComponent
              style={{ width: '395px' }}
              options={listBarrios}
              optionPropkey='id_barrio'
              optionPropLabel='nombre_barrio'
            />
          </Form.Item>
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
