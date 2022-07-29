import { useCallback, useEffect, useState } from 'react';

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
import { classNames } from '@react-pdf-viewer/core';
import '../../../../../../../scss/antd/index.css';
import '../../../../../../../css/estilos.css';

export const InformacionAutorizadorCremacionSeccion = ({ obj }: any) => {
  const [[tipo_identificacion, edad, fechaNacimiento, horaFallecido, genero], setFallecido] = useState<
    [string, string, string, string, string]
  >(['', '', '', '', '']);
  const [numeroCertificado, setNumeroCertificado] = useState();

  const [defuncion, setdefuncion] = useState<string | undefined>();
  const [esmadre, setesmadre] = useState<boolean>(false);
  const [ciudadmadre, setciudadmadre] = useState<string | undefined>();
  const [departamentomadre, setdepartamentomadre] = useState<string | undefined>();
  const [paismadre, setpaismadre] = useState<string | undefined>();
  const [nacionalidad, setnacionalidad] = useState<string | undefined>();
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

    const pais = await dominioService.get_type(ETipoDominio.Pais);
    const filtropais = pais.filter((i) => i.id == obj?.country);

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
      const filtronacionalidad = pais.filter((i) => i.id == obj?.nationalidad);

      setnacionalidad(filtronacionalidad[0].descripcion);
    }
    if (obj?.idDepartamentoResidencia != undefined) {
      const paism = await dominioService.get_type(ETipoDominio.Pais);
      const filtropaismadre = pais.filter((i) => i.id == obj?.residencia);

      if (obj.residencia == '1e05f64f-5e41-4252-862c-5505dbc3931c') {
        const iddepartmadre = (await dep).filter((i) => i.idDepartamento == obj?.idDepartamentoResidencia);
        const { idDepartamento } = iddepartmadre[0];
        const resp = await dominioService.get_all_municipios_by_departamento(idDepartamento);

        const idmunimadre = (await resp).filter((i) => i.idMunicipio == obj?.idCiudadResidencia);

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
  const primernombre = obj?.name ?? obj.namemother;
  const segundonombre = obj?.secondName ?? obj.secondNamemother;
  const primerapellido = obj?.surname ?? obj.surnamemother;
  const segundoapellido = obj?.secondSurname ?? obj.secondSurnamemother;

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
              <div className='contenedor'>datos del autorizador de la cremación</div>
            </Divider>
          </div>
        </div>
      </div>
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
