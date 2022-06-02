import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form, { FormInstance } from 'antd/es/form';

import Divider from 'antd/es/divider';
import { List, Card, Layout, Button, Modal } from 'antd';

// Componentes
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import '../../../../../../scss/antd/index.css';
// Services
import { dominioService, ETipoDominio, IDominio } from 'app/services/dominio.service';
import { ApiService } from 'app/services/Apis.service';
import { authProvider } from 'app/shared/utils/authprovider.util';

export const InformacionMedicoCertificante = (props: any) => {
  const { obj } = props;
  const [banderaBotonActualizarMedico, setMedico] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [NROIDENT, setNROIDENT] = useState<string | undefined>();
  const [NOMBRES, setNOMBRES] = useState<string | undefined>();
  const [TIPO_I, setTIPO_I] = useState<string | undefined>();
  const [valor, setValor] = useState<string | undefined>();

  const [primernombre, setPrimerNombre] = useState<string>(obj?.medicalSignatureName + '');
  const [segundonombre, setSegundoNombre] = useState<string>(obj?.medicalSignatureSecondName + '');
  const [primerapellido, setPrimerApellido] = useState<string>(obj?.medicalSignatureSurname + '');
  const [segundoapellido, setSegundoApellido] = useState<string>(obj?.medicalSignatureSecondSurname + '');
  const [numeroIdentificacion, setNumeroIdentificacion] = useState<string>(obj?.medicalSignatureIDNumber + '');
  const [numeroIdentificacionAux, setNumeroIdentificacionAux] = useState<string>(obj?.medicalSignatureIDNumber + '');

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

  const profesional = obj?.medicalSignatureProfesionalType;

  const cambioPrimerNombre = (e: any) => {
    setPrimerNombre(e);
    setMedico(true);
  };

  const cambioSegundoNombre = (e: any) => {
    setSegundoNombre(e);
    setMedico(true);
  };

  const cambioPrimerApellido = (e: any) => {
    setPrimerApellido(e);
    setMedico(true);
  };

  const cambioSegundoApellido = (e: any) => {
    setSegundoApellido(e);
    setMedico(true);
  };

  const cambioNumeroIdentificacion = (e: any) => {
    setNumeroIdentificacion(e);
    setMedico(true);
  };

  const botonActualizar = (bandera: boolean) => {
    switch (bandera) {
      case true:
        return (
          <Button type='primary' className='ml-3 mt-2' onClick={() => actualizarMedico()}>
            Actualizar médico
          </Button>
        );
        break;
      default:
        return <></>;
        break;
    }
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
      describe: (
        <input
          type='text'
          className='form-control'
          name='numeroIdentificacion'
          value={numeroIdentificacion}
          disabled={props.disabledField}
          onChange={(e) => cambioNumeroIdentificacion(e.target.value)}
        />
      )
    },
    {
      title: 'Primer Nombre',
      describe: (
        <input
          type='text'
          className='form-control'
          name='primernombre'
          value={primernombre}
          disabled={props.disabledField}
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
          className='form-control'
          value={segundonombre}
          disabled={props.disabledField}
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
          className='form-control'
          value={primerapellido}
          disabled={props.disabledField}
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
          className='form-control'
          value={segundoapellido}
          disabled={props.disabledField}
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
      setNOMBRES(Oracle[0].NOMBRES + ' ' + Oracle[0].APELLIDOS);
      setNROIDENT(Oracle[0].NROIDENT);
      setTIPO_I(Oracle[0].TIPO_I);
      setValor('El médico registrado es válido');
    } else {
      setValor('El médico registrado es inválido');
    }
    showModal();
  };

  const actualizarMedico = async () => {
    const result1 = await api.actualizarMedico(numeroIdentificacionAux, 'primerNombre', primernombre);
    const result2 = await api.actualizarMedico(numeroIdentificacionAux, 'segundoNombre', segundonombre);
    const result3 = await api.actualizarMedico(numeroIdentificacionAux, 'primerApellido', primerapellido);
    const result4 = await api.actualizarMedico(numeroIdentificacionAux, 'segundoApellido', segundoapellido);
    const result5 = await api.actualizarMedico(numeroIdentificacionAux, 'numeroIdentificacion', numeroIdentificacion);
    setMedico(false);
    setNumeroIdentificacionAux(numeroIdentificacion);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <>
      <div className='ant-container d-flex justify-content-center w-100'>
        <div className='ant-row text-center'>
          <div className='ant-col-12 ant-col-md-12 ant-col-lg-12 ant-col-ant-col-sm-12'>
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
          </div>
        </div>
      </div>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 3,
          lg: 3,
          xl: 3,
          xxl: 3
        }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta title={item.title} description={item.describe} />
          </List.Item>
        )}
      />
      {botonActualizar(banderaBotonActualizarMedico)}
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
