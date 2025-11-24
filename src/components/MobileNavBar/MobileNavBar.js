import './MobileNavBar.css';
import { useState, useEffect } from 'react';
import userPic from '../../images/navbar_user.svg';
import bagPic from '../../images/navbar_bag.svg';
import heartPic from '../../images/navbar_heart.svg';
import homePic from '../../images/navbar_home.svg';
import catPic from '../../images/navbar_catalog.svg';
import signupPic from '../../images/navbar_signup.svg';
import { NavLink } from 'react-router-dom';

export default function MobileNavBar({ onBurger, onBurgerClose, cart, orders, onCatClick, isLoggedIn }) {


  const [isCartLabel, setIsCartLabel] = useState(false);
  const [cartNumber, setCartNumber] = useState(0);
  // const [isOrdersLabel, setIsOrdersLabel] = useState(false);

  useEffect(() => {

    if (cart && Object.keys(cart).length > 0) {
      setCartNumber(Object.keys(cart).length);
      setIsCartLabel(true);
    } else {
      setCartNumber(0);
    }
  }, [cart]);

  function resetCategoryAndBurger() {
    onCatClick('');
    onBurgerClose();
  }

  return (
    <div className='mobile-navbar mobile-navbar__active'>
      {isLoggedIn ?
        <nav className='mobile-navbar__container'>
          <NavLink to='/' className='mobile-navbar__item'>
            <img src={homePic} className='mobile-navbar__pic' onClick={resetCategoryAndBurger}></img>
          </NavLink>
          <NavLink className='mobile-navbar__item'>
            <img src={catPic} onClick={onBurger} className='mobile-navbar__pic'></img>
          </NavLink>
          <NavLink to='/cart' className='mobile-navbar__item' onClick={resetCategoryAndBurger}>
            <div className={isCartLabel ? 'label-container_mobile label-mobile-container_active' : 'label-container_mobile'}><span className='label-text'>{cartNumber}</span></div>
            <img src={bagPic} className='mobile-navbar__pic'></img>
          </NavLink>
          <NavLink to='/me/wishlist' className='mobile-navbar__item' onClick={resetCategoryAndBurger}>
            <img src={heartPic} className='mobile-navbar__pic'></img>
          </NavLink>
          <NavLink to='/me' className='mobile-navbar__item' onClick={resetCategoryAndBurger}>
            <img src={userPic} className='mobile-navbar__pic'></img>
          </NavLink>
        </nav> :
        <nav className='mobile-navbar__container'>
          <NavLink to='/' className='mobile-navbar__item'>
            <img src={homePic} className='mobile-navbar__pic' onClick={resetCategoryAndBurger}></img>
          </NavLink>
          <NavLink className='mobile-navbar__item'>
            <img src={catPic} onClick={onBurger} className='mobile-navbar__pic'></img>
          </NavLink>
          <NavLink to='/cart' className='mobile-navbar__item' onClick={resetCategoryAndBurger}>
            <div className={isCartLabel ? 'label-container_mobile label-mobile-container_active' : 'label-container_mobile'}><span className='label-text'>{cartNumber}</span></div>
            <img src={bagPic} className='mobile-navbar__pic'></img>
          </NavLink>
          <NavLink to='/signup' className='mobile-navbar__item' onClick={resetCategoryAndBurger}>
            <img src={signupPic} className='mobile-navbar__pic'></img>
          </NavLink>
        </nav>
      }

    </div>
  )
}