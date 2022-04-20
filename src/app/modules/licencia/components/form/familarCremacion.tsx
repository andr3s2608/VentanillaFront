import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Steps from 'antd/es/steps';
import Button from 'antd/es/button';

// Componentes
import { SelectComponent } from 'app/shared/components/inputs/select.component';

// Hooks
import { useStepperForm } from 'app/shared/hooks/stepper.hook';

// Utilidades
import { layoutItems, layoutWrapper } from 'app/shared/utils/form-layout.util';
import { ITipoLicencia } from 'app/shared/utils/types.util';

// Secciones del formulario
import { GeneralInfoFormSeccion, KeysForm as KeyFormGeneralInfo } from './seccions/general-info.form-seccion';
import { LugarDefuncionFormSeccion, KeysForm as KeyFormLugarDefuncion } from './seccions/lugar-defuncion.form-seccion';
import { DeathInstituteFormSeccion, KeysForm as KeyFormDeathInstitute } from './seccions/death-institute.form-seccion';
import { MedicalSignatureFormSeccion, KeysForm as KeyFormMedicalSignature } from './seccions/medical-signature.form-seccion';
import { CementerioInfoFormSeccion, KeysForm as KeyFormCementerio } from './seccions/cementerio-info.form-seccion';
import { SolicitudInfoFormSeccion, KeysForm as KeyFormSolicitudInfo } from './seccions/solicitud-info.form-seccion';
import { DocumentosFormSeccion } from './seccions/documentos.form-seccion';
import { AutorizacionCremacion } from './seccions/autorizacionCremacion';

// Servicios
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
import Divider from 'antd/es/divider';
import Alert from 'antd/es/alert';
import Radio, { RadioChangeEvent } from 'antd/es/radio';
import { ApiService } from 'app/services/Apis.service';
import { authProvider } from 'app/shared/utils/authprovider.util';

const { Step } = Steps;

