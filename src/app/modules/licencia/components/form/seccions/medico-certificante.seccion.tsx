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
  const [NROIDENT, setNROIDENT] = useState<string | undefined>();
  const [NOMBRES, setNOMBRES] = useState<string | undefined>();
  const [TIPO_I, setTIPO_I] = useState<string | undefined>();
  const [valor, setValor] = useState<string | undefined>();

  const [primernombre, setPrimerNombre] = useState<string>(obj?.medicalSignatureName + '');
  const [segundonombre, setSegundoNombre] = useState<string>(obj?.medicalSignatureName + '');
  const [primerapellido, setPrimerApellido] = useState<string>(obj?.medicalSignatureName + '');
  const [segundoapellido, setSegundoApellido] = useState<string>(obj?.medicalSignatureName + '');

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
  //var primernombre = obj?.medicalSignatureName;
  //const segundonombre = obj?.medicalSignatureSecondName;
  //const primerapellido = obj?.medicalSignatureSurname;
  //const segundoapellido = obj?.medicalSignatureSecondSurname;
  const profesional = obj?.medicalSignatureProfesionalType;
  //const email = obj?.emailmedicalSignature;

  const cambioPrimerNombre = (e: any) => {
    console.log(e);
    setPrimerNombre(e);
  };

  const cambioSegundoNombre = (e: any) => {
    console.log(e);
    setSegundoNombre(e);
  };

  const cambioPrimerApellido = (e: any) => {
    console.log(e);
    setPrimerApellido(e);
  };

  const cambioSegundoApellido = (e: any) => {
    console.log(e);
    setSegundoApellido(e);
  };

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
      describe: (
        <input
          type='text'
          name='primernombre'
          value={primernombre}
          disabled={true}
          onChange={(e) => cambioPrimerNombre(e.target.value)}
        />
      )
    },
    {
      title: 'Segundo Nombre',
      describe: (
        <input
          type='text'
          name='segundonombre'
          value={segundonombre}
          disabled={true}
          onChange={(e) => cambioSegundoNombre(e.target.value)}
        />
      )
    },
    {
      title: 'Primer Apellido',
      describe: (
        <input
          type='text'
          name='primerapellido'
          value={primerapellido}
          disabled={true}
          onChange={(e) => cambioPrimerApellido(e.target.value)}
        />
      )
    },
    {
      title: 'Segundo Apellido',
      describe: (
        <input
          type='text'
          name='segundoapellido'
          value={segundoapellido}
          disabled={true}
          onChange={(e) => cambioSegundoApellido(e.target.value)}
        />
      )
    },
    {
      title: 'Tipo Profesion',
      describe: (
        <SelectComponent options={l_profesion} optionPropkey='id' optionPropLabel='descripcion' value={profesional} disabled />
      )
    }
  ];

  const onClickViewMedico = async () => {
    const Oracle = await api.getMedico(id);

    if (Oracle) {
      console.log(Oracle);
      setNOMBRES(Oracle[0].NOMBRES + ' ' + Oracle[0].APELLIDOS);
      setNROIDENT(Oracle[0].NROIDENT);
      setTIPO_I(Oracle[0].TIPO_I);
      setValor('El médico registrado es válido');
    } else {
      setValor('El médico registrado es inválido');
    }
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
          {valor && (
            <>
              {valor == 'El médico registrado es válido' && (
                <>
                  <div className='col-lg-12'>
                    <p
                      id='messageMortuary'
                      className='text-center mt-4'
                      style={{ color: '#3567cc', fontSize: 15, textTransform: 'uppercase', margin: 25 }}
                    >
                      {valor}
                    </p>
                  </div>
                </>
              )}
              {valor == 'El médico registrado es inválido' && (
                <>
                  <div className='col-lg-12'>
                    <p
                      id='messageMortuary'
                      className='text-center mt-4'
                      style={{ color: 'red', fontSize: 15, textTransform: 'uppercase', margin: 25 }}
                    >
                      {valor}
                    </p>
                  </div>
                </>
              )}
              {valor == 'El médico registrado es válido' && (
                <>
                  {' '}
                  <table style={{ width: '100%', margin: 0, fontSize: 12 }}>
                    <tbody>
                      <tr style={{ textAlign: 'center', color: '#3567cc', margin: 15 }}>
                        <th>TIPO DE IDENTIFICACIÓN</th>
                        <th>NÚMERO IDENTIFICACIÓN</th>
                        <th>NOMBRE</th>
                      </tr>
                      <tr style={{ textAlign: 'center', margin: 15, textTransform: 'uppercase' }}>
                        <td>{TIPO_I}</td>
                        <td>{NROIDENT}</td>
                        <td>{NOMBRES}</td>
                      </tr>
                    </tbody>
                  </table>{' '}
                </>
              )}
            </>
          )}
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
