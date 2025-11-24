import './Reviews.css';
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import { useEffect, useState, useContext } from "react";
import checkCircle from '../../images/check-circle-bold.svg';

export default function ReviewsForm({ onsubmit }) {
  const currentUser = useContext(CurrentUserContext);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isReviewFormOpen, setIsReviewIsFormOpen] = useState(false);
  const [isSuccessFormOpen, setIsSuccessFormOpen] = useState(false);

  function handleTitleChange(e) {
    setTitle(e.target.value)
  }

  function handleTextChange(e) {
    setText(e.target.value);
  }

  function handleAuthorChange(e) {
    setAuthor(e.target.value);
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  function handleFormOpening() {
    setIsReviewIsFormOpen(true);
  }

  function openSuccessForm() {
    setIsSuccessFormOpen(true);
  }

  function closeSuccessForm() {
    setIsSuccessFormOpen(false);
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    onsubmit(title, text, author, image);
    setTitle('');
    setText('');
    setAuthor(currentUser ? currentUser.name : '');
    setImage(null);
    setPreview(null);
    setIsReviewIsFormOpen(false);
    setIsSuccessFormOpen(true);
  }

  useEffect(() => {
    if (currentUser) {
      setAuthor(currentUser.name)
    }
  }, [currentUser])

  return (
    <>
      <button type="button" className={isReviewFormOpen || isSuccessFormOpen ? "review__button_hidden" : 'review__button'} onClick={handleFormOpening}>Оставить отзыв</button>
      <div className={isSuccessFormOpen ? "reviews__form-container reviews__success reviews__form-container_active" : 'reviews__form-container '}>
        <h3 className='reviews__success-header'>Ваш отзыв успешно отправлен! <img className='reviews__circle' src={checkCircle}></img></h3>
        <p className='reviews__success-mauntext'>Спасибо, что написали! Уверены, в вашем отзыве нет спама, </p>
        <p className='reviews__success-mauntext'>так что мы его вот-вот опубликуем &#x2661;</p>
        <button type="button" className="review__submit-button" onClick={() => setIsSuccessFormOpen(false)}>Понятно!</button>
      </div>
      <div className={isReviewFormOpen ? "reviews__form-container reviews__form-container_active" : 'reviews__form-container '}>
        <form className="reviews__form" onSubmit={handleFormSubmit}>
          <div className="reviews__form-container_1">
            <div className="reviews__form-container_2 input-width">
              <label htmlFor="title" className='reviews__input-label'>Заголовок отзыва*</label>
              <input
                className="reviews__form-input"
                placeholder="О чём хотите написать? &#x2661;"
                type="text"
                name="title"
                required
                minLength={2}
                onChange={handleTitleChange}
                value={title || ''}
              ></input>
            </div>
            <div className="reviews__form-container_2 input-width">
              <label htmlFor="author" className='reviews__input-label'>Подпись*</label>
              <input
                className="reviews__form-input"
                placeholder="Например, Евгения, Екатеринбург"
                type="text"
                name="author"
                required
                minLength={2}
                onChange={handleAuthorChange}
                value={author || ''}
              ></input>
            </div>

          </div>
          <div className="reviews__form-container_2">
            <label htmlFor="text" className='reviews__input-label' >Текст отзыва*</label>
            <textarea
              className="reviews__form-input_l"
              placeholder="Какие у вас впечатления от наших изделий, нашей работы, общения с нами, от нашего сайта? Нам очень интересно!"
              type="text"
              name="text"
              required
              minLength={5}
              onChange={handleTextChange}
              value={text || ''}
            ></textarea>
          </div>
          <div className="reviews__form-container_1" style={{ marginTop: '25px' }}>
            <div className="reviews__form-container_2">
              <div className='reviews__image-container'>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  className='reviews__image-input'
                  onChange={handleImageChange}
                />

              </div>

              {preview && (
                <div>
                  <img src={preview} alt="Превью фотографии" className="review__preview" />
                </div>
              )}
            </div>

            <button type="submit" className="review__submit-button">Опубликовать</button>
          </div>

        </form>
      </div>
    </>
  )
}