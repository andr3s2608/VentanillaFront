// Antd
import Form from 'antd/es/form';
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
  const { obj, prop } = props;
  const [mostrar, setmostrar] = useState<boolean>(obj === undefined ? true : false);
  const [isHora, setIsHora] = useState<boolean>(true);
  const [time, settime] = useState<any>(undefined);
  const date = obj?.date !== undefined ? moment(obj?.date) : null;

  const check = obj?.check === undefined ? false : obj?.check;
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);


  const getListas = useCallback(async () => {

    if (obj?.time != undefined) {

      settime(ObtenerHora(obj?.time + ''));
    }
    if (check) {
      setIsHora(false);
    }





    setmostrar(true);
  }, []);

  useEffect(() => {
    getListas();
  }, []);





  const onChangeSwitch = (check: any) => {

    setIsHora(!check);
  };

  const onChange = (value: any) => { };

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
          label='Número de Certificado'
          name='certificado'
          rules={[{ required: true, max: 14 }]}
          initialValue={obj?.certificado}
        >
          <Input
            allowClear
            placeholder='Número de Certificado'
            autoComplete='off'
            maxLength={14}
            disabled={obj !== undefined ? false : true}
            onChange={(e) => onChange(e.target.value)}
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

        <Form.Item label='Emergencia Sanitaria' name='causaMuerte' initialValue={0} rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value={1}>SI</Radio>
            <Radio value={0}>NO</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label='Fecha Defunción' name='date' rules={[{ required: true }]} initialValue={date}>
          <DatepickerComponent picker='date' onChange={compararfecha} dateDisabledType='before' dateFormatType='default' value={date} />
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
          initialValue={obj?.idSexo ? obj?.idSexo : '11c463f3-8135-4545-b58f-3fc748edde94'}
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
}
export const KeysForm = ['certificado', 'date', 'time', 'sex'];
