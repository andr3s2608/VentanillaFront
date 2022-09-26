import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Divider from 'antd/es/divider';
import moment from 'moment';
import { List, Button, Form, Modal, Table, Input } from 'antd';
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
import { layoutItems } from 'app/shared/utils/form-layout.util';
import { store } from 'app/redux/app.reducers';
import { SetResetViewLicence } from 'app/redux/controlViewLicence/controlViewLicence.action';
import { useStepperForm } from 'app/shared/hooks/stepper.hook';

export const InformacionFallecidoSeccion = ({ obj, licencia, props }: any) => {
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
  const [l_tipo_muerte, settipomuerte] = useState<IDominio[]>([]);
  const [l_tipos_documento, settipodocumentos] = useState<any[]>([]);
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

  const [mostrar, setmostrar] = useState<boolean>(false);

  /////validacion de documento
  const [longitudmaxima, setLongitudmaxima] = useState<number>(10);
  const [longitudminima, setLongitudminima] = useState<number>(5);
  const [tipocampo, setTipocampo] = useState<string>('[0-9]{4,10}');
  const [tipocampovalidacion, setTipocampovalidacion] = useState<any>(/[0-9]/);
  const [tipodocumento, setTipodocumento] = useState<string>('Cédula de Ciudadanía');
  const [campo, setCampo] = useState<string>('Numéricos');
  const [sininformacion, setsininformacion] = useState<boolean>(false);




  const getListas = useCallback(async () => {
    //listas del local storage
    const dep: any = localStorage.getItem('departamentos');
    const departamentos: any = JSON.parse(dep);

    const paises: any = localStorage.getItem('paises');
    const paisesjson: any = JSON.parse(paises);

    const tipos: any = localStorage.getItem('tipoid');
    const tiposjson: any = JSON.parse(tipos);

    settipodocumentos(tiposjson);

    const resp = await dominioService.get_type(ETipoDominio['Tipo de Muerte']);
    settipomuerte(resp);

    ///////////

    const filtropais = paisesjson.filter((i: { id: any }) => i.id == obj?.country);

    const iddepart = departamentos.filter((i: { idDepartamento: any }) => i.idDepartamento == obj?.state);


    ///se setea el pais,municipio,ciudad de defuncion
    if (iddepart[0].descripcion !== 'BOGOTÁ D.C.') {
      const idMun: string = iddepart[0].idDepartamento + '';
      const mun = (await dominioService).get_all_municipios_by_departamento(idMun);

      const idmuni = (await mun).filter((i) => i.idMunicipio == obj?.city);

      setdefuncion(filtropais[0].descripcion + '/' + iddepart[0].descripcion + '/' + idmuni[0].descripcion);
    } else {
      setdefuncion(filtropais[0].descripcion + '/' + iddepart[0].descripcion);
    }
    /////////

    ///se setea la nacionalidad
    if (obj?.idDepartamentoResidencia == undefined) {
      const filtronacionalidad = paisesjson.filter((i: { id: any }) => i.id == obj?.nationalidad);


      setnacionalidad(filtronacionalidad[0].descripcion);
    }
    setNombres([obj.name, obj.secondName, obj.surname, obj.secondSurname]);
    /////////


    //se valida si tiene ubicacion la solicitud,en caso de tenerla es una madre ya que asi se tiene configurado
    //se setea la informacion a mostrar de la madre
    if (obj?.idDepartamentoResidencia != undefined) {
      const filtropaismadre = paisesjson.filter((i: { id: any }) => i.id == obj?.residencia);

      if (obj.residencia == '1e05f64f-5e41-4252-862c-5505dbc3931c') {
        const iddepartmadre = departamentos.filter(
          (i: { idDepartamento: any }) => i.idDepartamento == obj?.idDepartamentoResidencia
        );
        const { idDepartamento } = iddepartmadre[0];
        const resp = await dominioService.get_all_municipios_by_departamento(idDepartamento);

        const idmunimadre = (await resp).filter((i) => i.idMunicipio == obj?.idCiudadResidencia);

        setNombres([obj.namemother, obj.secondNamemother, obj.surnamemother, obj.secondSurnamemother]);
        setpaismadre('colombia');
        setnacionalidad('colombiana');
        setdepartamentomadre(iddepartmadre[0].descripcion.toLowerCase());
        setciudadmadre(idmunimadre[0].descripcion.toLowerCase());
        setesmadre(true);
      } else {
        setpaismadre(filtropaismadre[0].descripcion.toLowerCase());
        setnacionalidad(filtropaismadre[0].descripcion.toLowerCase());
        setdepartamentomadre('Fuera del País');
        setciudadmadre('Fuera del País');
        setesmadre(true);
      }
    }


    ///////se setea los datos de la persona que tenga una cedula duplicada en caso de ser inhumacion o cremacion individual
    const inf_fallecido = await api.GetInformacionFallecido(obj?.idSolicitud);
    const fecharecortada: string = inf_fallecido['fechaNacimiento'];
    setFallecido([
      inf_fallecido['tipoIdentificacion'] + '',
      inf_fallecido['edadFallecido'] + '',
      fecharecortada.substring(0, 10) + '',
      inf_fallecido['hora'] + '',
      inf_fallecido['idSexo'] + ''
    ]);

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





    setmostrar(true)
  }, []);

  useEffect(() => {
    getListas();
  }, []);

  const date = obj?.date !== undefined ? moment(obj?.date) : null;
  const numero = obj?.certificado;


  const idfallecido = obj?.IDNumber;

  const tipo = obj?.deathType;



  //averiguar que tipo de solicitud es para mostrar informacion del fallecido o de la madre
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

  //datos madre

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

  // validacion tipos de documento
  const cambiodocumento = (value: any) => {

    const valor: string = value;


    const valorupper = valor.toUpperCase();
    setsininformacion(false);

    if (valorupper == 'C087D833-3CFB-460F-AA78-E5CF2FE83F25') {
      props.setFieldsValue({ IDNumber: undefined });
      setLongitudminima(5);
      setLongitudmaxima(15);
      setTipocampo('[a-zA-Z0-9]{5,15}');
      setTipocampovalidacion(/[a-zA-Z0-9]/);
      setTipodocumento('Sin Identificación');
      setCampo('AlfaNuméricos(Numéros y letras)');
      setsininformacion(true);
    } else {
      if (valorupper == '7C96A4D3-A0CB-484E-A01B-93BC39C7902E') {
        setLongitudminima(2);
        setLongitudmaxima(10);
        setTipocampo('[0-9]{2,10}');
        setTipocampovalidacion(/[0-9]/);
        setCampo('Numéricos');
        setTipodocumento('Número de Protocolo');
        props.setFieldsValue({ IDNumber: '8001508610' });
      } else {
        props.setFieldsValue({ IDNumber: undefined });
        if (valorupper === '7C96A4D3-A0CB-484E-A01B-93BC39C2552E') {
          setLongitudminima(4);
          setLongitudmaxima(10);
          setTipocampo('[0-9]{4,10}');
          setTipocampovalidacion(/[0-9]/);
          setCampo('Numéricos');
          setTipodocumento('Cédula de Ciudadanía');
        } else {
          if (valorupper === 'AC3629D8-5C87-46CE-A8E2-530B0495CBF6') {
            setLongitudminima(10);
            setLongitudmaxima(11);
            setTipocampo('[0-9]{10,11}');
            setTipocampovalidacion(/[0-9]/);
            setCampo('Numéricos');
            setTipodocumento('Tarjeta de Identidad ');
          } else {
            if (valorupper === '2491BC4B-8A60-408F-9FD1-136213F1E4FB') {
              setLongitudminima(15);
              setLongitudmaxima(15);
              setTipocampo('[0-9]{15,15}');
              setTipocampovalidacion(/[0-9]/);
              setCampo('Numéricos');
              setTipodocumento('Permiso Especial de Permanencia');
            } else {
              if (valorupper === 'FFE88939-06D5-486C-887C-E52D50B7F35D' ||
                valorupper === '71F659BE-9D6B-4169-9EE2-E70BF0D65F92' ||
                valorupper === '97F5657D-D8EC-48EF-BBE3-1BABEFECB1A4') {
                setLongitudminima(10);
                setLongitudmaxima(11);
                setTipocampo('[a-zA-Z0-9]{10,11}');
                setTipocampovalidacion(/[a-zA-Z0-9]/);
                setCampo('AlfaNuméricos(Numéros y letras)');
                setTipodocumento('Registro Civil de Nacimiento , Numero único de identificacíon personal y Carné Diplomatico');
              } else {
                if (valorupper === '0D69523B-4676-4E3D-8A3D-C6800A3ACF3E') {
                  setLongitudminima(6);
                  setLongitudmaxima(9);
                  setTipocampo('[0-9]{6,9}');
                  setTipocampovalidacion(/[0-9]/);
                  setCampo('Numéricos');
                  setTipodocumento('Certificado de nacido vivo ');

                }
                else {
                  if (valorupper === '60518653-70B7-42AB-8622-CAA27B496184') {
                    setLongitudminima(7);
                    setLongitudmaxima(16);
                    setTipocampo('[a-zA-Z0-9]{7,16}');
                    setTipocampovalidacion(/[a-zA-Z0-9]/);
                    setCampo('AlfaNumérico(Numéros y letras)');
                    setTipodocumento('Documento Extranjero');

                  }
                  else {
                    if (valorupper === 'C532C358-56AE-4F93-8B9B-344DDF1256B7') {
                      setLongitudminima(9);
                      setLongitudmaxima(9);
                      setTipocampo('[a-zA-Z0-9]{9,9}');
                      setTipocampovalidacion(/[a-zA-Z0-9]/);
                      setCampo('AlfaNumérico(Numéros y letras)');
                      setTipodocumento('Salvoconducto');

                    }
                    else {
                      if (valorupper === '6AE7E477-2DE5-4149-8C93-12ACA6668FF0') {
                        setLongitudminima(5);
                        setLongitudmaxima(11);
                        setTipocampo('[a-zA-Z0-9]{5,11}');
                        setTipocampovalidacion(/[a-zA-Z0-9]/);
                        setCampo('AlfaNumérico(Numéros y letras)');
                        setTipodocumento('Adulto Sin Identificar');

                      }

                      else {
                        if (valorupper === '5FA5BF3F-B342-4596-933F-0956AE4B9109') {
                          setLongitudminima(5);
                          setLongitudmaxima(12);
                          setTipocampo('[a-zA-Z0-9]{5,12}');
                          setTipocampovalidacion(/[a-zA-Z0-9]/);
                          setCampo('AlfaNumérico(Numéros y letras)');
                          setTipodocumento('Menor Sin Identificar');

                        }
                        else {
                          if (valorupper === 'E927B566-7B8E-4B4D-AE26-14454705CB5E') {
                            setLongitudminima(4);
                            setLongitudmaxima(18);
                            setTipocampo('[a-zA-Z0-9]{4,18}');
                            setTipocampovalidacion(/[a-zA-Z0-9]/);
                            setCampo('AlfaNumérico(Numéros y letras)');
                            setTipodocumento('Permiso de Protección Temporal');

                          }
                          else {
                            setLongitudminima(6);
                            setLongitudmaxima(10);
                            setTipocampo('[a-zA-Z0-9]{6,10}');
                            setTipocampovalidacion(/[a-zA-Z0-9]/);
                            setCampo('AlfaNuméricos(Numéros y letras)');
                            setTipodocumento('Pasaporte , Cédula de Extranjería y  Tarjeta de Extranjería ');
                          }

                        }

                      }


                    }

                  }


                }

              }
            }
          }
        }
      }
    }
  };




  let data: any[] = [];
  //fallecido o feto
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
    //en caso de ser una licencia individual
    const datanueva = [
      {
        title: 'Numero Certificado de Defuncion',
        describe: (licencia === false ? numero
          : <Form.Item
            name='numerocert'
            rules={[{ required: true }]}
            initialValue={numero}
          >
            <Input
              allowClear
              placeholder='Número de Certificado'
              autoComplete='off'
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              onPaste={(event) => {
                event.preventDefault();
              }}
            />
          </Form.Item>)
      },
      {
        title: 'Fecha Defunción',
        describe: <DatepickerComponent picker='date' dateDisabledType='before' dateFormatType='default' value={date} disabled />
      },
      {
        title: 'País/Departamento/ Municipio Defuncion',
        describe: defuncion?.toLowerCase(),

      },
      {
        title: (licencia === false ? 'Primer Nombre' : '* Primer Nombre'),
        describe: (licencia === false ? primernombre?.toLowerCase()
          : <Form.Item name='name' rules={[{ required: true, max: 50 }]} initialValue={primernombre}>
            <Input
              allowClear
              placeholder='Primer Nombre'
              autoComplete='off'
              type='text'
              onKeyPress={(event) => {
                if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ ]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              onPaste={(event) => {
                event.preventDefault();
              }}
            />
          </Form.Item>)
      },
      {
        title: 'Segundo Nombre',
        describe: (licencia === false ? segundonombre?.toLowerCase()
          : <Form.Item
            name='secondName'
            rules={[{ required: false, max: 50 }]}
            initialValue={segundonombre}
          >
            <Input
              allowClear
              placeholder='Segundo Nombre'
              autoComplete='off'
              type='text'
              onKeyPress={(event) => {
                if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ ]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              onPaste={(event) => {
                event.preventDefault();
              }}
            />
          </Form.Item>)
      },
      {
        title: (licencia === false ? 'Primer Apellido' : '* Primer Apellido'),
        describe: (licencia === false ? primerapellido?.toLowerCase()
          : <Form.Item

            name='surname'
            rules={[{ required: true, max: 50 }]}
            initialValue={primerapellido}
          >
            <Input
              allowClear
              placeholder='Primer Apellido'
              autoComplete='off'
              type='text'
              onKeyPress={(event) => {
                if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ ]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              onPaste={(event) => {
                event.preventDefault();
              }}
            />
          </Form.Item>)
      },
      {
        title: 'Segundo Apellido',
        describe: (licencia === false ? segundoapellido?.toLowerCase()
          :
          <Form.Item
            name='secondSurname'
            rules={[{ required: false, max: 50 }]}
            initialValue={segundoapellido}
          >
            <Input
              allowClear
              placeholder='Segundo Apellido'
              autoComplete='off'
              type='text'
              onKeyPress={(event) => {
                if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ ]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              onPaste={(event) => {
                event.preventDefault();
              }}
            />
          </Form.Item>
        )
      },
      {
        title: (licencia === false ? 'Tipo de identificación' : '* Tipo de identificación'),
        describe: (licencia === false ? tipo_identificacion :
          <Form.Item
            name='IDType'
            initialValue={tipo_identificacion}
            rules={[{ required: true }]}
          >
            <SelectComponent
              options={l_tipos_documento}
              onChange={cambiodocumento}
              optionPropkey='id'
              optionPropLabel='descripcion'
            />
          </Form.Item>)

      },
      {
        title: (licencia === false ? 'No. Identificacion.' : '* No. Identificacion.'),
        describe: (licencia === false ? idfallecido
          :
          <Form.Item name='IDNumber' initialValue={idfallecido} rules={[{ required: !sininformacion }]}>
            <Input
              allowClear
              type='text'
              placeholder='Número Identificación'
              autoComplete='off'
              pattern={tipocampo}
              maxLength={longitudmaxima}
              onKeyPress={(event) => {
                if (!tipocampovalidacion.test(event.key)) {
                  event.preventDefault();
                }
              }}
              onPaste={(event) => {
                event.preventDefault();
              }}
              onInvalid={() => {
                Swal.fire({
                  icon: 'error',
                  title: 'Datos inválidos',
                  text:
                    'Sección:INFORMACIÓN DEL FALLECIDO \n recuerde que para el tipo de documento: ' +
                    tipodocumento +
                    ' solo se admiten valores ' +
                    campo +
                    ' de longitud entre ' +
                    longitudminima +
                    ' y ' +
                    longitudmaxima
                });
              }}
            />
          </Form.Item>)
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
          <SelectComponent options={l_tipo_muerte} optionPropkey='id' optionPropLabel='descripcion' value={tipo} disabled={!licencia} />
        )
      }
    ];
    data = datanueva;
  }


  ////tabla cuando un documento ya esta repetido en otro tramite
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

      {mostrar && (<>
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


        <div>
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
        </div>
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
      </>)}
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
