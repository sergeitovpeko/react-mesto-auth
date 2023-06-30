class Api {
  constructor(params) {
    this.url = params.url
    this.headers = params.headers
  }

  getResponse(res) {
    if (res.ok) {
      return res.json()
    } else {
      return Promise.reject(`Ошибка: ${res.status}`)
    }
  }

  getUserInfo() {
    return fetch(`${this.url}/users/me`, {
      method: "GET",
      headers: this.headers,
    }).then(this.getResponse)
  }

  editUserInfo(item) {
    return fetch(`${this.url}/users/me`, {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify({
        name: item.name,
        about: item.about,
      }),
    }).then(this.getResponse)
  }

  editUserPhoto(item) {
    return fetch(`${this.url}/users/me/avatar`, {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify({
        avatar: item.avatar,
      }),
    }).then(this.getResponse)
  }

  getInitialCards() {
    return fetch(`${this.url}/cards`, {
      method: "GET",
      headers: this.headers,
    }).then(this.getResponse)
  }

  addNewCard(item) {
    return fetch(`${this.url}/cards`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        name: item.name,
        link: item.link,
      }),
    }).then(this.getResponse)
  }

  deleteCard(cardId) {
    return fetch(`${this.url}/cards/${cardId}`, {
      method: "DELETE",
      headers: this.headers,
    }).then(this.getResponse)
  }

  likeCard(cardId) {
    return fetch(`${this.url}/cards/${cardId}/likes`, {
      method: "PUT",
      headers: this.headers,
    }).then(this.getResponse)
  }

  dislikeCard(cardId) {
    return fetch(`${this.url}/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: this.headers,
    }).then(this.getResponse)
  }
}

const api = new Api({
  url: "https://mesto.nomoreparties.co/v1/cohort-64",
  headers: {
    authorization: "99359d1f-f5b1-4868-8efb-f0dafa2bda0d",
    "content-type": "application/json",
  },
})

export default api