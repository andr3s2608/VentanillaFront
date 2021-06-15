import moment from 'moment';

export const useSorter = () => {
  const sorter = (property: string) => (a: any, b: any) => {
    switch (typeof a[property]) {
      case 'string':
        return ('' + a[property]).localeCompare(b[property]);

      case 'object':
        const isDate = moment(a[property]).isValid();
        return isDate ? moment(a[property]).unix() - moment(b[property]).unix() : ('' + a[property]).localeCompare(b[property]);

      default:
        return a[property] - b[property];
    }
  };

  return { sorter };
};
