import React, { useRef, useState } from 'react';
import Draggable, { DraggableData } from 'react-draggable';

// Antd
import Modal, { ModalProps } from 'antd/es/modal';

// Utilidades
import { confirmMessage } from 'app/services/settings/message.service';

export const ModalComponent: React.FC<ModalProps> = (props) => {
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });

  const draggleRef = useRef<any>(null);

  const { title, children, onCancel, zIndex, ...modalProps } = props;

  const onCancelModal = () =>
    confirmMessage({
      title: '¿Está seguro de cerrar la ventana?',
      content: 'Esta acción no guardará ningún cambio realizado.',
      okText: 'Cerrar ventana',
      okButtonProps: { danger: true },
      onOk: onCancel
    });

  const onStart = (uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const targetRect = draggleRef?.current?.getBoundingClientRect();
    setBounds({
      left: -targetRect?.left + uiData?.x,
      right: clientWidth - (targetRect?.right - uiData?.x),
      top: -targetRect?.top + uiData?.y,
      bottom: clientHeight - (targetRect?.bottom - uiData?.y)
    });
  };

  return (
    <Modal
      title={
        <div
          style={{
            width: '100%',
            cursor: 'move'
          }}
          onMouseOver={() => {
            if (disabled) {
              setDisabled(false);
            }
          }}
          onMouseOut={() => {
            setDisabled(true);
          }}
        >
          {title}
        </div>
      }
      keyboard={false}
      maskClosable={false}
      onCancel={onCancelModal}
      zIndex={1004}
      destroyOnClose={true}
      {...modalProps}
      modalRender={(modal) => (
        <Draggable disabled={disabled} bounds={bounds} onStart={(_, uiData) => onStart(uiData)}>
          <div ref={draggleRef}>{modal}</div>
        </Draggable>
      )}
    >
      {children}
    </Modal>
  );
};

export interface IModalProps<T> {
  dataRecord?: T;
  visible: boolean;
  onCancel: () => void;
  onOk: (e?: any) => void;
}
