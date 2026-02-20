import "./Profile.css";
import { NavLink } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import MobileNavBar from "../MobileNavBar/MobileNavBar";
import productsApi from "../../utils/Api";
import ProfilePopup from "./ProfilePopup";

export default function Profile({
  savedProducts,
  orders,
  onUpdateUser,
  onSignout,
  onChangeClick,
  onCloseClick,
  isPopupOpen,
  terms,
  onCatClick,
  onBurgerClick,
  onBurgerClose,
  isBurgerOpen,
  search,
  setSearch,
  cart,
  isLoggedIn,
}) {
  useEffect(() => {
    document.title = "Мой профиль — Долина самоцветов";
  }, []);

  const currentUser = useContext(CurrentUserContext);

  const [wishlist, setWishlist] = useState([]);

  let wishlistPreviews = wishlist.slice(-4);
  let ordersPreviews = orders.slice(0, 1);

  function getDate(timestamp) {
    return new Date(timestamp * 1000).toLocaleDateString("ru-RU");
  }

  const getStatusName = (index) => {
    switch (index) {
      case 0:
        return "Новый";
      case 1:
        return "Собираем заказ";
      case 2:
        return "В пути";
      case 3:
        return "Доставлен";
      case -1:
        return "Отменён";
      default:
        return "";
    }
  };

  const getStatusClass = (index) => {
    switch (index) {
      case 0:
        return "status-new";
      case 1:
        return "status-collecting";
      case 2:
        return "status-on-the-way";
      case 3:
        return "status-delivered";
      case -1:
        return "status-cancelled";
      default:
        return "";
    }
  };

  useEffect(() => {
    productsApi
      .getProductsById([savedProducts])
      .then((res) => {
        setWishlist(res);
      })
      .catch((err) => console.log(err));
  }, [savedProducts]);

  const getDeliveryTypeName = (index) => {
    switch (index) {
      case 1:
        return "Пункт выдачи СДЭК";
      case 2:
        return "Курьерская доставка СДЭК";
      case 3:
        return "Почта";
      case 4:
        return "Пункт выдачи Boxberry";
      case 5:
        return "Курьерская доставка Boxberry";
      case 6:
        return "5post";
      default:
        return "";
    }
  };

  return (
    <>
      <main className="profile">
        <h1 className="wishlist-header">Личный кабинет</h1>
        <section className="user-info">
          <div className="user-info__avatar">
            <p className="user-info__avatar-caption">
              {currentUser?.name?.slice(0, 1)}
            </p>
          </div>
          <div className="user-info__container">
            <p className="user-info__name">{currentUser.name}</p>
            <p className="user-info__email">{currentUser.email}</p>
            <NavLink to="" onClick={onChangeClick} className="navlink_size_s ">
              Редактировать{" "}
            </NavLink>
          </div>
        </section>
        <div className="profile_flex">
          <section className="profile__orders">
            <NavLink to="/me/orders" className="profile__link">
              <h2 className="profile__subheader">Заказы &#8594;</h2>
              <ul className="profile__orders_ul">
                {ordersPreviews.map((order) => (
                  <li className="order" key={order.orderId}>
                    <div className="flex_type_row order__head">
                      <h3 className="order__header">
                        Заказ от {getDate(order.createdAt)}
                      </h3>
                      <p className="order__total-price">
                        {order.totalPrice + order.deliveryPrice} &#8381;
                      </p>
                    </div>
                    <div className="order__body">
                      <div
                        className="order__main-info"
                        style={{ width: "100%", border: "none" }}
                      >
                        <p className="order__main-text">
                          {getDeliveryTypeName(order.deliveryType)}:{" "}
                          {order.deliveryOffice
                            ? order.deliveryOffice
                            : `${order.city + ", " + order.deliveryAddress}`}
                        </p>

                        <p className="order__main-text">
                          Стоимость доставки: {order.deliveryPrice} &#8381;
                        </p>

                        {order.orderStatus === 4 ? null : order.paid === 1 ? (
                          <p className="order_paid">Оплачен</p>
                        ) : order.paymentType !== 3 ? (
                          <>
                            <p className="order_not-paid">Не оплачен</p>
                            <span
                              style={{ marginRight: "5px" }}
                              className="orders_pay"
                            >
                              Оплатить
                            </span>
                          </>
                        ) : (
                          <p className="order_not-paid">Не оплачен</p>
                        )}
                        <p
                          className={`order__status ${getStatusClass(order.orderStatus)}`}
                        >
                          {getStatusName(order.orderStatus)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </NavLink>
          </section>
          <section className="profile__wishlist">
            <NavLink to="/me/wishlist" className="profile__link">
              <h2 className="profile__subheader">Избранное &#8594;</h2>
              <ul className="profile__wishlist_ul">
                {wishlistPreviews.map((product) => (
                  <li
                    className="profile__wishlist_li"
                    key={product.pictures[0].path}
                  >
                    <img
                      className="profile__wishlist-pic"
                      src={`https://dolina.shop/photos/${product.pictures[0].path.slice(0, -5) + `_preview.webp`}`}
                    ></img>
                  </li>
                ))}
                {wishlist.length > 4 && (
                  <li className="profile__wishlist_li">{`+${savedProducts.length - 4}`}</li>
                )}
              </ul>
            </NavLink>
          </section>
        </div>
        <ProfilePopup
          isOpen={isPopupOpen}
          onClose={onCloseClick}
          onUpdateUser={onUpdateUser}
          onSignout={onSignout}
        />
        <MobileNavBar
          onBurger={onBurgerClick}
          isBurgerOpen={isBurgerOpen}
          onBurgerClose={onBurgerClose}
          cart={cart}
          orders={orders}
          onCatClick={onCatClick}
          isLoggedIn={isLoggedIn}
        />
      </main>
    </>
  );
}
