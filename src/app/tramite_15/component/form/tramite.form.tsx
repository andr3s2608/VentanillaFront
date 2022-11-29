import Steps from 'antd/es/steps';
import React, {useCallback, useEffect, useState} from 'react';
import {layoutItems, layoutWrapper} from '../../../shared/utils/form-layout.util';
import Form from 'antd/es/form';
import {useStepperForm} from '../../../shared/hooks/stepper.hook';
import Divider from 'antd/es/divider';
import Input from 'antd/es/input';
import {SelectComponent} from '../../../shared/components/inputs/select.component';
import {DatepickerComponent} from '../../../shared/components/inputs/datepicker.component';
import Swal from 'sweetalert2';
import {dominioService, ETipoDominio, IDominio} from '../../../services/dominio.service';
import {ApiService} from '../../../services/Apis.service';
import {authProvider} from '../../../shared/utils/authprovider.util';
import {BasicaInformacion} from '../../../inhumacioncremacion/modules/pages/components/form/BasicaInformacion';
import {
  GeneralInfoFormSeccion
} from '../../../inhumacioncremacion/modules/licencia/components/form/seccions/general-info.form-seccion';
import {
  LugarDefuncionFormSeccion
} from '../../../inhumacioncremacion/modules/licencia/components/form/seccions/lugar-defuncion.form-seccion';
import {
  DeathInstituteFormSeccion
} from '../../../inhumacioncremacion/modules/licencia/components/form/seccions/death-institute.form-seccion';
import Button from 'antd/es/button';
import Radio from 'antd/es/radio';
import {
  DocumentosFormSeccion
} from '../../../inhumacioncremacion/modules/licencia/components/form/seccions/documentos.form-seccion';
import {EyeOutlined, UploadOutlined} from '@ant-design/icons';
import Upload from 'antd/es/upload';

const { Step } = Steps;

