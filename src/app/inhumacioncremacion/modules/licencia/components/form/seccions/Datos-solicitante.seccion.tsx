import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Divider from 'antd/es/divider';
import { List, Button, Form, Modal, Radio, Table } from 'antd';
import 'app/shared/components/table/estilos.css';
import Swal from 'sweetalert2';
// Componentes

import { dominioService, ETipoDominio, IDominio, IDepartamento, ICementerio, IMunicipio } from 'app/services/dominio.service';
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import { ApiService } from 'app/services/Apis.service';
import { authProvider } from 'app/shared/utils/authprovider.util';

export const InformacionSolicitanteSeccion = ({ obj }: any) => {
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);

  const [NROIDENT, setNROIDENT] = useState('');
  const [RAZON_S, setRAZON_S] = useState('');
  const [valor, setValor] = useState<string | undefined>();

  const [[RazonC, DireccionC, TelefonoC, NombreRepC, TipoRepC, NroIdenC], setCementerioDatos] = useState<
    [String, string, String, String, String, String]
  >(['', '', '', '', '', '']);
  const [[TIPO_IF, NROIDENTF, RAZON_SF, DIRECCIONF, TELEFONO_1F, TIPO_I_PROPF], setFunerariaDatos1] = useState<
    [String, string, String, String, String, String]
  >(['', '', '', '', '', '']);
  const [[NROIDENT_PROPF, NOMBRE_PROPF, NUM_SALASF, TIPO_I_REPF, NROIDENT_REPF, NOMBRE_REPF], setFunerariaDatos2] = useState<
    [String, string, String, String, String, String]
  >(['', '', '', '', '', '']);
  const [[RazonF, DireccionF, TelefonoF, NombreRepF, TipoRepF, NroIdenF], setFunerariaDatos] = useState<
    [String, string, String, String, String, String]
  >(['', '', '', '', '', '']);
  const [IdOrNameGraveyard, setIdOrNameGraveyard] = useState('');
  const [IdOrNameMortuary, setIdOrNameMortuary] = useState('');
  const [isModalVisibleGraveyard, setIsModalVisibleGraveyard] = useState(false);
  const [isModalVisibleMortuary, setIsModalVisibleMortuary] = useState(false);

  const [emailsolicitante, setemailsolicitante] = useState<string | undefined>();
  const [tipoid, setipoid] = useState<string | undefined>();
  const [id, setid] = useState<string | undefined>();
  const [nombre, setnombre] = useState<string | undefined>();
  const [apellido, setapellido] = useState<string | undefined>();
  const [emailcementerio, setemailcementerio] = useState<string | undefined>();
  const [emailfuneraria, setemailfuneraria] = useState<string | undefined>();
  const [iscementerio, setiscementerio] = useState(false);
  const [isfuneraria, setisfuneraria] = useState(false);
  const [isfuera, setisfuera] = useState(false);
  const [cargofuneraria, setcargofuneraria] = useState(false);

  const [funeraria, setfuneraria] = useState<string | undefined>();
  const [l_funeraria, setl_funeraria] = useState<any>();
  const [l_cementerio, setl_cementerio] = useState<any>();

  const [nuevocementerio, setnuevocementerio] = useState<string | undefined>();
  const [nuevafuneraria, setnuevafuneraria] = useState<string | undefined>();

  const [departamentoCementerio, setdepartamentoCementerio] = useState<string | undefined>();
  const [municipioCementerio, setmunicipioCementerio] = useState<string | undefined>();
  const [PaisCementerio, setPaisCementerio] = useState<string | undefined>();
  const [otroCementerio, setotroCementerio] = useState<string | undefined>();

  const [[l_paises, l_departamento, l_tipo_identificacion], setListas] = useState<[IDominio[], IDepartamento[], IDominio[]]>([
    [],

    [],
    []
  ]);

  const getListas = useCallback(async () => {
    const resp = await Promise.all([
      dominioService.get_type(ETipoDominio.Pais),
      dominioService.get_departamentos_colombia(),
      // dominioService.get_all_municipios_by_departamento(idMunicipio),
      dominioService.get_type(ETipoDominio['Tipo Documento'])
    ]);
    const fun = await api.GetFunerarias();
    const cem = await dominioService.get_cementerios_bogota();

    //Relacionado con el solicitante
    //Se guarda toda la informacion del Solicitante
    const resumensolicitud = await api.GetResumenSolicitud(obj?.idSolicitud);
    var tipoidsolicitante: string = resumensolicitud.reduce((result: any, item: any) => {
      return `${result}${item.tipoDocumentoSolicitante}`;
    }, '');

    setipoid(tipoidsolicitante);

    var idsolicitante: string = resumensolicitud.reduce((result: any, item: any) => {
      return `${result}${item.numeroDocumentoSolicitante}`;
    }, '');
    setid(idsolicitante);

    var nombresolicitante: string = resumensolicitud.reduce((result: any, item: any) => {
      return `${result}${item.nombreSolicitante}`;
    }, '');
    setnombre(nombresolicitante);

    var apellidosolicitante: string = resumensolicitud.reduce((result: any, item: any) => {
      return `${result}${item.apellidoSolicitante}`;
    }, '');
    setapellido(apellidosolicitante);

    var correosolicitante: string = resumensolicitud.reduce((result: any, item: any) => {
      return `${result}${item.correoSolicitante}`;
    }, '');
    setemailsolicitante(correosolicitante);

    var correocementerio: string = resumensolicitud.reduce((result: any, item: any) => {
      return `${result}${item.correoCementerio}`;
    }, '');
    setemailcementerio(correocementerio);

    var correofuneraria: string = resumensolicitud.reduce((result: any, item: any) => {
      return `${result}${item.correoFuneraria}`;
    }, '');
    setemailfuneraria(correofuneraria);
    //////////////////////// Se guarda la informacion de la funeraria
    const Funerarias = await api.GetFunerariasAzure(obj?.idSolicitud);

    var funeraria = Funerarias.reduce((result: any, item: any) => {
      return `${result}${item.funeraria}`;
    }, '');

    setl_cementerio(cem);
    setl_funeraria(fun);

    const dep = dominioService.get_departamentos_colombia();

    const pais = await dominioService.get_type(ETipoDominio.Pais);
    const filtropais = pais.filter((i) => i.id == obj?.cementerioPais);

    const iddepart = (await dep).filter((i) => i.idDepartamento == obj?.cementerioDepartamento);

    if (obj?.cementerioDepartamento != undefined) {
      const idMun: string = iddepart[0].idDepartamento + '';
      const mun = (await dominioService).get_all_municipios_by_departamento(idMun);

      const idmuni = (await mun).filter((i) => i.idMunicipio == obj?.cementerioMunicipio);

      setdepartamentoCementerio(iddepart[0].descripcion);
      setmunicipioCementerio(idmuni[0].descripcion);
    }

    if (obj?.cementerioPais != undefined) {
      setPaisCementerio(filtropais[0].descripcion);
      setmunicipioCementerio(obj?.cementerioCiudad);
    }

    setotroCementerio(obj?.otro);

    /*
    var lugarfuneraria = Funerarias.reduce((result: any, item: any) => {
      return `${result}${item.funeraria}`;
    }, '');
    setlugarfuneraria(lugarfuneraria);

    var paisfuneraria = Funerarias.reduce((result: any, item: any) => {
      return `${result}${item.idPais}`;
    }, '');
    setpaisfuneraria(paisfuneraria);

    var municipiofuneraria = Funerarias.reduce((result: any, item: any) => {
      return `${result}${item.idMunicipio}`;
    }, '');
    setmunicipiofuneraria(municipiofuneraria);

    var departamentofuneraria = Funerarias.reduce((result: any, item: any) => {
      return `${result}${item.idDepartamento}`;
    }, '');
    setdepartamentofuneraria(departamentofuneraria);
*/

    if (cementerio == 'Fuera de Bogotá') {
      setisfuera(true);
    }
    setfuneraria(funeraria);
    setcargofuneraria(true);
    setListas(resp);
  }, []);

  useEffect(() => {
    getListas();
  }, []);

  const cementerio = obj?.cementerioLugar;

  //Modificar funeraria y cementerio
  const Onchangecementerio = (id: string) => {
    if (id == cementerio) {
      setiscementerio(false);
    } else {
      setnuevocementerio(id);
      setiscementerio(true);
    }
  };
  const Onchangefuneraria = (id: string) => {
    if (id == funeraria) {
      setisfuneraria(false);
    } else {
      setnuevafuneraria(id);
      setisfuneraria(true);
    }
  };
  const onClickModFuneraria = async () => {
    if (nuevafuneraria == undefined) {
      Swal.fire({
        icon: 'error',

        title: 'Datos inválidos',
        text: 'Debe Seleccionar alguna Funeraria'
      });
    } else {
      const modificar = await api.ModificarCementerio(obj.idDatosfuneraria, 'funeraria', nuevafuneraria + '');
      setisfuneraria(false);
      Swal.fire({
        icon: 'success',

        title: 'Funeraria Modificada',
        text: 'Se modificado la Funeraria exitosamente'
      });
    }
  };
  const onClickModCementerio = async () => {
    if (nuevocementerio == undefined) {
      Swal.fire({
        icon: 'error',

        title: 'Datos inválidos',
        text: 'Debe Seleccionar alguna Funeraria'
      });
    } else {
      const modificar = await api.ModificarCementerio(obj.idDatosCementerio, 'cementerio', nuevocementerio + '');
      setiscementerio(false);
      Swal.fire({
        icon: 'success',

        title: 'Funeraria Modiicada',
        text: 'Se modificado la Funeraria exitosamente'
      });
    }
  };
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
      describe: nombre?.toLowerCase()
    },
    {
      title: 'Primer Apellido',
      describe: apellido?.toLowerCase()
    },
    {
      title: 'Correo Familiar Contratante',
      describe: emailsolicitante?.toLowerCase()
    }
  ];

  var cementerios: any[] | undefined = [];
  if (PaisCementerio != undefined) {
    cementerios = [
      {
        title: 'Cementerio',
        describe: (
          <SelectComponent
            options={l_cementerio}
            optionPropkey='RAZON_S'
            onChange={Onchangecementerio}
            optionPropLabel='RAZON_S'
            disabled={isfuera}
            defaultValue={cementerio}
          />
        )
      },
      {
        title: 'Email Cementerio',
        describe: emailcementerio?.toLowerCase()
      },
      {
        title: 'Pais',
        describe: PaisCementerio?.toLowerCase()
      },
      {
        title: 'Municipio',
        describe: municipioCementerio?.toLowerCase()
      }
    ];
  } else {
    if (departamentoCementerio != undefined) {
      var otros: any = [];
      if (otroCementerio != undefined) {
        otros = [
          {
            title: 'Otro Sitio',
            describe: otroCementerio?.toLowerCase()
          }
        ];
      }
      cementerios = [
        {
          title: 'Cementerio',
          describe: (
            <SelectComponent
              options={l_cementerio}
              optionPropkey='RAZON_S'
              onChange={Onchangecementerio}
              optionPropLabel='RAZON_S'
              disabled={isfuera}
              defaultValue={cementerio}
            />
          )
        },
        {
          title: 'Email Cementerio',
          describe: emailcementerio?.toLowerCase()
        },
        {
          title: 'Departamento',
          describe: departamentoCementerio?.toLowerCase()
        },
        {
          title: 'Municipio',
          describe: municipioCementerio?.toLowerCase()
        },
        otros
      ];
    } else {
      cementerios = [
        {
          title: 'Cementerio',
          describe: (
            <SelectComponent
              options={l_cementerio}
              optionPropkey='RAZON_S'
              onChange={Onchangecementerio}
              optionPropLabel='RAZON_S'
              disabled={isfuera}
              defaultValue={cementerio}
            />
          )
        },
        {
          title: 'Email Cementerio',
          describe: emailcementerio?.toLowerCase()
        }
      ];
    }
  }

  const funerarias = [
    {
      title: 'Funeraria',
      describe: (
        <SelectComponent
          options={l_funeraria}
          optionPropkey='RAZON_S'
          defaultValue={funeraria}
          onChange={Onchangefuneraria}
          optionPropLabel='RAZON_S'
        />
      )
    },
    {
      title: 'Email funeraria',
      describe: emailfuneraria?.toLowerCase()
    }
  ];

  /**
   * Control de PopUp de validacion de cementerio y funeraria
   **/
  const showModalGraveyard = () => {
    setIsModalVisibleGraveyard(true);
    setValor('');
  };

  const handleCancelGraveyard = () => {
    setIsModalVisibleGraveyard(false);
    (document.getElementById('fieldSearchGraveyard1') as HTMLInputElement).value = '';
    (document.getElementById('fieldSearchGraveyard2') as HTMLInputElement).value = '';
  };

  const showModalMortuary = () => {
    setIsModalVisibleMortuary(true);
    setValor('');
  };

  const handleCancelMortuary = () => {
    setIsModalVisibleMortuary(false);
    (document.getElementById('fieldSearchMortuary1') as HTMLInputElement).value = '';
    (document.getElementById('fieldSearchMortuary2') as HTMLInputElement).value = '';
  };

  /**
   * Funcionalidades relacionada con cementerio
   **/
  const onClickViewCementerio = async () => {
    showModalGraveyard();
  };

  const onClickValidarcementerio = async () => {
    const all = await api.GetAllcementerios();
    const consulta = api.GetAllcementerios();
    if (IdOrNameGraveyard == 'Id') {
      const result = all.find((cementerio: any) => cementerio.NROIDENT == parseInt(NROIDENT));
      if (result) {
        const Oracle = all.filter((i: { NROIDENT: number }) => i.NROIDENT == parseInt(NROIDENT));

        setCementerioDatos([
          Oracle[0].RAZON_S + '',
          Oracle[0].DIRECCION + '',
          Oracle[0].TELEFONO_1 + '',
          Oracle[0].NOMBRE_REP + '',
          Oracle[0].TIPO_I_REP + '',
          Oracle[0].NROIDENT_REP + ''
        ]);

        setValor('El cementerio registrado es válido');
      } else {
        setValor('El cementerio registrado es inválido');
      }
    } else if (IdOrNameGraveyard == 'Name') {
      const result = all.find((cementerio: any) => cementerio.RAZON_S.toUpperCase().includes(RAZON_S.trim().toUpperCase()));
      if (result) {
        //const Oracle = (await consulta).filter((cementerio: any) => cementerio.RAZON_S == RAZON_S.trim().toUpperCase());
        let array: any[] = [];

        if (!result.isArray) {
          array.push(result);
        } else {
          array = result;
        }
        setCementerioDatos([
          array[0].RAZON_S + '',
          array[0].DIRECCION + '',
          array[0].TELEFONO_1 + '',
          array[0].NOMBRE_REP + '',
          array[0].TIPO_I_REP + '',
          array[0].NROIDENT_REP + ''
        ]);

        setValor('El cementerio registrado es válido');
      } else {
        setValor('El cementerio registrado es inválido');
      }
    }
  };

  /**
   * Funcionalidades relacionada con funeraria
   **/
  const onClickViewFuneraria = async () => {
    showModalMortuary();
  };

  const onClickValidarfuneraria = async () => {
    const all = await api.GetFunerarias();
    const consulta = await api.GetFunerarias();

    if (IdOrNameMortuary == 'Id') {
      const result = all.find((funeraria: any) => funeraria.NROIDENT == parseInt(NROIDENT));
      if (result) {
        const Oracle = all.filter((i: { NROIDENT: number }) => i.NROIDENT == parseInt(NROIDENT));

        setFunerariaDatos1([
          Oracle[0].TIPO_I + '',
          Oracle[0].NROIDENT + '',
          Oracle[0].RAZON_S + '',
          Oracle[0].DIRECCION + '',
          Oracle[0].TELEFONO_1 + '',
          Oracle[0].TIPO_I_PROP + ''
        ]);

        setFunerariaDatos2([
          Oracle[0].NROIDENT_PROP + '',
          Oracle[0].NOMBRE_PROP + '',
          Oracle[0].NUM_SALAS + '',
          Oracle[0].TIPO_I_REP + '',
          Oracle[0].NROIDENT_REP + '',
          Oracle[0].NOMBRE_REP + ''
        ]);
        setValor('La funeraria registrada es válida');
      } else {
        setValor('La funeraria registrada es inválida');
      }
    } else if (IdOrNameMortuary == 'Name') {
      const result = all.find((funeraria: any) => funeraria.RAZON_S.toUpperCase().includes(RAZON_S.trim().toUpperCase()));

      if (result) {
        // const Oracle = (await consulta).filter((funeraria: any) => funeraria.RAZON_S).includes(RAZON_S.trim().toUpperCase());
        let array: any[] = [];

        if (!result.isArray) {
          array.push(result);
        } else {
          array = result;
        }

        setFunerariaDatos1([
          array[0].TIPO_I + '',
          array[0].NROIDENT + '',
          array[0].RAZON_S + '',
          array[0].DIRECCION + '',
          array[0].TELEFONO_1 + '',
          array[0].TIPO_I_PROP + ''
        ]);

        setFunerariaDatos2([
          array[0].NROIDENT_PROP + '',
          array[0].NOMBRE_PROP + '',
          array[0].NUM_SALAS + '',
          array[0].TIPO_I_REP + '',
          array[0].NROIDENT_REP + '',
          array[0].NOMBRE_REP + ''
        ]);
        setValor('La funeraria registrada es válida');
      } else {
        setValor('La funeraria registrada es inválida');
      }
    }
  };

  /**
   * Control de tipo de busqueda de cementerio
   **/
  const changeRadioButtonGraveyard = (e: any) => {
    setIdOrNameGraveyard(e.target.value);
    if (e.target.value === 'Id') {
      (document.getElementById('fieldSearchGraveyard2') as HTMLInputElement).disabled = true;
      (document.getElementById('fieldSearchGraveyard2') as HTMLInputElement).value = '';
      (document.getElementById('fieldSearchGraveyard1') as HTMLInputElement).disabled = false;
    } else if (e.target.value === 'Name') {
      (document.getElementById('fieldSearchGraveyard1') as HTMLInputElement).disabled = true;
      (document.getElementById('fieldSearchGraveyard1') as HTMLInputElement).value = '';
      (document.getElementById('fieldSearchGraveyard2') as HTMLInputElement).disabled = false;
    }
  };

  /**
   * Control de tipo de busqueda de funeraria
   **/
  const changeRadioButtonMortuary = (e: any) => {
    setIdOrNameMortuary(e.target.value);
    if (e.target.value === 'Id') {
      (document.getElementById('fieldSearchMortuary2') as HTMLInputElement).disabled = true;
      (document.getElementById('fieldSearchMortuary2') as HTMLInputElement).value = '';
      (document.getElementById('fieldSearchMortuary1') as HTMLInputElement).disabled = false;
    } else if (e.target.value === 'Name') {
      (document.getElementById('fieldSearchMortuary1') as HTMLInputElement).disabled = true;
      (document.getElementById('fieldSearchMortuary1') as HTMLInputElement).value = '';
      (document.getElementById('fieldSearchMortuary2') as HTMLInputElement).disabled = false;
    }
  };

  return (
    <>
      <div className='ant-container d-flex justify-content-center w-100'>
        <div className='ant-row text-center'>
          <div className='ant-col-12 ant-col-md-12 ant-col-lg-12 ant-col-ant-col-sm-12'>
            <Divider orientation='left'>
              <div className='contenedor'>
                Datos de la Funeraria
                <Form.Item>
                  <Button type='primary' className='ml-3 mt-1' onClick={() => onClickViewFuneraria()}>
                    Validar Funeraria
                  </Button>
                </Form.Item>
                {isfuneraria && (
                  <>
                    <Form.Item>
                      <Button type='primary' className='ml-3 mt-1' onClick={() => onClickModFuneraria()}>
                        Modificar Funeraria
                      </Button>
                    </Form.Item>
                  </>
                )}
              </div>
            </Divider>
          </div>
        </div>
      </div>
      {cargofuneraria && (
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
          dataSource={funerarias}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta title={item.title} description={item.describe} />
            </List.Item>
          )}
        />
      )}

      <div className='ant-container d-flex justify-content-center w-100'>
        <div className='ant-row text-center'>
          <div className='ant-col-12 ant-col-md-12 ant-col-lg-12 ant-col-ant-col-sm-12'>
            <Divider orientation='left'>Datos del Solicitante</Divider>
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
      <hr />
      <div className='ant-container d-flex justify-content-center w-100'>
        <div className='ant-row text-center'>
          <div className='ant-col-12 ant-col-md-12 ant-col-lg-12 ant-col-ant-col-sm-12'>
            <Divider orientation='left'>
              <div className='row'>
                <div className='col-lg-12 col-sm-12 justify-content-center'>
                  <div className='contenedor'>
                    Datos del Cementerio
                    <Form.Item>
                      <Button type='primary' className='ml-3 mt-1' onClick={() => onClickViewCementerio()}>
                        Validar Cementerio
                      </Button>
                    </Form.Item>
                    {iscementerio && (
                      <>
                        <Form.Item>
                          <Button type='primary' className='ml-3 mt-1' onClick={() => onClickModCementerio()}>
                            Modificar Cementerio
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </div>
                </div>
              </div>
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
        dataSource={cementerios}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta title={item.title} description={item.describe} />
          </List.Item>
        )}
      />

      <Modal
        title={<p className='text-center text-dark text-uppercase mb-0 titulo'>validación Cementerio</p>}
        visible={isModalVisibleGraveyard}
        onCancel={handleCancelGraveyard}
        width={1000}
        okButtonProps={{ hidden: true }}
        cancelText='Cerrar'
      >
        <div>
          <p>Buscar por:</p>
          <Radio.Group onChange={changeRadioButtonGraveyard}>
            <Radio value='Id'>No. Identificación</Radio>
            <Radio value='Name'>Nombre del Cementerio</Radio>
          </Radio.Group>
        </div>

        <div className='row'>
          <div className='col-lg-6'>
            <label htmlFor=''>Buscar Constante No. Identificación</label>
            <input
              placeholder='Ingrese la constante de de identificación'
              type='text'
              className='form-control d-flex caja'
              id='fieldSearchGraveyard1'
              onChange={(e) => setNROIDENT(e.target.value)}
              disabled={true}
            />
          </div>
          <div className='col-lg-6'>
            <label htmlFor=''>Buscar nombre del cementerio</label>
            <input
              placeholder='Ingrese el nombre del cementerio'
              type='text'
              className='form-control d-flex caja'
              id='fieldSearchGraveyard2'
              onChange={(e) => setRAZON_S(e.target.value)}
              disabled={true}
            />
          </div>
          <div className='col-lg-12'>
            <Form.Item>
              <Button type='primary' className='mt-3 btn-block' onClick={onClickValidarcementerio}>
                Buscar cementerio
              </Button>
            </Form.Item>
          </div>
        </div>
        {valor && (
          <>
            {valor == 'El cementerio registrado es válido' && (
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
            {valor == 'El cementerio registrado es inválido' && (
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
            {valor == 'El cementerio registrado es válido' && (
              <>
                {' '}
                <table style={{ width: '100%', margin: 0, fontSize: 12 }}>
                  <tbody>
                    <tr style={{ textAlign: 'center', color: '#3567cc', margin: 15 }}>
                      <th>RAZON SOCIAL</th>
                      <th>DIRECCIÓN</th>
                      <th>TELEFONO</th>
                      <th>REPRESENTANTE LEGAL</th>
                      <th>TIPO DE IDENTIFICACIÓN</th>
                      <th>NUMERO IDENTIFICACIÓN</th>
                    </tr>
                    <tr style={{ textAlign: 'center', margin: 15, textTransform: 'uppercase' }}>
                      <td>{RazonC}</td>
                      <td>{DireccionC}</td>
                      <td>{TelefonoC}</td>
                      <td>{NombreRepC}</td>
                      <td>{TipoRepC}</td>
                      <td>{NroIdenC}</td>
                    </tr>
                  </tbody>
                </table>{' '}
              </>
            )}
          </>
        )}
      </Modal>

      <Modal
        title={<p className='text-center text-dark text-uppercase mb-0 titulo'>validación Funeraria</p>}
        visible={isModalVisibleMortuary}
        onCancel={handleCancelMortuary}
        width={1000}
        okButtonProps={{ hidden: true }}
        cancelText='Cerrar'
      >
        <div>
          <p>Buscar por:</p>
          <Radio.Group onChange={changeRadioButtonMortuary}>
            <Radio value='Id'>No. Identificación</Radio>
            <Radio value='Name'>Nombre de la funeraria</Radio>
          </Radio.Group>
        </div>

        <div className='row'>
          <div className='col-lg-6'>
            <label htmlFor=''>Buscar Constante No. Identificación</label>
            <input
              placeholder='Ingrese la constante de de identificación'
              type='text'
              className='form-control d-flex caja'
              id='fieldSearchMortuary1'
              onChange={(e) => setNROIDENT(e.target.value)}
              disabled={true}
            />
          </div>
          <div className='col-lg-6'>
            <label htmlFor=''>Buscar nombre de la funeraria</label>
            <input
              placeholder='Ingrese el nombre del cementerio'
              type='text'
              className='form-control d-flex caja'
              id='fieldSearchMortuary2'
              onChange={(e) => setRAZON_S(e.target.value)}
              disabled={true}
            />
          </div>
          <div className='col-lg-12'>
            <Form.Item>
              <Button type='primary' className='mt-3 btn-block' onClick={onClickValidarfuneraria}>
                Buscar funeraria
              </Button>
            </Form.Item>
          </div>
        </div>
        {valor && (
          <>
            {valor == 'La funeraria registrada es válida' && (
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
            {valor == 'La funeraria registrada es inválida' && (
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
            {valor == 'La funeraria registrada es válida' && (
              <>
                {' '}
                <table style={{ width: '100%', margin: 0, fontSize: 12 }}>
                  <tbody>
                    <tr style={{ textAlign: 'center', color: '#3567cc', margin: 15 }}>
                      <th>TIPO ID FUNERARIA</th>
                      <th>RAZON SOCIAL</th>
                      <th>NÚMERO ID FUNERARIA </th>
                      <th>DIRECCIÓN FUNERARIA</th>
                      <th>TELEFONO FUNERARIA</th>
                      <th>TIPO ID PROPIETARIO </th>
                    </tr>
                    <tr style={{ textAlign: 'center', margin: 15, textTransform: 'uppercase' }}>
                      <td>{TIPO_IF}</td>
                      <td>{RAZON_SF}</td>
                      <td>{NROIDENTF}</td>
                      <td>{DIRECCIONF}</td>
                      <td>{TELEFONO_1F}</td>
                      <td>{TIPO_I_PROPF}</td>
                    </tr>
                  </tbody>
                </table>{' '}
                <br />
                <br />
                <table style={{ width: '100%', margin: 0, fontSize: 12 }}>
                  <tbody>
                    <tr style={{ textAlign: 'center', color: '#3567cc', margin: 15 }}>
                      <th>NÚMERO ID PROPIETARIO</th>
                      <th>NOMBRE PROPIETARIO</th>
                      <th>NÚMERO SALAS FUNERARIA</th>
                      <th>TIPO ID _REPRESENTANTE</th>
                      <th>NÚMERO ID REPRESENTANTE</th>
                      <th>NOMBRE REPRESENTANTE</th>
                    </tr>
                    <tr style={{ textAlign: 'center', margin: 15, textTransform: 'uppercase' }}>
                      <td>{NROIDENT_PROPF}</td>
                      <td>{NOMBRE_PROPF}</td>
                      <td>{NUM_SALASF}</td>
                      <td>{TIPO_I_REPF}</td>
                      <td>{NROIDENT_REPF}</td>
                      <td>{NOMBRE_REPF}</td>
                    </tr>
                  </tbody>
                </table>{' '}
              </>
            )}
          </>
        )}
      </Modal>
    </>
  );
};
export const KeysForm = ['certificatenumber'];
/*
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
        <SelectComponent options={l_paises} optionPropkey='idPais' optionPropLabel='nombre' value={paiscementerio} disabled />
      )
    },
    {
      title: 'Departamento Cementerio',
      describe: (
        <SelectComponent
          options={l_departamento}
          optionPropkey='idDepartamento'
          optionPropLabel='descripcion'
          value={departamentocementerio}
          disabled
        />
      )
    },
    {
      title: 'Municipio Cementerio',
      describe: (
        <SelectComponent
          options={l_municipios}
          optionPropkey='idMunicipio'
          optionPropLabel='descripcion'
          value={municipiocementerio}
          disabled
        />
      )
    }
  ];

  const funerarias = [
    {
      title: 'Lugar funeraria.',
      describe: lugarfuneraria
    },
    {
      title: 'Funeraria',
      describe: funeraria
    },
    {
      title: 'Email funeraria',
      describe: emailfuneraria
    },
    {
      title: 'País funeraria',
      describe: (
        <SelectComponent options={l_paises} optionPropkey='idPais' optionPropLabel='nombre' value={paisfuneraria} disabled />
      )
    },
    {
      title: 'Departamento funeraria',
      describe: (
        <SelectComponent
          options={l_departamento}
          optionPropkey='idDepartamento'
          optionPropLabel='descripcion'
          value={departamentofuneraria}
          disabled
        />
      )
    },
    {
      title: 'Municipio funeraria',
      describe: (
        <SelectComponent
          options={l_municipios}
          optionPropkey='idMunicipio'
          optionPropLabel='descripcion'
          value={municipiofuneraria}
          disabled
        />
      )
    }
  ];
  */
