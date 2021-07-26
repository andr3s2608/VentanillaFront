import Table from 'antd/es/table';
import { structureColumns } from './model';

interface IDataSource {
  data: Array<any>;
}

export const Gridview = (props: IDataSource) => {
  const { data } = props;

  return (
    <div className='card card-body py-5 mb-4 fadeInTop'>
      <div className='d-lg-flex align-items-start'>
        <Table dataSource={data} columns={structureColumns} />
      </div>
    </div>
  );
};
