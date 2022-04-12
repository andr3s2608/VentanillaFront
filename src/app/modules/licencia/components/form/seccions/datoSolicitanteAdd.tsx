import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form, { FormInstance } from 'antd/es/form';
import Input from 'antd/es/input';

// Servicios
import { dominioService, ETipoDominio, IDominio } from 'app/services/dominio.service';
import { TypeLicencia } from 'app/shared/utils/types.util';
import moment from 'moment';
import { SelectComponent } from 'app/shared/components/inputs/select.component';

export const DatoSolicitanteAdd: React.FC<any> = (props: any) => {
  const [[l_tipo_profesional, l_tipo_documento], setLTipoDocumento] = useState<IDominio[][]>([[], []]);

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

  useEffect(() => {
    getLista();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Form.Item label='Tipo documento' initialValue={null} required={true} name='fiscalia'>
        <SelectComponent
          options={l_tipo_documento.filter((i) =>
            [
              'a4ee4462-f837-4dff-a800-5495c33ac3ce',
              'f1b570ee-f628-4438-a47f-6d7bff1f06d7',
              '7c96a4d3-a0cb-484e-a01b-93bc39c2552e',
              '97f5657d-d8ec-48ef-bbe3-1babefecb1a4',
              '60518653-70b7-42ab-8622-caa27b496184',
              'ffe88939-06d5-486c-887c-e52d50b7f35d',
              'a7a1b90b-8f29-4509-8220-a95f567e6fcb',
              '0d69523b-4676-4e3d-8a3d-c6800a3acf3e',
              '2491bc4b-8a60-408f-9fd1-136213f1e4fb',
              '71f659be-9d6b-4169-9ee2-e70bf0d65f92',
              'c532c358-56ae-4f93-8b9b-344ddf1256b7',
              '0676c046-d93a-4551-a37e-72e3a653bd1b',
              'ac3629d8-5c87-46ce-a8e2-530b0495cbf6',
              'c087d833-3cfb-460f-aa78-e5cf2fe83f25'
            ].includes(i.id)
          )}
          optionPropkey='id'
          optionPropLabel='descripcion'
        />
      </Form.Item>

      <Form.Item label='Numero documento' initialValue={null} required={true} name='ndoc'>
        <Input allowClear placeholder='Numero documento' autoComplete='off' />
      </Form.Item>

      <Form.Item label='Nombres' initialValue={null} required={true} name='namesolicitudadd'>
        <Input allowClear placeholder='Nombres' autoComplete='off' />
      </Form.Item>

      <Form.Item label='Apellidos' initialValue={null} required={true} name='lastnamesolicitudadd'>
        <Input allowClear placeholder='Apellidos' autoComplete='off' />
      </Form.Item>
      <Form.Item label='Email' initialValue={null} required={true} name='emailsolicitudadd'>
        <Input allowClear placeholder='Email' autoComplete='off' onChange={(e) => cambioemail(e.target.value)} id='emailsol' />
      </Form.Item>
    </>
  );
};
interface ISolicitudInfoProps<T> {
  obj: any;
  prop: any;
}
