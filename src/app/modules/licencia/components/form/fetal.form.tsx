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

const { Step } = Steps;

export const FetalForm: React.FC<ITipoLicencia> = (props) => {
  const { tipoLicencia } = props;
  const [form] = Form.useForm<any>();
  const { current, setCurrent, status, setStatus, onNextStep, onPrevStep } = useStepperForm<any>(form);

  //#region Listados

  const [l_departamentos, setLDepartamentos] = useState<IDepartamento[]>([]);
  const [l_localidades, setLLocalidades] = useState<ILocalidad[]>([]);
  const [[l_tipos_documento, l_nivel_educativo, l_paises, l_tipo_muerte, l_estado_civil, l_etnia], setListas] = useState<
    IDominio[][]
  >([]);

  const getListas = useCallback(
    async () => {
      const [departamentos, localidades, ...resp] = await Promise.all([
        dominioService.get_departamentos_colombia(),
        dominioService.get_localidades_bogota(),
        dominioService.get_type(ETipoDominio['Tipo Documento']),
        dominioService.get_type(ETipoDominio['Nivel Educativo']),
        dominioService.get_type(ETipoDominio.Pais),
        dominioService.get_type(ETipoDominio['Tipo de Muerte']),
        dominioService.get_type(ETipoDominio['Estado Civil']),
        dominioService.get_type(ETipoDominio.Etnia)
      ]);
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
    console.log(values);
    /* const resp = await personaService.add_persona_vacuna_exterior(values);
    if (resp) {
      setCurrent(0);
      form.resetFields();
    } */
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
  const onChangeParentesco = (e: RadioChangeEvent) => {
    form.resetFields(['authOtherParentesco']);
    //setIsOtherParentesco(e.target.value === 'Otro');
  };
  //#endregion

  return (
    <div className='card card-body py-5 mb-4 fadeInTop'>
      <div className='d-lg-flex align-items-start'>
        <Steps
          className='mb-5 mr-5'
          current={current}
          status={status}
          onChange={setCurrent}
          direction='vertical'
          style={{ maxWidth: 250 }}
        >
          <Step title='Información General' description='Datos Certificación del fallecimiento.' />
          <Step title='Información de la Madre' description='Información general de la Madre.' />
          <Step
            title='Información del Solicitante'
            description='Datos o información de la funeraria o solicitante, datos del fallecimiento, solicitud y otros datos.'
          />
          <Step title='Información Certificado' description='Datos de Quien Certifica la defunción - Medico' />
          <Step title='Documentos Requeridos' description='Documentos de soporte pdf.' />
        </Steps>

        <Form
          form={form}
          className='mb-4 w-100'
          {...layoutItems}
          style={{ maxWidth: 700 }}
          layout='horizontal'
          onFinish={onSubmit}
          onFinishFailed={onSubmitFailed}
        >
          <div className={`d-none fadeInRight ${current === 0 && 'd-block'}`}>
            <GeneralInfoFormSeccion />
            <LugarDefuncionFormSeccion form={form} />
            <DeathInstituteFormSeccion form={form} datofiscal={true} />
            <Divider orientation='right'> Tipo de Muerte </Divider>
            <Form.Item
              label='Tipo de Muerte'
              name='deathType'
              initialValue='475c280d-67af-47b0-a8bc-de420f6ac740'
              rules={[{ required: true }]}
            >
              <SelectComponent options={l_tipo_muerte} optionPropkey='id' optionPropLabel='descripcion' />
            </Form.Item>

            <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
              <div className='d-flex justify-content-end'>
                <Button
                  type='primary'
                  htmlType='button'
                  onClick={() => onNextStep([...KeyFormGeneralInfo, ...KeyFormLugarDefuncion])}
                >
                  Siguiente
                </Button>
              </div>
            </Form.Item>
          </div>

          <div className={`d-none fadeInRight ${current === 1 && 'd-block'}`}>
            <Divider orientation='right'> INFORMACION DE LA MADRE</Divider>
            <Form.Item
              label='Tipo Identificación'
              name='IDType'
              rules={[{ required: true }]}
              initialValue='7c96a4d3-a0cb-484e-a01b-93bc39c2552e'
            >
              <SelectComponent options={l_tipos_documento} optionPropkey='id' optionPropLabel='descripcion' />
            </Form.Item>
            <Form.Item label='Número de Identificación' name='IDNumber' rules={[{ required: true, max: 25 }]}>
              <Input allowClear placeholder='Número de Identificación' autoComplete='off' />
            </Form.Item>

            <Form.Item label='Primer Nombre' name='name' rules={[{ required: true }]}>
              <Input allowClear placeholder='Primer Nombre' autoComplete='off' />
            </Form.Item>
            <Form.Item label='Segundo Nombre' name='secondName'>
              <Input allowClear placeholder='Segundo Nombre' autoComplete='off' />
            </Form.Item>
            <Form.Item label='Primer Apellido' name='surname' rules={[{ required: true }]}>
              <Input allowClear placeholder='Primer Apellido' autoComplete='off' />
            </Form.Item>
            <Form.Item label='Segundo Apellido' name='secondSurname'>
              <Input allowClear placeholder='Segundo Apellido' autoComplete='off' />
            </Form.Item>

            <Form.Item
              label='Nacionalidad de la Madre'
              name='nationalidad'
              initialValue={['1e05f64f-5e41-4252-862c-5505dbc3931c']}
              rules={[{ required: true, type: 'array' }]}
            >
              <SelectComponent
                options={l_paises}
                mode='multiple'
                placeholder='-- Elija una o varias --'
                optionPropkey='id'
                optionPropLabel='descripcion'
              />
            </Form.Item>

            <Form.Item label='Estado Civil' name='civilStatus' initialValue='4c17996a-7113-4e17-a0fe-6fd7cd9bbcd1'>
              <SelectComponent options={l_estado_civil} optionPropkey='id' optionPropLabel='descripcion' />
            </Form.Item>
            <Form.Item label='Nivel Educativo' name='educationLevel' initialValue='07ebd0bb-2b00-4a2b-8db5-4582eee1d285'>
              <SelectComponent options={l_nivel_educativo} optionPropkey='id' optionPropLabel='descripcion' />
            </Form.Item>
            <Form.Item label='Etnia' name='etnia' initialValue='60875c52-9b2a-4836-8bc7-2f3648f41f57'>
              <SelectComponent options={l_etnia} optionPropkey='id' optionPropLabel='descripcion' />
            </Form.Item>
            <Divider orientation='right'> RESIDENCIA HABITUAL DE LA MADRE</Divider>
            <Form.Item label='País de Residencia' name='pais' rules={[{ required: true }]}>
              <SelectComponent options={l_paises} optionPropkey='id' optionPropLabel='descripcion' onChange={onChangePais} />
            </Form.Item>

            <Form.Item label='Departamento de Residencia' name='departamento' rules={[{ required: isColombia }]}>
              <SelectComponent
                options={l_departamentos}
                optionPropkey='idDepartamento'
                optionPropLabel='descripcion'
                disabled={!isColombia}
                onChange={onChangeDepartamento}
              />
            </Form.Item>

            <Form.Item label='Ciudad de Residencia' name='ciudad' rules={[{ required: true }]}>
              {isColombia ? (
                <SelectComponent
                  options={l_municipios}
                  optionPropkey='idMunicipio'
                  optionPropLabel='descripcion'
                  onChange={onChangeMunicipio}
                />
              ) : (
                <Input allowClear placeholder='Ciudad' autoComplete='off' />
              )}
            </Form.Item>

            <Form.Item label='Localidad de Residencia' name='localidad' rules={[{ required: isBogota }]}>
              <SelectComponent
                options={l_localidades}
                optionPropkey='idLocalidad'
                optionPropLabel='descripcion'
                disabled={!isBogota}
                onChange={onChangeLocalidad}
              />
            </Form.Item>

            <Form.Item label='Área de Residencia' name='area' rules={[{ required: isBogota }]}>
              <SelectComponent
                options={l_areas}
                optionPropkey='idUpz'
                optionPropLabel='descripcion'
                disabled={!isBogota}
                onChange={onChangeArea}
              />
            </Form.Item>

            <Form.Item label='Barrio de Residencia' name='barrio' rules={[{ required: isBogota }]}>
              <SelectComponent options={l_barrios} optionPropkey='idBarrio' optionPropLabel='descripcion' disabled={!isBogota} />
            </Form.Item>
            <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
              <div className='d-flex justify-content-between'>
                <Button type='dashed' htmlType='button' onClick={onPrevStep}>
                  Volver atrás
                </Button>
                <Button
                  type='primary'
                  htmlType='button'
                  onClick={() =>
                    onNextStep([
                      'name',
                      'secondName',
                      'surname',
                      'secondSurname',
                      'nationalidad',
                      'IDType',
                      'IDNumber',
                      'pais',
                      'departamento',
                      'ciudad',
                      'localidad',
                      'area',
                      'barrio',
                      'civilStatus',
                      'educationLevel',
                      'etnia'
                    ])
                  }
                >
                  Siguiente
                </Button>
              </div>
            </Form.Item>
          </div>

          <div className={`d-none fadeInRight ${current === 2 && 'd-block'}`}>
            {/*  <Form.Item
              label='Tipo de Muerte'
              name='deathType'
              initialValue='475c280d-67af-47b0-a8bc-de420f6ac740'
              rules={[{ required: true }]}
            >
              <SelectComponent options={l_tipo_muerte} optionPropkey='id' optionPropLabel='descripcion' />
            </Form.Item>

            <DeathInstituteFormSeccion form={form} /> */}

            <div className='fadeInRight'>
              <Divider orientation='right'> Datos Del Familiar Que Autorización la Cremación </Divider>
              <Form.Item {...layoutWrapper}>
                <Alert
                  message='Diligencie la información del familiar o persona que autoriza la cremación.'
                  type='warning'
                  showIcon
                />
              </Form.Item>

              <Form.Item label='Tipo Documento Autorizador' name='authIDType' rules={[{ required: true }]}>
                <SelectComponent options={l_tipos_documento} optionPropkey='id' optionPropLabel='descripcion' />
              </Form.Item>

              <Form.Item label='Número de Identificación' name='mauthIDNumber' rules={[{ required: true, max: 20 }]}>
                <Input allowClear type='tel' placeholder='Número de Identificación' autoComplete='off' />
              </Form.Item>

              <Form.Item label='Primer Nombre Autorizador' name='authName' rules={[{ required: true }]}>
                <Input allowClear placeholder='Primer Nombre' autoComplete='off' />
              </Form.Item>
              <Form.Item label='Segundo Nombre Autorizador' name='authSecondName'>
                <Input allowClear placeholder='Segundo Nombre' autoComplete='off' />
              </Form.Item>
              <Form.Item label='Primer Apellido Autorizador' name='authSurname' rules={[{ required: true }]}>
                <Input allowClear placeholder='Primer Apellido' autoComplete='off' />
              </Form.Item>
              <Form.Item label='Segundo Apellido Autorizador' name='authSecondSurname'>
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
            </div>
            <SolicitudInfoFormSeccion form={form} />

            <CementerioInfoFormSeccion form={form} tipoLicencia={tipoLicencia} />

            <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
              <div className='d-flex justify-content-between'>
                <Button type='dashed' htmlType='button' onClick={onPrevStep}>
                  Volver atrás
                </Button>
                <Button
                  type='primary'
                  htmlType='button'
                  onClick={() =>
                    onNextStep([
                      ...KeyFormDeathInstitute,
                      ...KeyFormSolicitudInfo,
                      ...KeyFormCementerio,
                      'deathType',
                      'authIDType',
                      'authName',
                      'authSecondName',
                      'authSurname',
                      'authSecondSurname',
                      'authParentesco',
                      'authOtherParentesco'
                    ])
                  }
                >
                  Siguiente
                </Button>
              </div>
            </Form.Item>
          </div>

          <div className={`d-none fadeInRight ${current === 3 && 'd-block'}`}>
            <MedicalSignatureFormSeccion form={form} />

            <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
              <div className='d-flex justify-content-between'>
                <Button type='dashed' htmlType='button' onClick={onPrevStep}>
                  Volver atrás
                </Button>
                <Button type='primary' htmlType='button' onClick={() => onNextStep([...KeyFormMedicalSignature])}>
                  Siguiente
                </Button>
              </div>
            </Form.Item>
          </div>

          <div className={`d-none fadeInRight ${current === 4 && 'd-block'}`}>
            <DocumentosFormSeccion tipoLicencia={tipoLicencia} tipoIndividuo='Fetal' />

            <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
              <div className='d-flex justify-content-between'>
                <Button type='dashed' htmlType='button' onClick={onPrevStep}>
                  Volver atrás
                </Button>
                <Button type='primary' htmlType='submit'>
                  Guardar
                </Button>
              </div>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};
