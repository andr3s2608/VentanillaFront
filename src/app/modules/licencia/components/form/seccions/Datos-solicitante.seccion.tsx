import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Divider from 'antd/es/divider';
import moment from 'moment';
import { List, Card, Layout } from 'antd';

// Componentes

import { dominioService, ETipoDominio, IDominio, IDepartamento, ICementerio, IMunicipio } from 'app/services/dominio.service';
import { SelectComponent } from 'app/shared/components/inputs/select.component';

export const InformacionSolicitanteSeccion = ({ obj }: any) => {
  const [[l_paises, l_departamento, l_cementerios, l_tipo_identificacion], setListas] = useState<
    [IDominio[], IDepartamento[], ICementerio[], IDominio[]]
  >([[], [], [], []]);

  const getListas = useCallback(async () => {
    const resp = await Promise.all([
      dominioService.get_type(ETipoDominio.Pais),
      dominioService.get_departamentos_colombia(),
      dominioService.get_cementerios_bogota(),
      dominioService.get_type(ETipoDominio['Tipo Documento'])
    ]);
    setListas(resp);
  }, []);

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tipoid = obj?.IDType ? obj?.IDType : '7c96a4d3-a0cb-484e-a01b-93bc39c2552e';
  const primernombre = obj?.name;
  const segundonombre = obj?.secondName;
  const primerapellido = obj?.surname;
  const segundoapellido = obj?.secondSurname;

  const municipio = obj?.city;
  const departamento = obj?.state;
  const pais = obj?.cementerioPais ? obj?.cementerioPais : '1e05f64f-5e41-4252-862c-5505dbc3931c';
  const id = obj?.IDNumber;
  const email = obj?.Email;
  const lugarcementerio = obj?.lugarCementerio;
  const cementerio = obj?.cementerio;
  const emailcementerio = obj?.emailcementerio;

  //#endregion

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
    }
  ];

  const cementerios = [
    {
      title: 'Lugar Cementerio.',
      describe: lugarcementerio
    },
    {
      title: 'Cementerio',
      describe: cementerio
    },
    {
      title: 'Email Cementerio',
      describe: emailcementerio
    },
    {
      title: 'País cementerio',
      describe: (
        <SelectComponent options={l_paises} optionPropkey='idDepartamento' optionPropLabel='descripcion' value={pais} disabled />
      )
    },
    {
      title: 'Departamento Cementerio',
      describe: (
        <SelectComponent
          options={l_departamento}
          optionPropkey='idDepartamento'
          optionPropLabel='descripcion'
          value={departamento}
          disabled
        />
      )
    },
    {
      title: 'Municipio Cementerio',
      describe: municipio
    }
  ];

  const funerarias = [
    {
      title: 'Lugar funeraria.',
      describe: lugarcementerio
    },
    {
      title: 'Funeraria',
      describe: cementerio
    },
    {
      title: 'Email funeraria',
      describe: emailcementerio
    },
    {
      title: 'País funeraria',
      describe: (
        <SelectComponent options={l_paises} optionPropkey='idDepartamento' optionPropLabel='descripcion' value={pais} disabled />
      )
    },
    {
      title: 'Departamento funeraria',
      describe: (
        <SelectComponent
          options={l_departamento}
          optionPropkey='idDepartamento'
          optionPropLabel='descripcion'
          value={departamento}
          disabled
        />
      )
    },
    {
      title: 'Municipio funeraria',
      describe: municipio
    }
  ];

  return (
    <>
      <Divider orientation='left'>Datos del Solicitante</Divider>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta title={item.title} description={item.describe} />
          </List.Item>
        )}
      />
      <Divider orientation='left'>Datos del Cementerio</Divider>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={cementerios}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta title={item.title} description={item.describe} />
          </List.Item>
        )}
      />
      <Divider orientation='left'>Datos de la Funeraria</Divider>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={funerarias}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta title={item.title} description={item.describe} />
          </List.Item>
        )}
      />
    </>
  );
};
export const KeysForm = ['certificatenumber'];
