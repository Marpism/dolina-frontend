import './Header.css';
import logo from '../../images/logo.png';
import mobLogo from '../../images/logo_pic.png';
import UsersNavBar from './UsersNavBar/UsersNavbar';
import SearchForm from '../SearchForm/SearchForm';
import { Link, NavLink } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import BurgerMenu from './BurgerMenu/BurgerMenu';
import { useEffect, useState } from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import { HARDCODED_CATEGORIES } from '../../utils/constants';


export default function Header({ terms, onCatClick, activeCategory, isBurgerOpen, onBurgerClose, search, setSearch, cart, orders, productFilters, setProductFilters, isLoggedIn }) {
  const isBigScreen = useMediaQuery({ minWidth: 768 }); // надо бы перенести в константы
  const isSmallScreen = useMediaQuery({ maxWidth: 520 });
  const [cartNumber, setCartNumber] = useState(0);



  const filteredOrders = orders.filter(order => order.orderStatus !== -1 && order.orderStatus !== 4);

  function handleClick(event) {
    event.preventDefault();
    onCatClick(event.target.dataset.id);
  }

  function resetCategory() {
    onCatClick('');
  }

  useEffect(() => {

    if (cart && Object.keys(cart).length > 0) {
      setCartNumber(Object.keys(cart).length);
    } else {
      setCartNumber(0);
    }
  }, [cart]);

  return (
    <>
      {isBigScreen && (<header className="header">
        <div className='header_block_2'>
          <Link to="/">
            <img src={logo} className="logo_theme_light" alt="Логотип" onClick={resetCategory} />
          </Link>
          <UsersNavBar
            ordersNumber={filteredOrders.length}
            cartNumber={cartNumber}
            isLoggedIn={isLoggedIn} />
        </div>
        <nav className='header_block_3'>
          <div className='header__menu'>
            <NavLink to='/catalog/' className='navlink_size_m' onClick={resetCategory}>Каталог</NavLink>
            {
              HARDCODED_CATEGORIES.map((term) => (
                <NavLink to='' className={'navlink_size_m' + (term.termId == productFilters.category ? ' navlink_active' : '')} onClick={handleClick} key={term.termId} data-id={term.termId}>{term.name}</NavLink>
              ))
            }
            <NavLink to='/new' className='navlink_size_m navlink_new' onClick={resetCategory}>Новинки</NavLink>
          </div>
          <section className=''>
            <SearchForm
              search={search}
              setSearch={setSearch}
              productFilters={productFilters}
              setProductFilters={setProductFilters}
            />
          </section>
        </nav>
      </header>)}
      {isSmallScreen && (
        <header className='header_type_mobile'>
          <Link to="/">
            <img src={mobLogo} className="logo_mobile" alt="Логотип" onClick={resetCategory} />
          </Link>
          <SearchForm
            search={search}
            setSearch={setSearch}
            productFilters={productFilters}
            setProductFilters={setProductFilters}
            onBurgerClose={onBurgerClose}
          />
          <BurgerMenu
            isOpen={isBurgerOpen}
            onClose={onBurgerClose}
            terms={terms}
            onCatClick={onCatClick}
            activeCategory={activeCategory}
            search={search}
            setSearch={setSearch}
            productFilters={productFilters}
            setProductFilters={setProductFilters}
          />
        </header>
      )}
    </>
  )
}