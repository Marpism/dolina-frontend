import './UsersNavBar.css';
import userPic from '../../../images/user.svg';
import bagPic from '../../../images/shopping-bag.svg';
import favPic from '../../../images/heart.svg';
import boxPic from '../../../images/package.svg';
import signupPic from '../../../images/sign-in.svg';
import { Link, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function UsersNavBar({ ordersNumber, cartNumber, isLoggedIn }) {


  const [isCartLabel, setIsCartLabel] = useState(false);
  const [isOrdersLabel, setIsOrdersLabel] = useState(false);

  useEffect(() => {
    if (ordersNumber > 0) {
      setIsOrdersLabel(true);
    }

    if (cartNumber > 0) {
      setIsCartLabel(true);
    }
  }, [ordersNumber, cartNumber]);

  return (
    <>
      {isLoggedIn ?
        <ul className='users-navbar'>
          <li className='users-navbar__item'>
            <NavLink to='/me' className='users-navbar__link'>
              <img className='users-navbar__pic' src={userPic} />
              <span className='users-navbar__text'>Профиль</span>
            </NavLink>
          </li>
          <li className='users-navbar__item'>

            <div className={isOrdersLabel ? 'label-container label-container_active' : 'label-container'}><span className='label-text'>{ordersNumber}</span></div>

            <NavLink to='/me/orders' className='users-navbar__link'>
              <img className='users-navbar__pic' src={boxPic} />
              <span className='users-navbar__text'>Заказы</span>
            </NavLink>
          </li>
          <li className='users-navbar__item'>
            <NavLink to='/me/wishlist' className='users-navbar__link'>
              <img className='users-navbar__pic' src={favPic} />
              <span className='users-navbar__text'>Избранное</span>
            </NavLink>
          </li>
          <li className='users-navbar__item'>

            <div className={isCartLabel ? 'label-container label-container_active' : 'label-container'}><span className='label-text'>{cartNumber}</span></div>

            <NavLink to='/cart' className='users-navbar__link'>
              <img className='users-navbar__pic' src={bagPic} />
              <span className='users-navbar__text'>Корзина</span>
            </NavLink>
          </li>
        </ul> :
        <ul className='users-navbar'>
          <li className='users-navbar__item'>
            <div className={isCartLabel ? 'label-container label-container_active' : 'label-container'}><span className='label-text'>{cartNumber}</span></div>
            <NavLink to='/cart' className='users-navbar__link'>
              <img className='users-navbar__pic' src={bagPic} />
              <span className='users-navbar__text'>Корзина</span>
            </NavLink>
          </li>
          <li className='users-navbar__item'>
            <NavLink to='/signup' className='users-navbar__link'>
              <img className='users-navbar__pic' src={signupPic} />
              <span className='users-navbar__text'>Войти</span>
            </NavLink>
          </li>
        </ul>
      }
    </>
  )
}