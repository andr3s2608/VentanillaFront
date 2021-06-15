import React from 'react';

// Antd
import Input, { SearchProps } from 'antd/es/input';

export const SearchInputComponent: React.FC<ISearchProps> = (props) => {
  const { dataSourceSearch, setDataSourceResult, ...searchProps } = props;

  const searchItem = (obj: any, query: string): boolean | undefined => {
    for (const key in obj) {
      const value = obj[key];

      if (typeof value === 'object') {
        searchItem(value, query);
      }

      if (!!`${value}`.toLowerCase().match(query.toLowerCase())) {
        return true;
      }
    }

    return false;
  };

  const search = (query: string) => {
    const newDataSource = dataSourceSearch?.filter((i: any) => searchItem(i, query));
    setDataSourceResult(newDataSource || dataSourceSearch);
  };

  return <Input.Search placeholder='Presione ENTER para buscar...' enterButton onSearch={search} {...searchProps} />;
};

interface ISearchProps extends SearchProps {
  dataSourceSearch: any;
  setDataSourceResult: (...arg: any) => void;
}
