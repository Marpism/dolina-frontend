import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function MobileSlider({ pictures }) {

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false,
  }

  return (
    <div>
      <Slider {...settings}>
        {pictures.map((picture, index) => (
          <div key={index}>
            <img className='card__image' src={`https://dolina.shop/photos/${picture.path.slice(0, -5) + `_preview.webp`}`} alt={`Photo ${index}`} />
          </div>
        ))}
      </Slider>
    </div>
  )
}