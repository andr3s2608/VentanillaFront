// Antd
import Form, { FormInstance } from 'antd/es/form';
import Input from 'antd/es/input';
import Radio from 'antd/es/radio';
import Divider from 'antd/es/divider';

// Components
import { DatepickerComponent } from 'app/shared/components/inputs/datepicker.component';
import Switch from 'antd/es/switch';
import { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import { ITipoLicencia } from 'app/shared/utils/types.util';
import { authProvider } from 'app/shared/utils/authprovider.util';

//redux
import { ApiService } from 'app/services/Apis.service';

export const GeneralInfoFormSeccion: React.FC<IGeneralInfoProps<any>> = (props) => {
  const { obj, prop, form } = props;
  const [mostrar, setmostrar] = useState<boolean>(obj === undefined ? true : false);
  const [isHora, setIsHora] = useState<boolean>(true);
  const [isMensaje, setisMensaje] = useState<boolean>(false);
  const [Emergencia, setEmergencia] = useState<boolean>(false);
  const [Mensaje, setMensaje] = useState<string>('');
  const [time, settime] = useState<any>(undefined);
  const date = obj?.date !== undefined ? moment(obj?.date) : null;

  const check = obj?.check === undefined ? false : obj?.check;
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);


  const getListas = useCallback(async () => {

    if (obj?.time != undefined) {
      const causamuerte = await api.GetResumenSolicitud(obj?.idSolicitud)

      setEmergencia(causamuerte[0].cumpleCausa);
      settime(ObtenerHora(obj?.time + ''));
      setisMensaje(causamuerte[0].cumpleCausa);
    }
    if (check) {
      setIsHora(false);
    }

    const Mensaje = await api.getCostante('DD81B078-14F3-49D9-BB99-13A66EACC93F');
    setMensaje(Mensaje.valor);


    setmostrar(true);
  }, []);

  useEffect(() => {
    getListas();
  }, []);





  const onChangeSwitch = (check: any) => {

    setIsHora(!check);
  };

  const onChange = (value: any) => {
    if (value === 'No') {

      setisMensaje(false);
    }
    else {
      setisMensaje(true);
    }

    form.setFieldsValue({ causaMuerte: value });

  };

  useEffect(() => {


  });

  const ObtenerHora = (values: string) => {
    const inicio: number = parseInt(values.substring(0, values.lastIndexOf(':')));
    const fin: number = parseInt(values.substring(values.lastIndexOf(':') + 1, values.length));

    const date = moment
      .utc()
      .hour(inicio) // numbers from 0 to 23
      .minute(fin); // numbers from 0 to 59
    return date;
  };

  const compararfecha = () => {
    if (prop != null) {
      prop();
    }
  };





  return (
    <>
      {mostrar && (<>
        <Form.Item
          className='mt-5'
          label='Número de Certificado'
          name='certificado'
          rules={[{ required: true, max: 14 }]}
          initialValue={obj?.certificado}
        >
          <Input
            style={{ width: '90%' }}
            allowClear
            placeholder='Número de Certificado'
            autoComplete='off'
            maxLength={14}
            onKeyPress={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }}
            onPaste={(event) => {
              event.preventDefault();
            }}
          />
        </Form.Item>

        <Divider orientation='center'>Información General</Divider>

        <Form.Item label='Emergencia Sanitaria' name='causaMuerte'
          initialValue={Emergencia ? 'Si' : 'No'} rules={[{ required: true }]}>
          <Radio.Group onChange={(e) => onChange(e.target.value)}
            defaultValue={Emergencia ? 'Si' : 'No'}>
            <Radio value={'Si'}>SI</Radio>
            <Radio value={'No'}>NO</Radio>
          </Radio.Group>
          {isMensaje && (
            <>  <label style={{ fontSize: 15, float: 'right', marginRight: 40 }}>{Mensaje} </label>
            </>

          )}
        </Form.Item>


        <Form.Item label='Fecha Defunción' name='date' rules={[{ required: true }]} initialValue={date}>
          <DatepickerComponent picker='date' onChange={compararfecha} dateDisabledType='before' dateFormatType='default' value={date} style={{ width: '90%' }} />
        </Form.Item>

        <div className='form-row'>
          <div className='form-group col-md-4 col-lg-4'>
            <label style={{ fontSize: 15, float: 'right', marginRight: 40 }}>Hora Defunción: </label>
          </div>
          <div className='form-group col-md-3 col-lg-4'>
            <Form.Item label='Sin Establecer' name='check' style={{ width: 500 }}>
              <Switch onChange={onChangeSwitch} defaultChecked={check} />
            </Form.Item>
          </div>
          {isHora && (
            <>
              <div className='form-group col-md-5 col-lg-4'>
                <Form.Item label='Hora' name='time' style={{ width: 350 }} rules={[{ required: isHora }]} initialValue={time}>
                  <DatepickerComponent
                    picker='time'
                    dateDisabledType='default'
                    dateFormatType='time'
                    value={time}
                    onChange={compararfecha}
                    placeholder='-- Elija una hora --'
                    style={{ width: 100 }}
                  />
                </Form.Item>

              </div>
            </>
          )}
        </div>

        <Form.Item
          label='Sexo'
          name='sex'
          initialValue={obj?.sex ? obj?.sex : '11c463f3-8135-4545-b58f-3fc748edde94'}
          rules={[{ required: true }]}
        >
          <Radio.Group>
            <Radio value='11c463f3-8135-4545-b58f-3fc748edde94'>MASCULINO</Radio>
            <Radio value='259cf2da-6175-4dba-bd55-62723adf0dfa'>FEMENINO</Radio>
            <Radio value='0347ea5e-691e-44a0-87a5-b22d39f1ff94'>INDETERMINADO</Radio>
          </Radio.Group>
        </Form.Item>
      </>)}

    </>
  );
};

interface IGeneralInfoProps<T> extends ITipoLicencia {
  obj: any;
  causaMuerte?: string;
  prop: any;
  form: FormInstance<T>;
}
export const KeysForm = ['certificado', 'date', 'time', 'sex'];
