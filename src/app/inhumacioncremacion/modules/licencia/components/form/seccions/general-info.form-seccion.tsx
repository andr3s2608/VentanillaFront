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
  const { obj } = props;
  const [isHora, setIsHora] = useState<boolean>(true);
  const date = obj?.date !== undefined ? moment(obj?.date) : null;
  const time = obj?.time !== undefined ? moment(obj?.time) : null;
  const check = obj?.check === undefined ? false : obj?.check;
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);

  const onChangeSwitch = (check: any) => {
    console.log(check);
    setIsHora(!check);
  };

  const onChange = (value: any) => {};

  useEffect(() => {
    if (obj?.check !== undefined && check) {
      setIsHora(false);
    }
  });

  return (
    <>
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

      <Divider orientation='right'>Información General</Divider>

      <Form.Item label='Emergencia Sanitaria' name='causaMuerte' initialValue={0} rules={[{ required: true }]}>
        <Radio.Group>
          <Radio value={1}>SI</Radio>
          <Radio value={0}>NO</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item label='Fecha Defunción' name='date' rules={[{ required: true }]} initialValue={date}>
        <DatepickerComponent picker='date' dateDisabledType='before' dateFormatType='default' value={date} />
      </Form.Item>

      <div className='form-row'>
        <div className='form-group col-md-4 col-lg-4'>
          <label style={{ fontSize: 15, float: 'right', marginRight: 40 }}>Hora Defunción: </label>
        </div>
        <div className='form-group col-md-3 col-lg-4'>
          <Form.Item label='' name='check'>
            <label style={{ fontSize: 15, marginRight: 10, marginLeft: 5 }}> Sin establecer </label>
            <Switch onChange={onChangeSwitch} defaultChecked={check} />
          </Form.Item>
        </div>
        <div className='form-group col-md-5 col-lg-4'>
          {isHora && (
            <Form.Item label='Hora' style={{ width: 350 }} name='time' rules={[{ required: isHora }]} initialValue={time}>
              <DatepickerComponent
                picker='time'
                dateDisabledType='default'
                dateFormatType='time'
                value={time}
                placeholder='-- Elija una hora --'
                style={{ width: 100 }}
              />
            </Form.Item>
          )}
        </div>
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
    </>
  );
};

interface IGeneralInfoProps<T> extends ITipoLicencia {
  obj: any;
  causaMuerte?: string;
}
export const KeysForm = ['certificado', 'date', 'time', 'sex'];
