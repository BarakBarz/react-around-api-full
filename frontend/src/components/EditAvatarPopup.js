import PopupWithForm from "./PopupWithForm";
import { useRef, useEffect } from "react";

export default function EditAvatarPopup({ onClose, isOpen, onUpdateAvatar }) {
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.value = "";
  }, [isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateAvatar({
      avatar: inputRef.current.value,
    });
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      name="avatar"
      title="Change profile picture"
      buttonText="Save"
    >
      <input
        ref={inputRef}
        type="url"
        id="input-avatar-link"
        name="avatar"
        placeholder="Avatar Link"
        className="popup__input popup__input_type_edit-avatar"
        required
      />
      <span id="input-avatar-link-error" className="popup__error"></span>
    </PopupWithForm>
  );
}
