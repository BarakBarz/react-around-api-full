export default function PopupWithForm({
  children,
  name,
  title,
  buttonText,
  isOpen,
  onClose,
  onSubmit,
}) {
  return (
    <div
      className={`popup popup_type_${name} ${isOpen ? "popup_visible" : ""}`}
    >
      <div className={`popup__box popup__box_type_${name}`}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="popup__close-btn"
        ></button>
        <h3 className={`popup__title popup__title_type_${name}`}>{title}</h3>
        <form className="popup__form" id={`${name}-form`} onSubmit={onSubmit}>
          {children}
          <button
            type="submit"
            aria-label="Submit"
            className={`popup__submit-btn popup__submit-btn_type_${name}`}
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}
