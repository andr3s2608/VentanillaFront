import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Divider from 'antd/es/divider';
import moment from 'moment';
import { List, Button, Form, Modal, Table } from 'antd';
import 'app/shared/components/table/estilos.css';
// Componentes

import { DatepickerComponent } from 'app/shared/components/inputs/datepicker.component';
import { dominioService, ETipoDominio, IDominio, IMunicipio, IDepartamento } from 'app/services/dominio.service';
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import { ApiService } from 'app/services/Apis.service';
import { authProvider } from 'app/shared/utils/authprovider.util';

import '../../../../../../../scss/antd/index.css';
import '../../../../../../../css/estilos.css';
import Swal from 'sweetalert2';

export const InformacionFallecidoSeccion = ({ obj }: any) => {
  const [[tipo_identificacion, edad, fechaNacimiento, horaFallecido, genero], setFallecido] = useState<
    [string, string, string, string, string]
  >(['', '', '', '', '']);

  const [[primernombre, segundonombre, primerapellido, segundoapellido], setNombres] = useState<[string, string, string, string]>(
    ['', '', '', '']
  );
  const [numeroCertificado, setNumeroCertificado] = useState();

  const [defuncion, setdefuncion] = useState<string | undefined>();
  const [esmadre, setesmadre] = useState<boolean>(false);
  const [ciudadmadre, setciudadmadre] = useState<string | undefined>();
  const [departamentomadre, setdepartamentomadre] = useState<string | undefined>();
  const [paismadre, setpaismadre] = useState<string | undefined>();
  const [nacionalidad, setnacionalidad] = useState<string | undefined>();
  const [l_tipo_muerte, setListas] = useState<IDominio[]>([]);
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalfallecidoVisible, setisModalfallecidoVisible] = useState(false);
  const [valorR, setValorR] = useState<string | undefined>();
  const [NOMBRES, setNOMBRES] = useState<string | undefined>();
  const [NROIDENT, setNROIDENT] = useState<string | undefined>();

  const [SEXO, setSEXO] = useState<string | undefined>();
  const [FECHA_DEFUNCION, setFECHA_DEFUNCION] = useState<string | undefined>();

  //// numero de id duplicados
  const [l_fallecidos, setl_fallecidos] = useState<any>([]);

  const getListas = useCallback(async () => {
    const dep = dominioService.get_departamentos_colombia();

    const paises: any = localStorage.getItem('paises');
    const paisesjson: any = JSON.parse(paises);

    const filtropais = paisesjson.filter((i: { id: any }) => i.id == obj?.country);

    const iddepart = (await dep).filter((i) => i.idDepartamento == obj?.state);

    if (iddepart[0].descripcion !== 'BOGOTÁ D.C.') {
      const idMun: string = iddepart[0].idDepartamento + '';
      const mun = (await dominioService).get_all_municipios_by_departamento(idMun);

      const idmuni = (await mun).filter((i) => i.idMunicipio == obj?.city);

      setdefuncion(filtropais[0].descripcion + '/' + iddepart[0].descripcion + '/' + idmuni[0].descripcion);
    } else {
      setdefuncion(filtropais[0].descripcion + '/' + iddepart[0].descripcion);
    }

    if (obj?.idDepartamentoResidencia == undefined) {
      const filtronacionalidad = paisesjson.filter((i: { id: any }) => i.id == obj?.nationalidad);

      setnacionalidad(filtronacionalidad[0].descripcion);
    }
    setNombres([obj.name, obj.secondName, obj.surname, obj.secondSurname]);
    if (obj?.idDepartamentoResidencia != undefined) {
      const filtropaismadre = paisesjson.filter((i: { id: any }) => i.id == obj?.residencia);

      if (obj.residencia == '1e05f64f-5e41-4252-862c-5505dbc3931c') {
        const iddepartmadre = (await dep).filter((i) => i.idDepartamento == obj?.idDepartamentoResidencia);
        const { idDepartamento } = iddepartmadre[0];
        const resp = await dominioService.get_all_municipios_by_departamento(idDepartamento);

        const idmunimadre = (await resp).filter((i) => i.idMunicipio == obj?.idCiudadResidencia);

        setNombres([obj.namemother, obj.secondNamemother, obj.surnamemother, obj.secondSurnamemother]);
        setpaismadre('Colombia');
        setnacionalidad('Colombia');
        setdepartamentomadre(iddepartmadre[0].descripcion.toLowerCase());
        setciudadmadre(idmunimadre[0].descripcion.toLowerCase());
        setesmadre(true);
      } else {
        setpaismadre(filtropais[0].descripcion.toLowerCase());
        setnacionalidad(filtropais[0].descripcion.toLowerCase());
        setdepartamentomadre('Fuera del País');
        setciudadmadre('Fuera del País');
        setesmadre(true);
      }
    }

    const inf_fallecido = await api.GetInformacionFallecido(obj?.idSolicitud);
    const fecharecortada: string = inf_fallecido['fechaNacimiento'];
    setFallecido([
      inf_fallecido['tipoIdentificacion'] + '',
      inf_fallecido['edadFallecido'] + '',
      fecharecortada.substring(0, 10) + '',
      inf_fallecido['hora'] + '',
      inf_fallecido['idSexo'] + ''
    ]);

    /*
    if (obj.tipopersona == '01f64f02-373b-49d4-8cb1-cb677f74292c') {
      const fallecidosduplicados = await api.GetDuplicadosFallecido(obj.idControlTramite, obj.IDNumber);

      if (fallecidosduplicados.length > 0) {
        Swal.fire({
          icon: 'info',

          title: 'Número de identificación Repetido',
          text: `El número de identificación se encuentra registrado también en otras solicitudes,para mas
           información presione el botón "  Validar No. Identificación"`
        });
      }
      setl_fallecidos(fallecidosduplicados);
    }
    */

    const resp = await dominioService.get_type(ETipoDominio['Tipo de Muerte']);
    setListas(resp);
  }, []);

  useEffect(() => {
    getListas();
  }, []);

  const date = obj?.date !== undefined ? moment(obj?.date) : null;
  const numero = obj?.certificado;

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

  //madre

  var datamadre = [
    {
      title: 'Primer Nombre',
      describe: primernombre?.toLowerCase()
    },
    {
      title: 'Segundo Nombre',
      describe: segundonombre?.toLowerCase()
    },
    {
      title: 'Primer Apellido',
      describe: primerapellido?.toLowerCase()
    },
    {
      title: 'Segundo Apellido',
      describe: segundoapellido?.toLowerCase()
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
      title: 'Pais de Residencia',
      describe: paismadre?.toLowerCase()
    },
    {
      title: 'Departamento de Residencia',
      describe: departamentomadre?.toLowerCase()
    },
    {
      title: 'Ciudad de Residencia',
      describe: ciudadmadre?.toLowerCase()
    }
  ];

  //fallecido o feto
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
      },
      {
        title: 'Genero',
        describe: genero
      },

      {
        title: 'Nacionalidad',
        describe: nacionalidad?.toLowerCase()
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
        title: 'País/Departamento/ Municipio Defuncion',
        describe: defuncion?.toLowerCase()
      },
      {
        title: 'Primer Nombre',
        describe: primernombre?.toLowerCase()
      },
      {
        title: 'Segundo Nombre',
        describe: segundonombre?.toLowerCase()
      },
      {
        title: 'Primer Apellido',
        describe: primerapellido?.toLowerCase()
      },
      {
        title: 'Segundo Apellido',
        describe: segundoapellido?.toLowerCase()
      },
      {
        title: 'Tipo de identificación',
        describe: tipo_identificacion
      },
      {
        title: 'No. Identificacion.',
        describe: idfallecido
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
        describe: genero?.toLowerCase()
      },

      {
        title: 'Nacionalidad',
        describe: nacionalidad?.toLowerCase()
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

  const tabla2 = [
    {
      title: 'Nro tramite. ',
      dataIndex: 'iD_Control_Tramite',
      key: 'tramite'
    },
    {
      title: 'Fecha Solicitud. ',
      dataIndex: 'fechaSolicitud',
      key: 'fechaSolicitud'
    },
    {
      title: 'Primer Nombre',
      dataIndex: 'primerNombre',
      key: 'primerNombre'
    },
    {
      title: 'Segundo Nombre',
      dataIndex: 'segundoNombre',
      key: 'segundoNombre'
    },
    {
      title: 'Primer Apellido',
      dataIndex: 'primerApellido',
      key: 'primerApellido'
    },
    {
      title: 'Segundo Apellido',
      dataIndex: 'segundoApellido',
      key: 'primerNombre'
    }
  ];

  const onClickViewFallecido = async (idSolicitud: string) => {
    const all = await api.getCertificado(idSolicitud);

    if (all) {
      setNumeroCertificado(all.numeroCertificado);
      setNOMBRES(all['NOMBRE20']);
      const fecha: string = all['FECHA_DEFUNCION7'];
      setFECHA_DEFUNCION(fecha.substring(0, 10));
      setNROIDENT(all['NROIDENT18']);

      setSEXO(all['SEXO3']);
      setValorR('El certificado registrado es válido');
    } else {
      setValorR('El certificado registrado es inválido');
    }

    showModal();
  };

  const onClickViewFallecidoDuplicado = async () => {
    setisModalfallecidoVisible(true);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setisModalfallecidoVisible(false);
  };
  return (
    <>
      <div className='ant-container d-flex justify-content-center w-100'>
        <div className='ant-row text-center'>
          <div className='ant-col-12 ant-col-md-12 ant-col-lg-12 ant-col-ant-col-sm-12'>
            <Divider orientation='left'>
              <div className='contenedor'>
                datos del fallecido
                <Form.Item>
                  <Button type='primary' className='ml-3 mt-1' onClick={() => onClickViewFallecido(obj?.certificado)}>
                    Validar No. Certificado
                  </Button>
                </Form.Item>
                {l_fallecidos.length > 0 && (
                  <>
                    <Form.Item>
                      <Button type='primary' className='ml-3 mt-1' onClick={() => onClickViewFallecidoDuplicado()}>
                        Validar No. Identificación
                      </Button>
                    </Form.Item>
                  </>
                )}
              </div>

              <Modal
                title={
                  <p className='text-center text-dark text-uppercase mb-0 titulo'>
                    {' '}
                    validación número de certificado de defunción
                  </p>
                }
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

              <Modal
                title={<p className='text-center text-dark text-uppercase mb-0 titulo'> validación número de identificación</p>}
                visible={isModalfallecidoVisible}
                onCancel={handleCancel}
                width={1000}
                okButtonProps={{ hidden: true }}
                cancelText='Cerrar'
              >
                <Table
                  id='tableGen2'
                  dataSource={l_fallecidos}
                  columns={tabla2}
                  pagination={{ pageSize: 10 }}
                  className='table_info'
                />
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
      {esmadre && (
        <>
          <div className='ant-container d-flex justify-content-center w-100'>
            <div className='ant-row text-center'>
              <div className='ant-col-12 ant-col-md-12 ant-col-lg-12 ant-col-ant-col-sm-12'>
                <Divider orientation='left'>
                  <div className='contenedor'>Datos de la Madre</div>
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
            dataSource={datamadre}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta title={item.title} description={item.describe} />
              </List.Item>
            )}
          />
        </>
      )}
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
