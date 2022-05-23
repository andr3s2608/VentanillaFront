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

      <Form.Item label={'Causa Muerte - ' + props.causaMuerte} name='causaMuerte' initialValue={0} rules={[{ required: true }]}>
        <Radio.Group>
          <Radio value={1}>SI</Radio>
          <Radio value={0}>NO</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item label='Fecha Defunción' name='date' rules={[{ required: true }]} initialValue={date}>
        <DatepickerComponent picker='date' dateDisabledType='before' dateFormatType='default' value={date} />
      </Form.Item>

      <Form.Item label='Sin Establecer' name='check'>
        <Switch onChange={onChangeSwitch} defaultChecked={check} />
      </Form.Item>

      {isHora && (
        <Form.Item label='Hora' name='time' rules={[{ required: isHora }]} initialValue={time}>
          <DatepickerComponent
            picker='time'
            dateDisabledType='default'
            dateFormatType='time'
            value={time}
            placeholder='-- Elija una hora --'
          />
        </Form.Item>
      )}

      <Form.Item
        label='Sexo'
        name='sex'
        initialValue={obj?.idSexo ? obj?.idSexo : '259cf2da-6175-4dba-bd55-62723adf0dfa'}
        rules={[{ required: true }]}
      >
        <Radio.Group>
          <Radio value='259cf2da-6175-4dba-bd55-62723adf0dfa'>MASCULINO</Radio>
          <Radio value='11c463f3-8135-4545-b58f-3fc748edde94'>FEMENINO</Radio>
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
