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
  const { obj, prop } = props;
  const [l_paises, setl_paises] = useState<any>([]);
  const [longitudmaxima, setLongitudmaxima] = useState<number>(10);
  const [longitudminima, setLongitudminima] = useState<number>(5);
  const [tipocampo, setTipocampo] = useState<string>('[0-9]{4,10}');
  const [tipocampovalidacion, setTipocampovalidacion] = useState<any>(/[0-9]/);
  const [tipodocumento, setTipodocumento] = useState<string>('Cédula de Ciudadanía');
  const [campo, setCampo] = useState<string>('Numéricos');

  //#region Cargar Listas
  const getLista = useCallback(
    async () => {
      const tipos: any = localStorage.getItem('tipoid');
      const tiposjson: any = JSON.parse(tipos);
      const resp = await Promise.all([dominioService.get_type(ETipoDominio['Tipo de Profesional']), tiposjson]);


      const paises: any = localStorage.getItem('paises');
      const paisesjson: any = JSON.parse(paises);
      setl_paises(paisesjson);

      setLTipoDocumento(resp);
      if (obj !== undefined) {

        cambiodocumento(obj.medicalSignatureIDType)
        props.form.setFieldsValue({ medicalSignatureIDNumber: obj?.medicalSignatureIDNumber });
      }

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
    props.form.setFieldsValue({ medicalSignatureIDNumber: undefined });
    const valor: string = value;
    if (valor == 'f1b570ee-f628-4438-a47f-6d7bff1f06d7' || valor == 'a4ee4462-f837-4dff-a800-5495c33ac3ce') {
      setLongitudminima(4);
      setLongitudmaxima(16);
      setTipocampo('[a-zA-Z0-9]{4,16}');
      setTipocampovalidacion(/[a-zA-Z0-9]/);
      setCampo('AlfaNuméricos(Numéros y letras)');
      setTipodocumento('Pasaporte y Cédula de Extranjería ');
      prop(4, 'medico');
    } else {
      if (valor.toUpperCase() === 'E927B566-7B8E-4B4D-AE26-14454705CB5E') {
        setLongitudminima(4);
        setLongitudmaxima(18);
        setTipocampo('[a-zA-Z0-9]{4,18}');
        setTipocampovalidacion(/[a-zA-Z0-9]/);
        setCampo('AlfaNumérico(Numéros y letras)');
        setTipodocumento('Permiso de Protección Temporal');
        prop(4, 'medico');
      }
      else {
        if (valor.toUpperCase() === '2491BC4B-8A60-408F-9FD1-136213F1E4FB') {
          setLongitudminima(6);
          setLongitudmaxima(18);
          setTipocampo('[0-9]{6,18}');
          setTipocampovalidacion(/[0-9]/);
          setCampo('Numéricos');
          setTipodocumento('Permiso Especial de Permanencia');

          prop(6, 'medico');
        }
        else {
          setLongitudminima(4);
          setLongitudmaxima(10);
          setTipocampo('[0-9]{4,10}');
          setTipocampovalidacion(/[0-9]/);
          setCampo('Numéricos');
          setTipodocumento('Cédula de Ciudadanía');
          prop(4, 'medico');
        }

      }

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
              '7c96a4d3-a0cb-484e-a01b-93bc39c2552e',
              'e927b566-7b8e-4b4d-ae26-14454705cb5e',
              '2491bc4b-8a60-408f-9fd1-136213f1e4fb'
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
          maxLength={longitudmaxima}
          onKeyPress={(event) => {
            if (!tipocampovalidacion.test(event.key)) {
              event.preventDefault();
            }
          }}
          onPaste={(event) => {
            event.preventDefault();
          }}
          onInvalid={() => {
            Swal.fire({
              icon: 'error',
              title: 'Datos inválidos',
              text:
                'Sección:Datos de Quien Certifica la defunción - Medico \n recuerde que para el tipo de documento: ' +
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
        initialValue={obj?.medicalSignatureIDExpedition ?? '1e05f64f-5e41-4252-862c-5505dbc3931c'}
      >
        <SelectComponent
          style={{ width: '90%' }}
          options={l_paises}
          placeholder='-- Elija una nacionalidad --'
          optionPropkey='id'
          optionPropLabel='descripcion'
        />

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
          onKeyPress={(event) => {
            if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ ]/.test(event.key)) {
              event.preventDefault();
            }
          }}
          onPaste={(event) => {
            event.preventDefault();
          }}
        />
      </Form.Item>
      <Form.Item label='Segundo Nombre' initialValue={obj?.medicalSignatureSecondName ?? null} name='medicalSignatureSecondName'>
        <Input
          allowClear
          placeholder='Segundo Nombre'
          autoComplete='off'
          type='text'
          onKeyPress={(event) => {
            if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ ]/.test(event.key)) {
              event.preventDefault();
            }
          }}
          onPaste={(event) => {
            event.preventDefault();
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
          onKeyPress={(event) => {
            if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ ]/.test(event.key)) {
              event.preventDefault();
            }
          }}
          onPaste={(event) => {
            event.preventDefault();
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
          onKeyPress={(event) => {
            if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ ]/.test(event.key)) {
              event.preventDefault();
            }
          }}
          onPaste={(event) => {
            event.preventDefault();
          }}
        />
      </Form.Item>
      <Form.Item
        label='Médico'
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
  prop: any;
}