export const TramiteForm = () => {

  const [inputVal, setInputVal] = useState('');
  const [form] = Form.useForm<any>();
  const { current, setCurrent, status, setStatus, onNextStep, onPrevStep } = useStepperForm<any>(form);
  const onSubmitFailed = () => setStatus('error');
  const objJosn: any = undefined;
  const { accountIdentifier } = authProvider.getAccount();

  //---
  const [longitudmaxima, setLongitudmaxima] = useState<number>(10);
  const [longitudminima, setLongitudminima] = useState<number>(4);
  const [tipocampo, setTipocampo] = useState<string>('[0-9]{4,10}');
  const [tipocampovalidacion, setTipocampovalidacion] = useState<any>(/[0-9]/);
  const [tipodocumento, setTipodocumento] = useState<string>('Cédula de Ciudadanía');
  const [sininformacion, setsininformacion] = useState<boolean>(false);
  const [tipodocumentohoranacimiento, settipodocumentohoranacimiento] = useState<string>('7c96a4d3-a0cb-484e-a01b-93bc39c2552e');
  const [campo, setCampo] = useState<string>('Numéricos');
  //---
  const [longitudmaximaautoriza, setLongitudmaximaautoriza] = useState<number>(10);
  const [longitudminimaautoriza, setLongitudminimaautoriza] = useState<number>(4);
  const [tipocampoautoriza, setTipocampoautoriza] = useState<string>('[0-9]{4,10}');
  const [sininformacionaut, setsininformacionaut] = useState<boolean>(false);
  const [tipocampovalidacionautoriza, setTipocampovalidacionautoriza] = useState<any>(/[0-9]/);
  const [tipodocumentoautoriza, setTipodocumentoautoriza] = useState<string>('Cédula de Ciudadanía');
  const [campoautoriza, setCampoautoriza] = useState<string>('Numéricos');
  const [l_tipos_documento_autoriza, settiposautoriza] = useState<any>();
  const [causaMuerte, setCausaMuerte] = useState<string>('');
  const [[l_paises, l_tipos_documento, l_estado_civil, l_nivel_educativo, l_etnia, l_regimen, l_tipo_muerte], setListas] =
    useState<IDominio[][]>([]);
  const [user, setUser] = useState<any>();
  const edit = false;
  const [supports, setSupports] = useState<any[]>([]);
  const api = new ApiService(accountIdentifier);

  const getListas = useCallback(
    async () => {
      const paises: any = localStorage.getItem('paises');
      const paisesjson: any = JSON.parse(paises);

      const tipos: any = localStorage.getItem('tipoid');
      const tiposjson: any = JSON.parse(tipos);

      const estadocivil: any = localStorage.getItem('estadocivil');

      const nivel: any = localStorage.getItem('nivel');

      const etnia: any = localStorage.getItem('etnia');

      const tipomuerte: any = localStorage.getItem('tipomuerte');

      const resp = await Promise.all([
        paisesjson,
        tiposjson,
        JSON.parse(estadocivil),
        JSON.parse(nivel),
        JSON.parse(etnia),
        dominioService.get_type(ETipoDominio.Regimen),
        JSON.parse(tipomuerte)
      ]);

      const nuevalista = tiposjson.filter((i: { id: string }) => i.id != '7c96a4d3-a0cb-484e-a01b-93bc39c7902e');

      settiposautoriza(nuevalista);

      const iduser: any = localStorage.getItem('idUser');

      setUser(JSON.parse(iduser));
      setListas(resp);

      if (edit) {
        const support = await api.getSupportDocuments(objJosn?.idSolicitud);
        setSupports(support);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  //edit
  const Actions = () => (
    <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
      <div className='d-flex justify-content-between'>
        <Button type='dashed' htmlType='button' onClick={onPrevStep}>
          Volver atrás
        </Button>
        <Button type='primary' htmlType='submit'>
          Guardar
        </Button>
      </div>
    </Form.Item>
  );

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      localStorage.removeItem('register');
    };
  }, []);

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  //validacion Tipo de documento//
  const cambiodocumento = (value: any) => {
    const valor: string = value;
    settipodocumentohoranacimiento(valor);

    const valorupper = valor.toUpperCase();
    setsininformacion(false);

    if (valorupper == 'C087D833-3CFB-460F-AA78-E5CF2FE83F25') {
      form.setFieldsValue({ IDNumber: undefined });
      setLongitudminima(0);
      setLongitudmaxima(15);
      setTipocampo('[a-zA-Z0-9]{0,15}');
      setTipocampovalidacion(/[a-zA-Z0-9]/);
      setTipodocumento('Sin Identificación');
      setCampo('AlfaNuméricos(Numéros y letras)');
      setsininformacion(true);
    } else {
      if (valorupper == '7C96A4D3-A0CB-484E-A01B-93BC39C7902E') {
        setLongitudminima(2);
        setLongitudmaxima(10);
        setTipocampo('[0-9]{2,10}');
        setTipocampovalidacion(/[0-9]/);
        setCampo('Numéricos');
        setTipodocumento('Número de Protocolo');
        form.setFieldsValue({ IDNumber: '8001508610' });
      } else {
        form.setFieldsValue({ IDNumber: undefined });
        if (valorupper === '7C96A4D3-A0CB-484E-A01B-93BC39C2552E') {
          setLongitudminima(4);
          setLongitudmaxima(10);
          setTipocampo('[0-9]{4,10}');
          setTipocampovalidacion(/[0-9]/);
          setCampo('Numéricos');
          setTipodocumento('Cédula de Ciudadanía');
        } else {
          if (valorupper === 'AC3629D8-5C87-46CE-A8E2-530B0495CBF6') {
            setLongitudminima(10);
            setLongitudmaxima(11);
            setTipocampo('[0-9]{10,11}');
            setTipocampovalidacion(/[0-9]/);
            setCampo('Numéricos');
            setTipodocumento('Tarjeta de Identidad ');
          } else {
            if (valorupper === '2491BC4B-8A60-408F-9FD1-136213F1E4FB') {
              setLongitudminima(15);
              setLongitudmaxima(15);
              setTipocampo('[0-9]{15,15}');
              setTipocampovalidacion(/[0-9]/);
              setCampo('Numéricos');
              setTipodocumento('Permiso Especial de Permanencia');
            } else {
              if (valorupper === 'FFE88939-06D5-486C-887C-E52D50B7F35D' ||
                valorupper === '71F659BE-9D6B-4169-9EE2-E70BF0D65F92' ||
                valorupper === '97F5657D-D8EC-48EF-BBE3-1BABEFECB1A4') {
                setLongitudminima(10);
                setLongitudmaxima(11);
                setTipocampo('[a-zA-Z0-9]{10,11}');
                setTipocampovalidacion(/[a-zA-Z0-9]/);
                setCampo('AlfaNuméricos(Numéros y letras)');
                setTipodocumento('Registro Civil de Nacimiento , Numero único de identificacíon personal y Carné Diplomatico');
              } else {
                if (valorupper === '0D69523B-4676-4E3D-8A3D-C6800A3ACF3E') {
                  setLongitudminima(6);
                  setLongitudmaxima(16);
                  setTipocampo('[0-9]{6,16}');
                  setTipocampovalidacion(/[0-9]/);
                  setCampo('Numéricos');
                  setTipodocumento('Certificado de nacido vivo ');

                }
                else {
                  if (valorupper === '60518653-70B7-42AB-8622-CAA27B496184') {
                    setLongitudminima(7);
                    setLongitudmaxima(16);
                    setTipocampo('[a-zA-Z0-9]{7,16}');
                    setTipocampovalidacion(/[a-zA-Z0-9]/);
                    setCampo('AlfaNumérico(Numéros y letras)');
                    setTipodocumento('Documento Extranjero');

                  }
                  else {
                    if (valorupper === 'C532C358-56AE-4F93-8B9B-344DDF1256B7') {
                      setLongitudminima(9);
                      setLongitudmaxima(9);
                      setTipocampo('[a-zA-Z0-9]{9,9}');
                      setTipocampovalidacion(/[a-zA-Z0-9]/);
                      setCampo('AlfaNumérico(Numéros y letras)');
                      setTipodocumento('Salvoconducto');

                    }
                    else {
                      if (valorupper === '6AE7E477-2DE5-4149-8C93-12ACA6668FF0') {
                        setLongitudminima(5);
                        setLongitudmaxima(11);
                        setTipocampo('[a-zA-Z0-9]{5,11}');
                        setTipocampovalidacion(/[a-zA-Z0-9]/);
                        setCampo('AlfaNumérico(Numéros y letras)');
                        setTipodocumento('Adulto Sin Identificar');

                      }

                      else {
                        if (valorupper === '5FA5BF3F-B342-4596-933F-0956AE4B9109') {
                          setLongitudminima(5);
                          setLongitudmaxima(12);
                          setTipocampo('[a-zA-Z0-9]{5,12}');
                          setTipocampovalidacion(/[a-zA-Z0-9]/);
                          setCampo('AlfaNumérico(Numéros y letras)');
                          setTipodocumento('Menor Sin Identificar');

                        }
                        else {
                          if (valorupper === 'E927B566-7B8E-4B4D-AE26-14454705CB5E') {
                            setLongitudminima(4);
                            setLongitudmaxima(18);
                            setTipocampo('[a-zA-Z0-9]{4,18}');
                            setTipocampovalidacion(/[a-zA-Z0-9]/);
                            setCampo('AlfaNumérico(Numéros y letras)');
                            setTipodocumento('Permiso de Protección Temporal');

                          }
                          else {
                            setLongitudminima(4);
                            setLongitudmaxima(16);
                            setTipocampo('[a-zA-Z0-9]{4,16}');
                            setTipocampovalidacion(/[a-zA-Z0-9]/);
                            setCampo('AlfaNuméricos(Numéros y letras)');
                            setTipodocumento('Pasaporte , Cédula de Extranjería y  Tarjeta de Extranjería ');
                          }

                        }

                      }


                    }

                  }


                }

              }
            }
          }
        }
      }
    }
  };
  //#endregion

  function agregarValoresDinamicos(HTML: string, llavesAReemplazar: string[], valoresDinamicos: string[]): string {
    let nuevoHTML = HTML;

    for (let index = 0; index < llavesAReemplazar.length; index++) {
      nuevoHTML = nuevoHTML.replace(llavesAReemplazar[index], valoresDinamicos[index]);
    }

    return nuevoHTML;
  }


  return (
    <div className='card card-body py-5 mb-4 fadeInTop'>
      <div className='d-lg-flex align-items-start'>
        <Steps
          className='mb-5 mr-5'
           current={current}
           status={status}
           onChange={setCurrent}
          direction='vertical'
          style={{ maxWidth: 350 }}
        >
          <Step title='Tipo trámite' description='Tipo de tramite' />
          <Step title='Datos personales' description='Datos personales de quien solicita.' />
          <Step title='Datos Laborales' description='Datos laborales de quien solicita' />
          <Step title='Tipos de servicio a prestar' description='Servicios que presta el solicitante' />
          <Step title='Documentos adjuntos' description='Documentos del solicitante' />
        </Steps>

        <Form form={form} className='mb-4 w-100'{...layoutItems} style={{ maxWidth: 800 }} layout='horizontal'
        // onFinish={onSubmit}
        onFinishFailed={onSubmitFailed}>
          <>
            <div className={` ${current != 0 && 'd-none'} fadeInRight ${current == 0 && 'd-block'}`}>

              <Form.Item
                label='TipoTramite'
                name='tipotramite'
                rules={[{ required: true }]}
              >
                <Radio.Group>
                  <Radio value='11c463f3-8135-4545-b58f-3fc748edde94'>Primera vez</Radio>
                  <Radio value='259cf2da-6175-4dba-bd55-62723adf0dfa'>Renovación</Radio>
                  <Radio value='0347ea5e-691e-44a0-87a5-b22d39f1ff94'>Modificación</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
                <div className='d-flex justify-content-between'>
                  <Button href='#ancla-1' type='primary' htmlType='button'>
                    Siguiente
                  </Button>
                </div>
              </Form.Item>
            </div>
          </>
          <>
            <div className={`${current != 1 && 'd-none'} fadeInRight ${current == 1 && 'd-block'}`}>
              <Divider orientation='right'>Datos del solicitante</Divider>
              <Form.Item
                label='Tipo Identificación'
                name='IDType'
                initialValue={objJosn?.IDType ? objJosn?.IDType : '7c96a4d3-a0cb-484e-a01b-93bc39c2552e'}
                rules={[{ required: true }]}
              >
                <SelectComponent
                  options={l_tipos_documento}
                  onChange={cambiodocumento}
                  optionPropkey='id'
                  optionPropLabel='descripcion'
                />
              </Form.Item>
              <Form.Item label='Número de Identificación' name='IDNumber' rules={[{ required: !sininformacion }]}>
                <Input
                  allowClear
                  type='text'
                  placeholder='Número Identificación'
                  autoComplete='off'
                  pattern={tipocampo}
                  maxLength={longitudmaxima}
                  onKeyPress={(event) => {
                    if (!tipocampovalidacion.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onPaste={(event) => {
                    event.preventDefault();
                  }}
                  onInvalid={() => {
                    Swal.fire({
                      icon: 'error',
                      title: 'Datos inválidos',
                      text:
                        'Sección:DATOS PERSONALES \n recuerde que para el tipo de documento: ' +
                        tipodocumento +
                        ' solo se admiten valores ' +
                        campo +
                        ' de longitud entre ' +
                        longitudminima +
                        ' y ' +
                        longitudmaxima
                    });
                  }}
                />
              </Form.Item>
              <Form.Item label='Primer Nombre' name='name' rules={[{ required: true, max: 50 }]} initialValue={objJosn?.name}>
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
                initialValue={objJosn?.secondName}
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
                initialValue={objJosn?.surname}
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
                initialValue={objJosn?.secondSurname}
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
              <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
                <div className='d-flex justify-content-between'>
                  <Button type='dashed' htmlType='button' onClick={onPrevStep}>
                    Volver atrás
                  </Button>
                  <Button href='#ancla-1' type='primary' htmlType='button'>
                    Siguiente
                  </Button>
                </div>
              </Form.Item>
            </div>
          </>
          <>
            <div className={`${current != 4 && 'd-none'} fadeInRight ${current == 4 && 'd-block'}`}>

              <Form.Item
                label='Documento identidad'
                name='fileDocumentoIdentidad'
                valuePropName='fileList'
                //rules={[{ required: isEdit ? false : true }]}
                getValueFromEvent={normFile}
              >
                <Upload name='fileDocumentoIdentidad' maxCount={1} beforeUpload={() => false} listType='text' accept='application/pdf'>
                  <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
                </Upload>
              </Form.Item>
              <Form.Item
                label='PDF Título Pregrado'
                name='fileTituloPregrado'
                valuePropName='fileList'
                //rules={[{ required: isEdit ? false : true }]}
                getValueFromEvent={normFile}
              >
                <Upload name='fileTituloPregrado' maxCount={1} beforeUpload={() => false} listType='text' accept='application/pdf'>
                  <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
                </Upload>
              </Form.Item>

              <Form.Item
                label='PDF Título Postgrado'
                name='fileTituloPostgrado'
                valuePropName='fileList'
                //rules={[{ required: isEdit ? false : true }]}
                getValueFromEvent={normFile}
              >
                <Upload name='fileTituloPostgrado' maxCount={1} beforeUpload={() => false} listType='text' accept='application/pdf'>
                  <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
                </Upload>
              </Form.Item>

              <Form.Item
                label='PDF Certificado de notas o asignaturas Aprobadas'
                name='fileCertificadoNotasAsignaturas'
                valuePropName='fileList'
                //rules={[{ required: isEdit ? false : true }]}
                getValueFromEvent={normFile}
              >
                <Upload name='fileCertificadoNotasAsignaturas' maxCount={1} beforeUpload={() => false} listType='text' accept='application/pdf'>
                  <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
                </Upload>
              </Form.Item>

              <Form.Item
                label='Soporte que demuestre que el programa es de Educación Formal de Carácter Superior'
                name='fileSoporteEducacionSuperior'
                valuePropName='fileList'
                //rules={[{ required: isEdit ? false : true }]}
                getValueFromEvent={normFile}
              >
                <Upload name='fileSoporteEducacionSuperior' maxCount={1} beforeUpload={() => false} listType='text' accept='application/pdf'>
                  <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
                </Upload>
              </Form.Item>

              <Actions />
            </div>
          </>
        </Form>

      </div>
    </div>
  );
}
