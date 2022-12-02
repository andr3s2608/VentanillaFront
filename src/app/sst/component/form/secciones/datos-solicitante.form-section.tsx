import React, {useCallback, useEffect, useState} from 'react';
import Form, {FormInstance} from 'antd/es/form';
import Divider from 'antd/es/divider';
import {SelectComponent} from '../../../../shared/components/inputs/select.component';
import Input from 'antd/es/input';
import Swal from 'sweetalert2';
import {dominioService, ETipoDominio, IDepartamento, IDominio, IMunicipio} from '../../../../services/dominio.service';
import {ApiService} from '../../../../services/Apis.service';
/*
export const DatosSolicitanteSSTFormSeccion: React.FC<IDatosSolicitanteSSTProps<any>> = (props) => {

  const objJosn: any = undefined;
  const [form] = Form.useForm<any>();
  const [direccionCompleta, setDireccionCompleta] = useState<string>('');
  const [stateDisplayBox, setStateDisplayBox] = useState<string>('none');
  const [stateDisplayButton, setStateDisplayButton] = useState<string>('inline');
  const history = useHistory();
  const [form] = Form.useForm<any>();
  const [isColombia, setIsColombia] = useState(true);
  const [sex, setSex] = useState<[]>([]);
  const [genero, setGenero] = useState<[]>([]);
  const [orientacion, setOrientacion] = useState<[]>([]);
  const [etniastate, setEtnia] = useState<[]>([]);
  const [nivelEducativo, setNivelEducativo] = useState<[]>([]);
  const [l_municipios, setLMunicipios] = useState<IMunicipio[]>([]);
  const [l_municipiosres, setLMunicipiosres] = useState<IMunicipio[]>([]);
  const [[l_departamentos_colombia, l_paises], setListas] = useState<[IDepartamento[], []]>([[], []]);
  const [avenida, setAvenida] = useState<boolean>(true);
  const [listOfZona, setListOfZona] = useState<Array<Object>>([{ descripcion: 'id1', value: 'default' }]);
  const [listOfLocalidad, setListOfLocalidad] = useState<Array<Object>>([{ descripcion: 'id1', value: 'default' }]);
  const [listOfUPZ, setListOfUPZ] = useState<Array<Object>>([{ descripcion: 'id1', value: 'default' }]);
  const [listOfBarrio, setListOfBarrio] = useState<Array<Object>>([{ descripcion: 'id1', value: 'default' }]);
  const [initialValueZona, setInitialValueZona] = useState<any>('NORTE');
  const [initialValueLocalidad, setInitialValueLocalidad] = useState<any>('BOSA');
  const [initialValueUPZ, setInitialValueUPZ] = useState<any>('AMERICAS');
  const [initialValueBarrio, setInitialValueBarrio] = useState<any>('ACACIAS USAQUEN');
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [ciudadBogota, setciudadBogota] = useState<string>('Bogotá D.C.');
  const [ciudadBogota2, setciudadBogota2] = useState<string>('Bogotá D.C.');

  const idColombia = '170';
  const idDepartamentoBogota = '31b870aa-6cd0-4128-96db-1f08afad7cdd';
  const getListas = useCallback(
    async () => {
      const departamento: any = localStorage.getItem('departamentos');
      const municipiosbogota: any = localStorage.getItem('municipiosbogota');
      const [municipios, ...resp] = await Promise.all([JSON.parse(municipiosbogota), JSON.parse(departamento), api.getPaises()]);

      setLMunicipios(municipios);
      setLMunicipiosres(municipios);
      setListas(resp);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  store.subscribe(() => {
    const { direccion } = store.getState();
    setDireccionCompleta(direccion.join(' '));
  });

  const getListas2 = useCallback(
    async () => {
      const [etnia, sexo, genero, orientacion, educacion] = await Promise.all([
        api.GetEtnia(),
        api.GetSexoazure(),
        api.GetGeneroonazure(),
        api.GetOrientacionazure(),
        api.GetNivelEducativo()
      ]);
      setEtnia(etnia);
      setSex(sexo);
      setGenero(genero);
      setOrientacion(orientacion);
      setNivelEducativo(educacion);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onChangePais = (value: string) => {
    setIsColombia(value === idColombia);

    if (isColombia) {
      form.setFieldsValue({ state: 1, city: 11001000 });
    }

    form.setFieldsValue({ state: undefined, city: undefined, cityLive: undefined });
  };
  const onChangeDepartamento = async (value: string) => {
    form.setFieldsValue({ cityLive: undefined });

    let departamento = l_departamentos_colombia.filter((i) => i.idDepPai == parseInt(value));
    const { idDepartamento } = departamento[0];

    const resp = await dominioService.get_all_municipios_by_departamento(idDepartamento);
    setLMunicipios(resp);

    if (value == '1') {
      setciudadBogota('Bogotá D.C.');
    } else {
      setciudadBogota('');
    }
  };

  const onChangeDepartamentor = async (value: string) => {
    form.setFieldsValue({ city: undefined });

    let departamento = l_departamentos_colombia.filter((i) => i.idDepPai == parseInt(value));
    const { idDepartamento } = departamento[0];

    const resp = await dominioService.get_all_municipios_by_departamento(idDepartamento);
    setLMunicipiosres(resp);
    if (value == '1') {
      setciudadBogota2('Bogotá D.C.');
      setStateDisplayButton('inline');
    } else {
      setciudadBogota2('');
      setStateDisplayButton('none');
      setStateDisplayBox('none');
    }
  };

  useEffect(() => {
    getListas();
    getListas2();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goBack = () => {
    history.goBack();
  };


  // validacion Tipo de documento//
  const cambiodocumento = (value: any) => {
    const valor: string = value;
    settipodocumentohoranacimiento(valor);

    const valorupper = valor.toUpperCase();
    setsininformacion(false);

    if (valorupper == 'C087D833-3CFB-460F-AA78-E5CF2FE83F25') {
      form.setFieldsValue({ IDNumber: undefined });
      setLongitudminima(0);
      setLongitudmaxima(15);
      setTipocampo('[a-zA-Z0-9]{0,15}');
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
        form.setFieldsValue({ IDNumber: '8001508610' });
      } else {
        form.setFieldsValue({ IDNumber: undefined });
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
                  setLongitudmaxima(16);
                  setTipocampo('[0-9]{6,16}');
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
                            setLongitudminima(4);
                            setLongitudmaxima(16);
                            setTipocampo('[a-zA-Z0-9]{4,16}');
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

  //#endregion
  return (
    <>
      <Divider orientation='right'>Datos del solicitante</Divider>
      <Form.Item
        label='Tipo Identificación'
        name='IDType'
        initialValue={objJosn?.IDType ? objJosn?.IDType : '7c96a4d3-a0cb-484e-a01b-93bc39c2552e'}
        rules={[{ required: true }]}
      >
        <SelectComponent
          options={l_tipos_documento}
          onChange={cambiodocumento}
          optionPropkey='id'
          optionPropLabel='descripcion'
        />
      </Form.Item>
      <Form.Item label='Número de Identificación' name='IDNumber' rules={[{ required: !sininformacion }]}>
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
                'Sección:DATOS PERSONALES \n recuerde que para el tipo de documento: ' +
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
      <Form.Item label='Primer Nombre' name='name' rules={[{ required: true, max: 50 }]} initialValue={objJosn?.name}>
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
        initialValue={objJosn?.secondName}
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
        initialValue={objJosn?.surname}
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
        initialValue={objJosn?.secondSurname}
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
        label='Departamento'
        name='state'
        rules={[{ required: true}]}
      >
        <SelectComponent
          options={l_departamentos_colombia}
          optionPropkey='idDepartamento'
          optionPropLabel='descripcion'
          onChange={onChangeDepartamento}
        />
      </Form.Item>

      <Form.Item
        label='Municipio'
        name='city'
        rules={[{ required: true}]}
      >
        <SelectComponent
          options={l_municipios}
          value={ciudadBogota}
          searchValue={ciudadBogota}
          optionPropkey='idMunicipio'
          optionPropLabel='descripcion'
          //disabled={!isBogota}
        />
      </Form.Item>
    </>
  );
}

interface IDatosSolicitanteSSTProps<T> {
  form: FormInstance<T>;
  required: boolean;
  obj: any;
}
*/
