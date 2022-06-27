import React from "react";

class Api extends React.Component {
  constructor(props) {
    super(props);
    this._url = props.baseUrl;
    this._token = props.token;
  }

  getInitialCards() {
    return fetch(`${this._url}/cards`, {
      headers: { authorization: this._token },
    }).then((res) => this._getResponseData(res));
  }

  getUserData() {
    return fetch(`${this._url}/users/me`, {
      headers: { authorization: this._token },
    }).then((res) => this._getResponseData(res));
  }

  setUserInfo(userDetails) {
    return fetch(`${this._url}/users/me`, {
      method: "PATCH",
      headers: {
        authorization: this._token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    }).then((res) => this._getResponseData(res));
  }

  addNewCard(card) {
    return fetch(`${this._url}/cards`, {
      method: "POST",
      headers: {
        authorization: this._token,
        "content-type": "application/json",
      },
      body: JSON.stringify(card),
    }).then((res) => this._getResponseData(res));
  }

  removeUserCard = (cardId) => {
    return fetch(`${this._url}/cards/${cardId}`, {
      method: "DELETE",
      headers: {
        authorization: this._token,
        "content-type": "application/json",
      },
    }).then((res) => this._getResponseData(res));
  };

  changeLikeCardStatus(cardId, isNotLiked) {
    if (isNotLiked) {
      return this.addLike(cardId);
    } else {
      return this.removeLike(cardId);
    }
  }

  addLike = (cardId) => {
    return fetch(`${this._url}/cards/likes/${cardId}`, {
      method: "PUT",
      headers: {
        authorization: this._token,
        "content-type": "application/json",
      },
    }).then((res) => this._getResponseData(res));
  };

  removeLike = (cardId) => {
    return fetch(`${this._url}/cards/likes/${cardId}`, {
      method: "DELETE",
      headers: {
        authorization: this._token,
        "content-type": "application/json",
      },
    }).then((res) => this._getResponseData(res));
  };

  setUserAvatar = (avatar) => {
    return fetch(`${this._url}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        authorization: this._token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(avatar),
    }).then((res) => this._getResponseData(res));
  };

  _getResponseData(res) {
    if (!res.ok) {
      return Promise.reject(`Error: ${res.status}`);
    }
    return res.json();
  }
}

const api = new Api({
  baseUrl: "https://around.nomoreparties.co/v1/group-12",
  token: "c785e696-84a9-4aca-b3d2-750b2694b444",
});

export default api;
