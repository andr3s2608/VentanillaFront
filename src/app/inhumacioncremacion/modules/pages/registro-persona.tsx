import { EstadoCivil, direcionOrienta, letras, nomesclatura } from 'app/shared/utils/constants.util';
import { DatepickerComponent } from 'app/shared/components/inputs/datepicker.component';
import { PageHeaderComponent } from 'app/shared/components/page-header.component';
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import { layoutItems, layoutWrapper } from 'app/shared/utils/form-layout.util';
import React, { useCallback, useEffect, useState, useReducer } from 'react';
import { IDepartamento, IMunicipio } from 'app/services/dominio.service';
import { BasicaInformacion } from './components/form/BasicaInformacion';
import { authProvider } from 'app/shared/utils/authprovider.util';
import Form from 'antd/es/form';
import Alert from 'antd/es/alert';
import Input from 'antd/es/input';
import Button from 'antd/es/button';
import { useHistory } from 'react-router';
import { errorMessage } from 'app/services/settings/message.service';
import { SetDireccion } from 'app/redux/dirrecion/direccion.action';
import { dominioService } from 'app/services/dominio.service';
import { ApiService } from 'app/services/Apis.service';
import { store } from 'app/redux/app.reducers';
import { SetGrid } from 'app/redux/Grid/grid.actions';
import Swal from 'sweetalert2';
import 'app/shared/components/table/estilos.css';

