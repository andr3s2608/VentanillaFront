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
import { IMunicipio } from 'app/services/dominio.service';
import Alert from 'antd/es/alert';
import Input from 'antd/es/input';
import Button from 'antd/es/button';
import { useHistory } from 'react-router';
import { ApiService } from 'app/services/Apis.service';
import { EstadoCivil } from 'app/shared/utils/constants.util';
import { DatepickerComponent } from 'app/shared/components/inputs/datepicker.component';
import { store } from 'app/redux/app.reducers';
import { SetGrid } from 'app/redux/Grid/grid.actions';
import Swal from 'sweetalert2';

const RegistroPage: React.FC<any> = (props) => {
  const history = useHistory();
  const [form] = Form.useForm<any>();
  const [isColombia, setIsColombia] = useState(true);
  const [sex, setSex] = useState<[]>([]);
  const [etniastate, setEtnia] = useState<[]>([]);
  const [nivelEducativo, setNivelEducativo] = useState<[]>([]);
  const [l_municipios, setLMunicipios] = useState<IMunicipio[]>([]);
  const [[l_departamentos_colombia, l_paises], setListas] = useState<[[], []]>([[], []]);

  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);

  const idColombia = '170';
  const idDepartamentoBogota = '3';
  const getListas = useCallback(
    async () => {
      const [municipios, ...resp] = await Promise.all([
        api.getMunicipio(idDepartamentoBogota),
        api.getDepartament(),
        api.getPaises()
      ]);
      setLMunicipios(municipios);
      setListas(resp);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const getListas2 = useCallback(
    async () => {
      const [etnia, sexo, educacion] = await Promise.all([api.GetEtnia(), api.GetSexo(), api.GetNivelEducativo()]);
      setEtnia(etnia);
      setSex(sexo);
      setNivelEducativo(educacion);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onChangePais = (value: string) => {
    setIsColombia(value === idColombia);

    if (isColombia) {
      form.setFieldsValue({ state: 3, city: 179 });
    }

    form.setFieldsValue({ state: undefined, city: undefined, cityLive: undefined });
  };
  const onChangeDepartamento = async (value: string) => {
    form.setFieldsValue({ city: undefined });
    const resp = await api.getMunicipio(value);
    setLMunicipios(resp);
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
    const { confirEmail, email } = value;

    if (confirEmail === email) {
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
        departamento: value.state, //listado de departamentos
        ciudadNacimientoOtro: !isColombia ? value.cityLive : '',
        ciudadNacimiento: isColombia ? value.cityLive : 0, //listado municipios
        departamentoResidencia: value.state, //listado departamentos
        ciudadResidencia: value.city, //listado municipios
        direccionResidencia: direcion,
        fechaNacimiento: value.date,
        sexo: value.sex, //listado sexo
        genero: value.gender, //lista quemada
        orientacionSexual: value.sexual_orientation, //lista quemada
        etnia: value.ethnicity, //listado etnia
        estadoCivil: value.estadoCivil, //lista quemada
        nivelEducativo: value.levelEducation //listado nivel educativo
      };
      const resApi = await api.personaNatural(data);
      if (typeof resApi === 'number') {
        await api.putUser({
          oid: accountIdentifier,
          idPersonaVentanilla: resApi
        });
        await api.PostRolesUser({
          idUser: accountIdentifier,
          idRole: '58EDA51F-7E19-47C4-947F-F359BD1FC732'
        });
        localStorage.setItem(accountIdentifier, resApi.toString());
        store.dispatch(SetGrid({ key: 'relaodMenu' }));
        history.push('/');
      }
    }
  };

  const onSubmitFailed = () => {};

  return (
    <div className='fadeInTop container-fluid'>
      <PageHeaderComponent
        title={`Registro Persona Natural.`}
        subTitle={`Por favor registre los datos exactamente como aparecen en su documento de identidad, estos datos serán usados para la generacion de los Documentos asociados al trámite solicitado y su posterior reporte a entidades de vigilancia y control.`}
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
              <Form.Item label='Departamento de nacimiento' name='stateLive' initialValue={3} rules={[{ required: isColombia }]}>
                <SelectComponent
                  options={l_departamentos_colombia}
                  optionPropkey='idDepartamento'
                  optionPropLabel='descripcion'
                  onChange={onChangeDepartamento}
                  disabled={!isColombia}
                />
              </Form.Item>
              <Form.Item label='Ciudad de nacimiento' name='cityLive' initialValue={149} rules={[{ required: isColombia }]}>
                <SelectComponent
                  options={l_municipios}
                  optionPropkey='idMunicipio'
                  optionPropLabel='descripcion'
                  disabled={!isColombia}
                />
              </Form.Item>
              <Form.Item label='Departamento de residencia' name='state' initialValue={3} rules={[{ required: isColombia }]}>
                <SelectComponent
                  options={l_departamentos_colombia}
                  optionPropkey='idDepartamento'
                  optionPropLabel='descripcion'
                  onChange={onChangeDepartamento}
                  disabled={!isColombia}
                />
              </Form.Item>
              <Form.Item label='Ciudad de residencia' name='city' initialValue={149} rules={[{ required: isColombia }]}>
                <SelectComponent
                  options={l_municipios}
                  optionPropkey='idMunicipio'
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
                <Input allowClear placeholder='' autoComplete='off' />
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
          <Form.Item label='Via Ppal' name='ppla' rules={[{ required: true }]}>
            <SelectComponent options={nomesclatura} optionPropkey='key' optionPropLabel='key' />
          </Form.Item>
          <Form.Item label='Número' name='Num1' rules={[{ required: true }]}>
            <Input allowClear type='number' placeholder='' autoComplete='off' />
          </Form.Item>
          <Form.Item label='letra' name='letra1'>
            <SelectComponent options={letras} optionPropkey='key' optionPropLabel='key' />
          </Form.Item>
          <Form.Item label='Bis' name='Bis'>
            <SelectComponent options={[{ key: 'Bis', value: 'Bis' }]} optionPropkey='key' optionPropLabel='value' />
          </Form.Item>
          <Form.Item label='Card' name='card1'>
            <SelectComponent options={direcionOrienta} optionPropkey='key' optionPropLabel='key' />
          </Form.Item>
          <Form.Item label='Número' name='Num2' rules={[{ required: true }]}>
            <Input allowClear type='number' placeholder='' autoComplete='off' />
          </Form.Item>
          <Form.Item label='letra' name='letra2'>
            <SelectComponent options={letras} optionPropkey='key' optionPropLabel='key' />
          </Form.Item>
          <Form.Item label='Placa' name='placa' rules={[{ required: true }]}>
            <Input
              allowClear
              placeholder=''
              autoComplete='off'
              type='text'
              pattern='[a-zA-Z0-9-]{7,7}'
              onInvalid={() => {
                Swal.fire({
                  icon: 'error',
                  title: 'Datos invalidos',
                  text: 'Los datos ingresados en el campo Placa son invalidos'
                });
              }}
            />
          </Form.Item>
          <Form.Item label='Card' name='card2'>
            <SelectComponent options={direcionOrienta} optionPropkey='key' optionPropLabel='key' />
          </Form.Item>

          <h4 className='app-subtitle mt-3'>Datos Demográficos.</h4>

          <Form.Item label='Fecha Nacimiento' name='date' rules={[{ required: true }]}>
            <DatepickerComponent picker='date' dateDisabledType='before' dateFormatType='default' />
          </Form.Item>
          <Form.Item label='Sexo' name='sex' rules={[{ required: true }]}>
            <SelectComponent options={sex} optionPropkey='idSexo' optionPropLabel='descripcionSexo' />
          </Form.Item>
          <Form.Item label='Género' name='gender' rules={[{ required: true }]}>
            <SelectComponent options={sex} optionPropkey='idSexo' optionPropLabel='descripcionSexo' />
          </Form.Item>
          <Form.Item label='Orientación sexual' name='sexual_orientation' rules={[{ required: true }]}>
            <SelectComponent options={sex} optionPropkey='idSexo' optionPropLabel='descripcionSexo' />
          </Form.Item>
          <Form.Item label='Etnia' name='ethnicity' rules={[{ required: true }]}>
            <SelectComponent options={etniastate} optionPropkey='idEtnia' optionPropLabel='nombre' />
          </Form.Item>
          <Form.Item label='Estado Civil' name='estadoCivil' rules={[{ required: true }]}>
            <SelectComponent options={EstadoCivil} optionPropkey='key' optionPropLabel='name' />
          </Form.Item>
          <Form.Item label='Nivel Educativo' name='levelEducation' rules={[{ required: false }]}>
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
