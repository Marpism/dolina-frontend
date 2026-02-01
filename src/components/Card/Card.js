import './Card.css';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import MobileSlider from './MobileSlider';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';

export default function Card({ name, price, onCardClick, onLikeClick, id, slug, pictures, isUnique, savedProducts, inStock, createdAt, discount, salePrice }) {

  const isBigScreen = useMediaQuery({ minWidth: 771 });
  const isSmallScreen = useMediaQuery({ maxWidth: 770 });


  const mainPicture = `https://dolina.shop/photos/${pictures[0].path.slice(0, -5) + `_preview.webp`}`;
  const [previewPicture, setPreviewPicture] = useState(mainPicture);
  const [isInStock, setIsInStock] = useState((inStock > 0 ? true : false));
  const [isNewLabel, setIsNewLabel] = useState(false);
  const [isSaleLabel, setIsSaleLabel] = useState(false);

  function handleLike(e) {
    e.preventDefault();
    onLikeClick(id);
  }

  useEffect(() => {
    const currentDate = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(currentDate.getMonth() - 2);
    const productDate = new Date(createdAt * 1000);
    if (productDate > oneMonthAgo && isInStock) {
      setIsNewLabel(true);
    }
    if (discount && isInStock) {
      setIsSaleLabel(true);
    }
  }, [createdAt, discount]);

  return (
    <Link className='card pointer' to={`${'/product/' + slug + '-' + id}`} style={{ textDecoration: 'none', color: 'black' }}>
      <li key={id}>
        <div className='card__container'>
          {isBigScreen && (
            !pictures ? (
              <div className='card__image-container' onMouseLeave={() => { setPreviewPicture(mainPicture) }}>
                <Skeleton height={345} width="100%" />
              </div>
            ) : (
              <div className='card__image-container' onMouseLeave={() => { setPreviewPicture(mainPicture) }}>
                <div className={isNewLabel ? `${isSaleLabel ? 'card__new-label label_active label-aside' : 'card__new-label label_active'}` : 'card__new-label'}>
                  <p className='card__new-label_text'>Новинка</p>
                </div>
                <div className={isSaleLabel ? 'card__sale-label label_active' : 'card__sale-label'}>
                  <p className='card__new-label_text'>-{discount}%</p>
                </div>
                <div className={!isInStock ? 'card__sold-label label_active' : 'card__sold-label'}>
                  <p className='card__new-label_text'>Продано</p>
                </div>

                <div className='card__previews'>
                  {pictures.map((pic) => (
                    <div className='card__preview-container' key={pictures.indexOf(pic)}>
                      <div className='card__preview-mark'></div>
                      <img className='card__preview'
                        src={`https://dolina.shop/photos/${pic.path.slice(0, -5) + `_preview.webp`}`}
                        alt={name}
                        onMouseOver={() => {
                          setPreviewPicture(`https://dolina.shop/photos/${pic.path.slice(0, -5) + `_preview.webp`}`)
                        }}
                      ></img>
                    </div>
                  ))}
                </div>
                <button type='button' className={savedProducts.includes(id) ? 'card__save-button card__save-button_active' : 'card__save-button'} onClick={handleLike}></button>
                <div className='card__image-overlay'></div>
                <img className='card__image' src={previewPicture} alt={name} />
              </div>
            )
          )}

          {isSmallScreen && (
            !pictures ? (
              <div className='card__mobile-container'>
                <Skeleton height={225} width="100%" />
              </div>
            ) : (
              <div className='card__mobile-container'>
                <MobileSlider pictures={pictures} />
                <div className={isNewLabel ? 'card__new-label label_active' : 'card__new-label'}>
                  <p className='card__new-label_text'>Новинка</p>
                </div>
                <div className={isSaleLabel ? 'card__sale-label label_active' : 'card__sale-label'}>
                  <p className='card__new-label_text'>-{discount}%</p>
                </div>
                <div className={!isInStock ? 'card__sold-label label_active' : 'card__sold-label'}>
                  <p className='card__new-label_text'>Продано</p>
                </div>
                <div className='card__image-overlay'></div>
                <button type='button' className={(savedProducts.includes(id) ? 'card__save-button card__save-button_active' : 'card__save-button')} onClick={handleLike} onTouchEnd={handleLike}></button>
              </div>
            )
          )}

          {!price ? (
            <div className='card__description-area'>
              <Skeleton height={70} width={270} />
            </div>
          ) : (
            <div className='card__description-area'>
              {
                isInStock ? (!salePrice > 0 ?
                  <span className='card__price'>{price} &#8381;</span>
                  : <div className='sale-container'>
                    <span className='card__price card__price_crossed '>{price} &#8381;</span>
                    <span className='card__sale-price'>{salePrice} &#8381;</span>
                  </div>) : (<span className='card__price' style={{ color: 'gray' }}>{price} &#8381;</span>)
              }
              <h2 className='card__header'>{name}</h2>
            </div>
          )}
        </div>
      </li>
    </Link>

  )
}

