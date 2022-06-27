import React, { useState, useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import api from '../utils/api';
import * as auth from '../utils/auth';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import InfoToolTip from './InfoToolTip';

function App() {
  const history = useHistory();

  const [isEditAvatarOpen, setIsEditAvatarOpen] = useState(false);
  const [isAddPlaceOpen, setIsAddPlaceOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [values, setValues] = useState({
    email: '',
  });
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check token available on client and validity
    const token = localStorage.getItem('token');
    if (token) {
      auth
        .checkToken(token)
        .then((res) => {
          setValues(res.data.email);
          setIsLoggedIn(true);
          history.push('/');
        })
        .catch((err) => {
          console.log(err);
          setIsLoggedIn(false);
        });
    }
  }, []);

  useEffect(() => {
    api
      .getUserData()
      .then((userData) => {
        setCurrentUser(userData);
      })
      .catch((err) => console.log(`Error: ${err}`));
  }, []);

  useEffect(() => {
    api
      .getInitialCards()
      .then((cards) => {
        setCards(cards);
      })
      .catch((err) => console.log(`Error: ${err}`));
  }, []);

  const closeAllPopups = () => {
    setIsEditAvatarOpen(false);
    setIsEditProfileOpen(false);
    setIsAddPlaceOpen(false);
    setIsConfirmationOpen(false);
    setIsInfoToolTipOpen(false);
    setSelectedCard(null);
  };

  useEffect(() => {
    const closeByEscape = (e) => {
      if (e.key === 'Escape') {
        closeAllPopups();
      }
    };

    document.addEventListener('keydown', closeByEscape);

    return () => document.removeEventListener('keydown', closeByEscape);
  }, []);

  function handleCardDelete(card) {
    api
      .removeUserCard(card._id)
      .then(() => {
        const newCards = cards.filter(
          (currentCard) => currentCard._id !== card._id
        );
        setCards(newCards);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((user) => user._id === currentUser._id);

    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) =>
        setCards((state) =>
          state.map((currentCard) =>
            currentCard._id === card._id ? newCard : currentCard
          )
        )
      )
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  }

  const handleUpdateUser = (data) => {
    api
      .setUserInfo(data)
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        closeAllPopups();
      })
      .catch((err) => console.log(`Error: ${err}`));
  };

  const handleUpdateAvatar = (avatar) => {
    api
      .setUserAvatar(avatar)
      .then((updatedAvatar) => {
        setCurrentUser(updatedAvatar);
        closeAllPopups();
      })
      .catch((err) => console.log(`Error: ${err}`));
  };

  const handleAddCard = (card) => {
    api
      .addNewCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(`Error: ${err}`));
  };

  const handleEditAvatarClick = () => {
    setIsEditAvatarOpen(true);
  };

  const handleEditProfileClick = () => {
    setIsEditProfileOpen(true);
  };

  const handleAddPlaceClick = () => {
    setIsAddPlaceOpen(true);
  };

  const handleConfirmationClick = () => {
    setIsConfirmationOpen(true);
  };

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  const handleRegister = ({ values }) => {
    auth
      .register({ values })
      .then((res) => {
        setIsRegistered(true);
        history.push('/signin');
      })
      .catch((err) => {
        setIsRegistered(false);
        console.log(err);
      })
      .finally(() => setIsInfoToolTipOpen(true));
  };

  const handleLoginClick = ({ values }) => {
    auth
      .authorize({ values })
      .then((data) => {
        if (data.token) {
          setIsLoggedIn(true);
          setValues(values.email);
          localStorage.setItem('token', data.token);
          history.push('/');
        }
      })
      .catch((err) => {
        console.log(err);
        return setIsInfoToolTipOpen(true);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setValues('');
    setIsLoggedIn(false);
    history.push('/signin');
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="wrapper">
        <InfoToolTip
          onClose={closeAllPopups}
          isRegisterSuccess={isRegistered}
          isOpen={isInfoToolTipOpen}
        />
        <Header
          userData={values}
          isLoggedIn={isLoggedIn}
          onClick={handleLogout}
        />
        <Switch>
          <Route path="/signin">
            <Login onSubmit={handleLoginClick} />
          </Route>
          <Route path="/signup">
            <Register onSubmit={handleRegister} />
          </Route>
          <ProtectedRoute exact path="/" isLoggedIn={isLoggedIn}>
            <Main
              onEditProfileClick={handleEditProfileClick}
              onAddPlaceClick={handleAddPlaceClick}
              onEditAvatarClick={handleEditAvatarClick}
              onCardClick={handleCardClick}
              onDeleteButtonClick={handleConfirmationClick}
              cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
            />
            <Footer />
            <EditProfilePopup
              onUpdateUser={handleUpdateUser}
              onClose={closeAllPopups}
              isOpen={isEditProfileOpen}
            ></EditProfilePopup>
            <AddPlacePopup
              onAddPlaceSubmit={handleAddCard}
              onClose={closeAllPopups}
              isOpen={isAddPlaceOpen}
            ></AddPlacePopup>
            <EditAvatarPopup
              onUpdateAvatar={handleUpdateAvatar}
              onClose={closeAllPopups}
              isOpen={isEditAvatarOpen}
            ></EditAvatarPopup>
            <PopupWithForm
              isOpen={isConfirmationOpen}
              onClose={closeAllPopups}
              name="confirm"
              title="Are you sure?"
              buttonText="Yes"
            ></PopupWithForm>
            <ImagePopup onClose={closeAllPopups} card={selectedCard} />
          </ProtectedRoute>
        </Switch>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;

