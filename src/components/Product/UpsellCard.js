import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function UpsellCard({ name, price, inStock, onCardClick, onLikeClick, id, slug, pictures, isUnique, savedProducts }) {

  const mainPicture = `https://dolina.shop/photos/${pictures[0].path.slice(0, -5) + `_preview.webp`}`;
  const isBigScreen = useMediaQuery({ minWidth: 771 }); // надо бы перенести в константы
  const isSmallScreen = useMediaQuery({ maxWidth: 770 });
  const [isAvailable, setIsAviable] = useState((inStock > 0 ? true : false));


  function handleLike(e) {
    e.preventDefault();
    onLikeClick(id);
  }

  return (
    <Link to={`${'/product/' + slug + '-' + id}`} style={{ textDecoration: 'none', color: 'black' }}>
      <li className='upsell-card pointer' key={id}>
        {isBigScreen && (!pictures ? (
          <div className='upsell-card__container'>

            <Skeleton height={336} width={200} />
          </div>
        ) : (
          <div className='upsell-card__container'>
            <div className='upsell__image-container'>
              <div className={isAvailable ? 'upsell__sold-label ' : 'upsell__sold-label upsell-label_active '}><p className='upsell__label-font'>Продано</p></div>
              <div className=''>
              </div>
              <button type='button' className={(savedProducts.includes(id) ? 'card__save-button card__save-button_active' : 'card__save-button')} onClick={handleLike}></button>
              <div className='card__image-overlay'></div>
              <img className='upsell-card__image' src={mainPicture} />
            </div>

            <div className='card__description-area'>
              <span className='card__price'>{price} &#8381;</span>
              <h2 className='card__header'>{name}</h2>
            </div>
          </div>
        )

        )}
        {isSmallScreen && (!pictures ? (
          <div className='upsell-card__container'>
            <Skeleton height={265} width={170} />
          </div>
        ) : (
          <div className='upsell-card__container'>
            <div className='upsell__image-container'>
              <div className={isAvailable ? 'upsell__sold-label ' : 'upsell__sold-label upsell-label_active '}><p className='upsell__label-font'>Продано</p></div>
              <div className=''>
              </div>
              <button type='button' className={(savedProducts.includes(id) ? 'card__save-button card__save-button_active' : 'card__save-button')} onClick={handleLike}></button>
              <div className='card__image-overlay'></div>
              <img className='upsell-card__image' src={mainPicture} />
            </div>
            <div className='card__description-area'>
              <span className='card__price'>{price} &#8381;</span>
              <h2 className='card__header'>{name}</h2>
            </div>
          </div>
        )
        )}

      </li>
    </Link>

  )
}