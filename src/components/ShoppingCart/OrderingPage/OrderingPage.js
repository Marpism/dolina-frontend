import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import './OrderingPage.css';
import Api from '../../../utils/Api';
import usersApi from '../../../utils/UsersApi';
import productsApi from "../../../utils/Api";
import logo from '../../../images/logo.png';
import cdekLogo from '../../../images/CDEK_logo.svg';
import boxberryLogo from '../../../images/boxberry.svg';
import postLogo from '../../../images/ruspost2.png';
import fivePostLogo from '../../../images/5post.svg';
import cardPic from '../../../images/credit-card.svg';
import walletPic from '../../../images/wallet.svg';
import clockBold from '../../../images/clock-bold.svg';
import mapPin from '../../../images/map-pin.svg';
import checkMark from '../../../images/check-bold.svg';
import mapLocationDot from '../../../images/map-location-dot.svg';
import listBold from '../../../images/list-bold.svg';
import questionIcon from '../../../images/question-bold.svg';
import { CurrentUserContext } from '../../../contexts/CurrentUserContext';
import YandexMap from '../../Map/Map';

export default function OrderingPage({ cart, isLoggedIn, onCatClick, onUpdateUser }) {

  const currentUser = useContext(CurrentUserContext);
  const navigate = useNavigate();

  function resetCategory() {
    onCatClick('');
  }

  useEffect(() => {
    document.title = 'Оформление заказа — Долина самоцветов';
  }, []);

  const isBigScreen = useMediaQuery({ minWidth: 768 }); // надо бы перенести в константы
  const isSmallScreen = useMediaQuery({ maxWidth: 767 });
  const name = currentUser.name;
  const [cartProducts, setCartProducts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gotEmail, setGotEmail] = useState(!!currentUser.email);
  const [city, setCity] = useState('');
  const [deliveryType, setDeliveryType] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [deliveryOffice, setDeliveryOffice] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [postalCode, setPostalCode] = useState(0);
  const [comment, setComment] = useState('');
  const [callbackNeeded, setCallbackNeeded] = useState(0);
  const [phone, setPhone] = useState('');
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [discountedDeliveryPrice, setDiscountedDeliveryPrice] = useState('');
  const [isConsent, setIsConsent] = useState(true);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState('');
  const [paymentDiscount, setPaymentDiscount] = useState('');
  const [deliveryDiscountIsActive, setDeliveryDiscountIsActive] = useState(false);
  const [cityInputValue, setCityInputValue] = useState('');
  const [cities, setCities] = useState([]);
  const [cdekPickupPrice, setCdekPickupPrice] = useState('-');
  const [cdekDeliveryPrice, setCdekDeliveryPrice] = useState('-');
  const [boxberryPickupPrice, setBoxberryPickupPrice] = useState('-');
  const [boxberryDeliveryPrice, setBoxberryDeliveryPrice] = useState('-');
  const [russianPostPickupPrice, setRussianPostPickupPrice] = useState('-');
  const [fivepostPickupPrice, setFivepostPickupPrice] = useState('-');
  const [cdekPickupTime, setCdekPickupTime] = useState('');
  const [cdekDeliveryTime, setCdekDeliveryTime] = useState('');
  const [boxberryPickupTime, setBoxberryPickupTime] = useState('');
  const [boxberryDeliveryTime, setBoxberryDeliveryTime] = useState('');
  const [russianPostPickupTime, setRussianPostPickupTime] = useState('');
  const [fivepostPickupTime, setFivepostPickupTime] = useState('-');
  const [cityObject, setCityObject] = useState('');
  const [cityCode, setCityCode] = useState('');
  const [boxberryCityCode, setBoxberryCityCode] = useState('');
  const [cityLocation, setCityLocation] = useState('');
  const [deliveryPoints, setDeliveryPoints] = useState([]);
  const [deliveryPointsList, setDeliveryPointsList] = useState([]);
  const [selectedPvz, setSelectedPvz] = useState('');
  const [savedPvz, setSavedPvz] = useState('');
  const [showDeliveryMap, setShowDeliveryMap] = useState(false);
  const [showDeliveryList, setShowDeliveryList] = useState(true);
  const [isAllFilled, setIsAllFilled] = useState(false);
  const [isDeliveryInfo, setisDeliveryInfo] = useState(false);


  function handleDeliveryClick(e) {
    setDeliveryType(Number(e.target.value));
    setDeliveryOffice('');
    setSavedPvz('');
    setSelectedPvz('');
    setDeliveryPoints([]);
    setDeliveryPointsList([]);
  };

  useEffect(() => {
    if ((deliveryType == 1 || deliveryType == 4 || deliveryType == 6) && cityCode > 0) {
      Api.getDeliveryPoints(cityCode, boxberryCityCode, cityObject.city, deliveryType)
        .then((res) => {
          if (res.length > 0) {
            setDeliveryPoints(res);
            setDeliveryPointsList(res);
            setShowDeliveryList(true);
            setShowDeliveryMap(false);
          }
        })
        .catch((err) => console.log(err))
    }


    if (deliveryType == 2) setDeliveryPrice(cdekDeliveryPrice)
    if (deliveryType == 1) setDeliveryPrice(cdekPickupPrice)
    if (deliveryType == 3) setDeliveryPrice(russianPostPickupPrice)
    if (deliveryType == 5) setDeliveryPrice(boxberryDeliveryPrice)
    if (deliveryType == 4) setDeliveryPrice(boxberryPickupPrice)
    if (deliveryType == 6) setDeliveryPrice(fivepostPickupPrice)

    setPaymentType('')

  }, [deliveryType, cityCode])

  function handlePaymentChange(e) {
    setPaymentType(Number(e.target.value));
    if (e.target.value != 3) {
      setDiscount(3);
    } else {
      setDiscount(0);
    }
  }

  useEffect(() => {
    calculateTotal();
  }, [discount, cartProducts, deliveryPrice])


  useEffect(() => {
    if (
      city &&
      deliveryType &&
      paymentType &&
      (deliveryOffice
        || (deliveryType == 2 && deliveryAddress)
        || (deliveryType == 5 && deliveryAddress)
        || (deliveryType == 3 && deliveryAddress && postalCode)) &&
      fullName &&
      phone.length > 9 &&
      cart
    ) {
      setIsAllFilled(true)
    } else {
      setIsAllFilled(false)
    }

  }, [discount,
    cartProducts,
    deliveryType,
    deliveryPrice,
    fullName,
    paymentType,
    phone,
    deliveryAddress,
    deliveryOffice,
    city,
    postalCode])

  useEffect(() => {
    setGotEmail(!!currentUser.email);
  }, [currentUser.email]);

  function handleConsent() {
    setIsConsent(!isConsent);
  }

  useEffect(() => {
    const productIds = Object.keys(cart);
    productsApi.getProductsById([productIds])
      .then((res) => {
        setCartProducts(res);
      })
      .catch((err) => console.log(err))
  }, [cart])

  function handleOrderSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    if (window.yaCounter97575657) {
      window.yaCounter97575657.reachGoal('orderButtonClick');
    }
    let deliveryPriceToSend = deliveryPrice;
    if (deliveryDiscountIsActive) {
      deliveryPriceToSend = discountedDeliveryPrice;
    }
    if (!currentUser.email) {
      onUpdateUser({
        name,
        email
      })
    }

    const orderData = {
      deliveryType: deliveryType,
      paymentType: paymentType,
      deliveryOffice: deliveryOffice,
      city: city,
      deliveryAddress: deliveryAddress,
      deliveryPrice: deliveryPriceToSend,
      postalCode: postalCode,
      fullName: fullName,
      phone: phone,
      comment: comment,
      callbackNeeded: callbackNeeded,
      products: cart,
      discount: discount,
      email: currentUser.email
    }

    usersApi.addOrder(orderData)
      .then((res) => {

        if (isLoggedIn) {
          usersApi.updateCart(JSON.stringify({}))
        }
        localStorage.removeItem('cart');

        setTimeout(() => {
          if (paymentType == 3) {
            navigate('/me/orders/success/' + res.orderId);
          } else {
            window.location.href = res.paymentUrl;
          }
        }, 100);

      })

  }

  function calculateDiscount(costOfDelivery) {
    let discountedPrice;
    let sum = 0;

    cartProducts.forEach(product => {
      sum += product.salePrice ?? product.price;
    });

    if (sum > 1999 && sum < 3000) {
      discountedPrice = Math.ceil(costOfDelivery - (costOfDelivery / 100 * 20));
    } else if (sum > 2999 && sum < 5000) {
      discountedPrice = Math.ceil(costOfDelivery - (costOfDelivery / 100 * 30));
    } else if (sum > 4999) {
      discountedPrice = 0;
    } else {
      discountedPrice = costOfDelivery;
    }

    return discountedPrice;
  }

  function calculateTotal() {
    let sum = 0;

    cartProducts.forEach(product => {
      sum += product.salePrice ?? product.price;
    });

    let discountedPrice = Math.floor(sum - (sum * discount / 100));
    setPaymentDiscount(sum - discountedPrice);

    let temporaryDiscountedPrice = deliveryPrice;
    setDiscountedDeliveryPrice(temporaryDiscountedPrice);

    if (sum > 1999 && sum < 3000) {
      setDeliveryDiscountIsActive(true);
      temporaryDiscountedPrice = Math.ceil(deliveryPrice - (deliveryPrice / 100 * 20));
      setDiscountedDeliveryPrice(temporaryDiscountedPrice)
      setTotal(discountedPrice + temporaryDiscountedPrice);
    } else if (sum > 2999 && sum < 5000) {
      setDeliveryDiscountIsActive(true);
      temporaryDiscountedPrice = Math.ceil(deliveryPrice - (deliveryPrice / 100 * 30));
      setDiscountedDeliveryPrice(temporaryDiscountedPrice)
      setTotal(discountedPrice + temporaryDiscountedPrice);
    } else if (sum > 4999) {
      setDeliveryDiscountIsActive(true);
      temporaryDiscountedPrice = 0;
      setDiscountedDeliveryPrice(temporaryDiscountedPrice);
      setTotal(discountedPrice + temporaryDiscountedPrice);
    } else {
      setDeliveryDiscountIsActive(false);
      setTotal(discountedPrice + deliveryPrice);
    }
  }

  function handleCityInput(event) {
    let city = event.target.value;
    setCityInputValue(city);

    if (city.length > 1) {
      Api.getCdekCities(city)
        .then(response => {
          setCities(response);
        })
        .catch(error => {
          console.error('Error fetching cities:', error);
          setCities([]);
        });
    } else {
      setCities([]);
    }
  }

  function handleCitySelect(city) {
    setCityInputValue('');
    setCityObject(city);
    setCityCode(city.code);
    setBoxberryCityCode(city.boxberry_city_code);
    setCities([]);
    setCity(city.city);

    setCdekPickupPrice('-');
    setCdekDeliveryPrice('-');
    setBoxberryPickupPrice('-');
    setBoxberryDeliveryPrice('-');
    setRussianPostPickupPrice('-');
    setFivepostPickupPrice('-');

    setCdekPickupTime('');
    setCdekDeliveryTime('');
    setBoxberryPickupTime('');
    setBoxberryDeliveryTime('');
    setFivepostPickupTime('');
    setRussianPostPickupTime('');

    Api.getCdekTariff(city.code)
      .then(response => {
        let cdek_pickup = response.tariff_codes.filter(tariff => tariff.tariff_code === 136)[0];
        let cdek_delivery = response.tariff_codes.filter(tariff => tariff.tariff_code === 137)[0];
        if (cdek_pickup) {
          setCdekPickupPrice(Math.floor(cdek_pickup.delivery_sum * 1.1 / 5) * 5);
          setCdekPickupTime(cdek_pickup.period_min);
        } else {
          setCdekPickupPrice('Недоступен');
          setCdekPickupTime('');
        }

        if (cdek_delivery) {
          setCdekDeliveryPrice(Math.floor(cdek_delivery.delivery_sum * 1.1 / 5) * 5);
          setCdekDeliveryTime(cdek_delivery.period_min);
        } else {
          setCdekDeliveryPrice('Недоступна');
          setCdekDeliveryTime('');
        }

        if (cdek_pickup) {
          setRussianPostPickupPrice(Math.floor((cdek_pickup.delivery_sum * 1.1 - (cdek_pickup.delivery_sum * 1.1 * 0.05)) / 5) * 5);
          setRussianPostPickupTime(cdek_pickup.period_min + 1);
        } else if (cdek_delivery) {
          setRussianPostPickupPrice(Math.floor((cdek_delivery.delivery_sum * 1.1 - (cdek_delivery.delivery_sum * 1.1 * 0.2)) / 5) * 5);
          setRussianPostPickupTime(cdek_delivery.period_min + 2);
        } else {
        }
      })
      .catch(error => {
        console.error('Error fetching tariffs:', error);
      });

    if (city.boxberry_city_code) {
      Api.getBoxberryTariff(city.boxberry_city_code)
        .then(response => {
          let boxberry_pickup = response.result.DeliveryCosts.find(cost => cost.DeliveryTypeId === 1);
          let boxberry_delivery = response.result.DeliveryCosts.find(cost => cost.DeliveryTypeId === 2);

          if (boxberry_pickup) {
            setBoxberryPickupPrice(Math.floor(boxberry_pickup.TotalPrice * 1.1 / 5) * 5);
            setBoxberryPickupTime(boxberry_pickup.DeliveryPeriod);
          } else {
            setBoxberryPickupPrice('Недоступен');
            setBoxberryPickupTime('');
          }

          if (boxberry_delivery) {
            setBoxberryDeliveryPrice(Math.floor(boxberry_delivery.TotalPrice * 1.1 / 5) * 5);
            setBoxberryDeliveryTime(boxberry_delivery.DeliveryPeriod);
          } else {
            setBoxberryDeliveryPrice('Недоступна');
            setBoxberryDeliveryTime('');
          }
        })
        .catch(error => {
          console.error('Error fetching tariffs:', error);
        });
    }

    if (city.city) {
      Api.getFivepostTariff(city.city)
        .then(response => {

          if (response.fivepostPickupPrice) {
            setFivepostPickupPrice(response.fivepostPickupPrice);
            setFivepostPickupTime(response.fivepostPickupTime);
          } else {
            setFivepostPickupPrice('Недоступен');
            setFivepostPickupTime('');
          }

        })
        .catch(error => {
          console.error('Error fetching tariffs:', error);
        });
    }
  }

  function handlePlacemarkClick(index) {
    if (showDeliveryList) {
      setSelectedPvz(deliveryPointsList[index]);
    } else {
      setSelectedPvz(deliveryPoints[index]);
    }
  }

  function handlePvzSearch(e) {
    if (deliveryType === 1) {
      setDeliveryPointsList(deliveryPoints.filter(point =>
        point.location.address.toLowerCase().includes(e.target.value.toLowerCase())
      ));
    } else if (deliveryType === 4) {
      setDeliveryPointsList(deliveryPoints.filter(point =>
        point.AddressReduce.toLowerCase().includes(e.target.value.toLowerCase())
      ));
    } else if (deliveryType === 6) {
      setDeliveryPointsList(deliveryPoints.filter(point =>
        point.shortAddress.toLowerCase().includes(e.target.value.toLowerCase())
      ));
    }
  }

  function showDeliveryInfo() {
    setisDeliveryInfo(!isDeliveryInfo)
  }

  function savePvz() {
    setSavedPvz(selectedPvz);
    setShowDeliveryList(false);
    setShowDeliveryMap(false);
    let pvzName;
    if (deliveryType === 1) pvzName = selectedPvz.location.address;
    if (deliveryType === 4) pvzName = selectedPvz.AddressReduce;
    if (deliveryType === 6) pvzName = selectedPvz.shortAddress;
    setDeliveryOffice(pvzName);
  }

  function changePvz() {
    setSelectedPvz('');
    setSavedPvz('');
    setDeliveryOffice('');
    setShowDeliveryList(true);
  }

  const fivepostWorkHours = (workHoursStr) => {
    const workHours = JSON.parse(workHoursStr);

    // Mapping English days to Russian
    const dayMap = {
      MON: 'Пн',
      TUE: 'Вт',
      WED: 'Ср',
      THU: 'Чт',
      FRI: 'Пт',
      SAT: 'Сб',
      SUN: 'Вс',
    };


    const formatTime = (time) => time.substring(0, 5);
    const { day, opensAt, closesAt } = workHours[0];
    return `${formatTime(opensAt)} - ${formatTime(closesAt)}`;

  };

  // Собрать продактс с размером, тотал, скидку

  return (
    <>
      <header>
        <div className='header_block_2'>
          <Link to="/">
            <img src={logo} className="logo_theme_light logo_theme_ordering" alt="Логотип" onClick={resetCategory} />
          </Link>
        </div>
      </header>

      <main className='cart flex_type_column'>
        <h1 className='cart__header'>Оформление заказа</h1>
        <form className='cart-container_1' onSubmit={handleOrderSubmit}>
          <div className='ordering'>
            <div className='ordering__delivery'>
              <div className='delivery-city'>
                <label htmlFor='cityInput'>Ваш населённый пункт:</label>
                <input className='delivery-text-input delivery-city-input' type="text" id="cityInput" placeholder='начните вводить название' value={cityInputValue}
                  onChange={handleCityInput} />
                {cityObject && <div className='selected_city'>
                  <img src={mapPin} className='map-pin' /><b>{cityObject.city}</b> ({cityObject.sub_region}, {cityObject.region})
                </div>}
                {cities.length > 0 && (
                  <div className='city_select'>
                    <h4 style={{ margin: '10px 0' }}>Выберите из списка:</h4>
                    {cities.map(city => (
                      <span className='city_suggested' key={city.code} onClick={() => handleCitySelect(city)}>
                        <b>{city.city}</b> ({city.sub_region}, {city.region})
                      </span>
                    ))}
                  </div>
                )}
              </div>


              {cityCode && <h2 className='ordering__subheader' style={{ paddingTop: '20px', marginBottom: '0' }}>Выберите способ доставки:</h2>}

              {cityCode &&
                <div className='delivery-list'>

                  <div>
                    <input type='radio' name='delivery' value={1} id='d1' className='delivery-radio' onChange={handleDeliveryClick} disabled={!cdekPickupTime}></input>
                    <label className='delivery-label' htmlFor='d1'>
                      <div className={'delivery-list-item' + (!cdekPickupTime ? ' inactive' : '')}>
                        <img className='delivery-logo' src={cdekLogo} alt='Самовывоз СДЭК'></img>
                      </div>
                      {cdekPickupTime && <div className='delivery-time'><p className='delivery-time_font'>Самовывоз из пункта</p><p className='delivery-time_font'>от {cdekPickupTime} дней</p></div>}
                      <div className='delivery-price'>{deliveryDiscountIsActive && cdekPickupPrice > 0 ? <div className='delivery-sale-price__container'><span className='delivery-price_crossed'>{cdekPickupPrice}{cdekPickupPrice > 0 && '₽'}</span><span className='delivery-sale-price'>{calculateDiscount(cdekPickupPrice)} {cdekPickupPrice > 0 && '₽'}</span></div> : <>{cdekPickupPrice} {cdekPickupPrice > 0 && '₽'}</>}</div>
                    </label>
                  </div>

                  <div>
                    <input type='radio' name='delivery' value={2} id='d2' className='delivery-radio' onChange={handleDeliveryClick} disabled={!cdekDeliveryTime}></input>
                    <label className='delivery-label' htmlFor='d2'>
                      <div className={'delivery-list-item' + (!cdekDeliveryTime ? ' inactive' : '')}>
                        <img className='delivery-logo' src={cdekLogo} alt='Курьерская доставка СДЭК'></img>
                      </div>
                      {cdekDeliveryTime && <div className='delivery-time'><p className='delivery-time_font'>Курьерская доставка</p> <p className='delivery-time_font'>от {cdekDeliveryTime} дней</p></div>}
                      <div className='delivery-price'>{deliveryDiscountIsActive && cdekDeliveryPrice > 0 ? <div className='delivery-sale-price__container'><span className='delivery-price_crossed'>{cdekDeliveryPrice}{cdekDeliveryPrice > 0 && '₽'}</span><span className='delivery-sale-price'>{calculateDiscount(cdekDeliveryPrice)} {cdekDeliveryPrice > 0 && '₽'}</span></div> : <>{cdekDeliveryPrice} {cdekDeliveryPrice > 0 && '₽'}</>}</div>
                    </label>
                  </div>

                  <div>
                    <input type='radio' name='delivery' value={6} id='d6' className='delivery-radio' onChange={handleDeliveryClick} disabled={!fivepostPickupTime}></input>
                    <label className='delivery-label' htmlFor='d6'>
                      <div className={'delivery-list-item' + (!fivepostPickupTime ? ' inactive' : '')}>
                        <img style={{ transform: 'translate(0px, 3px)' }} className='delivery-logo' src={fivePostLogo} alt='5post'></img>
                      </div>
                      {fivepostPickupTime && <div className='delivery-time'><p className='delivery-time_font'>Доставка в Пятёрочку</p><p className='delivery-time_font'>от {fivepostPickupTime} дней</p></div>}
                      <div className='delivery-price'>{deliveryDiscountIsActive && fivepostPickupPrice > 0 ? <div className='delivery-sale-price__container'><span className='delivery-price_crossed'>{fivepostPickupPrice}{fivepostPickupPrice > 0 && '₽'}</span><span className='delivery-sale-price'>{calculateDiscount(fivepostPickupPrice)} {fivepostPickupPrice > 0 && '₽'}</span></div> : <>{fivepostPickupPrice} {fivepostPickupPrice > 0 && '₽'}</>}</div>
                    </label>
                  </div>

                  <div>
                    <input type='radio' name='delivery' value={5} id='d5' className='delivery-radio' onChange={handleDeliveryClick} disabled={!boxberryDeliveryTime}></input>
                    <label className='delivery-label' htmlFor='d5'>
                      <div className={'delivery-list-item' + (!boxberryDeliveryTime ? ' inactive' : '')}>
                        <img className='delivery-logo' src={boxberryLogo} alt='Курьерская доставка Boxberry'></img>
                      </div>
                      {boxberryDeliveryTime && <div className='delivery-time'><p className='delivery-time_font'>Курьерская доставка</p><p className='delivery-time_font'>от {boxberryDeliveryTime} дней</p></div>}
                      <div className='delivery-price'>{deliveryDiscountIsActive && boxberryDeliveryPrice > 0 ? <div className='delivery-sale-price__container'><span className='delivery-price_crossed'>{boxberryDeliveryPrice}{boxberryDeliveryPrice > 0 && '₽'}</span><span className='delivery-sale-price'>{calculateDiscount(boxberryDeliveryPrice)} {boxberryDeliveryPrice > 0 && '₽'}</span></div> : <>{boxberryDeliveryPrice} {boxberryDeliveryPrice > 0 && '₽'}</>}</div>
                    </label>
                  </div>

                  <div>
                    <input type='radio' name='delivery' value={4} id='d4' className='delivery-radio' onChange={handleDeliveryClick} disabled={!boxberryPickupTime}></input>
                    <label className='delivery-label' htmlFor='d4'>
                      <div className={'delivery-list-item' + (!boxberryPickupTime ? ' inactive' : '')}>
                        <img className='delivery-logo' src={boxberryLogo} alt='Самовывоз Boxberry'></img>
                      </div>
                      {boxberryPickupTime && <div className='delivery-time'><p className='delivery-time_font'>Самовывоз из пункта</p><p className='delivery-time_font'>от {boxberryPickupTime} дней</p></div>}
                      <div className='delivery-price'>{deliveryDiscountIsActive && boxberryPickupPrice > 0 ? <div className='delivery-sale-price__container'><span className='delivery-price_crossed'>{boxberryPickupPrice}{boxberryPickupPrice > 0 && '₽'}</span><span className='delivery-sale-price'>{calculateDiscount(boxberryPickupPrice)} {boxberryPickupPrice > 0 && '₽'}</span></div> : <>{boxberryPickupPrice} {boxberryPickupPrice > 0 && '₽'}</>}</div>
                    </label>
                  </div>

                  <div>
                    <input type='radio' name='delivery' value={3} id='d3' className='delivery-radio' onChange={handleDeliveryClick} disabled={!russianPostPickupTime}></input>
                    <label className='delivery-label' htmlFor='d3'>
                      <div className={'delivery-list-item' + (!russianPostPickupTime ? ' inactive' : '')}>
                        <img style={{ maxHeight: '32px' }} className='delivery-logo' src={postLogo} alt='Почта России'></img>
                      </div>
                      {russianPostPickupTime && <div className='delivery-time'><p className='delivery-time_font'>Посылка</p><p className='delivery-time_font'>от {russianPostPickupTime} дней</p></div>}
                      <div className='delivery-price'>{deliveryDiscountIsActive && russianPostPickupPrice > 0 ? <div className='delivery-sale-price__container'><span className='delivery-price_crossed'>{russianPostPickupPrice}{russianPostPickupPrice > 0 && '₽'}</span><span className='delivery-sale-price'>{calculateDiscount(russianPostPickupPrice)} {russianPostPickupPrice > 0 && '₽'}</span></div> : <>{russianPostPickupPrice} {russianPostPickupPrice > 0 && '₽'}</>}</div>
                    </label>
                  </div>
                </div>
              }

              {cityCode && deliveryType &&
                <div className='delivery-inputs'>
                  {deliveryType && (deliveryType === 1 || deliveryType === 4 || deliveryType === 6) ? (
                    <div style={{ position: 'relative' }}>
                      {!selectedPvz && <h2 style={{ marginBottom: '20px' }} className='ordering__subheader'>Выберите пункт самовывоза:</h2>}


                      {(showDeliveryMap || showDeliveryList) && !savedPvz && <div className='pvz_toggles_container'><div className='pvz_toggles'>
                        <span className={'pvz_list_toggle' + (showDeliveryList ? ' pvz_list_toggle_active' : '')} onClick={() => { setShowDeliveryMap(false); setShowDeliveryList(true); }}><img src={listBold} /> выбрать из списка</span><span className={'pvz_list_toggle' + (showDeliveryMap ? ' pvz_list_toggle_active' : '')} onClick={() => { setShowDeliveryMap(true); setShowDeliveryList(false); }}><img src={mapLocationDot} /> выбрать на карте</span></div></div>}

                      {deliveryPoints && cityObject && showDeliveryList &&
                        <><input className='pvz-search' type='text' onChange={handlePvzSearch} placeholder='начните вводить улицу'></input><div className='pvz_list'>
                          {deliveryPointsList.map((deliveryPoint, index) => {
                            if (deliveryType === 1) {
                              return (
                                <div className='pvz_list_item hover_type_normal pointer' onClick={() => handlePlacemarkClick(index)} key={deliveryPoint.code}>
                                  {deliveryPoint.location.address}. <b>{deliveryPoint.type === 'PVZ' ? 'Пункт выдачи' : 'Постамат'}</b>
                                </div>
                              );
                            } else if (deliveryType === 4) {
                              return (
                                <div className='pvz_list_item hover_type_special pointer' onClick={() => handlePlacemarkClick(index)} key={deliveryPoint.Code}>
                                  {deliveryPoint.AddressReduce}
                                </div>
                              );
                            } else if (deliveryType === 6) {
                              return (
                                <div className='pvz_list_item hover_type_special pointer' onClick={() => handlePlacemarkClick(index)} key={deliveryPoint.id}>
                                  {deliveryPoint.shortAddress} <b>{deliveryPoint.type != 'POSTAMAT' ? 'Пункт выдачи' : 'Постамат'}</b>
                                </div>
                              );
                            }
                          })}
                          {deliveryPointsList.length == 0 && <div className='pvz_list_item'>Ничего нет! Проверьте, возможно вы опечатались</div>}
                        </div></>}

                      {deliveryPoints && cityObject && showDeliveryMap &&
                        <><YandexMap
                          city={cityObject}
                          deliveryPoints={deliveryPoints}
                          handlePlacemarkClick={handlePlacemarkClick}
                          deliveryType={deliveryType}
                        /></>}
                      {selectedPvz && (
                        <>
                          {deliveryType === 1 && (
                            <div className='selected_pvz'>
                              <span><b>{selectedPvz.type === 'PVZ' ? 'Пункт выдачи СДЭК' : 'Постамат СДЭК'}</b></span>
                              <span>Адрес: {selectedPvz.location.address}</span>
                              {selectedPvz.note && <span>Примечание: {selectedPvz.note}</span>}
                              <span><img src={clockBold} alt="график работы" /> {selectedPvz.work_time}</span>
                              <div className='save_pvz' onClick={selectedPvz.code === savedPvz.code ? changePvz : savePvz}>
                                {selectedPvz.code === savedPvz.code ? 'Изменить пункт' : 'Заберу отсюда'}
                              </div>
                            </div>
                          )}

                          {deliveryType === 4 && (
                            <div className='selected_pvz'>
                              <span><b>Пункт выдачи Boxberry</b></span>
                              <span>Адрес: {selectedPvz.AddressReduce}</span>
                              {selectedPvz.TripDescription && <span>Примечание: {selectedPvz.TripDescription}</span>}
                              <span><img src={clockBold} alt="график работы" /> {selectedPvz.WorkShedule}</span>
                              <div className='save_pvz' onClick={selectedPvz.Code === savedPvz.Code ? changePvz : savePvz}>
                                {selectedPvz.Code === savedPvz.Code ? 'Изменить пункт' : 'Выбрать этот пункт'}
                              </div>
                            </div>
                          )}

                          {deliveryType === 6 && (
                            <div className='selected_pvz'>
                              <span><b>{selectedPvz.type === 'POSTAMAT' ? 'Постамат 5post' : 'Пункт выдачи 5post'}</b></span>
                              <span>Адрес: {selectedPvz.shortAddress}</span>
                              {selectedPvz.additional && <span>Примечание: {selectedPvz.additional}</span>}
                              <span><img src={clockBold} alt="график работы" /> {fivepostWorkHours(selectedPvz.workHours)}</span>
                              <div className='save_pvz' onClick={selectedPvz.id === savedPvz.id ? changePvz : savePvz}>
                                {selectedPvz.id === savedPvz.id ? 'Изменить пункт' : 'Выбрать этот пункт'}
                              </div>
                            </div>
                          )}
                        </>
                      )}

                    </div>
                  ) : (
                    deliveryType === 2 || deliveryType === 5 ? (
                      <>
                        <label htmlFor='deliveryAddress'>Ваш адрес*</label>
                        <input className='delivery-text-input' type="text" id="deliveryAddress" placeholder='Улица, дом, квартира' value={deliveryAddress || ''} onChange={(e) => setDeliveryAddress(e.target.value)} /></>
                    ) : (
                      <>
                        <label htmlFor='postalCode'>Почтовый индекс*</label>
                        <input className='delivery-text-input' type="number" id="postalCode" placeholder='' value={postalCode || ''} onChange={(e) => setPostalCode(e.target.value)} />
                        <label htmlFor='deliveryAddress'>Ваш адрес*</label>
                        <input className='delivery-text-input' type="text" id="deliveryAddress" placeholder='Улица, дом, квартира' value={deliveryAddress || ''} onChange={(e) => setDeliveryAddress(e.target.value)} />
                      </>
                    )
                  )}
                </div>
              }
            </div>
            {cityCode && deliveryType &&
              <div className='ordering__payment'>
                <h2 className='ordering__subheader'>Выберите способ оплаты:</h2>
                <div className='payment-list'>

                  <label className='payment-label' htmlFor='1p'>
                    <input type='radio' name='payment' value={1} id='1p' className='payment-radio' onChange={handlePaymentChange} checked={paymentType === 1}></input>
                    <div className='payment-list-item'>
                      <img className='payment-pic' src={cardPic} alt='Оплата картой любого банка'></img>
                    </div>
                    <p className='payment-caption'>Оплата онлайн <img className='checkmark' src={checkMark} /> <span className='delivery_discount'>-3%</span></p>
                  </label>

                  {(deliveryType === 3 || deliveryType === 6) ? (
                    null
                  ) : (
                    <label htmlFor='3p' className='payment-label'>
                      <input type='radio' name='payment' value={3} id='3p' className='payment-radio' onChange={handlePaymentChange} checked={paymentType === 3}></input>
                      <div className='payment-list-item'>
                        <img className='payment-pic' src={walletPic} alt='Оплата при получении'></img>

                      </div>
                      <p className='payment-caption'>Наложенный платёж <img className='checkmark' src={checkMark} /> </p>
                    </label>
                  )}

                </div>
              </div>
            }

            {cityCode && deliveryType &&
              <div className='ordering__user-info'>
                <h2 className='ordering__subheader'>Последний шаг</h2>
                <div className='info-inputs'>
                  {!gotEmail
                    ? <><label htmlFor='email'>Электронная почта*</label>
                      <input className='delivery-text-input' type="email" id="email" placeholder='' onChange={(e) => setEmail(e.target.value)} value={email || ''} /></> : null}
                  <label htmlFor='fullName'>ФИО получателя*</label>
                  <input className='delivery-text-input' type="name" id="fullName" placeholder='' onChange={(e) => setFullName(e.target.value)} value={fullName || ''} />
                  <label htmlFor='phone'>Телефон*</label>
                  <input className='delivery-text-input' type="tel" id="phone" onChange={(e) => setPhone(e.target.value)} value={phone || '+7'} />
                  <label htmlFor='callback' className='callback-label'>
                    <input type='checkbox' name='callback' id='callback' className='callback-input'></input>
                    Требуется звонок менеджера
                  </label>
                  <br />
                  <label htmlFor='comment'>Комментарий к заказу</label>
                  <textarea className='delivery-text-input delivery-comment-input ' id="comment" placeholder='' onChange={(e) => setComment(e.target.value)} value={comment || ''}></textarea>

                </div>
              </div>
            }

          </div>


          {isBigScreen && (
            <>
              <div className='ordering__summary'>
                <div className='summary__form'>
                  <h2 className='summary__subheader'>Товары</h2>
                  <div className='ordering__products'>
                    {cartProducts.map((product) => (
                      <div className='ordering__product' key={product.productId}>
                        <a href={"/product/" + product.slug + "-" + product.productId} className='' target='_blank'>{product.title}</a>
                        <span className='summary__product-price'>{product.salePrice > 0 ?
                          <div className='sale-container'>
                            <span className='summary__product-price_crossed'>{product.price} &#8381;</span>
                            <span className='summary__product-sale-price'>{product.salePrice} &#8381;</span>
                          </div>
                          :
                          <span className='summary__product-price'>{product.price} &#8381;</span>}</span>
                      </div>
                    ))}
                  </div>
                  <div className='cart-container_2'>
                    <div className='summary-text'>Доставка: <span className={isDeliveryInfo ? 'free-delivery free-delivery_visible' : 'free-delivery'}>
                      <div>
                        -20% при заказе от 2000 &#8381; <br />
                        -30% при заказе от 3000 &#8381; <br />
                        бесплатно при заказе от 5000 &#8381;
                      </div>
                    </span></div>
                    <img onClick={showDeliveryInfo} src={questionIcon} className='summary__delivery-q'></img>

                    {deliveryType != 0 ? <div className='summary-text'>{deliveryDiscountIsActive ? <div className='sale-container'><span style={{ marginRight: '10px' }} className='summary__product-price_crossed'>{deliveryPrice} &#8381;</span><span className='summary__product-sale-price'>{discountedDeliveryPrice} &#8381;</span></div> : <span>{deliveryPrice} &#8381;</span>}
                    </div>
                      : <div className='summary-text'>Не выбрана</div>}
                  </div>
                  <div className='cart-container_2'>
                    <div className='summary-text'>Скидка по предоплате:</div>
                    <div className='summary-text' style={{ fontSize: '16px' }}>- {paymentDiscount} &#8381;</div>
                  </div>
                  <div className='cart-container_2'>
                    <p className='sum-header'>Итого: {total} &#8381;</p>
                  </div>

                  <button type='submit' name='cart-submit' className='ordering__submit-button hover_type_normal pointer' disabled={!isConsent || !isAllFilled || isSubmitting}>{isAllFilled ? (paymentType === 3 ? 'Оформить заказ' : 'Перейти к оплате') : 'Заполните информацию для доставки'}</button>
                  <label htmlFor='license' className='callback-label cart__sum-caption' style={{ marginBottom: '0' }}>
                    <input type='checkbox' name='license' id='license' className='callback-input' checked={isConsent} onChange={handleConsent}></input>
                    Я даю согласие на обработку персональных данных.
                  </label>
                </div>
                <div className='ordering-notion'>
                  <p className='notion-header'>Удобнее по телефону?</p>
                  <p className='notion-header'>8 800 200 17 05</p>
                </div>

              </div>
            </>

          )}



          {isSmallScreen && (
            <>
              <div className='cart__summary'>
                <div className='cart__form'>
                  <h2 className='summary__subheader'>Товары:</h2>
                  <div className='ordering__products'>
                    {cartProducts.map((product) => (
                      <div className='ordering__product' key={product.productId}>
                        <span className=''>{product.title}</span>
                        <span className='summary__product-price'>{product.salePrice > 0 ?
                          <div className='sale-container'>
                            <span className='summary__product-price_crossed'>{product.price} &#8381;</span>
                            <span className='summary__product-sale-price'>{product.salePrice} &#8381;</span>
                          </div>
                          :
                          <span className='summary__product-price'>{product.price} &#8381;</span>}</span>
                      </div>
                    ))}
                  </div>
                  <label htmlFor='license' className='callback-label cart__sum-caption'>
                    <input type='checkbox' name='license' id='license' className='callback-input' checked={isConsent} onChange={handleConsent}></input>
                    Я даю согласие на обработку персональных данных.
                  </label>


                </div>
                <div className='ordering-notion'>
                  <p className='notion-header'>Удобнее по телефону?</p>
                  <p className='notion-header'>8 800 200 17 05</p>
                </div>
              </div>


              <div className='fixed-form'>
                <div style={{ alignItems: 'center' }} className='fixed-form__container'>
                  <div className='summary-text'>Доставка: <span className={isDeliveryInfo ? 'free-delivery free-delivery_visible' : 'free-delivery'}>
                    <div>
                      -20% при заказе от 2000 &#8381; <br />
                      -30% при заказе от 3000 &#8381; <br />
                      бесплатно при заказе от 5000 &#8381;
                    </div>

                  </span></div>
                  <img onClick={showDeliveryInfo} src={questionIcon} className='summary__delivery-q'></img>

                  {deliveryType != 0 ? <div className='summary-text'>{deliveryDiscountIsActive ? <div className='sale-container'><span style={{ marginRight: '10px' }} className='summary__product-price_crossed'>{deliveryPrice} &#8381;</span><span className='summary__product-sale-price'>{discountedDeliveryPrice} &#8381;</span></div> : <span>{deliveryPrice} &#8381;</span>}
                  </div>
                    : <div className='summary-text'>Не выбрана</div>}
                </div>
                {paymentDiscount > 0 && <div className='fixed-form__container'>
                  <div className='summary-text'>Скидка по предоплате:</div>
                  <div className='summary-text'>- {paymentDiscount} &#8381;</div>
                </div>}


                <div className='fixed-form__container'>
                  <p className='sum-header'>Итого: </p>
                  <p className='sum-header'>{total} &#8381;</p>
                </div>
                <div className='fixed-form__container'>
                  <button type='submit' name='cart-submit' style={{ margin: '10px 0 15px 0' }} className='cart__submit-button ordering__submit-button hover_type_normal pointer' disabled={!isConsent || !isAllFilled || isSubmitting}>{isAllFilled ? (paymentType === 3 ? 'Оформить заказ' : 'Перейти к оплате') : 'Заполните информацию для доставки'}</button>
                </div>
              </div>
            </>
          )}
        </form>
      </main>

    </>
  )
}