import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Steps from 'antd/es/steps';
import Button from 'antd/es/button';

// Componentes
import { SelectComponent } from 'app/shared/components/inputs/select.component';

// Hooks
import { useStepperForm } from 'app/shared/hooks/stepper.hook';

// Utilidades
import { layoutItems, layoutWrapper } from 'app/shared/utils/form-layout.util';
import { ITipoLicencia } from 'app/shared/utils/types.util';

// Secciones del formulario
import { GeneralInfoFormSeccion, KeysForm as KeyFormGeneralInfo } from './seccions/general-info.form-seccion';
import { LugarDefuncionFormSeccion, KeysForm as KeyFormLugarDefuncion } from './seccions/lugar-defuncion.form-seccion';
import { DeathInstituteFormSeccion, KeysForm as KeyFormDeathInstitute } from './seccions/death-institute.form-seccion';
import { MedicalSignatureFormSeccion, KeysForm as KeyFormMedicalSignature } from './seccions/medical-signature.form-seccion';
import { CementerioInfoFormSeccion, KeysForm as KeyFormCementerio } from './seccions/cementerio-info.form-seccion';
import { SolicitudInfoFormSeccion, KeysForm as KeyFormSolicitudInfo } from './seccions/solicitud-info.form-seccion';
import { DocumentosFormSeccion } from './seccions/documentos.form-seccion';
import { AutorizacionCremacion } from './seccions/autorizacionCremacion';

// Servicios
import {
  dominioService,
  ETipoDominio,
  IBarrio,
  IDepartamento,
  IDominio,
  ILocalidad,
  IMunicipio,
  IUpz
} from 'app/services/dominio.service';
import Divider from 'antd/es/divider';
import Alert from 'antd/es/alert';
import Radio, { RadioChangeEvent } from 'antd/es/radio';
import { ApiService } from 'app/services/Apis.service';
import { authProvider } from 'app/shared/utils/authprovider.util';
import Swal from 'sweetalert2';

const { Step } = Steps;

