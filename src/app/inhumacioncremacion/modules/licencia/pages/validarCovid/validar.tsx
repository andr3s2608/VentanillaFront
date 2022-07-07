import { Modal } from 'antd';
import React from 'react';
import { useHistory } from 'react-router';
import swal from 'sweetalert2';
import { ApiService } from 'app/services/Apis.service';
import { authProvider } from 'app/shared/utils/authprovider.util';

const App = () => {
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [visible, setVisible] = React.useState(true);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
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
  const history = useHistory();

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

  const isCovid = () => {
    setVisible(false);
  };

  const isNotCovid = async () => {
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

    let HoraInicioAtencion_LV = await api.getCostante('5DF03735-503B-4D22-8169-E4FCDD19DA26');
    let HoraFinAtencion_LV = await api.getCostante('818AA32D-C90D-45D0-975F-486D069F7CB1');
    let HoraInicioAtencion_SD = await api.getCostante('CE62162E-5E79-4E05-AEDE-276B6C89D886');
    let HoraFinAtencion_SD = await api.getCostante('A196007F-BCCB-4160-B345-1F8605949E46');

    let HIA_LV = obtenerHora(HoraInicioAtencion_LV.valor);
    let HFA_LV = obtenerHora(HoraFinAtencion_LV.valor);
    let HIA_SD = obtenerHora(HoraInicioAtencion_SD.valor);
    let HFA_SD = obtenerHora(HoraFinAtencion_SD.valor);

    const horaInicialSemana = new Date(
      año,
      mes,
      dia,
      Number.parseInt(HIA_LV[0]),
      Number.parseInt(HIA_LV[1]),
      Number.parseInt(HIA_LV[2])
    );
    const horaFinalSemana = new Date(
      año,
      mes,
      dia,
      Number.parseInt(HFA_LV[0]),
      Number.parseInt(HFA_LV[1]),
      Number.parseInt(HFA_LV[2])
    );

    const horaInicialFinSemana = new Date(
      año,
      mes,
      dia,
      Number.parseInt(HIA_SD[0]),
      Number.parseInt(HIA_SD[1]),
      Number.parseInt(HIA_SD[2])
    );
    const horaFinalFinSemana = new Date(
      año,
      mes,
      dia,
      Number.parseInt(HFA_SD[0]),
      Number.parseInt(HFA_SD[1]),
      Number.parseInt(HFA_SD[2])
    );

    if ((ahora.getDay() != 0 || ahora.getDay() != 6) && !isHoliday()) {
      if (ahora.getTime() >= horaInicialSemana.getTime() && ahora.getTime() <= horaFinalSemana.getTime()) {
        setVisible(false);
      } else {
        setVisible(false);
        swal.fire({
          title: 'Horario de atención',
          text: 'Las solicitudes de licencia que están asociadas a un caso no COVID son atendidas de lunes a viernes en el horario de: 7:00 AM a 13:00 PM; sábados, domingos y festivos en el horario de: 08:00 AM a 11:00 AM. Por favor vuelva a intentarlo en estos horarios.',
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          },
          icon: 'info'
        });
        history.push('/');
      }
    } else {
      if (ahora.getTime() >= horaInicialFinSemana.getTime() && ahora.getTime() <= horaFinalFinSemana.getTime()) {
        setVisible(false);
      } else {
        setVisible(false);
        swal.fire({
          title: 'Horario de atención',
          text: 'Las solicitudes de licencia que están asociadas a un caso no COVID son atendidas de lunes a viernes en el horario de: 7:00 AM a 13:00 PM; sábados, domingos y festivos en el horario de: 08:00 AM a 11:00 AM. Por favor vuelva a intentarlo en estos horarios.',
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          },
          icon: 'info'
        });
        history.push('/');
      }
    }
  };

  return (
    <Modal
      title='VALIDACIÓN DE SOLICITUD'
      visible={visible}
      onOk={isCovid}
      okText='Si'
      confirmLoading={confirmLoading}
      onCancel={isNotCovid}
      cancelText='No'
      closable={false}
    >
      <p>{'¿La solicitud que va a realizar esta relacionada con un caso COVID - 19?'}</p>
    </Modal>
  );
};

export default App;
