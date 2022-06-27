import successIcon from '../images/VInCircle.png';
import failedIcon from '../images/XInCircle.png';

const InfoToolTip = ({ onClose, isOpen, isRegisterSuccess }) => {
  return (
    <div className={`popup popup_type_info ${isOpen ? 'popup_visible' : ''}`}>
      <div className={'popup__box popup__box_type_info'}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="popup__close-btn"
        ></button>
        <img
          src={isRegisterSuccess ? successIcon : failedIcon}
          alt={isRegisterSuccess ? 'Fail' : 'Success'}
          className="popup__icon"
        ></img>
        <p className={`popup__title popup__title_type_info`}>
          {isRegisterSuccess
            ? 'Success! You have now been registered.'
            : 'Oops, something went wrong! Please try again.'}
        </p>
      </div>
    </div>
  );
};

export default InfoToolTip;

