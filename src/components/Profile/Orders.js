import './Profile.css';
import MobileNavBar from "../MobileNavBar/MobileNavBar";
import Skeleton from 'react-loading-skeleton';
import { useEffect, useState } from "react";
import usersApi from '../../utils/UsersApi';

export default function Orders({ orders, terms, onCatClick, onBurgerClick, onBurgerClose, isBurgerOpen, cart, isLoggedIn }) {
  useEffect(() => {
    document.title = 'Мои заказы — Долина самоцветов';
  }, []);

  // const [isCanceled, setIsCanceled] = useState(false);
  const [timeLeft, setTimeLeft] = useState({});

  // Функция для расчета оставшегося времени
  const calculateRemainingTime = (createdAt) => {
    const twoHours = 2 * 60 * 60 * 1000;
    const orderTime = new Date(createdAt * 1000).getTime();
    const currentTime = Date.now();
    return twoHours - (currentTime - orderTime);
  };

  const formatTime = (time) => {
    if (time <= 0) return '00:00:00';

    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const seconds = Math.floor((time / 1000) % 60);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (orders) {
      const intervalId = setInterval(() => {
        const newTimeLeft = {};
        orders.forEach(order => {
          newTimeLeft[order.orderId] = calculateRemainingTime(order.createdAt);
        });
        setTimeLeft(newTimeLeft);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [orders]);

  if (!orders) {
    return <div>Loading...</div>
  }

  function getDate(timestamp) {
    return new Date(timestamp * 1000).toLocaleDateString('ru-RU');
  }

  const getStatusName = (index) => {
    switch (index) {
      case 0:
        return 'Новый';
      case 1:
        return 'Собираем заказ';
      case 2:
        return 'В пути';
      case 3:
        return 'Готов к выдаче';
      case 4:
        return 'Получен';
      case -1:
        return 'Отменён';
      default:
        return '';
    }
  };

  const getStatusClass = (index) => {
    switch (index) {
      case 0:
        return 'status-new';
      case 1:
        return 'status-collecting';
      case 2:
        return 'status-on-the-way';
      case 3:
        return 'status-delivered';
      case 4:
        return 'status-done';
      case -1:
        return 'status-cancelled';
      default:
        return '';
    }
  };

  const getDeliveryTypeName = (index) => {
    switch (index) {
      case 1:
        return 'Пункт выдачи СДЭК';
      case 2:
        return 'Курьерская доставка СДЭК';
      case 3:
        return 'Почта';
      case 4:
        return 'Пункт выдачи Boxberry';
      case 5:
        return 'Курьерская доставка Boxberry';
      case 6:
        return '5post';
      default:
        return '';
    }
  };

  function handlePayClick(orderId) {
    usersApi.orderPay(orderId)
      .then((res) => {
        window.location.href = res.paymentUrl;
      });
  }

  return (
    <>
      <main className='orders'>
        <ul className='orders-list'>
          <h1 className='orders__title'>Заказы</h1>
          {
            !orders ? (
              <li className='order'>
                <Skeleton height={245} width="100%" />
              </li>
            ) : (
              orders.length === 0 ? (
                <div>
                  <p style={{ margin: '0 15px' }}>Пока заказов нет</p>
                </div>
              ) : (
                orders.map((order) => (
                  <li className='order' key={order.orderId}>
                    <div className='flex_type_row order__head'>
                      <h3 className='order__header'>Заказ от {getDate(order.createdAt)}</h3>
                      <p className='order__total-price'>{order.totalPrice + order.deliveryPrice} &#8381;</p>
                    </div>
                    <div className='order__body'>
                      <div className='order__main-info'>
                        <p className={`order__status ${getStatusClass(order.orderStatus)}`}>{getStatusName(order.orderStatus)}</p>
                        {order.orderStatus === 4 ? <a href='https://dolina.shop/reviews'><p className='order__status order__review'>Оставить отзыв &#x2661;</p></a> : null}
                        {order.tracking > 0 ? (
                          <p className='order__main-text'>Трек-номер: <span className='order_tracking-number'>{order.tracking}</span></p>
                        ) : null}
                        <p className='order__main-text'>Номер заказа: {order.orderId}</p>
                        <p className='order__main-text'>{getDeliveryTypeName(order.deliveryType)}: {order.deliveryOffice ? order.deliveryOffice : `${order.city + ', ' + order.deliveryAddress}`}</p>
                        {!order.comment ? null : (
                          <p className='order__main-text'>Комментарий к заказу: {order.comment}</p>
                        )}

                        <p className='order__main-text'>Стоимость доставки: {order.deliveryPrice} &#8381;</p>

                        {order.orderStatus === 4
                          ? null
                          : (
                            order.paid === 1 ? (
                              <p className='order_paid'>Оплачен</p>
                            ) : (
                              <>
                                <p className='order_not-paid'>Не оплачен</p>
                                {
                                  (order.orderStatus !== -1 && order.paymentType === 1 && timeLeft[order.orderId] > 0) && (
                                    <div className='order__pay-container'>
                                      <span onClick={() => handlePayClick(order.orderId)} className='orders_pay'>Оплатить</span>
                                      <div className='order__timer'>{formatTime(timeLeft[order.orderId])}</div> {/* Отображаем отформатированное время */}
                                    </div>
                                  )
                                }
                              </>
                            )
                          )}
                      </div>
                      <div className='order__products'>
                        {order.orderedProducts.map((product) => (
                          <div className='order__product-container' key={product.id}>
                            <div className='order_flex_row'>
                              <a href={`${'/product/' + product.slug + '-' + product.productId}`} target="_blank" rel="noreferrer">
                                <img className='order__pic' alt={product.title} src={`https://dolina.shop/photos/${product.path.slice(0, -4) + `_preview.jpg`}`}></img>
                              </a>
                              <div>
                                <a className='cart-product__title' href={`${'/product/' + product.slug + '-' + product.productId}`} target="_blank" rel="noreferrer">
                                  <h3 className='order__product-title'>{product.title}</h3>
                                </a>
                                {product.size > 0 ? <p className='cart-product__size'>Размер: {product.size}</p> : null}
                              </div>
                            </div>
                            <p className='order__product-title'>{product.price} &#8381;</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </li>
                ))
              )
            )
          }
        </ul>
      </main>

      <MobileNavBar
        onBurger={onBurgerClick}
        isBurgerOpen={isBurgerOpen}
        onBurgerClose={onBurgerClose}
        cart={cart}
        orders={orders}
        onCatClick={onCatClick}
        isLoggedIn={isLoggedIn}
      />
    </>
  );
}