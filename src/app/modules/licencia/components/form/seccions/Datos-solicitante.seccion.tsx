import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Divider from 'antd/es/divider';
import moment from 'moment';
import { List, Card, Layout, Button, Form, Modal, Radio } from 'antd';
import 'app/shared/components/table/estilos.css';
// Componentes

import { dominioService, ETipoDominio, IDominio, IDepartamento, ICementerio, IMunicipio } from 'app/services/dominio.service';
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import { ApiService } from 'app/services/Apis.service';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { resourceUsage } from 'process';

export const InformacionSolicitanteSeccion = ({ obj }: any) => {
  const [NROIDENT, setNROIDENT] = useState('');
  const [RAZON_S, setRAZON_S] = useState('');

  const [valor, setValor] = useState<string | undefined>();
  const [emailsolicitante, setemailsolicitante] = useState<string | undefined>();
  const [tipoid, setipoid] = useState<string | undefined>();
  const [id, setid] = useState<string | undefined>();
  const [nombre, setnombre] = useState<string | undefined>();
  const [apellido, setapellido] = useState<string | undefined>();
  const [emailcementerio, setemailcementerio] = useState<string | undefined>();
  const [emailfuneraria, setemailfuneraria] = useState<string | undefined>();

  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisiblef, setIsModalVisiblefuneraria] = useState(false);
  const [[l_paises, l_departamento, l_municipios, l_cementerios, l_tipo_identificacion], setListas] = useState<
    [IDominio[], IDepartamento[], IMunicipio[], ICementerio[], IDominio[]]
  >([[], [], [], [], []]);

  const getListas = useCallback(async () => {
    const dep = dominioService.get_departamentos_colombia();
    const iddepart = (await dep).filter((i) => i.idDepartamento == '31b870aa-6cd0-4128-96db-1f08afad7cdd');
    const idMunicipio: string = iddepart[0].idDepPai + '';

    const resumensolicitud = await api.GetResumenSolicitud('0CFEB91D-7940-46C5-82DC-5D7DF7EE1188');

    const resp = await Promise.all([
      dominioService.get_type(ETipoDominio.Pais),
      dominioService.get_departamentos_colombia(),
      dominioService.get_municipios_by_departamento(idMunicipio),
      dominioService.get_cementerios_bogota(),
      dominioService.get_type(ETipoDominio['Tipo Documento'])
    ]);

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

    setListas(resp);
  }, []);

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lugarcementerio = obj?.isLugar;
  const cementerio = obj?.cementerioLugar;
  const municipiocementerio = obj?.cementerioMunicipio;
  const departamentocementerio = obj?.cementerioDepartamento;
  const paiscementerio = obj?.cementerioPais;

  const lugarfuneraria = obj?.isLugar;
  const funeraria = obj?.cementerio;
  const paisfuneraria = obj?.cementerioPais;

  const municipiofuneraria = obj?.cementerioMunicipio;
  const departamentofuneraria = obj?.cementerioDepartamento;

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
      describe: nombre
    },
    {
      title: 'Segundo Nombre',
      describe: ''
    },
    {
      title: 'Primer Apellido',
      describe: apellido
    },
    {
      title: 'Segundo Apellido',
      describe: ''
    },
    {
      title: 'Email',
      describe: emailsolicitante
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
      describe: lugarcementerio
    },
    {
      title: 'Funeraria',
      describe: cementerio
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

  const onClickViewCementerio = async () => {
    const all = await api.GetAllcementerios();

    const alldata = all.map((item: any) => {
      setNROIDENT(item.NROIDENT);
      setRAZON_S(item.RAZON_S);
      return item;
    });
    showModal();
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onClickValidarcementerio = async () => {
    const all = await api.GetAllcementerios();
    const result = all.find((cementerio: any) => cementerio.NROIDENT === parseInt(NROIDENT) || cementerio.RAZON_S === RAZON_S);
    if (result) setValor('El cementerio registrado Es valido');
    else setValor('El cementerio registrado es Invalido');
  };

  //===============================
  const changeA = (e: any) => {
    if (e.target.value === 'Id') {
      //(document.getElementById('radio') as HTMLElement).style.color = 'black';
      (document.getElementById('exampleInputEmail2') as HTMLButtonElement).disabled = true;
      (document.getElementById('exampleInputEmail1') as HTMLButtonElement).disabled = false;
    } else if (e.target.value === 'Name') {
      // (document.getElementById('radio2') as HTMLElement).style.color = 'black';
      (document.getElementById('exampleInputEmail1') as HTMLButtonElement).disabled = true;
      (document.getElementById('exampleInputEmail2') as HTMLButtonElement).disabled = false;
    }
  };

  const changeB = (e: any) => {
    if (e.target.value === 'Id') {
      //(document.getElementById('radio') as HTMLElement).style.color = 'black';
      (document.getElementById('exampleInputEmail4') as HTMLButtonElement).disabled = true;
      (document.getElementById('exampleInputEmail3') as HTMLButtonElement).disabled = false;
    } else if (e.target.value === 'Name') {
      // (document.getElementById('radio2') as HTMLElement).style.color = 'black';
      (document.getElementById('exampleInputEmail3') as HTMLButtonElement).disabled = true;
      (document.getElementById('exampleInputEmail4') as HTMLButtonElement).disabled = false;
    }
  };

  //=====================

  //Funerarias

  const onClickViewFuneraria = async () => {
    const all = await api.GetFunerarias();

    const alldata = all.map((item: any) => {
      setNROIDENT(item.NROIDENT);
      setRAZON_S(item.RAZON_S);
      return item;
    });
    showfModal();
  };

  const showfModal = () => {
    setIsModalVisiblefuneraria(true);
  };

  const handlefCancel = () => {
    setIsModalVisiblefuneraria(false);
  };

  const onClickValidarfuneraria = async () => {
    const all = await api.GetFunerarias();
    const result = all.find((cementerio: any) => cementerio.NROIDENT === parseInt(NROIDENT) || cementerio.RAZON_S === RAZON_S);
    if (result) setValor('La funeraria registrada Es valida');
    else setValor('La funeraria registrada es Invalida');
  };

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
      <Divider orientation='left'>
        <div className='contenedor'>
          Datos del Cementerio
          <Form.Item>
            <Button type='primary' className='ml-3 mt-1' onClick={() => onClickViewCementerio()}>
              Validar Cementerio
            </Button>
          </Form.Item>
        </div>
      </Divider>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={cementerios}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta title={item.title} description={item.describe} />
          </List.Item>
        )}
      />
      <Divider orientation='left'>
        <div className='contenedor'>
          Datos de la Funeraria
          <Form.Item>
            <Button type='primary' className='ml-3 mt-1' onClick={() => onClickViewFuneraria()}>
              Validar Funeraria
            </Button>
          </Form.Item>
        </div>
      </Divider>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={funerarias}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta title={item.title} description={item.describe} />
          </List.Item>
        )}
      />
      <Modal
        title={<p className='text-center text-dark text-uppercase mb-0 titulo'>validación Cementerio</p>}
        visible={isModalVisible}
        onCancel={handleCancel}
        width={1000}
        okButtonProps={{ hidden: true }}
        cancelText='Cerrar'
      >
        //==================================
        <div>
          <p>Buscar por:</p>
          <Radio.Group onChange={changeA}>
            <Radio.Button id='radio1' className='changeSearchType text-white' value='Id'>
              No. Identificación
            </Radio.Button>
            <Radio.Button id='radio1' className='changeSearchType ml-3 text-white' value='Name'>
              Nombre del Cementerio
            </Radio.Button>
          </Radio.Group>
        </div>
        //===========================
        <div className='row'>
          <div className='col-lg-6'>
            <label htmlFor=''>Buscar Constante No. Identificación</label>
            <input
              placeholder='Ingrese la constante de de identificación'
              type='text'
              className='form-control d-flex caja'
              id='exampleInputEmail1'
              aria-describedby='emailHelp '
              value={NROIDENT}
              name='firstName'
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
              id='exampleInputEmail2'
              aria-describedby='emailHelp'
              value={RAZON_S}
              name='firstName'
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
        {valor && <div className='alert text-center  text-white mt-4'> {valor}</div>}
      </Modal>

      <Modal
        title={<p className='text-center text-dark text-uppercase mb-0 titulo'>validación Funeraria</p>}
        visible={isModalVisiblef}
        onCancel={handlefCancel}
        width={1000}
        okButtonProps={{ hidden: true }}
        cancelText='Cerrar'
      >
        //=====================
        <div>
          <p>Buscar por:</p>
          <Radio.Group onChange={changeB}>
            <Radio.Button id='radio1' className='changeSearchType text-white' value='Id'>
              No. Identificación
            </Radio.Button>
            <Radio.Button id='radio1' className='changeSearchType ml-3 text-white' value='Name'>
              Nombre del Cementerio
            </Radio.Button>
          </Radio.Group>
        </div>
        //======================
        <div className='row'>
          <div className='col-lg-6'>
            <label htmlFor=''>Buscar Constante No. Identificación</label>
            <input
              placeholder='Ingrese la constante de de identificación'
              type='text'
              className='form-control d-flex caja'
              id='exampleInputEmail3'
              aria-describedby='emailHelp '
              value={NROIDENT}
              name='firstName'
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
              id='exampleInputEmail4'
              aria-describedby='emailHelp'
              value={RAZON_S}
              name='firstName'
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
        {valor && <div className='alert text-center  text-white mt-4'> {valor}</div>}
      </Modal>
    </>
  );
};
export const KeysForm = ['certificatenumber'];
