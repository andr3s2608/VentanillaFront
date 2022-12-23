import {
  CheckOutlined,
  ConsoleSqlOutlined,
  EyeOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { SetResetViewLicence } from 'app/redux/controlViewLicence/controlViewLicence.action';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { IRoles } from 'app/inhumacioncremacion/Models/IRoles';
import { useCallback, useEffect, useState } from 'react';
import { ApiService } from 'app/services/Apis.service';
import Form, { FormInstance } from 'antd/es/form';
import { store } from 'app/redux/app.reducers';
import { Alert, Button, Modal, Upload } from 'antd';
import { useHistory } from 'react-router';
import Input from 'antd/es/input';
import Table from 'antd/es/table';
import moment from 'moment';

export const TablaReportes = (props: IDataSource) => {
  const history = useHistory();
  const { data } = props;

  const { accountIdentifier } = authProvider.getAccount();
  const [Validacion, setValidacion] = useState<string>('0');

  const api = new ApiService(accountIdentifier);
  const Paginas: number = 10;

  const getListas = useCallback(
    async () => {

      setValidacion('1');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
  }, []);





  let structureColumns: any = [];

  if (Validacion == '1') {

    structureColumns = [
      {
        title: 'Consecutivo',
        dataIndex: 'consecutivo',
        key: 'consecutivo',
        defaultSortOrder: 'descend',
        sorter: {
          compare: (a: { consecutivo: string; }, b: { consecutivo: string; }) =>
            a.consecutivo > b.consecutivo ? 1 : -1,
          multiple: 6,
        }
      },
      {
        title: 'Num. Licencia',
        dataIndex: 'numerolicenciainfo',
        key: 'numerolicenciainfo',
        defaultSortOrder: 'descend',
        sorter: {
          compare: (a: { numerolicenciainfo: number; }, b: { numerolicenciainfo: number; }) =>
            a.numerolicenciainfo - b.numerolicenciainfo,
          multiple: 5,
        }
      },
      {
        title: 'Fecha de Licencia',
        dataIndex: 'fechaLicencia',
        key: 'fechaLicencia',
        render: (Text: any) => {
          const fecha = moment(Text + "").format('DD-MM-YYYY HH:mm')
          return <Form.Item label='' name=''>
            <text>{fecha}</text>
          </Form.Item>

        }
      },
      {
        title: 'Fecha de Solicitud',
        dataIndex: 'fechaSolicitud',
        key: 'fechaSolicitud',
        render: (Text: any) => {
          const fecha = moment(Text + "").format('DD-MM-YYYY HH:mm')
          return <Form.Item label='' name=''>
            <text>{fecha}</text>
          </Form.Item>

        }
      },
      {
        title: 'Tipo Solicitud',
        dataIndex: 'idTramite',
        key: 'tipoSolicitud', width: 300,
        filters: [
          {
            text: 'Inhumación Individual',
            value: 'a289c362-e576-4962-962b-1c208afa0273'
          },
          {
            text: 'Inhumación Fetal',
            value: 'ad5ea0cb-1fa2-4933-a175-e93f2f8c0060'
          },
          {
            text: 'Cremación Individual',
            value: 'e69bda86-2572-45db-90dc-b40be14fe020'
          },
          {
            text: 'Cremación Fetal ',
            value: 'f4c4f874-1322-48ec-b8a8-3b0cac6fca8e'
          }
        ],
        filterSearch: true,
        onFilter: (value: string, record: { idTramite: string }) => record.idTramite.toString().includes(value.toLocaleUpperCase()),
        render: (Text: string) => {
          switch (Text.toLowerCase()) {
            case 'a289c362-e576-4962-962b-1c208afa0273':
              return <Form.Item label='' name=''>
                <text>{'Inhumación Individual'}</text>
              </Form.Item>

            case 'ad5ea0cb-1fa2-4933-a175-e93f2f8c0060':
              //inhumacion fetal
              return <Form.Item label='' name=''>
                <text>{'Inhumación Fetal'}</text>
              </Form.Item>

            case 'e69bda86-2572-45db-90dc-b40be14fe020':
              //cremacion individual
              return <Form.Item label='' name=''>
                <text>{'Cremación Individual'}</text>
              </Form.Item>

            case 'f4c4f874-1322-48ec-b8a8-3b0cac6fca8e':
              //cremacionfetal
              return <Form.Item label='' name=''>
                <text>{'Cremación Fetal '}</text>
              </Form.Item>


          }
        }
      },
      {
        title: 'Estado Tramite',
        dataIndex: 'estadoString',
        key: 'estado',
        width: 230,
        filters: [
          {
            text: 'Anulado ',
            value: 'Anulado validador de documentos'
          },
          {
            text: 'Aprobado ',
            value: 'Aprobado validador de documentos'
          },
          {
            text: 'Pendiente',
            value: 'Documentos Inconsistentes'
          },
          {
            text: 'Negado ',
            value: 'Negado validador de documentos'
          }
          ,
          {
            text: 'En tramite ',
            value: 'Registro Usuario Externo'
          }
          ,
          {
            text: 'Cambio de Licencia',
            value: 'Cambio de Licencia'
          },
          {
            text: 'Actualización de Documentos',
            value: 'Actualización Documentos'
          },
          {
            text: 'Actualización de Datos',
            value: 'Actualización Solicitud'
          }
        ],
        filterSearch: true,
        onFilter: (value: string, record: { estadoString: string }) => record.estadoString.toString().includes(value),


        render: (Text: string) => {

          if (Text === 'Cambio de Licencia') {
            return (<Form.Item label='' name=''>
              <text>{'Cambio tipo de licencia'}</text>
            </Form.Item>)
          }
          else {
            if (Text === 'Registro Usuario Externo') {
              return (<Form.Item label='' name=''>
                <text>{'En Tramite'}</text>
              </Form.Item>)
            }
            else {
              return (<Form.Item label='' name=''>
                <text>{Text}</text>
              </Form.Item>)
            }

          }

        }
      },
      {
        title: 'Número de Certificado',
        dataIndex: 'numeroCertificado',
        key: 'numeroCertificado'
      },
      {
        title: 'Tipo de Documento',
        dataIndex: 'idTipoDocumento',
        key: 'idTipoDocumento'
      },
      {
        title: 'Número de documento',
        dataIndex: 'noIdentificacionSolicitante',
        key: 'noIdentificacionSolicitante'
      },
      {
        title: 'Primer Nombre',
        dataIndex: 'primerNombreRep',
        key: 'primerNombreRep',
        defaultSortOrder: 'descend',
        sorter: {
          compare: (a: { primerNombreRep: string; }, b: { primerNombreRep: string; }) =>
            a.primerNombreRep > b.primerNombreRep ? 1 : -1,
          multiple: 4,
        }
      },
      {
        title: 'Primer Apellido',
        dataIndex: 'primerApellidoRep',
        key: 'primerApellidoRep',
        defaultSortOrder: 'descend',
        sorter: {
          compare: (a: { primerApellidoRep: string; }, b: { primerApellidoRep: string; }) =>
            a.primerApellidoRep > b.primerApellidoRep ? 1 : -1,
          multiple: 3,
        }
      },
      {
        title: 'Segundo Nombre',
        dataIndex: 'segundoNombreRep',
        key: 'segundoNombreRep',
        defaultSortOrder: 'descend',
        sorter: {
          compare: (a: { segundoNombreRep: string; }, b: { segundoNombreRep: string; }) =>
            a.segundoNombreRep > b.segundoNombreRep ? 1 : -1,
          multiple: 2,
        }
      },
      ,

      {
        title: 'Segundo Apellido',
        dataIndex: 'segundoApellidoRep',
        key: 'segundoApellidoRep',
        defaultSortOrder: 'descend',
        sorter: {
          compare: (a: { segundoApellidoRep: string; }, b: { segundoApellidoRep: string; }) =>
            a.segundoApellidoRep > b.segundoApellidoRep ? 1 : -1,
          multiple: 1,
        }
      },
      {
        title: 'Fecha de Nacimiento',
        dataIndex: 'fechaNacimientoRep',
        key: 'fechaNacimientoRep',
        render: (Text: any) => {
          const fecha = moment(Text + "").format('DD-MM-YYYY')
          return <Form.Item label='' name=''>
            <text>{fecha}</text>
          </Form.Item>

        }
      },
      {
        title: 'Sexo',
        dataIndex: 'nombreSexo',
        key: 'nombreSexo',
        width: 230,
        filters: [
          {
            text: 'Masculino ',
            value: 'Hombre'
          },
          {
            text: 'Femenino ',
            value: 'Mujer'
          },
          {
            text: 'Indeterminado',
            value: 'Indeterminado'
          }
        ],
        filterSearch: true,
        onFilter: (value: string, record: { nombreSexo: string }) => record.nombreSexo.toString().includes(value),


        render: (Text: string) => {

          if (Text === 'Hombre') {
            return (<Form.Item label='' name=''>
              <text>{'Masculino'}</text>
            </Form.Item>)
          }
          else {
            if (Text === 'Hombre') {
              return (<Form.Item label='' name=''>
                <text>{'Femenino'}</text>
              </Form.Item>)
            }
            else {
              return (<Form.Item label='' name=''>
                <text>{Text}</text>
              </Form.Item>)
            }

          }

        }

      },
      {
        title: 'Fecha de Fallecimiento',
        dataIndex: 'fechaDefuncion',
        key: 'fechaDefuncion',
        render: (Text: any) => {
          const fecha = moment(Text + "").format('DD-MM-YYYY')
          return <Form.Item label='' name=''>
            <text>{fecha}</text>
          </Form.Item>

        }
      },
      {
        title: 'Tipo de Muerte',
        dataIndex: 'tipoMuerteRep',
        key: 'tipoMuerteRep',
        width: 230,
        filters: [
          {
            text: 'Natural ',
            value: 'Natural'
          },
          {
            text: 'Violenta ',
            value: 'Violenta'
          },
          {
            text: 'En Estudio',
            value: 'En Estudio'
          }
        ],
        filterSearch: true,
        onFilter: (value: string, record: { tipoMuerteRep: string }) => record.tipoMuerteRep.toString().includes(value),

      },
      {
        title: 'Cementerio',
        dataIndex: 'cementerio',
        key: 'cementerio'
      },
      {
        title: 'Pais',
        dataIndex: 'paisRep',
        key: 'paisRep'
      },
      {
        title: 'Departamento',
        dataIndex: 'departamentoRep',
        key: 'departamentoRep'
      },
      {
        title: 'Municipio',
        dataIndex: 'municipioRep',
        key: 'municipioRep'
      },
      {
        title: 'Area',
        dataIndex: 'areaDefuncionRep',
        key: 'areaDefuncionRep',
        width: 230,
        filters: [
          {
            text: 'Centro Rural Disperso ',
            value: 'Centro Rural Disperso'
          },
          {
            text: 'Centro Poblado ',
            value: 'Centro Poblado'
          },
          {
            text: 'Desconocido',
            value: 'Desconocido'
          }
          ,
          {
            text: 'Cabecera Municipal',
            value: 'Cabecera Municipal'
          }
        ],
        filterSearch: true,
        onFilter: (value: string, record: { tipoMuerteRep: string }) => record.tipoMuerteRep.toString().includes(value),

      },
      {
        title: 'Sitio',
        dataIndex: 'sitioDefuncionRep',
        key: 'sitioDefuncionRep',
        width: 230,
        filters: [
          {
            text: 'Hospital/Clínica ',
            value: 'Hospital/Clínica'
          },
          {
            text: 'Sin información ',
            value: 'Sin información'
          },
          {
            text: 'Via Pública',
            value: 'Via Pública'
          },
          {
            text: 'Lugar de trabajo',
            value: 'Lugar de trabajo'
          },
          {
            text: 'Casa/Domicilio',
            value: 'Casa/Domicilio'
          }
        ],
        filterSearch: true,
        onFilter: (value: string, record: { SitioDefuncionRep: string }) => record.SitioDefuncionRep.toString().includes(value),

      },
      {
        title: 'Ins. que expidio Certificado Def.',
        dataIndex: 'razonSocialInstitucionRep',
        key: 'razonSocialInstitucionRep',
        filters: [
          {
            text: 'Medicina Legal ',
            value: 'INSTITUTO NACIONAL DE MEDICINA LEGAL Y CIENCIAS FORENCES'
          },
          {
            text: 'Otros ',
            value: 'Otros'
          }
        ],
        filterSearch: true,
        onFilter: (value: string, record: { razonSocialInstitucionRep: string }) => record.razonSocialInstitucionRep.toString().includes(value),
      },
      {
        title: 'NIT',
        dataIndex: 'numeroIdentificacionInstitucionRep',
        key: 'numeroIdentificacionInstitucionRep'
      },
      {
        title: 'Num. Acta levantamiento',
        dataIndex: 'numeroActaLevantamientoInstitucionRep',
        key: 'numeroActaLevantamientoInstitucionRep'
      },
      {
        title: 'Fecha de Acta Levantamiento',
        dataIndex: 'fechaActaInstitucionRep',
        key: 'fechaActaInstitucionRep',
        render: (Text: any) => {
          if (Text != '') {
            const fecha = moment(Text + "").format('DD-MM-YYYY')
            return <Form.Item label='' name=''>
              <text>{fecha}</text>
            </Form.Item>

          }
          else {
            return <Form.Item label='' name=''>
              <text>{ }</text>
            </Form.Item>
          }


        }
      },
      {
        title: 'Fiscal Número',
        dataIndex: 'noFiscalInstitucionRep',
        key: 'noFiscalInstitucionRep'
      },
      {
        title: 'Seccional de Fiscalia',
        dataIndex: 'seccionalFiscaliaInstitucionRep',
        key: 'seccionalFiscaliaInstitucionRep'
      },
      {
        title: 'Num. Protocolo',
        dataIndex: 'numeroProtocoloInstitucionRep',
        key: 'numeroProtocoloInstitucionRep'
      }
    ];
  }

  const onPageChange = (pagination: any, filters: any) => {




  };

  return (
    <div className='container-fluid'>
      <div className='card'>
        <div className='card-body'>
          <div className='row'>
            <span> Resultados = {data.length}</span>
            <div className='col-lg-12 col-sm-12 col-md-12'>
              <Table
                id='tableGen'
                dataSource={data}
                columns={structureColumns}
                onChange={onPageChange}
                scroll={{ x: true }}
                pagination={{ pageSize: Paginas }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface IDataSource {
  data: Array<any>;
}
