import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form from 'antd/es/form';
import Input from 'antd/es/input';

// Servicios

import { authProvider } from 'app/shared/utils/authprovider.util';
import { ApiService } from 'app/services/Apis.service';

import { ICementerio } from 'app/services/dominio.service';
import { SelectComponent } from 'app/shared/components/inputs/select.component';

import Swal from 'sweetalert2';

export const DatoSolicitanteAdd: React.FC<any> = (props: any) => {
  const [longitudmaxima, setLongitudmaxima] = useState<number>(10);
  const [longitudminima, setLongitudminima] = useState<number>(5);
  const [tipocampo, setTipocampo] = useState<string>('[0-9]{4,10}');
  const [tipocampovalidacion, setTipocampovalidacion] = useState<any>(/[0-9]/);
  const [correosol, setcorreosol] = useState<string>('');
  const [correofun, setcorreofun] = useState<string>('');
  const [valorfuneraria, setvalorfuneraria] = useState<string>();
  const [validacionfuneraria, setvalidacionfuneraria] = useState<boolean>(false);
  const [tipodocumento, setTipodocumento] = useState<string>('Cédula de Ciudadanía');
  const [campo, setCampo] = useState<string>('Numéricos');
  const [sininformacion, setsininformacion] = useState<boolean>(false);
  const { obj, prop, form } = props;
  const [l_tipo_documento, settipos] = useState<any>();
  const lugarFuneraria = obj?.isLugar();
  const [lugarfuneraria, setLugarFuneraria] = useState<TypeLugarFuneraria>(lugarFuneraria);
  const [l_funerarias, setLfunerarias] = useState<ICementerio[]>([]);
  const [validacion, setvalidacion] = useState<string>('0');

  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  //#region Cargar Listas

  const getLista = useCallback(
    async () => {
      const tipos: any = localStorage.getItem('tipoid');
      const tiposjson: any = JSON.parse(tipos);

      const nuevalista = tiposjson.filter((i: { id: string }) => i.id != '7c96a4d3-a0cb-484e-a01b-93bc39c7902e');
      settipos(nuevalista);
      const infouser: any = localStorage.getItem('infouser');
      const info: any = JSON.parse(infouser);
      if (info.razonSocial != null) {
        //form.setFieldsValue({ emailsolicitudadd: undefined });
        //form.setFieldsValue({ emailfuneraria: undefined });
        setcorreofun(info.email);
        setvalidacionfuneraria(true);

        const lista = await api.GetFunerarias();
        const result = lista.find((funeraria: any) =>
          funeraria.RAZON_S.toUpperCase().includes(info.fullName.trim().toUpperCase())
        );
        let array: any[] = [];

        if (result) {
          if (!result.isArray) {
            array.push(result);
          } else {
            array = result;
          }

          setvalorfuneraria(array[0].RAZON_S);
        } else {
          setvalidacionfuneraria(false);
        }

        setvalidacion('1');
      } else {
        //form.setFieldsValue({ emailsolicitudadd: undefined });
        //form.setFieldsValue({ emailfuneraria: undefined });
        setcorreosol(info.email);
        setvalidacionfuneraria(false);

        setvalidacion('1');
      }

      const funeraria = await api.GetFunerarias();

      setLfunerarias(funeraria);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  let validEmail = false;
  const onChange = (value: any) => {
    prop(validEmail);
  };

  const setearCampos = () => {
    if (validacion === '1') {
      return true;
    } else {
      return false;
    }
  };

  const cambioemail = (e: any) => {
    let campo = e;

    const emailRegex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    //Se muestra un texto a modo de ejemplo, luego va a ser un icono
    let corporativo = campo.includes('@hotmail.');
    if (true) {
      // Agregar que el usuario logueado SI es juridico
      if (corporativo == false) {
        corporativo = campo.includes('@gmail.');
        if (corporativo == false) {
          corporativo = campo.includes('@outlook.');
          if (corporativo == false) {
            corporativo = campo.includes('@yahoo.');
          }
        }
      }
    }

    if (emailRegex.test(campo) && !corporativo) {
      validEmail = true;

      onChange(validEmail);
    } else {
      validEmail = false;
      onChange(validEmail);
    }
  };
  //validacion Tipo de documento//
  const cambiodocumento = (value: any) => {
    form.setFieldsValue({ ndoc: undefined });
    const valor: string = value;
    const valorupper = valor.toUpperCase();

    setsininformacion(false);

    if (valorupper == 'C087D833-3CFB-460F-AA78-E5CF2FE83F25') {
      setLongitudminima(5);
      setLongitudmaxima(15);
      setTipocampo('[a-zA-Z0-9]{5,15}');
      setTipocampovalidacion(/[a-zA-Z0-9]/);
      setTipodocumento('Sin Información');
      setCampo('AlfaNuméricos(Numéros y letras)');
      setsininformacion(true);
    } else {
      if (valorupper == '7C96A4D3-A0CB-484E-A01B-93BC39C2552E') {
        setLongitudminima(4);
        setLongitudmaxima(10);
        setTipocampo('[0-9]{4,10}');
        setTipocampovalidacion(/[0-9]/);
        setCampo('Numéricos');
        setTipodocumento('Cédula de Ciudadanía');
        prop(6, 'solicitante');
      } else {
        if (valorupper == 'AC3629D8-5C87-46CE-A8E2-530B0495CBF6') {
          setLongitudminima(10);
          setLongitudmaxima(11);
          setTipocampo('[0-9]{10,11}');
          setTipocampovalidacion(/[0-9]/);
          setCampo('Numéricos');
          setTipodocumento('Tarjeta de Identidad ');
          prop(10, 'solicitante');
        } else {
          if (valorupper == '2491BC4B-8A60-408F-9FD1-136213F1E4FB') {
            setLongitudminima(15);
            setLongitudmaxima(15);
            setTipocampo('[0-9]{15,15}');
            setTipocampovalidacion(/[0-9]/);
            setCampo('Numéricos');
            setTipodocumento('Permiso Especial de Permanencia');
            prop(15, 'solicitante');
          } else {
            if (valorupper == 'FFE88939-06D5-486C-887C-E52D50B7F35D' || valorupper == '71F659BE-9D6B-4169-9EE2-E70BF0D65F92') {
              setLongitudminima(10);
              setLongitudmaxima(11);
              setTipocampo('[a-zA-Z0-9]{10,11}');
              setTipocampovalidacion(/[a-zA-Z0-9]/);
              setCampo('AlfaNuméricos(Numéros y letras)');
              setTipodocumento('Registro Civil de Nacimiento y Numero único de identificacíon personal');
              prop(10, 'solicitante');
            } else {
              setLongitudminima(6);
              setLongitudmaxima(10);
              setTipocampo('[a-zA-Z0-9]{6,10}');
              setCampo('AlfaNuméricos(Numéros y letras)');
              setTipocampovalidacion(/[a-zA-Z0-9]/);
              setTipodocumento('Pasaporte , Cédula de Extranjería y  Tarjeta de Extranjería ');
              prop(6, 'solicitante');
            }
          }
        }
      }
    }
  };

  useEffect(() => {
    getLista();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderFormFuneria = (_lugar: TypeLugarFuneraria) => {
    return (
      <>
        {setearCampos() && (
          <>
            <Form.Item
              className='fadeInRight'
              label='Funeraria de Bogotá D.C. y/o Solicitante'
              name='funerariaBogota'
              initialValue={validacionfuneraria ? valorfuneraria : 'PARTICULAR'}
              rules={[{ required: true }]}
            >
              <SelectComponent
                style={{ width: '90%' }}
                options={l_funerarias}
                optionPropkey='RAZON_S'
                disabled={validacionfuneraria}
                optionPropLabel='RAZON_S'
              />
            </Form.Item>
          </>
        )}
      </>
    );
  };

  return (
    <>
      <Form.Item
        label='Tipo documento'
        initialValue={obj?.tiposolicitante ?? '7c96a4d3-a0cb-484e-a01b-93bc39c2552e'}
        rules={[{ required: true }]}
        name='fiscalia'
      >
        <SelectComponent style={{ width: '90%' }} options={l_tipo_documento} onChange={cambiodocumento} optionPropkey='id' optionPropLabel='descripcion' />
      </Form.Item>

      <Form.Item label='Numero documento' initialValue={obj?.nrosolicitante} required={!sininformacion} name='ndoc'>
        <Input
          style={{ width: '90%' }}
          allowClear
          type='text'
          placeholder='Número Identificación'
          autoComplete='off'
          pattern={tipocampo}
          disabled={sininformacion}
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
                'Sección: DATOS DEL SOLICITANTE Y/O FUNERARIA \n recuerde que para el tipo de documento: ' +
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

      <Form.Item label='Nombres' initialValue={obj?.razonsocialsolicitante ?? null} rules={[{ required: true, max: 100 }]} name='namesolicitudadd'>
        <Input
          style={{ width: '90%' }}
          allowClear
          placeholder='Nombres'
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

      <Form.Item label='Apellidos' initialValue={null} rules={[{ required: true, max: 100 }]} name='lastnamesolicitudadd'>
        <Input
          style={{ width: '90%' }}
          allowClear
          placeholder='Apellidos'
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
      {(setearCampos() && obj === undefined) && (
        <>
          <Form.Item
            label='Correo familiar contratante'
            initialValue={correosol === '' ? obj?.correosolicitante : correosol}
            rules={[{ required: true, type: 'email', max: 50 }]}
            name='emailsolicitudadd'
          >
            <Input
              allowClear
              placeholder='Email Familiar'
              value={correosol === '' ? obj?.correosolicitante : correosol}
              defaultValue={correosol === '' ? obj?.correosolicitante : correosol}
              type='email'
              onKeyPress={(event) => {
                if (!/[a-zA-Z0-9ZñÑ@._-]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              autoComplete='off'
              id='emailsol'
            />
          </Form.Item>
        </>
      )}

      <div>{renderFormFuneria(lugarfuneraria)}</div>

      {(setearCampos() && obj === undefined) && (
        <>
          <Form.Item
            label='Email Funeraria y/o solicitante'
            name='emailfuneraria'
            initialValue={correofun === '' ? obj.correofuneraria : correofun}
            rules={[{ required: true, type: 'email', max: 50 }]}
          >
            <Input
              allowClear
              placeholder='Email Funeraria'
              value={correofun === '' ? obj.correofuneraria : correofun}
              defaultValue={correofun === '' ? obj.correofuneraria : correofun}
              type='email'
              onKeyPress={(event) => {
                if (!/[a-zA-Z0-9ZñÑ@._-]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              //onChange={(e) => cambioemailFUN(e.target.value)}
              autoComplete='off'
            />
          </Form.Item>
        </>
      )}
    </>
  );
};
export const KeysForm = [
  'fiscalia',
  'ndoc',
  'namesolicitudadd',
  'lastnamesolicitudadd',
  'emailsolicitudadd',
  'emailfuneraria',
  'longitudminimaSolicitante'
];
interface ISolicitudInfoProps<T> {
  obj: any;
  prop: any;
  form: any;
}
type TypeLugarFuneraria = 'Dentro de Bogotá';
