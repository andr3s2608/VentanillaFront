import Helmet from 'react-helmet';

// Antd
import Button from 'antd/es/button';
import { ArrowRightOutlined } from '@ant-design/icons';

// Utils
import { projectInfo } from 'app/shared/utils/constants.util';

// Components
import { FooterComponent } from 'app/shared/components/layout/footer.component';

// Imágenes
import Logo from '../../../assets/images/brand/logo_alcaldia.png';

export const LoginPage = ({ login }: { login: () => void }) => {
  return (
    <div className='app-container-login container-fluid fadeIn min-vw-100 min-vh-100 py-5'>
      <Helmet>
        <title>{projectInfo.name}</title>
        <meta name='description' content={projectInfo.description} />
      </Helmet>

      <img className='d-block mb-5 mx-auto' src={Logo} width='200' alt='Logo Secretaria Distrital de Salud' />
      <h2 className='m-0'>¡Bienvenido a {projectInfo.name}!</h2>
      <h4 className='font-weight-light' style={{ opacity: 0.85 }}>
        {projectInfo.fullname}
      </h4>
      <p style={{ maxWidth: 1000 }}>{projectInfo.description}</p>
      <Button
        className='py-4 px-sm-5 my-3 text-left d-flex justify-content-between align-items-center'
        type='primary'
        onClick={login}
        style={{ height: 'auto', maxWidth: 400, whiteSpace: 'normal' }}
      >
        <span>
          <span className='h4 d-block font-weight-bold'>Ingreso a cuenta de usuario</span>
          Al hacer clic aquí te conectaremos con nuestras plataformas disponibles para el ingreso.
        </span>
        <ArrowRightOutlined style={{ fontSize: 25 }} />
      </Button>
      <FooterComponent className='bg-transparent text-center px-0' style={{ maxWidth: 900 }} />
    </div>
  );
};