export const FamilarFetalCremacion: React.FC<ITipoLicencia> = (props) => {
  const { tipoLicencia, objJosn } = props;
  const [form] = Form.useForm<any>();
  const { current, setCurrent, status, setStatus, onNextStep, onPrevStep } = useStepperForm<any>(form);

  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  //#region Listados

  const [l_departamentos, setLDepartamentos] = useState<IDepartamento[]>([]);
  const [l_localidades, setLLocalidades] = useState<ILocalidad[]>([]);
  const [user, setUser] = useState<any>();
  const [[l_tipos_documento, l_nivel_educativo, l_paises, l_tipo_muerte, l_estado_civil, l_etnia], setListas] = useState<
    IDominio[][]
  >([]);

  const getListas = useCallback(
    async () => {
      const [userres, departamentos, localidades, ...resp] = await Promise.all([
        api.getCodeUser(),
        dominioService.get_departamentos_colombia(),
        dominioService.get_localidades_bogota(),
        dominioService.get_type(ETipoDominio['Tipo Documento']),
        dominioService.get_type(ETipoDominio['Nivel Educativo']),
        dominioService.get_type(ETipoDominio.Pais),
        dominioService.get_type(ETipoDominio['Tipo de Muerte']),
        dominioService.get_type(ETipoDominio['Estado Civil']),
        dominioService.get_type(ETipoDominio.Etnia)
      ]);

      setUser(userres);
      setLDepartamentos(departamentos);
      setLLocalidades(localidades);
      setListas(resp);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //#endregion

  const onSubmit = async (values: any) => {
    setStatus(undefined);
  };

  const onSubmitFailed = () => setStatus('error');

  //#region Eventos formulario

  const [l_municipios, setLMunicipios] = useState<IMunicipio[]>([]);
  const [l_areas, setLAreas] = useState<IUpz[]>([]);
  const [l_barrios, setLBarrios] = useState<IBarrio[]>([]);

  const [isColombia, setIsColombia] = useState(false);
  const [isBogota, setIsBogota] = useState(false);

  const idColombia = '1e05f64f-5e41-4252-862c-5505dbc3931c';
  const onChangePais = (value: string) => {
    form.resetFields(['departamento', 'ciudad', 'localidad', 'area', 'barrio']);
    setIsColombia(value === idColombia);
    setLMunicipios([]);
    setIsBogota(false);
    setLAreas([]);
    setLBarrios([]);
  };

  const onChangeDepartamento = async (value: string) => {
    form.resetFields(['ciudad', 'localidad', 'area', 'barrio']);
    const resp = await dominioService.get_municipios_by_departamento(value);
    setLMunicipios(resp);
    setIsBogota(false);
    setLAreas([]);
    setLBarrios([]);
  };

  const idBogota = '31211657-3386-420a-8620-f9c07a8ca491';
  const onChangeMunicipio = (value: string) => {
    form.resetFields(['localidad', 'area', 'barrio']);
    setIsBogota(value === idBogota);
    setLAreas([]);
    setLBarrios([]);
  };

  const onChangeLocalidad = async (value: string) => {
    form.resetFields(['area', 'barrio']);
    const resp = await dominioService.get_upz_by_localidad(value);
    setLAreas(resp);
    setLBarrios([]);
  };

  const onChangeArea = async (value: string) => {
    form.resetFields(['barrio']);
    const resp = await dominioService.get_barrio_by_upz(value);
    setLBarrios(resp);
  };
  const [isOtherParentesco, setIsOtherParentesco] = useState(false);
  const onChangeParentesco = (e: RadioChangeEvent) => {
    form.resetFields(['authOtherParentesco']);
    setIsOtherParentesco(e.target.value === 'Otro');
  };
  //#endregion

  return (
    <div className='fadeInRight'>
      <Divider orientation='right'> Datos Del Familiar Que Autoriza la Cremación </Divider>
      <Form.Item {...layoutWrapper}>
        <Alert message='Diligencie la información del familiar o persona que autoriza la cremación.' type='warning' showIcon />
      </Form.Item>

      <Form.Item
        label='Tipo Documento'
        name='authIDType'
        initialValue='7c96a4d3-a0cb-484e-a01b-93bc39c2552e'
        rules={[{ required: true }]}
      >
        <SelectComponent options={l_tipos_documento} optionPropkey='id' optionPropLabel='descripcion' />
      </Form.Item>

      <Form.Item label='Número de Identificación' name='mauthIDNumber' rules={[{ required: true, max: 20 }]}>
        <Input allowClear type='tel' placeholder='Número de Identificación' autoComplete='off' />
      </Form.Item>

      <Form.Item label='Primer Nombre' name='authName' rules={[{ required: true }]}>
        <Input allowClear placeholder='Primer Nombre' autoComplete='off' />
      </Form.Item>
      <Form.Item label='Segundo Nombre' name='authSecondName'>
        <Input allowClear placeholder='Segundo Nombre' autoComplete='off' />
      </Form.Item>
      <Form.Item label='Primer Apellido' name='authSurname' rules={[{ required: true }]}>
        <Input allowClear placeholder='Primer Apellido' autoComplete='off' />
      </Form.Item>
      <Form.Item label='Segundo Apellido' name='authSecondSurname'>
        <Input allowClear placeholder='Segundo Apellido' autoComplete='off' />
      </Form.Item>
      <Form.Item
        label='Parentesco'
        name='authParentesco'
        initialValue='Cónyuge (Compañero/a Permanente)'
        rules={[{ required: true }]}
      >
        <Radio.Group onChange={onChangeParentesco}>
          <Radio value='Padre / Madre'>Padre / Madre</Radio>
          <br />
          <Radio value='Hermano/a'>Hermano/a</Radio>
          <br />
          <Radio value='Hijo/a'>Hijo/a</Radio>
          <br />
          <Radio value='Cónyuge (Compañero/a Permanente)'>Cónyuge (Compañero/a Permanente)</Radio>
          <br />
          <Radio value='Tío/a'>Tío/a</Radio>
          <br />
          <Radio value='Sobrino/a'>Sobrino/a</Radio>
          <br />
          <Radio value='Abuelo/a'>Abuelo/a</Radio>
          <br />
          <Radio value='Nieto/a'>Nieto/a</Radio>
          <br />
          <Radio value='Otro'>Otro</Radio>
        </Radio.Group>
      </Form.Item>

      {isOtherParentesco && (
        <Form.Item
          className='fadeInRight'
          label='Otro... ¿Cúal?'
          name='authOtherParentesco'
          initialValue={objJosn?.authOtherParentesco ? objJosn?.authOtherParentesco : null}
          rules={[{ required: true }]}
        >
          <Input allowClear placeholder='Especifique el Parentesco' autoComplete='off' />
        </Form.Item>
      )}

      <AutorizacionCremacion tipoLicencia={tipoLicencia} />
    </div>
  );
};