export const FamilarFetalCremacion: React.FC<ITipoLicencia> = (props) => {
  const { tipoLicencia, objJosn } = props;
  const [form] = Form.useForm<any>();
  const { current, setCurrent, status, setStatus, onNextStep, onPrevStep } = useStepperForm<any>(form);

  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [isPersonNatural, setIsPersonNatural] = useState<boolean>(false);
  const [longitudmaxima, setLongitudmaxima] = useState<number>(10);
  const [longitudminima, setLongitudminima] = useState<number>(6);
  const [tipocampo, setTipocampo] = useState<string>('[0-9]{6,10}');
  const [tipocampovalidacion, setTipocampovalidacion] = useState<any>(/[0-9]/);
  const [tipodocumento, setTipodocumento] = useState<string>('Cédula de Ciudadanía');
  const [campo, setCampo] = useState<string>('Numéricos');
  //#region Listados

  const [l_departamentos, setLDepartamentos] = useState<IDepartamento[]>([]);
  const [l_localidades, setLLocalidades] = useState<ILocalidad[]>([]);
  const [user, setUser] = useState<any>();
  const [[l_tipos_documento, l_nivel_educativo, l_paises, l_tipo_muerte, l_estado_civil, l_etnia], setListas] = useState<
    IDominio[][]
  >([]);

  const getListas = useCallback(
    async () => {
      const [userres, departamentos, localidades, ...resp] = await Promise.all([
        api.getCodeUser(),
        dominioService.get_departamentos_colombia(),
        dominioService.get_localidades_bogota(),
        dominioService.get_type(ETipoDominio['Tipo Documento']),
        dominioService.get_type(ETipoDominio['Nivel Educativo']),
        dominioService.get_type(ETipoDominio.Pais),
        dominioService.get_type(ETipoDominio['Tipo de Muerte']),
        dominioService.get_type(ETipoDominio['Estado Civil']),
        dominioService.get_type(ETipoDominio.Etnia)
      ]);

      const informationUser = await api.GetInformationUser(userres);

      setUser(userres);
      setLDepartamentos(departamentos);
      setLLocalidades(localidades);
      setListas(resp);

      if (informationUser.tipoIdentificacion == 5) {
        setIsPersonNatural(false);
      } else {
        setIsPersonNatural(true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //#endregion

  const onSubmit = async (values: any) => {
    setStatus(undefined);
  };

  const onSubmitFailed = () => setStatus('error');

  //#region Eventos formulario

  const [l_municipios, setLMunicipios] = useState<IMunicipio[]>([]);
  const [l_areas, setLAreas] = useState<IUpz[]>([]);
  const [l_barrios, setLBarrios] = useState<IBarrio[]>([]);

  const [isColombia, setIsColombia] = useState(false);
  const [isBogota, setIsBogota] = useState(false);

  const idColombia = '1e05f64f-5e41-4252-862c-5505dbc3931c';
  const onChangePais = (value: string) => {
    form.resetFields(['departamento', 'ciudad', 'localidad', 'area', 'barrio']);
    setIsColombia(value === idColombia);
    setLMunicipios([]);
    setIsBogota(false);
    setLAreas([]);
    setLBarrios([]);
  };

  const idBogota = '31211657-3386-420a-8620-f9c07a8ca491';
  const onChangeMunicipio = (value: string) => {
    form.resetFields(['localidad', 'area', 'barrio']);
    setIsBogota(value === idBogota);
    setLAreas([]);
    setLBarrios([]);
  };

  const onChangeLocalidad = async (value: string) => {
    form.resetFields(['area', 'barrio']);
    const resp = await dominioService.get_upz_by_localidad(value);
    setLAreas(resp);
    setLBarrios([]);
  };

  const onChangeArea = async (value: string) => {
    form.resetFields(['barrio']);
    const resp = await dominioService.get_barrio_by_upz(value);
    setLBarrios(resp);
  };
  const [isOtherParentesco, setIsOtherParentesco] = useState(false);
  const onChangeParentesco = (e: RadioChangeEvent) => {
    form.resetFields(['authOtherParentesco']);
    setIsOtherParentesco(e.target.value === 'Otro');
  };
  //#endregion

  //validacion Tipo de documento//
  const cambiodocumento = (value: any) => {
    form.setFieldsValue({ mauthIDNumber: undefined });
    const valor: string = value;
    const valorupper = valor.toUpperCase();

    if (valorupper == '7C96A4D3-A0CB-484E-A01B-93BC39C2552E') {
      setLongitudminima(6);
      setLongitudmaxima(10);
      setTipocampo('[0-9]{6,10}');
      setTipocampovalidacion(/[0-9]/);
      setCampo('Numéricos');
      setTipodocumento('Cédula de Ciudadanía');
    } else {
      if (valorupper == 'AC3629D8-5C87-46CE-A8E2-530B0495CBF6') {
        setLongitudminima(10);
        setLongitudmaxima(11);
        setTipocampo('[0-9]{10,11}');
        setTipocampovalidacion(/[0-9]/);
        setCampo('Numéricos');
        setTipodocumento('Tarjeta de Identidad ');
      } else {
        if (valorupper == '2491BC4B-8A60-408F-9FD1-136213F1E4FB') {
          setLongitudminima(15);
          setLongitudmaxima(15);
          setTipocampo('[0-9]{15,15}');
          setTipocampovalidacion(/[0-9]/);
          setCampo('Numéricos');
          setTipodocumento('Permiso Especial de Permanencia');
        } else {
          if (valorupper == 'FFE88939-06D5-486C-887C-E52D50B7F35D' || valorupper == '71F659BE-9D6B-4169-9EE2-E70BF0D65F92') {
            setLongitudminima(10);
            setLongitudmaxima(11);
            setTipocampo('[a-zA-Z0-9]{10,11}');
            setTipocampovalidacion(/[a-zA-Z0-9]/);
            setCampo('AlfaNuméricos(Numéros y letras)');
            setTipodocumento('Registro Civil de Nacimiento y Numero único de identificacíon personal');
          } else {
            setLongitudminima(6);
            setLongitudmaxima(10);
            setTipocampo('[a-zA-Z0-9]{6,10}');
            setTipocampovalidacion(/[a-zA-Z0-9]/);
            setCampo('AlfaNuméricos(Numéros y letras)');
            setTipodocumento('Pasaporte , Cédula de Extranjería y  Tarjeta de Extranjería ');
          }
        }
      }
    }
  };

  return (
    <div className='fadeInRight'>
      <Divider orientation='right'> Datos Del Familiar Que Autoriza la Cremación </Divider>
      <Form.Item {...layoutWrapper}>
        <Alert message='Diligencie la información del familiar o persona que autoriza la cremación.' type='warning' showIcon />
      </Form.Item>

      <Form.Item
        label='Tipo Documento'
        name='authIDType'
        initialValue='7c96a4d3-a0cb-484e-a01b-93bc39c2552e'
        rules={[{ required: true }]}
      >
        <SelectComponent
          options={l_tipos_documento}
          onChange={cambiodocumento}
          optionPropkey='id'
          optionPropLabel='descripcion'
        />
      </Form.Item>

      <Form.Item label='Número de Identificación' name='mauthIDNumber' rules={[{ required: true, max: 20 }]}>
        <Input
          allowClear
          type='text'
          placeholder='Número Identificación'
          autoComplete='off'
          pattern={tipocampo}
          maxLength={longitudmaxima}
          onKeyPress={(event) => {
            if (!/[a-zA-Z0-9]/.test(event.key)) {
              event.preventDefault();
            }
          }}
          onPaste={(event) => {
            event.preventDefault();
          }}
          onInvalid={() => {
            Swal.fire({
              icon: 'error',
              title: 'Datos invalidos',
              text:
                'Sección:Datos Del Familiar Que Autoriza la Cremación \n recuerde que para el tipo de documento: ' +
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

      <Form.Item label='Primer Nombre' name='authName' rules={[{ required: true, max: 50 }]}>
        <Input
          allowClear
          placeholder='Primer Nombre'
          autoComplete='off'
          type='text'
          onKeyPress={(event) => {
            if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ]/.test(event.key)) {
              event.preventDefault();
            }
          }}
          onPaste={(event) => {
            event.preventDefault();
          }}
        />
      </Form.Item>
      <Form.Item label='Segundo Nombre' name='authSecondName'>
        <Input
          allowClear
          placeholder='Segundo Nombre'
          autoComplete='off'
          type='text'
          onKeyPress={(event) => {
            if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ]/.test(event.key)) {
              event.preventDefault();
            }
          }}
          onPaste={(event) => {
            event.preventDefault();
          }}
        />
      </Form.Item>
      <Form.Item label='Primer Apellido' name='authSurname' rules={[{ required: true, max: 50 }]}>
        <Input
          allowClear
          placeholder='Primer Apellido'
          autoComplete='off'
          type='text'
          onKeyPress={(event) => {
            if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ]/.test(event.key)) {
              event.preventDefault();
            }
          }}
          onPaste={(event) => {
            event.preventDefault();
          }}
        />
      </Form.Item>
      <Form.Item label='Segundo Apellido' name='authSecondSurname'>
        <Input
          allowClear
          placeholder='Segundo Apellido'
          autoComplete='off'
          type='text'
          onKeyPress={(event) => {
            if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ]/.test(event.key)) {
              event.preventDefault();
            }
          }}
          onPaste={(event) => {
            event.preventDefault();
          }}
        />
      </Form.Item>

      <Form.Item
        label='Parentesco'
        name='authParentesco'
        initialValue='Cónyuge (Compañero/a Permanente)'
        rules={[{ required: true }]}
      >
        <Radio.Group onChange={onChangeParentesco}>
          <Radio value='Padre / Madre'>Padre / Madre</Radio>
          <br />
          <Radio value='Hermano/a'>Hermano/a</Radio>
          <br />
          <Radio value='Hijo/a'>Hijo/a</Radio>
          <br />
          <Radio value='Cónyuge (Compañero/a Permanente)'>Cónyuge (Compañero/a Permanente)</Radio>
          <br />
          <Radio value='Tío/a'>Tío/a</Radio>
          <br />
          <Radio value='Sobrino/a'>Sobrino/a</Radio>
          <br />
          <Radio value='Abuelo/a'>Abuelo/a</Radio>
          <br />
          <Radio value='Nieto/a'>Nieto/a</Radio>
          <br />
          <Radio value='Otro'>Otro</Radio>
        </Radio.Group>
      </Form.Item>

      {isOtherParentesco && (
        <Form.Item
          className='fadeInRight'
          label='Otro... ¿Cúal?'
          name='authOtherParentesco'
          initialValue={objJosn?.authOtherParentesco ? objJosn?.authOtherParentesco : null}
          rules={[{ required: true }]}
        >
          <Input allowClear placeholder='Especifique el Parentesco' autoComplete='off' />
        </Form.Item>
      )}

      <AutorizacionCremacion tipoLicencia={tipoLicencia} />
    </div>
  );
};
