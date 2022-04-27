import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form, { FormInstance } from 'antd/es/form';
import Input from 'antd/es/input';

// Servicios
import { dominioService, ETipoDominio, IDominio } from 'app/services/dominio.service';
import { TypeLicencia } from 'app/shared/utils/types.util';
import moment from 'moment';
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import Swal from 'sweetalert2';

export const DatoSolicitanteAdd: React.FC<any> = (props: any) => {
  const [[l_tipo_profesional, l_tipo_documento], setLTipoDocumento] = useState<IDominio[][]>([[], []]);
  const [longitudmaxima, setLongitudmaxima] = useState<number>(10);
  const [longitudminima, setLongitudminima] = useState<number>(6);
  const [tipocampo, setTipocampo] = useState<string>('[0-9]{6,10}');
  const [tipodocumento, setTipodocumento] = useState<string>('Cédula de Ciudadanía');
  const [campo, setCampo] = useState<string>('Numéricos');

  //#region Cargar Listas
  const { obj, prop } = props;
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

  let validEmail = false;
  const onChange = (value: any) => {
    prop(validEmail);
  };

  const cambioemail = (e: any) => {
    let campo = e;

    const emailRegex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    //Se muestra un texto a modo de ejemplo, luego va a ser un icono
    let corporativo = campo.includes('@hotmail.');
    if (true) {
      // Agregar que el usuario logueado SI es juridico
      if (corporativo == false) {
        corporativo = campo.includes('@gmail.');
        if (corporativo == false) {
          corporativo = campo.includes('@outlook.');
          if (corporativo == false) {
            corporativo = campo.includes('@yahoo.');
          }
        }
      }
    }

    if (emailRegex.test(campo) && !corporativo) {
      validEmail = true;

      onChange(validEmail);
    } else {
      validEmail = false;
      onChange(validEmail);
    }
  };
  //validacion Tipo de documento//
  const cambiodocumento = (value: any) => {
    const valor: string = value;
    const valorupper = valor.toUpperCase();
    if (valorupper == '7C96A4D3-A0CB-484E-A01B-93BC39C2552E') {
      setLongitudminima(6);
      setLongitudminima(10);
      setTipocampo('[0-9]{6,10}');
      setCampo('Numéricos');
      setTipodocumento('Cédula de Ciudadanía');
    } else {
      if (valorupper == 'AC3629D8-5C87-46CE-A8E2-530B0495CBF6') {
        setLongitudminima(10);
        setLongitudminima(11);
        setTipocampo('[0-9]{10,11}');
        setCampo('Numéricos');
        setTipodocumento('Tarjeta de Identidad ');
      } else {
        if (valorupper == '2491BC4B-8A60-408F-9FD1-136213F1E4FB') {
          setLongitudminima(15);
          setLongitudminima(15);
          setTipocampo('[0-9]{15,15}');
          setCampo('Numéricos');
          setTipodocumento('Permiso Especial de Permanencia');
        } else {
          if (valorupper == 'FFE88939-06D5-486C-887C-E52D50B7F35D' || valorupper == '71F659BE-9D6B-4169-9EE2-E70BF0D65F92') {
            setLongitudminima(15);
            setLongitudminima(15);
            setTipocampo('[0-9]{15,15}');
            setCampo('Numéricos');
            setTipodocumento('Registro Civil de Nacimiento y Numero único de identificacíon personal');
          } else {
            setLongitudminima(11);
            setLongitudminima(11);
            setTipocampo('[a-zA-Z0-9]{11,11}');
            setCampo('AlfaNuméricos(Numéros y letras)');
            setTipodocumento('Pasaporte , Cédula de Extranjería y  Tarjeta de Extranjería ');
          }
        }
      }
    }
  };

  useEffect(() => {
    getLista();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Form.Item label='Tipo documento' initialValue={null} required={true} name='fiscalia'>
        <SelectComponent options={l_tipo_documento} onChange={cambiodocumento} optionPropkey='id' optionPropLabel='descripcion' />
      </Form.Item>

      <Form.Item label='Numero documento' initialValue={null} required={true} name='ndoc'>
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
                'recuerde que para el tipo de documento3:' +
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

      <Form.Item label='Nombres' initialValue={null} rules={[{ required: true, max: 100 }]} name='namesolicitudadd'>
        <Input
          allowClear
          placeholder='Nombres'
          autoComplete='off'
          type='text'
          pattern='[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]{3,100}'
          onInvalid={() => {
            Swal.fire({
              icon: 'error',
              title: 'Datos invalidos',
              text: 'recuerde que no puede ingresar numéros o caracteres especiales en el campo Nombres'
            });
          }}
        />
      </Form.Item>

      <Form.Item label='Apellidos' initialValue={null} rules={[{ required: true, max: 100 }]} name='lastnamesolicitudadd'>
        <Input
          allowClear
          placeholder='Apellidos'
          autoComplete='off'
          type='text'
          pattern='[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]{3,100}'
          onInvalid={() => {
            Swal.fire({
              icon: 'error',
              title: 'Datos invalidos',
              text: 'recuerde que no puede ingresar numéros o caracteres especiales en el campo Apellidos'
            });
          }}
        />
      </Form.Item>
      <Form.Item label='Email' initialValue={null} rules={[{ required: true, type: 'email', max: 50 }]} name='emailsolicitudadd'>
        <Input
          allowClear
          placeholder='email@example.com'
          type='email'
          autoComplete='off'
          onChange={(e) => cambioemail(e.target.value)}
          id='emailsol'
        />
      </Form.Item>
    </>
  );
};
interface ISolicitudInfoProps<T> {
  obj: any;
  prop: any;
}
