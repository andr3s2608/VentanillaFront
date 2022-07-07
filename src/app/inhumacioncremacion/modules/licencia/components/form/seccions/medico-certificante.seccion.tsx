import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form, { FormInstance } from 'antd/es/form';

import Divider from 'antd/es/divider';
import { List, Card, Layout, Button, Modal } from 'antd';

// Componentes
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import '../../../../../../../scss/antd/index.css';
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
  const [FECHA_NACIMIENTO, setFECHA_NACIMIENTO] = useState<string | undefined>();
  const [NUMERO_RESOLUCION, setNUMERO_RESOLUCION] = useState<string | undefined>();
  const [FECHA_RESOLUCION, setFECHA_RESOLUCION] = useState<string | undefined>();
  const [NOMBRE_PROFESION, setNOMBRE_PROFESION] = useState<string | undefined>();
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
    const Oracle = await api.getMedico(numeroIdentificacionAux);

    if (Oracle) {
      setNOMBRES(Oracle['resultado1'][0].NOMBRES + ' ' + Oracle['resultado1'][0].APELLIDOS);
      setNROIDENT(Oracle['resultado1'][0].NROIDENT);
      setTIPO_I(Oracle['resultado1'][0].TIPO_I);
      setFECHA_NACIMIENTO(Oracle['resultado1'][0].FECHA_NACIMIENTO);
      setNUMERO_RESOLUCION(Oracle['resultado2'][0].NUMERO_RESOLUCION);
      setFECHA_RESOLUCION(Oracle['resultado2'][0].FECHA_RESOLUCION);
      setNOMBRE_PROFESION(Oracle['resultado2'][0].NOMBRE_PROFESION);
      setValor('El médico registrado es válido');
    } else {
      setValor('El médico registrado es inválido');
    }
    showModal();
  };

  const actualizarMedico = async () => {
    if (primernombre != '') {
      const result1 = await api.actualizarMedico(numeroIdentificacionAux, 'primerNombre', primernombre);
    }
    if (segundonombre != '') {
      const result2 = await api.actualizarMedico(numeroIdentificacionAux, 'segundoNombre', segundonombre);
    }
    if (primerapellido != '') {
      const result3 = await api.actualizarMedico(numeroIdentificacionAux, 'primerApellido', primerapellido);
    }
    if (segundoapellido != '') {
      const result4 = await api.actualizarMedico(numeroIdentificacionAux, 'segundoApellido', segundoapellido);
    }
    if (primernombre != '') {
      const result5 = await api.actualizarMedico(numeroIdentificacionAux, 'numeroIdentificacion', numeroIdentificacion);
    }
    setMedico(true);
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
                            {'El (La) ' + NOMBRE_PROFESION + ' se encuentra registrado (a)'}
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
                              <th>NÚMERO DE IDENTIFICACIÓN</th>
                              <th>NOMBRE</th>
                              <th>FECHA DE NACIMIENTO</th>
                              <th>NUMERO DE RESOLUCION</th>
                              <th>FECHA DE RESOLUCION</th>
                              <th>NOMBRE DE PROFESION</th>
                            </tr>
                            <tr style={{ textAlign: 'center', margin: 15, textTransform: 'uppercase' }}>
                              <td>{TIPO_I}</td>
                              <td>{NROIDENT}</td>
                              <td>{NOMBRES}</td>
                              <td>{FECHA_NACIMIENTO?.substring(0, 10)}</td>
                              <td>{NUMERO_RESOLUCION}</td>
                              <td>{FECHA_RESOLUCION?.substring(0, 10)}</td>
                              <td>{NOMBRE_PROFESION}</td>
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
