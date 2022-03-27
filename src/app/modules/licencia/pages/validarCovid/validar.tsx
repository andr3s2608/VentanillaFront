import { Modal } from 'antd';
import React from 'react';
import { useHistory } from 'react-router';
import swal from 'sweetalert2';

const App = () => {
  const [visible, setVisible] = React.useState(true);
  const [confirmLoading, setConfirmLoading] = React.useState(false);

  const history = useHistory();

  const isCovid = () => {
    setVisible(false);
  };

  const isNotCovid = () => {
    /*

    array para festivos

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
          mes: 1,
          dia: 6
        },
        nombre: 'Día de los Reyes Magos'
      },
      {
        fecha: {
          mes: 3,
          dia: 19
        },
        nombre: 'Día de San José'
      }
    ];
    */
    let ahora = new Date();
    let dia = ahora.getDate();
    let mes = ahora.getMonth();
    let año = ahora.getFullYear();
    const horaInicialSemana = new Date(año, mes, dia, 7, 0, 0);
    const horaFinalSemana = new Date(año, mes, dia, 15, 30, 0);
    const horaInicialFinSemana = new Date(año, mes, dia, 8, 0, 0);
    const horaFinalFinSemana = new Date(año, mes, dia, 12, 0, 0);

    if (ahora.getDay() != 1 || ahora.getDay() != 7) {
      if (ahora.getTime() >= horaInicialSemana.getTime() && ahora.getTime() <= horaFinalSemana.getTime()) {
        setVisible(false);
      } else {
        setVisible(false);
        swal.fire({
          title: 'Horario de atención',
          text:
            'Las solicitudes de licencia que estan asociadas a un caso no COVID son atendidas de lunes a viernes en el ' +
            'horario de: 7:00 AM a 3:30 PM, por favor vuelva a intertarlo en estos horarios.',
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
          text:
            'Las solicitudes de licencia que estan asociadas a un caso no COVID son atendidas los fines de semana en el ' +
            'horario de: 8:00 AM a 12:00 PM, por favor vuelva a intertarlo en estos horarios.',
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
