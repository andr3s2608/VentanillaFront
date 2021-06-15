import { useState } from 'react';

// Antd
import { FormInstance } from 'antd/es/form';

export function useStepperForm<T>(form: FormInstance<T>, initCurrent: number = 0) {
  const [current, setCurrent] = useState<number>(initCurrent);
  const [status, setStatus] = useState<'error' | 'wait' | 'process' | 'finish' | undefined>();

  /**
   * Para pasar al siguiente step.
   * @param fields [Opcional] Campos a validar antes de pasar al siguiente step.
   */
  const onNextStep = (fields?: string[]) => {
    if (!!fields) {
      form
        .validateFields(fields)
        .then(() => {
          setStatus(undefined);
          setCurrent(current + 1);
        })
        .catch(() => setStatus('error'));
    } else {
      setStatus(undefined);
      setCurrent(current + 1);
    }
  };

  /**
   * Volver al step anterior.
   */
  const onPrevStep = () => setCurrent(current - 1);

  return { current, status, setCurrent, setStatus, onNextStep, onPrevStep };
}
