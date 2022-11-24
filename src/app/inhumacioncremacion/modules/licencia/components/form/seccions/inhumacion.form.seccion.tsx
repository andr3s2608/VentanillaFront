import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form from 'antd/es/form';
import Input from 'antd/es/input';

// Servicios

import { authProvider } from 'app/shared/utils/authprovider.util';
import { ApiService } from 'app/services/Apis.service';

import { dominioService, ETipoDominio, IBarrio, ICementerio, IDepartamento, IDominio, ILocalidad, IMunicipio, IUpz } from 'app/services/dominio.service';
import { SelectComponent } from 'app/shared/components/inputs/select.component';

import Swal from 'sweetalert2';
import { Button, Divider, FormInstance } from 'antd';
import { DatepickerComponent } from 'app/shared/components/inputs/datepicker.component';
import moment from 'moment';

export const InhumacionSeccion: React.FC<IndividualProps<any>> = (props) => {

  const { obj, tipo, prop, fechanacimiento, tipodocumentoseleccionado, origen } = props;


  const [longitudmaxima, setLongitudmaxima] = useState<number>(10);
  const [longitudminima, setLongitudminima] = useState<number>(4);
  const [tipocampo, setTipocampo] = useState<string>('[0-9]{4,10}');
  const [tipocampovalidacion, setTipocampovalidacion] = useState<any>(/[0-9]/);
  const [tipodocumento, setTipodocumento] = useState<string>('Cédula de Ciudadanía');
  const [sininformacion, setsininformacion] = useState<boolean>(false);
  const [tipodocumentohoranacimiento, settipodocumentohoranacimiento] = useState<string>('7c96a4d3-a0cb-484e-a01b-93bc39c2552e');
  const [campo, setCampo] = useState<string>('Numéricos');
  //Reconocido
  const [longitudmaximareconocido, setLongitudmaximareconocido] = useState<number>(10);
  const [longitudminimareconocido, setLongitudminimareconocido] = useState<number>(4);
  const [tipocamporeconocido, setTipocamporeconocido] = useState<string>('[0-9]{4,10}');
  const [tipocampovalidacionreconocido, setTipocampovalidacionreconocido] = useState<any>(/[0-9]/);
  const [tipodocumentoreconocido, setTipodocumentoreconocido] = useState<string>('Cédula de Ciudadanía');
  const [sininformacionreconocido, setsininformacionreconocido] = useState<boolean>(false);
  const [camporeconocido, setCamporeconocido] = useState<string>('Numéricos');
  //---

  const idBogota = '31211657-3386-420a-8620-f9c07a8ca491';
  const [idBogotac, setIdBogota] = useState<string>('Bogotá D.C.');
  const [idupz, setidupz] = useState<string>('d869bc18-4fca-422a-9a09-a88d3911dc8c');
  const [idbarrio, setidbarrio] = useState<string>('4674c6b9-1e5f-4446-8b2a-1a986a10ca2e');
  const idlocalidad = '0e2105fb-08f8-4faf-9a79-de5effa8d198';
  const [l_tipos_documentofetal, settipos] = useState<any>();
  const [l_departamentos, setLDepartamentos] = useState<IDepartamento[]>([]);
  const [l_localidades, setLLocalidades] = useState<ILocalidad[]>([]);

  const [l_municipios, setLMunicipios] = useState<IMunicipio[]>([]);
  const [l_areas, setLAreas] = useState<IUpz[]>([]);
  const [l_barrios, setLBarrios] = useState<IBarrio[]>([]);

  const [isColombia, setIsColombia] = useState(true);
  const [isBogota, setIsBogota] = useState(true);



  const [mostrar, setmostrar] = useState(false);
  const idColombia = '1e05f64f-5e41-4252-862c-5505dbc3931c';
  const idDepartamentoBogota = '31b870aa-6cd0-4128-96db-1f08afad7cdd';
  //fetales

  const date = obj?.dateOfBirth !== undefined ? moment(obj?.dateOfBirth) : null;

  const [[l_paises, l_tipos_documento, l_estado_civil, l_nivel_educativo, l_etnia, l_regimen, l_tipo_muerte], setListas] =
    useState<IDominio[][]>([]);

  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);

  const [reconocido, setreconocido] = useState<any>(false);

  const getListas = useCallback(
    async () => {
      const paises: any = localStorage.getItem('paises');
      const paisesjson: any = JSON.parse(paises);

      const tipos: any = localStorage.getItem('tipoid');
      const tiposjson: any = JSON.parse(tipos);

      const estadocivil: any = localStorage.getItem('estadocivil');

      const nivel: any = localStorage.getItem('nivel');

      const etnia: any = localStorage.getItem('etnia');

      const tipomuerte: any = localStorage.getItem('tipomuerte');

      const userlocal: any = localStorage.getItem('roles');
      const userjson: any = JSON.parse(userlocal);



      if (tipo === 'individual') {
        if (userjson[0].rol === 'MedicinaLegal' && (
          (obj?.name.toString().toUpperCase() === 'N' && obj?.surname.toString().toUpperCase() === 'N'
            && obj?.secondName.toString().toUpperCase() === 'N' && obj?.secondSurname.toString().toUpperCase() === 'N')
          || (obj?.name.toString().toUpperCase() === 'N' && obj?.surname.toString().toUpperCase() === 'N')
          || (obj?.name.toString().toUpperCase() === 'C' && obj?.surname.toString().toUpperCase() === 'I'
            && obj?.secondName.toString().toUpperCase() === 'N')
        ) && obj?.reconocidocomo.length === 0
        ) {
          setmostrar(true)

        }
      }
      else {

        if (userjson[0].rol === 'MedicinaLegal' && (
          (obj?.namemother.toString().toUpperCase() === 'N' && obj?.surnamemother.toString().toUpperCase() === 'N'
            && obj?.secondNamemother.toString().toUpperCase() === 'N' && obj?.secondSurnamemother.toString().toUpperCase() === 'N')
          || (obj?.namemother.toString().toUpperCase() === 'N' && obj?.surnamemother.toString().toUpperCase() === 'N')
          || (obj?.namemother.toString().toUpperCase() === 'C' && obj?.surnamemother.toString().toUpperCase() === 'I'
            && obj?.secondNamemother.toString().toUpperCase() === 'N')

        ) && obj?.reconocidocomo.length === 0
        ) {

          setmostrar(true)

        }
      }

      if ((origen === 'administracion' || origen === 'modificacion') && obj?.reconocidocomo.length > 0) {
        setreconocido(true);
        cambiodocumentoreconocido(obj?.reconocidocomo[0].tipoid)
        props.form.setFieldsValue({ IDNumber: obj?.reconocidocomo[0].numeroid });

      }


      const resp = await Promise.all([
        paisesjson,
        tiposjson,
        JSON.parse(estadocivil),
        JSON.parse(nivel),
        JSON.parse(etnia),
        dominioService.get_type(ETipoDominio.Regimen),
        JSON.parse(tipomuerte)
      ]);

      const nuevalista = tiposjson.filter((i: { id: string }) => i.id != '71f659be-9d6b-4169-9ee2-e70bf0d65f92');

      settipos(nuevalista);


      //fetales
      const departamento: any = localStorage.getItem('departamentos');
      const localidad: any = localStorage.getItem('localidades');
      const municipiosbogota: any = localStorage.getItem('municipiosbogota');
      setLDepartamentos(JSON.parse(departamento));
      setLLocalidades(JSON.parse(localidad));
      setLMunicipios(JSON.parse(municipiosbogota));

      const upzLocalidad: any = await dominioService.get_upz_by_localidad(idlocalidad);

      setLAreas(upzLocalidad);
      onChangeArea(idupz);


      setListas(resp);


      if (obj !== undefined) {

        cambiodocumento(obj.IDType)

        if (obj?.idDepartamentoResidencia !== undefined && obj?.idDepartamentoResidencia !== null) {

          const municipios = await dominioService.get_all_municipios_by_departamento(obj?.idDepartamentoResidencia);

          setLMunicipios(municipios);
        }


        if (tipo === 'individual') {

          props.form.setFieldsValue({ IDNumber: obj?.IDNumber });
        }
        else {
          props.form.setFieldsValue({ IDNumber: obj?.IDNumber.toString().substring(3, obj?.IDNumber.length) });

        }

      }


    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, []);



  const compararfecha = () => {
    if (fechanacimiento != null) {
      fechanacimiento();
    }
  };


  const onChangePais = async (value: string) => {
    setIsColombia(value === idColombia);
    setLMunicipios([]);
    setIsBogota(false);
    const respArea = await dominioService.get_upz_by_localidad(idlocalidad);
    const respBarrios = await dominioService.get_barrio_by_upz('d869bc18-4fca-422a-9a09-a88d3911dc8c');
    setLBarrios(respBarrios);
    setLAreas(respArea);
    setidupz('d869bc18-4fca-422a-9a09-a88d3911dc8c');
    setidbarrio('4674c6b9-1e5f-4446-8b2a-1a986a10ca2e');
    props.form.resetFields(['departamento', 'ciudad', 'localidad', 'area', 'barrio']);
  };

  const onChangeDepartamento = async (value: string) => {
    props.form.setFieldsValue({ ciudad: undefined });


    let departamento = l_departamentos.filter((i) => i.idDepartamento == value);

    const { idDepartamento } = departamento[0];

    if (value == '31b870aa-6cd0-4128-96db-1f08afad7cdd') {
      setIdBogota('Bogotá D.C.');
      props.form.setFieldsValue({ ciudad: 'Bogotá D.C.' });
      setIsBogota(true);
    } else {
      setIsBogota(false);
      setIdBogota('');
    }
    //props.form.resetFields(['ciudad']);
    const resp = await dominioService.get_all_municipios_by_departamento(idDepartamento);
    setLMunicipios(resp);
    const respArea = await dominioService.get_upz_by_localidad(idlocalidad);
    const respBarrios = await dominioService.get_barrio_by_upz('d869bc18-4fca-422a-9a09-a88d3911dc8c');
    setLBarrios(respBarrios);
    setLAreas(respArea);
    setidupz('d869bc18-4fca-422a-9a09-a88d3911dc8c');
    setidbarrio('4674c6b9-1e5f-4446-8b2a-1a986a10ca2e');
    props.form.resetFields(['localidad', 'area', 'barrio']);
  };

  const onChangeMunicipio = (value: string) => {
    props.form.resetFields(['localidad', 'area', 'barrio']);
    setIsBogota(value === idBogota);
  };

  const onChangeLocalidad = async (value: string) => {
    const resp = await dominioService.get_upz_by_localidad(value);
    const respBarrios = await dominioService.get_barrio_by_upz('d869bc18-4fca-422a-9a09-a88d3911dc8c');
    if (value == idlocalidad) {
      setidupz('d869bc18-4fca-422a-9a09-a88d3911dc8c');
    } else {
      setidupz('');
    }

    setidbarrio('4674c6b9-1e5f-4446-8b2a-1a986a10ca2e');
    setLAreas(resp);
    setLBarrios(respBarrios);
    props.form.resetFields(['area', 'barrio']);
  };

  const onChangeArea = async (value: string) => {
    if (value == 'd869bc18-4fca-422a-9a09-a88d3911dc8c') {
      setidbarrio('4674c6b9-1e5f-4446-8b2a-1a986a10ca2e');
    } else {
      setidbarrio('');
    }

    const resp = await dominioService.get_barrio_by_upz(value);
    setLBarrios(resp);
    props.form.resetFields(['barrio']);
  };



  const esReconocido = () => {
    setreconocido(true);
    prop(4, 'reconocido');
    setmostrar(false);
  }




  const cambiodocumento = (value: any) => {
    const valor: string = value;
    settipodocumentohoranacimiento(valor);
    tipodocumentoseleccionado(valor)
    const valorupper = valor.toUpperCase();
    setsininformacion(false);

    if (valorupper == 'C087D833-3CFB-460F-AA78-E5CF2FE83F25') {
      props.form.setFieldsValue({ IDNumber: undefined });
      setLongitudminima(5);
      setLongitudmaxima(15);
      setTipocampo('[a-zA-Z0-9]{0,15}');
      setTipocampovalidacion(/[a-zA-Z0-9]/);
      setTipodocumento('Sin Identificación');
      setCampo('AlfaNuméricos(Numéros y letras)');
      setsininformacion(true);

      prop(5, 'datosfallecido');
    } else {
      if (valorupper == '7C96A4D3-A0CB-484E-A01B-93BC39C7902E') {
        setLongitudminima(2);
        setLongitudmaxima(10);
        setTipocampo('[0-9]{2,10}');
        setTipocampovalidacion(/[0-9]/);
        setCampo('Numéricos');
        setTipodocumento('Número de Protocolo');
        props.form.setFieldsValue({ IDNumber: '8001508610' });

        prop(2, 'datosfallecido');

      } else {
        props.form.setFieldsValue({ IDNumber: undefined });
        if (valorupper === '7C96A4D3-A0CB-484E-A01B-93BC39C2552E') {
          setLongitudminima(4);
          setLongitudmaxima(10);
          setTipocampo('[0-9]{4,10}');
          setTipocampovalidacion(/[0-9]/);
          setCampo('Numéricos');
          setTipodocumento('Cédula de Ciudadanía');

          prop(4, 'datosfallecido');
        } else {
          if (valorupper === 'AC3629D8-5C87-46CE-A8E2-530B0495CBF6') {
            setLongitudminima(10);
            setLongitudmaxima(11);
            setTipocampo('[0-9]{10,11}');
            setTipocampovalidacion(/[0-9]/);
            setCampo('Numéricos');
            setTipodocumento('Tarjeta de Identidad ');

            prop(10, 'datosfallecido');
          } else {
            if (valorupper === '2491BC4B-8A60-408F-9FD1-136213F1E4FB') {
              setLongitudminima(15);
              setLongitudmaxima(15);
              setTipocampo('[0-9]{15,15}');
              setTipocampovalidacion(/[0-9]/);
              setCampo('Numéricos');
              setTipodocumento('Permiso Especial de Permanencia');

              prop(15, 'datosfallecido');
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

                prop(10, 'datosfallecido');
              } else {
                if (valorupper === '0D69523B-4676-4E3D-8A3D-C6800A3ACF3E') {
                  setLongitudminima(6);
                  setLongitudmaxima(16);
                  setTipocampo('[0-9]{6,16}');
                  setTipocampovalidacion(/[0-9]/);
                  setCampo('Numéricos');
                  setTipodocumento('Certificado de nacido vivo ');

                  prop(6, 'datosfallecido');
                }
                else {
                  if (valorupper === '60518653-70B7-42AB-8622-CAA27B496184') {
                    setLongitudminima(7);
                    setLongitudmaxima(16);
                    setTipocampo('[a-zA-Z0-9]{7,16}');
                    setTipocampovalidacion(/[a-zA-Z0-9]/);
                    setCampo('AlfaNumérico(Numéros y letras)');
                    setTipodocumento('Documento Extranjero');

                    prop(7, 'datosfallecido');
                  }
                  else {
                    if (valorupper === 'C532C358-56AE-4F93-8B9B-344DDF1256B7') {
                      setLongitudminima(9);
                      setLongitudmaxima(9);
                      setTipocampo('[a-zA-Z0-9]{9,9}');
                      setTipocampovalidacion(/[a-zA-Z0-9]/);
                      setCampo('AlfaNumérico(Numéros y letras)');
                      setTipodocumento('Salvoconducto');

                      prop(9, 'datosfallecido');
                    }
                    else {
                      if (valorupper === '6AE7E477-2DE5-4149-8C93-12ACA6668FF0') {
                        setLongitudminima(5);
                        setLongitudmaxima(11);
                        setTipocampo('[a-zA-Z0-9]{5,11}');
                        setTipocampovalidacion(/[a-zA-Z0-9]/);
                        setCampo('AlfaNumérico(Numéros y letras)');
                        setTipodocumento('Adulto Sin Identificar');

                        prop(5, 'datosfallecido');
                      }

                      else {
                        if (valorupper === '5FA5BF3F-B342-4596-933F-0956AE4B9109') {
                          setLongitudminima(5);
                          setLongitudmaxima(12);
                          setTipocampo('[a-zA-Z0-9]{5,12}');
                          setTipocampovalidacion(/[a-zA-Z0-9]/);
                          setCampo('AlfaNumérico(Numéros y letras)');
                          setTipodocumento('Menor Sin Identificar');

                          prop(5, 'datosfallecido');
                        }
                        else {
                          if (valorupper === 'E927B566-7B8E-4B4D-AE26-14454705CB5E') {
                            setLongitudminima(4);
                            setLongitudmaxima(18);
                            setTipocampo('[a-zA-Z0-9]{4,18}');
                            setTipocampovalidacion(/[a-zA-Z0-9]/);
                            setCampo('AlfaNumérico(Numéros y letras)');
                            setTipodocumento('Permiso de Protección Temporal');

                            prop(4, 'datosfallecido');
                          }
                          else {
                            setLongitudminima(4);
                            setLongitudmaxima(16);
                            setTipocampo('[a-zA-Z0-9]{4,16}');
                            setTipocampovalidacion(/[a-zA-Z0-9]/);
                            setCampo('AlfaNuméricos(Numéros y letras)');
                            setTipodocumento('Pasaporte , Cédula de Extranjería y  Tarjeta de Extranjería ');

                            prop(4, 'datosfallecido');
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

  const cambiodocumentoreconocido = (value: any) => {
    const valor: string = value;
    const valorupper = valor.toUpperCase();
    setsininformacionreconocido(false);

    if (valorupper == 'C087D833-3CFB-460F-AA78-E5CF2FE83F25') {
      props.form.setFieldsValue({ IDNumber: undefined });
      setLongitudminimareconocido(5);
      setLongitudmaximareconocido(15);
      setTipocamporeconocido('[a-zA-Z0-9]{0,15}');
      setTipocampovalidacionreconocido(/[a-zA-Z0-9]/);
      setTipodocumentoreconocido('Sin Identificación');
      setCamporeconocido('AlfaNuméricos(Numéros y letras)');
      setsininformacionreconocido(true);

      prop(5, 'reconocido');
    } else {
      if (valorupper == '7C96A4D3-A0CB-484E-A01B-93BC39C7902E') {
        setLongitudminimareconocido(2);
        setLongitudmaximareconocido(10);
        setTipocamporeconocido('[0-9]{2,10}');
        setTipocampovalidacionreconocido(/[0-9]/);
        setCamporeconocido('Numéricos');
        setTipodocumentoreconocido('Número de Protocolo');
        props.form.setFieldsValue({ IDNumber: '8001508610' });

        prop(2, 'reconocido');

      } else {
        props.form.setFieldsValue({ IDNumber: undefined });
        if (valorupper === '7C96A4D3-A0CB-484E-A01B-93BC39C2552E') {
          setLongitudminimareconocido(4);
          setLongitudmaximareconocido(10);
          setTipocamporeconocido('[0-9]{4,10}');
          setTipocampovalidacionreconocido(/[0-9]/);
          setCamporeconocido('Numéricos');
          setTipodocumentoreconocido('Cédula de Ciudadanía');

          prop(4, 'reconocido');
        } else {
          if (valorupper === 'AC3629D8-5C87-46CE-A8E2-530B0495CBF6') {
            setLongitudminimareconocido(10);
            setLongitudmaximareconocido(11);
            setTipocamporeconocido('[0-9]{10,11}');
            setTipocampovalidacionreconocido(/[0-9]/);
            setCamporeconocido('Numéricos');
            setTipodocumentoreconocido('Tarjeta de Identidad ');

            prop(10, 'reconocido');
          } else {
            if (valorupper === '2491BC4B-8A60-408F-9FD1-136213F1E4FB') {
              setLongitudminimareconocido(15);
              setLongitudmaximareconocido(15);
              setTipocamporeconocido('[0-9]{15,15}');
              setTipocampovalidacionreconocido(/[0-9]/);
              setCamporeconocido('Numéricos');
              setTipodocumentoreconocido('Permiso Especial de Permanencia');

              prop(15, 'reconocido');
            } else {
              if (valorupper === 'FFE88939-06D5-486C-887C-E52D50B7F35D' ||
                valorupper === '71F659BE-9D6B-4169-9EE2-E70BF0D65F92' ||
                valorupper === '97F5657D-D8EC-48EF-BBE3-1BABEFECB1A4') {
                setLongitudminimareconocido(10);
                setLongitudmaximareconocido(11);
                setTipocamporeconocido('[a-zA-Z0-9]{10,11}');
                setTipocampovalidacionreconocido(/[a-zA-Z0-9]/);
                setCamporeconocido('AlfaNuméricos(Numéros y letras)');
                setTipodocumentoreconocido('Registro Civil de Nacimiento , Numero único de identificacíon personal y Carné Diplomatico');

                prop(10, 'reconocido');
              } else {
                if (valorupper === '0D69523B-4676-4E3D-8A3D-C6800A3ACF3E') {
                  setLongitudminimareconocido(6);
                  setLongitudmaximareconocido(16);
                  setTipocamporeconocido('[0-9]{6,16}');
                  setTipocampovalidacionreconocido(/[0-9]/);
                  setCamporeconocido('Numéricos');
                  setTipodocumentoreconocido('Certificado de nacido vivo ');

                  prop(6, 'reconocido');
                }
                else {
                  if (valorupper === '60518653-70B7-42AB-8622-CAA27B496184') {
                    setLongitudminimareconocido(7);
                    setLongitudmaximareconocido(16);
                    setTipocamporeconocido('[a-zA-Z0-9]{7,16}');
                    setTipocampovalidacionreconocido(/[a-zA-Z0-9]/);
                    setCamporeconocido('AlfaNumérico(Numéros y letras)');
                    setTipodocumentoreconocido('Documento Extranjero');

                    prop(7, 'reconocido');
                  }
                  else {
                    if (valorupper === 'C532C358-56AE-4F93-8B9B-344DDF1256B7') {
                      setLongitudminimareconocido(9);
                      setLongitudmaximareconocido(9);
                      setTipocamporeconocido('[a-zA-Z0-9]{9,9}');
                      setTipocampovalidacionreconocido(/[a-zA-Z0-9]/);
                      setCamporeconocido('AlfaNumérico(Numéros y letras)');
                      setTipodocumentoreconocido('Salvoconducto');

                      prop(9, 'reconocido');
                    }
                    else {
                      if (valorupper === '6AE7E477-2DE5-4149-8C93-12ACA6668FF0') {
                        setLongitudminimareconocido(5);
                        setLongitudmaximareconocido(11);
                        setTipocamporeconocido('[a-zA-Z0-9]{5,11}');
                        setTipocampovalidacionreconocido(/[a-zA-Z0-9]/);
                        setCamporeconocido('AlfaNumérico(Numéros y letras)');
                        setTipodocumentoreconocido('Adulto Sin Identificar');

                        prop(5, 'reconocido');
                      }

                      else {
                        if (valorupper === '5FA5BF3F-B342-4596-933F-0956AE4B9109') {
                          setLongitudminimareconocido(5);
                          setLongitudmaximareconocido(12);
                          setTipocamporeconocido('[a-zA-Z0-9]{5,12}');
                          setTipocampovalidacionreconocido(/[a-zA-Z0-9]/);
                          setCamporeconocido('AlfaNumérico(Numéros y letras)');
                          setTipodocumentoreconocido('Menor Sin Identificar');

                          prop(5, 'reconocido');
                        }
                        else {
                          if (valorupper === 'E927B566-7B8E-4B4D-AE26-14454705CB5E') {
                            setLongitudminimareconocido(4);
                            setLongitudmaximareconocido(18);
                            setTipocamporeconocido('[a-zA-Z0-9]{4,18}');
                            setTipocampovalidacionreconocido(/[a-zA-Z0-9]/);
                            setCamporeconocido('AlfaNumérico(Numéros y letras)');
                            setTipodocumentoreconocido('Permiso de Protección Temporal');

                            prop(4, 'reconocido');
                          }
                          else {
                            setLongitudminimareconocido(4);
                            setLongitudmaximareconocido(16);
                            setTipocamporeconocido('[a-zA-Z0-9]{4,16}');
                            setTipocampovalidacion(/[a-zA-Z0-9]/);
                            setCamporeconocido('AlfaNuméricos(Numéros y letras)');
                            setTipodocumentoreconocido('Pasaporte , Cédula de Extranjería y  Tarjeta de Extranjería ');

                            prop(4, 'reconocido');
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


  return (
    <>
      {tipo === 'individual' ? (
        <>
          {reconocido && (
            <>
              <Divider orientation='right'>Reconocido como...</Divider>

              <Form.Item label='Nombre' name='knownName'
                initialValue={obj?.reconocidocomo.length > 0 ?
                  obj?.reconocidocomo[0].name : null}
                rules={[{ required: true, max: 50 }]}>
                <Input
                  allowClear
                  placeholder='Primer Nombre'
                  autoComplete='off'
                  type='text'
                  disabled={origen === 'modificacion' || origen === 'ciudadano'}
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
              <Form.Item label='Segundo Nombre' name='knownsecondName'
                initialValue={obj?.reconocidocomo.length > 0 ?
                  obj?.reconocidocomo[0].secondName : null}
                rules={[{ max: 50 }]}>
                <Input
                  allowClear
                  placeholder='Segundo Nombre'
                  autoComplete='off'
                  type='text'
                  disabled={origen === 'modificacion' || origen === 'ciudadano'}
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
              <Form.Item
                label='Primer Apellido'
                name='knownsurName'
                initialValue={obj?.reconocidocomo.length > 0 ?
                  obj?.reconocidocomo[0].surname : null}

                rules={[{ required: true, max: 50 }]}
              >
                <Input
                  allowClear
                  placeholder='Primer Apellido'
                  autoComplete='off'
                  type='text'
                  disabled={origen === 'modificacion' || origen === 'ciudadano'}
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
              <Form.Item
                label='Segundo Apellido'
                name='knownsecondsurName'
                initialValue={obj?.reconocidocomo.length > 0 ?
                  obj?.reconocidocomo[0].secondSurname : null}
                rules={[{ max: 50 }]}

              >
                <Input
                  allowClear
                  placeholder='Segundo Apellido'
                  autoComplete='off'
                  disabled={origen === 'modificacion' || origen === 'ciudadano'}
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



              <Form.Item label='Tipo Identificación' initialValue={obj?.reconocidocomo.length > 0 ?
                obj?.reconocidocomo[0].tipoid
                : '7c96a4d3-a0cb-484e-a01b-93bc39c2552e'}
                rules={[{ required: true }]} name='knownIDType'>
                <SelectComponent
                  disabled={origen === 'modificacion' || origen === 'ciudadano'}
                  options={l_tipos_documento}
                  onChange={cambiodocumentoreconocido}
                  optionPropkey='id'
                  optionPropLabel='descripcion'
                />
              </Form.Item>

              <Form.Item label='Número de Identificación'
                initialValue={obj?.reconocidocomo.length > 0 ?
                  obj?.reconocidocomo[0].numeroid : null}
                rules={[{ required: !sininformacionreconocido }]} name='knownIDNumber'>
                <Input
                  allowClear
                  type='text'
                  placeholder='Número Identificación'
                  autoComplete='off'
                  disabled={origen === 'modificacion' || origen === 'ciudadano'}
                  pattern={tipocamporeconocido}
                  maxLength={longitudmaximareconocido}
                  onKeyPress={(event) => {
                    if (!tipocampovalidacionreconocido.test(event.key)) {
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
                        'Sección:Reconocido como \n recuerde que para el tipo de documento:' +
                        tipodocumentoreconocido +
                        ' solo se admiten valores ' +
                        camporeconocido +
                        ' de longitud entre ' +
                        longitudminimareconocido +
                        ' y ' +
                        longitudmaximareconocido
                    });
                  }}
                />
              </Form.Item>


            </>
          )}
          <Divider orientation='right'>Datos del Fallecido</Divider>
          {mostrar && (
            <div className='row ml-5'>
              <div className='col-lg-12 col-sm-12 col-md-12 text-center'>
                <Button type='primary' htmlType='button' onClick={() => esReconocido()}>
                  Actualizar id.Fallecido
                </Button>
              </div>
            </div>)}



          <Form.Item label='Primer Nombre' name='name' rules={[{ required: true, max: 50 }]} initialValue={obj?.name}>
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
          </Form.Item>
          <Form.Item
            label='Segundo Nombre'
            name='secondName'
            rules={[{ required: false, max: 50 }]}
            initialValue={obj?.secondName}
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
          </Form.Item>
          <Form.Item
            label='Primer Apellido'
            name='surname'
            rules={[{ required: true, max: 50 }]}
            initialValue={obj?.surname}
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
          </Form.Item>
          <Form.Item
            label='Segundo Apellido'
            name='secondSurname'
            rules={[{ required: false, max: 50 }]}
            initialValue={obj?.secondSurname}
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
          <Form.Item
            label='Nacionalidad'
            name='nationalidad'
            initialValue={obj?.nacionalidad ? obj?.nacionalidad : '1e05f64f-5e41-4252-862c-5505dbc3931c'}
            rules={[{ required: true }]}
          >
            <SelectComponent
              options={l_paises}
              placeholder='-- Elija una nacionalidad --'
              optionPropkey='id'
              optionPropLabel='descripcion'
            />
          </Form.Item>
          <Form.Item label='Segunda Nacionalidad' name='nationalidad2' rules={[{ required: false }]}>
            <SelectComponent
              options={l_paises}
              placeholder='-- Elija una o varias --'
              optionPropkey='id'
              optionPropLabel='descripcion'
            />
          </Form.Item>
          <div className='form-row ml-4'>
            {tipodocumentohoranacimiento == '0d69523b-4676-4e3d-8a3d-c6800a3acf3e' && (
              <>
                <Form.Item label='Hora' name='timenac' style={{ width: 380 }}>
                  <DatepickerComponent
                    picker='time'
                    dateDisabledType='default'
                    onChange={compararfecha}
                    dateFormatType='time'
                    placeholder='-- Elija una hora --'
                    style={{ width: 100 }}
                  />
                </Form.Item>
              </>
            )}

            <Form.Item
              label='Fecha de Nacimiento'
              style={{ width: tipodocumentohoranacimiento == '0d69523b-4676-4e3d-8a3d-c6800a3acf3e' ? 400 : 750 }}
              name='dateOfBirth'
              rules={[{ required: true }]}
              initialValue={date}
            >
              <DatepickerComponent
                picker='date'
                onChange={compararfecha}
                dateDisabledType='before'
                dateFormatType='default'
                style={{ width: tipodocumentohoranacimiento == '0d69523b-4676-4e3d-8a3d-c6800a3acf3e' ? 200 : 530 }}
                value={date}
              />
            </Form.Item>
          </div>
          <Form.Item
            label='Tipo Identificación'
            name='IDType'
            initialValue={obj?.IDType ? obj?.IDType : '7c96a4d3-a0cb-484e-a01b-93bc39c2552e'}
            rules={[{ required: true }]}
          >
            <SelectComponent
              options={l_tipos_documento}
              onChange={cambiodocumento}
              optionPropkey='id'
              optionPropLabel='descripcion'
            />
          </Form.Item>
          <Form.Item label='Número de Identificación'
            initialValue={obj?.IDNumber} name='IDNumber' rules={[{ required: !sininformacion }]}>
            <Input
              style={{ width: '90%' }}
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
          </Form.Item>
          <Form.Item
            label='Estado Civil'
            name='civilStatus'
            initialValue={obj?.civilStatus ?? '4c17996a-7113-4e17-a0fe-6fd7cd9bbcd1'}
          >
            <SelectComponent options={l_estado_civil} optionPropkey='id' optionPropLabel='descripcion' />
          </Form.Item>
          <Form.Item
            label='Nivel Educativo'
            name='educationLevel'
            initialValue={obj?.educationLevel ?? '07ebd0bb-2b00-4a2b-8db5-4582eee1d285'}
          >
            <SelectComponent options={l_nivel_educativo} optionPropkey='id' optionPropLabel='descripcion' />
          </Form.Item>

          <Form.Item label='Etnia' name='etnia' initialValue={obj?.etnia ?? '60875c52-9b2a-4836-8bc7-2f3648f41f57'}>
            <SelectComponent options={l_etnia} optionPropkey='id' optionPropLabel='descripcion' />
          </Form.Item>

          <Form.Item label='Régimen' name='regimen' initialValue={obj?.regime ?? '848c6d53-6bda-4596-a889-8fdb0292f9e4'}>
            <SelectComponent options={l_regimen} optionPropkey='id' optionPropLabel='descripcion' />
          </Form.Item>

          <Form.Item
            label='Tipo de Muerte'
            name='deathType'
            initialValue={obj?.deathType ?? '475c280d-67af-47b0-a8bc-de420f6ac740'}
            rules={[{ required: true }]}
          >
            <SelectComponent options={l_tipo_muerte} optionPropkey='id' optionPropLabel='descripcion' />
          </Form.Item>
        </>
      ) :
        <>
          {reconocido && (
            <>
              <Divider orientation='right'>Reconocido como...</Divider>

              <Form.Item label='Nombre' name='knownName'
                initialValue={obj?.reconocidocomo.length > 0 ?
                  obj?.reconocidocomo[0].name : null}
                rules={[{ required: true, max: 50 }]}>
                <Input
                  allowClear
                  placeholder='Primer Nombre'
                  autoComplete='off'
                  type='text'
                  disabled={origen === 'modificacion' || origen === 'ciudadano'}
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
              <Form.Item label='Segundo Nombre' name='knownsecondName'
                initialValue={obj?.reconocidocomo.length > 0 ?
                  obj?.reconocidocomo[0].secondName : null}
                rules={[{ max: 50 }]}>
                <Input
                  allowClear
                  placeholder='Segundo Nombre'
                  autoComplete='off'
                  type='text'
                  disabled={origen === 'modificacion' || origen === 'ciudadano'}
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
              <Form.Item
                label='Primer Apellido'
                name='knownsurName'
                initialValue={obj?.reconocidocomo.length > 0 ?
                  obj?.reconocidocomo[0].surname : null}

                rules={[{ required: true, max: 50 }]}
              >
                <Input
                  allowClear
                  placeholder='Primer Apellido'
                  autoComplete='off'
                  type='text'
                  disabled={origen === 'modificacion' || origen === 'ciudadano'}
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
              <Form.Item
                label='Segundo Apellido'
                name='knownsecondsurName'
                initialValue={obj?.reconocidocomo.length > 0 ?
                  obj?.reconocidocomo[0].secondSurname : null}
                rules={[{ max: 50 }]}

              >
                <Input
                  allowClear
                  placeholder='Segundo Apellido'
                  autoComplete='off'
                  disabled={origen === 'modificacion' || origen === 'ciudadano'}
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



              <Form.Item label='Tipo Identificación' initialValue={obj?.reconocidocomo.length > 0 ?
                obj?.reconocidocomo[0].tipoid
                : '7c96a4d3-a0cb-484e-a01b-93bc39c2552e'}
                rules={[{ required: true }]} name='knownIDType'>
                <SelectComponent
                  options={l_tipos_documento}
                  onChange={cambiodocumentoreconocido}
                  optionPropkey='id'
                  disabled={origen === 'modificacion' || origen === 'ciudadano'}
                  optionPropLabel='descripcion'
                />
              </Form.Item>

              <Form.Item label='Número de Identificación'
                initialValue={obj?.reconocidocomo.length > 0 ?
                  obj?.reconocidocomo[0].numeroid : null}
                rules={[{ required: !sininformacionreconocido }]} name='knownIDNumber'>
                <Input
                  allowClear
                  type='text'
                  placeholder='Número Identificación'
                  autoComplete='off'
                  disabled={origen === 'modificacion' || origen === 'ciudadano'}
                  pattern={tipocamporeconocido}
                  maxLength={longitudmaximareconocido}
                  onKeyPress={(event) => {
                    if (!tipocampovalidacionreconocido.test(event.key)) {
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
                        'Sección:Reconocido como \n recuerde que para el tipo de documento:' +
                        tipodocumentoreconocido +
                        ' solo se admiten valores ' +
                        camporeconocido +
                        ' de longitud entre ' +
                        longitudminimareconocido +
                        ' y ' +
                        longitudmaximareconocido
                    });
                  }}
                />
              </Form.Item>


            </>
          )}
          <Divider orientation='right'> INFORMACIÓN DE LA MADRE</Divider>
          {mostrar && (
            <div className='row ml-5'>
              <div className='col-lg-12 col-sm-12 col-md-12 text-center'>
                <Button type='primary' htmlType='button' onClick={() => esReconocido()}>
                  Actualizar id.Madre
                </Button>
              </div>
            </div>)}




          <Form.Item
            label='Primer Nombre'
            name='namemother'
            initialValue={obj?.namemother}
            rules={[{ required: true, max: 50 }]}
          >
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
          </Form.Item>
          <Form.Item label='Segundo Nombre' name='secondNamemother' initialValue={obj?.secondNamemother} rules={[{ max: 50 }]}>
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
          </Form.Item>
          <Form.Item
            label='Primer Apellido'
            name='surnamemother'
            initialValue={obj?.surnamemother}
            rules={[{ required: true, max: 50 }]}
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
          </Form.Item>
          <Form.Item
            label='Segundo Apellido'
            name='secondSurnamemother'
            rules={[{ max: 50 }]}
            initialValue={obj?.secondSurnamemother}
          >
            <Input
              allowClear
              placeholder='Segundo Apellido'
              autoComplete='off'
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
          <Form.Item
            label='Tipo Identificación'
            name='IDType'
            rules={[{ required: true }]}
            initialValue={obj?.IDType ?? '7c96a4d3-a0cb-484e-a01b-93bc39c2552e'}
          >
            <SelectComponent
              options={l_tipos_documentofetal}
              optionPropkey='id'
              onChange={cambiodocumento}
              optionPropLabel='descripcion'
            />
          </Form.Item>
          <Form.Item label='Número de Identificación'
            initialValue={obj !== undefined ? obj?.IDNumber.toString().substring(3, obj?.IDNumber.length) : null}
            name='IDNumber' rules={[{ required: !sininformacion }]}>
            <Input
              style={{ width: '90%' }}
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
                    'Sección:INFORMACIÓN DE LA MADRE \n recuerde que para el tipo de documento: ' +
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
          </Form.Item>


          <Form.Item
            label='Nacionalidad de la Madre'
            name='nationalidadmother'
            initialValue={obj?.nationalidadmother ?? idColombia}
            rules={[{ required: true }]}
          >
            <SelectComponent
              options={l_paises}
              placeholder='-- Elija una --'
              optionPropkey='id'
              optionPropLabel='descripcion'
            />
          </Form.Item>
          <Form.Item label='Segunda Nacionalidad' name='nationalidad2' rules={[{ required: false }]}>
            <SelectComponent
              options={l_paises}
              placeholder='-- Elija una --'
              optionPropkey='id'
              optionPropLabel='descripcion'
            />
          </Form.Item>

          <Form.Item
            label='Estado Civil'
            name='civilStatusmother'
            initialValue={obj?.civilStatus ?? '4c17996a-7113-4e17-a0fe-6fd7cd9bbcd1'}
          >
            <SelectComponent options={l_estado_civil} optionPropkey='id' optionPropLabel='descripcion' />
          </Form.Item>
          <Form.Item
            label='Nivel Educativo'
            name='educationLevelmother'
            initialValue={obj?.educationLevel ?? '07ebd0bb-2b00-4a2b-8db5-4582eee1d285'}
          >
            <SelectComponent options={l_nivel_educativo} optionPropkey='id' optionPropLabel='descripcion' />
          </Form.Item>
          <Form.Item label='Etnia' name='etniamother' initialValue={obj?.etnia ?? '60875c52-9b2a-4836-8bc7-2f3648f41f57'}>
            <SelectComponent options={l_etnia} optionPropkey='id' optionPropLabel='descripcion' />
          </Form.Item>

          {obj != undefined && (
            <Form.Item
              label='Tipo de Muerte'
              name='deathType'
              initialValue={obj?.deathType ?? '475c280d-67af-47b0-a8bc-de420f6ac740'}
              rules={[{ required: true }]}
            >
              <SelectComponent options={l_tipo_muerte} optionPropkey='id' optionPropLabel='descripcion' />
            </Form.Item>
          )}

          <Divider orientation='right'> RESIDENCIA HABITUAL DE LA MADRE</Divider>
          <Form.Item
            label='País de Residencia'
            name='pais'
            initialValue={obj?.residencia ?? idColombia}
            rules={[{ required: true }]}
          >
            <SelectComponent options={l_paises} optionPropkey='id' optionPropLabel='descripcion' onChange={onChangePais} />
          </Form.Item>

          <Form.Item
            label='Departamento de Residencia'
            initialValue={obj?.idDepartamentoResidencia ?? idDepartamentoBogota}
            name='departamento'
            rules={[{ required: isColombia }]}
          >
            <SelectComponent
              options={l_departamentos}
              optionPropkey='idDepartamento'
              optionPropLabel='descripcion'
              disabled={!isColombia}
              onChange={onChangeDepartamento}
            />
          </Form.Item>

          {isColombia ? (
            <Form.Item label='Ciudad de Residencia' initialValue={obj?.idCiudadResidencia ?? idBogotac} name='ciudad' rules={[{ required: true }]}>
              <SelectComponent
                options={l_municipios}
                optionPropkey='idMunicipio'
                optionPropLabel='descripcion'
                onChange={onChangeMunicipio}
              //value={idBogotac}
              //searchValue={idBogotac}
              />
            </Form.Item>
          ) : (
            <Form.Item
              label='Ciudad de Residencia'
              name='ciudadfuera'
              initialValue={obj?.ciudad}
              rules={[{ required: true }]}
            >
              <Input
                allowClear
                placeholder='Ciudad'
                autoComplete='off'
                onKeyPress={(event) => {
                  if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
              />
            </Form.Item>
          )}

          <Form.Item
            label='Localidad de Residencia'
            initialValue={obj?.idLocalidadResidencia ?? idlocalidad}
            name='localidad'
            rules={[{ required: isBogota }]}
          >
            <SelectComponent
              options={l_localidades}
              optionPropkey='idLocalidad'
              optionPropLabel='descripcion'
              disabled={!isBogota}
              onChange={onChangeLocalidad}
            />
          </Form.Item>

          <Form.Item
            label='Área de Residencia'
            initialValue={obj?.idAreaResidencia ?? idupz}
            name='area'
            rules={[{ required: isBogota }]}
          >
            <SelectComponent
              options={l_areas}
              defaultValue={idupz}
              optionPropkey='idUpz'
              optionPropLabel='descripcion'
              disabled={!isBogota}
              onChange={onChangeArea}
            />
          </Form.Item>

          <Form.Item
            label='Barrio de Residencia'
            initialValue={obj?.idBarrioResidencia ?? idbarrio}
            name='barrio'
            rules={[{ required: isBogota }]}
          >
            <SelectComponent
              options={l_barrios}
              defaultValue={idbarrio}
              optionPropkey='idBarrio'
              optionPropLabel='descripcion'
              disabled={!isBogota}
            />
          </Form.Item>
        </>
      }

    </>
  )


}

interface IndividualProps<T> {
  form: FormInstance<T>;
  obj: any;
  tipo: string;
  prop: any;
  fechanacimiento: any;
  tipodocumentoseleccionado: any;
  origen: string;
}
export const KeysForm = [
  'name',
  'secondName',
  'surname',
  'secondSurname',
  'nationalidad',
  'dateOfBirth',
  'IDType',
  'IDNumber',
  'civilStatus',
  'educationLevel',
  'etnia',
  'age',
  'unitAge',
  'regime',
  'knownIDType',
  'knownIDNumber',
  'knownName',
  'deathType',
  'pais',
  'departamento',
  'ciudad',
  'localidad',
  'area',
  'barrio'


];
