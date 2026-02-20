class UsersApi {
  constructor(options) {
    this._url = options.url;
    this._headers = options.headers;
  }

  _getResponseData(res) {
    if (!res.ok) {
      return Promise.reject(res);
    }
    return res.json();
  }

  _getResponseDataWithoutJson(res) {
    if (!res.ok) {
      return Promise.reject(res);
    }
    return res;
  }

  _getHeaders() {
    const token = localStorage.getItem("jwt");

    return {
      Authorization: `Bearer ${token}`,
      ...this._headers,
    };
  }

  // регистрация без подтверждения почты и необходимости аутентификации?
  register(name, email, password) {
    return fetch(`${this._url}/sign_up`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({ name, email, password }),
    })
      .then(this._getResponseData)
      .then((res) => {
        if (res.token) {
          localStorage.setItem("jwt", res.token);
          return res;
        }
      });
  }

  login(email, password) {
    return fetch(`${this._url}/sign_in`, {
      method: "POST",
      headers: this._getHeaders(),
      body: JSON.stringify({ email, password }),
    })
      .then(this._getResponseData)
      .then((res) => {
        if (res.token) {
          localStorage.setItem("jwt", res.token);
          return res;
        }
      });
  }

  yandexOauth(name, email, phone, yandexOauth, yandexUserId) {
    return fetch(`${this._url}/yandex_oauth`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({ name, email, phone, yandexOauth, yandexUserId }),
    })
      .then(this._getResponseData)
      .then((res) => {
        if (res.token) {
          localStorage.setItem("jwt", res.token);
          return res;
        }
      });
  }

  requestPasswordReset(email) {
    return fetch(`${this._url}/request_password_reset`, {
      method: "POST",
      headers: this._getHeaders(),
      body: JSON.stringify({ email }),
    }).then(this._getResponseDataWithoutJson);
  }

  reset_password(token, password) {
    return fetch(`${this._url}/reset_password`, {
      method: "POST",
      headers: this._getHeaders(),
      body: JSON.stringify({ token, password }),
    }).then(this._getResponseDataWithoutJson);
  }

  checkToken(token) {
    return fetch(`${this._url}/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then(this._getResponseData);
  }

  getUserData() {
    return fetch(this._url + "/me", {
      method: "GET",
      headers: this._getHeaders(),
    }).then(this._getResponseData);
  }

  updateUserData(data) {
    return fetch(this._url + "/me", {
      method: "PATCH",
      headers: this._getHeaders(),
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        // а как менять пароль?
      }),
    }).then(this._getResponseData);
  }

  saveProduct(productId) {
    return fetch(this._url + "/me/wishlist", {
      method: "POST",
      headers: this._getHeaders(),
      body: JSON.stringify({
        productId: productId,
      }),
    }).then(this._getResponseDataWithoutJson);
  }

  removeProduct(productId) {
    return fetch(this._url + `/me/wishlist?productId=${productId}`, {
      method: "DELETE",
      headers: this._getHeaders(),
    }).then(this._getResponseDataWithoutJson);
  }

  // получаем массив айдишников продуктов
  getSavedProducts() {
    return fetch(this._url + "/me/wishlist", {
      method: "GET",
      headers: this._getHeaders(),
    }).then(this._getResponseData);
  }

  getOrders() {
    return fetch(this._url + "/me/orders", {
      method: "GET",
      headers: this._getHeaders(),
    }).then(this._getResponseData);
  }

  updateCart(data) {
    return fetch(this._url + "/me", {
      method: "PATCH",
      headers: this._getHeaders(),
      body: JSON.stringify({
        cart: data,
      }),
    }).then(this._getResponseDataWithoutJson);
  }

  addOrder(orderData) {
    return fetch(this._url + "/me/orders", {
      method: "POST",
      headers: this._getHeaders(),
      body: JSON.stringify(orderData),
    }).then(this._getResponseData);
  }

  orderSuccess(orderId) {
    return fetch(this._url + "/me/orders/success?orderId=" + orderId, {
      method: "GET",
      headers: this._getHeaders(),
    }).then(this._getResponseData);
  }

  addQuickOrder(orderData) {
    return fetch(this._url + "/quick_order", {
      method: "POST",
      headers: this._getHeaders(),
      body: JSON.stringify(orderData),
    }).then(this._getResponseData);
  }

  orderPay(orderId) {
    return fetch(this._url + "/me/orders/pay?orderId=" + orderId, {
      method: "GET",
      headers: this._getHeaders(),
    }).then(this._getResponseData);
  }

  getUsersProfile() {
    return Promise.all([
      this.getSavedProducts(),
      this.getOrders(),
      this.getUserData(),
    ]);
  }
}

const usersApi = new UsersApi({
  url: process.env.REACT_APP_BACKEND_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default usersApi;
