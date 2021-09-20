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
import { AutorizacionCremacion } from './autorizacionCremacion';
import { TypeLicencia } from 'app/shared/utils/types.util';
import moment from 'moment';

export const DeathInstituteFormSeccion: React.FC<IDeathInstituteProps<any>> = (props) => {
  const { obj } = props;
  const isMedicina = obj?.instTipoIdent !== undefined ? true : false;
  const [isMedicinaLegal, setIsMedicinaLegal] = useState<boolean>(isMedicina);
  const { datofiscal, required } = props;
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

  return (
    <>
      <Divider orientation='right'>Institución que Certifica el Fallecimiento</Divider>
      <Form.Item
        label='Tipo de Institución'
        name='instType'
        initialValue={obj?.instType ? '04e0913b-5d86-4c48-8904-0f504fedb3fd' : '80d7f664-5bdd-48eb-8b2c-93c1bd648cc8'}
        rules={[{ required: true }]}
      >
        <Radio.Group onChange={onChangeTipoInst}>
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
            <SelectComponent options={l_tipos_documento} optionPropkey='id' optionPropLabel='descripcion' />
          </Form.Item>

          <Form.Item
            label='Número Identificación'
            name='instNumIdent'
            initialValue={obj?.instNumIdent ? obj?.instNumIdent : defaultValues.identification}
            rules={[{ required: true }]}
          >
            <Input allowClear type='tel' placeholder='Número Identificación' autoComplete='off' />
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
            <Input allowClear placeholder='Número de Protocolo' autoComplete='off'
            />
          </Form.Item>

          <Divider orientation='right'>DATOS DEL ACTA NOTARIAL DE LA FISCALÍA</Divider>
          <Form.Item
            label='Número Acta de Levantamiento'
            name='instNumActaLevantamiento'
            initialValue={obj?.instNumActaLevantamiento}
            rules={[{ required: required, max: 10 }]}
          >
            <Input allowClear placeholder='Número de Acta de Levantamiento' autoComplete='off' />
          </Form.Item>
          <Form.Item label='Fecha de Acta' name='instFechaActa'
            initialValue={fechaActa}
            rules={[{ required: required }]}>
            <DatepickerComponent picker='date' dateDisabledType='before' dateFormatType='default' />
          </Form.Item>
          <Form.Item label='Seccional Fiscalía'
            initialValue={obj?.instSeccionalFiscalia}
            name='instSeccionalFiscalia' rules={[{ required: required, max: 20 }]}>
            <Input allowClear placeholder='Seccional Fiscalía' autoComplete='off' />
          </Form.Item>

          <Form.Item label='No. Fiscal' name='instNoFiscal'
            initialValue={obj?.instNoFiscal}
            rules={[{ required: required, max: 5 }]}>
            <Input allowClear type='tel' placeholder='No. Fiscal' autoComplete='off' />
          </Form.Item>


          {!datofiscal && (
            <>
              <Form.Item label='Nombres y Apellidos del Fiscal'
                initialValue={obj?.instNombreFiscal}
                name='instNombreFiscal' rules={[{ required: isMedicinaLegal }]}>
                <Input allowClear placeholder='Nombres y apellidos completos' autoComplete='off' />
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
