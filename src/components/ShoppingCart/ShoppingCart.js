import './ShoppingCart.css';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import MobileNavBar from '../MobileNavBar/MobileNavBar';
import CartProduct from './CartProduct/CartProduct';
import productsApi from "../../utils/Api";
import OneStepPopup from '../Product/OneStepPopup/OneStepPopup';

export default function ShoppingCart({ cart, onCardClick, onRemoveClick, savedProducts, onLikeClick, terms, onCatClick, category, onBurgerClick, onBurgerClose, isBurgerOpen, search, setSearch, isLoggedIn }) {

  useEffect(() => {
    document.title = 'Корзина — Долина самоцветов';
  }, []);

  const navigate = useNavigate();

  const [cartProducts, setCartProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalWithDiscount, setTotalWithDiscount] = useState(0);
  const [shopDiscount, setShopDiscount] = useState(0);
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  useEffect(() => {
    if (cart && Object.keys(cart).length > 0) {
      const productIds = Object.keys(cart);
      productsApi.getProductsById([productIds])
        .then((res) => {
          setCartProducts(res)
        })
        .catch((err) => console.log(err))
    } else {
      setCartProducts([]);
    }

  }, [cart]);


  useEffect(() => {
    let sum = 0;
    let withDiscount = 0;

    cartProducts.forEach(product => {
      if (product.inStock > 0) {
        sum += product.price;
        withDiscount += product.salePrice ?? product.price;
      } else {
        sum += 0;
      }
    });
    setTotal(sum);
    setTotalWithDiscount(withDiscount);
    setShopDiscount(sum - withDiscount);


  }, [cartProducts]);


  const isBigScreen = useMediaQuery({ minWidth: 768 }); // надо бы перенести в константы
  const isSmallScreen = useMediaQuery({ maxWidth: 767 });

  function proceedToOrderingPage(event) {
    event.preventDefault();
    if (isLoggedIn) {
      navigate('/ordering')
    } else {
      navigate('/signup')
    }
  }

  return (
    <>
      <main className='cart flex_type_column'>
        <h1 className='cart__header'>Корзина</h1>
        <div className='cart-container_1'>
          <section className='cart__products'>
            <ul className='cart__product-list'>
              {cartProducts.length > 0 ? cartProducts.map((product) => (
                <CartProduct
                  name={product.title}
                  price={product.price}
                  salePrice={product.salePrice ?? 0}
                  onCardClick={onCardClick}
                  id={product.productId}
                  key={product.productId}
                  pictures={product.pictures}
                  sku={product.SKU}
                  cartDetails={cart[product.productId]}
                  onRemoveClick={onRemoveClick}
                  savedProducts={savedProducts}
                  onLikeClick={onLikeClick}
                  inStock={product.inStock}
                />
              )) : <>Корзина пока пустая. Загляните в <a href="/catalog/" style={{ color: 'black' }}>каталог</a>✨</>}
            </ul>
          </section>
          {isBigScreen && (<div className='cart__summary'>
            <form className='cart__form'>
              <h2 className='cart__subheader'>Сумма заказа</h2>
              <div className='cart-container_2'>
                <div className='cart__sum-text'>Товары ({cartProducts.length})</div>
                <div className='cart__sum-text'>{total} &#8381;</div>
              </div>
              {shopDiscount ?
                <div className='cart-container_2'>
                  <div className='cart__sum-text'>Скидка магазина</div>
                  <div className='cart__sum-text'>- {shopDiscount} &#8381;</div>
                </div> : null}

              <div className='cart-container_2'>
                <p className='cart__sum-header'>Итого:</p>
                <div className='cart__sum'>{totalWithDiscount} &#8381;</div>
              </div>
              <p className='cart__sum-caption'>Без учета стоимости доставки</p>
              <button type='submit' onClick={proceedToOrderingPage} name='cart-submit' className='cart__submit-button hover_type_normal pointer' disabled={cartProducts.length == 0 || total === 0}>{cartProducts.length > 0 ? 'Перейти к оформлению' : 'В корзине нет товаров'}</button>
              <button type='button' onClick={setIsOrderOpen} name='cart-onestep' className={cartProducts.length > 0 ? 'cart__onestep-button hover_type_normal pointer' : 'cart__onestep-button_hidden'} disabled={cartProducts.length == 0 || total === 0}>Заказ в 1 клик</button>
            </form>
          </div>
          )}
          {isSmallScreen && (
            <div className='cart__summary'>
              <form className='cart__form'>
                <h2 className='cart__subheader'>Сумма заказа</h2>
                <div className='cart-container_2'>
                  <div className='cart__sum-text'>Товары ({cartProducts.length})</div>
                  <div className='cart__sum-text'>{total} &#8381;</div>
                </div>
                {shopDiscount ?
                  <div className='cart-container_2'>
                    <div className='cart__sum-text'>Скидка магазина</div>
                    <div className='cart__sum-text'>- {shopDiscount} &#8381;</div>
                  </div> : null}

                <div className='cart-container_2'>
                  <p className='cart__sum-header'>Итого:</p>
                  <div className='cart__sum'>{totalWithDiscount} &#8381;</div>
                </div>
                <p className='cart__sum-caption'>Без учета стоимости доставки</p>
                <button type='submit' onClick={proceedToOrderingPage} name='cart-submit' className='cart__submit-button hover_type_normal pointer' disabled={cartProducts.length == 0 || total === 0}>{cartProducts.length > 0 ? 'Перейти к оформлению' : 'В корзине нет товаров'}</button>
                <button type='button' onClick={setIsOrderOpen} name='cart-onestep' className={cartProducts.length > 0 ? 'cart__onestep-button hover_type_normal pointer' : 'cart__onestep-button_hidden'} disabled={cartProducts.length == 0 || total === 0}>Заказать в 1 клик</button>
              </form>
              {/* РЕАЛИЗОВАТЬ ПЛАВАЮЩИЙ-ПРЯЧУЩИЙСЯ КОМПОНЕНТ ПОЗЖЕ */}
            </div>

          )}
        </div>
        <OneStepPopup
          productId={null}
          cart={cart}
          isLoggedIn={isLoggedIn}
          isOpen={isOrderOpen}
          onClose={() => setIsOrderOpen(false)} />
      </main>
      <MobileNavBar
        onBurger={onBurgerClick}
        isBurgerOpen={isBurgerOpen}
        onBurgerClose={onBurgerClose}
        onCatClick={onCatClick}
        cart={cart}
        isLoggedIn={isLoggedIn} />
    </>
  )
}

// Не реализовано:
//  - работа чекбоксов
//  - скидка
//  - глав-чекбокс
//  - кнопки в избранное и удалить