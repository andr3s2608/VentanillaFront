import { useEffect, useState } from 'react';

export function useModalSetting<T>(
  setting?: IInitSetting<T | undefined>
): {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  dataRecord: T | undefined;
  setDataRecord: React.Dispatch<React.SetStateAction<T | undefined>>;
} {
  const [visible, setVisible] = useState<boolean>(setting?.visible || false);
  const [dataRecord, setDataRecord] = useState<T | undefined>(setting?.dataRecord);

  useEffect(() => {
    if (!visible) {
      setDataRecord(setting?.dataRecord);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return {
    visible,
    setVisible,
    dataRecord,
    setDataRecord
  };
}

interface IInitSetting<T> {
  visible?: boolean;
  dataRecord?: T;
}
