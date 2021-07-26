import Tabs from 'antd/es/tabs';
import { AppState } from 'app/redux/app.reducers';
import { IItemDataSource } from 'app/redux/Grid/grid.types';
import { PageHeaderComponent } from 'app/shared/components/page-header.component';
import { Gridview } from 'app/shared/components/table';
import { useSelector } from 'react-redux';

const { TabPane } = Tabs;

const GridTipoLicencia: React.FC<any> = (props: any) => {

  let dataSource = useSelector<AppState, IItemDataSource[]>((state) => state.grid.dataSource ?? returStorageLocal());
  if (dataSource.length === 0) {
    dataSource = returStorageLocal();
    console.log(dataSource)
  }
  return (
    <div className='fadeInTop container-fluid'>
      <PageHeaderComponent title='Maestro detalle' subTitle='Consulte el trámite de los certificados.' />

      <Tabs>
        <TabPane tab='' key='1'>
          <div className='card card-body py-5 mb-4 fadeInTop'>
            Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table
            craft beer twee. Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl
            cillum PBR. Homo nostrud organic, assumenda labore aesthetic magna delectus mollit. Keytar helvetica VHS salvia yr,
            vero magna velit sapiente labore stumptown. Vegan fanny pack odio cillum wes anderson 8-bit, sustainable jean shorts
            beard ut DIY ethical culpa terry richardson biodiesel. Art party scenester stumptown, tumblr butcher vero sint qui
            sapiente accusamus tattooed echo park.
          </div>
          <Gridview data={dataSource} />
        </TabPane>
      </Tabs>
    </div>
  );
};

const returStorageLocal = (): IItemDataSource[] => {
  const storage: string = localStorage.getItem('grid') ?? '';
  if (storage !== '') {
    const data: IItemDataSource[] = JSON.parse(storage);
    return data;
  }
  return [];
}

export default GridTipoLicencia;
