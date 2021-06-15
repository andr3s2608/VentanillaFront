import React, { useEffect, useState } from 'react';

// Antd
import Table, { ColumnsType, TableProps } from 'antd/es/table';

// Hooks
import { useSorter } from 'app/shared/hooks/sorter.hook';
import { useFormatDate } from 'app/shared/hooks/format-date.hook';
import { useFormatNumber } from 'app/shared/hooks/format-number.hook';
import { useFormatBoolean } from 'app/shared/hooks/format-boolean.hook';

// Componentes
import { SearchInputComponent } from 'app/shared/components/inputs/search-input.component';

export const TableComponent: React.FC<ITableProps> = (props) => {
  const { showSearch = true, columns, dataSource, className, ...tableProps } = props;

  const [_dataSource, setDataSource] = useState<any>(dataSource);
  const [_columns, setColumns] = useState<any>(columns);

  const { sorter } = useSorter();

  useEffect(() => {
    setDataSource(dataSource);
  }, [dataSource]);

  useEffect(() => {
    setColumns(columns);
  }, [columns]);

  const sorterColumns = (__columns?: ColumnsType<any>) =>
    __columns?.map((i: any) => {
      if (!!i.children) {
        const children: any = sorterColumns(i.children);
        return { ...i, children };
      } else {
        return { sorter: sorter(i.dataIndex), ellipsis: true, width: 200, ...i };
      }
    });

  return (
    <>
      {showSearch && (
        <div className='d-sm-flex justify-content-end mt-3'>
          <SearchInputComponent dataSourceSearch={dataSource} setDataSourceResult={setDataSource} style={{ maxWidth: 250 }} />
        </div>
      )}
      <Table
        className={'mt-3 ' + className}
        columns={sorterColumns(_columns)}
        dataSource={_dataSource}
        pagination={{ pageSize: 50, responsive: true }}
        scroll={{ y: 500 }}
        size='small'
        bordered
        {...tableProps}
      />
    </>
  );
};

export { useSorter, useFormatDate, useFormatNumber, useFormatBoolean };

interface ITableProps extends TableProps<any> {
  showSearch?: boolean;
}
