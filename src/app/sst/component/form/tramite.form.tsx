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
import Button from 'antd/es/button';
import {TipoTramiteFormSeccion} from './secciones/tipo-tramite.form-section';
import {DatosLaboralesFormSeccion} from './secciones/datos-laborales.form-section';
import {TipoServicioFormSeccion} from './secciones/tipo-servicio.form-section';
import {DocumentosSSTFormSeccion} from './secciones/documentos-sst.form-section';
// import {DatosSolicitanteSSTFormSeccion} from './secciones/datos-solicitante.form-section';

const { Step } = Steps;

export const TramiteForm = () => {

  const [inputVal, setInputVal] = useState('');
  const [form] = Form.useForm<any>();
  const { current, setCurrent, status, setStatus, onNextStep, onPrevStep } = useStepperForm<any>(form);
  const onSubmitFailed = () => setStatus('error');
  const objJosn: any = undefined;
  const { accountIdentifier } = authProvider.getAccount();

  const [longitudmaximaautoriza, setLongitudmaximaautoriza] = useState<number>(10);
  const [longitudminimaautoriza, setLongitudminimaautoriza] = useState<number>(4);
  const [tipocampoautoriza, setTipocampoautoriza] = useState<string>('[0-9]{4,10}');
  const [sininformacionaut, setsininformacionaut] = useState<boolean>(false);
  const [tipocampovalidacionautoriza, setTipocampovalidacionautoriza] = useState<any>(/[0-9]/);
  const [tipodocumentoautoriza, setTipodocumentoautoriza] = useState<string>('Cédula de Ciudadanía');
  const [campoautoriza, setCampoautoriza] = useState<string>('Numéricos');
  const [l_tipos_documento_autoriza, settiposautoriza] = useState<any>();
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

  const [count, setCount] = useState(0);




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

        <Form form={form}
              className='mb-4 w-100'{...layoutItems}
              style={{ maxWidth: 800 }}
              layout='horizontal'
              // onFinish={onSubmit}
              onFinishFailed={onSubmitFailed}>
          <>


            <div className={` ${current != 0 && 'd-none'} fadeInRight ${current == 0 && 'd-block'}`}>

              <TipoTramiteFormSeccion form={form} required={true} obj={objJosn}

              />

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
            <div className={` ${current != 2 && 'd-none'} fadeInRight ${current == 2 && 'd-block'}`}>

              <DatosLaboralesFormSeccion form={form} required={true} obj={objJosn}/>

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
            <div className={` ${current != 3 && 'd-none'} fadeInRight ${current == 3 && 'd-block'}`}>

              <TipoServicioFormSeccion form={form} required={true} obj={objJosn}/>

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

              <DocumentosSSTFormSeccion form={form} required={true} obj={objJosn}/>

              <Actions />
            </div>
          </>
        </Form>

      </div>
    </div>
  );
}
