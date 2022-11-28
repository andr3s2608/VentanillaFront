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

export const InformacionInstitucionCertificaFallecimientoseccion = ({ obj }: any) => {
  const instType = obj.instType;
  const instTipoIdent = obj.instTipoIdent;
  const instNumIdent = obj.instNumIdent;
  const instRazonSocial = obj.instRazonSocial;
  const instNumProtocolo = obj.instNumProtocolo;
  const instNumActaLevantamiento = obj.instNumActaLevantamiento;
  const instFechaActa = obj.instFechaActa !== undefined ? moment(obj.instFechaActa) : null;
  const instSeccionalFiscalia = obj.instSeccionalFiscalia;
  const instNoFiscal = obj.instNoFiscal;
  //Prueba
  const instNombreFiscal = obj.instNombreFiscal;
  const instApellidoFiscal = obj.instApellidoFiscal;
  const instNumeroOficio = obj.instNumeroOficio;
  const instFechaOficio = obj.instFechaOficio !== undefined ? moment(obj.instFechaOficio) : null;
  const instNoFiscalMedicinaLegal = obj.instNoFiscalMedicinaLegal;

  const [l_tipos_documento, setl_tipos_documento] = useState<any>([]);

  const [[primernombre, segundonombre, primerapellido, segundoapellido, nroiden, tipoid], setNombres] = useState<
    [string, string, string, string, string, string]
  >(['', '', '', '', '', '']);


  const getListas = useCallback(async () => {

    const tipos: any = localStorage.getItem('tipoid');
    const tiposjson: any = JSON.parse(tipos);

    setl_tipos_documento(tiposjson);
    if (obj != undefined) {

      setNombres([
        obj.reconocidocomo[0].name,
        obj.reconocidocomo[0].secondName,
        obj.reconocidocomo[0].surname,
        obj.reconocidocomo[0].secondSurname,
        obj.reconocidocomo[0].numeroid,
        obj.reconocidocomo[0].tipoid
      ]);


    }
  }, []);


  useEffect(() => {

    getListas();

  }, []);



  //Institución que certifica el fallecimiento

  var dataCompleta = [
    {
      title: 'Numero de identificación',
      describe: instNumIdent?.toLowerCase()
    },
    {
      title: 'Razon social',
      describe: instRazonSocial?.toLowerCase()
    },
    {
      title: 'Numero de protocolo',
      describe: instNumProtocolo?.toLowerCase()
    },
    {
      title: 'Numero de acta de levantamiento',
      describe: instNumActaLevantamiento?.toLowerCase()
    },
    {
      title: 'Fecha de acta',
      describe: (
        <DatepickerComponent picker='date' dateDisabledType='before' dateFormatType='default' value={instFechaActa} disabled />
      )
    },
    {
      title: 'Seccional fiscalia',
      describe: instSeccionalFiscalia?.toLowerCase()
    },
    {
      title: 'Número de fiscalia',
      describe: instNoFiscal?.toLowerCase()
    },
    {
      title: 'Nombre del fiscal',
      describe: instNombreFiscal?.toLowerCase()
    },
    {
      title: 'Apellido del fiscal',
      describe: instApellidoFiscal?.toLowerCase()
    },
    {
      title: 'Número de oficio',
      describe: instNumeroOficio?.toLowerCase()
    },
    {
      title: 'Fecha de oficio',
      describe: (
        <DatepickerComponent picker='date' dateDisabledType='before' dateFormatType='default' value={instFechaOficio} disabled />
      )
    },
    {
      title: 'Número de fiscalia de medicina legal',
      describe: instNoFiscalMedicinaLegal?.toLowerCase()
    }
  ];

  var dataParcial = [
    {
      title: 'Numero de identificación',
      describe: instTipoIdent?.toLowerCase()
    },
    {
      title: 'Razon social',
      describe: instRazonSocial?.toLowerCase()
    },
    {
      title: 'Numero de protocolo',
      describe: instNumProtocolo?.toLowerCase()
    },
    {
      title: 'Numero de acta de levantamiento',
      describe: instNumActaLevantamiento?.toLowerCase()
    },
    {
      title: 'Fecha de acta',
      describe: (
        <DatepickerComponent picker='date' dateDisabledType='before' dateFormatType='default' value={instFechaActa} disabled />
      )
    },
    {
      title: 'Seccional fiscalia',
      describe: instSeccionalFiscalia?.toLowerCase()
    },
    {
      title: 'Número de fiscalia',
      describe: instNoFiscal?.toLowerCase()
    }
  ];

  const datosinstitucion = [
    {
      title: 'Tipo de identificación',
      describe: (
        <SelectComponent
          options={[]}
          optionPropkey='id'
          optionPropLabel='descripcion'
          value={'NIT'}
          disabled
        />
      )
    },
    {
      title: 'Numero de identificación',
      describe: instNumIdent?.toLowerCase()
    },
    {
      title: 'Razon social',
      describe: instRazonSocial?.toLowerCase()
    },
    {
      title: 'Numero de protocolo',
      describe: instNumProtocolo?.toLowerCase()
    }
  ]

  const datosreconocido = [
    {
      title: 'Tipo de identificación',
      describe: (
        <SelectComponent
          options={l_tipos_documento}
          optionPropkey='id'
          optionPropLabel='descripcion'
          value={tipoid}
          disabled
        />
      )
    },
    {
      title: 'Numero de identificación',
      describe: nroiden?.toLowerCase()
    },
    {
      title: 'Primer Nombre',
      describe: primernombre?.toLowerCase()
    },
    {
      title: 'Segundo Nombre',
      describe: segundonombre?.toLowerCase()
    }
    ,
    {
      title: 'Primer Apellido',
      describe: primerapellido?.toLowerCase()
    },
    {
      title: 'Segundo Apellido',
      describe: segundoapellido?.toLowerCase()
    }
  ]

  const datosacta =
    [
      {
        title: 'Numero de acta de levantamiento',
        describe: instNumActaLevantamiento?.toLowerCase()
      },
      {
        title: 'Fecha de acta',
        describe: (
          <DatepickerComponent picker='date' dateDisabledType='before' dateFormatType='default' value={instFechaActa} disabled />
        )
      },
      {
        title: 'Seccional fiscalia',
        describe: instSeccionalFiscalia?.toLowerCase()
      },
      {
        title: 'Número de fiscalia',
        describe: instNoFiscal?.toLowerCase()
      }
    ]

  const datoscrem =
    [
      {
        title: 'Nombre del fiscal',
        describe: instNombreFiscal?.toLowerCase()
      },
      {
        title: 'Apellido del fiscal',
        describe: instApellidoFiscal?.toLowerCase()
      },
      {
        title: 'Número de oficio',
        describe: instNumeroOficio?.toLowerCase()
      },
      {
        title: 'Fecha de oficio',
        describe: (
          <DatepickerComponent picker='date' dateDisabledType='before' dateFormatType='default' value={instFechaOficio} disabled />
        )
      },
      {
        title: 'Número de fiscalia de medicina legal',
        describe: instNoFiscalMedicinaLegal?.toLowerCase()
      }
    ]


  return (
    <>
      {obj?.reconocidocomo.length > 0 && (<>

        <div className='ant-container d-flex justify-content-center w-100'>
          <div className='ant-row text-center'>
            <div className='ant-col-12 ant-col-md-12 ant-col-lg-12 ant-col-ant-col-sm-12'>
              <Divider orientation='left'>
                <div className='contenedor'>Reconocido Como</div>
              </Divider>
            </div>
          </div>
        </div>
        <div><List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 1,
            md: 3,
            lg: 3,
            xl: 3,
            xxl: 3
          }}
          dataSource={datosreconocido}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta title={item.title} description={item.describe} />
            </List.Item>
          )}
        /></div>
      </>

      )}
      <div className='ant-container d-flex justify-content-center w-100'>
        <div className='ant-row text-center'>
          <div className='ant-col-12 ant-col-md-12 ant-col-lg-12 ant-col-ant-col-sm-12'>
            <Divider orientation='left'>
              <div className='contenedor'>Institución que Certifica el Fallecimiento</div>
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
          dataSource={datosinstitucion}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta title={item.title} description={item.describe} />
            </List.Item>
          )}
        />
      </div>
      <div className='ant-container d-flex justify-content-center w-100'>
        <div className='ant-row text-center'>
          <div className='ant-col-12 ant-col-md-12 ant-col-lg-12 ant-col-ant-col-sm-12'>
            <Divider orientation='left'>
              <div className='contenedor'>Datos del Acta Notarial</div>
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
          dataSource={datosacta}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta title={item.title} description={item.describe} />
            </List.Item>
          )}
        />
      </div>
      {obj.instNombreFiscal !== '' && (<>

        <div className='ant-container d-flex justify-content-center w-100'>
          <div className='ant-row text-center'>
            <div className='ant-col-12 ant-col-md-12 ant-col-lg-12 ant-col-ant-col-sm-12'>
              <Divider orientation='left'>
                <div className='contenedor'>Datos de Cremación del Fiscal y Medicina Legal</div>
              </Divider>
            </div>
          </div>
        </div>
        <div><List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 1,
            md: 3,
            lg: 3,
            xl: 3,
            xxl: 3
          }}
          dataSource={datoscrem}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta title={item.title} description={item.describe} />
            </List.Item>
          )}
        /></div>
      </>

      )}



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
