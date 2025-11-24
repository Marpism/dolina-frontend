import './Form.css';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";

export default function Form({ title, name, children, buttonText, onSubmit, submitDisabled, isLoggedIn }) {

  const location = useLocation();
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-with-polyfills-latest.js';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.YaAuthSuggest.init(
        {
          client_id: "93da601e53fa40f381846ea4590ab50d",
          response_type: "token",
          redirect_uri: "https://dolina.shop/yandexOauth",
        },
        "https://dolina.shop",
        {
          view: "button",
          parentId: "buttonContainerId",
          buttonSize: 'm',
          buttonView: 'main',
          buttonTheme: 'light',
          buttonBorderRadius: "0",
          buttonIcon: 'ya',
        }
      )
        .then(({ handler }) => handler())
        .then(data => console.log('Сообщение с токеном', data))
        .catch(error => console.log('Обработка ошибки', error));
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  function openOAuthPopup() {
    const width = 600;
    const height = 600;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);
    window.open(
      'https://oauth.yandex.com/authorize?response_type=code&client_id=93da601e53fa40f381846ea4590ab50d&redirect_uri=https://dolina.shop/yandexOauth',
      'YandexOAuth',
      `width=${width},height=${height},top=${top},left=${left}`
    );
  }


  useEffect(() => {
    if (isLoggedIn) window.location.href = 'https://dolina.shop/';
  }, [isLoggedIn]);


  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'jwt') {
        window.location.href = 'https://dolina.shop/';
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  const signupLink = <span className='form__link-caption'>Уже зарегистрированы? <Link className='form__link hover_type_normal' to="/signin">Войти</Link></span>;
  const signinLink = <span className='form__link-caption'>Ещё не зарегистрированы? <Link className='form__link hover_type_normal' to="/signup">Регистрация</Link></span>
  return (
    <>
      <body className='form-page'>
        <div className="form">
          <section className='form__container'>
            <form name={`${name}-form`} onSubmit={onSubmit}>
              <fieldset className="form__fieldset">
                <h1 className="form__title">{title}</h1>
                <p className='form__sub'>Авторизуйтесь в один клик через Яндекс:</p>

                <div id="buttonContainerId" onClick={openOAuthPopup}></div>
                <p className='form__sub'>Или с помощью электронной почты и пароля:</p>

                {children}
                <button type="submit"
                  name="submit"
                  className="form__submit-button hover_type_normal"
                  disabled={submitDisabled}
                >{buttonText || 'Войти'}</button>
              </fieldset>
            </form>
          </section>
          <div className='form__link-toggle'>
            {location.pathname !== '/signin' ?
              signupLink :
              signinLink}
          </div>
          <div id="buttonContainerId"></div>
          <div className='form__go-back' onClick={goBack}>&#8656; Назад</div>
        </div>

      </body>
    </>
  )
}

// сделать:
// - чтобы инпут был пустой по клику
// - чтобы лэйблы появлялись после этого 

