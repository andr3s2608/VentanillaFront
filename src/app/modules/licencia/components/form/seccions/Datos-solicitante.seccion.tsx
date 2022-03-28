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

export const InformacionSolicitanteSeccion = ({ obj }: any) => {
  const [NROIDENT, setNROIDENT] = useState('');
  const [RAZON_S, setRAZON_S] = useState('');
  const [valor, setValor] = useState<string | undefined>();
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisiblef, setIsModalVisiblefuneraria] = useState(false);
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

  const onClickViewCementerio = async () => {
    const all = await api.GetAllcementerios();
    console.log('prueba', all);
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
    console.log('prueba', all);
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
