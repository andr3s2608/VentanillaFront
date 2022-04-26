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
import { dominioService, ETipoDominio, IDominio } from 'app/services/dominio.service';
import { TypeLicencia } from 'app/shared/utils/types.util';
import moment from 'moment';
import Swal from 'sweetalert2';

export const DeathInstituteFormSeccion: React.FC<IDeathInstituteProps<any>> = (props) => {
  const { obj, tipoLicencia } = props;
  const isMedicina = obj?.instTipoIdent !== undefined ? true : false;
  const [isMedicinaLegal, setIsMedicinaLegal] = useState<boolean>(isMedicina);
  const { datofiscal, required } = props;
  const [longitudmaxima, setLongitudmaxima] = useState<number>(10);
  const [longitudminima, setLongitudminima] = useState<number>(6);
  const [tipocampo, setTipocampo] = useState<string>('[0-9]{6,10}');
  const [tipodocumento, setTipodocumento] = useState<string>('Cédula de Ciudadanía');
  const [campo, setCampo] = useState<string>('Numéricos');
  //#region Listados
  const [l_tipos_documento, setListaTipoDocumento] = useState<IDominio[]>([]);

  const getListas = useCallback(
    async () => {
      const resp = await dominioService.get_type(ETipoDominio['Tipo Documento']);
      setListaTipoDocumento(resp);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
    if (obj?.instType === '80d7f664-5bdd-48eb-8b2c-93c1bd648cc8') {
      setIsMedicinaLegal(false);
    }

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
    const valor: string = value;
    const valorupper = valor.toUpperCase();
    if (valorupper == '7C96A4D3-A0CB-484E-A01B-93BC39C2552E') {
      setLongitudminima(6);
      setLongitudminima(10);
      setTipocampo('[0-9]{6,10}');
      setCampo('Numéricos');
      setTipodocumento('Cédula de Ciudadanía');
    } else {
      if (valorupper == 'AC3629D8-5C87-46CE-A8E2-530B0495CBF6') {
        setLongitudminima(10);
        setLongitudminima(11);
        setTipocampo('[0-9]{10,11}');
        setCampo('Numéricos');
        setTipodocumento('Tarjeta de Identidad ');
      } else {
        if (valorupper == '2491BC4B-8A60-408F-9FD1-136213F1E4FB') {
          setLongitudminima(15);
          setLongitudminima(15);
          setTipocampo('[0-9]{15,15}');
          setCampo('Numéricos');
          setTipodocumento('Permiso Especial de Permanencia');
        } else {
          if (valorupper == 'FFE88939-06D5-486C-887C-E52D50B7F35D' || valorupper == '71F659BE-9D6B-4169-9EE2-E70BF0D65F92') {
            setLongitudminima(15);
            setLongitudminima(15);
            setTipocampo('[0-9]{15,15}');
            setCampo('Numéricos');
            setTipodocumento('Registro Civil de Nacimiento y Numero único de identificacíon personal');
          } else {
            setLongitudminima(11);
            setLongitudminima(11);
            setTipocampo('[a-zA-Z0-9]{11,11}');
            setCampo('AlfaNuméricos(Numéros y letras)');
            setTipodocumento('Pasaporte , Cédula de Extranjería y  Tarjeta de Extranjería ');
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
      {/* TODO: [2021-06-11] Hacer la validación solicitada por el usuario en el archivo de work. */}
      {isMedicinaLegal && (
        <div className='fadeInLeft'>
          <Form.Item
            label='Tipo Identificación'
            name='instTipoIdent'
            initialValue={obj?.instTipoIdent ? obj?.instTipoIdent : defaultValues.identity}
            rules={[{ required: true }]}
          >
            <SelectComponent
              options={l_tipos_documento.filter((i) =>
                [
                  'a4ee4462-f837-4dff-a800-5495c33ac3ce',
                  'f1b570ee-f628-4438-a47f-6d7bff1f06d7',
                  '7c96a4d3-a0cb-484e-a01b-93bc39c2552e',
                  'ac3629D8-5c87-46ce-A8e2-530b0495cbf6',
                  '2491bc4b-8a60-408f-9fd1-136213f1e4fb',
                  'ffe88939-06d5-486c-887c-e52d50B7f35d',
                  '71f659be-9d6b-4169-9ee2-e70Bf0d65f92',
                  '0676c046-d93a-4551-a37e-72e3A653bd1b'
                ].includes(i.id)
              )}
              onChange={cambiodocumento}
              optionPropkey='id'
              optionPropLabel='descripcion'
            />
          </Form.Item>

          <Form.Item
            label='Número Identificación'
            name='instNumIdent'
            initialValue={obj?.instNumIdent ? obj?.instNumIdent : defaultValues.identification}
            rules={[{ required: true }]}
          >
            <Input
              allowClear
              type='text'
              placeholder='Número Identificación'
              autoComplete='off'
              pattern={tipocampo}
              onInvalid={() => {
                Swal.fire({
                  icon: 'error',
                  title: 'Datos invalidos',
                  text:
                    'recuerde que para el tipo de documento4:' +
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
            initialValue={obj?.instRazonSocial ?? defaultValues.businessName}
            name='instRazonSocial'
            rules={[{ required: true }]}
          >
            <Input allowClear placeholder='Nombre de la Razón Social' autoComplete='off' />
          </Form.Item>
          <Form.Item
            label='Número de Protocolo Medicina Legal'
            name='instNumProtocolo'
            initialValue={obj?.instNumProtocolo}
            rules={[{ required: isMedicinaLegal, max: 10 }]}
          >
            <Input allowClear placeholder='Número de Protocolo' autoComplete='off' />
          </Form.Item>

          {!datofiscal && (
            <>
              <Form.Item
                label='Nombres y Apellidos del Fiscal'
                initialValue={obj?.instNombreFiscal}
                name='instNombreFiscal'
                rules={[{ required: isMedicinaLegal, max: 200 }]}
              >
                <Input
                  allowClear
                  placeholder='Nombres y apellidos completos'
                  autoComplete='off'
                  type='text'
                  pattern='[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]{3,200}'
                  onInvalid={() => {
                    Swal.fire({
                      icon: 'error',
                      title: 'Datos invalidos',
                      text: 'recuerde que no puede ingresar numéros o caracteres especiales en el campo Nombres y apellidos completos'
                    });
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
            <Form.Item label='Número acta de Levantamiento' name='numeroActLeva' rules={[{ required: true, max: 10 }]}>
              <Input allowClear placeholder='Nueva acta de Levantamiento' autoComplete='off' />
            </Form.Item>

            <Form.Item label='Fecha de Acta' required={true} name='DateAct'>
              <DatepickerComponent
                picker='date'
                dateDisabledType='before'
                dateFormatType='default'
                placeholder='-- Elija una fecha --'
              />
            </Form.Item>

            <Form.Item label='Seccional Fiscalia' name='SecFiscalAct' rules={[{ required: true, max: 20 }]}>
              <Input allowClear placeholder='Seccional Fiscalia' autoComplete='off' />
            </Form.Item>

            <Form.Item label='No. Fiscal' name='NoFiscAct' rules={[{ required: true, max: 5 }]}>
              <Input allowClear placeholder='No. Fiscal' autoComplete='off' />
            </Form.Item>
            {tipoLicencia === 'Cremación' && (
              <>
                <Divider orientation='right'>DATOS DE CREMACION DEL FISCAL Y MEDICINA LEGAL</Divider>

                <Form.Item label='Nombre' required={true} name='fiscalianombreDC'>
                  <Input allowClear placeholder='Nombre' autoComplete='off' />
                </Form.Item>

                <Form.Item label='Apellido' required={true} name='fiscaliaapellidoDC'>
                  <Input allowClear placeholder='Apellido' autoComplete='off' />
                </Form.Item>

                <Form.Item label='Numero de oficio de medicina legal' required={true} name='fiscalianumeroDC'>
                  <Input allowClear placeholder='Numero de oficio de medicina legal' autoComplete='off' />
                </Form.Item>

                <Form.Item label='Fecha del Oficio' required={true} name='fiscaliafechaDC'>
                  <DatepickerComponent picker='date' dateDisabledType='before' dateFormatType='default' />
                </Form.Item>

                <Form.Item label='No. Fiscal' required={true} name='NoFiscalDC'>
                  <Input allowClear placeholder='numberFiscal' autoComplete='off' />
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
}
