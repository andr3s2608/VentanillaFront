import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form from 'antd/es/form';
import Input from 'antd/es/input';

// Componentes
import { SelectComponent } from 'app/shared/components/inputs/select.component';

// Utilidades
import { layoutWrapper } from 'app/shared/utils/form-layout.util';

// Secciones del formulario

import { AutorizacionCremacion } from './seccions/autorizacionCremacion';

// Servicios

import Divider from 'antd/es/divider';
import Alert from 'antd/es/alert';
import Radio, { RadioChangeEvent } from 'antd/es/radio';

import Swal from 'sweetalert2';

export const FamilarFetalCremacion: React.FC<any> = (props) => {
  const { tipoLicencia, objJosn, prop } = props;
  const [form] = Form.useForm<any>();

  const [sininformacion, setsininformacion] = useState<boolean>(false);
  const [longitudmaxima, setLongitudmaxima] = useState<number>(10);
  const [longitudminima, setLongitudminima] = useState<number>(5);
  const [l_tipos_documento, settipos] = useState<any>();
  const [tipocampo, setTipocampo] = useState<string>('[0-9]{4,10}');
  const [tipocampovalidacion, setTipocampovalidacion] = useState<any>(/[0-9]/);
  const [tipodocumento, setTipodocumento] = useState<string>('Cédula de Ciudadanía');
  const [campo, setCampo] = useState<string>('Numéricos');
  //#region Listados

  const getListas = useCallback(
    async () => {
      const tipos: any = localStorage.getItem('tipoid');
      const tiposjson: any = JSON.parse(tipos);
      const nuevalista = tiposjson.filter((i: { id: string }) => i.id != '7c96a4d3-a0cb-484e-a01b-93bc39c7902e');

      settipos(nuevalista);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //#endregion

  //#region Eventos formulario

  const [isOtherParentesco, setIsOtherParentesco] = useState(false);
  const onChangeParentesco = (e: RadioChangeEvent) => {
    form.resetFields(['authOtherParentesco']);
    setIsOtherParentesco(e.target.value === 'Otro');
  };
  //#endregion

  //validacion Tipo de documento//
  const cambiodocumento = (value: any) => {
    form.setFieldsValue({ mauthIDNumber: undefined });
    const valor: string = value;
    const valorupper = valor.toUpperCase();
    setsininformacion(false);

    if (valorupper == 'C087D833-3CFB-460F-AA78-E5CF2FE83F25') {
      setLongitudminima(5);
      setLongitudmaxima(15);
      setTipocampo('[a-zA-Z0-9]{5,15}');
      setTipocampovalidacion(/[a-zA-Z0-9]/);
      setTipodocumento('Sin Información');
      setCampo('AlfaNuméricos(Numéros y letras)');
      setsininformacion(true);
    } else {
      if (valorupper == '7C96A4D3-A0CB-484E-A01B-93BC39C2552E') {
        setLongitudminima(4);
        setLongitudmaxima(10);
        setTipocampo('[0-9]{4,10}');
        setTipocampovalidacion(/[0-9]/);
        setCampo('Numéricos');
        setTipodocumento('Cédula de Ciudadanía');
        prop(6, 'familiarautoriza');
      } else {
        if (valorupper == 'AC3629D8-5C87-46CE-A8E2-530B0495CBF6') {
          setLongitudminima(10);
          setLongitudmaxima(11);
          setTipocampo('[0-9]{10,11}');
          setTipocampovalidacion(/[0-9]/);
          setCampo('Numéricos');
          setTipodocumento('Tarjeta de Identidad ');
          prop(10, 'familiarautoriza');
        } else {
          if (valorupper == '2491BC4B-8A60-408F-9FD1-136213F1E4FB') {
            setLongitudminima(15);
            setLongitudmaxima(15);
            setTipocampo('[0-9]{15,15}');
            setTipocampovalidacion(/[0-9]/);
            setCampo('Numéricos');
            setTipodocumento('Permiso Especial de Permanencia');
            prop(15, 'familiarautoriza');
          } else {
            if (valorupper == 'FFE88939-06D5-486C-887C-E52D50B7F35D' || valorupper == '71F659BE-9D6B-4169-9EE2-E70BF0D65F92') {
              setLongitudminima(10);
              setLongitudmaxima(11);
              setTipocampo('[a-zA-Z0-9]{10,11}');
              setTipocampovalidacion(/[a-zA-Z0-9]/);
              setCampo('AlfaNuméricos(Numéros y letras)');
              setTipodocumento('Registro Civil de Nacimiento y Numero único de identificacíon personal');
              prop(10, 'familiarautoriza');
            } else {
              setLongitudminima(6);
              setLongitudmaxima(10);
              setTipocampo('[a-zA-Z0-9]{6,10}');
              setTipocampovalidacion(/[a-zA-Z0-9]/);
              setCampo('AlfaNuméricos(Numéros y letras)');
              setTipodocumento('Pasaporte , Cédula de Extranjería y  Tarjeta de Extranjería ');
              prop(6, 'familiarautoriza');
            }
          }
        }
      }
    }
  };

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
        <SelectComponent
          options={l_tipos_documento}
          onChange={cambiodocumento}
          optionPropkey='id'
          optionPropLabel='descripcion'
        />
      </Form.Item>

      <Form.Item label='Número de Identificación' name='mauthIDNumber' rules={[{ required: !sininformacion, max: 20 }]}>
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
                'Sección:Datos Del Familiar Que Autoriza la Cremación \n recuerde que para el tipo de documento: ' +
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

      <Form.Item label='Primer Nombre' name='authName' rules={[{ required: true, max: 50 }]}>
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
      <Form.Item label='Segundo Nombre' name='authSecondName'>
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
      <Form.Item label='Primer Apellido' name='authSurname' rules={[{ required: true, max: 50 }]}>
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
      <Form.Item label='Segundo Apellido' name='authSecondSurname'>
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
interface IAutorizaInfoProps<T> {
  objJosn: any;
  prop: any;
  tipoLicencia: any;
}
