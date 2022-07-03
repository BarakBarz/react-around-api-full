import React from 'react';

class Api extends React.Component {
  constructor(props) {
    super(props);
    this._url = props.baseUrl;
  }

  getUserData(token) {
    return fetch(`${this._url}/users/me`, {
      headers: { authorization: `Bearer ${token}` },
    }).then((res) => this._getResponseData(res));
  }

  setUserInfo(name, about, token) {
    return fetch(`${this._url}/users/me`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        about: about,
      }),
    }).then((res) => this._getResponseData(res));
  }

  getInitialCards(token) {
    return fetch(`${this._url}/cards`, {
      headers: { authorization: `Bearer ${token}` },
    }).then((res) => this._getResponseData(res));
  }

  addNewCard(card, token) {
    return fetch(`${this._url}/cards`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(card),
    }).then((res) => this._getResponseData(res));
  }

  removeUserCard = (cardId, token) => {
    return fetch(`${this._url}/cards/${cardId}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
    }).then((res) => this._getResponseData(res));
  };

  changeLikeCardStatus(cardId, isNotLiked, token) {
    if (isNotLiked) {
      return this.addLike(cardId, token);
    } else {
      return this.removeLike(cardId, token);
    }
  }

  addLike = (cardId, token) => {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
    }).then((res) => this._getResponseData(res));
  };

  removeLike = (cardId, token) => {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
    }).then((res) => this._getResponseData(res));
  };

  setUserAvatar = (avatar, token) => {
    return fetch(`${this._url}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(avatar),
    }).then((res) => this._getResponseData(res));
  };

  _getResponseData(res) {
    if (!res.ok) {
      return Promise.reject(new Error('something Wrong'));
    }
    return res.json();
  }
}

const api = new Api({
  baseUrl: 'https://aroundbarak.students.nomoreparties.sbs',
});

export default api;

