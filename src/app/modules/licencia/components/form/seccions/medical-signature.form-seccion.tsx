import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form, { FormInstance } from 'antd/es/form';
import Input from 'antd/es/input';
import Divider from 'antd/es/divider';

// Componentes
import { SelectComponent } from 'app/shared/components/inputs/select.component';

// Services
import { dominioService, ETipoDominio, IDominio } from 'app/services/dominio.service';
import Swal from 'sweetalert2';

export const MedicalSignatureFormSeccion: React.FC<IMedicalSignatureProps<any>> = (props) => {
  const [[l_tipo_profesional, l_tipo_documento], setLTipoDocumento] = useState<IDominio[][]>([[], []]);
  const { obj } = props;
  const { tipoLicencia } = props;
  const [longitudmaxima, setLongitudmaxima] = useState<number>(10);
  const [longitudminima, setLongitudminima] = useState<number>(6);
  const [tipocampo, setTipocampo] = useState<string>('[0-9]{6,10}');
  const [tipodocumento, setTipodocumento] = useState<string>('Cédula de Ciudadanía');
  const [campo, setCampo] = useState<string>('Numéricos');

  //#region Cargar Listas

  const getLista = useCallback(
    async () => {
      const resp = await Promise.all([
        dominioService.get_type(ETipoDominio['Tipo de Profesional']),
        dominioService.get_type(ETipoDominio['Tipo Documento'])
      ]);
      setLTipoDocumento(resp);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getLista();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //#endregion
  //validacion Tipo de documento//
  const cambiodocumento = (value: any) => {
    const valor: string = value;
    if (valor == 'f1b570ee-f628-4438-a47f-6d7bff1f06d7' || valor == 'a4ee4462-f837-4dff-a800-5495c33ac3ce') {
      setLongitudminima(11);
      setLongitudminima(11);
      setTipocampo('[a-zA-Z0-9]{11,11}');
      setCampo('AlfaNuméricos(Numéros y letras)');
      setTipodocumento('Pasaporte y Cédula de Extranjería ');
    } else {
      setLongitudminima(6);
      setLongitudminima(10);
      setTipocampo('[0-9]{6,10}');
      setCampo('Numéricos');
      setTipodocumento('Cédula de Ciudadanía');
    }
  };
  return (
    <>
      <Divider orientation='right'>Datos de Quien Certifica la defunción - Medico</Divider>

      <Form.Item
        label='Tipo Identificación'
        name='medicalSignatureIDType'
        initialValue={obj?.medicalSignatureIDType ? obj?.medicalSignatureIDType : '7c96a4d3-a0cb-484e-a01b-93bc39c2552e'}
        rules={[{ required: true }]}
      >
        <SelectComponent
          options={l_tipo_documento.filter((i) =>
            [
              'a4ee4462-f837-4dff-a800-5495c33ac3ce',
              'f1b570ee-f628-4438-a47f-6d7bff1f06d7',
              '7c96a4d3-a0cb-484e-a01b-93bc39c2552e'
            ].includes(i.id)
          )}
          onChange={cambiodocumento}
          optionPropkey='id'
          optionPropLabel='descripcion'
        />
      </Form.Item>
      <Form.Item
        label='Número de Identificación'
        initialValue={obj?.medicalSignatureIDNumber ?? null}
        name='medicalSignatureIDNumber'
        rules={[{ required: true, max: 20 }]}
      >
        <Input
          allowClear
          type='text'
          placeholder='Número Identificación'
          autoComplete='off'
          pattern={tipocampo}
          onInvalid={() => {
            Swal.fire({
              icon: 'error',
              title: 'Datos invalidos',
              text:
                'recuerde que para el tipo de documento5:' +
                tipodocumento +
                ' solo se admiten valores ' +
                campo +
                ' de longitud entre ' +
                longitudminima +
                ' y ' +
                longitudmaxima
            });
          }}
        />
      </Form.Item>
      <Form.Item
        label='Lugar de Expedición'
        name='medicalSignatureIDExpedition'
        rules={[{ required: true }]}
        initialValue={obj?.medicalSignatureIDExpedition ?? 'COLOMBIA'}
      >
        <Input allowClear placeholder='Lugar de Expedición' autoComplete='off' />
      </Form.Item>
      <Form.Item
        label='Primer Nombre'
        initialValue={obj?.medicalSignatureName ?? null}
        name='medicalSignatureName'
        rules={[{ required: true }]}
      >
        <Input
          allowClear
          placeholder='Primer Nombre'
          autoComplete='off'
          type='text'
          pattern='[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]{3,50}'
          onInvalid={() => {
            Swal.fire({
              icon: 'error',
              title: 'Datos invalidos',
              text: 'recuerde que no puede ingresar numéros o caracteres especiales en el campo Primer nombre'
            });
          }}
        />
      </Form.Item>
      <Form.Item label='Segundo Nombre' initialValue={obj?.medicalSignatureSecondName ?? null} name='medicalSignatureSecondName'>
        <Input
          allowClear
          placeholder='Segundo Nombre'
          autoComplete='off'
          type='text'
          pattern='[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]{3,50}'
          onInvalid={() => {
            Swal.fire({
              icon: 'error',
              title: 'Datos invalidos',
              text: 'recuerde que no puede ingresar numéros o caracteres especiales en el campo Segundo nombre'
            });
          }}
        />
      </Form.Item>
      <Form.Item
        label='Primer Apellido'
        name='medicalSignatureSurname'
        initialValue={obj?.medicalSignatureSurname ?? null}
        rules={[{ required: true }]}
      >
        <Input
          allowClear
          placeholder='Primer Apellido'
          autoComplete='off'
          type='text'
          pattern='[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]{3,50}'
          onInvalid={() => {
            Swal.fire({
              icon: 'error',
              title: 'Datos invalidos',
              text: 'recuerde que no puede ingresar numéros o caracteres especiales en el campo Primer apellido'
            });
          }}
        />
      </Form.Item>
      <Form.Item
        label='Segundo Apellido'
        initialValue={obj?.medicalSignatureSecondSurname ?? null}
        name='medicalSignatureSecondSurname'
      >
        <Input
          allowClear
          placeholder='Segundo Apellido'
          autoComplete='off'
          type='text'
          pattern='[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]{3,50}'
          onInvalid={() => {
            Swal.fire({
              icon: 'error',
              title: 'Datos invalidos',
              text: 'recuerde que no puede ingresar numéros o caracteres especiales en el campo Segundo apellido'
            });
          }}
        />
      </Form.Item>
      <Form.Item
        label='Medico'
        name='medicalSignatureProfesionalType'
        initialValue={obj?.medicalSignatureProfesionalType ?? '36ee9c22-30a7-4c29-8bd1-fb508ea01780'}
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
  obj: any;
  tipoLicencia: any;
}
