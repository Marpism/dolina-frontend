import './Product.css';
import { Fragment, useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import { specialTexts } from '../../utils/constants';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import specialCrystal from '../../images/special_crystal.svg';
import specialEye from '../../images/special_eye.svg';
import specialMount2 from '../../images/special_mountains_2.svg';
import specialRefund from '../../images/special_refund.svg';
import GalleryPopup from './GalleryPopup/GalleryPopup';
import MobileGallery from './MobileGallery';
import productsApi from '../../utils/Api';
import UpsellCard from './UpsellCard';
import OneStepPopup from './OneStepPopup/OneStepPopup';
import emptyBack from '../../images/back.png';


export default function Product({ productData, onLikeClick, savedProducts, onAddClick, cart, onCardClick, salePrice, stoneDescriptions }) {

  const navigate = useNavigate();
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    if (productData.sizes) {
      const sortedSizes = [...productData.sizes].sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      setSizes(sortedSizes);
    }
  }, [productData.sizes]);

  useEffect(() => {
    document.title = productData.title + ' — Долина самоцветов';
  }, []);

  const isBigScreen = useMediaQuery({ minWidth: 771 }); // надо бы перенести в константы
  const isSmallScreen = useMediaQuery({ maxWidth: 770 });
  let pictures = productData.pictures;
  let mainPicture = `https://dolina.shop/photos/${pictures[0].path}`;

  const previewContainer = document.querySelector('.gallery__previews');

  const [isPreview, setIsPreview] = useState(emptyBack);
  const [isGalleryPopupOpen, setisGalleryPopupOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [isAdded, setIsAdded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isUpsells, setUpsells] = useState([]);
  const [isInStock, setIsInStock] = useState([]);
  const [isStoneOpen, setIsStoneOpen] = useState(false);
  const [specialText, setSpecialText] = useState('');
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  const { saveCount } = productData;
  const saveCountText = (
    <span>
      В избранном у <span className='saveCount'>{saveCount}</span> {getDeclension(saveCount)}
    </span>
  );

  function getDeclension(number) {
    const lastDigit = number % 10;
    const lastTwoDigits = number % 100;

    if (lastDigit === 1 && lastTwoDigits !== 11) {
      return 'человека';
    }
    return 'человек';
  }

  function handleSpecialClick(text) {
    if (window.yaCounter97575657) {
      window.yaCounter97575657.reachGoal('specialClick');
    }
    setSpecialText(text);
  }

  function closeSpecial() {
    setSpecialText('');
  }

  const stones = () => {
    return productData.tags.map((tag, index) => (
      <span key={tag.termId}>
        <a href={`/catalog?tags=${tag.termId}`} key={tag.termId}>{tag.name}</a>
        {index < productData.tags.length - 1 && ', '}
      </span>
    ))
  };

  const formatTextWithLineBreaks = (text) => {
    return text.split('\n').map((line, index) => (
      <Fragment key={index}>
        {line}
        <br />
      </Fragment>
    ));
  };


  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  useEffect(() => {
    document.documentElement.style.setProperty('--product-color', productData.color);
    pictures = productData.pictures;
    mainPicture = `https://dolina.shop/photos/${pictures[0].path}`; // 
    setIsPreview(mainPicture);

    productsApi.getProductsById([productData.upsells])
      .then((res) => {
        setUpsells(res)
      })
      .catch((err) => console.log(err))


    setIsInStock(productData.inStock);
    setIsStoneOpen(false);
    setSpecialText('');

  }, [productData]);

  useEffect(() => {
    if (cart) { // переделать
      if (savedProducts.includes(productData.productId)) {
        setIsSaved(true);
      } else {
        setIsSaved(false);
      }
    }
  }, [isSaved, savedProducts, productData])

  useEffect(() => {
    if (cart && Object.keys(cart).length > 0) {
      const productIds = Object.keys(cart);
      if (productIds.includes(productData.productId.toString())) {
        setIsAdded(true);
      } else {
        setIsAdded(false);
      }
    }


  }, [isAdded, cart, productData])

  function handleImageClick() {
    setisGalleryPopupOpen(true);
  }

  function handleCloseClick() {
    setisGalleryPopupOpen(false);
  }

  function handleLike() {
    onLikeClick(productData.productId)
  }

  function scrollUp() {
    if (previewContainer) {
      previewContainer.scrollTop = 0;
    }
  }

  function scrollDown() {
    if (previewContainer) {
      previewContainer.scrollTop = previewContainer.scrollHeight;
    }
  }

  function handleSizeChange(e) {
    setSelectedSize(e.target.value);
  };

  function handleAdd(e) {
    e.preventDefault();
    const selectedSizeToSend = sizes.length === 1 ? sizes[0].name : selectedSize;
    onAddClick(productData.productId, 1, selectedSizeToSend);
    setIsAdded(true);
  }

  function handleQuick() {
    setIsOrderOpen(true)
  }


  return (

    <main className='product'>
      <div className='product__container'>

        {isBigScreen && (
          <div className='gallery'>
            <div className='gallery__previews'>
              {pictures.length > 6 && <button type='button' className='product__nav-button product__up-button pointer' onClick={scrollUp} />}
              {pictures.map((picture) => (
                <div className='gallery__preview-container' key={pictures.indexOf(picture)}>
                  <img className={`gallery__preview ${(pictures.indexOf(picture) === 0) && 'gallery_active-border'}`} alt={productData.title || <Skeleton count={10} />} src={`https://dolina.shop/photos/${picture.path.slice(0, -5) + `_preview.webp`}`} onClick={(evt) => {
                    setIsPreview(`https://dolina.shop/photos/${picture.path}`);
                    document.querySelector('.gallery_active-border').classList.remove('gallery_active-border');
                    evt.target.classList.add('gallery_active-border');
                  }}></img>
                </div>
              ))}
              {productData?.videos?.map((video) => (
                <div className='gallery__preview-container' key={productData.videos.indexOf(video)}>

                  <video className={`gallery__preview ${(productData.videos.indexOf(video) === 0) && 'gallery_active-border'}`} alt={productData.title || <Skeleton count={10} />} src={`https://dolina.shop/videos/${video.path}`} onClick={(evt) => {
                    setIsPreview(`https://dolina.shop/videos/${video.path}`);
                    document.querySelector('.gallery_active-border').classList.remove('gallery_active-border');
                    evt.target.classList.add('gallery_active-border');
                  }}></video>

                </div>
              ))}
              {pictures.length > 6 && <button type='button' className='product__nav-button product__down-button pointer' onClick={scrollDown} />}

            </div>
            <div className='gallery__container'>
              <div className='card__image-overlay'></div>
              {isPreview.includes('.mp4') ? (
                <video className='gallery__main-pic gallery__main-video' controls muted autoPlay src={isPreview} alt={productData.title}></video>
              ) : (
                <img className='gallery__main-pic' src={isPreview} alt={productData.title} onClick={handleImageClick} />
              )}
            </div>
          </div>
        )}

        {isSmallScreen && (
          <div className='gallery_mobile' style={{ color: productData.color }}>
            <MobileGallery
              pictures={pictures}
              videos={productData.videos}
              color={productData.color}
              onImageClick={handleImageClick} />
            <button type='button' className={(isSaved ? 'card__save-button card__save-button_active' : 'card__save-button')} onClick={handleLike}></button>
            <div className='card__image-overlay'></div>
          </div>
        )}


        <div className='product_block_2'>

          <section className='main-info_mobile'>
            <h1 className='product__title'>{productData.title}</h1>
            {!salePrice > 0 ?
              <span className='product__price'>{productData.price} &#8381;</span>
              : <div className='sale-container'>
                <span className='product__price product__price_crossed'>{productData.price} &#8381;</span>
                <span className='product__sale-price'>{salePrice} &#8381;</span>
              </div>}
            {isInStock ? (<><span className='instock_mobile'>В наличии {productData.inStock} шт.</span><span className='instock_mobile'>{saveCountText} &#9733;</span></>) : (<span className=''>Товара нет в наличии</span>)}
          </section>

          {sizes.length > 0 ? (
            sizes.length > 1 ? (
              <section className='product__sizes-container'>
                <h2 className='product__subtitle'>Выберите размер:</h2>
                <ul className='sizes'>
                  {sizes.map((size) => (
                    <li className='size-card' key={size.name}>
                      <label htmlFor={size.name} className='size-label'>
                        <input className='size-button' type='radio' name='size' value={size.name} id={size.name} onChange={handleSizeChange} />
                        <div className='size-pseudo-button pointer'>{size.name}</div>
                      </label>
                    </li>
                  ))}
                </ul>
              </section>
            ) : (
              <section className='product__sizes-container'>
                <h2 className='product__subtitle'>Размер:</h2>
                <ul className='sizes'>
                  <li className='size-card'>
                    <label htmlFor={sizes[0].name} className='size-label'>
                      <input className='size-button' type='radio' name='size' value={sizes[0].name} id={sizes[0].name} defaultChecked />
                      <div className='size-pseudo-button pointer'>{sizes[0].name}</div>
                    </label>
                  </li>
                </ul>
              </section>
            )
          ) : null}

          <section className='product__chars-container'>
            <h2 className='product__subtitle'>Характеристики</h2>

            <table className='table'>
              <tbody className='product_font_main'>

                {productData.tags && <tr className='table__unit'>
                  <th className='table_column_left'>Камень</th>
                  <div></div>
                  <td className='table_column_right'>{stones()}</td>
                </tr>}

                {productData.metalType && <tr className='table__unit'>
                  <th className='table_column_left'>Металл</th>
                  <div></div>
                  <td className='table_column_right'>{capitalize(productData.metalType)}</td>
                </tr>
                }
                {productData.weight && <tr className='table__unit'>
                  <th className='table_column_left'>Вес</th>
                  <div></div>
                  <td className='table_column_right'>{productData.weight} гр.</td>
                </tr>}

                {productData.length && <tr className='table__unit'>
                  <th className='table_column_left'>Длина изделия</th>
                  <div></div>
                  <td className='table_column_right'>{productData.length} см.</td>
                </tr>}

                {productData.stoneSize && <tr className='table__unit'>
                  <th className='table_column_left'>Размер камня</th>
                  <div></div>
                  <td className='table_column_right'>{productData.stoneSize}</td>
                </tr>}

                {productData.stoneOrigin && <tr className='table__unit'>
                  <th className='table_column_left'>Происхождение камня</th>
                  <div></div>
                  <td className='table_column_right'>{capitalize(productData.stoneOrigin)}</td>
                </tr>}

                <tr className='table__unit'>
                  <th className='table_column_left'>Производство</th>
                  <div></div>
                  <td className='table_column_right'>{productData.origin || 'Россия'}</td>
                </tr>
                <tr className='table__unit'>
                  <th className='table_column_left'>Артикул</th>
                  <div></div>
                  <td className='table_column_right'>{productData.SKU}</td>
                </tr>
              </tbody>
            </table>
            {isSmallScreen && (<>
              <div className='specials__container'>
                <ul className='specials__list'>

                  <li className='specials__list-item' key='natural-key' onClick={() => handleSpecialClick(specialTexts.natural)}>
                    <div className='specials__cover'>
                      <img className='specials__pic' src={specialMount2}></img>
                    </div>
                    <p className='specials__text'>Природный</p>
                    <p className='specials__text'>камень</p>
                  </li>

                  {productData.masterpiece > 0 && <li className='specials__list-item' key='masterpiece-key' onClick={() => handleSpecialClick(specialTexts.masterpiece)}>
                    <div className='specials__cover' style={{ backgroundColor: '#7044b1' }}>
                      <img className='specials__pic' src={specialCrystal}></img>
                    </div>
                    <p className='specials__text'>Авторское</p>
                    <p className='specials__text'>украшение</p>
                  </li>}

                  {productData.iridescent > 0 && <li className='specials__list-item' key='irid-key' onClick={() => handleSpecialClick(specialTexts.iridiscent)}>
                    <div className='specials__cover' style={{ backgroundColor: 'rgb(131 144 0' }}>
                      <img className='specials__pic' style={{ maxWidth: '35px' }} src={specialEye}></img>
                    </div>
                    <p className='specials__text'>Оптический</p>
                    <p className='specials__text'>эффект</p>
                  </li>}
                  {<li className='specials__list-item' key='ref-key' onClick={() => handleSpecialClick(specialTexts.refund)}>
                    <div className='specials__cover' style={{ backgroundColor: 'rgb(227 135 0)' }}>
                      <img className='specials__pic' style={{ maxWidth: '40px' }} src={specialRefund}></img>
                    </div>
                    <p className='specials__text'>30 дней</p>
                    <p className='specials__text'>на возврат</p>
                  </li>}

                </ul>
                <div className={!specialText ? 'specials__popup' : 'specials__popup specials__popup_open'}>
                  <div className='specials__popup-text'>
                    {specialText}
                    <div className='specials__text' style={{ marginTop: '15px' }} onClick={() => closeSpecial()}>Свернуть</div>
                  </div>
                </div>
              </div>
            </>)}
          </section>
          {isSmallScreen &&
            (<><section className='product__description-container'>
              <h2 className='product__2nd-title'>Описание</h2>
              <p className='product__description product_font_main'>{productData.text}</p>
            </section>
              {stoneDescriptions.map(((stone) => {
                return (
                  <section className='product__description-container'>
                    <h2 className='about-stone__header'>{stone.title}</h2>
                    <p className='about-stone__info'>{`Химическая формула: ${stone.formula}`}</p>
                    <p className='about-stone__info'>{`Твёрдость по шкале Мооса: ${stone.hardness}`}</p>
                    <div className='about-stone__container'>
                      {isStoneOpen ? <div className='about-stone__show-more' onClick={() => setIsStoneOpen(!isStoneOpen)}>Скрыть</div> :
                        <>

                          <div className='about-stone__show-more' onClick={() => setIsStoneOpen(!isStoneOpen)}>Развернуть описание</div>
                          <div className='about-stone__piece'>{`${stone.text.substring(0, 130)}...`}</div>
                        </>
                      }
                      <div className={isStoneOpen ? 'about-stone__texts about-stone__texts_visible' : 'about-stone__texts'}>
                        <p className='about-stone__maintext'>{formatTextWithLineBreaks(stone.text)}</p>
                        {stone.ancient ? <h3 className='about-stone__subheader'>В мировой культуре</h3> : null}
                        <p className='about-stone__maintext'>{formatTextWithLineBreaks(stone.ancient)}</p>
                      </div>
                      <img className='about-stone__pic' alt={stone.title} src={`https://dolina.shop/photos/stones/${stone.mainPicture.slice(0, -4) + `_preview.jpg`}`}></img>

                    </div>


                  </section>
                )
              }))}
            </>)
          }
        </div>

        <div className='product_block_3'>
          <div className=''>
            <form name='product-form' className='product-form'>
              <div className='product-form__heading'>
                <h1 className='product__title'>{productData.title}</h1>
                <button type='button' className={(isSaved ? 'card__save-button card__save-button_active save-button_product' : 'card__save-button save-button_product')} onClick={handleLike}></button>
              </div>

              {!salePrice > 0 ?
                <span className='product__price'>{productData.price} &#8381;</span>
                : <div className='sale-container'>
                  <span className='product__price product__price_crossed'>{productData.price} &#8381;</span>
                  <span className='product__sale-price'>{salePrice} &#8381;</span>
                </div>}

              {isInStock ? (<><span className='instock_pc'>В наличии {productData.inStock} шт.</span><span className='instock_pc'>{saveCountText}  &#9733;</span></>) : (<span className=''>Товара нет в наличии</span>)}

              {isInStock

                ? (!isAdded
                  ? (sizes.length > 1 && !selectedSize
                    ? (<><button type='submit' className='add-button' onClick={handleAdd} disabled>Выберите размер</button>
                      <button type='button' className='onestep-button' onClick={handleQuick}>Заказать в 1 клик</button>
                    </>)
                    : (<><button type='submit' className='add-button' onClick={handleAdd}>В корзину</button>
                      <button type='button' className='onestep-button' onClick={handleQuick}>Заказать в 1 клик</button>
                    </>)
                  )
                  : (<><button type='submit' className='add-button pointer' onClick={() => navigate('/cart')}>В корзине &#x2713;</button>
                    <button type='button' className='onestep-button' onClick={handleQuick}>Заказать в 1 клик</button>
                  </>))

                : (<button type='submit' className='add-button hover_type_normal pointer' disabled>Нет в наличии</button>)
              }

            </form>
            {isSmallScreen && (!isUpsells.length > 0 ? (
              <section className='product__upsells  mobile-margin'>
              </section>
            ) : (
              <section className='product__upsells'>
                <h2 className='product__2nd-title'>Рекомендуем также</h2>
                <ul className='product__upsells_ul'>
                  {isUpsells.filter(product => product?.inStock > 0).map((product) => (
                    <UpsellCard
                      id={product.productId}
                      inStock={product.inStock}
                      slug={product.slug}
                      name={product.title}
                      price={product.price}
                      key={product.productId}
                      onLikeClick={onLikeClick}
                      pictures={product.pictures}
                      savedProducts={savedProducts}
                    ></UpsellCard>
                  ))}
                </ul>

              </section>
            ))}
            <form className='product-form_mobile'>

              {isInStock ? (!isAdded
                ? (sizes.length > 1 && !selectedSize
                  ? <><button type='submit' style={{ backgroundColor: productData.color }} className='add-button hover_type_normal pointer' disabled>Выберите размер</button>
                    <button type='button' className='onestep-button' onClick={handleQuick}>Заказать в 1 клик</button></>
                  : <><button type='submit' style={{ backgroundColor: productData.color }} className='add-button hover_type_normal pointer' onClick={handleAdd}>В корзину</button>
                    <button type='button' className='onestep-button' onClick={handleQuick}>Заказать в 1 клик</button></>)

                : (<><button type='submit' className='add-button hover_type_normal pointer' onClick={() => navigate('/cart')} >В корзине &#x2713;</button>
                  <button type='button' className='onestep-button' onClick={handleQuick}>Заказать в 1 клик</button></>)) : (<button type='submit' className='add-button lonely-button hover_type_normal pointer' onClick={handleAdd} disabled>Нет в наличии</button>)
              }
            </form>
          </div>
          {isBigScreen && (<>
            <div className='specials__container'>
              <ul className='specials__list'>

                <li className='specials__list-item' key='natural-key' onClick={() => handleSpecialClick(specialTexts.natural)}>
                  <div className='specials__cover'>
                    <img className='specials__pic' src={specialMount2}></img>
                  </div>
                  <p className='specials__text'>Природный</p>
                  <p className='specials__text'>камень</p>
                </li>

                {productData.masterpiece > 0 && <li className='specials__list-item' key='masterpiece-key' onClick={() => handleSpecialClick(specialTexts.masterpiece)}>
                  <div className='specials__cover' style={{ backgroundColor: '#7044b1' }}>
                    <img className='specials__pic' src={specialCrystal}></img>
                  </div>
                  <p className='specials__text'>Авторское</p>
                  <p className='specials__text'>украшение</p>
                </li>}

                {productData.iridescent > 0 && <li className='specials__list-item' key='irid-key' onClick={() => handleSpecialClick(specialTexts.iridiscent)}>
                  <div className='specials__cover' style={{ backgroundColor: 'rgb(131 144 0' }}>
                    <img className='specials__pic' style={{ maxWidth: '35px' }} src={specialEye}></img>
                  </div>
                  <p className='specials__text'>Оптический</p>
                  <p className='specials__text'>эффект</p>
                </li>}
                {<li className='specials__list-item' key='ref-key' onClick={() => handleSpecialClick(specialTexts.refund)}>
                  <div className='specials__cover' style={{ backgroundColor: 'rgb(227 135 0)' }}>
                    <img className='specials__pic' style={{ maxWidth: '40px' }} src={specialRefund}></img>
                  </div>
                  <p className='specials__text'>30 дней</p>
                  <p className='specials__text'>на возврат</p>
                </li>}

              </ul>
              <div className={!specialText ? 'specials__popup' : 'specials__popup specials__popup_open'}>
                <div className='specials__popup-text'>
                  {specialText}
                  <div className='specials__text' style={{ marginTop: '15px' }} onClick={() => closeSpecial()}>Свернуть</div>
                </div>
              </div>
            </div>
          </>)}
        </div>
      </div>
      {isBigScreen &&
        (<><section className='product__description-container'>
          <h2 className='product__2nd-title'>Описание</h2>
          <p className='product__description product_font_main'>{productData.text}</p>
        </section>
          {stoneDescriptions.map(((stone) => {
            return (
              <section className='product__description-container'>
                <h2 className='about-stone__header'>{stone.title}</h2>
                <p className='about-stone__info'>{`Химическая формула: ${stone.formula}`}</p>
                <p className='about-stone__info'>{`Твёрдость по шкале Мооса: ${stone.hardness}`}</p>
                <div className='about-stone__container'>
                  <div className='about-stone__texts'>
                    <p className='about-stone__maintext'>{formatTextWithLineBreaks(stone.text)}</p>
                    {stone.ancient ? <h3 className='about-stone__subheader'>В мировой культуре</h3> : null}
                    <p className='about-stone__maintext'>{formatTextWithLineBreaks(stone.ancient)}</p>
                  </div>
                  <img className='about-stone__pic' alt={stone.title} src={`https://dolina.shop/photos/stones/${stone.mainPicture.slice(0, -5) + `_preview.webp`}`}></img>

                </div>
              </section>
            )
          }))}
        </>)
      }
      {isBigScreen && (!isUpsells.length > 0 ? (
        <section style={{ height: '250px' }} className='product__upsells'>
        </section>
      ) : (
        <section className='product__upsells'>
          <h2 className='product__2nd-title'>Рекомендуем также</h2>
          <ul className='product__upsells_ul'>
            {isUpsells.filter(product => product?.inStock > 0).map((product) => (
              <UpsellCard
                id={product.productId}
                inStock={product.inStock}
                slug={product.slug}
                name={product.title}
                price={product.price}
                key={product.productId}
                onCardClick={onCardClick}
                onLikeClick={onLikeClick}
                pictures={product.pictures}
                savedProducts={savedProducts}
              ></UpsellCard>
            ))}
          </ul>

        </section>
      ))}

      <GalleryPopup alt={productData.title} images={pictures} isOpen={isGalleryPopupOpen} onClose={handleCloseClick} />
      <OneStepPopup
        productId={productData.productId}
        cart={cart}
        isOpen={isOrderOpen}
        onClose={() => setIsOrderOpen(false)} />
    </main>


  )
}

// Что в товаре:
// - тайтл +
// - цена +
// - артикул
// - кол-во в наличии +
// - "просматривают"
// - кнопка в корзину +
// - кнопка в избранное +
// - "все товары категории" !
// - "все товары из того-то" !
// - камень +
// - кнопка поделиться !
// - кнопка сообщить об ошибке wb !
// - гарантия возврата
// - приблизительная дата доставки?

// - если кольцо, размеры +
// - страна происхождения камня +
// - металл +
// - страна изготовления +
// - вес +
// - размер кабошона
// - длина изделия +
// - натуральный камень !
// - в единственном экземпляре !