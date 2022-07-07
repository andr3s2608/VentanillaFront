import Form from 'antd/es/form';
import Input from 'antd/es/input';
import { dominioService, ETipoDominio, IDominio } from 'app/services/dominio.service';
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import { useStepperForm } from 'app/shared/hooks/stepper.hook';
import React, { useCallback, useEffect, useState } from 'react';
import { ApiService } from 'app/services/Apis.service';
import { authProvider } from 'app/shared/utils/authprovider.util';
import Swal from 'sweetalert2';

export const BasicaInformacion: React.FC<any> = (props) => {
  const { accountIdentifier } = authProvider.getAccount();
  const [form] = Form.useForm<any>();
  const { current, setCurrent, status, setStatus, onNextStep, onPrevStep } = useStepperForm<any>(form);
  const [l_tipos_documento, setListaTipoDocumento] = useState<IDominio[]>([]);
  const [longitudmaxima, setLongitudmaxima] = useState<number>(10);
  const [longitudminima, setLongitudminima] = useState<number>(5);
  const [tipocampo, setTipocampo] = useState<string>('[0-9]{5,10}');
  const [tipocampovalidacion, setTipocampovalidacion] = useState<any>(/[0-9]/);
  const [tipodocumento, setTipodocumento] = useState<string>('Cédula de Ciudadanía');
  const [campo, setCampo] = useState<string>('Numéricos');

  const api = new ApiService(accountIdentifier);

  const getListas = useCallback(
    async () => {
      //const resp = await dominioService.get_type(ETipoDominio['Tipo Documento']);
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

  const defaultValues = {
    identity: 1,
    identification: ''
  };
  //validacion Tipo de documento//
  const cambiodocumento = (value: any) => {
    props.form.setFieldsValue({ instNumIdent: undefined });
    const valor: string = value;
    if (valor == '1') {
      setLongitudminima(5);
      setLongitudmaxima(10);
      setTipocampo('[0-9]{5,10}');
      setTipocampovalidacion(/[0-9]/);
      setCampo('Numéricos');
      setTipodocumento('Cédula de Ciudadanía');
    } else {
      if (valor == '3') {
        setLongitudminima(10);
        setLongitudmaxima(11);
        setTipocampo('[0-9]{10,11}');
        setTipocampovalidacion(/[0-9]/);
        setCampo('Numéricos');
        setTipodocumento('Tarjeta de Identidad ');
      } else {
        if (valor == '5') {
          setLongitudminima(10);
          setLongitudmaxima(10);
          setTipocampo('[0-9-]{10,10}');
          setTipocampovalidacion(/[0-9-]/);
          setCampo('Numéricosy guion');
          setTipodocumento('NIT');
        } else {
          if (valor == '4') {
            setLongitudminima(15);
            setLongitudmaxima(15);
            setTipocampo('[0-9]{15,15}');
            setTipocampovalidacion(/[0-9]/);
            setCampo('Numéricos');
            setTipodocumento('Permiso Especial de Permanencia');
          } else {
            setLongitudminima(6);
            setLongitudmaxima(10);
            setTipocampo('[a-zA-Z0-9]{6,10}');
            setTipocampovalidacion(/[a-zA-Z0-9]/);
            setCampo('AlfaNuméricos(Numéros y letras)');
            setTipodocumento('Pasaporte y Cédula de Extranjería ');
          }
        }
      }
    }
  };

  return (
    <>
      <Form.Item label='Primer Nombre' name='name' rules={[{ required: true, max: 50 }]}>
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
      <Form.Item label='Segundo Nombre' name='secondName'>
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
      <Form.Item label='Primer Apellido' name='surname' rules={[{ required: true, max: 50 }]}>
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
      <Form.Item label='Segundo Apellido' name='secondSurname'>
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
        label='Tipo Identificación'
        initialValue={defaultValues.identity}
        name='instTipoIdent'
        rules={[{ required: true }]}
      >
        <SelectComponent
          options={l_tipos_documento}
          onChange={cambiodocumento}
          optionPropkey='id'
          optionPropLabel='descripcion'
        />
      </Form.Item>

      <Form.Item
        label='Número Identificación'
        initialValue={defaultValues.identification}
        name='instNumIdent'
        rules={[{ required: true }]}
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
                'Sección:Datos Básicos \n recuerde que para el tipo de documento:' +
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
      <Form.Item label='Teléfono Fijo' rules={[{ max: 12 }]} name='phone'>
        <Input
          allowClear
          placeholder='Telefono Fijo'
          type='text'
          autoComplete='off'
          maxLength={12}
          onKeyPress={(event) => {
            if (!/[0-9]/.test(event.key)) {
              event.preventDefault();
            }
          }}
          onPaste={(event) => {
            event.preventDefault();
          }}
        />
      </Form.Item>
      <Form.Item label='Teléfono Celular' name='phonecell' rules={[{ required: true, max: 12 }]}>
        <Input
          allowClear
          placeholder='Telefono Celular'
          type='text'
          autoComplete='off'
          maxLength={12}
          onKeyPress={(event) => {
            if (!/[0-9]/.test(event.key)) {
              event.preventDefault();
            }
          }}
          onPaste={(event) => {
            event.preventDefault();
          }}
        />
      </Form.Item>
      <Form.Item label='Correo electrónico' name='email' rules={[{ required: true, type: 'email', max: 50 }]}>
        <Input
          allowClear
          placeholder='email@example.com'
          autoComplete='off'
          onKeyPress={(event) => {
            if (!/[a-zA-Z0-9ZñÑ@._-]/.test(event.key)) {
              event.preventDefault();
            }
          }}
        />
      </Form.Item>
      <Form.Item label='Confirmar Correo Electrónico' name='confirEmail' rules={[{ required: true, type: 'email', max: 50 }]}>
        <Input
          allowClear
          placeholder='email@example.com'
          autoComplete='off'
          onKeyPress={(event) => {
            if (!/[a-zA-Z0-9ZñÑ@._-]/.test(event.key)) {
              event.preventDefault();
            }
          }}
        />
      </Form.Item>
    </>
  );
};
