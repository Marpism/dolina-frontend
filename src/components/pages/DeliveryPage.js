import MobileNavBar from "../MobileNavBar/MobileNavBar";
import './Pages.css';
import { useEffect, useState } from "react";
import cdekLogo from '../../images/CDEK_logo.svg';
import boxberryLogo from '../../images/boxberry.svg';
import postLogo from '../../images/ruspost2.png';
import fivePostLogo from '../../images/5post.svg';
import logo from '../../images/logo_pic.png';
import Api from '../../utils/Api';
import mapPin from '../../images/map-pin.svg';

export default function DeliveryPage({ onBurgerClick, onBurgerClose, isBurgerOpen, orders, cart, onCatClick, isLoggedIn }) {

  useEffect(() => {
    document.title = 'Доставка и оплата — Долина самоцветов';
  }, []);

  const [city, setCity] = useState('');
  const [cityInputValue, setCityInputValue] = useState('');
  const [cities, setCities] = useState([]);
  const [cdekPickupPrice, setCdekPickupPrice] = useState('—');
  const [cdekDeliveryPrice, setCdekDeliveryPrice] = useState('—');
  const [boxberryPickupPrice, setBoxberryPickupPrice] = useState('—');
  const [boxberryDeliveryPrice, setBoxberryDeliveryPrice] = useState('—');
  const [russianPostPickupPrice, setRussianPostPickupPrice] = useState('—');
  const [fivepostPickupPrice, setFivepostPickupPrice] = useState('—');
  const [cdekPickupTime, setCdekPickupTime] = useState('—');
  const [cdekDeliveryTime, setCdekDeliveryTime] = useState('—');
  const [boxberryPickupTime, setBoxberryPickupTime] = useState('—');
  const [boxberryDeliveryTime, setBoxberryDeliveryTime] = useState('—');
  const [russianPostPickupTime, setRussianPostPickupTime] = useState('—');
  const [fivepostPickupTime, setFivepostPickupTime] = useState('—');
  const [cityObject, setCityObject] = useState('');

  function handleCityInput(event) {
    let city = event.target.value;
    setCityInputValue(city);

    if (city.length > 1) {
      Api.getCdekCities(city)
        .then(response => {
          setCities(response);
        })
        .catch(error => {
          console.error('Error fetching cities:', error);
          setCities([]);
        });
    } else {
      setCities([]);
    }
  }

  function handleCitySelect(city) {
    setCityInputValue('');
    setCityObject(city);
    setCities([]);
    setCity(city.city);

    setCdekPickupPrice('—');
    setCdekDeliveryPrice('—');
    setBoxberryPickupPrice('—');
    setBoxberryDeliveryPrice('—');
    setRussianPostPickupPrice('—');
    setCdekPickupTime('—');
    setCdekDeliveryTime('—');
    setBoxberryPickupTime('—');
    setBoxberryDeliveryTime('—');
    setRussianPostPickupTime('—');

    Api.getCdekTariff(city.code)
      .then(response => {
        let cdek_pickup = response.tariff_codes.filter(tariff => tariff.tariff_code === 136)[0];
        let cdek_delivery = response.tariff_codes.filter(tariff => tariff.tariff_code === 137)[0];
        if (cdek_pickup) {
          setCdekPickupPrice(Math.floor(cdek_pickup.delivery_sum * 1.1 / 5) * 5);
          setCdekPickupTime(cdek_pickup.period_min);
        } else {
          setCdekPickupPrice('Недоступен');
          setCdekPickupTime('');
        }

        if (cdek_delivery) {
          setCdekDeliveryPrice(Math.floor(cdek_delivery.delivery_sum * 1.1 / 5) * 5);
          setCdekDeliveryTime(cdek_delivery.period_min);
        } else {
          setCdekDeliveryPrice('Недоступна');
          setCdekDeliveryTime('');
        }

        if (cdek_pickup) {
          setRussianPostPickupPrice(Math.floor((cdek_pickup.delivery_sum * 1.1 - (cdek_pickup.delivery_sum * 1.1 * 0.05)) / 5) * 5);
          setRussianPostPickupTime(cdek_pickup.period_min + 1);
        } else if (cdek_delivery) {
          setRussianPostPickupPrice(Math.floor((cdek_delivery.delivery_sum * 1.1 - (cdek_delivery.delivery_sum * 1.1 * 0.2)) / 5) * 5);
          setRussianPostPickupTime(cdek_delivery.period_min + 2);
        } else {
          // ??
        }
      })
      .catch(error => {
        console.error('Error fetching tariffs:', error);
      });

    if (city.boxberry_city_code) {
      Api.getBoxberryTariff(city.boxberry_city_code)
        .then(response => {
          let boxberry_pickup = response.result.DeliveryCosts.find(cost => cost.DeliveryTypeId === 1);
          let boxberry_delivery = response.result.DeliveryCosts.find(cost => cost.DeliveryTypeId === 2);

          if (boxberry_pickup) {
            setBoxberryPickupPrice(Math.floor(boxberry_pickup.TotalPrice * 1.1 / 5) * 5);
            setBoxberryPickupTime(boxberry_pickup.DeliveryPeriod);
          } else {
            setBoxberryPickupPrice('Недоступен');
            setBoxberryPickupTime('');
          }

          if (boxberry_delivery) {
            setBoxberryDeliveryPrice(Math.floor(boxberry_delivery.TotalPrice * 1.1 / 5) * 5);
            setBoxberryDeliveryTime(boxberry_delivery.DeliveryPeriod);
          } else {
            setBoxberryDeliveryPrice('Недоступна');
            setBoxberryDeliveryTime('');
          }

        })
        .catch(error => {
          console.error('Error fetching tariffs:', error);
        });
    }


    if (city.city) {
      Api.getFivepostTariff(city.city)
        .then(response => {

          if (response.fivepostPickupPrice) {
            setFivepostPickupPrice(response.fivepostPickupPrice);
            setFivepostPickupTime(response.fivepostPickupTime);
          } else {
            setFivepostPickupPrice('Недоступен');
            setFivepostPickupTime('');
          }


        })
        .catch(error => {
          console.error('Error fetching tariffs:', error);
        });
    }
  }

  return (
    <>
      <main className="delivery">
        <h1 className="delivery__main-header">Доставка и оплата</h1>
        <section className="delivery__section">
          <h2 className="delivery__header">Как заказать?</h2>
          <p className="delivery__main-text">Для того, чтобы сделать заказ в Долине самоцветов, необходимо добавить понравившиеся товары в корзину и перейти к оформлению.
            На стадии оформления заказа вам будут предложены варианты доставки и оплаты.</p>

          <p className="delivery__main-text">Если по какой-то причине оформить заказ на сайте не получается, вы можете оформить его по телефону <b>8 800 200 1705</b> в будни с 8.00 до 17.00 по Московскому времени.</p>

          <p className="delivery__main-text">При оформлении заказа по телефону вам понадобятся артикулы выбранных товаров: их можно найти в карточке товара или корзине. </p>
          <p className="delivery__main-text">Мы доставляем заказы в любой уголок России! Упаковываем и отправляем ваш заказ в течение 1-3 рабочих дней. </p>
        </section>
        <section className="delivery__section">
          <h2 className="delivery__header">Доставка</h2>

          <div className="delivery__table_mobile">
            <ul className="delivery__table_ul">


              <div className='delivery-city'>
                <label className='delivery__main-text' htmlFor='cityInput'>Выберите ваш населённый пункт, чтобы увидеть стоимость доставки:</label>
                <input className='delivery-text-input delivery-city-input' type="text" id="cityInput" style={{ maxWidth: '650px', margin: '10px 0 20px 0', boxSizing: 'border-box' }} placeholder='Начните вводить название' value={cityInputValue}
                  onChange={handleCityInput} />
                {cityObject && <div className='selected_city'>
                  <img src={mapPin} className='map-pin' /><b>{cityObject.city}</b> ({cityObject.sub_region}, {cityObject.region})
                </div>}
                {cities.length > 0 && (
                  <div className='city_select'>
                    {cities.map(city => (
                      <span className='city_suggested' key={city.code} onClick={() => handleCitySelect(city)}>
                        <b>{city.city}</b> ({city.sub_region}, {city.region})
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <li className="delivery__table-unit" style={{ backgroundColor: '#e0f2f1' }}>
                <div className="delivery-list-item"><img className='delivery-logo' src={cdekLogo} alt='Пункты СДЭК'></img></div>
                <div className="delivery-time">
                  <p className="delivery-time_font">Самовывоз из пункта</p>
                  <p className="delivery-time_font">от {cdekPickupTime} дней</p>
                </div>
                <p className="delivery__main-text">{cdekPickupPrice} {cdekPickupPrice > 0 && '₽'}</p>
              </li>

              <li className="delivery__table-unit">
                <div className="delivery-list-item"><img className='delivery-logo' src={cdekLogo} alt='Доставка СДЭК'></img></div>
                <div className="delivery-time">
                  <p className="delivery-time_font">Курьерская доставка</p>
                  <p className="delivery-time_font">от {cdekDeliveryTime} дней</p>
                </div>
                <p className="delivery__main-text">{cdekDeliveryPrice} {cdekDeliveryPrice > 0 && '₽'}</p>
              </li>

              <li className="delivery__table-unit" style={{ backgroundColor: '#e0f2f1' }}>
                <div className="delivery-list-item"><img className='delivery-logo' src={boxberryLogo} alt='Пункты Boxberry'></img></div>
                <div className="delivery-time">
                  <p className="delivery-time_font">Самовывоз из пункта</p>
                  <p className="delivery-time_font">от {boxberryPickupTime} дней</p>
                </div>
                <p className="delivery__main-text">{boxberryPickupPrice} {boxberryPickupPrice > 0 && '₽'}</p>
              </li>

              <li className="delivery__table-unit">
                <div className="delivery-list-item"><img className='delivery-logo' src={boxberryLogo} alt='Доставка Boxberry'></img></div>
                <div className="delivery-time">
                  <p className="delivery-time_font">Курьерская доставка</p>
                  <p className="delivery-time_font">от {boxberryDeliveryTime} дней</p>
                </div>
                <p className="delivery__main-text">{boxberryDeliveryPrice} {boxberryDeliveryPrice > 0 && '₽'}</p>
              </li>

              <li className="delivery__table-unit" style={{ backgroundColor: '#e0f2f1' }}>
                <div className="delivery-list-item"><img className='delivery-logo' src={postLogo} style={{ maxHeight: '32px' }} alt='Почта России'></img></div>
                <div className="delivery-time">
                  <p className="delivery-time_font">Посылка</p>
                  <p className="delivery-time_font">от {russianPostPickupTime} дней</p>
                </div>
                <p className="delivery__main-text">{russianPostPickupPrice} {russianPostPickupPrice > 0 && '₽'}</p>
              </li>

              <li className="delivery__table-unit">
                <div className="delivery-list-item"><img className='delivery-logo' src={fivePostLogo} style={{ transform: 'translate(0px, 3px)' }} alt='5POST'></img></div>
                <div className="delivery-time">
                  <p className="delivery-time_font">Доставка в Пятёрочку</p>
                  <p className="delivery-time_font">от {fivepostPickupTime} дней</p>
                </div>
                <p className="delivery__main-text">{fivepostPickupPrice} {fivepostPickupPrice > 0 && '₽'}</p>
              </li>

            </ul>
          </div>
          <p className="delivery__main-text"><b>Скидки на доставку:</b></p>
          <p className="delivery__main-text">При сумме заказа от 2000 &#8381; начинают действовать скидки на цену доставки, а от 5000 &#8381; доставка за наш счет! Скидки автоматически активируются на этапе заказа. </p>
        </section>
        <section className="delivery__section">
          <h2 className="delivery__header">Оплата</h2>
          <p className="delivery__main-text">Оплата на нашем сайте производится по договору с Т-Банком. Вы можете оплатить заказ банковской картой, через СБП или ваше банковское приложение. </p>
          <p className="delivery__main-text">Также вы можете оплатить товар при получении после осмотра и примерки, это возможно при выборе доставки сервисами СДЭК и Boxberry. </p>
          <div className="delivery__notion">
            <p className="delivery__main-text">Важно: при оплате онлайн у нас действует скидка 3% на весь заказ. </p>
          </div>
        </section>
        <section className="delivery__section">
          <h2 className="delivery__header">Обмен и возврат</h2>
          <p className="delivery__main-text">Если вам по тем или иным причинам не подошел приобретенный товар надлежащего качества, вы можете обменять или вернуть его нам без объяснения причин в течение 30 дней с момента покупки. </p>
          <p className="delivery__main-text">Для этого сообщите нам о решении вернуть или обменять товар на почту <b>info@dolina.shop</b> с пометкой “возврат” или “обмен”. </p>

          <p className="delivery__main-text">В случае обмена и возврата товара надлежащего качества, покупателю возмещается только стоимость товара: стоимость доставки оплачивает покупатель. </p>
          <p className="delivery__main-text">Обмен и возврат товара ненадлежащего качества оплачивается за счет продавца. </p>
        </section>

        <section className="delivery__section delivery__link-section">
          <img className="delivery__logo" src={logo} alt="логотип Долина самоцветов"></img>
          <div className="delivery__links">
            <a className="delivery__link" href="https://dolina.shop/about">О нас</a>
            <a className="delivery__link" href="https://dolina.shop/reviews">Отзывы</a>
            <a className="delivery__link" href="https://dolina.shop/contacts">Контакты</a>
          </div>
        </section>

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
  )
}