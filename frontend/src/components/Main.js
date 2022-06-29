import React from 'react';
import Card from './Card';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Main({ onEditProfileClick, onAddPlaceClick, onEditAvatarClick, onCardClick, cards, onCardLike, onCardDelete }) {
  const currentUser = React.useContext(CurrentUserContext);
  return (
    <main>
      <section className="profile">
        <div className="profile__img-container">
          <div className="profile__img" style={{ backgroundImage: `url(${currentUser.avatar})` }} />
          <button onClick={onEditAvatarClick} className="profile__img-button"></button>
        </div>
        <div className="profile__info">
          <div className="profile__header">
            <h1 className="profile__name">{currentUser.name}</h1>
            <button onClick={onEditProfileClick} type="button" aria-label="Edit Profile" className="profile__edit-btn"></button>
          </div>
          <p className="profile__about">{currentUser.about}</p>
        </div>
        <button onClick={onAddPlaceClick} type="button" aria-label="Add Image" className="profile__add-btn"></button>
      </section>
      <section className="cards">
        <ul className="cards__list">
          {cards.map((card) => (
            <Card key={card._id} card={card} onCardClick={onCardClick} onDeleteButtonClick={onCardDelete} onLikeButtonClick={onCardLike} />
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Main;

