import './Reviews.css';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';

export default function Reviews({ reviews }) {
  const [page, setPage] = useState(1);
  const reviewsPerPage = 15;

  const isBigScreen = useMediaQuery({ minWidth: 771 });
  const isSmallScreen = useMediaQuery({ maxWidth: 770 });

  function getDate(timestamp) {
    return new Date(timestamp * 1000).toLocaleDateString('ru-RU');
  }

  function picturize(pic) {
    return (
      <img className='review__pic' src={`https://dolina.shop/photos/testimonials/${pic}`}></img>
    );
  }

  function loadMoreReviews() {
    setPage(prevPage => prevPage + 1);
  }

  const currentReviews = reviews.slice(0, page * reviewsPerPage);

  return (
    <>
      {isBigScreen && (
        <ul className='reviews-list'>
          {currentReviews.map((review) => (
            <li className='review-item' key={review.id}>
              <div className='review__avatar'>
                <p className='review__avatar-caption'>{review.author.slice(0, 1)}</p>
              </div>
              <div style={{ width: '85%' }}>
                <div className='review__head'>
                  <p className='review__title'>{review.title}</p>
                  <p className='review__date'>{getDate(review.date)}</p>
                </div>
                <p className='review__maintext'>{review.content}</p>
                <p className='review__name'>{review.author}</p>
                {review.image ? picturize(review.image) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
      {isSmallScreen && (
        <ul className='reviews-list'>
          {currentReviews.map((review) => (
            <li className='review-item' key={review.id}>
              <div className='review__avatar'>
                <p className='review__avatar-caption'>{review.author.slice(0, 1)}</p>
              </div>
              <div style={{ width: '100%' }}>
                <div className='review__head'>
                  <p className='review__title'>{review.title}</p>
                  <p className='review__date'>{getDate(review.date)}</p>
                </div>
                <p className='review__maintext'>{review.content}</p>
                <p className='review__name'>{review.author}</p>
                {review.image ? picturize(review.image) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
      {currentReviews.length < reviews.length && (
        <button className='load-more_button' onClick={loadMoreReviews}>Загрузить ещё</button>
      )}
    </>
  );
}