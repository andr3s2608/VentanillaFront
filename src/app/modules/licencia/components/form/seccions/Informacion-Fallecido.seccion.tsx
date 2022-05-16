import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Divider from 'antd/es/divider';
import moment from 'moment';
import { List, Card, Layout, Button, Form, Modal, Table } from 'antd';
import 'app/shared/components/table/estilos.css';
// Componentes
import '../../../../../../scss/antd/index.css';
import { DatepickerComponent } from 'app/shared/components/inputs/datepicker.component';
import { dominioService, ETipoDominio, IDominio, IMunicipio, IDepartamento } from 'app/services/dominio.service';
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import { ApiService } from 'app/services/Apis.service';
import { authProvider } from 'app/shared/utils/authprovider.util';

export const InformacionFallecidoSeccion = ({ obj }: any) => {
  const [[tipo_identificacion, edad, fechaNacimiento, horaFallecido, genero], setFallecido] = useState<
    [string, string, string, string, string]
  >(['', '', '', '', '']);
  const [numeroCertificado, setNumeroCertificado] = useState();
  const [defuncion, setdefuncion] = useState<string | undefined>();
  const [[l_regimen, l_tipo_muerte], setListas] = useState<[IDominio[], IDominio[]]>([[], []]);
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [valorR, setValorR] = useState<string | undefined>();
  const [NOMBRES, setNOMBRES] = useState<string | undefined>();
  const [NROIDENT, setNROIDENT] = useState<string | undefined>();

  const [SEXO, setSEXO] = useState<string | undefined>();
  const [FECHA_DEFUNCION, setFECHA_DEFUNCION] = useState<string | undefined>();
  const getListas = useCallback(async () => {
    const dep = dominioService.get_departamentos_colombia();

    const iddepart = (await dep).filter((i) => i.idDepartamento == obj?.state);

    if (iddepart[0].descripcion !== 'BOGOTÁ D.C.') {
      const idMun: string = iddepart[0].idDepartamento + '';
      const mun = (await dominioService).get_all_municipios_by_departamento(idMun);

      const idmuni = (await mun).filter((i) => i.idMunicipio == obj?.city);

      setdefuncion(iddepart[0].descripcion + '/' + idmuni[0].descripcion);
    } else {
      setdefuncion(iddepart[0].descripcion);
    }

    const inf_fallecido = await api.GetInformacionFallecido(obj?.idSolicitud);

    setFallecido([
      inf_fallecido['tipoIdentificacion'] + '',
      inf_fallecido['edadFallecido'] + '',
      inf_fallecido['fechaNacimiento'] + '',
      inf_fallecido['hora'] + '',
      inf_fallecido['idSexo'] + ''
    ]);

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
  //const regimen = obj?.regime;
  const idfallecido = obj?.IDNumber;

  const tipo = obj?.deathType;

  //#endregion

  const tipotramite: string = obj.idTramite;
  var valor = '';
  switch (tipotramite) {
    case 'a289c362-e576-4962-962b-1c208afa0273':
      valor = 'Inhumacion Indivual';

      break;
    case 'ad5ea0cb-1fa2-4933-a175-e93f2f8c0060':
      //inhumacion fetal
      valor = 'Inhumacion Fetal';

      break;
    case 'e69bda86-2572-45db-90dc-b40be14fe020':
      //cremacion individual
      valor = 'Cremacion Individual';

      break;
    case 'f4c4f874-1322-48ec-b8a8-3b0cac6fca8e':
      //cremacionfetal
      valor = 'Cremacion Fetal';

      break;
  }

  var data = [
    {
      title: 'Numero Certificado de Defuncion',
      describe: numero
    }
  ];
  if (valor == 'Inhumacion Fetal' || valor == 'Cremacion Fetal') {
    const datanueva = [
      {
        title: 'Numero Certificado de Defuncion',
        describe: numero
      },
      {
        title: 'Fecha Defunción',
        describe: <DatepickerComponent picker='date' dateDisabledType='before' dateFormatType='default' value={date} disabled />
      },
      {
        title: 'Hora de fallecimiento',
        describe: horaFallecido
      },
      {
        title: 'Tipo de Muerte',
        describe: (
          <SelectComponent options={l_tipo_muerte} optionPropkey='id' optionPropLabel='descripcion' value={tipo} disabled />
        )
      }
    ];
    data = datanueva;
  } else {
    const datanueva = [
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
        title: 'Tipo de identificación',
        describe: tipo_identificacion
      },
      {
        title: 'Edad',
        describe: edad
      },
      {
        title: 'Fecha de nacimiento',
        describe: fechaNacimiento
      },
      {
        title: 'Hora de fallecimiento',
        describe: horaFallecido
      },
      {
        title: 'Genero',
        describe: genero
      },
      {
        title: 'Tipo de Muerte',
        describe: (
          <SelectComponent options={l_tipo_muerte} optionPropkey='id' optionPropLabel='descripcion' value={tipo} disabled />
        )
      }
    ];
    data = datanueva;
  }

  const onClickViewFallecido = async (idSolicitud: string) => {
    const all = await api.getCertificado(idSolicitud);

    if (all) {
      setNumeroCertificado(all.numeroCertificado);
      setNOMBRES(all['NOMBRE20']);
      setFECHA_DEFUNCION(all['FECHA_DEFUNCION7']);
      setNROIDENT(all['NROIDENT18']);

      setSEXO(all['SEXO3']);
      setValorR('El certificado registrado es válido');
    } else {
      setValorR('El certificado registrado es inválido');
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
      <div className='container-fluid '>
        <div className='row'>
          <div className='col-lg-12 col-sm-12 col-md-12 col-xs-12'>
            <div className='d-flex justify-content-center'>
              <Form.Item>
                <Button type='primary' className='ml-3 mt-1' onClick={() => onClickViewFallecido(obj?.certificado)}>
                  No. Certificado
                </Button>
              </Form.Item>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title={<p className='text-center text-dark text-uppercase mb-0 titulo'> validación número de certificado de defunción</p>}
        visible={isModalVisible}
        onCancel={handleCancel}
        width={1000}
        okButtonProps={{ hidden: true }}
        cancelText='Cerrar'
      >
        {valorR && (
          <>
            {valorR == 'El certificado registrado es válido' && (
              <>
                <div className='col-lg-12'>
                  <p
                    id='messageMortuary'
                    className='text-center mt-4'
                    style={{ color: '#3567cc', fontSize: 15, textTransform: 'uppercase', margin: 25 }}
                  >
                    {valorR}
                  </p>
                </div>
              </>
            )}
            {valorR == 'El certificado registrado es inválido' && (
              <>
                <div className='col-lg-12'>
                  <p
                    id='messageMortuary'
                    className='text-center mt-4'
                    style={{ color: 'red', fontSize: 15, textTransform: 'uppercase', margin: 25 }}
                  >
                    {valorR}
                  </p>
                </div>
              </>
            )}
            {valorR == 'El certificado registrado es válido' && (
              <>
                <table style={{ width: '100%', margin: 0, fontSize: 12 }}>
                  <tbody>
                    <tr style={{ textAlign: 'center', color: '#3567cc', margin: 15 }}>
                      <th>NOMBRE</th>
                      <th>FECHA</th>
                      <th>NÚMERO IDENTIFICACIÓN</th>
                      <th>GENERO</th>
                    </tr>
                    <tr style={{ textAlign: 'center', margin: 15, textTransform: 'uppercase' }}>
                      <td>{NOMBRES}</td>
                      <td>{FECHA_DEFUNCION}</td>
                      <td>{NROIDENT}</td>
                      <td>{SEXO}</td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}
          </>
        )}
      </Modal>
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
