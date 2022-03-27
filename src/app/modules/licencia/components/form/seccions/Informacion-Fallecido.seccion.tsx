import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Divider from 'antd/es/divider';
import moment from 'moment';
import { List, Card, Layout } from 'antd';

// Componentes

import { DatepickerComponent } from 'app/shared/components/inputs/datepicker.component';
import { dominioService, ETipoDominio, IDominio } from 'app/services/dominio.service';
import { SelectComponent } from 'app/shared/components/inputs/select.component';

export const InformacionFallecidoSeccion = ({ obj }: any) => {
  const [[l_paises, l_regimen, l_tipo_muerte], setListas] = useState<IDominio[][]>([]);

  const getListas = useCallback(async () => {
    const resp = await Promise.all([
      dominioService.get_type(ETipoDominio.Pais),
      dominioService.get_type(ETipoDominio.Regimen),
      dominioService.get_type(ETipoDominio['Tipo de Muerte'])
    ]);
    setListas(resp);
  }, []);

  useEffect(() => {
    getListas();
  }, []);

  const date = obj?.date !== undefined ? moment(obj?.date) : null;
  const numero = obj?.certificado;
  const primernombre = obj?.name;
  const segundonombre = obj?.secondName;
  const primerapellido = obj?.surname;
  const segundoapellido = obj?.secondSurname;
  const departamento = obj?.state;
  const municipio = obj?.city;
  const regimen = obj?.regime ?? '848c6d53-6bda-4596-a889-8fdb0292f9e4';
  const tipo = obj?.deathType ?? '475c280d-67af-47b0-a8bc-de420f6ac740';
  const id = obj?.numeroIdentificacion;

  //#endregion

  const data = [
    {
      title: 'Numero Certificado de Defuncion',
      describe: numero
    },
    {
      title: 'Fecha Defunción',
      describe: <DatepickerComponent picker='date' dateDisabledType='before' dateFormatType='default' value={date} disabled />
    },
    {
      title: 'Departamento/ Municipio Defuncion',
      describe: departamento
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
      title: 'No. Identificacion.',
      describe: id
    },
    {
      title: 'Regimen',
      describe: <SelectComponent options={l_regimen} optionPropkey='id' optionPropLabel='descripcion' value={regimen} disabled />
    },
    {
      title: 'Tipo de Muerte',
      describe: <SelectComponent options={l_tipo_muerte} optionPropkey='id' optionPropLabel='descripcion' value={tipo} disabled />
    }
  ];

  return (
    <>
      <Divider orientation='left'>Datos del fallecido</Divider>
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
  'certificatenumber',
  'date',
  'deathdepartment',
  'firstname',
  'secondname',
  'firstlastname',
  'secondlastname',
  'noidentification',
  'regimen',
  'tipomuerte'
];
