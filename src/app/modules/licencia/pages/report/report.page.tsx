import { PageHeaderComponent } from 'app/shared/components/page-header.component';

const ReportPage = () => {
  return (
    <div className='fadeInTop px-4 my-5'>
      <div className='container'>
        <PageHeaderComponent title='Reporte Rayos x' subTitle='Tablero de control reporte rayox x.' />
      </div>
      <iframe
        className='w-100 vh-100 border-0'
        title='Tablero de control de vacunados en el exterior'
        src='https://app.powerbi.com/view?r=eyJrIjoiZWE4M2ZiODYtMzJiYS00ZDc5LWI4NzItMWU4NGE5ZDg3MzM5IiwidCI6IjRhYjExODNlLTc1ZDYtNGI4Ny1iNGI1LWJmY2I5NjhjMWQ1NyIsImMiOjR9'
        allowFullScreen={true}
      />
    </div>
  );
};

export default ReportPage;
