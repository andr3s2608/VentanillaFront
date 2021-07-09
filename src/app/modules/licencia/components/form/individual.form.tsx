import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Alert from 'antd/es/alert';
import Steps from 'antd/es/steps';
import Radio, { RadioChangeEvent } from 'antd/es/radio';
import Button from 'antd/es/button';
import Switch from 'antd/es/switch';
import Divider from 'antd/es/divider';
import InputNumber from 'antd/es/input-number';

// Componentes
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import { DatepickerComponent } from 'app/shared/components/inputs/datepicker.component';

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
import { dominioService, ETipoDominio, IDominio } from 'app/services/dominio.service';

const { Step } = Steps;

export const IndividualForm: React.FC<ITipoLicencia> = (props) => {
  const { tipoLicencia } = props;
  const [form] = Form.useForm<any>();
  const { current, setCurrent, status, setStatus, onNextStep, onPrevStep } = useStepperForm<any>(form);

  //#region Listados

  const [
    [l_paises, l_tipos_documento, l_estado_civil, l_nivel_educativo, l_etnia, l_unidad_medida_edad, l_regimen, l_tipo_muerte],
    setListas
  ] = useState<IDominio[][]>([]);

  const getListas = useCallback(
    async () => {
      const resp = await Promise.all([
        dominioService.get_type(ETipoDominio.Pais),
        dominioService.get_type(ETipoDominio['Tipo Documento']),
        dominioService.get_type(ETipoDominio['Estado Civil']),
        dominioService.get_type(ETipoDominio['Nivel Educativo']),
        dominioService.get_type(ETipoDominio.Etnia),
        dominioService.get_type(ETipoDominio['Unidad de Medida Edad']),
        dominioService.get_type(ETipoDominio.Regimen),
        dominioService.get_type(ETipoDominio['Tipo de Muerte'])
      ]);

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

  const [isCremacion, setIsCremacion] = useState(false);
  useEffect(() => {
    setIsCremacion(tipoLicencia === 'Cremación');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipoLicencia]);

  const [hasCremacionAuth, setHasCremacionAuth] = useState(true);
  const onChangeCremacionAuth = (value: boolean) => {
    form.resetFields([
      'authIDType',
      'authName',
      'authSecondName',
      'authSurname',
      'authSecondSurname',
      'authParentesco',
      'authOtherParentesco'
    ]);
    setHasCremacionAuth(value);
  };

  const [isOtherParentesco, setIsOtherParentesco] = useState(false);
  const onChangeParentesco = (e: RadioChangeEvent) => {
    form.resetFields(['authOtherParentesco']);
    setIsOtherParentesco(e.target.value === 'Otro');
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
          <Step title='Información del Fallecido' description='Datos personales e información del fallecido.' />
          <Step title='Información Solicitante' description='Datos del fallecimiento, Solicitud y otros datos.' />
          <Step title='Información Certificado' description='Datos de Quien Certifica la defunción - Medico.' />
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

            <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
              <div className='d-flex justify-content-end'>
                <Button
                  type='primary'
                  htmlType='button'
                  onClick={() => onNextStep([...KeyFormGeneralInfo, ...KeyFormDeathInstitute, ...KeyFormLugarDefuncion])}
                >
                  Siguiente
                </Button>
              </div>
            </Form.Item>
          </div>

          <div className={`d-none fadeInRight ${current === 1 && 'd-block'}`}>
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
              label='Nacionalidad'
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
            <Form.Item label='Fecha de Nacimiento' name='dateOfBirth' rules={[{ required: true }]}>
              <DatepickerComponent picker='date' dateDisabledType='before' dateFormatType='default' />
            </Form.Item>
            <Form.Item
              label='Tipo Identificación'
              name='IDType'
              initialValue='7c96a4d3-a0cb-484e-a01b-93bc39c2552e'
              rules={[{ required: true }]}
            >
              <SelectComponent options={l_tipos_documento} optionPropkey='id' optionPropLabel='descripcion' />
            </Form.Item>
            <Form.Item label='Número de Identificación' name='IDNumber' rules={[{ required: true, max: 25 }]}>
              <Input allowClear placeholder='Número de Identificación' autoComplete='off' />
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
            <Form.Item
              label={
                <>
                  <span className='text-danger mr-1'>*</span> Edad
                </>
              }
            >
              <Form.Item
                name='age'
                rules={[{ required: true, message: 'Edad es un campo obligatorio.' }]}
                style={{ display: 'inline-block', width: 'calc(50% - 6px)' }}
              >
                <InputNumber className='w-100' min={0} maxLength={3} placeholder='#' />
              </Form.Item>
              <Form.Item
                name='unitAge'
                initialValue='d8ac47ec-9713-40b0-b3a7-7957ad0ec2b5'
                rules={[{ required: true, message: 'Unidad de Medida Edad es un campo obligatorio.' }]}
                style={{ display: 'inline-block', width: 'calc(50% - 6px)', marginLeft: 12 }}
              >
                <SelectComponent
                  options={l_unidad_medida_edad}
                  placeholder='-- Unidad de Medida Edad --'
                  optionPropkey='id'
                  optionPropLabel='descripcion'
                />
              </Form.Item>
            </Form.Item>
            <Form.Item label='Régimen' name='regime' initialValue='848c6d53-6bda-4596-a889-8fdb0292f9e4'>
              <SelectComponent options={l_regimen} optionPropkey='id' optionPropLabel='descripcion' />
            </Form.Item>

            <Form.Item
              label='Tipo de Muerte'
              name='deathType'
              initialValue='475c280d-67af-47b0-a8bc-de420f6ac740'
              rules={[{ required: true }]}
            >
              <SelectComponent options={l_tipo_muerte} optionPropkey='id' optionPropLabel='descripcion' />
            </Form.Item>

            {/* TODO: [2021-06-12] Definir los roles del usuario, es solo visible para funcionarios. */}
            {false && (
              <>
                <Divider orientation='right'>Reconocido como...</Divider>

                <Form.Item label='Tipo Identificación' name='knownIDType'>
                  <SelectComponent options={l_tipos_documento} optionPropkey='id' optionPropLabel='descripcion' />
                </Form.Item>

                <Form.Item label='Número de Identificación' name='knownIDNumber'>
                  <Input allowClear type='tel' placeholder='Número de Identificación' autoComplete='off' />
                </Form.Item>

                <Form.Item label='Nombre' name='knownName'>
                  <Input allowClear placeholder='Nombres y Apellidos completos' autoComplete='off' />
                </Form.Item>
              </>
            )}

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
                      'dateOfBirth',
                      'IDType',
                      'IDNumber',
                      'civilStatus',
                      'educationLevel',
                      'etnia',
                      'age',
                      'unitAge',
                      'regime',
                      'knownIDType',
                      'knownIDNumber',
                      'knownName',
                      'deathType'
                    ])
                  }
                >
                  Siguiente
                </Button>
              </div>
            </Form.Item>
          </div>

          <div className={`d-none fadeInRight ${current === 2 && 'd-block'}`}>
            {isCremacion && (
              <>
                <Divider orientation='right'>Datos Del Familiar Que Autorización la Cremación</Divider>

                {/*   <Form.Item label='¿Tiene Autorización de Cremación?' valuePropName='checked'>
                  <Switch
                    checkedChildren='Si'
                    unCheckedChildren='No'
                    checked={hasCremacionAuth}
                    onChange={onChangeCremacionAuth}
                  />
                </Form.Item>
 */}
                {hasCremacionAuth && (
                  <div className='fadeInRight'>
                    <Form.Item {...layoutWrapper}>
                      <Alert
                        message='Diligencie la información del familiar o persona que autoriza la cremación.'
                        type='warning'
                        showIcon
                      />
                    </Form.Item>

                    <Form.Item
                      label='Tipo Documento Autorizador'
                      name='authIDType'
                      initialValue='7c96a4d3-a0cb-484e-a01b-93bc39c2552e'
                      rules={[{ required: true }]}
                    >
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
                    {isOtherParentesco && (
                      <Form.Item
                        className='fadeInRight'
                        label='Otro... ¿Cúal?'
                        name='authOtherParentesco'
                        rules={[{ required: true }]}
                      >
                        <Input allowClear placeholder='Especifique el Parentesco' autoComplete='off' />
                      </Form.Item>
                    )}
                  </div>
                )}
              </>
            )}

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
                      ...KeyFormSolicitudInfo,
                      ...KeyFormCementerio,
                      'authIDType',
                      'mauthIDNumber',
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
            <DocumentosFormSeccion tipoLicencia={tipoLicencia} tipoIndividuo='Individual' />

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
