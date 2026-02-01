import './CartProduct.css';
import { useState } from 'react';

export default function CartProduct({ name, price, salePrice, onCardClick, pictures, id, sku, cartDetails, onRemoveClick, savedProducts, onLikeClick, inStock, slug }) {

  const mainPicture = `https://dolina.shop/photos/${pictures[0].path.slice(0, -5) + `_preview.webp`}`;
  const [isChecked, setIsChecked] = useState(true);

  function onLike() {
    onLikeClick(id)
  }

  function onRemove() {
    onRemoveClick(id);
  }

  return (

    <li className='cart-product'>
      <div className='flex_type_row'>
        <a href={`${'/product/' + slug + '-' + id}`} className={(inStock > 0 ? 'cart-product__image-container' : 'cart-product__image-container .cart-product__image-container_nostock')}>
          <div className='card__image-overlay'></div>
          <img className='cart-product__image' src={mainPicture}></img>
        </a>

        <div className='cart-product__info'>
          <a className='cart-product__title' href='#'><h3 className='cart-product__title'>{name}</h3></a>
          {cartDetails && <p className='cart-product__size'>Размер: {cartDetails.size || 1}</p>}
          <p className='cart-product__size'>Артикул: {sku}</p>
          {inStock === 1 && <div className='cart-product__last'>1 штука в наличии</div>}
          <div className='cart-product__buttons'>
            <button type='button' className={(savedProducts.includes(id) ? 'cart-product__button cart-product__like-button_active' : 'cart-product__button cart-product__like-button')} onClick={onLike}></button>

            <button type='button' className='cart-product__button cart-product__delete-button' onClick={onRemove}></button>
          </div>
        </div>

      </div>
      <div className='cart-product__price-container'>
        {
          inStock ?
            salePrice > 0 ?
              <div className='sale-container'>
                <span className='card__price card__price_crossed' style={{ marginTop: '16px' }}>{price} &#8381;</span>
                <span className='card__sale-price'>{salePrice} &#8381;</span>
              </div>
              :
              <span className='card__price' style={{ marginTop: '16px' }}>{price} &#8381;</span>
            :
            <span className='card__price' style={{ color: 'gray', marginTop: '16px', fontSize: '16px' }}>Нет в наличии</span>

        }
      </div>
    </li>
  )
}
