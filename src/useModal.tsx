import React, { useState, ReactElement, useCallback } from 'react';
import { Modal } from 'react-bootstrap';

type ShowCallback = (() => void);
type OnSave = (() => void);
type OnHide = (() => void);
type OnConfirm = (() => void);

export type UseModalType<T> = [
  (props: T) => (ReactElement | null),
  ShowCallback,
];

type SizeType = 'sm' | 'lg' | 'xl';

export interface ModalProps {
  setShow: (show: boolean) => void;
  onHide?: OnHide,
  onConfirm?: OnConfirm,
}

function useModal<T>(
  Dialog: React.FC<T & ModalProps>,
  size?: SizeType,
  onSave?: OnSave,
): UseModalType<T & { onHide?: () => void }> {
  const [showDialog, setShowDialog] = useState(false);

  const createDialog = useCallback((props: T & { onHide?: () => void }): ReactElement | null => {
    const localSetShow = (show: boolean) => {
      if (!show && showDialog && props.onHide) {
        props.onHide();
      }

      setShowDialog(show);
    }

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
        size={size}
        scrollable
        enforceFocus={false}
        contentClassName="modal-content-fix"
      >
        <Dialog {...props} setShow={localSetShow} onConfirm={handleSave} />
      </Modal>
    );
  }, [Dialog, onSave, showDialog, size]);

  return [
    createDialog,
    () => setShowDialog(true),
  ];
}

export function makeUseModal<T>(Dialog: React.FC<T & ModalProps>, size?: SizeType) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return (): UseModalType<T & { onHide?: () => void }> => useModal<T>(Dialog, size);
}

export default useModal;
