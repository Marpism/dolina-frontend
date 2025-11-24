import './OneStepPopup.css';
import { useEffect, useState, useContext } from "react";
import { useLocation } from 'react-router-dom';
import { CurrentUserContext } from '../../../contexts/CurrentUserContext';
import usersApi from '../../../utils/UsersApi';
import sparkle from '../../../images/sparkle-success.svg';

export default function OneStepPopup({ cart, productId, isLoggedIn, isOpen, onClose }) {

  const currentUser = useContext(CurrentUserContext);
  const location = useLocation();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setcomment] = useState("");
  const [isConsent, setIsConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);


  function handleOrderSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    const orderData = {
      name: name,
      phone: phone,
      email: currentUser.email,
      comment: comment,
      userId: currentUser.userId,
      cart: cart,
      productId: productId,
    }
    usersApi.addQuickOrder(orderData)
      .then((res) => {
        setOrderId(res.orderId)
        setIsSuccess(true)
        if (window.yaCounter97575657 && typeof window.yaCounter97575657.reachGoal === 'function') {
          window.yaCounter97575657.reachGoal('onestepOrderClick');
        } else {
          console.log('Яндекс.Метрика не загрузилась или недоступна');
        }
      })
      .then(() => {
        if (location.pathname === '/cart') {
          if (isLoggedIn) {
            usersApi.updateCart(JSON.stringify({}))
          }
          localStorage.removeItem('cart');
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  function handleConsent() {
    setIsConsent(!isConsent);
  }

  useEffect(() => {
    setIsSuccess(false);
  }, [productId])


  return (
    <div className={isOpen ? 'onestep-popup_active' : 'onestep-popup'}>
      <div className='onestep__overlay'>
        {isSuccess ?
          <div className='onestep__content'>
            <button onClick={onClose} className="onestep__close-button">
            </button>
            <div className='onestep__success'>
              <p className='onestep__success-text'>Быстрый заказ №{orderId} оформлен успешно! В ближайшее время мы Вам перезвоним! <img style={{ marginLeft: '8px', width: '26px' }} src={sparkle}></img></p>
            </div>
            <p className='onestep__hours'>Часы работы: Пн-Пт 08:00 — 17:00 (по Москве)</p>
          </div>
          : <div className='onestep__content'>
            <button onClick={onClose} className="onestep__close-button">
            </button>
            <h2 className='onestep__header'>Заказ в 1 клик</h2>
            <form className='onestep__form' onSubmit={handleOrderSubmit}>
              <div className='onestep__form-flex'>
                <label htmlFor='phone'>
                  Телефон*
                </label>
                <input className='onestep__input'
                  type="tel"
                  placeholder='Нужен для оформления заказа'
                  name='phone'
                  value={phone || ''}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  minLength={10}
                  maxLength={20}
                />
                {/* <p className='input__error'>{nameValidationError}</p> */}
              </div>
              <div className='onestep__form-flex'>
                <label htmlFor='name'>
                  Имя*
                </label>
                <input className='onestep__input'
                  type="text"
                  name='name'
                  value={name || ''}
                  placeholder='Как к Вам обращаться?'
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={3}
                  maxLength={20}
                />
              </div>
              <div className='onestep__form-flex'>
                <label>
                  Дополнительная информация
                </label>
                <textarea className='onestep__textarea'
                  value={comment || ''}
                  onChange={(e) => setcomment(e.target.value)}
                  placeholder='Например, Ваш город, email'
                  maxLength={100}
                />
              </div>
              <label htmlFor='license' className='callback-label cart__sum-caption' style={{ marginBottom: '0' }}>
                <input type='checkbox' name='license' id='license' className='callback-input' checked={isConsent} onChange={handleConsent}></input>
                Я даю согласие на обработку персональных данных.
              </label>
              <button className={isSubmitting ? 'onestep__submit-button' : 'onestep__submit-button'} type="submit" disabled={!isConsent || isSubmitting}>Заказать</button>
            </form>
          </div>}

      </div>
    </div>
  )
}