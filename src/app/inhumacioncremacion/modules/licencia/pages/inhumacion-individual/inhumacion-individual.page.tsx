// Antd
import Tabs from 'antd/es/tabs';

// Componentes
import { PageHeaderComponent } from 'app/shared/components/page-header.component';
import { IndividualForm } from 'app/inhumacioncremacion/modules/licencia/components/form/individual.form';
import App from '../validarCovid/validar';
import { useCallback, useEffect, useState } from 'react';
import { ApiService } from 'app/services/Apis.service';
import { authProvider } from 'app/shared/utils/authprovider.util';

// Otros componentes
const { TabPane } = Tabs;

const InhumacionIndividualPage = () => {
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [HIA_LV, setHIA_LV] = useState<string[]>(['0', '0', '0']);
  const [HFA_LV, setHFA_LV] = useState<string[]>(['23', '5', '9']);
  const [HIA_SD, setHIA_SD] = useState<string[]>(['0', '0', '0']);
  const [HFA_SD, setHFA_SD] = useState<string[]>(['23', '5', '9']);

  const getListas = useCallback(async () => {
    await GetValidateRol();
  }, []);

  function obtenerHora(hora: string): string[] {
    let aux = hora[0];

    let horario: string[] = ['', '', ''];

    if (aux == '0') {
      horario[0] = hora[1];
      horario[1] = hora[3];
      horario[2] = hora[4];
    } else {
      horario[0] = hora[0] + hora[1];
      horario[1] = hora[3];
      horario[2] = hora[4];
    }

    return horario;
  }

  const GetValidateRol = async () => {
    let HoraInicioAtencion_LV = await api.getCostante('5DF03735-503B-4D22-8169-E4FCDD19DA26');
    let HoraFinAtencion_LV = await api.getCostante('818AA32D-C90D-45D0-975F-486D069F7CB1');
    let HoraInicioAtencion_SD = await api.getCostante('CE62162E-5E79-4E05-AEDE-276B6C89D886');
    let HoraFinAtencion_SD = await api.getCostante('A196007F-BCCB-4160-B345-1F8605949E46');
    var aux1 = obtenerHora(HoraInicioAtencion_LV.valor);
    var aux2 = obtenerHora(HoraFinAtencion_LV.valor);
    var aux3 = obtenerHora(HoraInicioAtencion_SD.valor);
    var aux4 = obtenerHora(HoraFinAtencion_SD.valor);

    setHIA_LV(aux1);
    setHFA_LV(aux2);
    setHIA_SD(aux3);
    setHFA_SD(aux4);
  };

  useEffect(() => {
    getListas();
  }, []);
  function mostrarPopUp(): boolean {
    let bandera = true;

    const festivos = [
      {
        fecha: {
          mes: 1,
          dia: 1
        },
        nombre: 'Año nuevo'
      },
      {
        fecha: {
          mes: 5,
          dia: 1
        },
        nombre: 'Día del Trabajo'
      },
      {
        fecha: {
          mes: 7,
          dia: 20
        },
        nombre: 'Día de la Independencia de Colombia'
      },
      {
        fecha: {
          mes: 8,
          dia: 7
        },
        nombre: 'Batalla de Boyacá'
      },
      {
        fecha: {
          mes: 12,
          dia: 8
        },
        nombre: 'Día de la Inmaculada Concepción'
      },
      {
        fecha: {
          mes: 12,
          dia: 25
        },
        nombre: 'Navidad'
      }
    ];

    function isHoliday(): boolean {
      let bandera = false;
      let hoy = new Date();

      for (let index = 0; index < festivos.length; index++) {
        if (festivos[index].fecha.mes - 1 == hoy.getMonth() && festivos[index].fecha.dia == hoy.getDate()) {
          bandera = true;
        }
      }
      return bandera;
    }

    let ahora = new Date();
    let dia = ahora.getDate();
    let mes = ahora.getMonth();
    let año = ahora.getFullYear();
    const horaInicialSemana = new Date(
      año,
      mes,
      dia,
      Number.parseInt(HIA_LV[0]),
      Number.parseInt(HIA_LV[1] + HIA_LV[2]),
      Number.parseInt('0')
    );
    const horaFinalSemana = new Date(
      año,
      mes,
      dia,
      Number.parseInt(HFA_LV[0]),
      Number.parseInt(HFA_LV[1] + HFA_LV[2]),
      Number.parseInt('0')
    );
    const horaInicialFinSemana = new Date(
      año,
      mes,
      dia,
      Number.parseInt(HIA_SD[0]),
      Number.parseInt(HIA_SD[1] + HIA_SD[2]),
      Number.parseInt('0')
    );

    const horaFinalFinSemana = new Date(
      año,
      mes,
      dia,
      Number.parseInt(HFA_SD[0]),
      Number.parseInt(HFA_SD[1] + HFA_SD[2]),
      Number.parseInt('0')
    );




    if ((ahora.getDay() != 0 && ahora.getDay() != 6) && !isHoliday()) {
      if (ahora.getTime() >= horaInicialSemana.getTime() && ahora.getTime() <= horaFinalSemana.getTime()) {
        bandera = false;

      } else {
        bandera = true;

      }
    } else {
      if (ahora.getTime() >= horaInicialFinSemana.getTime() && ahora.getTime() <= horaFinalFinSemana.getTime()) {
        bandera = false;
      } else {
        bandera = true;
      }
    }

    return bandera;
  }
  return (
    <div className='fadeInTop container-fluid'>
      <PageHeaderComponent
        title='Licencia Inhumación - Individual'
        subTitle='Consulte el trámite de los certificados o registre una nueva solicitud.'
      />
      <p id='ancla-1'></p>
      <Tabs>
        <TabPane tab='Registro' key='1'>
          <IndividualForm tipoLicencia='Inhumación' tramite='a289c362-e576-4962-962b-1c208afa0273' />
          {mostrarPopUp() && <App origen={'solicitud'} metodo={null}></App>}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default InhumacionIndividualPage;
