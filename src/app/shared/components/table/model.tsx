import { Button, Modal } from 'antd';
export const structureColumns = [
  {
    title: 'Tipo Trámite',
    dataIndex: 'codigoTramite',
    key: 'codigoTramite'
  },
  {
    title: 'Fecha Radicación',
    dataIndex: 'fechaSolicitud',
    key: 'fechaSolicitud'
  },
  {
    title: 'Numero Licencia',
    dataIndex: 'numeroCertificado',
    key: 'numeroCertificado'
  },

  {
    title: 'Estado',
    dataIndex: 'estadoSolicitud',
    key: 'estadoSolicitud'
  },
  {
    title: 'Acciones',
    key: 'operation',

    render: () => <Button type='primary'>Ver</Button>
  }
];

export const dataFake = [
  {
    fecha: '05-09-2021',
    usuario: 900700675,
    estado: 'Registro de Tramine usuario esterno',
    observacion: 'Registro de tramite SST usuario externo'
  },
  {
    fecha: '06-09-2021',
    usuario: 'klramirez',
    estado: 'Aprobado validador documento',
    observacion: 'Validacion de documentos por parte del validador de documentos'
  }
];
export const columnFake = [
  {
    title: 'Id tramite',
    dataIndex: 'idTramite',
    key: 'idTramite'
  },
  {
    title: 'Usuario',
    dataIndex: 'idUsuarioSeguridad',
    key: 'idUsuarioSeguridad'
  },
  {
    title: 'Fecha de registro',
    dataIndex: 'fechaRegistro',
    key: 'fechaRegistro'
  },
  {
    title: 'Estado',
    dataIndex: 'estadoSolicitud',
    key: 'estadoSolicitud'
  },

  {
    title: 'Observación',
    dataIndex: '',
    key: ''
  }
];
