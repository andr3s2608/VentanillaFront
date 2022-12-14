import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form, { FormInstance } from 'antd/es/form';
import Input from 'antd/es/input';
import Radio, { RadioChangeEvent } from 'antd/es/radio';
import Divider from 'antd/es/divider';

// Components
import { DatepickerComponent } from 'app/shared/components/inputs/datepicker.component';
import { SelectComponent } from 'app/shared/components/inputs/select.component';

// Servicios
import { IDominio } from 'app/services/dominio.service';
import { TypeLicencia } from 'app/shared/utils/types.util';
import moment from 'moment';
import Swal from 'sweetalert2';
import { ApiService } from 'app/services/Apis.service';
import { authProvider } from 'app/shared/utils/authprovider.util';

export const DeathInstituteFormSeccion: React.FC<IDeathInstituteProps<any>> = (props) => {
  const { obj, tipoLicencia, prop, cambio } = props;
  const isMedicina = obj?.instTipoIdent !== undefined ? true : false;
  const [isMedicinaLegal, setIsMedicinaLegal] = useState<boolean>(isMedicina);
  const { datofiscal } = props;
  const [l_seccionales, setlseccionales] = useState<any[]>([]);
  const [longitudmaxima, setLongitudmaxima] = useState<number>(10);
  const [longitudminima, setLongitudminima] = useState<number>(5);
  const [tipocampo, setTipocampo] = useState<string>('[0-9]{4,10}');
  const [tipocampovalidacion, setTipocampovalidacion] = useState<any>(/[0-9]/);
  const [tipodocumento, setTipodocumento] = useState<string>('Cédula de Ciudadanía');
  const [campo, setCampo] = useState<string>('Numéricos');
  //#region Listados
  const [l_tipos_documento, setListaTipoDocumento] = useState<IDominio[]>([]);

  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);

  const getListas = useCallback(
    async () => {
      const tipos: any = localStorage.getItem('tipoid');
      const tiposjson: any = JSON.parse(tipos);

      const sec = await api.GetSeccionales();
      setlseccionales(sec);
      setListaTipoDocumento(tiposjson);
      if (obj != undefined && obj?.instType === '04e0913b-5d86-4c48-8904-0f504fedb3fd') {
        setIsMedicinaLegal(true);
      }
      else {
        setIsMedicinaLegal(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const defaultValues = {
    identity: 'a7a1b90b-8f29-4509-8220-a95f567e6fcb',
    businessName: 'INSTITUTO NACIONAL DE MEDICINA LEGAL Y CIENCIAS FORENCES',
    identification: '8001508610'
  };

  const fechaActa = moment(obj?.instFechaActa);

  //#endregion
  const onChangeTipoInst = (e: RadioChangeEvent) => {

    cambio();
    props.form.resetFields([
      'instNumProtocolo',
      'instNumActaLevantamiento',
      'instFechaActa',
      'instSeccionalFiscalia',
      'instNombreFiscal',
      'instNoFiscal',
      'instNoOficioMedicinaLegal',
      'instYearOficioMedicinaLegal'
    ]);

    setIsMedicinaLegal(e.target.value === '04e0913b-5d86-4c48-8904-0f504fedb3fd');
  };
  //validacion Tipo de documento//
  const cambiodocumento = (value: any) => {
    props.form.setFieldsValue({ instNumIdent: undefined });
    const valor: string = value;
    const valorupper = valor.toUpperCase();

    if (valorupper === '7C96A4D3-A0CB-484E-A01B-93BC39C2552E') {
      setLongitudminima(4);
      setLongitudmaxima(10);
      setTipocampo('[0-9]{4,10}');
      setTipocampovalidacion(/[0-9]/);
      setCampo('Numéricos');
      setTipodocumento('Cédula de Ciudadanía');
      prop(4, 'deathinst');
    } else {
      if (valorupper === 'AC3629D8-5C87-46CE-A8E2-530B0495CBF6') {
        setLongitudminima(10);
        setLongitudmaxima(11);
        setTipocampo('[0-9]{10,11}');
        setTipocampovalidacion(/[0-9]/);
        setCampo('Numéricos');
        setTipodocumento('Tarjeta de Identidad ');
        prop(10, 'deathinst');
      } else {
        if (valorupper === '2491BC4B-8A60-408F-9FD1-136213F1E4FB') {
          setLongitudminima(15);
          setLongitudmaxima(15);
          setTipocampo('[0-9]{15,15}');
          setTipocampovalidacion(/[0-9]/);
          setCampo('Numéricos');
          setTipodocumento('Permiso Especial de Permanencia');
          prop(15, 'deathinst');
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
            prop(10, 'deathinst');
          } else {
            if (valorupper === '0D69523B-4676-4E3D-8A3D-C6800A3ACF3E') {
              setLongitudminima(6);
              setLongitudmaxima(16);
              setTipocampo('[0-9]{6,16}');
              setTipocampovalidacion(/[0-9]/);
              setCampo('Numéricos');
              setTipodocumento('Certificado de nacido vivo ');
              prop(6, 'deathinst');
            }
            else {
              if (valorupper === '60518653-70B7-42AB-8622-CAA27B496184') {
                setLongitudminima(7);
                setLongitudmaxima(16);
                setTipocampo('[a-zA-Z0-9]{7,16}');
                setTipocampovalidacion(/[a-zA-Z0-9]/);
                setCampo('AlfaNumérico(Numéros y letras)');
                setTipodocumento('Documento Extranjero');
                prop(7, 'deathinst');
              }
              else {
                if (valorupper === 'C532C358-56AE-4F93-8B9B-344DDF1256B7') {
                  setLongitudminima(9);
                  setLongitudmaxima(9);
                  setTipocampo('[a-zA-Z0-9]{9,9}');
                  setTipocampovalidacion(/[a-zA-Z0-9]/);
                  setCampo('AlfaNumérico(Numéros y letras)');
                  setTipodocumento('Salvoconducto');
                  prop(9, 'deathinst');
                }
                else {
                  if (valorupper === '6AE7E477-2DE5-4149-8C93-12ACA6668FF0') {
                    setLongitudminima(5);
                    setLongitudmaxima(11);
                    setTipocampo('[a-zA-Z0-9]{5,11}');
                    setTipocampovalidacion(/[a-zA-Z0-9]/);
                    setCampo('AlfaNumérico(Numéros y letras)');
                    setTipodocumento('Adulto Sin Identificar');
                    prop(5, 'deathinst');
                  }

                  else {
                    if (valorupper === '5FA5BF3F-B342-4596-933F-0956AE4B9109') {
                      setLongitudminima(5);
                      setLongitudmaxima(12);
                      setTipocampo('[a-zA-Z0-9]{5,12}');
                      setTipocampovalidacion(/[a-zA-Z0-9]/);
                      setCampo('AlfaNumérico(Numéros y letras)');
                      setTipodocumento('Menor Sin Identificar');
                      prop(5, 'deathinst');
                    }
                    else {
                      if (valorupper === 'E927B566-7B8E-4B4D-AE26-14454705CB5E') {
                        setLongitudminima(4);
                        setLongitudmaxima(18);
                        setTipocampo('[a-zA-Z0-9]{4,18}');
                        setTipocampovalidacion(/[a-zA-Z0-9]/);
                        setCampo('AlfaNumérico(Numéros y letras)');
                        setTipodocumento('Permiso de Protección Temporal');
                        prop(4, 'deathinst');
                      }
                      else {
                        setLongitudminima(4);
                        setLongitudmaxima(16);
                        setTipocampo('[a-zA-Z0-9]{4,16}');
                        setTipocampovalidacion(/[a-zA-Z0-9]/);
                        setCampo('AlfaNuméricos(Numéros y letras)');
                        setTipodocumento('Pasaporte , Cédula de Extranjería y  Tarjeta de Extranjería ');
                        prop(6, 'deathinst');
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
      <Divider orientation='right'>Institución que Certifica el Fallecimiento</Divider>
      <Form.Item
        label='Tipo de Institución'
        name='instType'
        rules={[{ required: true }]}
        initialValue={obj?.instType ?? '80d7f664-5bdd-48eb-8b2c-93c1bd648cc8'}
      >
        <Radio.Group onChange={onChangeTipoInst} defaultValue={obj?.instType ?? '80d7f664-5bdd-48eb-8b2c-93c1bd648cc8'}>
          <Radio value='04e0913b-5d86-4c48-8904-0f504fedb3fd'>MEDICINA LEGAL</Radio>
          <Radio value='80d7f664-5bdd-48eb-8b2c-93c1bd648cc8'>OTROS</Radio>
        </Radio.Group>
      </Form.Item>

      {isMedicinaLegal && (
        <div className='fadeInLeft'>
          <Form.Item
            label='Tipo Identificación'
            name='instTipoIdent'
            initialValue={'NIT'}
            rules={[{ required: true }]}
          >
            <SelectComponent
              options={l_tipos_documento}
              onChange={cambiodocumento}
              optionPropkey='id'
              optionPropLabel='descripcion'
              disabled={true}
            />
          </Form.Item>

          <Form.Item
            label='Número Identificación'
            name='instNumIdent'
            initialValue={defaultValues.identification}
            rules={[{ required: true }]}
          >
            <Input
              allowClear
              type='text'
              placeholder='Número Identificación'
              autoComplete='off'
              pattern={tipocampo}
              maxLength={longitudmaxima}
              disabled={true}
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
                    'Sección:Institución que Certifica el Fallecimiento \n recuerde que para el tipo de documento4:' +
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
            label='Razón Social'
            initialValue={defaultValues.businessName}
            name='instRazonSocial'
            rules={[{ required: true }]}
          >
            <Input allowClear placeholder='Nombre de la Razón Social' autoComplete='off' disabled={true} />
          </Form.Item>
          <Form.Item
            label='Número de Protocolo Medicina Legal'
            name='instNumProtocolo'
            initialValue={obj?.instNumProtocolo}
            rules={[{ required: isMedicinaLegal, max: 10 }]}
          >
            <Input
              allowClear
              placeholder='Número de protocolo'
              autoComplete='off'
              type='text'
              maxLength={10}
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              onPaste={(event) => {
                event.preventDefault();
              }}
            />
          </Form.Item>

          {!datofiscal && (
            <>
              <Form.Item
                label='Nombres y Apellidos del Fiscal'
                initialValue={(obj?.instNombreFiscal + obj?.instApellidoFiscal)}
                name='instNombreFiscal'
                rules={[{ required: isMedicinaLegal, max: 200 }]}
              >
                <Input
                  allowClear
                  placeholder='Nombres y apellidos completos'
                  autoComplete='off'
                  type='text'
                  onKeyPress={(event) => {
                    if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onPaste={(event) => {
                    event.preventDefault();
                  }}
                />
              </Form.Item>

              <Form.Item
                initialValue={obj?.instNoOficioMedicinaLegal}
                label='No. Oficio Medicina Legal'
                name='instNoOficioMedicinaLegal'
                rules={[{ required: isMedicinaLegal }]}
              >
                <Input allowClear type='tel' placeholder='No. Oficio Medicina Legal' autoComplete='off' />
              </Form.Item>
              <Form.Item
                label='Año Oficio Medicina Legal'
                name='instYearOficioMedicinaLegal'
                initialValue={obj?.instYearOficioMedicinaLegal}
                rules={[{ required: isMedicinaLegal }]}
              >
                <DatepickerComponent
                  picker='year'
                  dateDisabledType='before'
                  dateFormatType='year'
                  placeholder='-- Elija un año --'
                />
              </Form.Item>
            </>
          )}

          <>
            <Divider orientation='right'>DATOS DEL ACTA NOTARIAL DE LA FISCALÍA</Divider>
            <Form.Item initialValue={obj?.instNumActaLevantamiento} label='Número acta de Levantamiento' name='numeroActLeva' rules={[{ required: false, max: 10 }]}>
              <Input
                allowClear
                placeholder='Nueva acta de Levantamiento'
                autoComplete='off'
                maxLength={10}
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onPaste={(event) => {
                  event.preventDefault();
                }}
              />
            </Form.Item>

            <Form.Item label='Fecha de Acta' initialValue={obj?.instFechaActa === null ? null : moment(obj?.instFechaActa)} required={false} name='DateAct'>
              <DatepickerComponent
                picker='date'
                dateDisabledType='before'
                dateFormatType='default'
                placeholder='-- Elija una fecha --'
              />
            </Form.Item>

            <Form.Item label='Seccional Fiscalia' name='SecFiscalAct' initialValue={obj?.instSeccionalFiscalia} rules={[{ required: false }]}>
              <SelectComponent options={l_seccionales} optionPropkey='DESCRIP' optionPropLabel='DESCRIP' />
            </Form.Item>

            <Form.Item label='No. Fiscal' initialValue={obj?.instNoFiscal} name='NoFiscAct' rules={[{ required: false, max: 5 }]}>
              <Input
                allowClear
                placeholder='No. Fiscal'
                autoComplete='off'
                maxLength={5}
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
              />
            </Form.Item>
            {tipoLicencia === 'Cremación' && (
              <>
                <Divider orientation='right'>DATOS DE CREMACIÓN DEL FISCAL Y MEDICINA LEGAL</Divider>

                <Form.Item label='Nombre' initialValue={obj?.instNombreFiscal} rules={[{ required: true }]} name='fiscalianombreDC'>
                  <Input
                    allowClear
                    placeholder='Nombre'
                    autoComplete='off'
                    maxLength={100}
                    onKeyPress={(event) => {
                      if (!/[a-zA-Z ]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                    }}
                  />
                </Form.Item>

                <Form.Item label='Apellido' initialValue={obj?.instApellidoFiscal} rules={[{ required: true }]} name='fiscaliaapellidoDC'>
                  <Input
                    allowClear
                    placeholder='Apellido'
                    autoComplete='off'
                    maxLength={100}
                    onKeyPress={(event) => {
                      if (!/[a-zA-Z ]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                    }}
                  />
                </Form.Item>

                <Form.Item label='Número de oficio de medicina legal' initialValue={obj?.instNumeroOficio} rules={[{ required: true }]} name='fiscalianumeroDC'>
                  <Input
                    allowClear
                    placeholder='Número de oficio de medicina legal'
                    autoComplete='off'
                    maxLength={10}
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                    }}
                  />
                </Form.Item>

                <Form.Item label='Fecha del Oficio' initialValue={moment(obj?.instFechaOficio)} rules={[{ required: true }]} name='fiscaliafechaDC'>
                  <DatepickerComponent picker='date' dateDisabledType='before' dateFormatType='default' />
                </Form.Item>

                <Form.Item label='No. Fiscal' initialValue={obj?.instNoFiscalMedicinaLegal}
                  rules={[{ required: true }]} name='NoFiscalDC'>
                  <Input
                    allowClear
                    placeholder='numberFiscal'
                    autoComplete='off'
                    maxLength={7}
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                    }}
                  />
                </Form.Item>
              </>
            )}
          </>
        </div>
      )}
    </>
  );
};

export const KeysForm = [
  'instType',
  'instTipoIdent',
  'instNumIdent',
  'instRazonSocial',
  'instNumProtocolo',
  'instNumActaLevantamiento',
  'instFechaActa',
  'instSeccionalFiscalia',
  'instNombreFiscal',
  'instNoFiscal',
  'instNoOficioMedicinaLegal',
  'instYearOficioMedicinaLegal'
];

interface IDeathInstituteProps<T> {
  form: FormInstance<T>;
  datofiscal?: boolean;
  required: boolean;
  tipoLicencia: TypeLicencia;
  obj: any;
  prop: any;
  cambio: any;
}
