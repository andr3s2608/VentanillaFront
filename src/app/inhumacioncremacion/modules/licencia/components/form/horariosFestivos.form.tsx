import { Button, Form, Input, Select } from 'antd';
import form from 'antd/es/form';
import { RangePickerProps } from 'antd/lib/date-picker';
import { DatepickerComponent } from 'app/shared/components/inputs/datepicker.component';
import { layoutItems, layoutWrapper } from 'app/shared/utils/form-layout.util';
import moment from 'moment';
import React, { useState } from 'react'

export const HorariosFestivos = ({ props }: any) => {

  const [form] = Form.useForm<any>();
  const [festivos, setFestivos] = useState<string>('');
  const format = "DD-MM-YYYY";


  const onSubmit = async (values: any) => {

    console.log(values.festivos.format(format));

  };

  const onSubmitFailed = () => {

  };


  const Actions = () => (
    <Form.Item {...layoutWrapper}>
      <div className='container-fluid'>
        <div className='row justify-content-center text-center'>
          <div className='col-lg-12 col-sm-12 col-md-12 text-center mr-5'>
            <Button type='primary' htmlType='submit' className='add' onClick={() => { }}>
              Agregar
            </Button>
          </div>
        </div>
        <div className='row justify-content-center text-center'>
          <div className='col-lg-12 col-sm-12 col-md-12 text-center mr-5'>
            <Button type='primary' htmlType='submit' className='save'>
              Guardar
            </Button>
          </div>
        </div>
      </div>
    </Form.Item>
  );

  return (
    <div className='container-fluid'>
      <div className='card'>
        <div className='card-body'>
          <Form form={form} {...layoutItems} layout='horizontal' onFinish={onSubmit} onFinishFailed={onSubmitFailed}>
            <div className='row justify-content-center'>
              <div className='col-lg-12 col-sm-12 col-md-12 justify-content-center text-center mb-4'>
                <p
                  style={{ fontSize: '16px', color: '#3366cc', fontFamily: ' Roboto' }}
                  className='text-uppercase font-weight-bold'
                >
                  Gestionar Festivos
                </p>
              </div>
              <div style={{ display: 'inline-block', width: '50%' }}>
                <Form.Item
                  label='Festivos: '
                  name='festivos'
                  rules={[{ required: true }]}
                >
                  <DatepickerComponent
                    picker='date'
                    format="DD-MM-YYYY"
                    dateDisabledType='after'
                  />
                </Form.Item>

                <Form.Item
                  label='Festivos agregados'
                  name='festivosAgregados'
                >
                  <Input.TextArea
                    showCount
                    allowClear
                    maxLength={250}
                    placeholder='No hay festivos agregados...'
                    autoSize={{ minRows: 4, maxRows: 8 }}
                    disabled
                  //value={festivos}
                  />
                </Form.Item>
              </div>
              <div style={{ display: 'inline-block', width: '50%', paddingLeft: '60px' }}>
                <Button style={{ marginLeft: '10px', marginRight: '10px' }} type='primary' htmlType='button' className='add' onClick={() => {
                  //setFestivos(festivos + moment(form.getFieldsValue(['festivos'])).format(format) + ';');
                  console.log(moment(form.getFieldsValue(['festivos'])).format(format));
                  //console.log(festivos);
                }}>
                  Agregar
                </Button>
                <Button style={{ marginLeft: '10px', marginRight: '10px' }} type='primary' htmlType='submit' className='save'>
                  Guardar
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}
