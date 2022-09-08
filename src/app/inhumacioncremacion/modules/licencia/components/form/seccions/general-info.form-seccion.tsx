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
  const [mostrar, setmostrar] = useState<boolean>(true);
  const [isHora, setIsHora] = useState<boolean>(true);
  const [time, settime] = useState<any>(undefined);
  const date = obj?.date !== undefined ? moment(obj?.date) : null;

  const check = obj?.check === undefined ? false : obj?.check;
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);


  const getListas = useCallback(async () => {

    if (obj?.time != undefined) {
      settime(ObtenerHora(time + ''));
    }
    if (check) {
      setIsHora(false);
    }






  }, []);

  useEffect(() => {
    getListas();
  }, []);





  const onChangeSwitch = (check: any) => {
    console.log(check)
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





  return (
    <>
      <section style={{ marginTop: '40px' }}>
        <div className="container">
          <div className="form-group row justify-content-center mt-4">
            <label className="col-sm-2 col-form-label" style={{ fontSize: '16px', marginTop: '-4px' }}>Número de Certificado</label>
            <div className="col-sm-8">
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
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xl-12">
              <Divider orientation='center'>Información General</Divider>
            </div>
          </div>
          <div className="form-group row mt-4" style={{ marginLeft: '136px' }}>
            <label className="col-sm-4 col-form-label" style={{ fontSize: '16px', marginTop: '-8px' }}>Emergencia Sanitaria</label>
            <div className="col-sm-5">
              <Radio.Group style={{ marginLeft: '-120px' }}>
                <Radio value={1}>SI</Radio>
                <Radio value={0}>NO</Radio>
              </Radio.Group>
            </div>
          </div>
          <div className="form-group row justify-content-center mt-4" style={{ marginLeft: '90px' }}>
            <label className="col-sm-2 col-form-label" style={{ fontSize: '16px', marginTop: '-4px', marginLeft: '-20px' }}>Fecha Defunción</label>
            <div className="col-sm-8">
              <DatepickerComponent picker='date' dateDisabledType='before' dateFormatType='default' value={date} />
            </div>
          </div>
          <div className='form-row mt-4'>
            <div className='form-group col-md-4 col-lg-4'>
              <label style={{ fontSize: '16px', marginLeft: '180px' }}>Sin Establecer </label>
            </div>
            <div className='form-group col-md-3 col-lg-4' >
              <Switch style={{ marginLeft: '-25px' }} onChange={onChangeSwitch} defaultChecked={check} />
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
                      placeholder='-- Elija una hora --'
                      style={{ width: 100 }}
                    />
                  </Form.Item>

                </div>
              </>
            )}
          </div>
          <div className="row" style={{ marginTop: '-15px' }}>
            <label className="col-sm-2 col-form-label" style={{ fontSize: '16px', marginLeft: '240px', }}>Sexo</label>
            <div className="col-sm-10" style={{ marginLeft: '10px', display: 'flex', marginTop: '-30px' }}>
              <Radio.Group style={{ marginLeft: '320px' }}>
                <Radio value='11c463f3-8135-4545-b58f-3fc748edde94'>MASCULINO</Radio>
                <Radio value='259cf2da-6175-4dba-bd55-62723adf0dfa'>FEMENINO</Radio>
                <Radio value='0347ea5e-691e-44a0-87a5-b22d39f1ff94'>INDETERMINADO</Radio>
              </Radio.Group>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

interface IGeneralInfoProps<T> extends ITipoLicencia {
  obj: any;
  causaMuerte?: string;
}
export const KeysForm = ['certificado', 'date', 'time', 'sex'];
