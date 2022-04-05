import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form, { FormInstance } from 'antd/es/form';
import Input from 'antd/es/input';
import Divider from 'antd/es/divider';
import { List, Card, Layout, Button, Modal } from 'antd';

// Componentes
import { SelectComponent } from 'app/shared/components/inputs/select.component';

// Services
import { dominioService, ETipoDominio, IDominio } from 'app/services/dominio.service';
import { ApiService } from 'app/services/Apis.service';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { Console } from 'console';

export const InformacionMedicoCertificante = ({ obj }: any) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [NROIDENT, setNROIDENT] = useState();
  const [NOMBRES, setNombres] = useState();
  const [medicalSignatureIDNumber, setmedicalSignatureIDNumber] = useState();
  const [medicalSignatureName, setmedicalSignatureName] = useState();

  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
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
  const profesional = obj?.medicalSignatureProfesionalType;
  //const email = obj?.emailmedicalSignature;

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
      title: 'Tipo Profesion',
      describe: (
        <SelectComponent options={l_profesion} optionPropkey='id' optionPropLabel='descripcion' value={profesional} disabled />
      )
    }
  ];

  const onClickViewMedico = async () => {
    const all = await api.getMedico(id);
    console.log(all);
    setNombres(all);
    setNROIDENT(all);
    setmedicalSignatureIDNumber(all);
    setmedicalSignatureName(all);

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
          Datos de Quien Certifica la Muerte
          <Form.Item>
            <Button type='primary' className='ml-3 mt-2' onClick={() => onClickViewMedico()}>
              Validar Medico
            </Button>
          </Form.Item>
        </div>
        <Modal
          title={<p className='text-center text-dark text-uppercase mb-0 titulo'>validar profesional</p>}
          visible={isModalVisible}
          onCancel={handleCancel}
          width={1000}
          okButtonProps={{ hidden: true }}
          cancelText='Cerrar'
        >
          <div className='alert text-center  text-dark'>
            {NROIDENT !== medicalSignatureIDNumber || NOMBRES !== medicalSignatureName
              ? 'El profesional (' + id + ') de la salud no esta registrado'
              : 'El profesional (' + id + ') de la salud se encuentra registrado'}
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
