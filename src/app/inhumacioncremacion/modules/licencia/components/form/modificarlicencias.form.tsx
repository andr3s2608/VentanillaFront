import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form, { FormInstance } from 'antd/es/form';
import Divider from 'antd/es/divider';

// Componentes

import { ApiService } from 'app/services/Apis.service';
import { TypeDocument } from './seccions/TypeDocument';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { layoutItems, layoutWrapper } from 'app/shared/utils/form-layout.util';
import { useStepperForm } from 'app/shared/hooks/stepper.hook';
import Swal from 'sweetalert2';
import { DatepickerComponent } from 'app/shared/components/inputs/datepicker.component';
import Button from 'antd/es/button';
import { SetResetViewLicence } from 'app/redux/controlViewLicence/controlViewLicence.action';

//Redux
import { store } from 'app/redux/app.reducers';
import { UploadOutlined } from '@ant-design/icons';
import { Input, Radio, Switch, Upload } from 'antd';
import moment from 'moment';

export const ModificarLicencia = ({ props }: any) => {
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [form] = Form.useForm<any>();

  const [licencia, setLicencia] = useState<boolean>(false);
  const [nn, setnn] = useState<boolean>(false);
  const [valores, setvalores] = useState<string>('tramite');
  const [date, setDate] = useState<any>();
  const [time, setTime] = useState<any>();
  const [sexo, setsexo] = useState<any>();
  const [obj, setobj] = useState<any>();

  const [posicion, setposicion] = useState<number>(0);
  const [[primerNombre, segundoNombre, primerApellido, segundoApellido], setnombres] = useState<[string, string, string, string]>(
    ['', '', '', '']
  );

  const [certificado, setcertificado] = useState<any>();
  const [isHora, setIsHora] = useState<boolean>(true);
  const [check, setcheck] = useState<boolean>(true);

  const { current, setCurrent, status, setStatus, onNextStep, onPrevStep } = useStepperForm<any>(form);

  const getListas = useCallback(async () => {}, []);

  useEffect(() => {
    getListas();
  }, []);
  const ObtenerHora = (values: string) => {
    const inicio: number = parseInt(values.substring(0, values.lastIndexOf(':')));
    const fin: number = parseInt(values.substring(values.lastIndexOf(':') + 1, values.length));

    const date = moment
      .utc()
      .hour(inicio) // numbers from 0 to 23
      .minute(fin); // numbers from 0 to 59
    return date;
  };
  const BuscarSolicitud = async () => {
    const numero: string = form.getFieldValue('numero');
    const id = await api.ObtenerSolicitud(numero, valores);

    if (id == null) {
      Swal.fire({
        icon: 'error',

        title: 'Datos inválidos',
        text: 'No se encontró el número de ' + valores + ', por favor verifíquelo de nuevo'
      });
      setLicencia(false);
    } else {
      const solicitud = await api.getLicencia(id);
      const copia = [...solicitud];
      setobj(copia[0]);

      setcertificado(solicitud[0].numeroCertificado);
      const fecha = solicitud[0].fechaDefuncion;

      setDate(moment(fecha));
      setcheck(solicitud[0].sinEstablecer);
      if (solicitud[0].hora == 'Sin información') {
        setTime(moment(null));
      } else {
        setTime(ObtenerHora(solicitud[0].hora + ''));
      }
      setsexo(solicitud[0].idSexo);

      for (let index = 0; index < 3; index++) {
        if (
          solicitud[0].persona[index].idTipoPersona == '01f64f02-373b-49d4-8cb1-cb677f74292c' ||
          solicitud[0].persona[index].idTipoPersona == '342d934b-c316-46cb-a4f3-3aac5845d246'
        ) {
          setnombres([
            solicitud[0].persona[index].primerNombre + '',
            solicitud[0].persona[index].segundoNombre + '',
            solicitud[0].persona[index].primerApellido + '',
            solicitud[0].persona[index].segundoApellido + ''
          ]);
          setposicion(index);
          if (solicitud[0].persona[index].primerNombre == 'N' && solicitud[0].persona[index].primerApellido == 'N') {
            setnn(true);
          }
          break;
        }
      }

      form.resetFields(['name', 'secondName', 'surname', 'secondSurname', 'numerocert', 'date', 'check', 'time', 'sex']);
      setLicencia(true);
      //localStorage.setItem('register', JSON.stringify(solicitud));
    }
  };

  const changeRadioButton = (values: any) => {
    setvalores(values.target.value);
  };
  const generateListFiles = (values: any) => {
    const Objs = [];

    const {
      fileCertificadoDefuncion,
      fileCCFallecido,
      fileOtrosDocumentos,
      fileAuthCCFamiliar,
      fileAuthCremacion,
      fileOficioIdentificacion,
      fileOrdenAuthFiscal,
      fileActaNotarialFiscal
    } = values;

    Objs.push({ file: fileCertificadoDefuncion, name: 'Certificado_Defuncion' });
    Objs.push({ file: fileCCFallecido, name: 'Documento_del_fallecido' });
    Objs.push({ file: fileOtrosDocumentos, name: 'Otros_Documentos' });
    Objs.push({ file: fileAuthCCFamiliar, name: 'Autorizacion_de_cremacion_del_familiar' });
    Objs.push({ file: fileAuthCremacion, name: 'Documento_del_familiar' });
    Objs.push({ file: fileOficioIdentificacion, name: 'Autorizacion_del_fiscal_para_cremar' });
    Objs.push({ file: fileOrdenAuthFiscal, name: 'Oficio_de_medicina_legal_al_fiscal_para_cremar' });
    Objs.push({ file: fileActaNotarialFiscal, name: 'Acta_Notarial_del_Fiscal' });

    const filesName = Objs.filter((item: { file: any; name: string }) => item.file !== undefined);
    const files: Blob[] = filesName.map((item) => {
      const [file] = item.file;
      return file.originFileObj;
    });
    const names: string[] = filesName.map((item) => item.name);
    return [files, names];
  };

  const onSubmit = async (values: any) => {
    var bandera = false;
    if (values.numerocert == obj.numeroCertificado) {
      bandera = true;
    } else {
      const busquedacertificado = await api.ComprobarCertificado(values.numerocert + '');
      if (busquedacertificado == null) {
        bandera = true;
      } else {
        bandera = false;
      }
    }
    if (bandera) {
      const formatDate = 'MM-DD-YYYY';
      obj.persona[posicion].primerNombre = values.name;
      obj.persona[posicion].segundoNombre = values.secondName;
      obj.persona[posicion].primerApellido = values.surname;
      obj.persona[posicion].segundoApellido = values.secondSurname;

      if (values.time._i == 'Fecha invalida') {
        obj.hora = 'Sin información';
      } else {
        obj.hora = values.check === true ? 'Sin información' : moment(values.time).format('LT');
      }
      obj.numeroCertificado = values.numerocert;
      obj.fechaDefuncion = moment(values.date).format(formatDate);
      obj.sinEstablecer = values.check;

      obj.idSexo = values.sex;

      await api.putLicencia(obj);

      if (nn) {
        let container = '';
        switch (obj.idTramite) {
          case 'a289c362-e576-4962-962b-1c208afa0273':
            container = 'inhumacionindividual';

            break;
          case 'ad5ea0cb-1fa2-4933-a175-e93f2f8c0060':
            //inhumacion fetal
            container = 'inhumacionfetal';

            break;
          case 'e69bda86-2572-45db-90dc-b40be14fe020':
            //cremacion individual
            container = 'cremacionindividual';

            break;
          case 'f4c4f874-1322-48ec-b8a8-3b0cac6fca8e':
            //cremacionfetal
            container = 'cremacionfetal';

            break;
        }
        const support = await api.getSupportDocuments(obj.idSolicitud);

        const [doc] = support.filter((p: any) => p.path.includes('Otros_Documentos'));

        const supportDocumentsEdit: any[] = [];
        const formData = new FormData();

        const archivo = values.fileOtrosDocumentos.file;

        formData.append('file', archivo);
        formData.append('nameFile', 'Otros_Documentos' + '_' + obj.idSolicitud);

        supportDocumentsEdit.push({
          idDocumentoSoporte: doc.idDocumentoSoporte,
          idSolicitud: obj.idSolicitud,
          idTipoDocumentoSoporte: 'abe33c1d-9370-4189-9e81-597e5b643481',
          path: `${obj.idUsuarioSeguridad}/Otros_Documentos_${obj.idSolicitud}`,
          idUsuario: obj.idUsuarioSeguridad,
          fechaModificacion: new Date()
        });

        formData.append('containerName', container);
        formData.append('oid', obj.idUsuarioSeguridad);

        if (supportDocumentsEdit.length) {
          await api.uploadFiles(formData);
          await api.UpdateSupportDocuments(supportDocumentsEdit);
        }
      }
      setLicencia(false);
      Swal.fire({
        icon: 'success',

        title: 'Solicitud Modificada',
        text: 'Se ha modificado la Solicitud exitosamente'
      });
    } else {
      Swal.fire({
        title: 'Usuario Registrado',
        text: 'El Número de Certificado ya se Encuentra Registrado',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        },
        icon: 'info'
      });
    }
  };

  const onSubmitFailed = () => {
    setStatus('error');
    store.dispatch(SetResetViewLicence());
  };

  const onChangeSwitch = (check: any) => {
    setIsHora(!check);
  };

  const Actions = () => (
    <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
      <div className='d-flex justify-content-between'>
        <Button type='primary' htmlType='submit'>
          Guardar o Modificar
        </Button>
      </div>
    </Form.Item>
  );

  return (
    <div className='container-fluid'>
      <div className='card'>
        <div className='card-body'>
          <Form form={form} {...layoutItems} layout='horizontal' onFinish={onSubmit} onFinishFailed={onSubmitFailed}>
            <div className='row justify-content-center'>
              <div className='col-lg-12 col-sm-12 col-md-12 justify-content-center text-center'>
                <p
                  style={{ fontSize: '16px', color: '#3366cc', fontFamily: ' Roboto' }}
                  className='text-uppercase font-weight-bold'
                >
                  Modificar Licencia Azure
                </p>
              </div>
            </div>
            <div className='row mt-3 justify-content-center text-center'>
              <div className='col-lg-12 col-sm-12 col-md-12'>
                <p style={{ fontSize: '16px', color: '#000', fontFamily: ' Roboto' }}>Buscar por:</p>
                <Radio.Group onChange={changeRadioButton} defaultValue={'tramite'}>
                  <Radio value='tramite'>Número de tramite</Radio>
                  <Radio value='certificado'>Número de Certificado</Radio>
                  <Radio value='fallecido'>Número de Identificación</Radio>
                </Radio.Group>
              </div>
            </div>

            <div className='row mt-5 mr-5 justify-content-center'>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <Form.Item label='Número' name='numero'>
                  <Input
                    allowClear
                    placeholder='Número'
                    autoComplete='off'
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
              </div>
            </div>

            <div className='row ml-5'>
              <div className='col-lg-12 col-sm-12 col-md-12 text-center'>
                <Button type='primary' onClick={BuscarSolicitud}>
                  Buscar Solicitud
                </Button>
              </div>
            </div>
            {licencia && (
              <>
                <Form.Item
                  label='Número de Certificado'
                  name='numerocert'
                  rules={[{ required: true }]}
                  initialValue={certificado}
                >
                  <Input
                    allowClear
                    placeholder='Número de Certificado'
                    autoComplete='off'
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
                <Form.Item label='Sexo' name='sex' initialValue={sexo} rules={[{ required: true }]}>
                  <Radio.Group>
                    <Radio value='259cf2da-6175-4dba-bd55-62723adf0dfa'>MASCULINO</Radio>
                    <Radio value='11c463f3-8135-4545-b58f-3fc748edde94'>FEMENINO</Radio>
                    <Radio value='0347ea5e-691e-44a0-87a5-b22d39f1ff94'>INDETERMINADO</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label='Primer Nombre' name='name' rules={[{ required: true, max: 50 }]} initialValue={primerNombre}>
                  <Input
                    allowClear
                    placeholder='Primer Nombre'
                    autoComplete='off'
                    type='text'
                    onKeyPress={(event) => {
                      if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ ]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label='Segundo Nombre'
                  name='secondName'
                  rules={[{ required: false, max: 50 }]}
                  initialValue={segundoNombre}
                >
                  <Input
                    allowClear
                    placeholder='Segundo Nombre'
                    autoComplete='off'
                    type='text'
                    onKeyPress={(event) => {
                      if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ ]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label='Primer Apellido'
                  name='surname'
                  rules={[{ required: true, max: 50 }]}
                  initialValue={primerApellido}
                >
                  <Input
                    allowClear
                    placeholder='Primer Apellido'
                    autoComplete='off'
                    type='text'
                    onKeyPress={(event) => {
                      if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ ]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label='Segundo Apellido'
                  name='secondSurname'
                  rules={[{ required: false, max: 50 }]}
                  initialValue={segundoApellido}
                >
                  <Input
                    allowClear
                    placeholder='Segundo Apellido'
                    autoComplete='off'
                    type='text'
                    onKeyPress={(event) => {
                      if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ ]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                    }}
                  />
                </Form.Item>
                {nn && (
                  <>
                    <Form.Item label='Observaciones.' name='observations' rules={[{ required: true }]}>
                      <Input.TextArea style={{ width: 500 }} />
                    </Form.Item>
                    <Form.Item label='Otros' name='fileOtrosDocumentos' rules={[{ required: true }]}>
                      <Upload
                        name='fileOtrosDocumentos'
                        maxCount={1}
                        beforeUpload={() => false}
                        listType='text'
                        accept='application/pdf'
                      >
                        <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
                      </Upload>
                    </Form.Item>
                  </>
                )}
                <div>
                  <Actions />
                </div>
              </>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
};
interface modificarcementerios {
  prop: any;
}
export const KeysForm = ['statustramite', 'observations'];
