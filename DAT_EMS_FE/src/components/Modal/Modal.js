import React, { useEffect } from 'react';
import { FaTriangleExclamation } from 'react-icons/fa6';
import { LuCheck, LuLock, LuX } from 'react-icons/lu';
import { useIntl } from 'react-intl';
import './Modal.scss';

export default function Modal(props) {
  const intl = useIntl();
  const {
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'medium',
    className = '',
    bodyClassName = '',
    danger = false,
    closeOnOverlayClick = true,
    showCloseButton = true,
    closeAriaLabel = intl.formatMessage({ id: 'modal_close_aria' }),
    showDangerIcon = danger,
  } = props;

  const modalSizeClass = {
    small: 'DAT_Modal_Content_Small',
    medium: 'DAT_Modal_Content_Medium',
    large: 'DAT_Modal_Content_Large',
    xlarge: 'DAT_Modal_Content_XLarge',
  }[size] || 'DAT_Modal_Content_Medium';

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="DAT_Modal DAT_Modal_Overlay" onClick={handleOverlayClick}>
      <div
        className={`DAT_Modal_Content ${modalSizeClass} ${danger ? 'DAT_Modal_Content_Danger' : ''} ${className}`.trim()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="DAT_Modal_Header">
          <h3 className="DAT_Modal_Title">
            {showDangerIcon && (
              <span className="DAT_Modal_WarningIcon">
                <FaTriangleExclamation />
              </span>
            )}
            {title}
          </h3>
          {showCloseButton && (
            <button className="DAT_Modal_Close" onClick={onClose} aria-label={closeAriaLabel}>
              <LuX />
            </button>
          )}
        </div>
        <div className={`DAT_Modal_Body ${bodyClassName}`.trim()}>{children}</div>
        {footer && <div className="DAT_Modal_Footer">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmModal(props) {
  const intl = useIntl();
  const {
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    changes,
    requirePassword,
    requireReason,
    danger,
    confirmText = intl.formatMessage({ id: 'modal_confirm' }),
    cancelText = intl.formatMessage({ id: 'modal_cancel' }),
    loading,
    loadingText = intl.formatMessage({ id: 'modal_loading' }),
    defaultTitle = intl.formatMessage({ id: 'modal_confirm_action_title' }),
    parameterLabel = intl.formatMessage({ id: 'modal_parameter' }),
    oldValueLabel = intl.formatMessage({ id: 'modal_old_value' }),
    newValueLabel = intl.formatMessage({ id: 'modal_new_value' }),
    reasonLabel = intl.formatMessage({ id: 'modal_reason' }),
    reasonPlaceholder = intl.formatMessage({ id: 'modal_reason_placeholder' }),
    passwordLabel = intl.formatMessage({ id: 'modal_password_confirm_label' }),
    passwordPlaceholder = intl.formatMessage({ id: 'modal_password_placeholder' }),
    requiredPasswordMessage = intl.formatMessage({ id: 'modal_password_required' }),
    requiredReasonMessage = intl.formatMessage({ id: 'modal_reason_required' }),
    modalProps,
  } = props;

  const [password, setPassword] = React.useState('');
  const [reason, setReason] = React.useState('');
  const [error, setError] = React.useState('');

  const handleConfirm = () => {
    if (requirePassword && !password) {
      setError(requiredPasswordMessage);
      return;
    }

    if (requireReason && !reason.trim()) {
      setError(requiredReasonMessage);
      return;
    }

    setError('');
    onConfirm({ password, reason });
    setPassword('');
    setReason('');
  };

  const handleClose = () => {
    setPassword('');
    setReason('');
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title || defaultTitle}
      danger={danger}
      {...modalProps}
      footer={
        <>
          <button className="DAT_Modal_Button_Secondary" onClick={handleClose}>
            {cancelText}
          </button>
          <button
            className={danger ? 'DAT_Modal_Button_Danger' : 'DAT_Modal_Button_Primary'}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? loadingText : <><LuCheck /> {confirmText}</>}
          </button>
        </>
      }
    >
      {message && <p className="DAT_Modal_Message">{message}</p>}
      {changes && changes.length > 0 && (
        <div className="DAT_Modal_ChangesTable">
          <table className="DAT_Modal_ChangesTable_Table">
            <thead>
              <tr>
                <th>{parameterLabel}</th>
                <th>{oldValueLabel}</th>
                <th>{newValueLabel}</th>
              </tr>
            </thead>
            <tbody>
              {changes.map((c, i) => (
                <tr key={i}>
                  <td>{c.label}</td>
                  <td className="DAT_Modal_Text_Secondary">{c.oldValue}</td>
                  <td className="DAT_Modal_Text_Primary DAT_Modal_Font_Semibold">{c.newValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {requireReason && (
        <div className="DAT_Modal_Form_Group DAT_Modal_Spacing_TopBase">
          <label className="DAT_Modal_Form_Label">{reasonLabel}</label>
          <input
            className="DAT_Modal_Form_Input"
            placeholder={reasonPlaceholder}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
      )}
      {requirePassword && (
        <div className="DAT_Modal_Form_Group DAT_Modal_Spacing_TopBase">
          <label className="DAT_Modal_Form_Label DAT_Modal_Form_Label_WithIcon">
            <LuLock />
            {passwordLabel}
          </label>
          <input
            className="DAT_Modal_Form_Input"
            type="password"
            placeholder={passwordPlaceholder}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      )}
      {error && <p className="DAT_Modal_Form_Error DAT_Modal_Spacing_TopSm">{error}</p>}
    </Modal>
  );
}
