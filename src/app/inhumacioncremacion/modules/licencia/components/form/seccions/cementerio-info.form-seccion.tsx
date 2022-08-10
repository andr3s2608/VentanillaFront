import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form, { FormInstance } from 'antd/es/form';
import Radio, { RadioChangeEvent } from 'antd/es/radio';
import Input from 'antd/es/input';
import Divider from 'antd/es/divider';

// Utilidades
import { ITipoLicencia } from 'app/shared/utils/types.util';

// Servicios
import { dominioService, ETipoDominio, IDepartamento, IMunicipio, IDominio, ICementerio } from 'app/services/dominio.service';
import { ApiService } from 'app/services/Apis.service';
import { authProvider } from 'app/shared/utils/authprovider.util';

// Componentes
import { SelectComponent } from 'app/shared/components/inputs/select.component';

interface municiopioDepartament {
  municipio: string;
  departament: string;
}

export const CementerioInfoFormSeccion: React.FC<ICementerioInfoProps<any>> = (props) => {
  const { form, tipoLicencia } = props;
  const { obj } = props;

  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  //#region Listados

  const [isMunicipio, setMunicipio] = useState<municiopioDepartament>({
    municipio: '',
    departament: ''
  });

  const [l_municipios, setLMunicipios] = useState<IMunicipio[]>([]);
  const [[l_departamentos_colombia, l_cementerios, l_paises], setListas] = useState<[IDepartamento[], ICementerio[], IDominio[]]>(
    [[], [], []]
  );

  const getListas = useCallback(
    async () => {
      const paises: any = localStorage.getItem('paises');
      const departamento: any = localStorage.getItem('departamentos');
      const resp = await Promise.all([JSON.parse(departamento), dominioService.get_cementerios_bogota(), JSON.parse(paises)]);

      setListas(resp);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //#endregion
  //#region Acciones del formulario
  const cota = 'b5c40416-db96-4d1d-a5bd-da0ce61930e7';
  const soacha = '2ad1a949-02a7-4e93-88f9-d39b98f2871f';
  const cundinamarca = '1029c7b3-e8c7-46e6-8275-3e568e06e03c';

  const lugarCementerio = obj?.isLugar();

  const [lugar, setLugar] = useState<TypeLugarCementerio>(lugarCementerio);
  const [validEmail, setValidEmail] = useState(false);
  const [validEmailFUN, setValidEmailFUN] = useState(false);

  const onChangeLugarCementerio = (e: RadioChangeEvent) => {
    form.resetFields([
      'cementerioBogota',
      'cementerioDepartamento',
      'cementerioMunicipio',
      'cementerioPais',
      'cementerioCiudad',
      'emailcementerio'
    ]);
    setLMunicipios([]);
    setLugar(e.target.value);
  };

  const onChangeDepartamento = async (value: string) => {
    let departamento = l_departamentos_colombia.filter((i) => i.idDepartamento == value);

    const { idDepartamento } = departamento[0];

    form.resetFields(['cementerioMunicipio']);
    const resp = await dominioService.get_all_municipios_by_departamento(idDepartamento);

    setLMunicipios(resp);
  };

  const onChangeMunicipio = async (value: string) => {
    const departament = form.getFieldValue('cementerioDepartamento');

    setMunicipio({
      departament: departament,
      municipio: value
    });
  };

  const cambioemailCEM = (e: any) => {
    let campo = e;

    const emailRegex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    //Se muestra un texto a modo de ejemplo, luego va a ser un icono

    //PREGUNTAR SI LOS EMAILS DE CEMENTERIO Y FUNERARIA APLICA PARA LA VALIDACION DE QUE SEA CORPORATIVO

    if (emailRegex.test(campo)) {
      //setValidEmail(true);
    } else {
      //setValidEmail(false);
    }
  };

  //#endregion

  const renderForm = (_lugar: TypeLugarCementerio) => {
    switch (_lugar) {
      case 'Fuera de Bogotá':
        return (
          <div className='fadeInRight'>
            <Form.Item
              label='Departamento de Colombia'
              name='cementerioDepartamento'
              rules={[{ required: true }]}
              initialValue={obj?.cementerioDepartamento}
            >
              <SelectComponent
                options={l_departamentos_colombia.filter((i) => i.descripcion !== 'BOGOTÁ D.C.')}
                optionPropkey='idDepartamento'
                optionPropLabel='descripcion'
                onChange={onChangeDepartamento}
              />
            </Form.Item>
            <Form.Item
              label='Municipio'
              name='cementerioMunicipio'
              initialValue={obj?.cementerioMunicipio}
              rules={[{ required: true }]}
            >
              <SelectComponent
                options={l_municipios}
                optionPropkey='idMunicipio'
                optionPropLabel='descripcion'
                onChange={onChangeMunicipio}
              />
            </Form.Item>
            {isMunicipio.departament === cundinamarca && (isMunicipio.municipio === cota || isMunicipio.municipio === soacha) && (
              <Form.Item label='Otro sitio' name='otro' rules={[{ required: true }]} initialValue={obj?.otro}>
                <Input allowClear placeholder='Otro Sitio' autoComplete='off' />
              </Form.Item>
            )}
          </div>
        );

      case 'Fuera del País':
        return (
          <div className='fadeInRight'>
            <Form.Item label='País' name='cementerioPais' rules={[{ required: true }]} initialValue={obj?.cementerioPais}>
              <SelectComponent
                options={l_paises.filter((i) => i.descripcion !== 'Colombia')}
                optionPropkey='id'
                optionPropLabel='descripcion'
              />
            </Form.Item>
            <Form.Item label='Ciudad' name='cementerioCiudad' initialValue={obj?.cementerioCiudad} rules={[{ required: true }]}>
              <Input
                allowClear
                placeholder='Ciudad'
                autoComplete='off'
                onKeyPress={(event) => {
                  if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ ]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
              />
            </Form.Item>
          </div>
        );

      default:
        return (
          <>
            <Form.Item
              className='fadeInRight'
              label='Cementerio de Bogotá D.C.'
              name='cementerioBogota'
              initialValue={obj?.cementerioBogota}
              rules={[{ required: true }]}
            >
              <SelectComponent options={l_cementerios} optionPropkey='RAZON_S' optionPropLabel='RAZON_S' />
            </Form.Item>
          </>
        );
    }
  };

  return (
    <>
      <Divider orientation='right'>DATOS DEL CEMENTERIO A REALIZAR LA {tipoLicencia}</Divider>
      <div>
        <Form.Item
          className='mb-4'
          label='Lugar del cementerio'
          name='cementerioLugar'
          initialValue={obj?.isLugar() ?? 'Dentro de Bogotá'}
          rules={[{ required: true }]}
        >
          <Radio.Group onChange={onChangeLugarCementerio}>
            <Radio value='Dentro de Bogotá'>DENTRO DE BOGOTÁ</Radio>
            <br />
            <Radio value='Fuera de Bogotá'>FUERA DE BOGOTÁ</Radio>
            <br />
            <Radio value='Fuera del País'>FUERA DEL PAÍS</Radio>
          </Radio.Group>
        </Form.Item>
        {renderForm(lugar)}
      </div>

      <Form.Item label='Email Cementerio' name='emailcementerio' rules={[{ required: true, type: 'email', max: 50 }]}>
        <Input
          allowClear
          placeholder='email@example.com'
          type='email'
          onKeyPress={(event) => {
            if (!/[a-zA-Z0-9ZñÑ@._-]/.test(event.key)) {
              event.preventDefault();
            }
          }}
          autoComplete='off'
        />
      </Form.Item>
    </>
  );
};

export const KeysForm = [
  'cementerioLugar',
  'cementerioBogota',
  'cementerioDepartamento',
  'cementerioMunicipio',
  'cementerioPais',
  'cementerioCiudad',
  'emailcementerio',
  'emailfuneraria'
];

interface ICementerioInfoProps<T> extends ITipoLicencia {
  form: FormInstance<T>;
  obj: any;
}

type TypeLugarCementerio = 'Dentro de Bogotá' | 'Fuera de Bogotá' | 'Fuera del País';
