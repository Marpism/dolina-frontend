import { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function MobileGallery({ pictures, videos, color, onImageClick }) {

  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    arrow: false,
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    beforeChange: (oldIndex, newIndex) => {
      setCurrentSlide(newIndex);
    }
  };

  // Объединяем массивы картинок и видео в один массив медиа-элементов
  const mediaItems = [
    ...pictures.map(picture => ({ type: 'image', src: `https://dolina.shop/photos/${picture.path}` })),
    ...videos.map(video => ({ type: 'video', src: `https://dolina.shop/videos/${video.path}` }))
  ];

  return (
    <div>
      <Slider {...settings}>
        {mediaItems.map((item, index) => (
          <div key={index}>
            {item.type === 'image' ? (
              <img src={item.src} alt={`Photo ${index}`} onClick={onImageClick} />
            ) : (
              <div className='mobile-video-container'>
                <video controls className='gallery_mobile-video' muted autoPlay playsInline>
                  <source src={item.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        ))}
      </Slider>
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
      </div>
    </div>
  );
}
