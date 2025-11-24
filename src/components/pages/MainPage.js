import Catalog from "../Catalog/Catalog";
import MobileNavBar from '../MobileNavBar/MobileNavBar';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import productsApi from "../../utils/Api";
import MainBanner from "../MainBanner/MainBanner";
import ringIcon from '../../images/icon_ring_1.svg';
import earringIcon from '../../images/icon_ear_1.svg';
import beadsIcon from '../../images/icon_beads1.svg';
import braceletIcon from '../../images/icon_bracelet_1.svg';
import neckIcon from '../../images/icon_neck_2.svg';
import broachIcon from '../../images/icon_broach_3.svg';
import complecticon from '../../images/icon_complect_2.svg';
import pendIcon from '../../images/icon_pend_2.svg';

export default function MainPage({ onCardClick, onLikeClick, products, setProducts, savedProducts, isLoggedIn, terms, onCatClick, category, onBurgerClick, onBurgerClose, isBurgerOpen, search, setSearch, orders, cart, fetchProducts }) {

  const navigate = useNavigate();
  const [selectedProducts, setSelectedproducts] = useState([]);

  useEffect(() => {
    document.title = "Долина самоцветов — украшения с природным камнем родом с Урала"
    productsApi.productsByType('selected')
      .then((products) => {
        setSelectedproducts(products)
      })
      .catch(err => console.log(err));

  }, []);

  function handleButtonClick() {
    onCatClick('');
    navigate('/catalog/');
  }

  return (
    <main className="main-page">
      <MainBanner></MainBanner>
      <nav className="main-categories">
        <h1 className="categories-header">Категории</h1>
        <ul className="categories-list">
          <li className="categories-item">
            <a href='/catalog/?category=44' className="categories-link">
              <div className='category-cover'>
                <img className='category-pic_m' src={earringIcon}></img>
              </div>
              <h2 className='category-title'>Серьги</h2>
            </a>
          </li>
          <li className="categories-item">
            <a href='/catalog/?category=40' className="categories-link">
              <div className='category-cover'>
                <img className='category-pic_xs' src={ringIcon}></img>
              </div>
              <h2 className='category-title'>Кольца</h2>
            </a>
          </li>
          <li className="categories-item">
            <a href='/catalog/?category=6' className="categories-link">
              <div className='category-cover'>
                <img className='category-pic_m' src={beadsIcon}></img>
              </div>
              <h2 className='category-title'>Бусы</h2>
            </a>
          </li>

          <li className="categories-item">
            <a href='/catalog/?category=25' className="categories-link">
              <div className='category-cover'>
                <img className='category-pic_s' src={braceletIcon}></img>
              </div>
              <h2 className='category-title'>Браслеты</h2>
            </a>
          </li>
          <li className="categories-item">
            <a href='/catalog/?category=102' className="categories-link">
              <div className='category-cover'>
                <img className='category-pic_m' src={pendIcon}></img>
              </div>
              <h2 className='category-title'>Подвески</h2>
            </a>
          </li>

          <li className="categories-item">
            <a href='/catalog/?category=28' className="categories-link">
              <div className='category-cover'>
                <img style={{ marginTop: '15px' }} className='category-pic_m' src={neckIcon}></img>
              </div>
              <h2 className='category-title'>Колье</h2>
            </a>
          </li>
          <li className="categories-item">
            <a href='/catalog/?category=167' className="categories-link">
              <div className='category-cover'>
                <img style={{ marginTop: '10px' }} className='category-pic_s' src={complecticon}></img>
              </div>
              <h2 className='category-title'>Комплекты</h2>
            </a>
          </li>
          <li className="categories-item">
            <a href='/catalog/?category=107' className="categories-link">
              <div className='category-cover'>
                <img className='category-pic_s' src={broachIcon} style={{ marginTop: '10px' }}></img>
              </div>
              <h2 className='category-title'>Броши</h2>
            </a>
          </li>
        </ul>
      </nav>
      <h2 className="categories-header">Рекомендуем:</h2>
      <Catalog
        onCardClick={onCardClick}
        onLikeClick={onLikeClick}
        products={selectedProducts}
        setProducts={setProducts}
        savedProducts={savedProducts}
        fetchProducts={fetchProducts} />
      <MobileNavBar
        onBurger={onBurgerClick}
        isBurgerOpen={isBurgerOpen}
        onBurgerClose={onBurgerClose}
        cart={cart}
        onCatClick={onCatClick}
        orders={orders}
        isLoggedIn={isLoggedIn}
      />

      <div className="load-more_button-conainer"><button onClick={handleButtonClick} className="load-more_button">В каталог</button></div>
    </main>
  )
}