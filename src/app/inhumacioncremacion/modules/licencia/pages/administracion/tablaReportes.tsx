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
  const [isVisibleDocumentoGestion, setVisibleDocumentoGestion] = useState<boolean>(false);
  const [tipoSolicitud, setTipoSolicitud] = useState<string>('default-tiposolicitud');
  const [listadoDocumento, setListadoDocumento] = useState<Array<Document>>([]);
  const [observacion, setObservacion] = useState<string>('default');
  const { accountIdentifier } = authProvider.getAccount();
  const [Validacion, setValidacion] = useState<string>('0');
  const [roles, setroles] = useState<IRoles[]>([]);
  const api = new ApiService(accountIdentifier);
  const Paginas: number = 10;

  const getListas = useCallback(
    async () => {
      const rolesstorage: any = localStorage.getItem('roles');

      setroles(JSON.parse(rolesstorage));
      setValidacion('1');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
  }, []);

  const [Tipo] = roles;

  var identify: string;
  var tipotramite: any;
  var fecha: any;

  const Renovar = (datos: any) => {
    if (data.length == 0) {
    } else {
      if (datos == undefined) {
        datos = data;
      }

      identify = '';

      for (let index = 0; index < datos.length; index++) {
        identify = identify + datos[index].persona[0].numeroIdentificacion + '|';
      }

      // identify = datos.reduce((result: any, item: { persona: { numeroIdentificacion: any }[] }) => {
      // return `${result}${item['persona']['numeroIdentificacion']}|`;
      // }, '');

      tipotramite = datos.reduce((result: any, item: { idTramite: any }) => {
        return `${result}${item.idTramite}|`;
      }, '');

      fecha = datos.reduce((result: any, item: { fechaSolicitud: any }) => {
        return `${result}${item.fechaSolicitud}|`;
      }, '');
    }
  };

  if (Validacion == '1') {
    Renovar(undefined);
  }

  let structureColumns: any = [];

  const fecharecortada = () => {
    if (Tipo.rol !== 'Ciudadano') {
      const posicioninicial = 0;
      const fec: string = fecha.substring(posicioninicial, fecha.indexOf('|'));
      const fechamodificada = fec.substring(posicioninicial, fecha.indexOf('T'));
      fecha = fecha.substring(fecha.indexOf('|') + 1, fecha.length);

      return fechamodificada;
    }
  };

  const tiposolicitud = () => {
    const posicioninicial = 0;
    var idTramite = tipotramite.substring(posicioninicial, tipotramite.indexOf('|'));
    tipotramite = tipotramite.substring(tipotramite.indexOf('|') + 1, tipotramite.length);
    var valor = '';

    switch (idTramite) {
      case 'a289c362-e576-4962-962b-1c208afa0273':
        valor = 'Inhumación Indivual';

        break;
      case 'ad5ea0cb-1fa2-4933-a175-e93f2f8c0060':
        //inhumacion fetal
        valor = 'Inhumación Fetal';

        break;
      case 'e69bda86-2572-45db-90dc-b40be14fe020':
        //cremacion individual
        valor = 'Cremación Individual';

        break;
      case 'f4c4f874-1322-48ec-b8a8-3b0cac6fca8e':
        //cremacionfetal
        valor = 'Cremación Fetal ';

        break;
    }
    return valor;
  };

  if (Validacion == '1') {
    console.log('DATA RECIBIDA \n' + JSON.stringify(data));
    structureColumns = [
      {
        title: 'Consecutivo',
        dataIndex: 'consecutivo',
        key: 'consecutivo'
      },
      {
        title: 'Num. Licencia',
        dataIndex: 'numerolicenciainfo',
        key: 'numerolicenciainfo'
      },
      {
        title: 'Fecha de Licencia',
        dataIndex: 'fechaLicencia',
        key: 'fechaLicencia'
      },
      {
        title: 'Tipo Solicitud',
        dataIndex: 'idTramite',
        key: 'tipoSolicitud',
        render: (Text: string) => {
          switch (Text) {
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
        title: 'Primer Apellido',
        dataIndex: 'primerApellidoRep',
        key: 'primerApellidoRep'
      },
      {
        title: 'Segundo Apellido',
        dataIndex: 'segundoApellidoRep',
        key: 'segundoApellidoRep'
      },
      {
        title: 'Primer Nombre',
        dataIndex: 'primerNombreRep',
        key: 'primerNombreRep'
      },
      {
        title: 'Segundo Nombre',
        dataIndex: 'segundoNombreRep',
        key: 'segundoNombreRep'
      },
      {
        title: 'Fecha de Nacimiento',
        dataIndex: 'fechaNacimientoRep',
        key: 'fechaNacimientoRep'
      },
      {
        title: 'Sexo',
        dataIndex: 'nombreSexo',
        key: 'nombreSexo'
      },
      {
        title: 'Fecha de Fallecimiento',
        dataIndex: 'fechaDefuncion',
        key: 'fechaDefuncion'
      },
      {
        title: 'Tipo de Muerte',
        dataIndex: 'tipoMuerteRep',
        key: 'tipoMuerteRep'
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
        key: 'areaDefuncionRep'
      },
      {
        title: 'Sitio',
        dataIndex: 'Sitio',
        key: 'sitioDefuncionRep'
      },
      {
        title: 'Ins. que expidio Certificado Def.',
        dataIndex: 'razonSocialInstitucionRep',
        key: 'razonSocialInstitucionRep'
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
        key: 'fechaActaInstitucionRep'
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


    var valor: any = data.at(0);
    var array: any[] = [];
    for (let index = 0; index < data.length; index++) {
      if (index >= (pagination.current - 1) * 10) {
        valor = data.at(index);
        array.push(valor);
      }
    }

    Renovar(array);
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
