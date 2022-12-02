import React, {useState} from 'react';
import Form, {FormInstance} from 'antd/es/form';
import Upload from 'antd/es/upload';
import Button from 'antd/es/button';
import {UploadOutlined} from '@ant-design/icons';
import Input from 'antd/es/input';
import {SelectComponent} from '../../../../shared/components/inputs/select.component';
import Divider from 'antd/es/divider';

export const DocumentosSSTFormSeccion: React.FC<IDocumentosSSTProps<any>> = (props) => {

  const isTituloExtranjero = false;
  const [getIsTituloExtranjero, setIsTituloExtranjero] = useState<boolean>(isTituloExtranjero);


  const onChangeTituloExtranjero = async (value: string) => {
    // value == 'Extranjero' ? setIsTituloExtranjero(true) : setIsTituloExtranjero(false);
    if (value == 'Extranjero') {
      setIsTituloExtranjero(true);
    } else {
      setIsTituloExtranjero(false);
    }
    alert('este codigo sirve' + getIsTituloExtranjero);
  }


  const l_tipo_programa = [
    {
      id:1,
      descripcion: 'Profesional Universitario con Postgrado'
    },
    {
      id:2,
      descripcion: 'Profesional Universitario'
    },
    {
      id:3,
      descripcion: 'Tecnología en seguridad y salud en el trabajo'
    },
    {
      id:4,
      descripcion: 'Técnico profesional en seguridad y salud en el trabajo'
    }
  ]

  const l_tipo_titulo = [
    {
      id:1,
      descripcion: 'Nacional'
    },
    {
      id:2,
      descripcion: 'Extranjero'
    }
  ]

  const l_tipo_profesional = [
    {
      id:1,
      descripcion: 'Médico'
    },
    {
      id:2,
      descripcion: 'Profesional psicología'
    },
    {
      id:3,
      descripcion: 'Ingeniería'
    },
    {
      id:4,
      descripcion: 'Otros'
    }
  ]

  const onChangeTipoPrograma = async (value: string) => {
    let textoDocumentoPregrado = document.getElementById('fileTituloPregrado');
    if (value == 'Profesional Universitario con Postgrado') {
      textoDocumentoPregrado!.innerHTML = 'Esto es una prueba';
    } else if (value == 'Profesional Universitario') {

    } else if (value == 'Tecnología en seguridad y salud en el trabajo') {

    }
  }

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return(
    <>
      <div className='alert alert-danger'>
        Apreciado Ciudadano! En caso de contar con dos o mas títulos universitarios favor separarlos por coma en orden
        cronológico,
        asi mismo en el campo donde se deben adjuntar los soportes, favor subir un solo PDF con los títulos registrados
        según sea pregrado o postgrado.
      </div>
      <Divider orientation='right'> Documentos </Divider>

      <Form.Item
        label='Tipo de programa'
        name='tipoPrograma'
        rules={[{ required: true }]}
        id='tipoPrograma'
      >
        <SelectComponent options={l_tipo_programa}
                         optionPropkey='id'
                         optionPropLabel='descripcion'
                         onChange={onChangeTipoPrograma}/>
      </Form.Item>

      <Form.Item
        label='Tipo de titulo'
        name='tipoTitulo'
        rules={[{ required: true }]}
      >
        <SelectComponent options={l_tipo_titulo}
                         optionPropkey='id'
                         optionPropLabel='descripcion'
                         onChange={onChangeTituloExtranjero} />
      </Form.Item>

      <Form.Item
        label='Tipo Profesional'
        name='tipoProfesional'
        rules={[{ required: false}]}
      >
        <SelectComponent options={l_tipo_profesional} optionPropkey='id' optionPropLabel='descripcion'  />
      </Form.Item>

      <Form.Item
        label='Ingrese el título del programa (Como aparece en el diploma)'
        name='tituloPrograma'
      >
        <Input
          allowClear
          placeholder='Título del programa'
          autoComplete='off'
          type='text'
        />
      </Form.Item>

      <Form.Item
        label='Ingrese el título de postgrado (Como aparece en el diploma)'
        name='tituloProgramaPostgrado'
      >
        <Input
          allowClear
          placeholder='Título de postgrado'
          autoComplete='off'
          type='text'
        />
      </Form.Item>

      <Form.Item
        label='Documento identidad'
        name='fileDocumentoIdentidad'
        valuePropName='fileList'
        // rules={[{ required: isEdit ? false : true }]}
        getValueFromEvent={normFile}
      >
        <Upload name='fileDocumentoIdentidad' maxCount={1} beforeUpload={() => false} listType='text' accept='application/pdf'>
          <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
        </Upload>
      </Form.Item>


      <Form.Item
        label='PDF Certificado de notas o asignaturas Aprobadas'
        name='fileCertificadoNotasAsignaturas'
        valuePropName='fileList'
        // rules={[{ required: isEdit ? false : true }]}
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
        // rules={[{ required: isEdit ? false : true }]}
        getValueFromEvent={normFile}
      >
        <Upload name='fileSoporteEducacionSuperior' maxCount={1} beforeUpload={() => false} listType='text' accept='application/pdf'>
          <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        label='PDF Título Pregrado'
        name='fileTituloPregrado'
        valuePropName='fileList'
        // rules={[{ required: isEdit ? false : true }]}
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
        // rules={[{ required: isEdit ? false : true }]}
        getValueFromEvent={normFile}
      >
        <Upload name='fileTituloPostgrado' maxCount={1} beforeUpload={() => false} listType='text' accept='application/pdf'>
          <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
        </Upload>
      </Form.Item>

      {getIsTituloExtranjero && (
        <>
        <Form.Item
          label='Convalidación'
          name='fileConvalidacion'
          valuePropName='fileList'
          // rules={[{ required: isEdit ? false : true }]}
          getValueFromEvent={normFile}
        >
          <Upload name='fileConvalidacion' maxCount={1} beforeUpload={() => false} listType='text' accept='application/pdf'>
            <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
          </Upload>
        </Form.Item>
        </>
      )}
    </>
  );
}


interface IDocumentosSSTProps<T> {
  form: FormInstance<T>;
  required: boolean;
  obj: any;
}
