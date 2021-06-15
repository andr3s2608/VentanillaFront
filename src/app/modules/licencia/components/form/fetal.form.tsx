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
import { dominioService, ETipoDominio, IDominio } from 'app/services/dominio.service';

const { Step } = Steps;

export const FetalForm: React.FC<ITipoLicencia> = (props) => {
  const { tipoLicencia } = props;
  const [form] = Form.useForm<any>();
  const { current, setCurrent, status, setStatus, onNextStep, onPrevStep } = useStepperForm<any>(form);

  //#region Listados

  const [[l_tipos_documento, l_nivel_educativo, l_paises, l_tipo_muerte, l_estado_civil, l_etnia], setListas] = useState<
    IDominio[][]
  >([]);

  const getListas = useCallback(
    async () => {
      const resp = await Promise.all([
        dominioService.get_type(ETipoDominio['Tipo Documento']),
        dominioService.get_type(ETipoDominio['Nivel Educativo']),
        dominioService.get_type(ETipoDominio.Pais),
        dominioService.get_type(ETipoDominio['Tipo de Muerte']),
        dominioService.get_type(ETipoDominio['Estado Civil']),
        dominioService.get_type(ETipoDominio.Etnia)
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
          <Step title='Información Adicional' description='Datos del fallecimiento, Solicitud y otros datos.' />
          <Step title='Información Certificado' description='Datos del cementerio y quien certifica la muerte.' />
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

            <Form.Item label='Radicado' name='radicado' rules={[{ required: true }]}>
              <Input allowClear placeholder='Radicado' autoComplete='off' />
            </Form.Item>

            <LugarDefuncionFormSeccion form={form} />

            <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
              <div className='d-flex justify-content-end'>
                <Button
                  type='primary'
                  htmlType='button'
                  onClick={() => onNextStep([...KeyFormGeneralInfo, ...KeyFormLugarDefuncion, 'radicado'])}
                >
                  Siguiente
                </Button>
              </div>
            </Form.Item>
          </div>

          <div className={`d-none fadeInRight ${current === 1 && 'd-block'}`}>
            <Form.Item label='Tipo Identificación' name='IDType' rules={[{ required: true }]}>
              <SelectComponent options={l_tipos_documento} optionPropkey='id' optionPropLabel='descripcion' />
            </Form.Item>
            <Form.Item label='Número de Identificación' name='IDNumber' rules={[{ required: true }]}>
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

            <Form.Item label='Nacionalidad de la Madre' name='nationalidad' rules={[{ required: true, type: 'array' }]}>
              <SelectComponent
                options={l_paises}
                mode='multiple'
                placeholder='-- Elija una o varias --'
                optionPropkey='id'
                optionPropLabel='descripcion'
              />
            </Form.Item>
            {/* TODO: [2021-06-12] Hacer la información de la madre. */}

            <Form.Item label='Estado Civil' name='civilStatus'>
              <SelectComponent options={l_estado_civil} optionPropkey='id' optionPropLabel='descripcion' />
            </Form.Item>
            <Form.Item label='Nivel Educativo' name='educationLevel'>
              <SelectComponent options={l_nivel_educativo} optionPropkey='id' optionPropLabel='descripcion' />
            </Form.Item>
            <Form.Item label='Etnia' name='etnia'>
              <SelectComponent options={l_etnia} optionPropkey='id' optionPropLabel='descripcion' />
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
            <Form.Item
              label='Tipo de Muerte'
              name='deathType'
              initialValue='475c280d-67af-47b0-a8bc-de420f6ac740'
              rules={[{ required: true }]}
            >
              <SelectComponent options={l_tipo_muerte} optionPropkey='id' optionPropLabel='descripcion' />
            </Form.Item>

            <DeathInstituteFormSeccion form={form} />
            <SolicitudInfoFormSeccion form={form} />

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
            <CementerioInfoFormSeccion form={form} tipoLicencia={tipoLicencia} />
            <MedicalSignatureFormSeccion form={form} />

            <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
              <div className='d-flex justify-content-between'>
                <Button type='dashed' htmlType='button' onClick={onPrevStep}>
                  Volver atrás
                </Button>
                <Button
                  type='primary'
                  htmlType='button'
                  onClick={() => onNextStep([...KeyFormMedicalSignature, ...KeyFormCementerio])}
                >
                  Siguiente
                </Button>
              </div>
            </Form.Item>
          </div>

          <div className={`d-none fadeInRight ${current === 4 && 'd-block'}`}>
            <DocumentosFormSeccion tipoLicencia={tipoLicencia} />

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
