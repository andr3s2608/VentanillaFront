import '../../../../../../../scss/antd/index.css';
import 'app/shared/components/table/estilos.css';
import '../../../../../../../css/estilos.css';
import Divider from 'antd/es/divider';
import { List } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { SelectComponent } from 'app/shared/components/inputs/select.component';

export const AutorizadorCremacion: React.FC<any> = (props) => {
  const { obj } = props;
  const [objJson, setobj] = useState<any>(obj);
  const [[primernombre, segundonombre, primerapellido, segundoapellido, nroiden], setNombres] = useState<
    [string, string, string, string, string]
  >(['', '', '', '', '']);
  const [mostrar, setmostrar] = useState<boolean>(false);

  const [l_tipo_identificacion, setl_tipo_identificacion] = useState<any>([]);
  const getListas = useCallback(
    async () => {
      const tipos: any = localStorage.getItem('tipoid');
      const tiposjson: any = JSON.parse(tipos);
      setl_tipo_identificacion(tiposjson);
      if (obj != undefined) {
        setobj(obj.autorizadorcremacion[0]);
        setNombres([
          obj.autorizadorcremacion[0].name,

          obj.autorizadorcremacion[0].secondName,
          obj.autorizadorcremacion[0].surname,
          obj.autorizadorcremacion[0].secondSurname,
          obj.autorizadorcremacion[0].numeroid
        ]);

        setmostrar(true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  useEffect(() => {
    getListas();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTipoParentesco = (objeto: any) => {
    let parentesco = 'ninguno';
    switch (objeto.parentesco) {
      case '4c00cd98-9a25-400a-9c31-1f6fca7de562':
        parentesco = 'Cónyuge (Compañero/a Permanente)';
        break;
      case '84286cb9-2499-4348-aeb8-285fc9dcf60f':
        parentesco = 'Nieto/a';
        break;
      case '5fa418af-62d9-498f-94e4-370c195e8fc8':
        parentesco = 'Sobrino/a';
        break;
      case 'ed389a26-68cb-4b43-acc7-3eb23e997bf9':
        parentesco = 'Padre / Madre';
        break;
      case 'f8841271-f6b7-4d11-b55f-41da3faccdfe':
        parentesco = 'Hijo/a';
        break;
      case 'e819b729-799c-4644-b62c-74bff07bf622':
        parentesco = 'Otro';
        break;
      case '6880824b-39c2-4105-8195-c190885796d8':
        parentesco = 'Tío/a';
        break;
      case 'ad65eb1c-10bd-4882-8645-d12001cd57b2':
        parentesco = 'Abuelo/a';
        break;
      case '313e2b1d-33f0-455b-9178-f23579f01414':
        parentesco = 'Hermano/a';
        break;
    }

    return parentesco;
  };

  const getTipoIdentificacion = (objeto: any) => {
    let tipoIdentificacion = 'ninguno';

    switch (objeto.tipoid) {
      case '2491bc4b-8a60-408f-9fd1-136213f1e4fb':
        tipoIdentificacion = 'Permiso Especial Permanencia';
        break;
      case '97f5657d-d8ec-48ef-bbe3-1babefecb1a4':
        tipoIdentificacion = 'Carnet diplomatico';
        break;
      case 'c532c358-56ae-4f93-8b9b-344ddf1256b7':
        tipoIdentificacion = 'Salvoconducto';
        break;
      case 'ac3629d8-5c87-46ce-a8e2-530b0495cbf6':
        tipoIdentificacion = 'Tarjeta de Identidad';
        break;
      case 'a4ee4462-f837-4dff-a800-5495c33ac3ce':
        tipoIdentificacion = 'Cédula de extranjería';
        break;
      case 'f1b570ee-f628-4438-a47f-6d7bff1f06d7':
        tipoIdentificacion = 'Pasaporte';
        break;
      case '0676c046-d93a-4551-a37e-72e3a653bd1b':
        tipoIdentificacion = 'Tarjeta de extranjería';
        break;
      case '7c96a4d3-a0cb-484e-a01b-93bc39c2552e':
        tipoIdentificacion = 'Cédula de Ciudadanía';
        break;
      case '7c96a4d3-a0cb-484e-a01b-93bc39c7902e':
        tipoIdentificacion = 'Número de Protocolo';
        break;
      case 'a7a1b90b-8f29-4509-8220-a95f567e6fcb':
        tipoIdentificacion = 'Número de Identificación Tributaria';
        break;
      case '0d69523b-4676-4e3d-8a3d-c6800a3acf3e':
        tipoIdentificacion = 'Certificado de Nacido Vivo';
        break;
      case '60518653-70b7-42ab-8622-caa27b496184':
        tipoIdentificacion = 'Documento Extranjero';
        break;
      case 'ffe88939-06d5-486c-887c-e52d50b7f35d':
        tipoIdentificacion = 'Número unico de identificacion personal';
        break;
      case 'c087d833-3cfb-460f-aa78-e5cf2fe83f25':
        tipoIdentificacion = 'Sin información';
        break;
      case '71f659be-9d6b-4169-9ee2-e70bf0d65f92':
        tipoIdentificacion = 'Registro Civil de Nacimiento';
        break;
    }

    return tipoIdentificacion;
  };


  let data: any[] = [];

  data = [
    {
      title: 'Primer Nombre',
      describe: primernombre
    },
    {
      title: 'Segundo Nombre',
      describe: segundonombre
    },
    {
      title: 'Primer Apellido',
      describe: primerapellido
    },
    {
      title: 'Segundo Apellido',
      describe: segundoapellido
    },
    {
      title: 'No. Identificacion.',
      describe: nroiden
    },
    {
      title: 'Tipo de identificación',
      describe: (
        <SelectComponent
          options={l_tipo_identificacion}
          optionPropkey='id'
          style={{ width: '360px', marginLeft: '11px' }}
          optionPropLabel='descripcion'
          value={objJson.tipoid}
          disabled
        />
      )
    },
    {
      title: 'Parentesco',
      describe: getTipoParentesco(objJson)
    }
  ];

  return (
    <>
      <hr />
      <div className='ant-container d-flex justify-content-center w-100'>
        <div className='ant-row text-center'>
          <div className='ant-col-12 ant-col-md-12 ant-col-lg-12 ant-col-ant-col-sm-12'>
            <Divider orientation='left'>
              <div className='contenedor'> DATOS DEL FAMILIAR QUE AUTORIZA CREMACIÓN</div>
            </Divider>
          </div>
        </div>
      </div>
      {mostrar && (
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
      )}
    </>
  );
};
