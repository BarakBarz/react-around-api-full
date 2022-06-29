import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card({ onCardClick, card, onDeleteButtonClick, onLikeButtonClick }) {
  function handleCardClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onLikeButtonClick(card);
  }

  function handleDeleteClick() {
    onDeleteButtonClick(card);
  }

  const currentUser = React.useContext(CurrentUserContext);

  const isOwn = card.owner === currentUser._id;
  const cardDeleteButtonClassName = `card__delete-btn ${!isOwn ? 'card__delete-btn' : 'card__delete-btn_hidden'}`;

  const isLiked = card.likes.some((id) => id === currentUser._id);

  const cardLikeButtonClassName = isLiked ? 'card__like-btn card__like-btn_active' : 'card__like-btn';

  return (
    <li className="card">
      <button onClick={handleDeleteClick} alt="Delete button" className={cardDeleteButtonClassName}></button>
      <img type="image" src={card.link} alt={card.name} className="card__img" onClick={handleCardClick} />
      <div className="card__info">
        <h2 className="card__title">{card.name}</h2>
        <div className="card__like-container">
          <button type="button" aria-label="Like" onClick={handleLikeClick} className={cardLikeButtonClassName}></button>
          <span className="card__like-counter">{card.likes.length}</span>
        </div>
      </div>
    </li>
  );
}

export default Card;

