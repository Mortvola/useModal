import React, { useState, ReactElement, useCallback } from 'react';
import { Modal } from 'react-bootstrap';
import styles from './useModal.module.css';

type ShowCallback = (() => void);
type OnSave = (() => void);
type OnHide = (() => void);
type OnConfirm = (() => void);

export type UseModalType<T> = [
  (props: T) => (ReactElement | null),
  ShowCallback,
];

export interface ModalProps {
  setShow: (show: boolean) => void;
  onHide?: OnHide,
  onConfirm?: OnConfirm,
}

function useModal<T>(
  Dialog: React.FC<T & ModalProps>,
  modalProps?: Record<string, unknown>,
  onSave?: OnSave,
): UseModalType<T & { onHide?: () => void }> {
  const [showDialog, setShowDialog] = useState(false);

  const createDialog = useCallback((props: T & { onHide?: () => void }): ReactElement | null => {
    const localSetShow = (show: boolean) => {
      if (!show && showDialog && props.onHide) {
        props.onHide();
      }

      setShowDialog(show);
    };

    const handleHide = () => {
      if (props.onHide && showDialog) {
        props.onHide();
      }
      setShowDialog(false);
    };

    const handleSave = () => {
      if (onSave) {
        onSave();
      }

      setShowDialog(false);
    };

    return (
      <Modal
        show={showDialog}
        onHide={handleHide}
        scrollable
        enforceFocus={false}
        {...modalProps}
        contentClassName={styles.modalContextFix}
      >
        <Dialog {...props} setShow={localSetShow} onConfirm={handleSave} />
      </Modal>
    );
  }, [Dialog, modalProps, onSave, showDialog]);

  return [
    createDialog,
    () => setShowDialog(true),
  ];
}

export function makeUseModal<T>(Dialog: React.FC<T & ModalProps>, props?: Record<string, unknown>) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return (): UseModalType<T & { onHide?: () => void }> => useModal<T>(Dialog, props);
}

export default useModal;
