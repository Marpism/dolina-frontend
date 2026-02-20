import "./App.css";
import { useEffect, useState } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import {
  Route,
  Routes,
  useNavigate,
  NavLink,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import MainPage from "./pages/MainPage";
import CatalogPage from "./pages/CatalogPage";
import NewPage from "./pages/NewPage";
import ProductPage from "./pages/ProductPage";
import ContactPage from "./pages/ContactPage";
import RegisterForm from "./Form/RegisterForm";
import YandexOauth from "./Form/YandexOauth";
import LoginForm from "./Form/LoginForm";
import ForgotPasswordForm from "./Form/ForgotPasswordForm";
import ChangePasswordForm from "./Form/ChangePasswordForm";
import ShoppingCart from "./ShoppingCart/ShoppingCart";
import Wishlist from "./Profile/Wishlist";
import ProtectedRoute from "./ProtectedRoute";
import productsApi from "../utils/Api";
import usersApi from "../utils/UsersApi";
import NotFoundPage from "./NotFoundPage/NotFoundPage";
import Profile from "./Profile/Profile";
import Orders from "./Profile/Orders";
import PhoneModal from "./PhoneModal/PhoneModal";
import OrderingPage from "./ShoppingCart/OrderingPage/OrderingPage";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import LicensePage from "./pages/LicensePage";
import AboutPage from "./pages/AboutPage";
import DeliveryPage from "./pages/DeliveryPage";
import SuccessPage from "./ShoppingCart/SuccessPage/SuccessPage";
import ReviewsPage from "./pages/ReviewsPage";
import PaymentFailed from "./ShoppingCart/PaymentFailed/PaymentFailed";
import ScrollToTop from "./ScrollToTop";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [pageTitle, setPageTitle] = useState("Долина Самоцветов");
  const [productData, setProductData] = useState([]);
  const [products, setProducts] = useState([]);
  const [inputError, setInputError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [savedProducts, setSavedproducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [terms, setTerms] = useState([]);
  const [stoneDescriptions, setStoneDescriptions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const searchParams = new URLSearchParams(location.search);
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [search, setSearch] = useState("");
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

  const categoryQuery = searchParams.get("category");
  const tagsQuery = searchParams.get("tags");
  const colorsQuery = searchParams.get("colors");
  const searchQuery = searchParams.get("search");
  const sizeQuery = searchParams.get("sizes");
  const masterpieceQuery = searchParams.get("masterpiece");
  const iridescentQuery = searchParams.get("iridescent");

  const [productFilters, setProductFilters] = useState({
    category: categoryQuery ?? "",
    tags: tagsQuery ? tagsQuery.split(",").map((id) => parseInt(id)) : [],
    colors: colorsQuery ? colorsQuery.split(",").map((id) => parseInt(id)) : [],
    sizes: sizeQuery ? sizeQuery.split(",").map((id) => parseInt(id)) : [],
    masterpiece: masterpieceQuery ?? "",
    iridescent: iridescentQuery ?? "",
    search: searchQuery ?? "",
    sortBy: "default",
    offset: 0,
    pageSize: 24,
    seed: Math.floor(Math.random() * 99999),
  });

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const [offset, setOffset] = useState(0);
  const pageSize = 24;
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [lastProductsRequest, setLastProductsRequest] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [catalogLoading, setCatalogLoading] = useState(false);

  function handleBurgerOpening() {
    setIsBurgerOpen(true);
  }

  function handleBurgerClosing() {
    setIsBurgerOpen(false);
  }

  function handleLogin(email, password) {
    setInputError("");
    usersApi
      .login(email, password)
      .then(() => {
        setIsLoggedIn(true);
        navigate("/");
      })
      .catch((err) => {
        if (err.status === 401) {
          setInputError("Неправильный логин или пароль");
        } else {
          setInputError("При авторизации произошла ошибка");
        }
      });
  }

  function handleRegistration(name, email, password) {
    setInputError("");
    usersApi
      .register(name, email, password)
      .then(() => {
        handleLogin(email, password);
      })
      .catch((err) => {
        if (err.status === 409) {
          setInputError("Пользователь с таким email уже существует");
        } else {
          setInputError("При регистрации пользователя произошла ошибка");
        }
      });
  }

  function handleSignOut() {
    setIsProfilePopupOpen(false);
    setIsLoggedIn(false);
    localStorage.removeItem("jwt");
    navigate("/signin");
  }

  function handleResetRequest(email) {
    usersApi.requestPasswordReset(email).catch((err) => {
      console.log(err);
    });
  }

  function handlePasswordChange(token, password) {
    usersApi
      .reset_password(token, password)
      .then(() => {
        navigate("/signin");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateUser(e) {
    usersApi.updateUserData(e).then((res) => setCurrentUser(res));
    setIsProfilePopupOpen(false);
  }

  function handleChangeClick() {
    setIsProfilePopupOpen(true);
  }

  function handleClosePopupClick() {
    setIsProfilePopupOpen(false);
  }

  function handlePhoneModalClose() {
    localStorage.setItem("hasSeenModal", "true");
    setIsPhoneModalOpen(false);
  }

  // КОРЗИНА

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) setCart(savedCart);
  }, []);

  function handleAddToCart(productId, checked, size) {
    const newCart = { ...cart };
    newCart[productId] = { checked, size };
    setCart(newCart);
    if (isLoggedIn) {
      // патчим в корзину юзера
      usersApi.updateCart(JSON.stringify(newCart));
    }
    localStorage.setItem("cart", JSON.stringify(newCart));
  }

  function handleRemoveFromCart(productId) {
    const newCart = { ...cart };
    delete newCart[productId];
    setCart(newCart);
    if (isLoggedIn) {
      usersApi.updateCart(JSON.stringify(newCart));
    }
    localStorage.setItem("cart", JSON.stringify(newCart));
  }

  // переход в товар
  function handleCardClick(newSlug) {
    // console.log('хэндлер сработал, хотя не должен был')
  }

  // лайк

  function handleLikeClick(id) {
    if (isLoggedIn) {
      if (savedProducts.includes(id)) {
        usersApi
          .removeProduct(id)
          .then(() => {
            setSavedproducts(savedProducts.filter((item) => item !== id));
          })
          .catch((err) => console.log(err));
      } else {
        usersApi
          .saveProduct(id)
          .then(() => {
            setSavedproducts([id, ...savedProducts]);
          })
          .catch((err) => console.log(err));
      }
    } else {
      navigate("/signup");
    }
  }

  // Аутентификация, ставит current-юзера, корзину

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const savedCart = JSON.parse(localStorage.getItem("cart"));

    if (token) {
      usersApi
        .checkToken(token)
        .then((user) => {
          setCurrentUser(user);
          setIsLoggedIn(true);

          let userCart = JSON.parse(user.cart);
          if (savedCart) Object.assign(userCart, savedCart);
          usersApi.updateCart(userCart);
          setCart(userCart);
          if (JSON.stringify(userCart) !== JSON.stringify(savedCart)) {
            localStorage.setItem("cart", JSON.stringify(userCart));
          }
        })
        .catch((err) => {
          const status =
            err?.status || (err instanceof Response ? err.status : undefined);
          if (status === 401) {
            handleSignOut();
            return;
          }
          console.error("Ошибка проверки токена:", err);
        });
    }
  }, []);

  // ставит избранное и заказы

  useEffect(() => {
    if (isLoggedIn) {
      usersApi
        .getUsersProfile()
        .then((data) => {
          setSavedproducts(data[0]);
          setOrders(data[1]);
          setCurrentUser(data[2]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isLoggedIn]);

  // РУБРИКИ

  useEffect(() => {
    productsApi
      .getTerms()
      .then((data) => {
        setTerms(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // ОПИСАНИЯ КАМНЕЙ

  useEffect(() => {
    productsApi
      .getStones()
      .then((data) => {
        setStoneDescriptions(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // ОТЗЫВЫ

  useEffect(() => {
    productsApi
      .getReviews()
      .then((data) => {
        setReviews(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleAddReview(title, text, author, image) {
    productsApi.postReview(title, text, author, image);
  }

  // ВСПЛЫВАШКА

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("hasSeenModal");
    if (!hasSeenModal) {
      const timer = setTimeout(() => setIsPhoneModalOpen(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  function fetchProducts() {
    if (productFilters.offset > 0) {
      setIsLoadingMore(true);
    } else {
      setCatalogLoading(true);
    }

    productsApi
      .filterProducts(
        productFilters.category,
        productFilters.tags,
        productFilters.search,
        productFilters.offset,
        productFilters.pageSize,
        productFilters.sortBy,
        productFilters.seed,
        productFilters.colors,
        productFilters.sizes,
        productFilters.masterpiece,
        productFilters.iridescent,
      )
      .then((data) => {
        if (data.length > productFilters.pageSize) {
          setShowLoadMore(true);
        } else {
          setShowLoadMore(false);
        }

        if (productFilters.offset > 0) {
          setProducts((prevProducts) => [
            ...prevProducts,
            ...data.slice(0, productFilters.pageSize),
          ]);
          setIsLoadingMore(false);
        } else {
          setProducts(data.slice(0, productFilters.pageSize));
          setCatalogLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    // обновляем url просто
    if (window.location.pathname.includes("catalog")) {
      if (productFilters.category) {
        searchParams.set("category", productFilters.category);
      } else {
        searchParams.delete("category");
      }

      if (productFilters.tags.length > 0) {
        searchParams.set("tags", productFilters.tags);
      } else {
        searchParams.delete("tags");
      }

      if (productFilters.colors.length > 0) {
        searchParams.set("colors", productFilters.colors);
      } else {
        searchParams.delete("colors");
      }

      if (productFilters.sizes.length > 0) {
        searchParams.set("sizes", productFilters.sizes);
      } else {
        searchParams.delete("sizes");
      }

      if (productFilters.search) {
        searchParams.set("search", productFilters.search);
      } else {
        searchParams.delete("search");
      }

      if (productFilters.masterpiece) {
        searchParams.set("masterpiece", productFilters.masterpiece);
      } else {
        searchParams.delete("masterpiece");
      }

      if (productFilters.iridescent) {
        searchParams.set("iridescent", productFilters.iridescent);
      } else {
        searchParams.delete("iridescent");
      }

      let newPath = "/catalog/?" + searchParams.toString();
      if (newPath != window.location.pathname + window.location.search)
        navigate(newPath);

      fetchProducts();
    }
  }, [productFilters]);

  function handleCategorySelection(categoryId) {
    setProductFilters((prevFilters) => ({
      ...prevFilters,
      category: categoryId,
      tags: [],
      colors: [],
      sizes: [],
      search: "",
      offset: 0,
      iridescent: "",
      masterpiece: "",
    }));
    if (categoryId) {
      navigate("/catalog/?category=" + categoryId);
    } else {
      navigate("/catalog/");
    }
  }

  function handleTagSelection(activeTags) {
    setProductFilters((prevFilters) => ({
      ...prevFilters,
      tags: activeTags,
      search: "",
      offset: 0,
    }));
  }

  function handleColorSelection(activeColors) {
    setProductFilters((prevFilters) => ({
      ...prevFilters,
      colors: activeColors,
      search: "",
      offset: 0,
    }));
  }

  function handleSizeSelection(activeSizes) {
    setProductFilters((prevFilters) => ({
      ...prevFilters,
      sizes: activeSizes,
      search: "",
      offset: 0,
    }));
  }

  const showHeader =
    location.pathname !== "/ordering" &&
    !location.pathname.includes("/administration");

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        {!window.location.pathname.includes("administration") && (
          <div className="header_top">
            <div className="header__container">
              <div>
                <NavLink to="/delivery" className="navlink_size_s color_white">
                  Доставка и оплата
                </NavLink>
                <NavLink to="/about" className="navlink_size_s color_white">
                  О нас
                </NavLink>
                <NavLink to="/contacts" className="navlink_size_s color_white">
                  Контакты
                </NavLink>
                <NavLink to="/reviews" className="navlink_size_s color_white">
                  Отзывы
                </NavLink>
              </div>
              <p className="color_white">
                <a
                  className="navlink_size_s color_white"
                  href="tel:88002001705"
                >
                  8 800 200 17 05
                </a>
              </p>
            </div>
          </div>
        )}
        <div className="content">
          {showHeader && (
            <Header
              terms={terms}
              onCatClick={handleCategorySelection}
              activeCategory={category}
              isBurgerOpen={isBurgerOpen}
              onBurgerClick={handleBurgerOpening}
              onBurgerClose={handleBurgerClosing}
              search={search}
              setSearch={setSearch}
              cart={cart}
              orders={orders}
              productFilters={productFilters}
              setProductFilters={setProductFilters}
              isLoggedIn={isLoggedIn}
            />
          )}
          <ScrollToTop />
          <Routes>
            <Route
              path="/"
              element={
                <MainPage
                  onCardClick={handleCardClick}
                  onLikeClick={handleLikeClick}
                  products={products}
                  setProducts={setProducts}
                  savedProducts={savedProducts}
                  isLoggedIn={isLoggedIn}
                  terms={terms}
                  onCatClick={handleCategorySelection}
                  category={category}
                  cart={cart}
                  orders={orders}
                  fetchProducts={fetchProducts}
                  onBurgerClick={handleBurgerOpening}
                  onBurgerClose={handleBurgerClosing}
                />
              }
            />
            <Route
              path="/new"
              element={
                <NewPage
                  onCardClick={handleCardClick}
                  onLikeClick={handleLikeClick}
                  products={products}
                  setProducts={setProducts}
                  savedProducts={savedProducts}
                  isLoggedIn={isLoggedIn}
                  terms={terms}
                  onCatClick={handleCategorySelection}
                  category={category}
                  cart={cart}
                  orders={orders}
                  fetchProducts={fetchProducts}
                  onBurgerClick={handleBurgerOpening}
                  onBurgerClose={handleBurgerClosing}
                />
              }
            />
            <Route
              path="/contacts"
              element={
                <ContactPage
                  terms={terms}
                  onCatClick={handleCategorySelection}
                  category={category}
                  cart={cart}
                  orders={orders}
                  onBurgerClick={handleBurgerOpening}
                  onBurgerClose={handleBurgerClosing}
                  isLoggedIn={isLoggedIn}
                />
              }
            />
            <Route
              path="/reviews"
              element={
                <ReviewsPage
                  reviews={reviews}
                  terms={terms}
                  onCatClick={handleCategorySelection}
                  category={category}
                  cart={cart}
                  orders={orders}
                  onBurgerClick={handleBurgerOpening}
                  onBurgerClose={handleBurgerClosing}
                  onsubmit={handleAddReview}
                  isLoggedIn={isLoggedIn}
                />
              }
            />
            <Route
              path="/license"
              element={
                <LicensePage
                  terms={terms}
                  onCatClick={handleCategorySelection}
                  category={category}
                  cart={cart}
                  orders={orders}
                  onBurgerClick={handleBurgerOpening}
                  onBurgerClose={handleBurgerClosing}
                  isLoggedIn={isLoggedIn}
                />
              }
            />
            <Route
              path="/about"
              element={
                <AboutPage
                  terms={terms}
                  onCatClick={handleCategorySelection}
                  category={category}
                  cart={cart}
                  orders={orders}
                  onBurgerClick={handleBurgerOpening}
                  onBurgerClose={handleBurgerClosing}
                  isLoggedIn={isLoggedIn}
                />
              }
            />
            <Route
              path="/delivery"
              element={
                <DeliveryPage
                  terms={terms}
                  onCatClick={handleCategorySelection}
                  category={category}
                  cart={cart}
                  orders={orders}
                  onBurgerClick={handleBurgerOpening}
                  onBurgerClose={handleBurgerClosing}
                  isLoggedIn={isLoggedIn}
                />
              }
            />
            <Route
              path="/me/orders/success/:orderId?"
              element={
                <SuccessPage
                  terms={terms}
                  onCatClick={handleCategorySelection}
                  category={category}
                  cart={cart}
                  orders={orders}
                  onBurgerClick={handleBurgerOpening}
                  onBurgerClose={handleBurgerClosing}
                  isLoggedIn={isLoggedIn}
                />
              }
            />
            <Route
              path="/me/orders/paymentfail"
              element={
                <PaymentFailed
                  terms={terms}
                  onCatClick={handleCategorySelection}
                  category={category}
                  cart={cart}
                  orders={orders}
                  onBurgerClick={handleBurgerOpening}
                  onBurgerClose={handleBurgerClosing}
                  isLoggedIn={isLoggedIn}
                />
              }
            />
            <Route
              path="/catalog/"
              element={
                <CatalogPage
                  onCardClick={handleCardClick}
                  onLikeClick={handleLikeClick}
                  products={products}
                  setProducts={setProducts}
                  savedProducts={savedProducts}
                  isLoggedIn={isLoggedIn}
                  terms={terms}
                  category={category}
                  tags={tags}
                  onCatClick={handleCategorySelection}
                  onTagClick={handleTagSelection}
                  onColorClick={handleColorSelection}
                  onSizeClick={handleSizeSelection}
                  cart={cart}
                  orders={orders}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                  fetchProducts={fetchProducts}
                  onBurgerClick={handleBurgerOpening}
                  productFilters={productFilters}
                  setProductFilters={setProductFilters}
                  onBurgerClose={handleBurgerClosing}
                  isLoadingMore={isLoadingMore}
                  showLoadMore={showLoadMore}
                  catalogLoading={catalogLoading}
                />
              }
            />
            <Route
              path="/product/:newSlug"
              element={
                <ProductPage
                  productData={productData}
                  onLikeClick={handleLikeClick}
                  savedProducts={savedProducts}
                  isLoggedIn={isLoggedIn}
                  onAddClick={handleAddToCart}
                  cart={cart}
                  orders={orders}
                  onCardClick={handleCardClick}
                  terms={terms}
                  onCatClick={handleCategorySelection}
                  onBurgerClick={handleBurgerOpening}
                  onBurgerClose={handleBurgerClosing}
                  stoneDescriptions={stoneDescriptions}
                />
              }
            />
            <Route
              path="/signup"
              element={
                <RegisterForm
                  onRegistration={handleRegistration}
                  inputError={inputError}
                  terms={terms}
                  category={category}
                  onCatClick={handleCategorySelection}
                  isLoggedIn={isLoggedIn}
                />
              }
            />
            <Route
              path="/signin"
              element={
                <LoginForm
                  onLogin={handleLogin}
                  inputError={inputError}
                  terms={terms}
                  category={category}
                  onCatClick={handleCategorySelection}
                  isLoggedIn={isLoggedIn}
                />
              }
            />
            <Route
              path="/forgot_password"
              element={<ForgotPasswordForm onSubmit={handleResetRequest} />}
            />
            <Route
              path="/reset_password/:token"
              element={<ChangePasswordForm onSubmit={handlePasswordChange} />}
            />

            <Route
              path="/yandexOauth"
              element={
                <YandexOauth
                  onLogin={handleLogin}
                  inputError={inputError}
                  terms={terms}
                  category={category}
                  onCatClick={handleCategorySelection}
                  setIsLoggedIn={setIsLoggedIn}
                />
              }
            />
            <Route
              path="/me"
              element={
                <ProtectedRoute
                  isLoggedIn={isLoggedIn}
                  element={Profile}
                  onUpdateUser={handleUpdateUser}
                  onSignout={handleSignOut}
                  onChangeClick={handleChangeClick}
                  onCloseClick={handleClosePopupClick}
                  savedProducts={savedProducts}
                  orders={orders}
                  cart={cart}
                  isPopupOpen={isProfilePopupOpen}
                  terms={terms}
                  category={category}
                  onCatClick={handleCategorySelection}
                  onBurgerClick={handleBurgerOpening}
                  onBurgerClose={handleBurgerClosing}
                />
              }
            />
            <Route
              path="/me/orders"
              element={
                <ProtectedRoute
                  isLoggedIn={isLoggedIn}
                  orders={orders}
                  element={Orders}
                  terms={terms}
                  category={category}
                  onCatClick={handleCategorySelection}
                  cart={cart}
                  onBurgerClick={handleBurgerOpening}
                  onBurgerClose={handleBurgerClosing}
                  isBurgerOpen={isBurgerOpen}
                />
              }
            />
            <Route
              path="/me/wishlist"
              element={
                <ProtectedRoute
                  isLoggedIn={isLoggedIn}
                  element={Wishlist}
                  onCardClick={handleCardClick}
                  onLikeClick={handleLikeClick}
                  savedProducts={savedProducts}
                  terms={terms}
                  category={category}
                  onCatClick={handleCategorySelection}
                  cart={cart}
                  orders={orders}
                  onBurgerClick={handleBurgerOpening}
                  onBurgerClose={handleBurgerClosing}
                />
              }
            />

            <Route
              path="/cart"
              element={
                <ShoppingCart
                  cart={cart}
                  onCardClick={handleCardClick}
                  isLoggedIn={isLoggedIn}
                  onRemoveClick={handleRemoveFromCart}
                  savedProducts={savedProducts}
                  onLikeClick={handleLikeClick}
                  terms={terms}
                  category={category}
                  onCatClick={handleCategorySelection}
                  orders={orders}
                  onBurgerClick={handleBurgerOpening}
                  onBurgerClose={handleBurgerClosing}
                  onUpdateUser={handleUpdateUser}
                />
              }
            />
            <Route
              path="/ordering"
              element={
                <OrderingPage
                  cart={cart}
                  onCatClick={handleCategorySelection}
                  isLoggedIn={isLoggedIn}
                  onUpdateUser={handleUpdateUser}
                />
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <PhoneModal
            isOpen={isPhoneModalOpen}
            onClose={handlePhoneModalClose}
          />
        </div>
        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
