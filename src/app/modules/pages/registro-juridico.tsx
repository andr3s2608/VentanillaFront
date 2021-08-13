// Componentes
import { PageHeaderComponent } from 'app/shared/components/page-header.component';

// Utilidades
import { projectInfo } from 'app/shared/utils/constants.util';
import { authProvider } from 'app/shared/utils/authprovider.util';
import Form from 'antd/es/form';
import { layoutItems, layoutWrapper } from 'app/shared/utils/form-layout.util';
import { BasicaInformacion } from './components/form/BasicaInformacion';
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import React, { useCallback, useEffect, useState } from 'react';
import { dominioService, ETipoDominio, IDepartamento, IDominio, IMunicipio } from 'app/services/dominio.service';
import Tabs from 'antd/es/tabs';
import Alert from 'antd/es/alert';
import Input from 'antd/es/input';
import Button from 'antd/es/button';
import { useHistory } from 'react-router';
import { ApiService } from 'app/services/Apis.service';

const { TabPane } = Tabs;

const RegistroPage: React.FC<any> = (props) => {
  const history = useHistory();
  const { name, userName, accountIdentifier } = authProvider.getAccount();
  const [form] = Form.useForm<any>();
  const [isColombia, setIsColombia] = useState(true);

  const [l_municipios, setLMunicipios] = useState<IMunicipio[]>([]);
  const [[l_departamentos_colombia, l_paises], setListas] = useState<[IDepartamento[], IDominio[]]>([[], []]);

  const idColombia = '1e05f64f-5e41-4252-862c-5505dbc3931c';
  const idDepartamentoBogota = '31b870aa-6cd0-4128-96db-1f08afad7cdd';

  const api = new ApiService(accountIdentifier);

  const onChangePais = (value: string) => {
    setIsColombia(value === idColombia);
    props.form.setFieldsValue({ state: undefined, city: undefined });
  };
  const onChangeDepartamento = async (value: string) => {
    props.form.setFieldsValue({ city: undefined });
    const resp = await dominioService.get_municipios_by_departamento(value);
    setLMunicipios(resp);
  };

  const [l_tipos_documento, setListaTipoDocumento] = useState<IDominio[]>([]);

  const getListas = useCallback(
    async () => {
      const resp = await dominioService.get_type(ETipoDominio['Tipo Documento']);
      setListaTipoDocumento(resp);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goBack = () => {
    history.goBack();
  };
  const defaultValues = {
    identity: 'a7a1b90b-8f29-4509-8220-a95f567e6fcb',
    identification: ''
  };
  const onSubmit = async (value: any) => {
    const json = {
      primerNombre: value.name,
      segundoNombre: value.secondName,
      primerApellido: value.surname,
      segundoApellido: value.secondSurname,
      tipoDocumento: value.instTipoIdent, //listado tipos de documentos
      numeroIdentificacion: value.instNumIdent,
      telefonoFijo: value.phone,
      telefonoCelular: value.phonecell,
      email: value.email,
      tipoDocumentoRepresentanteLegal: null, //listado tipos de documentos
      numeroDocumentoRepresentanteLegal: null,
      nombreRazonSocial: value.razonsocial
    };

    await api.personaJuridica(json);
  };
  const onSubmitFailed = () => {};
  return (
    <div className='fadeInTop container-fluid'>
      <PageHeaderComponent
        title={`Registro Persona Jurídica. \n Datos Básicos.`}
        subTitle={`Por favor registre los datos exactamente como aparecen en la Registro de Cámara de Comercio, estos 
                datos serán usados para la generación de los Documentos asociados al trámite solicitado y su posterior reporte a
                entidades de vigilancia y control.`}
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
          <Form.Item label='Razón Social' name='razonsocial' rules={[{ required: true, max: 25 }]}>
            <Input allowClear placeholder='Razón Social' autoComplete='off' />
          </Form.Item>

          <Form.Item
            label='Tipo Identificación'
            initialValue={defaultValues.identity}
            name='instTipoIdent'
            rules={[{ required: true }]}
          >
            <SelectComponent options={l_tipos_documento} optionPropkey='id' optionPropLabel='descripcion' />
          </Form.Item>

          <Form.Item label='NIT' initialValue={defaultValues.identification} name='nit' rules={[{ required: true }]}>
            <Input allowClear type='tel' placeholder='Número Identificación' autoComplete='off' />
          </Form.Item>

          <h4 className='app-subtitle mt-3'>Representante Legal.</h4>

          <BasicaInformacion form={form} />

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
