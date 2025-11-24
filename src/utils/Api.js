class ProductsApi {
  constructor(options) {
    this._url = options.url
    this._headers = options.headers
  }

  _getResponseData(res) {
    if (!res.ok) {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
    return res.json();
  }

  getAllProducts() {
    return fetch(this._url + '/products/all', {
      method: 'GET',
      headers: this._headers
    })
      .then(this._getResponseData);
  }

  getProduct(id) {
    return fetch(this._url + `/products/by_id?productId=${id}`, {
      method: 'GET',
      headers: this._headers
    })
      .then(this._getResponseData);
  }

  getProductsById(products) {
    let savedPoducts = products.join(',');
    return fetch(this._url + `/products/by_id?productId=${savedPoducts}`, {
      method: 'GET',
      headers: this._headers
    })
      .then(this._getResponseData);
  }

  getTerms() {
    return fetch(this._url + '/products/terms', {
      method: 'GET',
      headers: this._headers
    })
      .then(this._getResponseData);
  }

  getStones() {
    return fetch(this._url + '/stones', {
      method: 'GET',
      headers: this._headers
    })
      .then(this._getResponseData);
  }

  getReviews() {
    return fetch(this._url + '/testimonials', {
      method: 'GET',
      headers: this._headers
    })
      .then(this._getResponseData);
  }

  filterProducts(category = '', tags = '', search = '', offset = '', pageSize = '', sortBy = '', seed = 1, colors = '', sizes = '', masterpiece = '', iridescent = '') {
    let sortByClean = sortBy.includes('-') ? sortBy.split('-')[0] : sortBy;
    let sortOrder = 'asc';
    if (sortBy.includes('-desc')) sortOrder = 'desc';


    return fetch(this._url + `/products/filter?category=${category}&tags=${tags}&search=${search}&offset=${offset}&pageSize=${pageSize}&sortBy=${sortByClean}&sortOrder=${sortOrder}&seed=${seed}&colors=${colors}&sizes=${sizes}&masterpiece=${masterpiece}&iridescent=${iridescent}`, {
      method: 'GET',
      headers: this._headers
    })
      .then(this._getResponseData);
  }

  productsByType(type, offset = 0, pageSize = 240, sortBy = 'default', seed = 1) {
    let sortByClean = sortBy.includes('-') ? sortBy.split('-')[0] : sortBy;
    let sortOrder = 'asc';
    if (sortBy.includes('-desc')) sortOrder = 'desc';

    return fetch(this._url + `/products/by_type?type=${type}&offset=${offset}&pageSize=${pageSize}&sortBy=${sortByClean}&sortOrder=${sortOrder}&seed=${seed}`, {
      method: 'GET',
      headers: this._headers
    })
      .then(this._getResponseData);
  }


  getCdekCities(city) {
    return fetch(this._url + `/cdek/city?city=${city}`, {
      method: 'GET',
      headers: this._headers
    })
      .then(this._getResponseData);
  }

  getCdekTariff(city) {
    return fetch(this._url + `/cdek/tarifflist?codeTo=${city}`, {
      method: 'GET',
      headers: this._headers
    })
      .then(this._getResponseData);
  }

  getBoxberryTariff(city) {
    return fetch(this._url + `/boxberry/tarifflist?codeTo=${city}`, {
      method: 'GET',
      headers: this._headers
    })
      .then(this._getResponseData);
  }


  getFivepostTariff(city) {
    return fetch(this._url + `/fivepost/tarifflist?city=${city}`, {
      method: 'GET',
      headers: this._headers
    })
      .then(this._getResponseData);
  }

  getDeliveryPoints(cdek_city, boxberry_city, city_name, deliveryType) {

    let deliveryService = "cdek";
    let cityCode = cdek_city;
    if (deliveryType === 4) {
      deliveryService = "boxberry";
      cityCode = boxberry_city;
    }
    if (deliveryType === 6) {
      deliveryService = "fivepost";
      cityCode = city_name;
    }

    return fetch(this._url + `/${deliveryService}/deliveryPoints?city_code=${cityCode}`, {
      method: 'GET',
      headers: this._headers
    })
      .then(this._getResponseData);
  }

  postReview(title, text, author, image) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', text);
    formData.append('author', author);
    formData.append('image', image);
    return fetch('https://dolina.shop/forms/testimonials.php', {
      method: 'POST',
      body: formData
    })
      .then(this._getResponseData);
  }

}


const productsApi = new ProductsApi({
  url: process.env.REACT_APP_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default productsApi;


