import "./Form.css";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { EMAIL_REGEXP } from "../../utils/constants";

export default function ForgotPasswordForm({ onSubmit }) {
  const [email, setEmail] = useState("");
  const [emailValidationError, setEmailValidationError] = useState("");
  const [isSent, setIsSent] = useState(false);
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (EMAIL_REGEXP.test(email)) {
      setEmailValidationError("");
      onSubmit(email);
      setIsSent(true);
    } else {
      setEmailValidationError("Введён некорректный email");
    }
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);

    if (EMAIL_REGEXP.test(e.target.value)) {
      setEmailValidationError("");
    } else {
      setEmailValidationError("Введён некорректный email");
    }
  }

  return (
    <>
      <body className="form-page">
        {isSent ? (
          <div className="success-message">
            Готово! Выслали вам на почту ссылку для изменения пароля.
          </div>
        ) : (
          <div className="form">
            <section className="form__container">
              <form name={`forgot-form`} onSubmit={handleSubmit}>
                <fieldset className="form__fieldset">
                  <h1 className="form__title">Изменение пароля</h1>
                  <label htmlFor="email" className="form__input-label">
                    E-mail
                  </label>
                  <input
                    className="form__input"
                    placeholder="Введите e-mail"
                    type="email"
                    name="email"
                    required
                    minLength={2}
                    maxLength={30}
                    onChange={handleEmailChange}
                    value={email || ""}
                  ></input>
                  <p className="input__error">{emailValidationError}</p>
                  <button
                    type="submit"
                    name="submit"
                    className="form__submit-button hover_type_normal"
                  >
                    Продолжить
                  </button>
                </fieldset>
              </form>
            </section>
            <div id="buttonContainerId"></div>
            <div className="form__go-back" onClick={goBack}>
              &#8656; Назад
            </div>
          </div>
        )}
      </body>
    </>
  );
}

// сделать:
// - чтобы инпут был пустой по клику
// - чтобы лэйблы появлялись после этого