const RegistroPage: React.FC<any> = (props) => {
  const [direccionCompleta, setDireccionCompleta] = useState<string>('');
  const [stateDisplayBox, setStateDisplayBox] = useState<string>('none');
  const [stateDisplayButton, setStateDisplayButton] = useState<string>('inline');
  const history = useHistory();
  const [form] = Form.useForm<any>();
  const [isColombia, setIsColombia] = useState(true);
  const [sex, setSex] = useState<[]>([]);
  const [genero, setGenero] = useState<[]>([]);
  const [orientacion, setOrientacion] = useState<[]>([]);
  const [etniastate, setEtnia] = useState<[]>([]);
  const [nivelEducativo, setNivelEducativo] = useState<[]>([]);
  const [l_municipios, setLMunicipios] = useState<IMunicipio[]>([]);
  const [l_municipiosres, setLMunicipiosres] = useState<IMunicipio[]>([]);
  const [[l_departamentos_colombia, l_paises], setListas] = useState<[IDepartamento[], []]>([[], []]);
  const [avenida, setAvenida] = useState<boolean>(true);
  const [listOfZona, setListOfZona] = useState<Array<Object>>([{ descripcion: 'id1', value: 'default' }]);
  const [listOfLocalidad, setListOfLocalidad] = useState<Array<Object>>([{ descripcion: 'id1', value: 'default' }]);
  const [listOfUPZ, setListOfUPZ] = useState<Array<Object>>([{ descripcion: 'id1', value: 'default' }]);
  const [listOfBarrio, setListOfBarrio] = useState<Array<Object>>([{ descripcion: 'id1', value: 'default' }]);
  const [initialValueZona, setInitialValueZona] = useState<any>('NORTE');
  const [initialValueLocalidad, setInitialValueLocalidad] = useState<any>('BOSA');
  const [initialValueUPZ, setInitialValueUPZ] = useState<any>('AMERICAS');
  const [initialValueBarrio, setInitialValueBarrio] = useState<any>('ACACIAS USAQUEN');
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [ciudadBogota, setciudadBogota] = useState<string>('Bogotá D.C.');
  const [ciudadBogota2, setciudadBogota2] = useState<string>('Bogotá D.C.');

  const idColombia = '170';
  const idDepartamentoBogota = '31b870aa-6cd0-4128-96db-1f08afad7cdd';
  const getListas = useCallback(
    async () => {
      const [municipios, ...resp] = await Promise.all([
        dominioService.get_all_municipios_by_departamento(idDepartamentoBogota),
        dominioService.get_departamentos_colombia(),
        api.getPaises()
      ]);

      setLMunicipios(municipios);
      setLMunicipiosres(municipios);
      setListas(resp);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  store.subscribe(() => {
    const { direccion } = store.getState();
    setDireccionCompleta(direccion.join(' '));
  });

  const getListas2 = useCallback(
    async () => {
      const [etnia, sexo, genero, orientacion, educacion] = await Promise.all([
        api.GetEtnia(),
        api.GetSexoazure(),
        api.GetGeneroonazure(),
        api.GetOrientacionazure(),
        api.GetNivelEducativo()
      ]);
      setEtnia(etnia);
      setSex(sexo);
      setGenero(genero);
      setOrientacion(orientacion);
      setNivelEducativo(educacion);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onChangePais = (value: string) => {
    setIsColombia(value === idColombia);

    if (isColombia) {
      form.setFieldsValue({ state: 1, city: 11001000 });
    }

    form.setFieldsValue({ state: undefined, city: undefined, cityLive: undefined });
  };
  const onChangeDepartamento = async (value: string) => {
    form.setFieldsValue({ cityLive: undefined });
    const depart = await dominioService.get_departamentos_colombia();
    let departamento = (await depart).filter((i) => i.idDepPai == parseInt(value));
    const { idDepartamento } = departamento[0];

    const resp = await dominioService.get_all_municipios_by_departamento(idDepartamento);
    setLMunicipios(resp);

    if (value == '1') {
      setciudadBogota('Bogotá D.C.');
    } else {
      setciudadBogota('');
    }
  };

  const onChangeDepartamentor = async (value: string) => {
    form.setFieldsValue({ city: undefined });
    const depart = await dominioService.get_departamentos_colombia();
    let departamento = (await depart).filter((i) => i.idDepPai == parseInt(value));
    const { idDepartamento } = departamento[0];

    const resp = await dominioService.get_all_municipios_by_departamento(idDepartamento);
    setLMunicipiosres(resp);
    if (value == '1') {
      setciudadBogota2('Bogotá D.C.');
      setStateDisplayButton('inline');
    } else {
      setciudadBogota2('');
      setStateDisplayButton('none');
      setStateDisplayBox('none');
    }
  };

  useEffect(() => {
    getListas();
    getListas2();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goBack = () => {
    history.goBack();
  };

  const onSubmit = async (value: any) => {
    const confirEmail: string = value.confirEmail;
    const email: string = value.email;
    const emailmayus = email.toUpperCase();
    const emailconfmayus = confirEmail.toUpperCase();

    if (emailmayus == emailconfmayus) {
      const { ppla, Num1, letra1, Bis, card1, Num2, letra2, placa, card2 } = value;
      var numero1: number;
      const numero2: number = Num2;

      const telcel: number = value.phonecell;
      const fecha: String = value.date;

      var fechaformato: string = fecha.toString();

      var fechavalidacion = fechaformato.substring(11, 15);
      if (avenida) {
        numero1 = Num1;
      } else {
        numero1 = 10;
      }

      const dep = value.stateLive;
      var mun1: string = value.cityLive;
      var mun: number = parseInt(mun1);
      switch (dep) {
        case 1:
          mun = 11001000;
          break;
      }

      const depres = value.state;
      var munres1: string = value.city;
      var munres: number = parseInt(munres1);
      switch (depres) {
        case 1:
          munres = 11001000;
          break;
      }

      if (fechavalidacion >= '1900') {
        const { ppla, Num1, letra1, Bis, card1, Num2, letra2, placa, card2 } = value;
        const direcion = `${ppla} ${Num1} ${letra1} ${Bis} ${card1} ${Num2} ${letra2} ${placa} ${card2}`;
        const data = {
          primerNombre: value.name,
          segundoNombre: value.secondName ?? '',
          primerApellido: value.surname,
          segundoApellido: value.secondSurname ?? '',
          tipoDocumento: value.instTipoIdent, //listado tipos de documentos
          numeroIdentificacion: Number(value.instNumIdent),
          telefonoFijo: value.phone ?? '',
          telefonoCelular: value.phonecell,
          email: value.email,
          nacionalidad: value.country, //listado de paises
          departamento: value.stateLive, //listado de departamentos
          ciudadNacimientoOtro: !isColombia ? mun : '',
          ciudadNacimiento: isColombia ? mun : 0, //listado municipios
          departamentoResidencia: value.state, //listado departamentos
          ciudadResidencia: munres, //listado municipios
          direccionResidencia: direcion,
          fechaNacimiento: value.date,
          sexo: value.sex, //listado sexo
          genero: value.gender, //lista quemada
          orientacionSexual: value.sexual_orientation, //lista quemada
          etnia: value.ethnicity ?? '', //listado etnia
          estadoCivil: value.estadoCivil, //lista quemada
          nivelEducativo: value.levelEducation //listado nivel educativo
        };

        const resApi = await api.personaNatural(data);

        if (typeof resApi === 'number') {
          api.sendEmail({
            to: value.email,
            subject: 'Registro de persona natural ',
            body: 'Señor (a) ' + value.name + '  ' + value.surname + ' su usuario creado exitosamente'
          });
          const segundo = value.secondName ?? ' ';
          const segundoape = value.secondSurname ?? '';
          await api.putUser({
            oid: accountIdentifier,
            idPersonaVentanilla: resApi,
            NombreCompleto: value.name + ' ' + segundo + ' ' + value.surname + ' ' + segundoape
          });
          await api.PostRolesUser({
            idUser: accountIdentifier,
            idRole: '58EDA51F-7E19-47C4-947F-F359BD1FC732'
          });
          localStorage.setItem(accountIdentifier, resApi.toString());
          store.dispatch(SetGrid({ key: 'relaodMenu' }));
          Swal.fire({
            icon: 'success',
            title: 'Usuario Registrado',
            text: 'El Usuario ' + value.name + ' ' + value.surname + ' ha sido Registrado de manera exitosa',
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            }
          });
          history.push('/');
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Datos inválidos',
          text: 'Por favor ingrese una fecha de nacimiento valida'
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Datos inválidos',
        text: 'Los emails deben coincidir'
      });
    }
  };

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

    if (form.getFieldValue('state') === 1) {
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
    }
  };

  return (
    <div className='fadeInTop container-fluid'>
      <PageHeaderComponent
        title={`Registro Persona Natural.`}
        subTitle={`Por favor registre los datos exactamente como aparecen en su documento de identidad, estos datos serán usados para la generación de los Documentos asociados al trámite solicitado y su posterior reporte a entidades de vigilancia y control.`}
        backIcon={null}
      />

      <div className='card card-body'>
        <h4 className='app-subtitle mt-3'>Datos Básicos.</h4>

        <Form
          form={form}
          className='mb-4 w-100'
          {...layoutItems}
          style={{ maxWidth: 800 }}
          layout='horizontal'
          onFinish={onSubmit}
        >
          <BasicaInformacion form={form} />
          <h4 className='app-subtitle mt-3'>Datos Geográficos.</h4>
          {isColombia ? (
            <>
              <Form.Item label='Nacionalidad' name='country' initialValue={idColombia} rules={[{ required: true }]}>
                <SelectComponent options={l_paises} optionPropkey='idPais' optionPropLabel='nombre' onChange={onChangePais} />
              </Form.Item>
              <Form.Item label='Departamento de nacimiento' name='stateLive' initialValue={1} rules={[{ required: isColombia }]}>
                <SelectComponent
                  options={l_departamentos_colombia}
                  optionPropkey='idDepPai'
                  optionPropLabel='descripcion'
                  onChange={onChangeDepartamento}
                  disabled={!isColombia}
                />
              </Form.Item>
              <Form.Item label='Ciudad de nacimiento' name='cityLive' initialValue={11001000} rules={[{ required: isColombia }]}>
                <SelectComponent
                  options={l_municipios}
                  value={ciudadBogota}
                  optionPropkey='munId'
                  optionPropLabel='descripcion'
                  disabled={!isColombia}
                />
              </Form.Item>
              <Form.Item label='Departamento de residencia' name='state' initialValue={1} rules={[{ required: isColombia }]}>
                <SelectComponent
                  options={l_departamentos_colombia}
                  optionPropkey='idDepPai'
                  optionPropLabel='descripcion'
                  onChange={onChangeDepartamentor}
                  disabled={!isColombia}
                />
              </Form.Item>
              <Form.Item label='Ciudad de residencia' name='city' initialValue={11001000} rules={[{ required: isColombia }]}>
                <SelectComponent
                  options={l_municipiosres}
                  value={ciudadBogota2}
                  optionPropkey='munId'
                  optionPropLabel='descripcion'
                  disabled={!isColombia}
                />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item label='Nacionalidad' name='country' initialValue={idColombia} rules={[{ required: true }]}>
                <SelectComponent options={l_paises} optionPropkey='idPais' optionPropLabel='nombre' onChange={onChangePais} />
              </Form.Item>
              <Form.Item label='Ciudad de nacimiento' name='cityLive' initialValue={''} rules={[{ required: true }]}>
                <Input
                  allowClear
                  placeholder=''
                  autoComplete='off'
                  type={'text'}
                  onKeyPress={(event) => {
                    if (!/[a-zA-Z]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onPaste={(event) => {
                    event.preventDefault();
                  }}
                />
              </Form.Item>
              <Form.Item label='Departamento de residencia' name='state' rules={[{ required: true }]}>
                <SelectComponent
                  options={l_departamentos_colombia}
                  optionPropkey='idDepartamento'
                  optionPropLabel='descripcion'
                  onChange={onChangeDepartamento}
                />
              </Form.Item>
              <Form.Item label='Ciudad de residencia' name='city' rules={[{ required: true }]}>
                <SelectComponent options={l_municipios} optionPropkey='idMunicipio' optionPropLabel='descripcion' />
              </Form.Item>
            </>
          )}
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

          <div style={{ display: stateDisplayBox }}>
            <Alert message='Información!' description='La dirección fue georreferenciada exitosamente.' type='info' />
            <div className='form-row mt-4 text-center'>
              <div className='form-group col-md-6'>
                <label htmlFor=''>Zona</label>

                <Form.Item label='' name='zona' initialValue={initialValueZona}>
                  <SelectComponent
                    style={{ width: '395px' }}
                    options={listOfZona}
                    optionPropkey='idSubRed'
                    optionPropLabel='nombre'
                  />
                </Form.Item>
              </div>
              <div className='form-group col-md-6'>
                <label htmlFor=''>Localidad</label>

                <Form.Item label='' name='localidad' initialValue={initialValueLocalidad}>
                  <SelectComponent
                    style={{ width: '395px' }}
                    options={listOfLocalidad}
                    optionPropkey='idLocalidad'
                    optionPropLabel='nombre'
                  />
                </Form.Item>
              </div>
            </div>
            <div className='form-row mt-4 text-center'>
              <div className='form-group col-md-6'>
                <label htmlFor=''>Upz</label>

                <Form.Item label='' name='upz' initialValue={initialValueUPZ}>
                  <SelectComponent
                    style={{ width: '395px' }}
                    options={listOfUPZ}
                    optionPropkey='id_upz'
                    optionPropLabel='nom_upz'
                  />
                </Form.Item>
              </div>
              <div className='form-group col-md-6'>
                <label htmlFor=''>Barrio</label>

                <Form.Item label='' name='barrio' initialValue={initialValueBarrio}>
                  <SelectComponent
                    style={{ width: '395px' }}
                    options={listOfBarrio}
                    optionPropkey='id_barrio'
                    optionPropLabel='nombre_barrio'
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <h4 className='app-subtitle mt-3'>Datos Demográficos.</h4>

          <Form.Item label='Fecha Nacimiento' name='date' rules={[{ required: true }]}>
            <DatepickerComponent picker='date' dateDisabledType='before' dateFormatType='default' />
          </Form.Item>
          <Form.Item label='Sexo' name='sex' rules={[{ required: true }]}>
            <SelectComponent options={sex} optionPropkey='orden' optionPropLabel='descripcion' />
          </Form.Item>
          <Form.Item label='Género' name='gender' rules={[{ required: true }]}>
            <SelectComponent options={genero} optionPropkey='orden' optionPropLabel='descripcion' />
          </Form.Item>
          <Form.Item label='Orientación sexual' name='sexual_orientation' rules={[{ required: true }]}>
            <SelectComponent options={orientacion} optionPropkey='orden' optionPropLabel='descripcion' />
          </Form.Item>
          <Form.Item label='Etnia' name='ethnicity' rules={[{ required: true }]}>
            <SelectComponent options={etniastate} optionPropkey='idEtnia' optionPropLabel='nombre' />
          </Form.Item>
          <Form.Item label='Estado Civil' name='estadoCivil' rules={[{ required: true }]}>
            <SelectComponent options={EstadoCivil} optionPropkey='key' optionPropLabel='name' />
          </Form.Item>
          <Form.Item label='Nivel Educativo' name='levelEducation' rules={[{ required: true }]}>
            <SelectComponent options={nivelEducativo} optionPropkey='idNivelEducativo' optionPropLabel='nombre' />
          </Form.Item>
          <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
            <div className='d-flex justify-content-between'>
              <Button type='dashed' htmlType='button' onClick={goBack}>
                Volver atrás
              </Button>
              <Button type='primary' htmlType='submit'>
                Guardar
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default RegistroPage;
