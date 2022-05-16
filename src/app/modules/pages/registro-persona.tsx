// Componentes
import { PageHeaderComponent } from 'app/shared/components/page-header.component';

// Utilidades
import { direcionOrienta, letras, nomesclatura } from 'app/shared/utils/constants.util';
import { authProvider } from 'app/shared/utils/authprovider.util';
import Form from 'antd/es/form';
import { layoutItems, layoutWrapper } from 'app/shared/utils/form-layout.util';
import { BasicaInformacion } from './components/form/BasicaInformacion';
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import React, { useCallback, useEffect, useState } from 'react';
import { IDepartamento, IMunicipio } from 'app/services/dominio.service';
import Alert from 'antd/es/alert';
import Input from 'antd/es/input';
import Button from 'antd/es/button';
import { useHistory } from 'react-router';
import { dominioService } from 'app/services/dominio.service';
import { ApiService } from 'app/services/Apis.service';
import { EstadoCivil } from 'app/shared/utils/constants.util';
import { DatepickerComponent } from 'app/shared/components/inputs/datepicker.component';
import { store } from 'app/redux/app.reducers';
import { SetGrid } from 'app/redux/Grid/grid.actions';
import Swal from 'sweetalert2';
import 'app/shared/components/table/estilos.css';

//Redux
import { SetDireccion } from 'app/redux/dirrecion/direccion.action';

const RegistroPage: React.FC<any> = (props) => {
  const [direccionCompleta, setDireccionCompleta] = useState<string>('');
  const [prueba, setPrueba] = useState<any>([]);
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
    setDireccionCompleta(direccion.toString());
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
    } else {
      setciudadBogota2('');
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
            title: 'Usuario Registrado',
            text: 'El Usuario ' + value.name + ' ' + value.surname + ' ha sido Registrado de manera exitosa',
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            },
            icon: 'info'
          });
          history.push('/');
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Datos invalidos',
          text: 'Por favor Ingrese una Fecha de Nacimiento Valida Valido'
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Datos invalidos',
        text: 'Los Emails deben coincidir'
      });
    }
  };

  const onSubmitFailed = () => {};

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
    setDireccionCompleta(direccion_completa.toString());
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
          onFinishFailed={onSubmitFailed}
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
                                en las casillas indicadas para esto. Una vez completado los datos, favor dar clic sobre el botón verde Confirmar Dirección.
                                Esta funcionalidad permitirá autocompletar datos de UPZ, Localidad y Barrio para las direcciones de Bogotá D.C. y
                                estandarizar la dirección para el resto de ciudades.'
            type='info'
          />

          <div className='container-flex'>
            <div className='row'>
              <div className='col-5'>
                <Form.Item
                  className='block no_margin_padding anchoW1'
                  label='Via Principal'
                  name='ppla'
                  rules={[{ required: true }]}
                >
                  <div className='block no_margin_padding'>
                    <SelectComponent options={nomesclatura} onChange={cambioavenida} optionPropkey='key' optionPropLabel='key' />
                  </div>
                </Form.Item>
              </div>
              <div className='col-3'>
                <Form.Item
                  className='block no_margin_padding anchoW2'
                  label='Número'
                  name='Num1'
                  rules={[{ required: avenida, max: 3 }]}
                >
                  <div className='block no_margin_padding'>
                    <Input
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
                  </div>
                </Form.Item>
              </div>
              <div className='col-4'>
                <Form.Item className='block no_margin_padding anchoW2' label='Letra' name='letra1' rules={[{ max: 1 }]}>
                  <div className='block no_margin_padding'>
                    <SelectComponent
                      options={letras}
                      optionPropkey='key'
                      optionPropLabel='key'
                      onChange={(event) => {
                        build_direction(2, event);
                      }}
                    />
                  </div>
                </Form.Item>
              </div>
            </div>
            <div className='row'>
              <div className='col-2'>
                <Form.Item className='block no_margin_padding' label='Bis' name='Bis' rules={[{ max: 3 }]}>
                  <div className='block no_margin_padding'>
                    <SelectComponent
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
                  </div>
                </Form.Item>
              </div>
              <div className='col-2'>
                <Form.Item className='block no_margin_padding' label='Card' name='card1' rules={[{ max: 4 }]}>
                  <div className='block no_margin_padding'>
                    <SelectComponent
                      options={direcionOrienta}
                      optionPropkey='key'
                      optionPropLabel='key'
                      onChange={(event) => {
                        build_direction(4, event);
                      }}
                    />
                  </div>
                </Form.Item>
              </div>
              <div className='col-2'>
                <Form.Item className='block no_margin_padding' label='Número' name='Num2' rules={[{ required: true, max: 3 }]}>
                  <div className='block no_margin_padding'>
                    <Input
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
                  </div>
                </Form.Item>
              </div>
              <div className='col-2'>
                <Form.Item className='block no_margin_padding' label='Letra' name='letra2' rules={[{ max: 1 }]}>
                  <div className='block no_margin_padding'>
                    <SelectComponent
                      options={letras}
                      optionPropkey='key'
                      optionPropLabel='key'
                      onChange={(event) => {
                        build_direction(6, event);
                      }}
                    />
                  </div>
                </Form.Item>
              </div>
              <div className='col-2'>
                <Form.Item className='block no_margin_padding' label='Placa' name='placa' rules={[{ required: true, max: 2 }]}>
                  <div className='block no_margin_padding'>
                    <Input
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
                  </div>
                </Form.Item>
              </div>
              <div className='col-2'>
                <Form.Item className='block no_margin_padding' label='Card' name='card2'>
                  <div className='block no_margin_padding'>
                    <SelectComponent
                      options={direcionOrienta}
                      optionPropkey='key'
                      optionPropLabel='key'
                      onChange={(event) => {
                        build_direction(8, event);
                      }}
                    />
                  </div>
                </Form.Item>
              </div>
            </div>
            <div className='row margintop'>
              <div className='col-10'>
                <Form.Item name='dirreccion_completa' className='fullwidth'>
                  <p className='text-center no_margin'>Dirección</p>
                  <Input type='text' value={direccionCompleta} className='fullwidth' disabled />
                </Form.Item>
              </div>
              <div className='col-2 d-flex justify-content-start align-items-end'>
                <Button type='primary'>Validar</Button>
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
