import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form, { FormInstance } from 'antd/es/form';
import Input from 'antd/es/input';
import Divider from 'antd/es/divider';
import { List, Card, Layout } from 'antd';

// Componentes
import { SelectComponent } from 'app/shared/components/inputs/select.component';

// Services
import { dominioService, ETipoDominio, IDominio } from 'app/services/dominio.service';

export const InformacionMedicoCertificante = ({ obj }: any) => {
  const [[l_tipo_identificacion, l_profesion], setListas] = useState<IDominio[][]>([]);

  const getListas = useCallback(async () => {
    const resp = await Promise.all([
      dominioService.get_type(ETipoDominio['Tipo Documento']),
      dominioService.get_type(ETipoDominio['Tipo de Profesional'])
    ]);
    setListas(resp);
  }, []);

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  const tipoid = obj?.medicalSignatureIDType;
  const id = obj?.medicalSignatureIDNumber;
  const primernombre = obj?.medicalSignatureName;
  const segundonombre = obj?.medicalSignatureSecondName;
  const primerapellido = obj?.medicalSignatureSurname;
  const segundoapellido = obj?.medicalSignatureSecondSurname;
  const profesional = obj?.medicalSignatureProfesionalType ?? '36ee9c22-30a7-4c29-8bd1-fb508ea01780';
  const email = obj?.emailmedicalSignature;

  const data = [
    {
      title: 'Tipo de Identificación',
      describe: (
        <SelectComponent
          options={l_tipo_identificacion}
          optionPropkey='id'
          optionPropLabel='descripcion'
          value={tipoid}
          disabled
        />
      )
    },
    {
      title: 'Numero de Identificación',
      describe: id
    },
    {
      title: 'Primer Nombre',
      describe: primernombre
    },
    {
      title: 'Segundo Nombre',
      describe: segundonombre
    },
    {
      title: 'Primer Apellido',
      describe: primerapellido
    },
    {
      title: 'Segundo Apellido',
      describe: segundoapellido
    },
    {
      title: 'Email',
      describe: email
    },
    {
      title: 'Tipo Profesion',
      describe: (
        <SelectComponent options={l_profesion} optionPropkey='id' optionPropLabel='descripcion' value={profesional} disabled />
      )
    }
  ];

  return (
    <>
      <Divider orientation='left'>Datos de Quien Certifica la Muerte</Divider>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta title={item.title} description={item.describe} />
          </List.Item>
        )}
      />
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
