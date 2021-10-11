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
import { SetGrid } from 'app/redux/Grid/grid.actions';
import { store } from 'app/redux/app.reducers';

const { TabPane } = Tabs;

const RegistroPage: React.FC<any> = (props) => {
  const history = useHistory();
  const { accountIdentifier } = authProvider.getAccount();
  const [form] = Form.useForm<any>();
  const [isColombia, setIsColombia] = useState(true);

  const [l_municipios, setLMunicipios] = useState<IMunicipio[]>([]);
  const [[l_departamentos_colombia, l_paises], setListas] = useState<[IDepartamento[], IDominio[]]>([[], []]);

  const api = new ApiService(accountIdentifier);

  const [l_tipos_documento, setListaTipoDocumento] = useState<IDominio[]>([]);

  const getListas = useCallback(
    async () => {
      const tipoDocumento = await api.getTipoDocumeto();
      const listDocument = tipoDocumento.map((res: any) => {
        return { id: res.idTipoIdentificacion, descripcion: res.descripcion };
      });
      setListaTipoDocumento(listDocument);
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
    identity: 1,
    identification: ''
  };
  const onSubmit = async (value: any) => {
    const json = {
      primerNombre: value.name,
      segundoNombre: value.secondName,
      primerApellido: value.surname,
      segundoApellido: value.secondSurname,
      tipoDocumento: value.TipoIdent, //listado tipos de documentos
      numeroIdentificacion: Number(value.nit),
      telefonoFijo: value.phone,
      telefonoCelular: value.phonecell,
      email: value.email,
      tipoDocumentoRepresentanteLegal: value.instTipoIdent, //listado tipos de documentos
      numeroDocumentoRepresentanteLegal: Number(value.instNumIdent),
      nombreRazonSocial: value.razonsocial
    };

    const resApi = await api.personaJuridica(json);

    if (typeof resApi === 'number') {
      await api.putUser({
        oid: accountIdentifier,
        idPersonaVentanilla: resApi,
      });

      await api.PostRolesUser({
        idUser: accountIdentifier,
        idRole: '58EDA51F-7E19-47C4-947F-F359BD1FC732'
      });
      localStorage.setItem(accountIdentifier, resApi.toString());
      store.dispatch(SetGrid({ key: 'relaodMenu' }));
      history.push('/');
    }

  };
  const onSubmitFailed = () => { };
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

          <Form.Item label='Tipo Identificación' initialValue={5} name='TipoIdent' rules={[{ required: true }]}>
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
