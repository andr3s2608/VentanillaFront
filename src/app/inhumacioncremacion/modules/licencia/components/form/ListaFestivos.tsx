import { Button, Checkbox } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { ApiService } from "app/services/Apis.service";
import { authProvider } from "app/shared/utils/authprovider.util";
import { useState } from "react";
import Swal from "sweetalert2";
import fechaNoAgregada from '../../../../../../assets/images/inhumacioncremacion/fechaNoAgregada.png';
import fechaGuardada from '../../../../../../assets/images/inhumacioncremacion/fechaGuardada.png';

export default function ListaFestivos() {

  //Apis
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);

  //Festivos consultados
  const [festivosDB, setFestivosDB] = useState<string[]>([]);

  //Valores a actualizar
  //let valuesToUpdate: any[] = [];
  const [valuesToUpdate, setValuesToUpdate] = useState<any[]>([]);



  const onChange = (e: CheckboxChangeEvent) => {
    if (valuesToUpdate.length === 0) {
      valuesToUpdate.push(e.target.id);
    } else {
      let bandera = false;
      for (let index = 0; index < valuesToUpdate.length; index++) {
        if (valuesToUpdate[index] === e.target.id) {
          bandera = true;
        }
      }

      if (!bandera) {

        //No se encontro ninguna coincidencia
        valuesToUpdate.push(e.target.id);
      } else {
        //Existen repetidos
        let valores = valuesToUpdate;
        setValuesToUpdate(valores.filter((item) => item != e.target.id));

      }
    }
  }

  const obtenerFestivosString = (cadena: string): string[] => {
    let festivos: string[] = [];
    festivos = cadena.split(';');
    return festivos;
  };

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '5px' }}>
        <div style={{ gridColumn: 1 }}>
          <Button style={{ width: '95%' }} type='primary' htmlType='button' className='add' onClick={async () => {

            const festivosDB = await api.getCostante('4AF03735-503B-4D22-8169-E4FCDD19DB28');
            const cantidadConsultas: string[] = obtenerFestivosString(festivosDB.valor);
            setFestivosDB(cantidadConsultas);
            let cant = cantidadConsultas.length;
            if (festivosDB.valor === "null") {
              cant = 1;
            }
            Swal.fire({
              imageUrl: fechaGuardada,
              background: '#fcfcfc',
              imageHeight: 150,
              title: 'RESULTADO DE LA CONSULTA',
              confirmButtonColor: '#ec0b0a ',
              text:
                'Se han encontrado ' + ((cant) - 1) + ' festivos'
            });
          }}>
            Consultar
          </Button>
        </div>
        <div style={{ gridColumn: 2 }}>
          <Button style={{ width: '95%' }} type='primary' htmlType='button' className='add' onClick={async () => {
            let festivos = festivosDB;

            if (valuesToUpdate.length > 0) {

              for (let index = 0; index < valuesToUpdate.length; index++) {
                festivos = festivos.filter((item) => item != valuesToUpdate[index]);
              }
              const festivosCadena = festivos.join(";").trim();
              if (festivosCadena === '') {
                await api.ModificarConstante('4AF03735-503B-4D22-8169-E4FCDD19DB28', null, '1');
              } else {
                await api.ModificarConstante('4AF03735-503B-4D22-8169-E4FCDD19DB28', festivosCadena, '1');
              }
              const festivosDB = await api.getCostante('4AF03735-503B-4D22-8169-E4FCDD19DB28');
              const cantidadConsultas: string[] = obtenerFestivosString(festivosDB.valor);
              setFestivosDB([]);
              setFestivosDB(cantidadConsultas);
              Swal.fire({
                imageUrl: fechaGuardada,
                background: '#fcfcfc',
                imageHeight: 150,
                title: 'ELIMINACIÓN EXITOSA',
                confirmButtonColor: '#ec0b0a ',
                text:
                  'Se han eliminado los dias festivos seleccionados'
              });
              setValuesToUpdate([]);
            } else {
              Swal.fire({
                imageUrl: fechaNoAgregada,
                background: '#fcfcfc',
                imageHeight: 150,
                title: 'ELIMINACIÓN DENEGADA',
                confirmButtonColor: '#ec0b0a ',
                text:
                  'No ha seleccionado ninguna fecha para eliminar.'
              });
            }
          }}>
            Eliminar
          </Button>
        </div>
      </div>
      <div style={{ marginTop: '15px' }}>
        <ol>
          {festivosDB.map((value) => (
            (value != "" && value != "null" ? <li><Checkbox id={value.toString()} onChange={onChange}>{value}</Checkbox></li> : null)
          ))}
        </ol>
      </div>
    </>
  )

};
