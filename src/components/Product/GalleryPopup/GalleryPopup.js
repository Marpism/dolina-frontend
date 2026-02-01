import './GalleryPopup.css';
import closeIcon from '../../../images/x.svg';

export default function GalleryPopup({ images, isOpen, onClose, alt }) {

  return (
    <div className={isOpen ? 'gallery-popup popup_opened' : 'gallery-popup'}>
      <div className='gallery-popup__container'>

        {
          images.map((img) => {
            return (
              <img key={images.indexOf(img)} className='gallery-popup__image' alt={alt} src={`https://dolina.shop/photos/${img.path}`} id={`${'img' + images.indexOf(img)}`}></img>
            )
          })
        }

        <div className='gallery-popup__preview-container'>
          {
            images.map((img) => {
              return (
                <span key={images.indexOf(img)} onClick={(evt) => {
                  document.querySelector('.popup__image_active-border').classList.remove('popup__image_active-border');
                  evt.target.classList.add('popup__image_active-border');
                  document.querySelector('#' + 'img' + images.indexOf(img)).scrollIntoView({ behavior: "smooth" });
                }}>
                  <img alt={alt} className={`gallery-popup__image-preview ${(images.indexOf(img) === 0) && 'popup__image_active-border'}`}
                    src={`https://dolina.shop/photos/${img.path.slice(0, -5) + `_preview.webp`}`}
                  ></img>
                </span>

              )
            })
          }
        </div>

      </div>
      <button type='button' className='close-button'>
        <img className='close-icon' src={closeIcon} onClick={onClose}></img>
      </button>
    </div>
  )
}