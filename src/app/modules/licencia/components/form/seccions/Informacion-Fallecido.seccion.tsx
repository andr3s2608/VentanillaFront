import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Divider from 'antd/es/divider';
import moment from 'moment';
import { List, Card, Layout, Button, Form, Modal, Table } from 'antd';
import 'app/shared/components/table/estilos.css';
// Componentes

import { DatepickerComponent } from 'app/shared/components/inputs/datepicker.component';
import { dominioService, ETipoDominio, IDominio, IMunicipio, IDepartamento } from 'app/services/dominio.service';
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import { ApiService } from 'app/services/Apis.service';
import { authProvider } from 'app/shared/utils/authprovider.util';

export const InformacionFallecidoSeccion = ({ obj }: any) => {
  const [numeroCertificado, setNumeroCertificado] = useState();
  const [defuncion, setdefuncion] = useState<string | undefined>();
  const [[l_regimen, l_tipo_muerte], setListas] = useState<[IDominio[], IDominio[]]>([[], []]);
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const getListas = useCallback(async () => {
    const dep = dominioService.get_departamentos_colombia();
    const iddepart = (await dep).filter((i) => i.idDepartamento == obj?.state);

    if (iddepart[0].descripcion !== 'BOGOTÁ D.C.') {
      const idMun: string = iddepart[0].idDepPai + '';
      const mun = dominioService.get_municipios_by_departamento(idMun);
      const idmuni = (await mun).filter((i) => i.idMunicipio == '404');

      setdefuncion(iddepart[0].descripcion + '/' + idmuni[0].descripcion);
    } else {
      setdefuncion(iddepart[0].descripcion);
    }

    const resp = await Promise.all([
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
  const regimen = obj?.regime;
  const idfallecido = obj?.IDNumber;
  const tipo = obj?.deathType ?? '475c280d-67af-47b0-a8bc-de420f6ac740';

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
      describe: defuncion
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
      describe: idfallecido
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

  const onClickViewFallecido = async (idSolicitud: string) => {
    const all = await api.getCertificado(idSolicitud);

    setNumeroCertificado(all);
    showModal();
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <>
      <Divider orientation='left'>
        <div className='contenedor'>
          datos del fallecido
          <Form.Item>
            <Button type='primary' className='ml-3 mt-1' onClick={() => onClickViewFallecido(obj?.idSolicitud)}>
              No. Certificado
            </Button>
          </Form.Item>
        </div>
        <Modal
          title={
            <p className='text-center text-dark text-uppercase mb-0 titulo'> validación número de certificado de defunción</p>
          }
          visible={isModalVisible}
          onCancel={handleCancel}
          width={1000}
          okButtonProps={{ hidden: true }}
          cancelText='Cerrar'
        >
          <div className='alert text-center text-dark'>
            # {numeroCertificado}
            {numeroCertificado !== true ? 'no es valido' : 'valido'}
          </div>
        </Modal>
      </Divider>
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
