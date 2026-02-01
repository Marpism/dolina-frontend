import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './MainPage.css';
import { useMediaQuery } from 'react-responsive';
import Skeleton from 'react-loading-skeleton';
import ban1 from '../../images/ban1.jpg';
import ban1m from '../../images/ban1_m.jpg';
import ban2 from '../../images/ban2.jpg';
import ban2m from '../../images/ban2_m.jpg';
import ban3 from '../../images/ban3.jpg';
import ban3m from '../../images/ban3_m.jpg';
import ban4 from '../../images/ban4.jpg';
import ban4m from '../../images/ban4_m.jpg';
import ban5 from '../../images/ban5.jpg';
import ban5m from '../../images/ban5_m.jpg';

export default function MainBanner() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
  };

  const isBigScreen = useMediaQuery({ minWidth: 768 }); // надо бы перенести в константы
  const isSmallScreen = useMediaQuery({ maxWidth: 767 });
  const pictures = [ ban1, ban2, ban3, ban4, ban5 ];
  const mobilePictures = [ban1m, ban2m, ban3m, ban4m, ban5m];


  return (
    <>
      {isBigScreen && (!pictures ? <Skeleton height={450} width="100%" /> :
      <div className='main-banner'>
          <Slider {...settings}>
            <div className='main-banner__slide'>
              <a className='main-banner__link' href='/catalog/?masterpiece=1'><img className='main-banner__pic' src={ban1} alt="Slide 1" /></a>
            </div>
            <div className='main-banner__slide'>
              <a className='main-banner__link' href='/catalog/?tags=62'><img className='main-banner__pic' src={ban2} alt="Slide 2" /></a>
            </div>
            <div className='main-banner__slide'>
              <a className='main-banner__link' href='/catalog/?tags=78'><img className='main-banner__pic' src={ban5} alt="Slide 5" /></a>
            </div>
            <div className='main-banner__slide'>
              <a className='main-banner__link' href='/catalog/?tags=58'><img className='main-banner__pic' src={ban3} alt="Slide 3" /></a>
            </div>
            <div className='main-banner__slide'>
              <a className='main-banner__link' href='/catalog/?tags=19'><img className='main-banner__pic' src={ban4} alt="Slide 4" /></a>
            </div>
          </Slider>
        </div> )
        
      }

      {isSmallScreen && (!mobilePictures ? <Skeleton height={230} width="100%" /> : 
        <div className='main-banner'>
          <Slider {...settings}>
            <div className='main-banner__slide'>
              <a className='main-banner__link' href='/catalog/?masterpiece=1'><img className='main-banner__pic' src={ban1m} alt="Slide 1" /></a>
            </div>
            <div className='main-banner__slide'>
              <a className='main-banner__link' href='/catalog/?tags=62'><img className='main-banner__pic' src={ban2m} alt="Slide 2" /></a>
            </div>
            <div className='main-banner__slide'>
              <a className='main-banner__link' href='/catalog/?tags=78'><img className='main-banner__pic' src={ban5m} alt="Slide 5" /></a>
            </div>
            <div className='main-banner__slide'>
              <a className='main-banner__link' href='/catalog/?tags=58'><img className='main-banner__pic' src={ban3m} alt="Slide 3" /></a>
            </div>
            <div className='main-banner__slide'>
              <a className='main-banner__link' href='/catalog/?tags=19'><img className='main-banner__pic' src={ban4m} alt="Slide 4" /></a>
            </div>
          </Slider>
        </div>
      )
        
      }
    </>

  );
}