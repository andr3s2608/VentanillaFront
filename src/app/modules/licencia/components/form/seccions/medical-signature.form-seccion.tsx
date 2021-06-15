import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form, { FormInstance } from 'antd/es/form';
import Input from 'antd/es/input';
import Divider from 'antd/es/divider';

// Componentes
import { SelectComponent } from 'app/shared/components/inputs/select.component';

// Services
import { dominioService, ETipoDominio, IDominio } from 'app/services/dominio.service';

export const MedicalSignatureFormSeccion: React.FC<IMedicalSignatureProps<any>> = (props) => {
  const [l_tipo_profesional, setLTipoProfesional] = useState<IDominio[]>([]);

  //#region Cargar Listas

  const getLista = useCallback(
    async () => {
      const resp = await dominioService.get_type(ETipoDominio['Tipo de Profesional']);
      setLTipoProfesional(resp);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getLista();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //#endregion

  const onSearchDocumento = async (value: string) => {
    const resp = await dominioService.search_profesional_salud_by_documento(value);
    if (!!resp && resp.length) {
      const [profesional] = resp;
      props.form.setFieldsValue({
        medicalSignatureIDNumber: profesional.NROIDENT,
        medicalSignatureIDExpedition: profesional.SITIO_EXP_IDENT,
        medicalSignatureName: profesional.NOMBRES,
        medicalSignatureSurname: profesional.APELLIDOS
      });
    }
  };

  return (
    <>
      <Divider orientation='right'>Datos de Quien Certifica la Muerte</Divider>

      <Form.Item
        label='No. Registro / No. Doc. Identificación'
        name='medicalSignatureRegisterNumber'
        rules={[{ required: true }]}
      >
        <Input.Search
          allowClear
          type='tel'
          placeholder='No. Registro / No. Documento Identificación'
          autoComplete='off'
          onSearch={onSearchDocumento}
          enterButton
        />
      </Form.Item>
      <Form.Item label='Tipo Identificación' name='medicalSignatureIDType' initialValue={1}>
        <span className='ant-form-text'>CÉDULA DE CIUDADANÍA (CC)</span>
      </Form.Item>
      <Form.Item label='Número de Identificación' name='medicalSignatureIDNumber' rules={[{ required: true }]}>
        <Input allowClear type='tel' placeholder='Número de Identificación' autoComplete='off' />
      </Form.Item>
      <Form.Item label='Lugar de Expedición' name='medicalSignatureIDExpedition' rules={[{ required: true }]}>
        <Input allowClear placeholder='Lugar de Expedición' autoComplete='off' />
      </Form.Item>
      <Form.Item label='Primer Nombre' name='medicalSignatureName' rules={[{ required: true }]}>
        <Input allowClear placeholder='Primer Nombre' autoComplete='off' />
      </Form.Item>
      <Form.Item label='Segundo Nombre' name='medicalSignatureSecondName'>
        <Input allowClear placeholder='Segundo Nombre' autoComplete='off' />
      </Form.Item>
      <Form.Item label='Primer Apellido' name='medicalSignatureSurname' rules={[{ required: true }]}>
        <Input allowClear placeholder='Primer Apellido' autoComplete='off' />
      </Form.Item>
      <Form.Item label='Segundo Apellido' name='medicalSignatureSecondSurname'>
        <Input allowClear placeholder='Segundo Apellido' autoComplete='off' />
      </Form.Item>
      <Form.Item
        label='Tipo Profesional que Certifica la Muerte'
        name='medicalSignatureProfesionalType'
        rules={[{ required: true }]}
      >
        <SelectComponent options={l_tipo_profesional} optionPropkey='id' optionPropLabel='descripcion' />
      </Form.Item>
    </>
  );
};

export const KeysForm = [
  'medicalSignatureRegisterNumber',
  'medicalSignatureIDType',
  'medicalSignatureIDNumber',
  'medicalSignatureIDExpedition',
  'medicalSignatureName',
  'medicalSignatureSecondName',
  'medicalSignatureSurname',
  'medicalSignatureSecondSurname',
  'medicalSignatureProfesionalType'
];

interface IMedicalSignatureProps<T> {
  form: FormInstance<T>;
}
