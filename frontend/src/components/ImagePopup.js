function ImagePopup({ onClose, card }) {
  return (
    <div className={`popup popup_type_image ${card ? "popup_visible" : ""}`}>
      <div className="popup__content">
        {card ? (
          <button
            onClick={onClose}
            type="button"
            aria-label="Close"
            className="popup__close-btn popup__close-btn_type_image"
          />
        ) : null}
        <img
          src={card ? card.link : "#"}
          alt={card ? card.name : ""}
          className="popup__image"
        />
        <h4 className="popup__title popup__title_type_image">
          {card ? card.name : ""}
        </h4>
      </div>
    </div>
  );
}

export default ImagePopup;
