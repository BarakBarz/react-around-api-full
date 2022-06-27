import PopupWithForm from './PopupWithForm';
import { useEffect, useState } from 'react';

export default function AddPlacePopup({ onClose, isOpen, onAddPlaceSubmit }) {
  const [input, setInput] = useState({
    cardTitle: '',
    imageLink: '',
  });

  useEffect(() => {
    handleReset();
  }, [isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    onAddPlaceSubmit({
      name: input.cardTitle,
      link: input.imageLink,
    });
  }

  function handleReset() {
    setInput({
      name: '',
      link: '',
    });
  }

  function handleChange(e) {
    const { value, name } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
  }

  return (
    <PopupWithForm
      onClose={onClose}
      isOpen={isOpen}
      name="add-card"
      title="New place"
      buttonText="Create"
      onSubmit={handleSubmit}
    >
      <input
        value={input.cardTitle || ''}
        onChange={handleChange}
        type="text"
        id="input-card-title"
        name="cardTitle"
        placeholder="Title"
        className="popup__input popup__input_type_add-card"
        minLength="1"
        maxLength="30"
        required
      />
      <span id="input-card-title-error" className="popup__error"></span>
      <input
        value={input.imageLink || ''}
        onChange={handleChange}
        type="url"
        id="input-image-link"
        name="imageLink"
        placeholder="Image Link"
        className="popup__input popup__input_type_add-card"
        required
      />
      <span id="input-image-link-error" className="popup__error"></span>
    </PopupWithForm>
  );
}

